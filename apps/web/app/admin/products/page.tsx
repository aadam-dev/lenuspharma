"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminLowStock, adminPatchStock, getAdminToken } from "@/lib/admin-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type Product = {
  id: string;
  name: string;
  stock: number | null;
};

export default function AdminProductsPage() {
  const [threshold, setThreshold] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await adminLowStock();
      setThreshold(data.threshold);
      setProducts(data.products as Product[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  };

  useEffect(() => {
    if (!getAdminToken()) {
      setError("Not signed in");
      return;
    }
    load();
  }, []);

  if (error === "Not signed in") {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">Sign in to manage stock.</p>
          <Button asChild>
            <Link href="/admin/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const save = async (id: string) => {
    const raw = edits[id];
    if (raw === undefined) return;
    const stock = parseInt(raw, 10);
    if (Number.isNaN(stock) || stock < 0) {
      setError("Invalid stock value");
      return;
    }
    setError(null);
    try {
      await adminPatchStock(id, stock);
      setEdits((e) => {
        const n = { ...e };
        delete n[id];
        return n;
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Low stock</h1>
      <p className="text-sm text-muted-foreground">
        Products at or below threshold ({threshold}). Adjust quantities after physical stock counts.
      </p>
      {error && error !== "Not signed in" && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      <div className="space-y-3">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Stock:</span>
                <span className="font-mono">{p.stock ?? "—"}</span>
                <Input
                  className="w-24 h-9"
                  placeholder="New"
                  value={edits[p.id] ?? ""}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [p.id]: e.target.value }))}
                />
                <Button size="sm" onClick={() => save(p.id)}>
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && !error && (
          <p className="text-muted-foreground">No low-stock products. Great job.</p>
        )}
      </div>
    </div>
  );
}
