"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminListOrders, getAdminToken } from "@/lib/admin-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type OrderRow = {
  id: string;
  status: string;
  paymentStatus: string;
  guestName: string;
  guestPhone: string;
  createdAt: string;
  branch?: { name: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      setError("Not signed in");
      return;
    }
    (async () => {
      try {
        const data = (await adminListOrders()) as OrderRow[];
        setOrders(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, []);

  if (error === "Not signed in") {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">Sign in to view orders.</p>
          <Button asChild>
            <Link href="/admin/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/login">Account</Link>
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Branch</th>
              <th className="p-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="p-3 font-mono text-xs">
                  <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                    {o.id.slice(0, 8)}…
                  </Link>
                </td>
                <td className="p-3">
                  {o.guestName}
                  <div className="text-muted-foreground text-xs">{o.guestPhone}</div>
                </td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.paymentStatus}</td>
                <td className="p-3">{o.branch?.name ?? "—"}</td>
                <td className="p-3 text-muted-foreground whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !error && (
          <p className="p-8 text-center text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
