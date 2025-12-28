import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(50, "Code must be at most 50 characters")
      .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores"),
    description: z.string().optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    discountValue: z.number().positive("Discount value must be positive"),
    minPurchase: z.number().positive().optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    startsAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid coupon ID"),
  }),
  body: z.object({
    code: z.string().min(3).max(50).optional(),
    description: z.string().optional(),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional(),
    discountValue: z.number().positive().optional(),
    minPurchase: z.number().positive().optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    startsAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteCouponSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid coupon ID"),
  }),
});

