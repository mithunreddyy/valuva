"use client";

import { ProductCard } from "./ProductCard";
import { useRecommendations } from "@/hooks/use-recommendations";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductRecommendationsProps {
  productId: string;
}

export function ProductRecommendations({
  productId,
}: ProductRecommendationsProps) {
  const { similarProducts, frequentlyBought } = useRecommendations(productId);

  return (
    <div className="space-y-12 sm:space-y-16">
      {similarProducts.data && similarProducts.data.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-1">
                Similar Products
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Products you might like
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#0a0a0a] transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {similarProducts.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {similarProducts.data.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>
      )}

      {frequentlyBought.data && frequentlyBought.data.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-normal text-[#0a0a0a] mb-1">
                Frequently Bought Together
              </h2>
              <p className="text-sm text-neutral-500 font-medium">
                Customers also purchased
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#0a0a0a] transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {frequentlyBought.isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              <AnimatePresence>
                {frequentlyBought.data.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>
      )}
    </div>
  );
}

