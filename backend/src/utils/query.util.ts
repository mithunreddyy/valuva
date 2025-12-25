import { Prisma } from "@prisma/client";

/**
 * Utility functions for optimizing database queries
 */

/**
 * Build efficient pagination parameters
 */
export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export class QueryUtil {
  /**
   * Parse and validate pagination parameters
   */
  static parsePagination(
    page?: string | number,
    limit?: string | number,
    maxLimit: number = 100
  ): PaginationParams {
    const pageNum = page ? Math.max(1, parseInt(String(page), 10)) : 1;
    const limitNum = limit
      ? Math.min(maxLimit, Math.max(1, parseInt(String(limit), 10)))
      : 20;

    return {
      page: pageNum,
      limit: limitNum,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    };
  }

  /**
   * Build efficient where clause for date ranges
   */
  static buildDateRangeFilter(
    startDate?: Date | string,
    endDate?: Date | string
  ): Prisma.DateTimeFilter | undefined {
    if (!startDate && !endDate) return undefined;

    const filter: Prisma.DateTimeFilter = {};

    if (startDate) {
      filter.gte = startDate instanceof Date ? startDate : new Date(startDate);
    }

    if (endDate) {
      filter.lte = endDate instanceof Date ? endDate : new Date(endDate);
    }

    return filter;
  }

  /**
   * Build select clause to only fetch needed fields
   */
  static buildSelectFields<T extends string>(fields: T[]): Record<T, boolean> {
    return fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<T, boolean>);
  }

  /**
   * Build efficient orderBy clause
   */
  static buildOrderBy(
    sortBy?: string,
    sortOrder: "asc" | "desc" = "desc"
  ): Record<string, "asc" | "desc"> | undefined {
    if (!sortBy) return undefined;

    return {
      [sortBy]: sortOrder,
    };
  }

  /**
   * Optimize query by selecting only necessary relations
   */
  static buildInclude<T extends Record<string, any>>(relations: T): T {
    return relations;
  }

  /**
   * Build search filter for text fields
   */
  static buildSearchFilter(
    searchTerm?: string,
    _fields: string[] = ["name", "email"]
  ): Prisma.StringFilter | undefined {
    if (!searchTerm) return undefined;

    return {
      contains: searchTerm,
      mode: "insensitive",
    };
  }

  /**
   * Build OR filter for multiple fields
   */
  static buildMultiFieldSearch(
    searchTerm: string,
    fields: string[]
  ): { OR: Array<Record<string, Prisma.StringFilter>> } {
    return {
      OR: fields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    };
  }
}
