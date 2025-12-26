import { apiClient } from "@/lib/api-client";
import { Address, ApiResponse } from "@/types";

export interface AddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

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

  createAddress: async (data: AddressData): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>(
      "/addresses",
      data
    );
    return response.data.data!;
  },

  updateAddress: async (
    id: string,
    data: Partial<AddressData>
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
