"use client";

import { ProductCardSkeleton } from "@/components/products/product-card-skeleton";
import { ProductCard } from "@/components/products/products-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Product } from "@/types";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your filters or search terms",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-16 w-16" />}
        title={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages && totalPages > 1 && currentPage && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
