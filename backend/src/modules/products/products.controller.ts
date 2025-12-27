import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ProductUtil } from "../../utils/product.util";
import { ResponseUtil } from "../../utils/response.util";
import { ProductsService } from "./products.service";

export class ProductsController {
  private service: ProductsService;

  constructor() {
    this.service = new ProductsService();
  }

  getProducts = async (req: AuthRequest, res: Response): Promise<Response> => {
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

  getProductById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const product = await this.service.getProductById(req.params.id);
    // Increment view count asynchronously (non-blocking)
    ProductUtil.incrementViewCount(req.params.id).catch(() => {
      // Silently fail - view count is not critical
    });
    return ResponseUtil.success(res, product);
  };

  getRelatedProducts = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const products = await this.service.getRelatedProducts(req.params.id);
    return ResponseUtil.success(res, products);
  };

  searchProducts = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const query = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const products = await this.service.searchProducts(query, limit);
    return ResponseUtil.success(res, products);
  };
}
