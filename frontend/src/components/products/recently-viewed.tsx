"use client";

import { ProductCard } from "./ProductCard";
import { useRecentlyViewed } from "@/hooks/use-recommendations";
import { ProductCardSkeleton } from "./product-card-skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RecentlyViewed() {
  const { data, isLoading } = useRecentlyViewed();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-normal">
              Recently Viewed
            </h2>
            <p className="text-sm text-neutral-500 font-medium mt-2">
              Continue browsing
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#0a0a0a] transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

