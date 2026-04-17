"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  adminGetOrder,
  adminPatchOrder,
  adminPomApproval,
  getAdminToken,
  getAdminUser,
} from "@/lib/admin-api";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PomApproval = {
  decision: string;
  notes: string | null;
  createdAt: string;
  pharmacist: { name: string };
};

type OrderItem = {
  id: string;
  quantity: number;
  priceAtOrder: string;
  product: { name: string; type: string; category: string };
};

type OrderDetail = {
  id: string;
  status: string;
  paymentStatus: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  ghanaPostGps: string;
  addressLine1: string;
  area: string;
  region: string;
  branchId: string;
  deliveryFee: string | null;
  paystackReference: string | null;
  createdAt: string;
  updatedAt: string;
  branch?: { id: string; name: string; address: string };
  items: OrderItem[];
  pomApprovals: PomApproval[];
};

const STATUSES = [
  "pending_payment",
  "paid",
  "awaiting_pharmacist",
  "pharmacist_rejected",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  awaiting_pharmacist: "POM Review",
  pharmacist_rejected: "Rx Rejected",
  processing: "Processing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-blue-50 text-blue-700 ring-blue-200",
  awaiting_pharmacist: "bg-purple-50 text-purple-700 ring-purple-200",
  pharmacist_rejected: "bg-red-50 text-red-700 ring-red-200",
  processing: "bg-teal-50 text-teal-700 ring-teal-200",
  dispatched: "bg-orange-50 text-orange-700 ring-orange-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 ring-gray-200"
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="mt-0.5 h-7 w-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const currentUser = getAdminUser();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pomNotes, setPomNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = async () => {
    if (!getAdminToken()) {
      router.push("/admin/login");
      return;
    }
    try {
      const o = (await adminGetOrder(id)) as OrderDetail;
      setOrder(o);
      setSelectedStatus(o.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load order");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const saveStatus = async () => {
    if (!order || selectedStatus === order.status) return;
    setBusy(true);
    setError(null);
    try {
      await adminPatchOrder(id, { status: selectedStatus });
      await load();
      flash("Order status updated");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const pomDecision = async (decision: "approved" | "rejected") => {
    setBusy(true);
    setError(null);
    try {
      await adminPomApproval(id, { decision, notes: pomNotes || undefined });
      setPomNotes("");
      await load();
      flash(decision === "approved" ? "Prescription approved" : "Prescription rejected");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setBusy(false);
    }
  };

  if (!order && !error) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-2xl space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!order) return null;

  const itemsSubtotal = order.items.reduce(
    (s, i) => s + Number(i.priceAtOrder) * i.quantity,
    0
  );
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const grandTotal = itemsSubtotal + deliveryFee;
  const hasPom = order.items.some((i) => i.product.type === "POM");
  const canApprove =
    hasPom &&
    order.paymentStatus === "paid" &&
    (currentUser?.role === "admin" || currentUser?.role === "pharmacist");

  return (
    <div className="max-w-5xl space-y-6">
      {/* Breadcrumb + header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Orders
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-mono text-gray-600">#{order.id.slice(-8).toUpperCase()}</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Order Detail</h1>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Created{" "}
          {new Date(order.createdAt).toLocaleString("en-GH", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — customer + delivery */}
        <div className="space-y-5 lg:col-span-1">
          {/* Customer */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Customer
            </h2>
            <InfoRow icon={User} label="Name" value={order.guestName} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={
                <a href={`tel:${order.guestPhone}`} className="text-primary hover:underline">
                  {order.guestPhone}
                </a>
              }
            />
            {order.guestEmail && (
              <InfoRow
                icon={User}
                label="Email"
                value={
                  <a href={`mailto:${order.guestEmail}`} className="text-primary hover:underline">
                    {order.guestEmail}
                  </a>
                }
              />
            )}
          </section>

          {/* Delivery */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              Delivery Address
            </h2>
            <InfoRow icon={MapPin} label="GPS" value={order.ghanaPostGps} />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={`${order.addressLine1}, ${order.area}`}
            />
            <InfoRow icon={MapPin} label="Region" value={order.region} />
            {order.branch && (
              <InfoRow icon={Package} label="Branch" value={order.branch.name} />
            )}
          </section>

          {/* Payment */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              Payment
            </h2>
            <InfoRow
              icon={CreditCard}
              label="Status"
              value={
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "pending"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {order.paymentStatus}
                </span>
              }
            />
            {order.paystackReference && (
              <InfoRow
                icon={CreditCard}
                label="Paystack Ref"
                value={
                  <span className="font-mono text-xs select-all">{order.paystackReference}</span>
                }
              />
            )}
          </section>
        </div>

        {/* Right column — items + actions */}
        <div className="space-y-5 lg:col-span-2">
          {/* Line items */}
          <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {item.product.type === "POM" ? (
                        <FlaskConical className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Package className="h-4 w-4 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.product.category} ·{" "}
                        <span
                          className={cn(
                            "font-medium",
                            item.product.type === "POM" ? "text-purple-500" : "text-teal-500"
                          )}
                        >
                          {item.product.type}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      GH₵ {(Number(item.priceAtOrder) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      GH₵ {Number(item.priceAtOrder).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-5 py-3.5 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>GH₵ {itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery</span>
                <span>GH₵ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-gray-900 border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>GH₵ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Status management */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              Update Fulfillment Status
            </h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-40">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  New status
                </label>
                <select
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s] ?? s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveStatus}
                disabled={busy || selectedStatus === order.status}
                className={cn(
                  "h-10 px-5 rounded-lg text-sm font-semibold transition-colors",
                  selectedStatus !== order.status
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </section>

          {/* POM pharmacist approval */}
          {hasPom && (
            <section className="bg-white rounded-xl border border-purple-100 overflow-hidden">
              <div className="bg-purple-50 px-5 py-3.5 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-purple-500" />
                  <h2 className="text-sm font-semibold text-purple-900">
                    Prescription (POM) Sign-off
                  </h2>
                </div>
                <p className="text-xs text-purple-600 mt-0.5">
                  This order contains prescription-only medicines.
                </p>
              </div>

              <div className="p-5 space-y-4">
                {!canApprove && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2.5 text-xs text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {order.paymentStatus !== "paid"
                      ? "Order must be paid before pharmacist sign-off."
                      : "Only pharmacists and administrators can approve POM orders."}
                  </div>
                )}

                {canApprove && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Clinical notes (optional)
                      </label>
                      <textarea
                        rows={2}
                        value={pomNotes}
                        onChange={(e) => setPomNotes(e.target.value)}
                        placeholder="Dispensing notes, substitutions, warnings…"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => pomDecision("approved")}
                        disabled={busy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve & Dispense
                      </button>
                      <button
                        onClick={() => pomDecision("rejected")}
                        disabled={busy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {/* Audit trail */}
                {order.pomApprovals.length > 0 && (
                  <div className="mt-2 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-3">Approval History</p>
                    <div className="space-y-2.5">
                      {order.pomApprovals.map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                              a.decision === "approved"
                                ? "bg-green-100"
                                : "bg-red-100"
                            )}
                          >
                            {a.decision === "approved" ? (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">
                              {a.pharmacist.name}{" "}
                              <span
                                className={cn(
                                  "font-semibold capitalize",
                                  a.decision === "approved" ? "text-green-600" : "text-red-600"
                                )}
                              >
                                {a.decision}
                              </span>
                            </p>
                            {a.notes && (
                              <p className="text-xs text-gray-500 mt-0.5">{a.notes}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(a.createdAt).toLocaleString("en-GH", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
