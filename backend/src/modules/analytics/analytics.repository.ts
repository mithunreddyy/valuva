import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/database";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export class AnalyticsRepository {
  async getOrdersByDateRange(
    startDate: Date,
    endDate: Date,
    statuses: OrderStatus[]
  ) {
    return prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: statuses },
      },
      select: { total: true, createdAt: true },
    });
  }

  async getProductViewCounts(startDate: Date, endDate: Date) {
    return prisma.product.aggregate({
      _sum: { viewCount: true },
      where: {
        updatedAt: { gte: startDate, lte: endDate },
      },
    });
  }

  async getTopProductsWithOrderItems(
    limit: number,
    dateRange?: DateRange,
    orderStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
    ]
  ) {
    const whereClause = dateRange
      ? {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
        }
      : {};

    return prisma.product.findMany({
      where: {
        ...whereClause,
        isActive: true,
      },
      include: {
        reviews: { select: { rating: true } },
        variants: {
          include: {
            orderItems: {
              where: {
                order: {
                  status: { in: orderStatuses },
                  ...(dateRange && {
                    createdAt: {
                      gte: dateRange.startDate,
                      lte: dateRange.endDate,
                    },
                  }),
                },
              },
              select: { quantity: true, subtotal: true },
            },
          },
        },
      },
      orderBy: { totalSold: "desc" },
      take: limit,
    });
  }

  async getCategoryPerformanceData(
    dateRange: DateRange,
    orderStatuses: OrderStatus[] = [
      OrderStatus.DELIVERED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
    ]
  ) {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: {
            variants: {
              include: {
                orderItems: {
                  where: {
                    order: {
                      createdAt: {
                        gte: dateRange.startDate,
                        lte: dateRange.endDate,
                      },
                      status: { in: orderStatuses },
                    },
                  },
                  select: { quantity: true, subtotal: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getCustomerCounts(dateRange: DateRange) {
    const [totalCustomers, repeatCustomers] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: dateRange.startDate, lte: dateRange.endDate },
          role: "CUSTOMER",
        },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: dateRange.startDate, lte: dateRange.endDate },
          role: "CUSTOMER",
          orders: {
            some: {
              createdAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
              },
            },
          },
        },
      }),
    ]);

    return { totalCustomers, repeatCustomers };
  }

  async getTopCustomers(dateRange: DateRange, limit: number = 10) {
    return prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        orders: {
          some: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        orders: {
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate,
            },
            status: {
              in: [
                OrderStatus.DELIVERED,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
              ],
            },
          },
          select: { total: true },
        },
      },
      take: limit,
    });
  }

  async getInventoryStats() {
    const [lowStock, outOfStock, totalProducts] = await Promise.all([
      prisma.productVariant.count({
        where: { stock: { lte: 10 }, isActive: true },
      }),
      prisma.productVariant.count({
        where: { stock: 0, isActive: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ]);

    return { lowStock, outOfStock, totalProducts };
  }

  async getTopStockMovers(limit: number = 10) {
    return prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        totalSold: true,
        totalStock: true,
      },
      orderBy: { totalSold: "desc" },
      take: limit,
    });
  }
}
