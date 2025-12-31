"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { recommendationsService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TrendingProductsProps {
  limit?: number;
  showHeader?: boolean;
}

export function TrendingProducts({
  limit = 8,
  showHeader = true,
}: TrendingProductsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["trending-products", limit],
    queryFn: () => recommendationsService.getTrendingProducts(limit),
  });

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#fafafa] to-white border-t border-[#f5f5f5]">
        <div className="container-luxury">
          {showHeader && (
            <div className="mb-10 sm:mb-12 lg:mb-16">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Trending Now
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-400 font-normal pl-[52px]">
                Most popular products this week
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const products = data || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#fafafa] to-white border-t border-[#f5f5f5]">
      <div className="container-luxury">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 sm:mb-12 lg:mb-16"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Trending Now
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-400 font-normal pl-[52px]">
                Most popular products this week
              </p>
            </div>
            <Link
              href="/shop?sort=popular"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group px-4 py-2 rounded-[12px] hover:bg-white"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
