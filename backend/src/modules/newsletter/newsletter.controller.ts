import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { NewsletterService } from "./newsletter.service";

export class NewsletterController {
  private service: NewsletterService;

  constructor() {
    this.service = new NewsletterService();
  }

  subscribe = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;
    const subscription = await this.service.subscribe(email);
    return ResponseUtil.success(
      res,
      subscription,
      "Successfully subscribed",
      HTTP_STATUS.CREATED
    );
  };

  unsubscribe = async (req: Request, res: Response): Promise<Response> => {
    const { email, token } = req.body;
    await this.service.unsubscribe(email, token);
    return ResponseUtil.success(
      res,
      null,
      "Successfully unsubscribed",
      HTTP_STATUS.OK
    );
  };

  getAllSubscriptions = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await this.service.getAllSubscriptions(page, limit);
    return ResponseUtil.success(res, result, undefined, HTTP_STATUS.OK);
  };
}

