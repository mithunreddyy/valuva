/**
 * Pagination utility functions
 * Provides helpers for pagination calculations and formatting
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  total: number,
  page: number = 1,
  limit: number = 10
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Math.max(1, Math.min(page, totalPages || 1)),
    limit,
    total,
    totalPages: totalPages || 1,
  };
}

/**
 * Get offset for database queries
 */
export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: number,
  limit?: number
): { page: number; limit: number } {
  const validPage = page && page > 0 ? page : 1;
  const validLimit = limit && limit > 0 && limit <= 100 ? limit : 10;
  return { page: validPage, limit: validLimit };
}

/**
 * Generate pagination range for display
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  range: number = 2
): number[] {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

/**
 * Check if pagination is needed
 */
export function needsPagination(total: number, limit: number): boolean {
  return total > limit;
}

