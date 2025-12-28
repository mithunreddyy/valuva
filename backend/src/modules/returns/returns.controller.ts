import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { ReturnsService } from "./returns.service";

export class ReturnsController {
  private service: ReturnsService;

  constructor() {
    this.service = new ReturnsService();
  }

  createReturnRequest = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const { orderId, orderItemIds, reason, description } = req.body;
    const returnRequest = await this.service.createReturnRequest(
      userId,
      orderId,
      orderItemIds,
      reason,
      description
    );
    return ResponseUtil.success(
      res,
      returnRequest,
      "Return request created",
      HTTP_STATUS.CREATED
    );
  };

  getUserReturns = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const returns = await this.service.getUserReturns(userId);
    return ResponseUtil.success(res, returns, undefined, HTTP_STATUS.OK);
  };

  getAllReturns = async (req: Request, res: Response): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await this.service.getAllReturns(page, limit);
    return ResponseUtil.success(res, result, undefined, HTTP_STATUS.OK);
  };

  updateReturnStatus = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const returnRequest = await this.service.updateReturnStatus(
      id,
      status,
      adminNotes
    );
    return ResponseUtil.success(
      res,
      returnRequest,
      "Return status updated",
      HTTP_STATUS.OK
    );
  };
}
