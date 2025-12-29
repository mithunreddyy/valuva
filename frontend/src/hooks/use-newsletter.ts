import { useAppDispatch, useAppSelector } from "@/store";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  clearError,
  resetSubscription,
} from "@/store/slices/newsletterSlice";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for newsletter subscription management
 * Integrates with Redux store for state management
 */
export function useNewsletter() {
  const dispatch = useAppDispatch();
  const { isSubscribed, isSubmitting, error } = useAppSelector(
    (state) => state.newsletter
  );

  // Subscribe to newsletter
  const subscribe = useCallback(
    async (email: string) => {
      try {
        await dispatch(subscribeNewsletter(email)).unwrap();
        toast({
          title: "Subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to subscribe";
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

  // Unsubscribe from newsletter
  const unsubscribe = useCallback(
    async (email: string, token?: string) => {
      try {
        await dispatch(unsubscribeNewsletter({ email, token })).unwrap();
        toast({
          title: "Unsubscribed",
          description: "You have been unsubscribed from our newsletter.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to unsubscribe";
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

  // Reset subscription state
  const handleResetSubscription = useCallback(() => {
    dispatch(resetSubscription());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    isSubscribed,
    isSubmitting,
    error,
    subscribe,
    unsubscribe,
    clearError: handleClearError,
    resetSubscription: handleResetSubscription,
  };
}

