"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { createOrder } from "@/lib/api";
import { createOrderSchema, resolveDeliveryFeeGhs } from "@lenus/shared";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Checkbox } from "./ui/Checkbox";
import { Label } from "./ui/Label";
import { Card, CardContent } from "./ui/Card";
import { CheckCircle2, ShoppingBag, AlertCircle } from "lucide-react";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    ghanaPostGps: "",
    addressLine1: "",
    area: "",
    region: "",
    consentDataProcessing: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...formData,
      guestEmail: formData.guestEmail || undefined,
      consentDataProcessing: formData.consentDataProcessing,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      setError(first ?? "Please fix the form errors.");
      return;
    }
    setLoading(true);
    try {
      const result = await createOrder(parsed.data);
      if (result.paystackAuthorizationUrl) {
        clearCart();
        window.location.href = result.paystackAuthorizationUrl;
        return;
      }
      setOrderId(result.id);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed bg-muted/30">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingBag className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
        <Button asChild className="mt-4">
          <Link href="/products">
            Browse Products
          </Link>
        </Button>
      </div>
    );
  }

  if (orderId) {
    return (
      <Card className="max-w-md mx-auto text-center p-8 border-green-200 bg-green-50/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Order received!
        </h2>
        <p className="text-green-800 mb-6">
          Thank you. Your order reference is: <br />
          <strong className="text-xl tracking-wider select-all">{orderId}</strong>
        </p>
        <p className="text-sm text-green-700 mb-8 bg-white/50 p-4 rounded-lg">
          We will contact you on the phone number provided. <br />
          If Paystack is configured, you are redirected to complete payment securely.
        </p>
        <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700">
          <Link href="/products">
            Continue shopping
          </Link>
        </Button>
      </Card>
    );
  }

  const deliveryFee =
    formData.region.trim().length > 0 ? resolveDeliveryFeeGhs(formData.region) : 0;
  const orderTotal = subtotal + deliveryFee;

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-semibold">Delivery Details</h2>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name *</Label>
              <Input
                id="guestName"
                required
                minLength={1}
                maxLength={200}
                value={formData.guestName}
                onChange={(e) => setFormData((prev) => ({ ...prev, guestName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone Number *</Label>
              <Input
                id="guestPhone"
                type="tel"
                required
                value={formData.guestPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, guestPhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestEmail">Email (optional)</Label>
            <Input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, guestEmail: e.target.value }))}
              placeholder="For receipt"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ghanaPostGps">GhanaPostGPS *</Label>
              <Input
                id="ghanaPostGps"
                required
                placeholder="e.g. GA-123-4567"
                value={formData.ghanaPostGps}
                onChange={(e) => setFormData((prev) => ({ ...prev, ghanaPostGps: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Input
                id="region"
                required
                placeholder="e.g. Greater Accra"
                value={formData.region}
                onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Area/City *</Label>
              <Input
                id="area"
                required
                value={formData.area}
                onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine1">House Number / Landmark *</Label>
              <Input
                id="addressLine1"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="consent"
              checked={formData.consentDataProcessing}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setFormData(prev => ({ ...prev, consentDataProcessing: checked === true }))
              }
              required
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground leading-snug">
                I agree to have my health and personal data processed for dispensing purposes (Data Protection Act 843).
              </Label>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-4 text-sm text-secondary-600 border space-y-2">
                        <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">GHS {subtotal.toFixed(2)}</span>
            </div>
            {formData.region.trim().length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delivery (est.)</span>
                <span className="font-medium text-foreground">GHS {deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Order total</span>
              <span className="font-bold text-lg text-primary">GHS {orderTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              By placing this order, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
              Secure checkout via Paystack when enabled; otherwise your order is held for confirmation.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
