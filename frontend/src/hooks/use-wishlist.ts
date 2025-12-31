import { DEFAULT_QUERY_OPTIONS, QUERY_KEYS } from "@/lib/react-query-config";
import { wishlistApi } from "@/services/api/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch user's wishlist
 * @returns React Query hook for wishlist data
 */
export function useWishlist() {
  return useQuery({
    queryKey: QUERY_KEYS.wishlist,
    queryFn: () => wishlistApi.getWishlist(),
    ...DEFAULT_QUERY_OPTIONS.wishlist,
  });
}

/**
 * Hook to add product to wishlist
 * @returns Mutation hook for adding to wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    onSuccess: () => {
      // Invalidate and refetch wishlist after adding
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
    },
  });
}

/**
 * Hook to remove product from wishlist
 * @returns Mutation hook for removing from wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      // Invalidate and refetch wishlist after removing
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist });
    },
  });
}
