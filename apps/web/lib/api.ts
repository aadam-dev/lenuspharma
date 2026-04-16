// Base URL for the API (include /api). Use 127.0.0.1 so server-side fetch reaches the API reliably.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000/api";

function apiUrl(path: string): string {
  const base = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  type: string;
  imageUrl: string | null;
  stock: number | null;
  branchId: string | null;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  ghanaPostGps: string;
  lat?: number;
  lng?: number;
  createdAt: string;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  total: number;
  deliveryFee?: number;
  paystackAuthorizationUrl: string | null;
}

export async function getProducts(params?: {
  category?: string;
  type?: string;
}): Promise<Product[]> {
  const search = new URLSearchParams(
    Object.entries(params ?? {}).filter(([, v]) => v != null && v !== "") as [string, string][]
  ).toString();
  const url = apiUrl(`/products${search ? `?${search}` : ""}`);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(apiUrl(`/products/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function getBranches(): Promise<Branch[]> {
  const res = await fetch(apiUrl("/branches"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

export async function createOrder(body: {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  ghanaPostGps: string;
  addressLine1: string;
  area: string;
  region: string;
  consentDataProcessing: boolean;
  items: { productId: string; quantity: number }[];
}): Promise<CreateOrderResponse> {
  const res = await fetch(apiUrl("/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Failed to create order");
  }
  return res.json();
}

export async function verifyPaystackPayment(reference: string): Promise<{
  ok: boolean;
  orderId: string;
  status: string;
  paymentStatus?: string;
}> {
  const url = apiUrl(`/payments/paystack/verify?reference=${encodeURIComponent(reference)}`);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Verification failed");
  }
  return res.json();
}
