import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Complete your order securely. We accept Mobile Money and Cards.
        </p>
        <div>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}

