import { Response } from "express";
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

  createOrder = async (req: AuthRequest, res: Response): Promise<Response> => {
    const {
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      couponCode,
      notes,
    } = req.body;

    const order = await this.service.createOrder(
      req.user!.userId,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      couponCode,
      notes
    );

    return ResponseUtil.success(
      res,
      order,
      "Order created successfully",
      HTTP_STATUS.CREATED
    );
  };

  getUserOrders = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getUserOrders(
      req.user!.userId,
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

  getOrderById = async (req: AuthRequest, res: Response): Promise<Response> => {
    const order = await this.service.getOrderById(
      req.params.id,
      req.user!.userId
    );
    return ResponseUtil.success(res, order);
  };
}
