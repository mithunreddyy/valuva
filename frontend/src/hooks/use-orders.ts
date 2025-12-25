import { toast } from "@/hooks/use-toast";
import { ordersApi } from "@/services/api/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrders(params?: Parameters<typeof ordersApi.getOrders>[0]) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

