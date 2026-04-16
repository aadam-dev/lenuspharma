const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:4000/api";

function apiUrl(path: string): string {
  const base = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const TOKEN_KEY = "lenus_admin_jwt";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(apiUrl(`/admin${path.startsWith("/") ? path : `/${path}`}`), {
    ...init,
    headers,
  });
}

export async function adminLogin(email: string, password: string): Promise<{
  token: string;
  user: { id: string; email: string; role: string; name: string };
}> {
  const res = await adminFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Login failed");
  }
  return res.json();
}

export async function adminListOrders(status?: string): Promise<unknown[]> {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await adminFetch(`/orders${q}`);
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function adminGetOrder(id: string): Promise<unknown> {
  const res = await adminFetch(`/orders/${id}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function adminPatchOrder(
  id: string,
  body: { status?: string; branchId?: string }
): Promise<unknown> {
  const res = await adminFetch(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Update failed");
  }
  return res.json();
}

export async function adminPomApproval(
  id: string,
  body: { decision: "approved" | "rejected"; notes?: string }
): Promise<unknown> {
  const res = await adminFetch(`/orders/${id}/pom-approval`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Approval failed");
  }
  return res.json();
}

export async function adminLowStock(): Promise<{ threshold: number; products: unknown[] }> {
  const res = await adminFetch("/products/low-stock");
  if (!res.ok) throw new Error("Failed to load low-stock products");
  return res.json();
}

export async function adminPatchStock(id: string, stock: number): Promise<unknown> {
  const res = await adminFetch(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Stock update failed");
  }
  return res.json();
}

export async function adminReportsSummary(
  from?: string,
  to?: string
): Promise<Record<string, unknown>> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const res = await adminFetch(`/reports/summary?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load report");
  return res.json();
}
