import { Response } from "express";
import { AdminBulkService } from "./admin-bulk.service";
import { ResponseUtil } from "../../utils/response.util";
import { AuthRequest } from "../../middleware/auth.middleware";

export class AdminBulkController {
  private service: AdminBulkService;

  constructor() {
    this.service = new AdminBulkService();
  }

  bulkUpdateProductStatus = async (
    req: AuthRequest,
    res: Response,
    _next?: any
  ): Promise<Response> => {
    const { productIds, isActive } = req.body;
    const userId = req.user!.userId;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return ResponseUtil.error(res, "productIds array is required", 400);
    }

    if (typeof isActive !== "boolean") {
      return ResponseUtil.error(res, "isActive must be a boolean", 400);
    }

    const result = await this.service.bulkUpdateProductStatus(
      productIds,
      isActive,
      userId
    );

    return ResponseUtil.success(res, result);
  };

  bulkDeleteProducts = async (
    req: AuthRequest,
    res: Response,
    _next?: any
  ): Promise<Response> => {
    const { productIds } = req.body;
    const userId = req.user!.userId;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return ResponseUtil.error(res, "productIds array is required", 400);
    }

    const result = await this.service.bulkDeleteProducts(productIds, userId);

    return ResponseUtil.success(res, result);
  };

  bulkUpdateOrderStatus = async (
    req: AuthRequest,
    res: Response,
    _next?: any
  ): Promise<Response> => {
    const { orderIds, status } = req.body;
    const userId = req.user!.userId;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return ResponseUtil.error(res, "orderIds array is required", 400);
    }

    if (!status) {
      return ResponseUtil.error(res, "status is required", 400);
    }

    const result = await this.service.bulkUpdateOrderStatus(
      orderIds,
      status,
      userId
    );

    return ResponseUtil.success(res, result);
  };

  bulkExportData = async (req: AuthRequest, res: Response, _next?: any): Promise<Response> => {
    const { entityType } = req.params as { entityType: string };
    const filters = req.query as Record<string, any>;

    const validTypes = ["products", "orders", "users", "categories"];
    if (!validTypes.includes(entityType)) {
      return ResponseUtil.error(
        res,
        `Invalid entity type. Must be one of: ${validTypes.join(", ")}`,
        400
      );
    }

    const data = await this.service.bulkExportData(
      entityType as any,
      filters as any
    );

    return ResponseUtil.success(res, data);
  };
}

