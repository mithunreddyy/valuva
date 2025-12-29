import { useAppDispatch, useAppSelector } from "@/store";
import {
  createReturnRequest,
  fetchUserReturns,
  clearError,
  clearCurrentReturn,
} from "@/store/slices/returnsSlice";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for return request management
 * Integrates with Redux store for state management
 */
export function useReturns() {
  const dispatch = useAppDispatch();
  const { returns, currentReturn, isLoading, error } = useAppSelector(
    (state) => state.returns
  );

  // Fetch user returns
  const loadReturns = useCallback(() => {
    dispatch(fetchUserReturns());
  }, [dispatch]);

  // Create return request
  const createReturn = useCallback(
    async (data: {
      orderId: string;
      orderItemIds: string[];
      reason: string;
      description?: string;
    }) => {
      try {
        const result = await dispatch(createReturnRequest(data)).unwrap();
        toast({
          title: "Return request created",
          description: "Your return request has been submitted successfully.",
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create return request";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw err;
      }
    },
    [dispatch]
  );

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear current return
  const handleClearCurrentReturn = useCallback(() => {
    dispatch(clearCurrentReturn());
  }, [dispatch]);

  // Auto-load returns on mount
  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    returns,
    currentReturn,
    isLoading,
    error,
    loadReturns,
    createReturn,
    clearError: handleClearError,
    clearCurrentReturn: handleClearCurrentReturn,
  };
}

