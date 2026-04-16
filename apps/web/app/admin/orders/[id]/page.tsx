"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  adminGetOrder,
  adminPatchOrder,
  adminPomApproval,
  getAdminToken,
} from "@/lib/admin-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

type OrderDetail = {
  id: string;
  status: string;
  paymentStatus: string;
  guestName: string;
  guestPhone: string;
  branchId: string;
  branch?: { id: string; name: string };
  items: { quantity: number; product: { name: string; type: string } }[];
  pomApprovals: { decision: string; notes: string | null; pharmacist: { name: string } }[];
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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!getAdminToken()) {
      router.push("/admin/login");
      return;
    }
    try {
      const o = (await adminGetOrder(id)) as OrderDetail;
      setOrder(o);
      setStatus(o.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load on id
  }, [id]);

  if (!getAdminToken()) {
    return null;
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-destructive">{error ?? "Loading…"}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/orders">Back</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const saveStatus = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminPatchOrder(id, { status });
      await load();
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
      await adminPomApproval(id, { decision, notes: notes || undefined });
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">← Orders</Link>
        </Button>
        <h1 className="text-lg font-bold font-mono break-all">{order.id}</h1>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Card>
        <CardContent className="p-6 space-y-2">
          <p>
            <span className="text-muted-foreground">Customer:</span> {order.guestName} ·{" "}
            {order.guestPhone}
          </p>
          <p>
            <span className="text-muted-foreground">Branch:</span> {order.branch?.name ?? order.branchId}
          </p>
          <p>
            <span className="text-muted-foreground">Payment:</span> {order.paymentStatus}
          </p>
          <p>
            <span className="text-muted-foreground">Status:</span> {order.status}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold">Line items</h2>
          <ul className="text-sm space-y-1">
            {order.items.map((i, idx) => (
              <li key={idx}>
                {i.product.name}{" "}
                <span className="text-muted-foreground">
                  ({i.product.type}) × {i.quantity}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Update fulfillment status</h2>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-1">
              <Label>Status</Label>
              <select
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={saveStatus} disabled={busy}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {order.items.some((i) => i.product.type === "POM") && order.paymentStatus === "paid" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Pharmacist sign-off (POM)</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Clinical / compliance notes"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => pomDecision("approved")} disabled={busy} className="bg-green-600">
                Approve
              </Button>
              <Button onClick={() => pomDecision("rejected")} disabled={busy} variant="destructive">
                Reject
              </Button>
            </div>
            {order.pomApprovals?.length > 0 && (
              <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t">
                <p className="font-medium text-foreground">Audit trail</p>
                {order.pomApprovals.map((a, i) => (
                  <p key={i}>
                    {a.pharmacist.name}: {a.decision}
                    {a.notes ? ` — ${a.notes}` : ""}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
