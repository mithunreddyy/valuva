import { homepageApi } from "@/services/api/homepage";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch homepage sections
 * @returns React Query hook for homepage sections
 */
export function useHomepageSections() {
  return useQuery({
    queryKey: ["homepage", "sections"],
    queryFn: () => homepageApi.getSections(),
  });
}

/**
 * Hook to fetch featured products
 * @param limit - Optional limit for number of products
 * @returns React Query hook for featured products
 */
export function useFeaturedProducts(limit?: number) {
  return useQuery({
    queryKey: ["homepage", "featured", limit],
    queryFn: () => homepageApi.getFeaturedProducts(limit),
  });
}

/**
 * Hook to fetch new arrival products
 * @param limit - Optional limit for number of products
 * @returns React Query hook for new arrival products
 */
export function useNewArrivals(limit?: number) {
  return useQuery({
    queryKey: ["homepage", "new-arrivals", limit],
    queryFn: () => homepageApi.getNewArrivals(limit),
  });
}

