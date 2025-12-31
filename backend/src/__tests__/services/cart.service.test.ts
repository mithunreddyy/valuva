import { CartRepository } from "../../modules/cart/cart.repository";
import { CartService } from "../../modules/cart/cart.service";

// Mock dependencies
jest.mock("../../modules/cart/cart.repository");
jest.mock("../../utils/analytics.util");

import { NotFoundError, ValidationError } from "../../utils/error.util";

describe("CartService", () => {
  let service: CartService;
  let mockRepository: jest.Mocked<CartRepository>;

  beforeEach(() => {
    mockRepository = {
      findOrCreateCart: jest.fn(),
      getVariantById: jest.fn(),
      addCartItem: jest.fn(),
      getCartItemById: jest.fn(),
      getCart: jest.fn(),
      updateCartItem: jest.fn(),
      removeCartItem: jest.fn(),
      clearCart: jest.fn(),
    } as any;

    (CartRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new CartService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCart", () => {
    it("should return cart with items and totals", async () => {
      const userId = "1";
      const mockCart = {
        id: "cart1",
        items: [
          {
            id: "item1",
            variantId: "variant1",
            quantity: 2,
            variant: {
              price: 100,
              product: {
                id: "product1",
                name: "Test Product",
                slug: "test-product",
                images: [{ url: "image.jpg" }],
              },
              size: "M",
              color: "Red",
              colorHex: "#FF0000",
              stock: 10,
            },
          },
        ],
      };

      mockRepository.findOrCreateCart.mockResolvedValue(mockCart as any);

      const result = await service.getCart(userId);

      expect(result.id).toBe("cart1");
      expect(result.items).toHaveLength(1);
      expect(result.subtotal).toBe(200);
      expect(result.itemCount).toBe(2);
    });

    it("should return empty cart when no items", async () => {
      const userId = "1";
      const mockCart = {
        id: "cart1",
        items: [],
      };

      mockRepository.findOrCreateCart.mockResolvedValue(mockCart as any);

      const result = await service.getCart(userId);

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
      expect(result.itemCount).toBe(0);
    });
  });

  describe("addToCart", () => {
    it("should add item to cart successfully", async () => {
      const userId = "1";
      const variantId = "variant1";
      const quantity = 2;

      const mockVariant = {
        id: variantId,
        productId: "product1",
        price: 100,
        isActive: true,
        stock: 10,
      };

      const mockCart = {
        id: "cart1",
        items: [
          {
            id: "item1",
            variantId,
            quantity,
            variant: {
              price: 100,
              product: {
                id: "product1",
                name: "Test Product",
                slug: "test-product",
                images: [],
              },
              size: "M",
              color: "Red",
              stock: 10,
            },
          },
        ],
      };

      mockRepository.getVariantById.mockResolvedValue(mockVariant as any);
      mockRepository.addCartItem.mockResolvedValue(undefined as any);
      mockRepository.findOrCreateCart.mockResolvedValue(mockCart as any);

      const result = await service.addToCart(userId, variantId, quantity);

      expect(result.items).toHaveLength(1);
      expect(mockRepository.addCartItem).toHaveBeenCalledWith("cart1", variantId, quantity);
    });

    it("should throw NotFoundError if variant not found", async () => {
      mockRepository.getVariantById.mockResolvedValue(null);

      await expect(service.addToCart("userId", "nonexistent", 1)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ValidationError if variant is inactive", async () => {
      const mockVariant = {
        id: "variant1",
        isActive: false,
        stock: 10,
      };

      mockRepository.getVariantById.mockResolvedValue(mockVariant as any);

      await expect(service.addToCart("userId", "variant1", 1)).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError if insufficient stock", async () => {
      const mockVariant = {
        id: "variant1",
        isActive: true,
        stock: 5,
      };

      mockRepository.getVariantById.mockResolvedValue(mockVariant as any);

      await expect(service.addToCart("userId", "variant1", 10)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("updateCartItem", () => {
    it("should update cart item quantity", async () => {
      const userId = "1";
      const itemId = "item1";
      const newQuantity = 3;

      const mockCartItem = {
        id: itemId,
        variant: {
          stock: 10,
        },
      };

      const mockCart = {
        id: "cart1",
        items: [mockCartItem],
      };

      const updatedCart = {
        id: "cart1",
        items: [
          {
            ...mockCartItem,
            quantity: newQuantity,
            variant: {
              price: 100,
              product: {
                id: "product1",
                name: "Test Product",
                slug: "test-product",
                images: [],
              },
              stock: 10,
            },
          },
        ],
      };

      mockRepository.getCartItemById.mockResolvedValue(mockCartItem as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      mockRepository.updateCartItem.mockResolvedValue(undefined as any);
      mockRepository.findOrCreateCart.mockResolvedValue(updatedCart as any);

      await service.updateCartItem(userId, itemId, newQuantity);

      expect(mockRepository.updateCartItem).toHaveBeenCalledWith(itemId, newQuantity);
    });

    it("should throw NotFoundError if cart item not found", async () => {
      mockRepository.getCartItemById.mockResolvedValue(null);

      await expect(service.updateCartItem("userId", "nonexistent", 1)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ValidationError if insufficient stock", async () => {
      const mockCartItem = {
        id: "item1",
        variant: {
          stock: 5,
        },
      };

      const mockCart = {
        id: "cart1",
        items: [mockCartItem],
      };

      mockRepository.getCartItemById.mockResolvedValue(mockCartItem as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);

      await expect(service.updateCartItem("userId", "item1", 10)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("removeCartItem", () => {
    it("should remove cart item successfully", async () => {
      const userId = "1";
      const itemId = "item1";

      const mockCart = {
        id: "cart1",
        items: [
          {
            id: itemId,
            variantId: "variant1",
            quantity: 2,
            variant: {
              productId: "product1",
            },
          },
        ],
      };

      const emptyCart = {
        id: "cart1",
        items: [],
      };

      mockRepository.getCart.mockResolvedValue(mockCart as any);
      mockRepository.removeCartItem.mockResolvedValue(undefined as any);
      mockRepository.findOrCreateCart.mockResolvedValue(emptyCart as any);

      const result = await service.removeCartItem(userId, itemId);

      expect(mockRepository.removeCartItem).toHaveBeenCalledWith(itemId);
      expect(result.items).toHaveLength(0);
    });

    it("should throw NotFoundError if cart item not found", async () => {
      mockRepository.getCart.mockResolvedValue({
        id: "cart1",
        items: [],
      } as any);

      await expect(service.removeCartItem("userId", "nonexistent")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("clearCart", () => {
    it("should clear all cart items", async () => {
      const userId = "1";

      const mockCart = {
        id: "cart1",
        items: [
          { id: "item1", variantId: "variant1", quantity: 2 },
          { id: "item2", variantId: "variant2", quantity: 1 },
        ],
      };

      const emptyCart = {
        id: "cart1",
        items: [],
      };

      mockRepository.getCart.mockResolvedValue(mockCart as any);
      mockRepository.clearCart.mockResolvedValue(undefined as any);
      mockRepository.findOrCreateCart.mockResolvedValue(emptyCart as any);

      const result = await service.clearCart(userId);

      expect(mockRepository.clearCart).toHaveBeenCalledWith("cart1");
      expect(result.items).toHaveLength(0);
    });
  });
});

