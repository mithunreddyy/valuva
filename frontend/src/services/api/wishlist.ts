import apiClient from "@/lib/axios";
import { WishlistItem } from "@/types";

interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
}

/**
 * Wishlist API client
 * Handles all wishlist-related API calls
 */
export const wishlistApi = {
  /**
   * Get user's wishlist
   * @returns Promise with wishlist items array
   */
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await apiClient.get<WishlistResponse>("/wishlist");
    return response.data;
  },

  /**
   * Add product to wishlist
   * @param productId - Product ID to add
   * @returns Promise with updated wishlist items
   */
  addToWishlist: async (productId: string): Promise<WishlistResponse> => {
    const response = await apiClient.post<WishlistResponse>("/wishlist/items", {
      productId,
    });
    return response.data;
  },

  /**
   * Remove product from wishlist
   * @param productId - Product ID to remove
   * @returns Promise with updated wishlist items
   */
  removeFromWishlist: async (
    productId: string
  ): Promise<WishlistResponse> => {
    const response = await apiClient.delete<WishlistResponse>(
      `/wishlist/items/${productId}`
    );
    return response.data;
  },
};
