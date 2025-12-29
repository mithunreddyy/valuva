import { z } from "zod";

/**
 * Validation schemas for returns module
 */

export const createReturnRequestSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid order ID format"),
    orderItemIds: z
      .array(z.string().uuid("Invalid order item ID format"))
      .min(1, "At least one order item is required"),
    reason: z
      .string()
      .min(3, "Reason must be at least 3 characters")
      .max(500, "Reason must not exceed 500 characters"),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),
  }),
});

export const updateReturnStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid return request ID format"),
  }),
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED", "PROCESSING", "COMPLETED"], {
      message:
        "Status must be one of: APPROVED, REJECTED, PROCESSING, COMPLETED",
    }),
    adminNotes: z
      .string()
      .max(1000, "Admin notes must not exceed 1000 characters")
      .optional(),
  }),
});

export const getAllReturnsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
