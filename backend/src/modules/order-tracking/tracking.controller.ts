import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { OrderTrackingService } from "./tracking.service";

export class OrderTrackingController {
  private service: OrderTrackingService;

  constructor() {
    this.service = new OrderTrackingService();
  }

  trackOrder = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { orderNumber } = req.params;
    const tracking = await this.service.trackOrder(
      orderNumber,
      authReq.user!.userId
    );
    return ResponseUtil.success(res, tracking);
  };

  trackOrderPublic = async (req: Request, res: Response): Promise<Response> => {
    const { orderNumber, email } = req.body;
    const tracking = await this.service.trackOrderPublic(orderNumber, email);
    return ResponseUtil.success(res, tracking);
  };

  updateOrderTracking = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { orderId } = req.params;
    const tracking = await this.service.updateOrderTracking(orderId, req.body);
    return ResponseUtil.success(
      res,
      tracking,
      "Order tracking updated successfully"
    );
  };

  addTrackingUpdate = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { orderId } = req.params;
    const { status, location, description, timestamp } = req.body;

    const result = await this.service.addTrackingUpdate(
      orderId,
      status,
      location,
      description,
      timestamp ? new Date(timestamp) : undefined
    );

    return ResponseUtil.success(
      res,
      result,
      "Tracking update added successfully"
    );
  };

  getAllActiveOrders = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const orders = await this.service.getAllActiveOrders();
    return ResponseUtil.success(res, orders);
  };
}
