import { CartSummary } from "@/components/CartSummary";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-secondary/5">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Your Shopping Cart</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Review your items securely. No account required to checkout.
        </p>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

