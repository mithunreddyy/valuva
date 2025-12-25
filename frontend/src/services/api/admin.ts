import apiClient from "@/lib/axios";
import { Category, Product } from "@/types";

export const adminApi = {
  // Products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    subCategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    search?: string;
    sort?: "price_asc" | "price_desc" | "newest" | "popular";
    isFeatured?: boolean;
    isNewArrival?: boolean;
  }) => {
    const response = await apiClient.get("/admin/products", { params });
    return response.data;
  },

  createProduct: async (data: Product) => {
    const response = await apiClient.post<{ success: boolean; data: Product }>(
      "/admin/products",
      data
    );
    return response.data;
  },
  updateOrderStatus: async (
    orderId: string,
    status: string,
    trackingNumber?: string
  ) => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
      status,
      trackingNumber,
    });
    return response.data;
  },

  // Users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?:
      | "name_asc"
      | "name_desc"
      | "email_asc"
      | "email_desc"
      | "createdAt_asc"
      | "createdAt_desc";
  }) => {
    const response = await apiClient.get("/admin/users", { params });
    return response.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
  },

  createCategory: async (data: Category) => {
    const response = await apiClient.post<{ success: boolean; data: Category }>(
      "/admin/categories",
      data
    );
    return response.data;
  },

  // Analytics
  getAnalytics: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get("/analytics/sales-metrics", {
      params,
    });
    return response.data;
  },

  getRevenueTrends: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get("/analytics/revenue-trends", {
      params,
    });
    return response.data;
  },

  getTopProducts: async (params?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get("/analytics/top-products", { params });
    return response.data;
  },
};
