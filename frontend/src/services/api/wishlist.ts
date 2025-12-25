import apiClient from "@/lib/axios";

export const wishlistApi = {
  getWishlist: async () => {
    const response = await apiClient.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (productId: string) => {
    const response = await apiClient.post("/wishlist/items", { productId });
    return response.data;
  },

  removeFromWishlist: async (productId: string) => {
    const response = await apiClient.delete(`/wishlist/items/${productId}`);
    return response.data;
  },
};
