"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({
    isFeatured: true,
    limit: 8,
  });

  if (error) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                Featured
              </h2>
              <p className="text-sm text-neutral-500 font-medium tracking-normal">
                Curated Selection
              </p>
            </div>
            <Link
              href="/shop?isFeatured=true"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {data.data.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 font-medium">
                No featured products available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
