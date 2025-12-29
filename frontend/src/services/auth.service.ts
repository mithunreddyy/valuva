import { apiClient } from "@/lib/api-client";
import { removeStorageItem } from "@/lib/storage";
import {
  ApiResponse,
  AuthResponse,
  ChangePasswordData,
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
  User,
} from "@/types";

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data.data!;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    removeStorageItem("accessToken");
    removeStorageItem("refreshToken");
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data.data!;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<void> => {
    await apiClient.post("/auth/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordData): Promise<void> => {
    await apiClient.post("/auth/reset-password", data);
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
    return response.data.data!;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/users/profile",
      data
    );
    return response.data.data!;
  },

  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await apiClient.post("/users/change-password", data);
  },
};
