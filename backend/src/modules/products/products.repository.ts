import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

export interface ProductFilters {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export class ProductsRepository {
  async findProducts(
    filters: ProductFilters,
    skip: number,
    take: number,
    orderBy: Prisma.ProductOrderByWithRelationInput
  ) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.subCategoryId) {
      where.subCategoryId = filters.subCategoryId;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.isNewArrival !== undefined) {
      where.isNewArrival = filters.isNewArrival;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.basePrice = {};
      if (filters.minPrice !== undefined) {
        where.basePrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.basePrice.lte = filters.maxPrice;
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.size || filters.color) {
      where.variants = {
        some: {
          isActive: true,
          stock: { gt: 0 },
          ...(filters.size && { size: filters.size }),
          ...(filters.color && { color: filters.color }),
        },
      };
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          subCategory: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              size: true,
              color: true,
              colorHex: true,
              price: true,
              stock: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: true,
        subCategory: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product) {
      await prisma.product.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return product;
  }

  async findProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        subCategory: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return product;
  }

  async searchProducts(query: string, limit: number = 20) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        category: true,
      },
      take: limit,
      orderBy: [
        { totalSold: "desc" },
        { viewCount: "desc" },
      ],
    });

    return { products, total: products.length };
  }

  async findRelatedProducts(
    productId: string,
    categoryId: string,
    limit: number = 8
  ) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        isActive: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: limit,
      orderBy: { totalSold: "desc" },
    });
  }

  async getAvailableSizes(productId: string): Promise<string[]> {
    const sizes = await prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
        stock: { gt: 0 },
      },
      select: { size: true },
      distinct: ["size"],
    });

    return sizes.map((s) => s.size);
  }

  async getAvailableColors(
    productId: string
  ): Promise<{ color: string; colorHex: string | null }[]> {
    return prisma.productVariant.findMany({
      where: {
        productId,
        isActive: true,
        stock: { gt: 0 },
      },
      select: { color: true, colorHex: true },
      distinct: ["color"],
    });
  }
}
