import { productsApi } from "@/services/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProducts(
  params?: Parameters<typeof productsApi.getProducts>[0]
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
}

export function useRelatedProducts(id: string) {
  return useQuery({
    queryKey: ["related-products", id],
    queryFn: () => productsApi.getRelatedProducts(id),
    enabled: !!id,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ["search-products", query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: query.length > 0,
  });
}
