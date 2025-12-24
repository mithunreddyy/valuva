import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
    rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    comment: z.string().min(10, "Comment must be at least 10 characters"),
  }),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review ID"),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().min(3).optional(),
    comment: z.string().min(10).optional(),
  }),
});

export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review ID"),
  }),
});

export const getProductReviewsSchema = z.object({
  params: z.object({
    productId: z.string().uuid("Invalid product ID"),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    rating: z.string().optional(),
  }),
});

export const approveReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid review ID"),
  }),
  body: z.object({
    isApproved: z.boolean(),
  }),
});
