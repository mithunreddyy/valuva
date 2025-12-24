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


