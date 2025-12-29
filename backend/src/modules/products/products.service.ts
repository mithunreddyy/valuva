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

  /**
   * Get available filter options (sizes and colors) from actual product variants
   * Production-ready: Fetches real data from database
   */
  async getFilterOptions() {
    const cacheKey = "products:filter-options";
    const cached = await CacheUtil.get<{
      sizes: string[];
      colors: Array<{ name: string; value: string; hex?: string }>;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const variants = await this.repository.getAvailableVariants();

    // Extract unique sizes
    const sizes = Array.from(
      new Set(variants.map((v) => v.size).filter(Boolean))
    ).sort();

    // Extract unique colors with hex values
    const colorMap = new Map<
      string,
      { name: string; value: string; hex?: string }
    >();
    variants.forEach((v) => {
      if (v.color && !colorMap.has(v.color.toLowerCase())) {
        colorMap.set(v.color.toLowerCase(), {
          name: v.color,
          value: v.color.toLowerCase(),
          hex: v.colorHex || undefined,
        });
      }
    });
    const colors = Array.from(colorMap.values());

    const result = { sizes, colors };

    // Cache for 1 hour
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

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    const productWithRating = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    // Cache for 1 hour
    await CacheUtil.set(cacheKey, productWithRating, this.CACHE_TTL);

    return productWithRating;
  }

  async getProductById(id: string) {
    const cacheKey = `product:id:${id}`;
    const cached = await CacheUtil.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.repository.findProductById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    const productWithRating = {
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    // Cache for 1 hour
    await CacheUtil.set(cacheKey, productWithRating, this.CACHE_TTL);

    return productWithRating;
  }

  async getRelatedProducts(productId: string) {
    const product = await this.repository.findProductById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const related = await this.repository.findRelatedProducts(
      productId,
      product.categoryId,
      (product.subCategoryId as string | undefined)
        ? (product.subCategoryId as string).length
        : undefined
    );

    return related.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          : 0;

      return {
        ...p,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: p.reviews.length,
      };
    });
  }

  async getFeaturedProducts(limit: number = 12) {
    const cacheKey = `products:featured:${limit}`;
    const cached = await CacheUtil.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.getProducts(
      { isFeatured: true },
      1,
      limit,
      "popular"
    );

    await CacheUtil.set(cacheKey, result.products, this.CACHE_TTL);
    return result.products;
  }

  async getNewArrivals(limit: number = 12) {
    const cacheKey = `products:new-arrivals:${limit}`;
    const cached = await CacheUtil.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.getProducts(
      { isNewArrival: true },
      1,
      limit,
      "newest"
    );

    await CacheUtil.set(cacheKey, result.products, this.CACHE_TTL);
    return result.products;
  }

  async searchProducts(query: string, limit: number = 10) {
    const products = await this.repository.searchProducts(query, limit);

    return (products as { products: any[] }).products.map((product: any) => {
      const avgRating =
        product.reviews && product.reviews.length > 0
          ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews?.length || 0,
      };
    });
  }
}
