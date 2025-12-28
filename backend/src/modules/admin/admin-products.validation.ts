import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    basePrice: z.number().positive("Price must be positive"),
    compareAtPrice: z.number().positive().optional(),
    sku: z.string().min(1, "SKU is required"),
    brand: z.string().optional(),
    material: z.string().optional(),
    careInstructions: z.string().optional(),
    washCareInstructions: z.string().optional(),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.union([z.string(), z.number()]),
        })
      )
      .optional(),
    sizeGuide: z
      .object({
        title: z.string().optional(),
        measurements: z
          .array(
            z.object({
              size: z.string(),
              chest: z.string().optional(),
              waist: z.string().optional(),
              length: z.string().optional(),
              sleeve: z.string().optional(),
            })
          )
          .optional(),
        notes: z.string().optional(),
      })
      .optional(),
    shippingInfo: z
      .object({
        processingTime: z.string().optional(),
        shippingTime: z.string().optional(),
        freeShipping: z.boolean().optional(),
        returnable: z.boolean().optional(),
        exchangeable: z.boolean().optional(),
      })
      .optional(),
    categoryId: z.string().uuid("Invalid category ID"),
    subCategoryId: z.string().uuid().optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(10).optional(),
    shortDescription: z.string().optional(),
    longDescription: z.string().optional(),
    basePrice: z.number().positive().optional(),
    compareAtPrice: z.number().positive().optional(),
    brand: z.string().optional(),
    material: z.string().optional(),
    careInstructions: z.string().optional(),
    washCareInstructions: z.string().optional(),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.union([z.string(), z.number()]),
        })
      )
      .optional(),
    sizeGuide: z
      .object({
        title: z.string().optional(),
        measurements: z
          .array(
            z.object({
              size: z.string(),
              chest: z.string().optional(),
              waist: z.string().optional(),
              length: z.string().optional(),
              sleeve: z.string().optional(),
            })
          )
          .optional(),
        notes: z.string().optional(),
      })
      .optional(),
    shippingInfo: z
      .object({
        processingTime: z.string().optional(),
        shippingTime: z.string().optional(),
        freeShipping: z.boolean().optional(),
        returnable: z.boolean().optional(),
        exchangeable: z.boolean().optional(),
      })
      .optional(),
    categoryId: z.string().uuid().optional(),
    subCategoryId: z.string().uuid().optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createVariantSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
    sku: z.string().min(1, "SKU is required"),
    size: z.string().min(1, "Size is required"),
    color: z.string().min(1, "Color is required"),
    colorHex: z.string().optional(),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    price: z.number().positive("Price must be positive"),
  }),
});

export const updateVariantSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid variant ID"),
  }),
  body: z.object({
    stock: z.number().int().min(0).optional(),
    price: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateInventorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid variant ID"),
  }),
  body: z.object({
    change: z.number().int(),
    reason: z.enum([
      "PURCHASE",
      "SALE",
      "RETURN",
      "ADJUSTMENT",
      "DAMAGE",
      "RESTOCK",
    ]),
    notes: z.string().optional(),
  }),
});
