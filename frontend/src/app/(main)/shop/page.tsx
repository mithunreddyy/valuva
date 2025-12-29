"use client";

import { HorizontalFilters } from "@/app/(main)/shop/horizontal-filters";
import { ShopSort } from "@/app/(main)/shop/shop-sort";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Grid3x3, LayoutGrid, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const limit = 24;

  const filters = {
    page: page as number,
    limit,
    categoryId: searchParams.get("categoryId") || undefined,
    subCategoryId: searchParams.get("subCategoryId") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    size: searchParams.get("size") || undefined,
    color: searchParams.get("color") || undefined,
    search: searchParams.get("search") || undefined,
    sort: searchParams.get("sort") as
      | "price_asc"
      | "price_desc"
      | "newest"
      | "popular"
      | undefined,
    isFeatured: searchParams.get("isFeatured") === "true" || undefined,
    isNewArrival: searchParams.get("isNewArrival") === "true" || undefined,
  };

  const { data, isLoading, error } = useProducts(filters);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.com";

  return (
    <>
      {/* Breadcrumbs */}
      <div className="container-luxury pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
          ]}
        />
      </div>

      {/* Collection Structured Data */}
      <StructuredData
        type="Organization"
        data={{
          name: "Valuva Shop",
          description:
            "Browse our complete collection of premium minimal fashion",
          url: `${baseUrl}/shop`,
        }}
      />

      <div className="min-h-screen bg-[#fafafa]">
        {/* Header Section */}
        <section className="bg-white border-b border-[#e5e5e5]">
          <div className="container-luxury py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Title and Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-1.5 sm:space-y-2"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-normal text-[#0a0a0a]">
                    Shop
                  </h1>
                  {data && (
                    <p className="text-xs sm:text-sm text-neutral-500 font-medium tracking-normal">
                      {data.meta.total}{" "}
                      {data.meta.total === 1 ? "product" : "products"} found
                    </p>
                  )}
                </motion.div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <ShopSort />
                  {/* View Toggle */}
                  <div
                    className="hidden md:flex items-center border border-[#e5e5e5] rounded-[16px] overflow-hidden bg-white shadow-sm"
                    role="group"
                    aria-label="View mode"
                  >
                    <button
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                      className={`p-2.5 sm:p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                        viewMode === "grid"
                          ? "bg-[#0a0a0a] text-[#fafafa]"
                          : "hover:bg-[#fafafa] text-[#0a0a0a]"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <div className="w-px h-6 bg-[#e5e5e5]" aria-hidden="true" />
                    <button
                      onClick={() => setViewMode("list")}
                      aria-pressed={viewMode === "list"}
                      className={`p-2.5 sm:p-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 ${
                        viewMode === "list"
                          ? "bg-[#0a0a0a] text-[#fafafa]"
                          : "hover:bg-[#fafafa] text-[#0a0a0a]"
                      }`}
                      aria-label="List view"
                    >
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <HorizontalFilters />
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section
          className="container-luxury py-6 sm:py-8"
          aria-label="Products"
        >
          {isLoading ? (
            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {Array.from({ length: limit }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16 space-y-4"
            >
              <div className="w-16 h-16 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-neutral-300" />
              </div>
              <p className="text-lg font-medium text-[#0a0a0a]">
                Error loading products
              </p>
              <p className="text-sm text-neutral-500 font-medium">
                Please try again later
              </p>
            </motion.div>
          ) : data && data.data.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
                role="list"
                aria-label="Product list"
              >
                <AnimatePresence>
                  {data.data.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      role="listitem"
                    >
                      {viewMode === "grid" ? (
                        <ProductCard product={product} />
                      ) : (
                        <Link
                          href={`/products/${product.slug}`}
                          className="block bg-white border border-[#e5e5e5] rounded-[20px] p-4 sm:p-6 hover:border-[#0a0a0a] hover:shadow-md transition-all group"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-[12px] overflow-hidden bg-[#fafafa] flex-shrink-0">
                              {product.images[0]?.url ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-neutral-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base sm:text-lg font-medium tracking-normal text-[#0a0a0a] line-clamp-2 group-hover:opacity-70 transition-opacity">
                                    {product.name}
                                  </h3>
                                  {product.shortDescription && (
                                    <p className="text-xs sm:text-sm text-neutral-600 font-medium line-clamp-2 mt-1">
                                      {product.shortDescription}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-base sm:text-lg font-medium text-[#0a0a0a]">
                                    {formatPrice(product.basePrice)}
                                  </p>
                                  {product.compareAtPrice && (
                                    <p className="text-xs text-neutral-500 line-through">
                                      {formatPrice(product.compareAtPrice)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {product.isNewArrival && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[#0a0a0a] text-[#fafafa] rounded-[8px]">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {data.meta.totalPages > 1 && (
                <div className="mt-8 sm:mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16 space-y-4"
            >
              <div className="w-16 h-16 rounded-[20px] bg-white border border-[#e5e5e5] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-neutral-300" />
              </div>
              <p className="text-lg font-medium text-[#0a0a0a]">
                No products found
              </p>
              <p className="text-sm text-neutral-500 font-medium">
                Try adjusting your filters
              </p>
              <Link href="/shop">
                <Button variant="outline" className="rounded-[16px] gap-2 mt-4">
                  Clear Filters
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
