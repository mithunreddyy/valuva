"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { useProducts } from "@/hooks/use-products";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    isFeatured: true,
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="w-full min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="container-luxury py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-sm font-medium tracking-normal text-neutral-500">
              SS/2024
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight">
              VALUVA
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Minimal luxury clothing with timeless design. Crafted for the
              modern minimalist.
            </p>
            <div className="pt-2">
              <Link href="/shop" className="btn-luxury inline-block">
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="space-y-8 lg:space-y-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
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

      {/* Philosophy Section */}
      <section className="section-padding bg-[#fafafa]">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-normal text-neutral-500">
                Philosophy
              </h3>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-medium">
                VALUVA is built on the principle of minimalism. Every design is
                intentional, every fabric is carefully selected, and every piece
                is crafted to last.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-normal text-neutral-500">
                Craft
              </h3>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-medium">
                Hand-finished in our studio with attention to detail. We utilize
                sustainable practices to ensure our brand remains ethical and
                environmentally conscious.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
