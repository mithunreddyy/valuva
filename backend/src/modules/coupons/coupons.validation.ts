import { z } from "zod";

export const validateCouponSchema = z.object({
  params: z.object({
    code: z.string().min(1, "Coupon code is required"),
  }),
});

export const listCouponsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});


