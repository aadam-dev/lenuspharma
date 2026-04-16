"use client";

import Link from "next/link";
import type { Product } from "@/lib/api";
import { useCart } from "@/components/CartProvider";

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const { addItem } = useCart();
  const isPOM = product.type === "POM";

  if (isPOM) {
    return (
      <a
        href={`https://wa.me/233548325792?text=${encodeURIComponent(
          "Hi, I'd like to order: " + product.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-touch w-full max-w-xs items-center justify-center gap-2 rounded-xl border-2 border-green-600 bg-white px-6 py-3 font-medium text-green-700 shadow-card transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
        Order via WhatsApp
      </a>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() =>
          addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
          })
        }
        className="btn-primary"
      >
        Add to cart
      </button>
      <Link
        href="/cart"
        className="btn-secondary"
      >
        View cart
      </Link>
    </div>
  );
}
