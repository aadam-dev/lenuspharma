"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/api";
import { useCart } from "./CartProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, MessageCircle, Pill, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isPOM = product.type === "POM";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-card-foreground shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-secondary-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary-50 text-secondary-300">
            <Pill className="w-16 h-16 opacity-20" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isPOM ? (
            <Badge variant="destructive" className="shadow-sm backdrop-blur-md">
              Prescription Only
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-primary shadow-sm font-medium">
              OTC
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          {product.category && (
            <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-md">
              {product.category}
            </span>
          )}
          {product.stock && product.stock < 10 && (
            <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
              Low Stock
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Price</span>
            <span className="text-xl font-extrabold text-primary">
              GH₵ {product.price.toFixed(2)}
            </span>
          </div>

          {!isPOM ? (
            <Button
              size="icon"
              className="rounded-full shadow-lg h-10 w-10 bg-primary text-white hover:bg-primary-600 hover:scale-110 transition-all duration-300"
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl,
                })
              }
              title="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-10 w-10 bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
              asChild
              title="Order via WhatsApp"
            >
              <a
                href={`https://wa.me/233548325792?text=${encodeURIComponent(
                  "Hi, I'd like to order: " + product.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

