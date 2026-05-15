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
              <div className="flex flex-col items-center justify-center py-20 bg-background rounded-2xl border border-secondary-100">
                <div className="bg-primary/8 p-5 rounded-full mb-5">
                  <PackageOpen className="w-10 h-10 text-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {category || q?.trim() ? "No products match" : "Catalogue coming online"}
                </h3>
                <p className="text-secondary-500 text-center max-w-sm leading-relaxed mb-6">
                  {category || q?.trim()
                    ? "Try a different category or clear your search to see all products."
                    : "Our full range of 2,000+ medicines and health products will appear here. In the meantime, chat with a pharmacist on WhatsApp."}
                </p>
                {!category && !q?.trim() && (
                  <a
                    href="https://wa.me/233548325792"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebd5a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Browse via WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

