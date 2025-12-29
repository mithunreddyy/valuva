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
      <section className="section-padding bg-white">
        <div className="container-luxury">
          {showHeader && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-neutral-500" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                  Trending Now
                </h2>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Most popular products this week
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
    <section className="section-padding bg-white">
      <div className="container-luxury">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-neutral-500" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal">
                  Trending Now
                </h2>
              </div>
              <p className="text-sm text-neutral-500 font-medium">
                Most popular products this week
              </p>
            </div>
            <Link
              href="/shop?sort=popular"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
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
