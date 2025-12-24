import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().uuid("Invalid shipping address ID"),
    billingAddressId: z.string().uuid("Invalid billing address ID"),
    paymentMethod: z.enum([
      "CREDIT_CARD",
      "DEBIT_CARD",
      "UPI",
      "NET_BANKING",
      "WALLET",
      "COD",
    ]),
    couponCode: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
});
