import { Prisma } from "@prisma/client";
import { CacheUtil } from "../../utils/cache.util";
import { NotFoundError } from "../../utils/error.util";
import { ProductFilters, ProductsRepository } from "./products.repository";

export class ProductsService {
  private repository: ProductsRepository;
  private readonly CACHE_TTL = 3600; // 1 hour

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

    // Generate cache key
    const cacheKey = `products:${JSON.stringify(filters)}:${page}:${limit}:${sort || "default"}`;

    // Try to get from cache
    const cached = await CacheUtil.get<{
      products: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(cacheKey);

    if (cached) {
      return cached;
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

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      };
    });

    const result = {
      products: productsWithRatings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache the result
    await CacheUtil.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async getProductBySlug(slug: string) {
    // Try cache first
    const cacheKey = `product:slug:${slug}`;
    const cached = await CacheUtil.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.repository.findProductBySlug(slug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    const result = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    // Cache the result
    await CacheUtil.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async getProductById(id: string) {
    // Try cache first
    const cacheKey = `product:id:${id}`;
    const cached = await CacheUtil.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.repository.findProductById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    const result = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    // Cache the result
    await CacheUtil.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async getFeaturedProducts(limit: number = 12) {
    const cacheKey = `products:featured:${limit}`;

    return CacheUtil.getOrSet(
      cacheKey,
      async () => {
        const { products } = await this.repository.findProducts(
          { isFeatured: true },
          0,
          limit,
          { totalSold: "desc" }
        );

        return products.map((product) => {
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
        });
      },
      this.CACHE_TTL
    );
  }

  async getNewArrivals(limit: number = 12) {
    const cacheKey = `products:new-arrivals:${limit}`;

    return CacheUtil.getOrSet(
      cacheKey,
      async () => {
        const { products } = await this.repository.findProducts(
          { isNewArrival: true },
          0,
          limit,
          { createdAt: "desc" }
        );

        return products.map((product) => {
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
        });
      },
      this.CACHE_TTL
    );
  }

  async searchProducts(query: string, limit: number = 20) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const cacheKey = `products:search:${query.toLowerCase()}:${limit}`;

    return CacheUtil.getOrSet(
      cacheKey,
      async () => {
        const { products } = await this.repository.searchProducts(query, limit);

        return products.map((product) => {
          const reviews = (product as any).reviews || [];
          const avgRating =
            reviews.length > 0
              ? reviews.reduce(
                  (sum: number, r: { rating: number }) => sum + r.rating,
                  0
                ) / reviews.length
              : 0;

          return {
            ...product,
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
          };
        });
      },
      1800 // 30 minutes for search results
    );
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
}
