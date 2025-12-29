import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../config/database";

export interface CreateOrderData {
  userId: string;
  orderNumber: string;
  items: Array<{
    variantId: string;
    quantity: number;
    price: Decimal;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: PaymentMethod;
  subtotal: Decimal;
  discount: Decimal;
  tax: Decimal;
  shippingCost: Decimal;
  total: Decimal;
  couponCode?: string;
  notes?: string;
}

export class OrdersRepository {
  async createOrder(data: CreateOrderData) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          orderNumber: data.orderNumber,
          status: OrderStatus.PENDING,
          subtotal: data.subtotal,
          discount: data.discount,
          tax: data.tax,
          shippingCost: data.shippingCost,
          total: data.total,
          couponCode: data.couponCode,
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId,
          notes: data.notes,
          items: {
            create: data.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              subtotal: new Decimal(item.price).mul(item.quantity),
            })),
          },
          payment: {
            create: {
              amount: data.total,
              method: data.paymentMethod,
              status:
                data.paymentMethod === "COD"
                  ? PaymentStatus.PENDING
                  : PaymentStatus.PENDING,
            },
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          payment: true,
        },
      });

      // Note: Inventory is already locked and decremented by InventoryLockUtil
      // We only need to update totalSold here
      for (const item of data.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        // Only update totalSold - stock was already decremented by lock
        await tx.product.update({
          where: { id: variant.productId },
          data: {
            totalSold: { increment: item.quantity },
          },
        });
      }

      if (data.couponCode) {
        await tx.coupon.update({
          where: { code: data.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }

      return order;
    });
  }

  async findUserOrders(userId: string, skip: number, take: number) {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: {
                        where: { isPrimary: true },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
          shippingAddress: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, total };
  }

  async findOrderById(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payment: true,
      },
    });
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
      },
    });
  }

  async getAddress(addressId: string, userId: string) {
    return prisma.address.findFirst({
      where: { id: addressId, userId },
    });
  }

  async getCoupon(code: string) {
    return prisma.coupon.findFirst({
      where: {
        code,
        isActive: true,
        startsAt: { lte: new Date() },
        expiresAt: { gte: new Date() },
      },
    });
  }

  async getCart(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });
  }

  async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async restoreInventory(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await prisma.$transaction(
      order.items.map((item) =>
        prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { increment: item.quantity },
          },
        })
      )
    );

    await prisma.$transaction(
      order.items.map((item) =>
        prisma.product.update({
          where: { id: item.variant.productId },
          data: {
            totalStock: { increment: item.quantity },
            totalSold: { decrement: item.quantity },
          },
        })
      )
    );
  }
}
