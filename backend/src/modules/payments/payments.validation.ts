import { z } from "zod";

export const paymentWebhookSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid order ID").optional(),
    transactionId: z.string().optional(),
    status: z
      .enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"])
      .optional(),
    amount: z.number().optional(),
    raw: z.unknown().optional(),
  }),
});

export const confirmPaymentSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    transactionId: z.string().min(1, "Transaction ID is required"),
  }),
});

export const initializeRazorpayPaymentSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
});

export const verifyRazorpayPaymentSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    razorpay_order_id: z.string().min(1, "Razorpay order ID is required"),
    razorpay_payment_id: z.string().min(1, "Razorpay payment ID is required"),
    razorpay_signature: z.string().min(1, "Razorpay signature is required"),
  }),
});


