"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminReportsSummary, getAdminToken } from "@/lib/admin-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminReportsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      setError("Not signed in");
      return;
    }
    (async () => {
      try {
        const r = await adminReportsSummary();
        setData(r);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    })();
  }, []);

  if (error === "Not signed in") {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">Sign in to view reports.</p>
          <Button asChild>
            <Link href="/admin/login">Go to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Operational summary</h1>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {data && (
        <Card>
          <CardContent className="p-6 space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Window:</span>{" "}
              {String(data.from)} → {String(data.to)}
            </p>
            <p>
              <span className="text-muted-foreground">Orders:</span> {String(data.orderCount)}
            </p>
            <p>
              <span className="text-muted-foreground">Paid orders:</span> {String(data.paidCount)}
            </p>
            <p>
              <span className="text-muted-foreground">Revenue (GHS, excl. unconfirmed):</span>{" "}
              {String(data.revenueGhs)}
            </p>
            <p>
              <span className="text-muted-foreground">Pending payment:</span>{" "}
              {String(data.pendingPayment)}
            </p>
            <p>
              <span className="text-muted-foreground">Awaiting pharmacist:</span>{" "}
              {String(data.awaitingPharmacist)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
