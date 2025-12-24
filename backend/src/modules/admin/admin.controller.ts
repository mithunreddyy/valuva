import { Response } from "express";
import { SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { AdminService } from "./admin.service";

export class AdminController {
  private service: AdminService;

  constructor() {
    this.service = new AdminService();
  }

  login = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const result = await this.service.login(email, password);
    return ResponseUtil.success(res, result, SUCCESS_MESSAGES.LOGIN);
  };

  getDashboard = async (req: AuthRequest, res: Response): Promise<Response> => {
    const stats = await this.service.getDashboardStats();
    return ResponseUtil.success(res, stats);
  };

  getOrders = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getOrders(page, limit);
    return ResponseUtil.paginated(
      res,
      result.orders,
      page,
      limit,
      result.total
    );
  };

  getUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getUsers(page, limit);
    return ResponseUtil.paginated(res, result.users, page, limit, result.total);
  };

  updateOrderStatus = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;
    await this.service.updateOrderStatus(orderId, status, trackingNumber);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.UPDATED);
  };
}
