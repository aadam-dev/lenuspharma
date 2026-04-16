import { prisma } from "../db";
import { redactString } from "../lib/redact";

export type NotifyChannel = "sms" | "whatsapp" | "email";

/**
 * Logs every outbound notification and optionally calls Hubtel SMS when configured.
 * Never throws — failures are recorded on NotificationLog.
 */
export async function notifyOrderEvent(params: {
  orderId: string;
  channel: NotifyChannel;
  recipient: string;
  body: string;
}): Promise<void> {
  const log = await prisma.notificationLog.create({
    data: {
      orderId: params.orderId,
      channel: params.channel,
      recipient: redactString(params.recipient),
      body: params.body,
      status: "pending",
    },
  });

  const hubtelId = process.env.HUBTEL_CLIENT_ID;
  const hubtelSecret = process.env.HUBTEL_CLIENT_SECRET;
  const hubtelFrom = process.env.HUBTEL_FROM_NUMBER;

  if (params.channel === "sms" && hubtelId && hubtelSecret && hubtelFrom) {
    try {
      const auth = Buffer.from(`${hubtelId}:${hubtelSecret}`).toString("base64");
      const res = await fetch("https://smsc.hubtel.com/v1/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          From: hubtelFrom,
          To: params.recipient.replace(/^0/, "233"),
          Content: params.body,
        }),
      });
      const text = await res.text();
      await prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: res.ok ? "sent" : "failed",
          providerResponse: text.slice(0, 2000),
        },
      });
    } catch (e) {
      await prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: "failed",
          providerResponse: e instanceof Error ? e.message : "unknown_error",
        },
      });
    }
  } else {
    await prisma.notificationLog.update({
      where: { id: log.id },
      data: { status: "logged" },
    });
  }
}

export async function notifyOrderStatusChange(orderId: string, status: string, guestPhone: string): Promise<void> {
  const body = `Lenus Pharmacy: your order status is now "${status}". Thank you for choosing us.`;
  await notifyOrderEvent({
    orderId,
    channel: "sms",
    recipient: guestPhone,
    body,
  });
}
