import { useAppDispatch, useAppSelector } from "@/store";
import {
  setRazorpayOrderId,
  setRazorpayPaymentId,
  setPaymentProcessing,
  setPaymentSuccess,
  setPaymentFailed,
  setSelectedPaymentMethod,
  resetPayment,
  clearError,
} from "@/store/slices/paymentSlice";
import { useCallback, useEffect } from "react";
import { toast } from "./use-toast";

/**
 * Hook for payment management
 * Integrates with Redux store for payment state management
 */
export function usePayment() {
  const dispatch = useAppDispatch();
  const {
    razorpayOrderId,
    razorpayPaymentId,
    isProcessing,
    paymentStatus,
    selectedPaymentMethod,
    error,
  } = useAppSelector((state) => state.payment);

  // Set Razorpay order ID
  const setOrderId = useCallback(
    (orderId: string) => {
      dispatch(setRazorpayOrderId(orderId));
    },
    [dispatch]
  );

  // Set Razorpay payment ID
  const setPaymentId = useCallback(
    (paymentId: string) => {
      dispatch(setRazorpayPaymentId(paymentId));
    },
    [dispatch]
  );

  // Set payment processing state
  const setProcessing = useCallback(
    (processing: boolean) => {
      dispatch(setPaymentProcessing(processing));
    },
    [dispatch]
  );

  // Mark payment as successful
  const markSuccess = useCallback(() => {
    dispatch(setPaymentSuccess());
    toast({
      title: "Payment successful!",
      description: "Your payment has been processed successfully.",
    });
  }, [dispatch]);

  // Mark payment as failed
  const markFailed = useCallback(
    (errorMessage: string) => {
      dispatch(setPaymentFailed(errorMessage));
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [dispatch]
  );

  // Set selected payment method
  const setPaymentMethod = useCallback(
    (method: string) => {
      dispatch(setSelectedPaymentMethod(method));
    },
    [dispatch]
  );

  // Reset payment state
  const reset = useCallback(() => {
    dispatch(resetPayment());
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      handleClearError();
    }
  }, [error, handleClearError]);

  return {
    razorpayOrderId,
    razorpayPaymentId,
    isProcessing,
    paymentStatus,
    selectedPaymentMethod,
    error,
    setOrderId,
    setPaymentId,
    setProcessing,
    markSuccess,
    markFailed,
    setPaymentMethod,
    reset,
    clearError: handleClearError,
  };
}

