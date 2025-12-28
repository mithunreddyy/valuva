import { Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { AdminCouponsService } from "./admin-coupons.service";

export class AdminCouponsController {
  private service: AdminCouponsService;

  constructor() {
    this.service = new AdminCouponsService();
  }

  getAllCoupons = async (
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
    const result = await this.service.getAllCoupons(page, limit, req.query);
    return ResponseUtil.paginated(
      res,
      result.coupons,
      page,
      limit,
      result.total
    );
  };

  getCouponById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const coupon = await this.service.getCouponById(req.params.id);
    return ResponseUtil.success(res, coupon);
  };

  createCoupon = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const coupon = await this.service.createCoupon(req.body);
    return ResponseUtil.success(
      res,
      coupon,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateCoupon = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const coupon = await this.service.updateCoupon(req.params.id, req.body);
    return ResponseUtil.success(res, coupon, SUCCESS_MESSAGES.UPDATED);
  };

  deleteCoupon = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteCoupon(req.params.id);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  toggleCouponStatus = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const coupon = await this.service.toggleCouponStatus(req.params.id);
    return ResponseUtil.success(res, coupon, SUCCESS_MESSAGES.UPDATED);
  };
}

