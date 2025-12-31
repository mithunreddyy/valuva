import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { ShippingService } from "./shipping.service";

export class ShippingController {
  private service: ShippingService;

  constructor() {
    this.service = new ShippingService();
  }

  calculateRate = async (req: Request, res: Response): Promise<Response> => {
    const { address, weight, dimensions } = req.body;
    const rate = await this.service.calculateShippingRate(
      address,
      weight,
      dimensions
    );
    return ResponseUtil.success(res, rate, undefined, HTTP_STATUS.OK);
  };

  checkDelivery = async (req: Request, res: Response): Promise<Response> => {
    const { pincode, weight, dimensions } = req.body;
    const deliveryInfo = await this.service.checkDelivery(
      pincode,
      weight,
      dimensions
    );
    return ResponseUtil.success(
      res,
      deliveryInfo,
      undefined,
      HTTP_STATUS.OK
    );
  };

  trackShipment = async (req: Request, res: Response): Promise<Response> => {
    const { trackingNumber } = req.params;
    const tracking = await this.service.trackShipment(trackingNumber);
    return ResponseUtil.success(res, tracking, undefined, HTTP_STATUS.OK);
  };
}

