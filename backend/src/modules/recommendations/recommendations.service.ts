import { prisma } from "../../config/database";
import { NotFoundError } from "../../utils/error.util";
import { logger } from "../../utils/logger.util";

export class RecommendationsService {
  /**
   * Track product view for analytics and recommendations
   */
  async trackProductView(
    productId: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.productView.create({
        data: {
          productId,
          userId: userId || null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
        },
      });

      // Update product view count
      await prisma.product.update({
        where: { id: productId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      logger.error("Failed to track product view", {
        productId,
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - tracking failure shouldn't break the flow
    }
  }

  /**
   * Get recently viewed products for a user
   */
  async getRecentlyViewed(userId: string, limit: number = 10) {
    // Get recently viewed products from ProductView table
    const recentViews = await prisma.productView.findMany({
      where: {
        userId,
      },
      orderBy: {
        viewedAt: "desc",
      },
      take: limit * 2, // Get more to account for duplicates
      select: {
        productId: true,
        viewedAt: true,
      },
    });

    // Get unique product IDs (most recent view per product)
    const productIdMap = new Map<string, Date>();
    recentViews.forEach((view: { productId: string; viewedAt: Date }) => {
      if (
        !productIdMap.has(view.productId) ||
        productIdMap.get(view.productId)! < view.viewedAt
      ) {
        productIdMap.set(view.productId, view.viewedAt);
      }
    });

    let productIds = Array.from(productIdMap.keys()).slice(0, limit);

    // If no views, fallback to order history
    if (productIds.length === 0) {
      // Get product IDs from user's orders
      const userOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                select: { productId: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      // Extract unique product IDs from orders
      const orderProductIds = new Set<string>();
      userOrders.forEach(
        (order: { items: Array<{ variant: { productId: string } }> }) => {
          order.items.forEach((item: { variant: { productId: string } }) => {
            if (item.variant.productId) {
              orderProductIds.add(item.variant.productId);
            }
          });
        }
      );

      // If no orders, get products from wishlist
      if (orderProductIds.size === 0) {
        const wishlistItems = await prisma.wishlist.findMany({
          where: { userId },
          select: { productId: true },
          take: limit,
        });
        wishlistItems.forEach((item: { productId: string }) => {
          orderProductIds.add(item.productId);
        });
      }

      productIds = Array.from(orderProductIds).slice(0, limit);
    }

    // If still no products, return featured products as fallback
    if (productIds.length === 0) {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          category: true,
        },
      });
      return products;
    }

    // Get products by IDs, maintaining order
    const recentlyViewedProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: true,
      },
    });

    // Sort to maintain the order from productIds
    return recentlyViewedProducts.sort(
      (a: { id: string }, b: { id: string }) => {
        const indexA = productIds.indexOf(a.id);
        const indexB = productIds.indexOf(b.id);
        return indexA - indexB;
      }
    );
  }

  async getSimilarProducts(productId: string, limit: number = 5) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
      },
      take: limit,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: true,
      },
    });

    return similarProducts;
  }

  async getFrequentlyBoughtTogether(productId: string, limit: number = 5) {
    // Find orders that contain this product
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: {
        variant: {
          productId,
        },
      },
      select: {
        orderId: true,
      },
      distinct: ["orderId"],
      take: 100, // Analyze last 100 orders
    });

    if (ordersWithProduct.length === 0) {
      // Fallback to similar products
      return this.getSimilarProducts(productId, limit);
    }

    const orderIds = ordersWithProduct.map(
      (item: { orderId: string }) => item.orderId
    );

    // Find other products frequently bought with this one
    const frequentlyBought = await prisma.orderItem.groupBy({
      by: ["variantId"],
      where: {
        orderId: { in: orderIds },
        variant: {
          productId: { not: productId },
        },
      },
      _count: {
        variantId: true,
      },
      orderBy: {
        _count: {
          variantId: "desc",
        },
      },
      take: limit,
    });

    if (frequentlyBought.length === 0) {
      return this.getSimilarProducts(productId, limit);
    }

    // Get variant IDs and fetch products
    const variantIds = frequentlyBought.map(
      (item: { variantId: string }) => item.variantId
    );
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        product: {
          isActive: true,
        },
      },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: true,
          },
        },
      },
    });

    // Extract and return products, maintaining frequency order
    const products = variants
      .map((v: { product: { id: string } | null }) => v.product)
      .filter(
        (p: { id: string } | null): p is { id: string } =>
          p !== null && p.id !== productId
      )
      .slice(0, limit);

    return products;
  }
}
