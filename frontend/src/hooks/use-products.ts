import { DEFAULT_QUERY_OPTIONS, QUERY_KEYS } from "@/lib/react-query-config";
import { productsApi } from "@/services/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProducts(
  params?: Parameters<typeof productsApi.getProducts>[0]
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, params],
    queryFn: () => productsApi.getProducts(params),
    ...DEFAULT_QUERY_OPTIONS.products,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS.products,
  });
}

export function useRelatedProducts(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.relatedProducts(id),
    queryFn: () => productsApi.getRelatedProducts(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS.products,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.searchProducts(query),
    queryFn: () => productsApi.searchProducts(query),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search (very short)
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
}
