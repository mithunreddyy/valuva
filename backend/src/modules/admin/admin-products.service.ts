import { NotFoundError } from "../../utils/error.util";
import { SlugUtil } from "../../utils/slug.util";
import { AdminProductsRepository } from "./admin-products.repository";

export class AdminProductsService {
  private repository: AdminProductsRepository;

  constructor() {
    this.repository = new AdminProductsRepository();
  }

  async createProduct(data: any) {
    const slug = SlugUtil.generate(data.name);
    return this.repository.createProduct({ ...data, slug });
  }

  async updateProduct(id: string, data: any) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (data.name) {
      data.slug = SlugUtil.generate(data.name);
    }

    return this.repository.updateProduct(id, data);
  }

  async deleteProduct(id: string) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await this.repository.deleteProduct(id);
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
    return this.repository.updateInventory(variantId, change, reason, notes);
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
