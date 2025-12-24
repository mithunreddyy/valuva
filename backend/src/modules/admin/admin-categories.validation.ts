import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().url().optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid category ID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createSubCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Subcategory name is required"),
    categoryId: z.string().uuid("Invalid category ID"),
    description: z.string().optional(),
    image: z.string().url().optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

export const updateSubCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid subcategory ID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

