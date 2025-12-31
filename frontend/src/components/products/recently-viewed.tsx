"use client";

import { useRecentlyViewed } from "@/hooks/use-recommendations";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./product-card-skeleton";

export function RecentlyViewed() {
  const { data, isLoading } = useRecentlyViewed();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#f5f5f5]">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 sm:space-y-12 lg:space-y-16"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center shadow-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]">
                  Recently Viewed
                </h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-400 font-normal pl-[52px]">
                Continue browsing where you left off
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group px-4 py-2 rounded-[12px] hover:bg-[#fafafa]"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6"
            >
              {data.slice(0, 5).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
