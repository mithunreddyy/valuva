import apiClient from "@/lib/axios";
import { ApiResponse, OrderTracking } from "@/types";

export const trackingApi = {
  trackOrder: async (
    orderNumber: string
  ): Promise<ApiResponse<OrderTracking>> => {
    const response = await apiClient.get<ApiResponse<OrderTracking>>(
      `/tracking/${orderNumber}`
    );
    return response.data;
  },

  trackOrderPublic: async (
    orderNumber: string,
    email: string
  ): Promise<ApiResponse<OrderTracking>> => {
    const response = await apiClient.post<ApiResponse<OrderTracking>>(
      `/tracking/public`,
      { orderNumber, email }
    );
    return response.data;
  },

  getTrackingUpdates: async (
    orderNumber: string
  ): Promise<ApiResponse<OrderTracking>> => {
    const response = await apiClient.get<ApiResponse<OrderTracking>>(
      `/tracking/${orderNumber}/updates`
    );
    return response.data;
  },
};

