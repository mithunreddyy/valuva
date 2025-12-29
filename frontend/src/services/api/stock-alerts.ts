import apiClient from "@/lib/axios";
import {
  ApiResponse,
  CreateStockAlertData,
  PaginatedResponse,
  StockAlert,
} from "@/types";

export const stockAlertsApi = {
  getUserAlerts: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<StockAlert>> => {
    const response = await apiClient.get<PaginatedResponse<StockAlert>>(
      "/stock-alerts",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  createAlert: async (
    data: CreateStockAlertData
  ): Promise<ApiResponse<StockAlert>> => {
    const response = await apiClient.post<ApiResponse<StockAlert>>(
      "/stock-alerts",
      data
    );
    return response.data;
  },

  deleteAlert: async (alertId: string): Promise<void> => {
    await apiClient.delete(`/stock-alerts/${alertId}`);
  },

  deleteAlertByProductId: async (productId: string): Promise<void> => {
    await apiClient.delete(`/stock-alerts/product/${productId}`);
  },

  hasAlert: async (productId: string): Promise<ApiResponse<{ hasAlert: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ hasAlert: boolean }>>(
      `/stock-alerts/check/${productId}`
    );
    return response.data;
  },
};

