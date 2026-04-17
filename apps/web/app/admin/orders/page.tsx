"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { adminListOrders, getAdminToken } from "@/lib/admin-api";
import { Search, RefreshCw, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderRow = {
  id: string;
  status: string;
  paymentStatus: string;
  guestName: string;
  guestPhone: string;
  createdAt: string;
  deliveryFee: string | null;
  branch?: { name: string };
  items: { quantity: number; priceAtOrder: string }[];
};

// ── Status config ─────────────────────────────────────────────────────────────

type StatusConfig = { label: string; dot: string; badge: string };

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending_payment: {
    label: "Pending Payment",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Paid",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  awaiting_pharmacist: {
    label: "POM Review",
    dot: "bg-purple-400",
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  pharmacist_rejected: {
    label: "Rejected",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
  processing: {
    label: "Processing",
    dot: "bg-teal-400",
    badge: "bg-teal-50 text-teal-700 ring-teal-200",
  },
  dispatched: {
    label: "Dispatched",
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 ring-green-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600 ring-gray-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600 ring-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        cfg.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-50 text-green-700",
    pending: "bg-gray-100 text-gray-500",
    failed: "bg-red-50 text-red-600",
    refunded: "bg-indigo-50 text-indigo-600",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        styles[status] ?? "bg-gray-100 text-gray-500"
      )}
    >
      {status}
    </span>
  );
}

function orderTotal(order: OrderRow): number {
  const itemsTotal = order.items.reduce(
    (sum, i) => sum + Number(i.priceAtOrder) * i.quantity,
    0
  );
  return itemsTotal + Number(order.deliveryFee ?? 0);
}

// ── Tab definitions ───────────────────────────────────────────────────────────

const TABS = [
  { key: "all", label: "All" },
  { key: "pending_payment", label: "Pending" },
  { key: "awaiting_pharmacist", label: "POM Review" },
  { key: "processing", label: "Processing" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

// ── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-2.5 w-24 bg-gray-50 rounded" />
          </div>
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-50 rounded-full" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-50 rounded" />
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    if (!getAdminToken()) {
      setError("not_signed_in");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = (await adminListOrders()) as OrderRow[];
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const filtered = useMemo(() => {
    let result = orders;
    if (activeTab !== "all") result = result.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.guestName.toLowerCase().includes(q) ||
          o.guestPhone.includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, activeTab, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  if (error === "not_signed_in") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="text-gray-500 text-sm">You need to sign in to view orders.</p>
        <Link
          href="/admin/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Go to login →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Loading…" : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search by name, phone, or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 h-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1 flex-wrap">
        {TABS.map(({ key, label }) => {
          const count = tabCounts[key] ?? 0;
          if (key !== "all" && count === 0 && activeTab !== key) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeTab === key
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/60"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    activeTab === key
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && error !== "not_signed_in" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <p className="text-sm font-medium text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400">
              {search ? "Try a different search term" : "No orders in this category yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Order
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Payment
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Branch
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-medium text-gray-900">{order.guestName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.guestPhone}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        GH₵ {orderTotal(order).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap text-xs">
                      {order.branch?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-GH", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <div className="text-gray-300 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString("en-GH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
