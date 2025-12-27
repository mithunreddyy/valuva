import { trackingApi } from "@/services/api/tracking";
import { useQuery } from "@tanstack/react-query";

export function useOrderTracking(orderNumber: string) {
  return useQuery({
    queryKey: ["order-tracking", orderNumber],
    queryFn: () => trackingApi.trackOrder(orderNumber),
    enabled: !!orderNumber,
  });
}

export function usePublicOrderTracking(orderNumber: string, email: string) {
  return useQuery({
    queryKey: ["public-order-tracking", orderNumber, email],
    queryFn: () => trackingApi.trackOrderPublic(orderNumber, email),
    enabled: !!orderNumber && !!email,
  });
}

