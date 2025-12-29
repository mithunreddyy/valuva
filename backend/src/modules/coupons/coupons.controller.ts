import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { CouponsService } from "./coupons.service";

export class CouponsController {
  private service: CouponsService;

  constructor() {
    this.service = new CouponsService();
  }

  validateCoupon = async (req: Request, res: Response): Promise<Response> => {
    const { code } = req.params;
    const subtotalParam = req.query.subtotal as string | undefined;
    const subtotal = subtotalParam ? new Decimal(subtotalParam) : undefined;

    const coupon = await this.service.validateCoupon(code, subtotal);
    return ResponseUtil.success(res, coupon);
  };

  listActiveCoupons = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "20", 10);

    const { coupons, total } = await this.service.listActive(page, limit);

    return ResponseUtil.success(
      res,
      {
        coupons,
        pagination: {
          page,
          limit,
          total,
        },
      },
      undefined,
      HTTP_STATUS.OK
    );
  };
}
