import apiClient from "@/lib/axios";

export interface ReturnRequest {
  id: string;
  userId: string;
  orderId: string;
  orderItemIds: string[];
  reason: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PROCESSING" | "COMPLETED";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const returnsApi = {
  createReturn: async (data: {
    orderId: string;
    orderItemIds: string[];
    reason: string;
    description?: string;
  }): Promise<ReturnRequest> => {
    const response = await apiClient.post("/returns", data);
    return response.data.data;
  },

  getUserReturns: async (): Promise<ReturnRequest[]> => {
    const response = await apiClient.get("/returns");
    return response.data.data;
  },
};

