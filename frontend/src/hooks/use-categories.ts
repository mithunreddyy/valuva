import { categoriesApi } from "@/services/api/categories";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all categories
 * @returns React Query hook for categories data
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
  });
}

/**
 * Hook to fetch category by slug
 * @param slug - Category slug identifier
 * @returns React Query hook for category data
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}
