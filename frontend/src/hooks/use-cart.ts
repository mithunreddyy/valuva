import { toast } from "@/hooks/use-toast";
import { DEFAULT_QUERY_OPTIONS, QUERY_KEYS } from "@/lib/react-query-config";
import { cartApi } from "@/services/api/cart";
import { useCartStore } from "@/store/cart-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCart() {
  const { setItemCount } = useCartStore();

  return useQuery({
    queryKey: QUERY_KEYS.cart,
    queryFn: async () => {
      const result = await cartApi.getCart();
      setItemCount(result.data.itemCount);
      return result;
    },
    ...DEFAULT_QUERY_OPTIONS.cart,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => cartApi.addToCart(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update cart",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    },
  });
}
