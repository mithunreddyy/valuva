// src/modules/admin/admin-categories.service.ts
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { SlugUtil } from "../../utils/slug.util";
import { AdminCategoriesRepository } from "./admin-categories.repository";

export class AdminCategoriesService {
  private repository: AdminCategoriesRepository;

  constructor() {
    this.repository = new AdminCategoriesRepository();
  }

  async getAllCategories() {
    return this.repository.getAllCategories();
  }

  async getCategoryById(id: string) {
    const category = await this.repository.getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    return category;
  }

  async createCategory(data: any) {
    const slug = SlugUtil.generate(data.name);
    return this.repository.createCategory({ ...data, slug });
  }

  async updateCategory(id: string, data: any) {
    const category = await this.repository.getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (data.name) {
      data.slug = SlugUtil.generate(data.name);
    }

    return this.repository.updateCategory(id, data);
  }

  async deleteCategory(id: string) {
    const category = await this.repository.getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const hasProducts = await this.repository.checkCategoryHasProducts(id);
    if (hasProducts) {
      throw new ValidationError(
        "Cannot delete category with existing products"
      );
    }

    await this.repository.deleteCategory(id);
  }

  async getAllSubCategories(categoryId?: string) {
    return this.repository.getAllSubCategories(categoryId);
  }

  async getSubCategoryById(id: string) {
    const subCategory = await this.repository.getSubCategoryById(id);
    if (!subCategory) {
      throw new NotFoundError("Subcategory not found");
    }
    return subCategory;
  }

  async createSubCategory(data: any) {
    const category = await this.repository.getCategoryById(data.categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const slug = SlugUtil.generate(data.name);
    return this.repository.createSubCategory({ ...data, slug });
  }

  async updateSubCategory(id: string, data: any) {
    const subCategory = await this.repository.getSubCategoryById(id);
    if (!subCategory) {
      throw new NotFoundError("Subcategory not found");
    }

    if (data.name) {
      data.slug = SlugUtil.generate(data.name);
    }

    return this.repository.updateSubCategory(id, data);
  }

  async deleteSubCategory(id: string) {
    const subCategory = await this.repository.getSubCategoryById(id);
    if (!subCategory) {
      throw new NotFoundError("Subcategory not found");
    }

    const hasProducts = await this.repository.checkSubCategoryHasProducts(id);
    if (hasProducts) {
      throw new ValidationError(
        "Cannot delete subcategory with existing products"
      );
    }

    await this.repository.deleteSubCategory(id);
  }
}
