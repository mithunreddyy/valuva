import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/database";

export class AdminRepository {
  async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email },
    });
  }

  async updateAdminLogin(adminId: string, refreshToken: string) {
    return prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken, lastLogin: new Date() },
    });
  }

  async getDashboardOverview() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      productsLowStock,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: [OrderStatus.DELIVERED] } },
      }),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.productVariant.count({
        where: { stock: { lte: 10 }, isActive: true },
      }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      productsLowStock,
    };
  }

  async getRecentOrders(limit: number) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getTopProducts(limit: number) {
    return prisma.product.findMany({
      take: limit,
      where: { isActive: true },
      orderBy: { totalSold: "desc" },
      select: {
        id: true,
        name: true,
        totalSold: true,
        basePrice: true,
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
      data: { status, ...(trackingNumber && { trackingNumber }) },
    });
  }

  async getOrders(skip: number, take: number) {
    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
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
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.order.count(),
    ]);

    return { orders, total };
  }

  async getOrderById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
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

  async getUsers(skip: number, take: number) {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
}
