import apiClient from "@/lib/axios";
import { User } from "@/types";

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  },

  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.get<{ success: boolean; data: User }>(
      "/users/profile"
    );
    return response.data;
  },

  updateProfile: async (
    data: Partial<User>
  ): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.put<{ success: boolean; data: User }>(
      "/users/profile",
      data
    );
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await apiClient.post("/users/change-password", data);
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get("/auth/verify-email", { params: { token } });
  },

  resendVerification: async (): Promise<void> => {
    await apiClient.post("/auth/resend-verification");
  },
};
