import { prisma } from "../../config/database";

export class CategoriesRepository {
  async getCategories() {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getCategoryBySlug(slug: string) {
    return prisma.category.findFirst({
      where: { slug, isActive: true },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

  async getSubCategoryBySlug(categorySlug: string, subCategorySlug: string) {
    return prisma.subCategory.findFirst({
      where: {
        slug: subCategorySlug,
        isActive: true,
        category: {
          slug: categorySlug,
          isActive: true,
        },
      },
      include: {
        category: true,
      },
    });
  }
}
