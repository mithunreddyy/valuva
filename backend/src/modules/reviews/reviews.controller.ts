import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { PaginationUtil } from "../../utils/pagination.util";
import { ResponseUtil } from "../../utils/response.util";
import { ReviewsService } from "./reviews.service";

export class ReviewsController {
  private service: ReviewsService;

  constructor() {
    this.service = new ReviewsService();
  }

  createReview = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { productId, rating, title, comment } = req.body;
    const review = await this.service.createReview(
      authReq.user!.userId,
      productId,
      rating,
      comment,
      title
    );
    return ResponseUtil.success(
      res,
      review,
      "Review created successfully",
      HTTP_STATUS.CREATED
    );
  };

  getProductReviews = async (req: Request, res: Response): Promise<Response> => {
    const { productId } = req.params;
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const rating = req.query.rating
      ? parseInt(req.query.rating as string)
      : undefined;

    const result = await this.service.getProductReviews(
      productId,
      page,
      limit,
      rating
    );
    return ResponseUtil.paginated(
      res,
      result.reviews,
      page,
      limit,
      result.total
    );
  };

  getUserReviews = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { page, limit } = PaginationUtil.parse(
      typeof req.query.page === "string" || typeof req.query.page === "number"
        ? req.query.page
        : undefined,
      typeof req.query.limit === "string" || typeof req.query.limit === "number"
        ? req.query.limit
        : undefined
    );
    const result = await this.service.getUserReviews(
      authReq.user!.userId,
      page,
      limit
    );
    return ResponseUtil.paginated(
      res,
      result.reviews,
      page,
      limit,
      result.total
    );
  };

  updateReview = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const review = await this.service.updateReview(
      id,
      authReq.user!.userId,
      req.body
    );
    return ResponseUtil.success(res, review, SUCCESS_MESSAGES.UPDATED);
  };

  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    await this.service.deleteReview(id, authReq.user!.userId);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };

  approveReview = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { isApproved } = req.body;
    const review = await this.service.approveReview(id, isApproved);
    return ResponseUtil.success(
      res,
      review,
      isApproved ? "Review approved" : "Review rejected"
    );
  };

  getAllReviewsForAdmin = async (
    req: Request,
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
    const result = await this.service.getAllReviewsForAdmin(
      page,
      limit,
      req.query
    );
    return ResponseUtil.paginated(
      res,
      result.reviews,
      page,
      limit,
      result.total
    );
  };
}
