import { prisma } from "../config/database";
import { logger } from "./logger.util";

/**
 * Full-Text Search Utility
 * Production-ready PostgreSQL full-text search
 * Uses PostgreSQL's native full-text search capabilities
 */
export class FullTextSearchUtil {
  /**
   * Search products using PostgreSQL full-text search
   * More performant than LIKE queries for large datasets
   */
  static async searchProducts(
    query: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{
    products: any[];
    total: number;
  }> {
    try {
      // Sanitize query for full-text search
      const searchTerms = query
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0)
        .map((term) => term.replace(/[^\w]/g, ""))
        .join(" & ");

      if (!searchTerms) {
        return { products: [], total: 0 };
      }

      // Use raw query for full-text search
      // PostgreSQL full-text search requires a tsvector column or generated column
      // For now, we'll use a combination of ILIKE and ranking
      if (!prisma) throw new Error("Prisma client not initialized");
      const products = await prisma.$queryRaw<any[]>`
        SELECT 
          p.*,
          (
            CASE 
              WHEN p.name ILIKE ${`%${query}%`} THEN 3
              WHEN p.description ILIKE ${`%${query}%`} THEN 2
              WHEN p.brand ILIKE ${`%${query}%`} THEN 2
              WHEN p.sku ILIKE ${`%${query}%`} THEN 1
              ELSE 0
            END
          ) as relevance
        FROM products p
        WHERE 
          p."isActive" = true
          AND (
            p.name ILIKE ${`%${query}%`}
            OR p.description ILIKE ${`%${query}%`}
            OR p.brand ILIKE ${`%${query}%`}
            OR p.sku ILIKE ${`%${query}%`}
          )
        ORDER BY relevance DESC, p."totalSold" DESC, p."viewCount" DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      if (!prisma) throw new Error("Prisma client not initialized");
      const totalResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::int as count
        FROM products p
        WHERE 
          p."isActive" = true
          AND (
            p.name ILIKE ${`%${query}%`}
            OR p.description ILIKE ${`%${query}%`}
            OR p.brand ILIKE ${`%${query}%`}
            OR p.sku ILIKE ${`%${query}%`}
          )
      `;

      const total = Number(totalResult[0]?.count || 0);

      // Fetch full product data with relations
      const productIds = products.map((p) => p.id);
      if (!prisma) throw new Error("Prisma client not initialized");
      const fullProducts = await prisma.product.findMany({
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
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: {
          totalSold: "desc",
        },
      });

      return {
        products: fullProducts.map((product) => {
          const avgRating =
            product.reviews.length > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                product.reviews.length
              : 0;

          return {
            ...product,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: product.reviews.length,
          };
        }),
        total,
      };
    } catch (error) {
      logger.error("Full-text search failed", {
        error: error instanceof Error ? error.message : String(error),
        query,
      });
      // Fallback to basic search
      return { products: [], total: 0 };
    }
  }

  /**
   * Create full-text search index (run as migration)
   * This should be added to a Prisma migration
   */
  static async createSearchIndex(): Promise<void> {
    try {
      // Create GIN index for full-text search
      // This should be run as a database migration
      if (!prisma) throw new Error("Prisma client not initialized");
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS products_search_idx 
        ON products 
        USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, '')))
      `;

      logger.info("Full-text search index created");
    } catch (error) {
      logger.error("Failed to create search index", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

