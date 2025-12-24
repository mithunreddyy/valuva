import { ConflictError, NotFoundError } from "../../utils/error.util";
import { WishlistRepository } from "./wishlist.repository";

export class WishlistService {
  private repository: WishlistRepository;

  constructor() {
    this.repository = new WishlistRepository();
  }

  async getUserWishlist(userId: string) {
    const wishlist = await this.repository.getUserWishlist(userId);

    return wishlist.map((item) => {
      const avgRating =
        item.product.reviews.length > 0
          ? item.product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            item.product.reviews.length
          : 0;

      return {
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        basePrice: item.product.basePrice,
        compareAtPrice: item.product.compareAtPrice,
        image: item.product.images[0]?.url || null,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: item.product.reviews.length,
        addedAt: item.createdAt,
      };
    });
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.repository.getProduct(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const exists = await this.repository.isInWishlist(userId, productId);
    if (exists) {
      throw new ConflictError("Product already in wishlist");
    }

    await this.repository.addToWishlist(userId, productId);
    return this.getUserWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.repository.removeFromWishlist(userId, productId);
    return this.getUserWishlist(userId);
  }
}
