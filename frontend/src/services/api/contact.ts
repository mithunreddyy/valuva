import apiClient from "@/lib/axios";
import { ContactFormData, ContactResponse } from "@/types";

export const contactApi = {
  submitContact: async (data: ContactFormData): Promise<ContactResponse> => {
    const response = await apiClient.post<ContactResponse>("/contact", data);
    return response.data;
  },
};
