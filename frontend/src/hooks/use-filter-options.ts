import { productsApi } from "@/services/api/products";
import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  sizes: string[];
  colors: Array<{ name: string; value: string; hex?: string }>;
}

/**
 * Hook to fetch available filter options (sizes and colors)
 * Production-ready: Fetches real data from API
 */
export function useFilterOptions() {
  return useQuery<FilterOptions>({
    queryKey: ["filter-options"],
    queryFn: async () => {
      const response = await productsApi.getFilterOptions();
      return response.data;
    },
    staleTime: 3600000, // 1 hour - filter options don't change frequently
    gcTime: 3600000,
  });
}
