import { ProductsRepository } from "../../modules/products/products.repository";
import { ProductsService } from "../../modules/products/products.service";

// Mock the repository
jest.mock("../../modules/products/products.repository");

describe("ProductsService", () => {
  let service: ProductsService;
  let mockRepository: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    mockRepository = {
      findProducts: jest.fn(),
      findProductBySlug: jest.fn(),
      findProductById: jest.fn(),
      searchProducts: jest.fn(),
    } as any;

    (ProductsRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new ProductsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return products with pagination", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Test Product",
          reviews: [],
        },
      ];

      mockRepository.findProducts.mockResolvedValue({
        products: mockProducts as any,
        total: 1,
      });

      const result = await service.getProducts({}, 1, 10);

      expect(result.products).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockRepository.findProducts).toHaveBeenCalled();
    });

    it("should calculate average rating correctly", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Test Product",
          reviews: [{ rating: 5 }, { rating: 4 }, { rating: 3 }],
        },
      ];

      mockRepository.findProducts.mockResolvedValue({
        products: mockProducts as any,
        total: 1,
      });

      const result = await service.getProducts({}, 1, 10);

      expect(result.products[0].averageRating).toBe(4);
      expect(result.products[0].reviewCount).toBe(3);
    });
  });

  describe("getProductBySlug", () => {
    it("should return product when found", async () => {
      const mockProduct = {
        id: "1",
        name: "Test Product",
        slug: "test-product",
        reviews: [],
      };

      mockRepository.findProductBySlug.mockResolvedValue(mockProduct as any);

      const result = await service.getProductBySlug("test-product");

      expect(result).toBeDefined();
      expect((result as any).name).toBe("Test Product");
    });

    it("should throw NotFoundError when product not found", async () => {
      mockRepository.findProductBySlug.mockResolvedValue(null);

      await expect(service.getProductBySlug("non-existent")).rejects.toThrow(
        "Product not found"
      );
    });
  });
});
