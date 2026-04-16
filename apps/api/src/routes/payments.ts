import { FastifyInstance } from "fastify";
import rawBody from "fastify-raw-body";
import { prisma } from "../db";
import { redactUnknown } from "../lib/redact";
import { applyPaymentSuccess } from "../services/paymentApplyService";
import { isPaystackConfigured, paystackVerifyTransaction, verifyPaystackSignature } from "../services/paystackService";

export async function paymentRoutes(app: FastifyInstance) {
  await app.register(rawBody, {
    field: "rawBody",
    global: false,
    encoding: "utf8",
    runFirst: true,
  });

  app.get<{ Querystring: { reference?: string } }>(
    "/payments/paystack/verify",
    async (request, reply) => {
      const reference = request.query.reference;
      if (!reference) {
        return reply.status(400).send({ error: "reference required" });
      }
      if (!isPaystackConfigured()) {
        return reply.status(503).send({ error: "Payments not configured" });
      }

      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: { order: true },
      });
      if (!payment) {
        return reply.status(404).send({ error: "Payment not found" });
      }

      const verified = await paystackVerifyTransaction(reference);
      if (verified.status !== "success") {
        return reply.status(400).send({ error: "Payment not successful", status: verified.status });
      }

      const idempotencyKey = `verify:${reference}`;
      await applyPaymentSuccess({
        orderId: payment.orderId,
        reference,
        idempotencyKey,
        eventType: "paystack.verify",
        payload: redactUnknown(verified) as object,
      });

      const fresh = await prisma.order.findUnique({
        where: { id: payment.orderId },
        select: { id: true, status: true, paymentStatus: true },
      });

      return reply.send({
        ok: true,
        orderId: payment.orderId,
        status: fresh?.status ?? payment.order.status,
        paymentStatus: fresh?.paymentStatus ?? payment.order.paymentStatus,
      });
    }
  );

  app.post(
    "/payments/paystack/webhook",
    {
      config: {
        rawBody: true,
      },
    },
    async (request, reply) => {
      const raw = (request as { rawBody?: string }).rawBody ?? "";
      const sig = request.headers["x-paystack-signature"] as string | undefined;
      if (!verifyPaystackSignature(raw, sig)) {
        return reply.status(400).send({ error: "Invalid signature" });
      }

      let body: { event?: string; data?: { reference?: string; id?: number; metadata?: { orderId?: string } } };
      try {
        body = JSON.parse(raw) as typeof body;
      } catch {
        return reply.status(400).send({ error: "Invalid JSON" });
      }

      const event = body.event;
      const reference = body.data?.reference;
      const orderIdMeta = body.data?.metadata?.orderId;
      if (event !== "charge.success" || !reference) {
        return reply.send({ received: true });
      }

      let orderId = orderIdMeta;
      if (!orderId) {
        const pay = await prisma.payment.findUnique({ where: { reference } });
        orderId = pay?.orderId;
      }
      if (!orderId) {
        request.log.warn({ reference }, "Paystack webhook: order not found for reference");
        return reply.send({ received: false });
      }

      const idempotencyKey = `wh:${body.data?.id ?? reference}:${event}`;
      await applyPaymentSuccess({
        orderId,
        reference,
        idempotencyKey,
        eventType: event,
        payload: redactUnknown(body) as object,
      });

      return reply.send({ received: true });
    }
  );
}
