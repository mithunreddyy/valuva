"use client";

import { useAddToCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedVariant) {
      addToCart.mutate({ variantId: selectedVariant.id, quantity: 1 });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 mb-4">
          <Image
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
              Sale
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className="glass p-2 rounded-full hover:bg-white transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <button className="glass p-2 rounded-full hover:bg-white transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-neutral-600">
              <span>★</span>
              <span>{product.averageRating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
