import { ReviewsRepository } from "../../modules/reviews/reviews.repository";
import { ReviewsService } from "../../modules/reviews/reviews.service";

// Mock the repository
jest.mock("../../modules/reviews/reviews.repository");


describe("ReviewsService", () => {
  let service: ReviewsService;
  let mockRepository: jest.Mocked<ReviewsRepository>;

  beforeEach(() => {
    mockRepository = {
      getProduct: jest.fn(),
      findUserReviewForProduct: jest.fn(),
      checkUserPurchasedProduct: jest.fn(),
      createReview: jest.fn(),
      updateReview: jest.fn(),
      getProductReviews: jest.fn(),
      getUserReviews: jest.fn(),
      findReviewById: jest.fn(),
      deleteReview: jest.fn(),
      getAllReviewsForAdmin: jest.fn(),
    } as any;

    (ReviewsRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new ReviewsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createReview", () => {
    it("should create review successfully", async () => {
      const userId = "1";
      const productId = "product1";
      const reviewData = {
        rating: 5,
        comment: "Great product!",
        title: "Excellent",
      };

      const mockProduct = { id: productId };
      const mockReview = {
        id: "review1",
        userId,
        productId,
        ...reviewData,
        isVerified: false,
      };

      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.findUserReviewForProduct.mockResolvedValue(null);
      mockRepository.checkUserPurchasedProduct.mockResolvedValue(false);
      mockRepository.createReview.mockResolvedValue(mockReview as any);

      const result = await service.createReview(
        userId,
        productId,
        reviewData.rating,
        reviewData.comment,
        reviewData.title
      );

      expect(result).toEqual(mockReview);
      expect(mockRepository.createReview).toHaveBeenCalled();
    });

    it("should mark review as verified if user purchased product", async () => {
      const userId = "1";
      const productId = "product1";
      const mockProduct = { id: productId };
      const mockReview = {
        id: "review1",
        userId,
        productId,
        rating: 5,
        comment: "Great!",
        isVerified: false,
      };

      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.findUserReviewForProduct.mockResolvedValue(null);
      mockRepository.checkUserPurchasedProduct.mockResolvedValue(true);
      mockRepository.createReview.mockResolvedValue(mockReview as any);
      mockRepository.updateReview.mockResolvedValue({
        ...mockReview,
        isVerified: true,
      } as any);

      await service.createReview(userId, productId, 5, "Great!");

      expect(mockRepository.updateReview).toHaveBeenCalledWith("review1", {
        isVerified: true,
      });
    });

    it("should throw NotFoundError if product not found", async () => {
      mockRepository.getProduct.mockResolvedValue(null);

      await expect(service.createReview("userId", "nonexistent", 5, "Comment")).rejects.toThrow(
        "Product not found"
      );
    });

    it("should throw ConflictError if user already reviewed", async () => {
      const mockProduct = { id: "product1" };
      const existingReview = { id: "review1" };

      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.findUserReviewForProduct.mockResolvedValue(existingReview as any);

      await expect(service.createReview("userId", "product1", 5, "Comment")).rejects.toThrow(
        "already reviewed"
      );
    });
  });

  describe("getProductReviews", () => {
    it("should return paginated product reviews", async () => {
      const productId = "product1";
      const page = 1;
      const limit = 10;

      const mockReviews = [
        { id: "review1", rating: 5, comment: "Great!" },
        { id: "review2", rating: 4, comment: "Good" },
      ];
      const total = 2;

      const mockProduct = { id: productId };
      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.getProductReviews.mockResolvedValue({
        reviews: mockReviews as any,
        total,
      });

      const result = await service.getProductReviews(productId, page, limit);

      expect(result.reviews).toEqual(mockReviews);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
    });

    it("should throw NotFoundError if product not found", async () => {
      mockRepository.getProduct.mockResolvedValue(null);

      await expect(service.getProductReviews("nonexistent", 1, 10)).rejects.toThrow(
        "Product not found"
      );
    });
  });

  describe("getUserReviews", () => {
    it("should return paginated user reviews", async () => {
      const userId = "1";
      const page = 1;
      const limit = 10;

      const mockReviews = [
        { id: "review1", userId, rating: 5 },
        { id: "review2", userId, rating: 4 },
      ];
      const total = 2;

      mockRepository.getUserReviews.mockResolvedValue({
        reviews: mockReviews as any,
        total,
      });

      const result = await service.getUserReviews(userId, page, limit);

      expect(result.reviews).toEqual(mockReviews);
      expect(result.total).toBe(total);
    });
  });

  describe("updateReview", () => {
    it("should update review successfully", async () => {
      const reviewId = "review1";
      const userId = "1";
      const updateData = { rating: 4, comment: "Updated comment" };

      const mockReview = {
        id: reviewId,
        userId,
        rating: 5,
        comment: "Old comment",
      };

      mockRepository.findReviewById.mockResolvedValue(mockReview as any);
      mockRepository.updateReview.mockResolvedValue({
        ...mockReview,
        ...updateData,
      } as any);

      await service.updateReview(reviewId, userId, updateData);

      expect(mockRepository.updateReview).toHaveBeenCalledWith(reviewId, updateData);
    });

    it("should throw NotFoundError if review not found", async () => {
      mockRepository.findReviewById.mockResolvedValue(null);

      await expect(service.updateReview("nonexistent", "userId", {})).rejects.toThrow(
        "Review not found"
      );
    });

    it("should throw ValidationError if user tries to update another user's review", async () => {
      const mockReview = {
        id: "review1",
        userId: "otherUser",
      };

      mockRepository.findReviewById.mockResolvedValue(mockReview as any);

      await expect(service.updateReview("review1", "differentUser", {})).rejects.toThrow(
        "You can only update your own reviews"
      );
    });
  });

  describe("deleteReview", () => {
    it("should delete review successfully", async () => {
      const reviewId = "review1";
      const userId = "1";

      const mockReview = {
        id: reviewId,
        userId,
      };

      mockRepository.findReviewById.mockResolvedValue(mockReview as any);
      mockRepository.deleteReview.mockResolvedValue(undefined as any);

      await service.deleteReview(reviewId, userId);

      expect(mockRepository.deleteReview).toHaveBeenCalledWith(reviewId);
    });

    it("should throw NotFoundError if review not found", async () => {
      mockRepository.findReviewById.mockResolvedValue(null);

      await expect(service.deleteReview("nonexistent", "userId")).rejects.toThrow(
        "Review not found"
      );
    });

    it("should throw ValidationError if user tries to delete another user's review", async () => {
      const mockReview = {
        id: "review1",
        userId: "otherUser",
      };

      mockRepository.findReviewById.mockResolvedValue(mockReview as any);

      await expect(service.deleteReview("review1", "differentUser")).rejects.toThrow(
        "You can only delete your own reviews"
      );
    });
  });

  describe("approveReview", () => {
    it("should approve review", async () => {
      const reviewId = "review1";
      const mockReview = { id: reviewId };

      mockRepository.findReviewById.mockResolvedValue(mockReview as any);
      mockRepository.updateReview.mockResolvedValue({
        ...mockReview,
        isApproved: true,
      } as any);

      await service.approveReview(reviewId, true);

      expect(mockRepository.updateReview).toHaveBeenCalledWith(reviewId, {
        isApproved: true,
      });
    });

    it("should throw NotFoundError if review not found", async () => {
      mockRepository.findReviewById.mockResolvedValue(null);

      await expect(service.approveReview("nonexistent", true)).rejects.toThrow(
        "Review not found"
      );
    });
  });

  describe("getAllReviewsForAdmin", () => {
    it("should return paginated reviews for admin", async () => {
      const page = 1;
      const limit = 10;
      const filters = { isApproved: false };

      const mockReviews = [
        { id: "review1", isApproved: false },
        { id: "review2", isApproved: false },
      ];
      const total = 2;

      mockRepository.getAllReviewsForAdmin.mockResolvedValue({
        reviews: mockReviews as any,
        total,
      });

      const result = await service.getAllReviewsForAdmin(page, limit, filters);

      expect(result.reviews).toEqual(mockReviews);
      expect(result.total).toBe(total);
    });
  });
});

