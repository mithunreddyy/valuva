import { PAGINATION } from "../config/constants";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export class PaginationUtil {
  static parse(
    page?: string | number,
    limit?: string | number
  ): PaginationParams {
    const parsedPage = Math.max(1, Number(page) || PAGINATION.DEFAULT_PAGE);
    const parsedLimit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, Number(limit) || PAGINATION.DEFAULT_LIMIT)
    );

    return {
      page: parsedPage,
      limit: parsedLimit,
      skip: (parsedPage - 1) * parsedLimit,
    };
  }
}
