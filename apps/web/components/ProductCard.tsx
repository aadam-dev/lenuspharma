"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import type { Product } from "@/lib/api";
import { useCart } from "./CartProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, MessageCircle, Pill } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ENTRY_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isPOM = product.type === "POM";
  const tiltRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on hover (desktop only). Mutates style directly to avoid re-renders.
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 6; // -3 → 3 deg
    const rotateX = (0.5 - y) * 6;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={ENTRY_VARIANTS}
      transition={{ duration: 0.4 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative [@media(hover:none)]:!transform-none"
    >
      <div
        ref={tiltRef}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-secondary-200/70 bg-white text-card-foreground shadow-card transition-all duration-500 ease-out group-hover:shadow-card-lift group-hover:border-primary/30 will-change-transform"
      >
        <Link
          href={`/product/${product.id}`}
          className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sand-50 to-primary-50"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-primary/30">
              <Pill className="w-20 h-20" strokeWidth={1.5} />
            </div>
          )}

          {/* Gradient overlay reveal */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Type badge — repositioned and refined */}
          <div className="absolute top-3 left-3">
            {isPOM ? (
              <Badge className="bg-coral-500 hover:bg-coral-600 text-white border-0 shadow-sm font-semibold px-2.5 py-1 text-[10px] uppercase tracking-wider">
                Rx
              </Badge>
            ) : (
              <Badge className="bg-white/95 backdrop-blur-md text-primary-700 hover:bg-white border-0 shadow-sm font-semibold px-2.5 py-1 text-[10px] uppercase tracking-wider">
                OTC
              </Badge>
            )}
          </div>

          {product.stock != null && product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm font-semibold px-2.5 py-1 text-[10px] uppercase tracking-wider">
                Low stock
              </Badge>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-5">
          {product.category && (
            <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-500">
              {product.category}
            </span>
          )}

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-display text-lg font-semibold text-secondary-900 leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-sm text-secondary-500 line-clamp-2 leading-relaxed mb-5">
              {product.description}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between pt-4 border-t border-secondary-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-400">
                Price
              </span>
              <span className="font-display text-2xl font-bold text-secondary-900 tabular-nums leading-none mt-1">
                <span className="text-secondary-400 text-base align-top mr-0.5">GH₵</span>
                {Number(product.price).toFixed(2)}
              </span>
            </div>

            {!isPOM ? (
              <Button
                size="icon"
                className="h-11 w-11 rounded-2xl bg-primary text-white hover:bg-primary-700 shadow-glow transition-all duration-300 hover:scale-105"
                onClick={() =>
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    imageUrl: product.imageUrl,
                  })
                }
                title="Add to cart"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={2.2} />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="secondary"
                className="h-11 w-11 rounded-2xl bg-[#25D366] hover:bg-[#1ebd5a] text-white border-0 transition-all duration-300 hover:scale-105"
                asChild
                title="Order via WhatsApp"
              >
                <a
                  href={`https://wa.me/233548325792?text=${encodeURIComponent(
                    "Hi, I'd like to order: " + product.name,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
