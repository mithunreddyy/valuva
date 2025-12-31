import { WishlistRepository } from "../../modules/wishlist/wishlist.repository";
import { WishlistService } from "../../modules/wishlist/wishlist.service";

// Mock the repository
jest.mock("../../modules/wishlist/wishlist.repository");


describe("WishlistService", () => {
  let service: WishlistService;
  let mockRepository: jest.Mocked<WishlistRepository>;

  beforeEach(() => {
    mockRepository = {
      getUserWishlist: jest.fn(),
      getProduct: jest.fn(),
      isInWishlist: jest.fn(),
      addToWishlist: jest.fn(),
      removeFromWishlist: jest.fn(),
    } as any;

    (WishlistRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new WishlistService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserWishlist", () => {
    it("should return wishlist with calculated ratings", async () => {
      const userId = "1";
      const mockWishlist = [
        {
          id: "wish1",
          product: {
            id: "product1",
            name: "Test Product",
            slug: "test-product",
            basePrice: 100,
            compareAtPrice: 120,
            images: [{ url: "image.jpg" }],
            reviews: [
              { rating: 5 },
              { rating: 4 },
              { rating: 3 },
            ],
          },
          createdAt: new Date(),
        },
      ];

      mockRepository.getUserWishlist.mockResolvedValue(mockWishlist as any);

      const result = await service.getUserWishlist(userId);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe("product1");
      expect(result[0].averageRating).toBe(4);
      expect(result[0].reviewCount).toBe(3);
    });

    it("should handle products with no reviews", async () => {
      const userId = "1";
      const mockWishlist = [
        {
          id: "wish1",
          product: {
            id: "product1",
            name: "Test Product",
            slug: "test-product",
            basePrice: 100,
            images: [],
            reviews: [],
          },
          createdAt: new Date(),
        },
      ];

      mockRepository.getUserWishlist.mockResolvedValue(mockWishlist as any);

      const result = await service.getUserWishlist(userId);

      expect(result[0].averageRating).toBe(0);
      expect(result[0].reviewCount).toBe(0);
    });
  });

  describe("addToWishlist", () => {
    it("should add product to wishlist successfully", async () => {
      const userId = "1";
      const productId = "product1";

      const mockProduct = {
        id: productId,
        name: "Test Product",
      };

      const mockWishlist = [
        {
          id: "wish1",
          product: {
            id: productId,
            name: "Test Product",
            slug: "test-product",
            basePrice: 100,
            images: [],
            reviews: [],
          },
          createdAt: new Date(),
        },
      ];

      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.isInWishlist.mockResolvedValue(false);
      mockRepository.addToWishlist.mockResolvedValue(undefined as any);
      mockRepository.getUserWishlist.mockResolvedValue(mockWishlist as any);

      const result = await service.addToWishlist(userId, productId);

      expect(result).toHaveLength(1);
      expect(mockRepository.addToWishlist).toHaveBeenCalledWith(userId, productId);
    });

    it("should throw NotFoundError if product not found", async () => {
      mockRepository.getProduct.mockResolvedValue(null);

      await expect(service.addToWishlist("userId", "nonexistent")).rejects.toThrow(
        "Product not found"
      );
    });

    it("should throw ConflictError if product already in wishlist", async () => {
      const mockProduct = {
        id: "product1",
        name: "Test Product",
      };

      mockRepository.getProduct.mockResolvedValue(mockProduct as any);
      mockRepository.isInWishlist.mockResolvedValue(true);

      await expect(service.addToWishlist("userId", "product1")).rejects.toThrow(
        "already in wishlist"
      );
    });
  });

  describe("removeFromWishlist", () => {
    it("should remove product from wishlist successfully", async () => {
      const userId = "1";
      const productId = "product1";

      const mockWishlist = [
        {
          id: "wish1",
          product: {
            id: "product2",
            name: "Other Product",
            slug: "other-product",
            basePrice: 200,
            images: [],
            reviews: [],
          },
          createdAt: new Date(),
        },
      ];

      mockRepository.removeFromWishlist.mockResolvedValue(undefined as any);
      mockRepository.getUserWishlist.mockResolvedValue(mockWishlist as any);

      const result = await service.removeFromWishlist(userId, productId);

      expect(mockRepository.removeFromWishlist).toHaveBeenCalledWith(userId, productId);
      expect(result).toHaveLength(1);
    });
  });
});

