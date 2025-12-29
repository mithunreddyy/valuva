import apiClient from "@/lib/axios";
import {
  Category,
  Coupon,
  HomepageSection,
  InventoryUpdateData,
  Product,
  ProductImageData,
  ProductVariantData,
  SubCategory,
} from "@/types";

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

  getProductById: async (id: string) => {
    const response = await apiClient.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (data: Product) => {
    const response = await apiClient.post<{ success: boolean; data: Product }>(
      "/admin/products",
      data
    );
    return response.data;
  },

  updateProduct: async (id: string, data: Product) => {
    const response = await apiClient.put<{ success: boolean; data: Product }>(
      `/admin/products/${id}`,
      data
    );
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },

  addProductImage: async (data: ProductImageData) => {
    const response = await apiClient.post("/admin/images", data);
    return response.data;
  },

  deleteProductImage: async (imageId: string) => {
    const response = await apiClient.delete(`/admin/images/${imageId}`);
    return response.data;
  },

  createVariant: async (data: ProductVariantData) => {
    const response = await apiClient.post("/admin/variants", data);
    return response.data;
  },

  updateVariant: async (id: string, data: Partial<ProductVariantData>) => {
    const response = await apiClient.put(`/admin/variants/${id}`, data);
    return response.data;
  },

  updateInventory: async (data: InventoryUpdateData) => {
    const response = await apiClient.patch(
      `/admin/variants/${data.variantId}/inventory`,
      {
        change: data.change,
        reason: data.reason,
        notes: data.notes,
      }
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

  getCategoryById: async (id: string) => {
    const response = await apiClient.get(`/admin/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Category) => {
    const response = await apiClient.post<{ success: boolean; data: Category }>(
      "/admin/categories",
      data
    );
    return response.data;
  },

  updateCategory: async (id: string, data: Category) => {
    const response = await apiClient.put<{ success: boolean; data: Category }>(
      `/admin/categories/${id}`,
      data
    );
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // SubCategories
  createSubCategory: async (data: SubCategory) => {
    const response = await apiClient.post("/admin/subcategories", data);
    return response.data;
  },

  updateSubCategory: async (id: string, data: SubCategory) => {
    const response = await apiClient.put(`/admin/subcategories/${id}`, data);
    return response.data;
  },

  deleteSubCategory: async (id: string) => {
    const response = await apiClient.delete(`/admin/subcategories/${id}`);
    return response.data;
  },

  // Homepage Sections
  getHomepageSections: async () => {
    const response = await apiClient.get("/admin/homepage/sections");
    return response.data;
  },

  getHomepageSectionById: async (id: string) => {
    const response = await apiClient.get(`/admin/homepage/sections/${id}`);
    return response.data;
  },

  createHomepageSection: async (data: HomepageSection) => {
    const response = await apiClient.post("/admin/homepage/sections", data);
    return response.data;
  },

  updateHomepageSection: async (id: string, data: HomepageSection) => {
    const response = await apiClient.put(
      `/admin/homepage/sections/${id}`,
      data
    );
    return response.data;
  },

  deleteHomepageSection: async (id: string) => {
    const response = await apiClient.delete(`/admin/homepage/sections/${id}`);
    return response.data;
  },

  reorderHomepageSections: async (
    sections: Array<{ id: string; sortOrder: number }>
  ) => {
    const response = await apiClient.post("/admin/homepage/sections/reorder", {
      sections,
    });
    return response.data;
  },

  // Reviews
  getReviews: async (params?: {
    page?: number;
    limit?: number;
    productId?: string;
    isApproved?: boolean;
  }) => {
    const response = await apiClient.get("/reviews/admin/all", { params });
    return response.data;
  },

  approveReview: async (id: string, isApproved: boolean = true) => {
    const response = await apiClient.patch(`/reviews/${id}/approve`, {
      isApproved,
    });
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`);
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

  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  // Orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await apiClient.get("/admin/orders", { params });
    return response.data;
  },

  // Order Tracking
  getActiveOrders: async () => {
    const response = await apiClient.get("/order-tracking/admin/active-orders");
    return response.data;
  },

  updateOrderTracking: async (
    orderId: string,
    status: string,
    location: string,
    description: string
  ) => {
    const response = await apiClient.patch(
      `/order-tracking/admin/${orderId}/update`,
      { status, location, description }
    );
    return response.data;
  },

  addTrackingUpdate: async (
    orderId: string,
    status: string,
    location: string,
    description: string,
    timestamp?: string
  ) => {
    const response = await apiClient.post(
      `/order-tracking/admin/${orderId}/tracking-update`,
      { status, location, description, timestamp }
    );
    return response.data;
  },

  // Customer Analytics
  getCustomerAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get("/analytics/customer-analytics", {
      params,
    });
    return response.data;
  },

  // Inventory Insights
  getInventoryInsights: async () => {
    const response = await apiClient.get("/analytics/inventory-insights");
    return response.data;
  },

  // Category Performance
  getCategoryPerformance: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get("/analytics/category-performance", {
      params,
    });
    return response.data;
  },

  // Coupons
  getCoupons: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: string;
  }) => {
    const response = await apiClient.get("/admin/coupons", { params });
    return response.data;
  },

  getCouponById: async (id: string) => {
    const response = await apiClient.get(`/admin/coupons/${id}`);
    return response.data;
  },

  createCoupon: async (data: Coupon) => {
    const response = await apiClient.post("/admin/coupons", data);
    return response.data;
  },

  updateCoupon: async (id: string, data: Coupon) => {
    const response = await apiClient.patch(`/admin/coupons/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id: string) => {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  toggleCouponStatus: async (id: string) => {
    const response = await apiClient.patch(`/admin/coupons/${id}/toggle`);
    return response.data;
  },
};
