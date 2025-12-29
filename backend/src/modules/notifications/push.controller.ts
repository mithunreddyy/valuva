import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { asyncHandler } from "../../middleware/async.middleware";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { PushNotificationService } from "./push.service";

export class PushNotificationController {
  /**
   * Subscribe to push notifications
   */
  subscribe = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const authReq = req as AuthRequest;
      const subscription = req.body;

      if (!subscription || !subscription.endpoint) {
        return ResponseUtil.error(
          res,
          "Invalid subscription data",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await PushNotificationService.subscribeUser(
        authReq.user!.userId,
        subscription
      );

      return ResponseUtil.success(
        res,
        { message: "Subscribed successfully" },
        "Subscribed to push notifications",
        HTTP_STATUS.OK
      );
    }
  );

  /**
   * Unsubscribe from push notifications
   */
  unsubscribe = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const authReq = req as AuthRequest;
      const { endpoint } = req.body;

      if (!endpoint) {
        return ResponseUtil.error(
          res,
          "Endpoint is required",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      await PushNotificationService.unsubscribeUser(
        authReq.user!.userId,
        endpoint
      );

      return ResponseUtil.success(
        res,
        { message: "Unsubscribed successfully" },
        "Unsubscribed from push notifications",
        HTTP_STATUS.OK
      );
    }
  );

  /**
   * Get VAPID public key
   */
  getVapidKey = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const publicKey = process.env.VAPID_PUBLIC_KEY || "";

      if (!publicKey) {
        return ResponseUtil.error(
          res,
          "VAPID keys not configured",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      return ResponseUtil.success(
        res,
        { publicKey },
        undefined,
        HTTP_STATUS.OK
      );
    }
  );
}
