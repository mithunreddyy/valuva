import { prisma } from "../../config/database";

export class WishlistRepository {
  async getUserWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async addToWishlist(userId: string, productId: string) {
    return prisma.wishlist.create({
      data: { userId, productId },
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
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    await prisma.wishlist.deleteMany({
      where: { userId, productId },
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    return !!item;
  }

  async getProduct(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId, isActive: true },
    });
  }
}
