import { FastifyInstance } from "fastify";
import {
  adminOrderPatchSchema,
  adminStockPatchSchema,
  pomApprovalSchema,
  staffLoginSchema,
} from "@lenus/shared";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { notifyOrderStatusChange } from "../services/notificationService";

type StaffRole = "admin" | "staff" | "pharmacist";

function assertRole(role: string, allowed: StaffRole[]): void {
  if (!allowed.includes(role as StaffRole)) {
    const err = new Error("Forbidden");
    (err as { statusCode?: number }).statusCode = 403;
    throw err;
  }
}

export async function adminRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const parsed = staffLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;
    const staff = await prisma.staffUser.findUnique({ where: { email: email.toLowerCase() } });
    if (!staff || !bcrypt.compareSync(password, staff.passwordHash)) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    const token = app.jwt.sign({
      sub: staff.id,
      role: staff.role,
      email: staff.email,
      name: staff.name,
    });
    return reply.send({
      token,
      user: { id: staff.id, email: staff.email, role: staff.role, name: staff.name },
    });
  });

  await app.register(async (protectedInstance) => {
    protectedInstance.addHook("onRequest", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    });

    protectedInstance.get("/orders", async (request, reply) => {
      const q = request.query as { status?: string };
      const orders = await prisma.order.findMany({
        where: q.status ? { status: q.status } : undefined,
        orderBy: { createdAt: "desc" },
        take: 200,
        include: {
          branch: true,
          items: { include: { product: true } },
        },
      });
      return reply.send(orders);
    });

    protectedInstance.get<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
      const order = await prisma.order.findUnique({
        where: { id: request.params.id },
        include: {
          branch: true,
          items: { include: { product: true } },
          pomApprovals: { include: { pharmacist: true } },
          payments: true,
        },
      });
      if (!order) return reply.status(404).send({ error: "Not found" });
      return reply.send(order);
    });

    protectedInstance.patch<{ Params: { id: string } }>("/orders/:id", async (request, reply) => {
      const user = request.user as { role: string };
      assertRole(user.role, ["admin", "staff"]);

      const parsed = adminOrderPatchSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
      }
      const body = parsed.data;
      const order = await prisma.order.update({
        where: { id: request.params.id },
        data: {
          ...(body.status && { status: body.status }),
          ...(body.branchId && { branchId: body.branchId }),
        },
        include: { items: true, branch: true },
      });
      await notifyOrderStatusChange(order.id, order.status, order.guestPhone);
      return reply.send(order);
    });

    protectedInstance.post<{ Params: { id: string } }>(
      "/orders/:id/pom-approval",
      async (request, reply) => {
        const user = request.user as { sub: string; role: string };
        assertRole(user.role, ["admin", "pharmacist"]);

        const parsed = pomApprovalSchema.safeParse(request.body);
        if (!parsed.success) {
          return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
        }

        const order = await prisma.order.findUnique({
          where: { id: request.params.id },
          include: { items: { include: { product: true } } },
        });
        if (!order) return reply.status(404).send({ error: "Not found" });
        const hasPom = order.items.some((i) => i.product.type === "POM");
        if (!hasPom) {
          return reply.status(400).send({ error: "Order has no POM items" });
        }
        if (order.paymentStatus !== "paid") {
          return reply.status(400).send({ error: "Order must be paid before pharmacist approval" });
        }

        await prisma.pomApproval.create({
          data: {
            orderId: order.id,
            pharmacistId: user.sub,
            decision: parsed.data.decision,
            notes: parsed.data.notes ?? null,
          },
        });

        const nextStatus =
          parsed.data.decision === "approved" ? "processing" : "pharmacist_rejected";

        const updated = await prisma.order.update({
          where: { id: order.id },
          data: { status: nextStatus },
        });
        await notifyOrderStatusChange(updated.id, updated.status, updated.guestPhone);
        return reply.send(updated);
      }
    );

    protectedInstance.get("/products", async (request, reply) => {
      const q = request.query as { q?: string; category?: string; type?: string };
      const products = await prisma.product.findMany({
        where: {
          ...(q.q
            ? {
                OR: [
                  { name: { contains: q.q, mode: "insensitive" } },
                  { category: { contains: q.q, mode: "insensitive" } },
                ],
              }
            : {}),
          ...(q.category ? { category: q.category } : {}),
          ...(q.type ? { type: q.type } : {}),
        },
        orderBy: { name: "asc" },
        take: 500,
      });
      return reply.send(products);
    });

    protectedInstance.patch<{ Params: { id: string } }>("/products/:id/stock", async (request, reply) => {
      const user = request.user as { role: string };
      assertRole(user.role, ["admin", "staff"]);

      const parsed = adminStockPatchSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid body", details: parsed.error.flatten() });
      }
      const product = await prisma.product.update({
        where: { id: request.params.id },
        data: { stock: parsed.data.stock },
      });
      return reply.send(product);
    });

    protectedInstance.get("/products/low-stock", async (_request, reply) => {
      const threshold = Number(process.env.LOW_STOCK_THRESHOLD ?? "10");
      const products = await prisma.product.findMany({
        where: {
          stock: { lte: threshold, not: null },
        },
        orderBy: { stock: "asc" },
        take: 100,
      });
      return reply.send({ threshold, products });
    });

    protectedInstance.get("/reports/summary", async (request, reply) => {
      const user = request.user as { role: string };
      assertRole(user.role, ["admin", "staff", "pharmacist"]);

      const q = request.query as { from?: string; to?: string };
      const from = q.from ? new Date(q.from) : new Date(Date.now() - 7 * 86400000);
      const to = q.to ? new Date(q.to) : new Date();

      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { items: true },
      });

      const paid = orders.filter((o) => o.paymentStatus === "paid");
      const revenue = paid.reduce((sum, o) => {
        const line = o.items.reduce((s, i) => s + Number(i.priceAtOrder) * i.quantity, 0);
        const fee = o.deliveryFee != null ? Number(o.deliveryFee) : 0;
        return sum + line + fee;
      }, 0);

      return reply.send({
        from,
        to,
        orderCount: orders.length,
        paidCount: paid.length,
        revenueGhs: Math.round(revenue * 100) / 100,
        pendingPayment: orders.filter((o) => o.status === "pending_payment").length,
        awaitingPharmacist: orders.filter((o) => o.status === "awaiting_pharmacist").length,
      });
    });
  });
}
