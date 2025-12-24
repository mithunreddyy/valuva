import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../utils/error.util";
import { ReviewsRepository } from "./reviews.repository";

export class ReviewsService {
  private repository: ReviewsRepository;

  constructor() {
    this.repository = new ReviewsRepository();
  }

  async createReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
    title?: string
  ) {
    const product = await this.repository.getProduct(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const existingReview = await this.repository.findUserReviewForProduct(
      userId,
      productId
    );
    if (existingReview) {
      throw new ConflictError("You have already reviewed this product");
    }

    const hasPurchased = await this.repository.checkUserPurchasedProduct(
      userId,
      productId
    );

    const review = await this.repository.createReview({
      productId,
      userId,
      rating,
      title,
      comment,
    });

    if (hasPurchased) {
      await this.repository.updateReview(review.id, { isVerified: true });
    }

    return review;
  }

  async getProductReviews(
    productId: string,
    page: number,
    limit: number,
    rating?: number
  ) {
    const product = await this.repository.getProduct(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const skip = (page - 1) * limit;
    const { reviews, total } = await this.repository.getProductReviews(
      productId,
      skip,
      limit,
      rating
    );

    return { reviews, total, page, limit };
  }

  async getUserReviews(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { reviews, total } = await this.repository.getUserReviews(
      userId,
      skip,
      limit
    );

    return { reviews, total, page, limit };
  }

  async updateReview(
    reviewId: string,
    userId: string,
    data: { rating?: number; title?: string; comment?: string }
  ) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.userId !== userId) {
      throw new ValidationError("You can only update your own reviews");
    }

    return this.repository.updateReview(reviewId, data);
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    if (review.userId !== userId) {
      throw new ValidationError("You can only delete your own reviews");
    }

    await this.repository.deleteReview(reviewId);
  }

  async approveReview(reviewId: string, isApproved: boolean) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found");
    }

    return this.repository.updateReview(reviewId, { isApproved });
  }

  async getAllReviewsForAdmin(page: number, limit: number, filters?: any) {
    const skip = (page - 1) * limit;
    const { reviews, total } = await this.repository.getAllReviewsForAdmin(
      skip,
      limit,
      filters
    );

    return { reviews, total, page, limit };
  }
}
