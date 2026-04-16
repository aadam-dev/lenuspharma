import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductsFilters } from "@/components/ProductsFilters";
import { PackageOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category ?? undefined;
  const q = params.q ?? undefined;

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    products = await getProducts({ category, type: undefined });
  } catch {
    products = [];
  }

  let filtered = products;
  if (q && q.trim()) {
    const lower = q.trim().toLowerCase();
    filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.category && p.category.toLowerCase().includes(lower)) ||
        (p.description && p.description.toLowerCase().includes(lower))
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Our Products</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse our wide range of medicines and health products. Order online for delivery or pickup.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (could be sidebar on large screens, currently top) */}
          <div className="w-full lg:w-64 shrink-0">
            <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-muted" />}>
              <div className="sticky top-24">
                <ProductsFilters />
              </div>
            </Suspense>
          </div>

          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-background rounded-xl border border-dashed">
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                  <PackageOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No products found</h3>
                <p className="text-muted-foreground mt-1 text-center max-w-sm">
                  {!category && !q?.trim()
                    ? "Products could not be loaded. Ensure the API is running (e.g. npm run dev in apps/api) and NEXT_PUBLIC_API_URL is set in apps/web/.env.local."
                    : "Try adjusting your search or filters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

