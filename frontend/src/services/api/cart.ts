import apiClient from "@/lib/axios";
import { Cart } from "@/types";

export const cartApi = {
  getCart: async (): Promise<{ success: boolean; data: Cart }> => {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  addToCart: async (
    variantId: string,
    quantity: number
  ): Promise<{ success: boolean; data: Cart }> => {
    const response = await apiClient.post("/cart/items", {
      variantId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (
    itemId: string,
    quantity: number
  ): Promise<{ success: boolean; data: Cart }> => {
    const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (
    itemId: string
  ): Promise<{ success: boolean; data: Cart }> => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<{ success: boolean; data: Cart }> => {
    const response = await apiClient.delete("/cart");
    return response.data;
  },
};
