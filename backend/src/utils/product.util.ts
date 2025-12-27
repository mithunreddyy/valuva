/**
 * Product Utility Functions
 * Helper functions for product-related operations
 */

import { prisma } from "../config/database";
import { logger } from "./logger.util";

export class ProductUtil {
  /**
   * Increment product view count
   * This is called when a user views a product page
   */
  static async incrementViewCount(productId: string): Promise<void> {
    try {
      await prisma.product.update({
        where: { id: productId },
        data: {
          viewCount: { increment: 1 },
        },
      });
    } catch (error) {
      // Log error but don't throw - view count is not critical
      logger.warn("Failed to increment product view count", {
        productId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Calculate average rating from reviews
   */
  static calculateAverageRating(reviews: Array<{ rating: number }>): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  /**
   * Format product price with currency
   */
  static formatPrice(price: number | string, currency: string = "INR"): string {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(numPrice);
  }
}

