import apiClient from "@/lib/axios";
import {
  CreateReturnRequestData,
  ReturnRequest,
} from "@/types";

export const returnsApi = {
  createReturn: async (
    data: CreateReturnRequestData
  ): Promise<ReturnRequest> => {
    const response = await apiClient.post("/returns", data);
    return response.data.data;
  },

  getUserReturns: async (): Promise<ReturnRequest[]> => {
    const response = await apiClient.get("/returns");
    return response.data.data;
  },
};

