import { z } from "zod";

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    subCategoryId: z.string().uuid().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(["price_asc", "price_desc", "newest", "popular"]).optional(),
    isFeatured: z.string().optional(),
    isNewArrival: z.string().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
});
