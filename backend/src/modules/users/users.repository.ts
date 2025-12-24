import { prisma } from "../../config/database";

export class UsersRepository {
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isEmailVerified: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateProfile(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isEmailVerified: true,
        isActive: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async getUserStats(userId: string) {
    const [totalOrders, totalSpent, wishlistCount, reviewCount] =
      await Promise.all([
        prisma.order.count({ where: { userId } }),
        prisma.order.aggregate({
          where: { userId, status: "DELIVERED" },
          _sum: { total: true },
        }),
        prisma.wishlist.count({ where: { userId } }),
        prisma.review.count({ where: { userId } }),
      ]);

    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
      },
    });

    return {
      totalOrders,
      totalSpent: totalSpent._sum.total || 0,
      wishlistCount,
      reviewCount,
      recentOrders,
    };
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });
  }

  async getAllUsers(skip: number, take: number, filters?: any) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive === "true";
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async getUserDetails(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true,
          },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
