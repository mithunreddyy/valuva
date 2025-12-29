import { toast } from "@/hooks/use-toast";
import {
  paymentsService,
  RazorpayPaymentVerification,
} from "@/services/payments.service";
import { useMutation } from "@tanstack/react-query";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentVerification) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export const useRazorpay = () => {
  const initializePayment = useMutation({
    mutationFn: paymentsService.initializeRazorpayPayment,
  });

  const verifyPayment = useMutation({
    mutationFn: ({
      orderId,
      paymentData,
    }: {
      orderId: string;
      paymentData: RazorpayPaymentVerification;
    }) => paymentsService.verifyRazorpayPayment(orderId, paymentData),
  });

  /**
   * Load Razorpay checkout script
   */
  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };

  /**
   * Open Razorpay checkout
   */
  const openRazorpayCheckout = async (
    orderId: string,
    onSuccess: (orderId: string) => void,
    onError?: (error: string) => void
  ) => {
    try {
      // Load Razorpay script
      await loadRazorpayScript();

      // Initialize payment
      const razorpayOrder = await initializePayment.mutateAsync(orderId);

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      // Convert amount string to number (amount is in paise)
      const amountInPaise = Math.round(parseFloat(razorpayOrder.amount) * 100);

      const options: RazorpayOptions = {
        key: razorpayOrder.keyId,
        amount: amountInPaise,
        currency: razorpayOrder.currency,
        name: "VALUVA",
        description: `Order ${razorpayOrder.receipt}`,
        order_id: razorpayOrder.orderId,
        handler: async function (response: RazorpayPaymentVerification) {
          try {
            // Verify payment on backend
            const verification = await verifyPayment.mutateAsync({
              orderId,
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verification.success) {
              toast({
                title: "Payment successful!",
                description: "Your payment has been processed successfully.",
              });
              onSuccess(orderId);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: unknown) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment verification failed",
              description:
                (
                  error as unknown as {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ||
                (error as unknown as string) ||
                "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
            onError?.(
              (error as unknown as string) || "Payment verification failed"
            );
          }
        },
        prefill: {
          // These can be populated from user data if available
        },
        theme: {
          color: "#0a0a0a",
        },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment cancelled",
              description: "You cancelled the payment process.",
            });
            onError?.("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: unknown) {
      console.error("Razorpay checkout error:", error);
      toast({
        title: "Payment initialization failed",
        description:
          (error as unknown as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ||
          (error as unknown as string) ||
          "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      onError?.(
        (error as unknown as string) || "Payment initialization failed"
      );
    }
  };

  return {
    openRazorpayCheckout,
    isLoading: initializePayment.isPending || verifyPayment.isPending,
  };
};
