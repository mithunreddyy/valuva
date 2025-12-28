import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/services/api/recommendations";
import { Product } from "@/types";

export function useRecommendations(productId?: string) {
  const similarProducts = useQuery<Product[]>({
    queryKey: ["recommendations", "similar", productId],
    queryFn: () => recommendationsApi.getSimilarProducts(productId!),
    enabled: !!productId,
  });

  const frequentlyBought = useQuery<Product[]>({
    queryKey: ["recommendations", "frequently-bought", productId],
    queryFn: () => recommendationsApi.getFrequentlyBoughtTogether(productId!),
    enabled: !!productId,
  });

  return {
    similarProducts,
    frequentlyBought,
  };
}

export function useRecentlyViewed() {
  return useQuery<Product[]>({
    queryKey: ["recommendations", "recently-viewed"],
    queryFn: () => recommendationsApi.getRecentlyViewed(),
  });
}

