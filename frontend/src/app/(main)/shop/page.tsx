"use client";

import { HorizontalFilters } from "@/app/(main)/shop/horizontal-filters";
import { MobileFiltersDrawer } from "@/app/(main)/shop/mobile-filters-drawer";
import { ShopSort } from "@/app/(main)/shop/shop-sort";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { formatPrice } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Filter,
  Grid3x3,
  LayoutGrid,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
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
  const { data: categoriesData } = useCategories();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valuva.in";

  // Build breadcrumb items based on filters
  const breadcrumbItems = useMemo(() => {
    const items: Array<{ name: string; url: string; isBold?: boolean }> = [
      { name: "Home", url: "/" },
      { name: "Shop", url: "/shop" },
    ];

    if (filters.categoryId && categoriesData?.data) {
      const category = categoriesData.data.find(
        (c) => c.id === filters.categoryId
      );
      if (category) {
        items.push({
          name: category.name,
          url: `/shop?categoryId=${category.id}`,
        });

        // Add subcategory if selected
        if (filters.subCategoryId && category.subCategories) {
          const subCategory = category.subCategories.find(
            (sc) => sc.id === filters.subCategoryId
          );
          if (subCategory) {
            items.push({
              name: subCategory.name,
              url: `/shop?categoryId=${category.id}&subCategoryId=${subCategory.id}`,
              isBold: true,
            });
          }
        } else if (!filters.subCategoryId) {
          // Make category bold if it's the last item
          items[items.length - 1] = {
            ...items[items.length - 1],
            isBold: true,
          };
        }
      }
    } else {
      // Make "Shop" bold if no category selected
      items[items.length - 1] = { ...items[items.length - 1], isBold: true };
    }

    return items;
  }, [filters.categoryId, filters.subCategoryId, categoriesData]);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="container-luxury pt-2 sm:pt-4 pb-2 sm:pb-4">
        <Breadcrumbs items={breadcrumbItems} />
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

      <div className="min-h-screen bg-white">
        {/* Hero Header - Modern Minimalist */}
        <section className="relative border-b border-[#f5f5f5] bg-gradient-to-b from-white via-white to-[#fafafa]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.01),transparent_70%)]" />
          <div className="container-luxury py-8 sm:py-10 md:py-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Title Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-[#0a0a0a] leading-[0.95]"
                  >
                    Shop
                  </motion.h1>
                  {data && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-xs sm:text-sm text-neutral-400 font-normal"
                    >
                      {data.meta.total}{" "}
                      {data.meta.total === 1 ? "product" : "products"} available
                    </motion.p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="md:hidden flex items-center gap-2 rounded-[12px] border-[#e5e5e5] hover:border-[#0a0a0a] bg-white h-10"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="text-xs font-medium">Filters</span>
                  </Button>

                  <ShopSort />
                  {/* View Toggle - Refined */}
                  <div
                    className="hidden md:flex items-center bg-[#f5f5f5] rounded-[14px] p-1.5 gap-1"
                    role="group"
                    aria-label="View mode"
                  >
                    <button
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                      className={`p-2.5 transition-all duration-300 rounded-[10px] ${
                        viewMode === "grid"
                          ? "bg-white text-[#0a0a0a] shadow-sm"
                          : "text-neutral-400 hover:text-[#0a0a0a]"
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3x3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      aria-pressed={viewMode === "list"}
                      className={`p-2.5 transition-all duration-300 rounded-[10px] ${
                        viewMode === "list"
                          ? "bg-white text-[#0a0a0a] shadow-sm"
                          : "text-neutral-400 hover:text-[#0a0a0a]"
                      }`}
                      aria-label="List view"
                    >
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters - Desktop Only */}
              <div className="hidden md:block">
                <HorizontalFilters />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mobile Filters Drawer */}
        <MobileFiltersDrawer
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {/* Products Grid - Modern Layout */}
        <section
          className="container-luxury py-10 sm:py-12 md:py-16"
          aria-label="Products"
        >
          {isLoading ? (
            <div
              className={`grid gap-2 sm:gap-3 lg:gap-4 ${
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
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-20 sm:py-24 space-y-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
              >
                <ShoppingBag className="h-7 w-7 text-neutral-400" />
              </motion.div>
              <p className="text-base font-normal text-[#0a0a0a]">
                Error loading products
              </p>
              <p className="text-xs text-neutral-400 font-normal">
                Please try again later
              </p>
            </motion.div>
          ) : data && data.data.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`grid gap-2 sm:gap-3 lg:gap-4 ${
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
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      role="listitem"
                    >
                      {viewMode === "grid" ? (
                        <ProductCard product={product} />
                      ) : (
                        <Link
                          href={`/products/${product.slug}`}
                          className="group block bg-white border border-[#f5f5f5] rounded-[20px] p-6 hover:border-[#e5e5e5] hover:shadow-sm transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                            <div className="relative w-full sm:w-36 h-56 sm:h-36 rounded-[16px] overflow-hidden bg-[#fafafa] flex-shrink-0">
                              {product.images[0]?.url ? (
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-7 w-7 text-neutral-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base sm:text-lg font-normal tracking-normal text-[#0a0a0a] line-clamp-2 group-hover:opacity-70 transition-opacity">
                                    {product.name}
                                  </h3>
                                  {product.shortDescription && (
                                    <p className="text-xs sm:text-sm text-neutral-400 font-normal line-clamp-2 mt-2">
                                      {product.shortDescription}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-base sm:text-lg font-normal text-[#0a0a0a]">
                                    {formatPrice(product.basePrice)}
                                  </p>
                                  {product.compareAtPrice && (
                                    <p className="text-xs text-neutral-400 line-through mt-0.5">
                                      {formatPrice(product.compareAtPrice)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {product.isNewArrival && (
                                <span className="inline-block px-2.5 py-1 text-[10px] font-normal bg-[#0a0a0a] text-white rounded-[8px] tracking-wide uppercase">
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-12 sm:mt-16"
                >
                  <Pagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={setPage}
                  />
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-20 sm:py-24 space-y-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto"
              >
                <ShoppingBag className="h-7 w-7 text-neutral-400" />
              </motion.div>
              <p className="text-base font-normal text-[#0a0a0a]">
                No products found
              </p>
              <p className="text-xs text-neutral-400 font-normal">
                Try adjusting your filters
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="pt-3"
              >
                <Link href="/shop">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    Clear Filters
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
