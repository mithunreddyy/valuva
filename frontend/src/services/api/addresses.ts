import apiClient from "@/lib/axios";
import { Address } from "@/types";

interface AddressesResponse {
  success: boolean;
  data: Address[];
}

interface AddressResponse {
  success: boolean;
  data: Address;
}

export const addressesApi = {
  getAddresses: async (): Promise<AddressesResponse> => {
    const response = await apiClient.get("/addresses");
    return response.data;
  },

  getAddressById: async (id: string): Promise<AddressResponse> => {
    const response = await apiClient.get(`/addresses/${id}`);
    return response.data;
  },

  createAddress: async (
    data: Omit<Address, "id">
  ): Promise<AddressResponse> => {
    const response = await apiClient.post("/addresses", data);
    return response.data;
  },

  updateAddress: async (
    id: string,
    data: Partial<Omit<Address, "id">>
  ): Promise<AddressResponse> => {
    const response = await apiClient.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },
};

