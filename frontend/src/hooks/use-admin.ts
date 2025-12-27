import { adminApi } from "@/services/api/admin";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch admin dashboard stats
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      return response.data;
    },
  });
}

/**
 * Hook to fetch all orders (admin)
 */
export function useAdminOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: async () => {
      const response = await adminApi.getOrders(params);
      return response.data;
    },
  });
}

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      trackingNumber,
    }: {
      orderId: string;
      status: string;
      trackingNumber?: string;
    }) => adminApi.updateOrderStatus(orderId, status, trackingNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/**
 * Hook to fetch all users (admin)
 */
export function useAdminUsers(params?: {
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
}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const response = await adminApi.getUsers(params);
      return response.data;
    },
  });
}

/**
 * Hook to update user status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.updateUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

/**
 * Hook to fetch admin products
 */
export function useAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: async () => {
      const response = await adminApi.getProducts(params);
      return response.data;
    },
  });
}

/**
 * Hook to create product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * Hook to fetch analytics
 */
export function useAdminAnalytics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["admin-analytics", params],
    queryFn: async () => {
      const response = await adminApi.getAnalytics(params);
      return response.data;
    },
  });
}

/**
 * Hook to fetch revenue trends
 */
export function useRevenueTrends(params?: {
  startDate?: string;
  endDate?: string;
  groupBy?: "day" | "week" | "month";
}) {
  return useQuery({
    queryKey: ["revenue-trends", params],
    queryFn: async () => {
      const response = await adminApi.getRevenueTrends(params);
      return response.data;
    },
  });
}

/**
 * Hook to fetch top products
 */
export function useTopProducts(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ["top-products", params],
    queryFn: async () => {
      const response = await adminApi.getTopProducts(params);
      return response.data;
    },
  });
}

/**
 * Hook to fetch active orders for tracking
 */
export function useActiveOrders() {
  return useQuery({
    queryKey: ["active-orders"],
    queryFn: async () => {
      const response = await adminApi.getActiveOrders();
      return response.data;
    },
  });
}

/**
 * Hook to update order tracking
 */
export function useUpdateOrderTracking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      location,
      description,
    }: {
      orderId: string;
      status: string;
      location: string;
      description: string;
    }) => adminApi.updateOrderTracking(orderId, status, location, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

/**
 * Hook to add tracking update
 */
export function useAddTrackingUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      location,
      description,
      timestamp,
    }: {
      orderId: string;
      status: string;
      location: string;
      description: string;
      timestamp?: string;
    }) =>
      adminApi.addTrackingUpdate(
        orderId,
        status,
        location,
        description,
        timestamp
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
    },
  });
}
