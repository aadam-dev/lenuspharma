"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPaystackPayment } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function CompleteInner() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? searchParams.get("reference_id");
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setState("err");
      setMessage("Missing payment reference. Return to checkout and try again.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await verifyPaystackPayment(reference);
        if (cancelled) return;
        setOrderId(res.orderId);
        setMessage(`Payment confirmed. Order status: ${res.status}`);
        setState("ok");
      } catch (e) {
        if (cancelled) return;
        setState("err");
        setMessage(e instanceof Error ? e.message : "Verification failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          {state === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Confirming payment with Paystack…</p>
            </>
          )}
          {state === "ok" && (
            <>
              <CheckCircle2 className="h-14 w-14 mx-auto text-green-600" />
              <h1 className="text-2xl font-bold">Thank you</h1>
              {orderId && (
                <p className="text-sm text-muted-foreground">
                  Order ID: <span className="font-mono select-all">{orderId}</span>
                </p>
              )}
              <p className="text-sm">{message}</p>
              <Button asChild className="w-full">
                <Link href="/products">Continue shopping</Link>
              </Button>
            </>
          )}
          {state === "err" && (
            <>
              <AlertCircle className="h-14 w-14 mx-auto text-destructive" />
              <h1 className="text-xl font-semibold">Could not confirm payment</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/checkout">Back to checkout</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-lg mx-auto py-16 px-4 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <CompleteInner />
    </Suspense>
  );
}
