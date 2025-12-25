import { z } from "zod";

export const trackOrderSchema = z.object({
  params: z.object({
    orderNumber: z.string().min(1, "Order number is required"),
  }),
});

export const trackByEmailSchema = z.object({
  body: z.object({
    orderNumber: z.string().min(1, "Order number is required"),
    email: z.string().email("Valid email is required"),
  }),
});

export const updateTrackingSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.enum([
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ]),
    trackingNumber: z.string().optional(),
    carrierName: z.string().optional(),
    estimatedDelivery: z.string().datetime().optional(),
    currentLocation: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const addTrackingUpdateSchema = z.object({
  params: z.object({
    orderId: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.string().min(1, "Status is required"),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    timestamp: z.string().datetime().optional(),
  }),
});
