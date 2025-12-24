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

    return ResponseUtil.success(res, { received: true }, undefined, HTTP_STATUS.OK);
  };
}


