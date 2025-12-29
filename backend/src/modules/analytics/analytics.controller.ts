import { Request, Response } from "express";
import { ResponseUtil } from "../../utils/response.util";
import { AnalyticsService } from "./analytics.service";

export class AnalyticsController {
  private service: AnalyticsService;

  constructor() {
    this.service = new AnalyticsService();
  }

  getSalesMetrics = async (req: Request, res: Response): Promise<Response> => {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const metrics = await this.service.getSalesMetrics({ startDate, endDate });
    return ResponseUtil.success(res, metrics);
  };

  getTopProducts = async (req: Request, res: Response): Promise<Response> => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const dateRange =
      req.query.startDate && req.query.endDate
        ? {
            startDate: new Date(req.query.startDate as string),
            endDate: new Date(req.query.endDate as string),
          }
        : undefined;

    const products = await this.service.getTopProducts(limit, dateRange);
    return ResponseUtil.success(res, products);
  };

  getRevenueTrends = async (req: Request, res: Response): Promise<Response> => {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const groupBy = (req.query.groupBy as "day" | "week" | "month") || "day";

    const trends = await this.service.getRevenueTrends(
      { startDate, endDate },
      groupBy
    );
    return ResponseUtil.success(res, trends);
  };

  getCustomerAnalytics = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const analytics = await this.service.getCustomerAnalytics({
      startDate,
      endDate,
    });
    return ResponseUtil.success(res, analytics);
  };

  getInventoryInsights = async (
    _req: Request,
    res: Response
  ): Promise<Response> => {
    const insights = await this.service.getInventoryInsights();
    return ResponseUtil.success(res, insights);
  };

  getCategoryPerformance = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date();

    const performance = await this.service.getCategoryPerformance({
      startDate,
      endDate,
    });
    return ResponseUtil.success(res, performance);
  };
}
