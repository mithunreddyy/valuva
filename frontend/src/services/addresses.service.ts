import { apiClient } from "@/lib/api-client";
import { Address, AddressFormData, ApiResponse } from "@/types";

export const addressesService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<ApiResponse<Address[]>>("/addresses");
    return response.data.data!;
  },

  getAddressById: async (id: string): Promise<Address> => {
    const response = await apiClient.get<ApiResponse<Address>>(
      `/addresses/${id}`
    );
    return response.data.data!;
  },

  createAddress: async (data: AddressFormData): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
      "/addresses",
      data
    );
    return response.data.data!;
  },

  updateAddress: async (
    id: string,
    data: Partial<AddressFormData>
  ): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(
      `/addresses/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },
};
