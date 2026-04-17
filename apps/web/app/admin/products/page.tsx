"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  adminGetAllProducts,
  adminPatchStock,
  getAdminToken,
} from "@/lib/admin-api";
import {
  Search,
  RefreshCw,
  Package,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  category: string;
  type: string;
  imageUrl: string | null;
  stock: number | null;
};

function stockLevel(stock: number | null): "ok" | "low" | "out" | "untracked" {
  if (stock === null) return "untracked";
  if (stock === 0) return "out";
  if (stock <= 10) return "low";
  return "ok";
}

const STOCK_CONFIG = {
  ok: {
    bar: "bg-green-400",
    text: "text-green-700",
    bg: "bg-green-50",
    label: "In Stock",
  },
  low: {
    bar: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    label: "Low Stock",
  },
  out: {
    bar: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    label: "Out of Stock",
  },
  untracked: {
    bar: "bg-gray-300",
    text: "text-gray-500",
    bg: "bg-gray-50",
    label: "Untracked",
  },
};

function StockBadge({ stock }: { stock: number | null }) {
  const level = stockLevel(stock);
  const cfg = STOCK_CONFIG[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.bar)} />
      {stock !== null ? `${stock} · ${cfg.label}` : cfg.label}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div className="h-3 w-48 bg-gray-100 rounded" />
          <div className="h-3 w-20 bg-gray-50 rounded" />
          <div className="h-5 w-12 bg-gray-100 rounded-full" />
          <div className="h-3 w-16 bg-gray-50 rounded" />
          <div className="h-6 w-24 bg-gray-100 rounded-full" />
          <div className="h-8 w-28 bg-gray-50 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "OTC" | "POM">("all");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
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
      const data = (await adminGetAllProducts()) as Product[];
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const filtered = useMemo(() => {
    let result = products;
    if (typeFilter !== "all") result = result.filter((p) => p.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, typeFilter, search]);

  const stats = useMemo(() => {
    const low = products.filter((p) => p.stock !== null && p.stock > 0 && p.stock <= 10).length;
    const out = products.filter((p) => p.stock === 0).length;
    return { total: products.length, low, out };
  }, [products]);

  const saveStock = async (id: string) => {
    const raw = edits[id];
    if (raw === undefined) return;
    const stock = parseInt(raw, 10);
    if (Number.isNaN(stock) || stock < 0) {
      setError("Stock must be a non-negative number");
      return;
    }
    setError(null);
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      await adminPatchStock(id, stock);
      setEdits((e) => {
        const n = { ...e };
        delete n[id];
        return n;
      });
      setSaved((s) => ({ ...s, [id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [id]: false })), 2000);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock } : p))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Stock update failed");
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  if (error === "not_signed_in") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <AlertCircle className="h-10 w-10 text-gray-300" />
        <p className="text-gray-500 text-sm">Sign in to manage products.</p>
        <Link href="/admin/login" className="text-sm font-medium text-primary hover:underline">
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products & Stock</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Loading…" : `${stats.total} products`}
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

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">Total Products</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-600">Low Stock</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">{stats.low}</p>
          </div>
          <div className="bg-white rounded-xl border border-red-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs font-medium text-red-600">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.out}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "OTC", "POM"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                typeFilter === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t === "all" ? "All Types" : t}
            </button>
          ))}
        </div>
      </div>

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
            <Package className="h-8 w-8 text-gray-200" />
            <p className="text-sm font-medium text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Update Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => {
                  const level = stockLevel(product.stock);
                  const isSaving = saving[product.id];
                  const isSaved = saved[product.id];
                  const hasEdit = edits[product.id] !== undefined;
                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        "hover:bg-gray-50/80 transition-colors",
                        level === "out" && "bg-red-50/30",
                        level === "low" && "bg-amber-50/20"
                      )}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            product.type === "POM"
                              ? "bg-purple-50 text-purple-700"
                              : "bg-teal-50 text-teal-700"
                          )}
                        >
                          {product.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900 whitespace-nowrap">
                        GH₵ {Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <StockBadge stock={product.stock} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            placeholder={product.stock?.toString() ?? "—"}
                            value={edits[product.id] ?? ""}
                            onChange={(e) =>
                              setEdits((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveStock(product.id);
                            }}
                            className="w-20 h-8 rounded-lg border border-gray-200 px-2 text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                          />
                          <button
                            onClick={() => saveStock(product.id)}
                            disabled={!hasEdit || isSaving}
                            className={cn(
                              "h-8 px-3 rounded-lg text-xs font-semibold transition-all",
                              isSaved
                                ? "bg-green-500 text-white"
                                : hasEdit
                                ? "bg-primary text-white hover:bg-primary/90"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                          >
                            {isSaving ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : isSaved ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              "Save"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Showing {filtered.length} of {products.length} products
        </p>
      )}
    </div>
  );
}
