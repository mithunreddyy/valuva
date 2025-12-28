import { ERROR_MESSAGES } from "../../config/constants";
import { AnalyticsEventType, AnalyticsUtil } from "../../utils/analytics.util";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { CartRepository } from "./cart.repository";

export class CartService {
  private repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  async getCart(userId: string) {
    const cart = await this.repository.findOrCreateCart(userId);

    const cartTotal = cart.items.reduce((sum: number, item) => {
      return sum + Number(item.variant.price) * item.quantity;
    }, 0);

    const itemCount = cart.items.reduce(
      (sum: number, item) => sum + item.quantity,
      0
    );

    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price,
        subtotal: Number(item.variant.price) * item.quantity,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
          slug: item.variant.product.slug,
          image: item.variant.product.images[0]?.url || null,
        },
        variant: {
          size: item.variant.size,
          color: item.variant.color,
          colorHex: item.variant.colorHex,
          stock: item.variant.stock,
        },
      })),
      subtotal: cartTotal,
      itemCount,
    };
  }

  async addToCart(userId: string, variantId: string, quantity: number) {
    const variant = await this.repository.getVariantById(variantId);
    if (!variant) {
      throw new NotFoundError("Product variant not found");
    }

    if (!variant.isActive) {
      throw new ValidationError("Product variant is not available");
    }

    if (variant.stock < quantity) {
      throw new ValidationError(ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    const cart = await this.repository.findOrCreateCart(userId);
    await this.repository.addCartItem(cart.id, variantId, quantity);

    // Track analytics
    AnalyticsUtil.trackAddToCart(
      variant.productId,
      variantId,
      quantity,
      Number(variant.price)
    ).catch(() => {
      // Silently fail - analytics shouldn't break the flow
    });

    return this.getCart(userId);
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cartItem = await this.repository.getCartItemById(itemId);
    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    const cart = await this.repository.getCart(userId);
    if (!cart || !cart.items.some((item) => item.id === itemId)) {
      throw new NotFoundError("Cart item not found in your cart");
    }

    if (cartItem.variant.stock < quantity) {
      throw new ValidationError(ERROR_MESSAGES.INSUFFICIENT_STOCK);
    }

    await this.repository.updateCartItem(itemId, quantity);
    return this.getCart(userId);
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.repository.getCart(userId);
    if (!cart || !cart.items.some((item) => item.id === itemId)) {
      throw new NotFoundError("Cart item not found in your cart");
    }

    const item = cart.items.find((i) => i.id === itemId);
    await this.repository.removeCartItem(itemId);

    // Track analytics
    if (item) {
      AnalyticsUtil.trackEvent({
        userId,
        eventType: AnalyticsEventType.REMOVE_FROM_CART,
        properties: {
          productId: item.variant.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      }).catch(() => {
        // Silently fail
      });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.repository.getCart(userId);
    if (cart) {
      await this.repository.clearCart(cart.id);
    }
    return this.getCart(userId);
  }
}
