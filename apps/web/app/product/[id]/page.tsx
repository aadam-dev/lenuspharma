import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import { ProductDetailActions } from "./ProductDetailActions";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Pill, CheckCircle2 } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  const isPOM = product.type === "POM";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image Column */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="relative aspect-square bg-secondary/20 flex items-center justify-center p-8">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <Pill className="w-32 h-32 text-muted-foreground/20" />
              )}
              {isPOM && (
                <Badge variant="destructive" className="absolute right-4 top-4 text-sm px-3 py-1">
                  Prescription Only
                </Badge>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              {product.category && (
                <Badge variant="outline" className="text-muted-foreground">{product.category}</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-primary mb-8">
              GH₵ {product.price.toFixed(2)}
            </p>

            <div className="prose prose-slate max-w-none text-muted-foreground mb-8">
              {product.description || "No description available for this product."}
            </div>

            <div className="space-y-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>In Stock</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Genuine Product Guaranteed</span>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <ProductDetailActions product={product} />
              </div>

              {isPOM && (
                <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900 border border-amber-100">
                  <p className="font-medium mb-1">Prescription Required</p>
                  Order prescription items via WhatsApp. Tap the button above to
                  chat with our pharmacist — we&apos;ll confirm your script and
                  arrange your order.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

