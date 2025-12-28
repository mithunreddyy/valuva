import { Request, Response } from "express";
import { HTTP_STATUS } from "../../config/constants";
import { ResponseUtil } from "../../utils/response.util";
import { RecommendationsService } from "./recommendations.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export class RecommendationsController {
  private service: RecommendationsService;

  constructor() {
    this.service = new RecommendationsService();
  }

  getRecentlyViewed = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      return ResponseUtil.error(res, "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const products = await this.service.getRecentlyViewed(userId, limit);
    return ResponseUtil.success(res, products, undefined, HTTP_STATUS.OK);
  };

  getSimilarProducts = async (req: Request, res: Response): Promise<Response> => {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;
    const products = await this.service.getSimilarProducts(productId, limit);
    return ResponseUtil.success(res, products, undefined, HTTP_STATUS.OK);
  };

  getFrequentlyBoughtTogether = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;
    const products = await this.service.getFrequentlyBoughtTogether(
      productId,
      limit
    );
    return ResponseUtil.success(res, products, undefined, HTTP_STATUS.OK);
  };
}

