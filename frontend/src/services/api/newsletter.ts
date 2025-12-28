import apiClient from "@/lib/axios";

export const newsletterApi = {
  subscribe: async (email: string): Promise<void> => {
    await apiClient.post("/newsletter/subscribe", { email });
  },

  unsubscribe: async (email: string, token?: string): Promise<void> => {
    await apiClient.post("/newsletter/unsubscribe", { email, token });
  },
};

