"use client";

import { ShopFilters } from "@/app/(main)/shop/shop-filters";
import { ShopSort } from "@/app/(main)/shop/shop-sort";
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/products-card";
import { Pagination } from "@/components/ui/pagination";
import { useProducts } from "@/hooks/use-products";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const limit = 20;

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
    <div className="relative z-10 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          {data && (
            <p className="text-neutral-600 mt-2">
              {data.meta.total} products found
            </p>
          )}
        </div>
        <ShopSort />
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ShopFilters />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {error ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">Failed to load products</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? Array.from({ length: limit }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  : data?.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
              </div>

              {data && data.meta.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={page}
                    totalPages={data.meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}

              {!isLoading && data?.data.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-600">No products found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
