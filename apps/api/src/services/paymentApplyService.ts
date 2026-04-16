import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { notifyOrderStatusChange } from "./notificationService";

/**
 * Idempotently mark an order paid, deduct stock, and advance fulfillment status.
 */
export async function applyPaymentSuccess(params: {
  orderId: string;
  reference: string;
  idempotencyKey: string;
  eventType: string;
  payload: Prisma.InputJsonValue;
}): Promise<{ alreadyApplied: boolean }> {
  const existing = await prisma.paymentEvent.findUnique({
    where: { idempotencyKey: params.idempotencyKey },
  });
  if (existing) {
    return { alreadyApplied: true };
  }

  let shouldNotify = false;
  let notifyPhone = "";
  let notifyId = "";

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: params.orderId },
      include: { items: true },
    });
    if (!order) throw new Error("Order not found");

    const payment = await tx.payment.findUnique({
      where: { reference: params.reference },
    });

    if (order.paymentStatus === "paid") {
      await tx.paymentEvent.create({
        data: {
          orderId: params.orderId,
          paymentId: payment?.id,
          eventType: params.eventType,
          idempotencyKey: params.idempotencyKey,
          payload: params.payload,
        },
      });
      return;
    }

    const hasPom = await tx.orderItem.findFirst({
      where: {
        orderId: params.orderId,
        product: { type: "POM" },
      },
    });

    const nextStatus = hasPom ? "awaiting_pharmacist" : "processing";

    if (payment) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "success", paidAt: new Date() },
      });
    }

    await tx.order.update({
      where: { id: params.orderId },
      data: {
        paymentStatus: "paid",
        status: nextStatus,
        paystackReference: params.reference,
      },
    });

    for (const item of order.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (product?.stock != null) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    await tx.paymentEvent.create({
      data: {
        orderId: params.orderId,
        paymentId: payment?.id,
        eventType: params.eventType,
        idempotencyKey: params.idempotencyKey,
        payload: params.payload,
      },
    });

    shouldNotify = true;
    notifyPhone = order.guestPhone;
    notifyId = order.id;
  });

  if (shouldNotify) {
    const updated = await prisma.order.findUnique({ where: { id: notifyId } });
    if (updated) {
      await notifyOrderStatusChange(updated.id, updated.status, notifyPhone);
    }
  }

  return { alreadyApplied: false };
}
