"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { TrendingProducts } from "@/components/recommendations/trending-products";
import { StructuredData } from "@/components/seo/structured-data";
import { useProducts } from "@/hooks/use-products";
import { recommendationsService } from "@/services";
import { useAppSelector } from "@/store";
import { ProductRecommendation } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    isFeatured: true,
  });

  // Get personalized recommendations if user is logged in
  const { data: personalizedData, isLoading: isPersonalizedLoading } = useQuery<
    ProductRecommendation[]
  >({
    queryKey: ["personalized-recommendations"],
    queryFn: () => recommendationsService.getPersonalizedRecommendations(8),
    enabled: !!user, // Only fetch if user is logged in
  });

  // Production-ready: Fail if APP URL is not configured
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_APP_URL environment variable is required in production"
    );
  }
  const baseUrlFinal = baseUrl || "https://valuva.in";

  return (
    <>
      {/* Organization Structured Data */}
      <StructuredData
        type="Organization"
        data={{
          name: "Valuva",
          description:
            "Premium minimal fashion with timeless design. Crafted for the modern minimalist.",
          url: baseUrlFinal,
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="w-full min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center relative overflow-hidden">
          <div className="container-luxury py-10 sm:py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center space-y-5"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-medium tracking-normal text-neutral-500"
              >
                SS/2024
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.95]"
              >
                VALUVA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Minimal luxury clothing with timeless design. Crafted for the
                modern minimalist.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-2"
              >
                <Link
                  href="/shop"
                  className="btn-luxury inline-block rounded-[12px]"
                  aria-label="Shop our collection"
                >
                  Shop Collection
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section
          className="py-8 sm:py-10 lg:py-12 bg-white border-t border-[#e5e5e5]"
          aria-labelledby="featured-heading"
        >
          <div className="container-luxury">
            <div className="space-y-6 lg:space-y-8">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2
                    id="featured-heading"
                    className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[0.95]"
                  >
                    Featured
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                    Curated Selection
                  </p>
                </div>
                <Link
                  href="/shop?isFeatured=true"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
                  aria-label="View all featured products"
                >
                  View All
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : data?.data && data.data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                  role="list"
                  aria-label="Featured products"
                >
                  {data.data.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      role="listitem"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <p className="text-neutral-400 font-normal text-sm">
                    No featured products available.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Recently Viewed Section */}
        <RecentlyViewed />

        {/* Personalized Recommendations Section - Only for logged-in users */}
        {user && (
          <section
            className="py-8 sm:py-10 lg:py-12 bg-white border-t border-[#e5e5e5]"
            aria-labelledby="personalized-heading"
          >
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6 lg:space-y-8"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles
                        className="h-4 w-4 text-neutral-500"
                        aria-hidden="true"
                      />
                      <h2
                        id="personalized-heading"
                        className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
                      >
                        For You
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                      Personalized recommendations based on your preferences
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group"
                    aria-label="View all products"
                  >
                    View All
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* Products Grid */}
                {isPersonalizedLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : personalizedData && personalizedData.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
                    role="list"
                    aria-label="Personalized product recommendations"
                  >
                    {personalizedData.slice(0, 4).map((rec, index) => (
                      <motion.div
                        key={rec.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        role="listitem"
                      >
                        <ProductCard product={rec.product} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          </section>
        )}

        {/* Trending Products Section */}
        <TrendingProducts limit={8} />

        {/* Philosophy Section */}
        <section
          className="py-8 sm:py-10 lg:py-12 bg-[#fafafa] border-t border-[#e5e5e5]"
          aria-labelledby="philosophy-heading"
        >
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="space-y-2"
              >
                <h3
                  id="philosophy-heading"
                  className="text-xs font-medium tracking-normal text-neutral-500"
                >
                  Philosophy
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                  VALUVA is built on the principle of minimalism. Every design
                  is intentional, every fabric is carefully selected, and every
                  piece is crafted to last.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-2"
              >
                <h3 className="text-xs font-medium tracking-normal text-neutral-500">
                  Craft
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
                  Hand-finished in our studio with attention to detail. We
                  utilize sustainable practices to ensure our brand remains
                  ethical and environmentally conscious.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
