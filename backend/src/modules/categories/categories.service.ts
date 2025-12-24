import { NotFoundError } from "../../utils/error.util";
import { CategoriesRepository } from "./categories.repository";

export class CategoriesService {
  private repository: CategoriesRepository;

  constructor() {
    this.repository = new CategoriesRepository();
  }

  async getCategories() {
    return this.repository.getCategories();
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.repository.getCategoryBySlug(slug);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async getSubCategoryBySlug(categorySlug: string, subCategorySlug: string) {
    const subCategory = await this.repository.getSubCategoryBySlug(
      categorySlug,
      subCategorySlug
    );
    if (!subCategory) {
      throw new NotFoundError("Subcategory not found");
    }
    return subCategory;
  }
}
