import { createHmac } from "node:crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string | undefined {
  return process.env.PAYSTACK_SECRET_KEY;
}

function authHeader(): string {
  const key = secretKey();
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return `Bearer ${key}`;
}

export function isPaystackConfigured(): boolean {
  return Boolean(secretKey()?.trim());
}

export async function paystackInitializeTransaction(params: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}): Promise<{ authorizationUrl: string; accessCode: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountPesewas,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
      currency: "GHS",
    }),
  });
  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };
  if (!res.ok || !data.status || !data.data?.authorization_url) {
    throw new Error(data.message || "Paystack initialize failed");
  }
  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export async function paystackVerifyTransaction(reference: string): Promise<{
  status: string;
  amount: number;
  paidAt: string | null;
  metadata: Record<string, string> | null;
}> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: authHeader() },
  });
  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: {
      status: string;
      amount: number;
      paid_at: string | null;
      metadata?: { custom_fields?: unknown } & Record<string, string>;
    };
  };
  if (!res.ok || !data.status || !data.data) {
    throw new Error(data.message || "Paystack verify failed");
  }
  const meta = data.data.metadata;
  const flat: Record<string, string> | null = meta
    ? Object.fromEntries(
        Object.entries(meta).filter(([, v]) => typeof v === "string") as [string, string][]
      )
    : null;
  return {
    status: data.data.status,
    amount: data.data.amount,
    paidAt: data.data.paid_at,
    metadata: flat,
  };
}

export function verifyPaystackSignature(rawBody: string, signatureHeader: string | undefined): boolean {
  const secret = secretKey();
  if (!secret || !signatureHeader) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signatureHeader;
}
