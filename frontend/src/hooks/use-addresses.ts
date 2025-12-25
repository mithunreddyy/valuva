import { toast } from "@/hooks/use-toast";
import { addressesApi } from "@/services/api/addresses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const result = await addressesApi.getAddresses();
      return result;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressesApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Address added successfully",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add address",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof addressesApi.updateAddress>[1] }) =>
      addressesApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Address updated successfully",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update address",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressesApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete address",
        variant: "destructive",
      });
    },
  });
}

