import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../utils/error.util";
import { ProductFilters, ProductsRepository } from "./products.repository";

export class ProductsService {
  private repository: ProductsRepository;

  constructor() {
    this.repository = new ProductsRepository();
  }

  async getProducts(
    filters: ProductFilters,
    page: number,
    limit: number,
    sort?: string
  ) {
    const skip = (page - 1) * limit;

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

    switch (sort) {
      case "price_asc":
        orderBy = { basePrice: "asc" };
        break;
      case "price_desc":
        orderBy = { basePrice: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { totalSold: "desc" };
        break;
    }

    const { products, total } = await this.repository.findProducts(
      filters,
      skip,
      limit,
      orderBy
    );

    const productsWithRatings = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      const { reviews, ...productData } = product;

      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });

    return { products: productsWithRatings, total, page, limit };
  }

  async getProductById(id: string) {
    const product = await this.repository.findProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    return {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };
  }

  async getRelatedProducts(productId: string) {
    const product = await this.repository.findProductById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const relatedProducts = await this.repository.findRelatedProducts(
      productId,
      product.categoryId
    );

    return relatedProducts.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;

      const { reviews, ...productData } = p;

      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });
  }

  async searchProducts(query: string, limit: number = 10) {
    const { products } = await this.repository.findProducts(
      { search: query },
      0,
      limit,
      { totalSold: "desc" }
    );

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      image: p.images[0]?.url || null,
    }));
  }
}
