"use client";

import { ProductCard } from "./ProductCard";
import { useRecommendations } from "@/hooks/use-recommendations";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductRecommendationsProps {
  productId: string;
}

export function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const { similarProducts, frequentlyBought } = useRecommendations(productId);

  return (
    <div className="space-y-12">
      {similarProducts.data && similarProducts.data.length > 0 && (
        <section>
          <h2 className="text-2xl font-medium mb-6">You May Also Like</h2>
          {similarProducts.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}

      {frequentlyBought.data && frequentlyBought.data.length > 0 && (
        <section>
          <h2 className="text-2xl font-medium mb-6">Frequently Bought Together</h2>
          {frequentlyBought.isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {frequentlyBought.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

