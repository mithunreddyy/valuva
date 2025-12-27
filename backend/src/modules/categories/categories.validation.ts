import { z } from "zod";

/**
 * Validation schema for getting all categories
 * Currently no params/query needed, but kept for consistency
 */
export const getCategoriesSchema = z.object({});

/**
 * Validation schema for getting category by slug
 */
export const getCategoryBySlugSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .min(1, "Category slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Category slug must be lowercase alphanumeric with hyphens"
      ),
  }),
});

/**
 * Validation schema for getting subcategory by slug
 */
export const getSubCategoryBySlugSchema = z.object({
  params: z.object({
    categorySlug: z
      .string()
      .min(1, "Category slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Category slug must be lowercase alphanumeric with hyphens"
      ),
    subCategorySlug: z
      .string()
      .min(1, "Subcategory slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Subcategory slug must be lowercase alphanumeric with hyphens"
      ),
  }),
});
