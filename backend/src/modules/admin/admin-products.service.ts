import { NotFoundError } from "../../utils/error.util";
import { CacheInvalidationUtil } from "../../utils/cache-invalidation.util";
import { SlugUtil } from "../../utils/slug.util";
import { AdminProductsRepository } from "./admin-products.repository";

export class AdminProductsService {
  private repository: AdminProductsRepository;

  constructor() {
    this.repository = new AdminProductsRepository();
  }

  async createProduct(data: any) {
    const slug = SlugUtil.generate(data.name);
    const product = await this.repository.createProduct({ ...data, slug });
    
    // Invalidate cache
    await CacheInvalidationUtil.invalidateProductCache(product.id, product.slug);
    await CacheInvalidationUtil.invalidateAllProductCaches();
    
    return product;
  }

  async updateProduct(id: string, data: any) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (data.name) {
      data.slug = SlugUtil.generate(data.name);
    }

    const updatedProduct = await this.repository.updateProduct(id, data);
    
    // Invalidate cache
    await CacheInvalidationUtil.invalidateProductCache(id, updatedProduct.slug);
    await CacheInvalidationUtil.invalidateAllProductCaches();
    
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await this.repository.deleteProduct(id);
    
    // Invalidate cache
    await CacheInvalidationUtil.invalidateProductCache(id, product.slug);
    await CacheInvalidationUtil.invalidateAllProductCaches();
  }

  async getProductById(id: string) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  async getAllProducts(page: number, limit: number, filters?: any) {
    const skip = (page - 1) * limit;
    const { products, total } = await this.repository.getAllProducts(
      skip,
      limit,
      filters
    );
    return { products, total, page, limit };
  }

  async createVariant(data: any) {
    const product = await this.repository.getProductById(data.productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return this.repository.createVariant(data);
  }

  async updateVariant(id: string, data: any) {
    return this.repository.updateVariant(id, data);
  }

  async updateInventory(
    variantId: string,
    change: number,
    reason: string,
    notes?: string
  ) {
    const result = await this.repository.updateInventory(variantId, change, reason, notes);
    
    // If stock was added (change > 0), check stock alerts
    if (change > 0 && result?.variant?.productId) {
      const { addStockAlertJob } = await import("../../jobs/stock-alerts.job");
      addStockAlertJob(result.variant.productId, 0);
    }
    
    return result;
  }

  async addProductImage(
    productId: string,
    url: string,
    altText?: string,
    isPrimary?: boolean
  ) {
    const product = await this.repository.getProductById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return this.repository.addProductImage(productId, url, altText, isPrimary);
  }

  async deleteProductImage(imageId: string) {
    await this.repository.deleteProductImage(imageId);
  }

  async getLowStockProducts(threshold?: number) {
    return this.repository.getLowStockProducts(threshold);
  }
}
