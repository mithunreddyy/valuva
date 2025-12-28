import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { StockAlertsService } from "./stock-alerts.service";

export class StockAlertsController {
  private service: StockAlertsService;

  constructor() {
    this.service = new StockAlertsService();
  }

  createStockAlert = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { productId } = req.body;
    const alert = await this.service.createStockAlert(userId, productId);
    return ResponseUtil.success(
      res,
      alert,
      "Stock alert created",
      HTTP_STATUS.CREATED
    );
  };

  deleteStockAlert = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { productId } = req.params;
    await this.service.deleteStockAlert(userId, productId);
    return ResponseUtil.success(
      res,
      null,
      "Stock alert deleted",
      HTTP_STATUS.OK
    );
  };

  getUserStockAlerts = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const alerts = await this.service.getUserStockAlerts(userId);
    return ResponseUtil.success(res, alerts, undefined, HTTP_STATUS.OK);
  };
}
