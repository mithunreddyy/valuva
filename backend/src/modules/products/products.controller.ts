import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { AnalyticsUtil } from "../../utils/analytics.util";
import { InputSanitizer } from "../../utils/input-sanitizer.util";
import { PaginationUtil } from "../../utils/pagination.util";
import { ProductUtil } from "../../utils/product.util";
import { ResponseUtil } from "../../utils/response.util";
import { ProductsService } from "./products.service";

export class ProductsController {
  private service: ProductsService;

  constructor() {
    this.service = new ProductsService();
  }

  getProducts = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" ? req.query.page : undefined,
      typeof req.query.limit === "string" ? req.query.limit : undefined
    );

    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      subCategoryId: req.query.subCategoryId as string | undefined,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      size: req.query.size as string | undefined,
      color: req.query.color as string | undefined,
      search: req.query.search as string | undefined,
      isFeatured: req.query.isFeatured === "true" ? true : undefined,
      isNewArrival: req.query.isNewArrival === "true" ? true : undefined,
    };

    const result = await this.service.getProducts(
      filters,
      page,
      limit,
      req.query.sort as string | undefined
    );

    return ResponseUtil.paginated(
      res,
      result.products,
      page,
      limit,
      result.total
    );
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    const product = await this.service.getProductById(req.params.id);
    // Increment view count asynchronously (non-blocking)
    ProductUtil.incrementViewCount(req.params.id).catch(() => {
      // Silently fail - view count is not critical
    });
    return ResponseUtil.success(res, product);
  };

  getRelatedProducts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const products = await this.service.getRelatedProducts(req.params.id);
    return ResponseUtil.success(res, products);
  };

  searchProducts = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const rawQuery = req.query.q as string;
    const query = InputSanitizer.sanitizeSearchQuery(rawQuery);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!query || query.trim().length === 0) {
      return ResponseUtil.success(res, []);
    }

    const products = await this.service.searchProducts(query, limit);

    // Track search analytics
    const sessionId = req.headers["x-session-id"] as string;
    AnalyticsUtil.trackSearch(
      query,
      products.length,
      authReq.user?.userId,
      sessionId
    ).catch(() => {
      // Silently fail - analytics shouldn't break the flow
    });

    return ResponseUtil.success(res, products);
  };

  getProductBySlug = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const slug = InputSanitizer.sanitizeString(req.params.slug, {
      maxLength: 200,
    });
    const product = await this.service.getProductBySlug(slug);

    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers["user-agent"] || "";
    const sessionId = req.headers["x-session-id"] as string;

    // Track product view for recommendations
    if (authReq.user?.userId) {
      // Track view asynchronously (non-blocking)
      import("../../modules/recommendations/recommendations.service")
        .then(({ RecommendationsService }) => {
          const recommendationsService = new RecommendationsService();
          recommendationsService
            .trackProductView(
              (product as { id: string }).id,
              authReq.user!.userId,
              ipAddress,
              userAgent
            )
            .catch(() => {
              // Silently fail - tracking is not critical
            });
        })
        .catch(() => {
          // Silently fail
        });
    }

    // Track analytics
    AnalyticsUtil.trackProductView(
      (product as { id: string }).id,
      authReq.user?.userId,
      sessionId,
      ipAddress
    ).catch(() => {
      // Silently fail
    });

    return ResponseUtil.success(res, product);
  };

  getFeaturedProducts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    const products = await this.service.getFeaturedProducts(limit);
    return ResponseUtil.success(res, products);
  };

  getNewArrivals = async (req: Request, res: Response): Promise<Response> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    const products = await this.service.getNewArrivals(limit);
    return ResponseUtil.success(res, products);
  };

  /**
   * Get available filter options (sizes and colors)
   * Production-ready: Returns real data from product variants
   */
  getFilterOptions = async (req: Request, res: Response): Promise<Response> => {
    const options = await this.service.getFilterOptions();
    return ResponseUtil.success(res, options);
  };
}
