import { prisma } from "../../config/database";

export class ReviewsRepository {
  async createReview(data: {
    productId: string;
    userId: string;
    rating: number;
    title?: string;
    comment: string;
  }) {
    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
  }

  async findReviewById(id: string) {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findUserReviewForProduct(userId: string, productId: string) {
    return prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });
  }

  async getProductReviews(
    productId: string,
    skip: number,
    take: number,
    rating?: number
  ) {
    const where: any = {
      productId,
      isApproved: true,
    };

    if (rating) {
      where.rating = rating;
    }

    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total };
  }

  async getUserReviews(userId: string, skip: number, take: number) {
    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    return { reviews, total };
  }

  async updateReview(id: string, data: any) {
    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteReview(id: string) {
    await prisma.review.delete({
      where: { id },
    });
  }

  async checkUserPurchasedProduct(userId: string, productId: string) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: "DELIVERED",
        items: {
          some: {
            variant: {
              productId,
            },
          },
        },
      },
    });

    return !!order;
  }

  async getProduct(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });
  }

  async getAllReviewsForAdmin(skip: number, take: number, filters?: any) {
    const where: any = {};

    if (filters?.isApproved !== undefined) {
      where.isApproved = filters.isApproved === "true";
    }

    if (filters?.rating) {
      where.rating = parseInt(filters.rating);
    }

    const [reviews, total] = await prisma.$transaction([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          product: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total };
  }
}
