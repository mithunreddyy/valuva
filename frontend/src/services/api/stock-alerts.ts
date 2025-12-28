import apiClient from "@/lib/axios";

export interface StockAlert {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
  };
}

export const stockAlertsApi = {
  getUserAlerts: async (): Promise<StockAlert[]> => {
    const response = await apiClient.get("/stock-alerts");
    return response.data.data;
  },

  createAlert: async (productId: string): Promise<StockAlert> => {
    const response = await apiClient.post("/stock-alerts", { productId });
    return response.data.data;
  },

  deleteAlert: async (productId: string): Promise<void> => {
    await apiClient.delete(`/stock-alerts/${productId}`);
  },
};

