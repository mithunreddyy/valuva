import { prisma } from "../../config/database";

export class HomepageRepository {
  async getActiveSections() {
    return prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getFeaturedProducts(limit: number = 12) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: limit,
      orderBy: { totalSold: "desc" },
    });
  }

  async getNewArrivals(limit: number = 12) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        isNewArrival: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getBestSellers(limit: number = 12) {
    return prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: limit,
      orderBy: { totalSold: "desc" },
    });
  }
}
