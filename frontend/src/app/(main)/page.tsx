"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { RecentlyViewed } from "@/components/products/recently-viewed";
import { TrendingProducts } from "@/components/recommendations/trending-products";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { recommendationsService } from "@/services";
import { useAppSelector } from "@/store";
import { ProductRecommendation } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

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
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_APP_URL environment variable is required in production"
    );
  }
  const baseUrlFinal = baseUrl || "https://valuva.in";

  // Scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

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
        {/* Hero Section - Enhanced Apple Style */}
        <section
          ref={heroRef}
          className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#f5f5f5]"
        >
          {/* Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#fafafa]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.015),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.02),transparent_50%)]" />

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <motion.div
            style={{
              opacity: heroOpacity,
              scale: heroScale,
              y: heroY,
            }}
            className="container-luxury py-10 sm:py-12 lg:py-16 relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto text-center space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-xl border border-[#e5e5e5] rounded-[20px] mb-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-[10px] sm:text-xs font-medium tracking-normal text-neutral-600">
                  SS/2024 Collection
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.92] text-[#0a0a0a]"
              >
                VALUVA
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-light"
              >
                Minimal luxury clothing with timeless design.
                <br className="hidden sm:block" />
                <span className="text-neutral-500">
                  {" "}
                  Crafted for the modern minimalist.
                </span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <Link href="/shop">
                  <Button
                    size="lg"
                    variant="filled"
                    className="rounded-[16px] px-8 py-6 text-base font-medium tracking-normal h-auto bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-[16px] px-8 py-6 text-base font-medium tracking-normal h-auto border-[#e5e5e5] hover:border-[#0a0a0a] bg-white/80 backdrop-blur-sm transition-all duration-300"
                  >
                    Our Story
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Products Section - Creative Layout */}
        <section
          className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#f5f5f5]"
          aria-labelledby="featured-heading"
        >
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
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <h2
                      id="featured-heading"
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[0.95] text-[#0a0a0a]"
                    >
                      Featured
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-400 font-normal pl-[52px]">
                    Curated selection of our finest pieces
                  </p>
                </div>
                <Link
                  href="/shop?isFeatured=true"
                  className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group px-4 py-2 rounded-[12px] hover:bg-[#fafafa]"
                  aria-label="View all featured products"
                >
                  View All
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Products Grid - Enhanced */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : data?.data && data.data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
                  role="list"
                  aria-label="Featured products"
                >
                  {data.data.slice(0, 4).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
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
                  className="text-center py-16"
                >
                  <p className="text-neutral-400 font-normal text-sm">
                    No featured products available.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Recently Viewed Section - Enhanced */}
        <RecentlyViewed />

        {/* Personalized Recommendations Section - Enhanced */}
        {user && (
          <section
            className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#fafafa] to-white border-t border-[#f5f5f5]"
            aria-labelledby="personalized-heading"
          >
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
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h2
                        id="personalized-heading"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
                      >
                        For You
                      </h2>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-400 font-normal pl-[52px]">
                      Personalized recommendations just for you
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 text-sm font-medium tracking-normal text-neutral-600 hover:text-[#0a0a0a] transition-colors group px-4 py-2 rounded-[12px] hover:bg-white"
                    aria-label="View all products"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Products Grid */}
                {isPersonalizedLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : personalizedData && personalizedData.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
                    role="list"
                    aria-label="Personalized product recommendations"
                  >
                    {personalizedData.slice(0, 4).map((rec, index) => (
                      <motion.div
                        key={rec.product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
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

        {/* Trending Products Section - Enhanced */}
        <TrendingProducts limit={8} />

        {/* Philosophy Section - Redesigned */}
        <section
          className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#f5f5f5]"
          aria-labelledby="philosophy-heading"
        >
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto"
            >
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-6 shadow-lg"
                >
                  <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </motion.div>
                <h2
                  id="philosophy-heading"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95] mb-4"
                >
                  Our Philosophy
                </h2>
                <p className="text-base sm:text-lg text-neutral-500 font-light max-w-2xl mx-auto">
                  Built on principles of minimalism, quality, and timeless
                  design
                </p>
              </div>

              {/* Philosophy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {[
                  {
                    title: "Minimalism",
                    description:
                      "VALUVA is built on the principle of minimalism. Every design is intentional, every fabric is carefully selected, and every piece is crafted to last.",
                    icon: "•",
                  },
                  {
                    title: "Craft",
                    description:
                      "Hand-finished in our studio with attention to detail. We utilize sustainable practices to ensure our brand remains ethical and environmentally conscious.",
                    icon: "•",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="bg-white border border-[#e5e5e5] rounded-[24px] p-8 sm:p-10 lg:p-12 space-y-4 hover:border-[#0a0a0a]/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-[12px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                        <span className="text-[#0a0a0a] text-lg font-medium">
                          {item.icon}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#0a0a0a]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - New Creative Addition */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-[#fafafa] to-white border-t border-[#f5f5f5]">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
              >
                Discover Your Style
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-base sm:text-lg text-neutral-600 font-light max-w-2xl mx-auto"
              >
                Explore our complete collection of minimal luxury clothing
                designed for the modern minimalist.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link href="/shop">
                  <Button
                    size="lg"
                    variant="filled"
                    className="rounded-[16px] px-8 py-6 text-base font-medium tracking-normal h-auto bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
