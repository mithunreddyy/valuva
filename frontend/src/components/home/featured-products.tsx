"use client";

import { ProductCard } from "@/components/products/products-card";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import Link from "next/link";

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({
    isFeatured: true,
    limit: 8,
  });

  if (error) return null;

  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-neutral-600 mt-2">
            Handpicked selections just for you
          </p>
        </div>
        <Button variant="outline">
          <Link href="/shop?isFeatured=true">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : data?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}
