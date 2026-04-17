"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyPaystackPayment } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 2000;

async function verifyWithRetry(
  reference: string,
  attempt: number
): Promise<{ ok: boolean; orderId: string; status: string }> {
  try {
    return await verifyPaystackPayment(reference);
  } catch (err) {
    if (attempt >= MAX_ATTEMPTS) throw err;
    await new Promise((r) => setTimeout(r, BASE_DELAY_MS * attempt));
    return verifyWithRetry(reference, attempt + 1);
  }
}

function CompleteInner() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ??
    searchParams.get("trxref") ??
    searchParams.get("reference_id");

  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(1);
  const cancelledRef = useRef(false);

  const runVerification = async (ref: string) => {
    cancelledRef.current = false;
    setState("loading");
    setMessage("");
    try {
      const res = await verifyWithRetry(ref, attempt);
      if (cancelledRef.current) return;
      setOrderId(res.orderId);
      setMessage(`Payment confirmed. Order status: ${res.status}`);
      setState("ok");
    } catch (e) {
      if (cancelledRef.current) return;
      setState("err");
      setMessage(
        e instanceof Error
          ? e.message
          : "Verification failed. Your payment may still have gone through — please contact us."
      );
    }
  };

  useEffect(() => {
    if (!reference) {
      setState("err");
      setMessage("Missing payment reference. Return to checkout and try again.");
      return;
    }
    runVerification(reference);
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  const handleRetry = () => {
    if (!reference) return;
    setAttempt((a) => a + 1);
    runVerification(reference);
  };

  return (
    <div className="container max-w-lg mx-auto py-16 px-4">
      <Card>
        <CardContent className="p-10 text-center space-y-5">
          {state === "loading" && (
            <>
              <div className="relative mx-auto w-16 h-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Confirming your payment…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This can take a few seconds. Please don&apos;t close this page.
                </p>
              </div>
            </>
          )}

          {state === "ok" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
                <p className="text-muted-foreground mt-1">
                  Thank you for your purchase. We&apos;ll contact you shortly.
                </p>
              </div>
              {orderId && (
                <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
                  <p className="text-muted-foreground">Order reference</p>
                  <p className="font-mono font-semibold text-foreground select-all mt-0.5">
                    {orderId}
                  </p>
                </div>
              )}
              <div className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                {message}
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild className="w-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </>
          )}

          {state === "err" && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Could not confirm payment
                </h1>
                <p className="text-sm text-muted-foreground mt-2">{message}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                If your payment was deducted, it will be reconciled automatically. You can
                also call us at{" "}
                <a href="tel:0548325792" className="font-semibold underline">
                  054 832 5792
                </a>
                .
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {reference && (
                  <Button onClick={handleRetry} className="w-full gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/checkout">Back to Checkout</Link>
                </Button>
              </div>
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
