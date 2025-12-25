import apiClient from "@/lib/axios";
import { Order } from "@/types";

interface OrdersResponse {
  success: boolean;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface OrderResponse {
  success: boolean;
  data: Order;
}

export const ordersApi = {
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: Order["status"];
  }): Promise<OrdersResponse> => {
    const response = await apiClient.get("/orders", { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: {
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
  }): Promise<OrderResponse> => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.post(`/orders/${id}/cancel`);
    return response.data;
  },
};

