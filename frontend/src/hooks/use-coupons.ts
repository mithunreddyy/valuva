import { couponsApi } from "@/services/api/coupons";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all available coupons
 * @returns React Query hook for coupons data
 */
export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: () => couponsApi.getCoupons(),
  });
}

/**
 * Hook to fetch coupon by code
 * @param code - Coupon code
 * @returns React Query hook for coupon data
 */
export function useCoupon(code: string) {
  return useQuery({
    queryKey: ["coupon", code],
    queryFn: () => couponsApi.getCouponByCode(code),
    enabled: !!code,
  });
}

/**
 * Hook to validate coupon code
 * @returns Mutation hook for validating coupon
 */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      couponsApi.validateCoupon(code, amount),
  });
}

