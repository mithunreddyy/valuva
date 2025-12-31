"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function NewArrivals() {
  const { data, isLoading, error } = useProducts({
    isNewArrival: true,
    limit: 8,
  });

  if (error) return null;

  return (
    <section className="section-padding bg-[#fafafa]">
      <div className="container-luxury">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                New Arrivals
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Fresh styles just landed
              </p>
            </div>
            <Link
              href="/shop?isNewArrival=true"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-500 font-medium">
                  No new arrivals available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
