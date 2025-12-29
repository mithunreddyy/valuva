import { useAppDispatch, useAppSelector } from "@/store";
import {
  submitContactForm,
  resetSuccess,
  clearError,
} from "@/store/slices/contactSlice";
import { ContactFormData } from "@/services/api/contact";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for contact form management
 * Integrates with Redux store for state management
 */
export function useContact() {
  const dispatch = useAppDispatch();
  const { isSubmitting, isSuccess, error } = useAppSelector(
    (state) => state.contact
  );

  // Submit contact form
  const submitForm = useCallback(
    async (data: ContactFormData) => {
      try {
        await dispatch(submitContactForm(data)).unwrap();
        toast({
          title: "Message sent!",
          description: "We'll get back to you soon.",
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
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

  // Reset success state
  const handleResetSuccess = useCallback(() => {
    dispatch(resetSuccess());
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-reset success after 5 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        handleResetSuccess();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, handleResetSuccess]);

  // Handle errors
  useEffect(() => {
    if (error) {
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    isSubmitting,
    isSuccess,
    error,
    submitForm,
    resetSuccess: handleResetSuccess,
    clearError: handleClearError,
  };
}

