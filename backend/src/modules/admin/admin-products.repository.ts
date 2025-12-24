import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../config/database";

export class AdminProductsRepository {
  async createProduct(data: any) {
    return prisma.product.create({
      data: {
        ...data,
        basePrice: new Decimal(data.basePrice),
        compareAtPrice: data.compareAtPrice
          ? new Decimal(data.compareAtPrice)
          : null,
      },
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  async updateProduct(id: string, data: any) {
    if (data.basePrice) {
      data.basePrice = new Decimal(data.basePrice);
    }
    if (data.compareAtPrice) {
      data.compareAtPrice = new Decimal(data.compareAtPrice);
    }

    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        subCategory: true,
        variants: true,
        images: true,
      },
    });
  }

  async deleteProduct(id: string) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        variants: true,
        images: true,
      },
    });
  }

  async getAllProducts(skip: number, take: number, filters?: any) {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive === "true";
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { sku: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          subCategory: true,
          _count: {
            select: {
              variants: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async createVariant(data: any) {
    const variant = await prisma.productVariant.create({
      data: {
        ...data,
        price: new Decimal(data.price),
      },
    });

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        totalStock: { increment: data.stock },
      },
    });

    return variant;
  }

  async updateVariant(id: string, data: any) {
    if (data.price) {
      data.price = new Decimal(data.price);
    }

    return prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  async updateInventory(
    variantId: string,
    change: number,
    reason: string,
    notes?: string
  ) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error("Variant not found");
    }

    const newStock = variant.stock + change;
    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }

    return prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      });

      await tx.product.update({
        where: { id: variant.productId },
        data: {
          totalStock: { increment: change },
        },
      });

      await tx.inventoryLog.create({
        data: {
          productId: variant.productId,
          variantId,
          change,
          reason,
          notes,
        },
      });

      return updatedVariant;
    });
  }

  async addProductImage(
    productId: string,
    url: string,
    altText?: string,
    isPrimary?: boolean
  ) {
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return prisma.productImage.create({
      data: {
        productId,
        url,
        altText,
        isPrimary: isPrimary || false,
      },
    });
  }

  async deleteProductImage(imageId: string) {
    await prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async getLowStockProducts(threshold: number = 10) {
    return prisma.productVariant.findMany({
      where: {
        stock: { lte: threshold },
        isActive: true,
      },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: { stock: "asc" },
    });
  }
}
