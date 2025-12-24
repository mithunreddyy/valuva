// src/modules/admin/admin-categories.repository.ts
import { prisma } from "../../config/database";

export class AdminCategoriesRepository {
  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        subCategories: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async createCategory(data: any) {
    return prisma.category.create({
      data,
    });
  }

  async updateCategory(id: string, data: any) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    await prisma.category.delete({
      where: { id },
    });
  }

  async checkCategoryHasProducts(id: string) {
    const count = await prisma.product.count({
      where: { categoryId: id },
    });
    return count > 0;
  }

  async getAllSubCategories(categoryId?: string) {
    return prisma.subCategory.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getSubCategoryById(id: string) {
    return prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async createSubCategory(data: any) {
    return prisma.subCategory.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async updateSubCategory(id: string, data: any) {
    return prisma.subCategory.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async deleteSubCategory(id: string) {
    await prisma.subCategory.delete({
      where: { id },
    });
  }

  async checkSubCategoryHasProducts(id: string) {
    const count = await prisma.product.count({
      where: { subCategoryId: id },
    });
    return count > 0;
  }
}
