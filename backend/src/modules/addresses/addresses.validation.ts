import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(6, "Valid postal code is required"),
    country: z.string().default("India"),
    isDefault: z.boolean().optional(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid address ID"),
  }),
  body: z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    addressLine1: z.string().min(1).optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    postalCode: z.string().min(6).optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const deleteAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid address ID"),
  }),
});
