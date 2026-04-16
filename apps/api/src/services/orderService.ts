import { createOrderSchema, type CreateOrderInput, resolveDeliveryFeeGhs } from "@lenus/shared";
import { prisma } from "../db";
import { isPaystackConfigured, paystackInitializeTransaction } from "./paystackService";

function guestEmailForPaystack(email: string | undefined, phone: string): string {
  if (email && email.includes("@")) return email;
  const digits = phone.replace(/\D/g, "").slice(-9);
  return `guest.${digits}@checkout.lenus.invalid`;
}

function publicAppUrl(): string {
  const url = process.env.APP_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export async function createOrder(payload: unknown) {
  const parsed = createOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten() };
  }
  const data = parsed.data as CreateOrderInput;

  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  if (products.length !== productIds.length) {
    return { success: false as const, error: "One or more products not found" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  for (const item of data.items) {
    const p = productMap.get(item.productId);
    if (!p) return { success: false as const, error: "Product not found" };
    if (p.stock != null && p.stock < item.quantity) {
      return {
        success: false as const,
        error: `Insufficient stock for ${p.name}`,
      };
    }
    subtotal += Number(p.price) * item.quantity;
  }

  const deliveryFee = resolveDeliveryFeeGhs(data.region);
  const total = subtotal + deliveryFee;
  const amountPesewas = Math.round(total * 100);

  const defaultBranch = await prisma.branch.findFirst();
  if (!defaultBranch) {
    return { success: false as const, error: "No branch configured" };
  }

  const order = await prisma.order.create({
    data: {
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      guestEmail: data.guestEmail || null,
      ghanaPostGps: data.ghanaPostGps,
      addressLine1: data.addressLine1,
      area: data.area,
      region: data.region,
      consentDataProcessing: data.consentDataProcessing,
      status: "pending_payment",
      paymentStatus: "pending",
      deliveryFee,
      branchId: defaultBranch.id,
      items: {
        create: data.items.map((item) => {
          const p = productMap.get(item.productId)!;
          return {
            productId: p.id,
            quantity: item.quantity,
            priceAtOrder: p.price,
          };
        }),
      },
    },
    include: { items: true },
  });

  let paystackAuthorizationUrl: string | null = null;

  if (isPaystackConfigured()) {
    const reference = `lenus_${order.id}`;
    await prisma.payment.create({
      data: {
        orderId: order.id,
        reference,
        amount: amountPesewas,
        currency: "GHS",
        status: "pending",
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { paystackReference: reference },
    });

    try {
      const init = await paystackInitializeTransaction({
        email: guestEmailForPaystack(data.guestEmail, data.guestPhone),
        amountPesewas,
        reference,
        callbackUrl: `${publicAppUrl()}/checkout/complete`,
        metadata: { orderId: order.id },
      });
      paystackAuthorizationUrl = init.authorizationUrl;
      await prisma.payment.update({
        where: { reference },
        data: { accessCode: init.accessCode },
      });
    } catch (e) {
      console.error("Paystack initialize error:", e);
      return {
        success: false as const,
        error: "Payment initialization failed. Please try again shortly.",
      };
    }
  }

  return {
    success: true as const,
    order: {
      id: order.id,
      status: order.status,
      total,
      deliveryFee,
      paystackAuthorizationUrl,
    },
  };
}
