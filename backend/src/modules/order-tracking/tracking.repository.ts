import { prisma } from "../../config/database";

export class OrderTrackingRepository {
  async findOrderByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        payment: {
          select: {
            status: true,
            method: true,
            paidAt: true,
          },
        },
      },
    });
  }

  async findOrderByNumberAndEmail(orderNumber: string, email: string) {
    return prisma.order.findFirst({
      where: {
        orderNumber,
        user: {
          email,
        },
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        payment: {
          select: {
            status: true,
            method: true,
            paidAt: true,
          },
        },
      },
    });
  }

  async getTrackingUpdates(orderId: string) {
    // This assumes you've added the OrderTrackingUpdate model
    // If not, this will return empty array
    try {
      const updates = await prisma.$queryRaw`
        SELECT * FROM order_tracking_updates 
        WHERE "orderId" = ${orderId}
        ORDER BY timestamp DESC
      `;
      return updates as any[];
    } catch {
      return [];
    }
  }

  async addTrackingUpdate(data: {
    orderId: string;
    status: string;
    location: string;
    description: string;
    timestamp?: Date;
  }) {
    try {
      await prisma.$executeRaw`
        INSERT INTO order_tracking_updates ("id", "orderId", "status", "location", "description", "timestamp", "createdAt")
        VALUES (gen_random_uuid(), ${data.orderId}, ${data.status}, ${
        data.location
      }, ${data.description}, 
                ${data.timestamp || new Date()}, NOW())
      `;
      return true;
    } catch {
      return false;
    }
  }

  async updateOrderTracking(orderId: string, data: any) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        trackingNumber: data.trackingNumber,
        updatedAt: new Date(),
      },
    });
  }

  async getAllActiveOrders() {
    return prisma.order.findMany({
      where: {
        status: {
          in: ["PENDING", "PROCESSING", "SHIPPED"],
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
