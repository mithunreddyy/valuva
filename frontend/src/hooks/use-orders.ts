import { DEFAULT_QUERY_OPTIONS, QUERY_KEYS } from "@/lib/react-query-config";
import { toast } from "@/hooks/use-toast";
import { ordersApi } from "@/services/api/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrders(params?: Parameters<typeof ordersApi.getOrders>[0]) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders, params],
    queryFn: () => ordersApi.getOrders(params),
    ...DEFAULT_QUERY_OPTIONS.orders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.order(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS.orders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create order",
        variant: "destructive",
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    },
  });
}

