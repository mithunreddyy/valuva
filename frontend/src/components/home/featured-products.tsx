"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { useProducts } from "@/hooks/use-products";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedProducts() {
  const { data, isLoading, error } = useProducts({
    isFeatured: true,
    limit: 6,
  });

  if (error) return null;

  return (
    <section className="section-padding bg-[#fafafa]">
      <div className="container-luxury">
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Section Header - Minimal Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
          >
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#0a0a0a]">
                Featured
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 font-medium tracking-normal">
                Curated Selection
              </p>
            </div>
            <Link
              href="/shop?isFeatured=true"
              className="flex items-center gap-2 text-sm sm:text-base font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors duration-300 group"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Products Grid - 3 Columns, Medium-Large Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
            >
              {data.data.slice(0, 3).map((product, index) => (
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 sm:py-20"
            >
              <p className="text-base sm:text-lg text-neutral-500 font-medium tracking-normal">
                No featured products available.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
