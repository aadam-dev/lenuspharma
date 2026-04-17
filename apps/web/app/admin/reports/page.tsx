"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminReportsSummary, getAdminToken } from "@/lib/admin-api";
import {
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ReportData = {
  from: string;
  to: string;
  orderCount: number;
  paidCount: number;
  revenueGhs: number;
  pendingPayment: number;
  awaitingPharmacist: number;
};

type MetricCardProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: "default" | "green" | "amber" | "purple" | "blue";
};

const COLOR_MAP = {
  default: { bg: "bg-gray-100", icon: "text-gray-500", value: "text-gray-900" },
  green: { bg: "bg-green-50", icon: "text-green-600", value: "text-green-900" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", value: "text-amber-900" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", value: "text-purple-900" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", value: "text-blue-900" },
};

function MetricCard({ icon: Icon, label, value, sub, color = "default" }: MetricCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", c.bg)}>
          <Icon className={cn("h-4.5 w-4.5", c.icon)} />
        </div>
      </div>
      <div>
        <p className={cn("text-3xl font-bold tracking-tight", c.value)}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const PRESET_RANGES = [
  { label: "Today", days: 0 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

function toISODate(d: Date): string {
  return d.toISOString().split("T")[0]!;
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState(toISODate(new Date(Date.now() - 7 * 86400000)));
  const [to, setTo] = useState(toISODate(new Date()));
  const [refreshKey, setRefreshKey] = useState(0);

  const load = async () => {
    if (!getAdminToken()) {
      setError("not_signed_in");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = (await adminReportsSummary(from, to)) as unknown as ReportData;
      setData(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, refreshKey]);

  const applyPreset = (days: number) => {
    setTo(toISODate(new Date()));
    setFrom(
      days === 0
        ? toISODate(new Date())
        : toISODate(new Date(Date.now() - days * 86400000))
    );
  };

  const conversionRate =
    data && data.orderCount > 0
      ? Math.round((data.paidCount / data.orderCount) * 100)
      : 0;

  if (error === "not_signed_in") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="text-gray-500 text-sm">Sign in to view reports.</p>
        <Link href="/admin/login" className="text-sm font-medium text-primary hover:underline">
          Go to login →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Operational overview for your selected period</p>
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

      {/* Date range */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Date Range</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex gap-2 flex-wrap">
            {PRESET_RANGES.map(({ label, days }) => (
              <button
                key={label}
                onClick={() => applyPreset(days)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">From</label>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <span className="text-gray-300 mt-4">→</span>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">To</label>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {error && error !== "not_signed_in" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
        </div>
      ) : data ? (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={TrendingUp}
              label="Revenue"
              value={`GH₵ ${data.revenueGhs.toFixed(2)}`}
              sub="Paid orders only"
              color="green"
            />
            <MetricCard
              icon={ShoppingCart}
              label="Total Orders"
              value={data.orderCount}
              sub={`${conversionRate}% paid`}
              color="blue"
            />
            <MetricCard
              icon={CheckCircle}
              label="Paid Orders"
              value={data.paidCount}
              sub="Payment confirmed"
              color="green"
            />
            <MetricCard
              icon={Clock}
              label="Pending Payment"
              value={data.pendingPayment}
              sub="Awaiting payment"
              color="amber"
            />
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Status Breakdown</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                {
                  label: "Pending Payment",
                  value: data.pendingPayment,
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
                {
                  label: "Paid (all paid orders)",
                  value: data.paidCount,
                  icon: CheckCircle,
                  color: "text-green-500",
                  bg: "bg-green-50",
                },
                {
                  label: "Awaiting Pharmacist (POM)",
                  value: data.awaitingPharmacist,
                  icon: FlaskConical,
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
                {
                  label: "Other / Processing",
                  value: Math.max(
                    0,
                    data.orderCount - data.pendingPayment - data.awaitingPharmacist
                  ),
                  icon: ShoppingCart,
                  color: "text-teal-500",
                  bg: "bg-teal-50",
                },
              ].map(({ label, value, icon: Icon, color, bg }) => {
                const pct = data.orderCount > 0 ? (value / data.orderCount) * 100 : 0;
                return (
                  <div key={label} className="flex items-center gap-4 px-5 py-4">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", bg)}>
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="text-sm font-bold text-gray-900 ml-2">{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", color.replace("text-", "bg-"))}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right shrink-0">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Period note */}
          <p className="text-xs text-gray-400 text-center">
            Report covers{" "}
            {new Date(data.from).toLocaleDateString("en-GH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            to{" "}
            {new Date(data.to).toLocaleDateString("en-GH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </>
      ) : null}
    </div>
  );
}
