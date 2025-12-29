import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { AdminProductsService } from "./admin-products.service";

export class AdminProductsController {
  private service: AdminProductsService;

  constructor() {
    this.service = new AdminProductsService();
  }

  createProduct = async (req: Request, res: Response): Promise<Response> => {
    const product = await this.service.createProduct(req.body);
    return ResponseUtil.success(
      res,
      product,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateProduct = async (req: Request, res: Response): Promise<Response> => {
    const product = await this.service.updateProduct(req.params.id, req.body);
    return ResponseUtil.success(res, product, SUCCESS_MESSAGES.UPDATED);
  };

  deleteProduct = async (req: Request, res: Response): Promise<Response> => {
    await this.service.deleteProduct(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    const product = await this.service.getProductById(req.params.id);
    return ResponseUtil.success(res, product);
  };

  getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getAllProducts(page, limit, req.query);
    return ResponseUtil.paginated(
      res,
      result.products,
      page,
      limit,
      result.total
    );
  };

  createVariant = async (req: Request, res: Response): Promise<Response> => {
    const variant = await this.service.createVariant(req.body);
    return ResponseUtil.success(
      res,
      variant,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateVariant = async (req: Request, res: Response): Promise<Response> => {
    const variant = await this.service.updateVariant(req.params.id, req.body);
    return ResponseUtil.success(res, variant, SUCCESS_MESSAGES.UPDATED);
  };

  updateInventory = async (req: Request, res: Response): Promise<Response> => {
    const { change, reason, notes } = req.body;
    const variant = await this.service.updateInventory(
      req.params.id,
      change,
      reason,
      notes
    );
    return ResponseUtil.success(res, variant, "Inventory updated successfully");
  };

  addProductImage = async (req: Request, res: Response): Promise<Response> => {
    const { productId, url, altText, isPrimary } = req.body;
    const image = await this.service.addProductImage(
      productId,
      url,
      altText,
      isPrimary
    );
    return ResponseUtil.success(
      res,
      image,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  deleteProductImage = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteProductImage(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  getLowStockProducts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const threshold = req.query.threshold
      ? parseInt(req.query.threshold as string)
      : undefined;
    const products = await this.service.getLowStockProducts(threshold);
    return ResponseUtil.success(res, products);
  };
}
