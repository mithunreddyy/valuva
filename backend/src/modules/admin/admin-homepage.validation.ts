import { z } from "zod";

export const createSectionSchema = z.object({
  body: z.object({
    type: z.enum([
      "HERO_BANNER",
      "FEATURED_PRODUCTS",
      "NEW_ARRIVALS",
      "BEST_SELLERS",
      "CATEGORY_SHOWCASE",
      "BANNER",
      "CUSTOM",
    ]),
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    sortOrder: z.number().int().min(0).optional(),
    config: z.record(z.string(), z.any()),
  }),
});

export const updateSectionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid section ID"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    config: z.record(z.string(), z.any()).optional(),
  }),
});
