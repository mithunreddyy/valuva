"use client";

import { HorizontalFilters } from "@/app/(main)/shop/horizontal-filters";
import { ShopSort } from "@/app/(main)/shop/shop-sort";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { useProducts } from "@/hooks/use-products";
import { Grid3x3, LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ShopPage() {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-6">
            {/* Title and Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
                  Shop
                </h1>
                {data && (
                  <p className="text-sm text-neutral-500 font-medium tracking-normal">
                    {data.meta.total} {data.meta.total === 1 ? "product" : "products"} found
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ShopSort />
                {/* View Toggle */}
                <div className="hidden md:flex items-center border border-[#e5e5e5] rounded-[10px] overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "hover:bg-[#fafafa]"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 transition-all ${
                      viewMode === "list"
                        ? "bg-[#0a0a0a] text-[#fafafa]"
                        : "hover:bg-[#fafafa]"
                    }`}
                    aria-label="List view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Filters */}
            <HorizontalFilters />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        <div className="w-full">
            {error ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-sm font-medium tracking-normal text-neutral-600">
                  Failed to load products
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium tracking-normal text-[#0a0a0a] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {/* Products Display */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                      ? Array.from({ length: 12 }).map((_, i) => (
                          <ProductCardSkeleton key={i} />
                        ))
                      : data?.data.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {isLoading
                      ? Array.from({ length: limit }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-white border border-[#e5e5e5] p-6 rounded-[10px] animate-pulse"
                          >
                            <div className="flex gap-6">
                              <div className="w-32 h-32 bg-[#e5e5e5] rounded-[8px]"></div>
                              <div className="flex-1 space-y-3">
                                <div className="h-6 bg-[#e5e5e5] w-3/4 rounded"></div>
                                <div className="h-4 bg-[#e5e5e5] w-1/2 rounded"></div>
                                <div className="h-4 bg-[#e5e5e5] w-2/3 rounded"></div>
                              </div>
                            </div>
                          </div>
                        ))
                      : data?.data.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="block bg-white border border-[#e5e5e5] p-6 hover:border-[#0a0a0a] transition-all rounded-[10px]"
                          >
                            <div className="flex gap-6">
                              <div className="relative w-32 h-32 sm:w-40 sm:h-40 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex-shrink-0 rounded-[8px]">
                                {product.images[0]?.url && (
                                  <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-sm font-medium tracking-normal mb-2">
                                    {product.name}
                                  </h3>
                                  <p className="text-xs text-neutral-500 mb-4 line-clamp-2 font-medium">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-base font-medium">
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    }).format(product.basePrice)}
                                  </span>
                                  {product.isNewArrival && (
                                    <span className="px-3 py-1 bg-[#0a0a0a] text-[#fafafa] text-[10px] font-medium tracking-normal rounded-[6px]">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                  </div>
                )}

                {/* Pagination */}
                {data && data.meta.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={data.meta.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && data?.data.length === 0 && (
                  <div className="text-center py-16 space-y-4">
                    <p className="text-base font-medium tracking-normal text-neutral-600">
                      No products found
                    </p>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto font-medium">
                      Try adjusting your filters or browse all products
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-6 py-3 border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#fafafa] transition-all text-sm font-medium tracking-normal rounded-[10px]"
                    >
                      View All Products
                    </Link>
                  </div>
                )}
              </>
            )}
        </div>
      </section>
    </div>
  );
}
