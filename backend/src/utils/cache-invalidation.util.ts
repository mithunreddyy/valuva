import { CacheUtil } from "./cache.util";
import { logger } from "./logger.util";

/**
 * Cache Invalidation Utility
 * Provides centralized cache invalidation for product-related changes
 */
export class CacheInvalidationUtil {
  /**
   * Invalidate product cache when product is created/updated/deleted
   */
  static async invalidateProductCache(productId?: string, slug?: string): Promise<void> {
    try {
      // Invalidate specific product caches
      if (productId) {
        await CacheUtil.delete(`product:id:${productId}`);
      }
      if (slug) {
        await CacheUtil.delete(`product:slug:${slug}`);
      }

      // Invalidate product list caches (pattern matching)
      await CacheUtil.deletePattern("products:*");

      logger.debug("Product cache invalidated", { productId, slug });
    } catch (error) {
      logger.error("Cache invalidation failed", {
        error: error instanceof Error ? error.message : String(error),
        productId,
        slug,
      });
    }
  }

  /**
   * Invalidate all product-related caches
   */
  static async invalidateAllProductCaches(): Promise<void> {
    try {
      await CacheUtil.deletePattern("product:*");
      await CacheUtil.deletePattern("products:*");
      logger.debug("All product caches invalidated");
    } catch (error) {
      logger.error("Cache invalidation failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Invalidate category cache
   */
  static async invalidateCategoryCache(categoryId?: string): Promise<void> {
    try {
      if (categoryId) {
        await CacheUtil.delete(`category:${categoryId}`);
      }
      await CacheUtil.deletePattern("categories:*");
      logger.debug("Category cache invalidated", { categoryId });
    } catch (error) {
      logger.error("Cache invalidation failed", {
        error: error instanceof Error ? error.message : String(error),
        categoryId,
      });
    }
  }

  /**
   * Invalidate user-specific caches
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    try {
      await CacheUtil.deletePattern(`user:${userId}:*`);
      logger.debug("User cache invalidated", { userId });
    } catch (error) {
      logger.error("Cache invalidation failed", {
        error: error instanceof Error ? error.message : String(error),
        userId,
      });
    }
  }
}

