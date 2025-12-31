import { CategoriesRepository } from "../../modules/categories/categories.repository";
import { CategoriesService } from "../../modules/categories/categories.service";

// Mock the repository
jest.mock("../../modules/categories/categories.repository");

describe("CategoriesService", () => {
  let service: CategoriesService;
  let mockRepository: jest.Mocked<CategoriesRepository>;

  beforeEach(() => {
    mockRepository = {
      getCategories: jest.fn(),
      getCategoryBySlug: jest.fn(),
      getSubCategoryBySlug: jest.fn(),
    } as any;

    (CategoriesRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new CategoriesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        {
          id: "1",
          name: "Electronics",
          slug: "electronics",
          subCategories: [],
        },
        {
          id: "2",
          name: "Clothing",
          slug: "clothing",
          subCategories: [],
        },
      ];

      mockRepository.getCategories.mockResolvedValue(mockCategories as any);

      const result = await service.getCategories();

      expect(result).toEqual(mockCategories);
      expect(mockRepository.getCategories).toHaveBeenCalled();
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return category when found", async () => {
      const slug = "electronics";
      const mockCategory = {
        id: "1",
        name: "Electronics",
        slug,
        subCategories: [],
      };

      mockRepository.getCategoryBySlug.mockResolvedValue(mockCategory as any);

      const result = await service.getCategoryBySlug(slug);

      expect(result).toEqual(mockCategory);
      expect(mockRepository.getCategoryBySlug).toHaveBeenCalledWith(slug);
    });

    it("should throw NotFoundError when category not found", async () => {
      mockRepository.getCategoryBySlug.mockResolvedValue(null);

      await expect(service.getCategoryBySlug("nonexistent")).rejects.toThrow(
        "Category not found"
      );
    });
  });

  describe("getSubCategoryBySlug", () => {
    it("should return subcategory when found", async () => {
      const categorySlug = "electronics";
      const subCategorySlug = "smartphones";
      const mockSubCategory = {
        id: "1",
        name: "Smartphones",
        slug: subCategorySlug,
        category: {
          slug: categorySlug,
        },
      };

      mockRepository.getSubCategoryBySlug.mockResolvedValue(mockSubCategory as any);

      const result = await service.getSubCategoryBySlug(categorySlug, subCategorySlug);

      expect(result).toEqual(mockSubCategory);
      expect(mockRepository.getSubCategoryBySlug).toHaveBeenCalledWith(
        categorySlug,
        subCategorySlug
      );
    });

    it("should throw NotFoundError when subcategory not found", async () => {
      mockRepository.getSubCategoryBySlug.mockResolvedValue(null);

      await expect(
        service.getSubCategoryBySlug("electronics", "nonexistent")
      ).rejects.toThrow("Subcategory not found");
    });
  });
});

