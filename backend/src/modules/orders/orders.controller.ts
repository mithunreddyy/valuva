import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { OrdersService } from "./orders.service";

export class OrdersController {
  private service: OrdersService;

  constructor() {
    this.service = new OrdersService();
  }

  createOrder = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const {
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      couponCode,
      notes,
    } = req.body;

    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;
    const userAgent = req.headers["user-agent"] || "";

    const order = await this.service.createOrder(
      authReq.user!.userId,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      couponCode,
      notes,
      ipAddress,
      userAgent
    );

    return ResponseUtil.success(
      res,
      order,
      "Order created successfully",
      HTTP_STATUS.CREATED
    );
  };

  getUserOrders = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getUserOrders(
      authReq.user!.userId,
      page,
      limit
    );

    return ResponseUtil.paginated(
      res,
      result.orders,
      page,
      limit,
      result.total
    );
  };

  getOrderById = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const order = await this.service.getOrderById(
      req.params.id,
      authReq.user!.userId
    );
    return ResponseUtil.success(res, order);
  };

  cancelOrder = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const order = await this.service.cancelOrder(
      req.params.id,
      authReq.user!.userId
    );
    return ResponseUtil.success(res, order, "Order cancelled successfully");
  };
}
