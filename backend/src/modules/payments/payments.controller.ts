import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { PaymentsService } from "./payments.service";

export class PaymentsController {
  private service: PaymentsService;

  constructor() {
    this.service = new PaymentsService();
  }

  confirmPayment = async (req: Request, res: Response): Promise<Response> => {
    const { orderId } = req.params;
    const { transactionId } = req.body as { transactionId: string };

    const payment = await this.service.confirmPayment(orderId, transactionId);
    return ResponseUtil.success(res, payment, undefined, HTTP_STATUS.OK);
  };

  webhook = async (req: Request, res: Response): Promise<Response> => {
    const { orderId, transactionId, status } = req.body;

    await this.service.handleWebhook({
      orderId,
      transactionId,
      status,
      raw: req.body,
    });

    return ResponseUtil.success(
      res,
      { received: true },
      undefined,
      HTTP_STATUS.OK
    );
  };

  // Razorpay methods
  initializeRazorpayPayment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { orderId } = req.params;
    const result = await this.service.initializeRazorpayPayment(orderId);
    return ResponseUtil.success(
      res,
      result,
      "Razorpay order created successfully",
      HTTP_STATUS.CREATED
    );
  };

  verifyRazorpayPayment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { orderId } = req.params;
    const paymentData = req.body;
    const result = await this.service.verifyRazorpayPayment(orderId, paymentData);
    return ResponseUtil.success(
      res,
      result,
      "Payment verified successfully",
      HTTP_STATUS.OK
    );
  };

  razorpayWebhook = async (req: Request, res: Response): Promise<Response> => {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!signature) {
      return ResponseUtil.error(
        res,
        "Missing webhook signature",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const result = await this.service.handleRazorpayWebhook(req.body, signature);

    return ResponseUtil.success(
      res,
      result,
      "Webhook processed successfully",
      HTTP_STATUS.OK
    );
  };
}
