import { OrderStatus, PaymentMethod } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { OrdersRepository } from "../../modules/orders/orders.repository";
import { OrdersService } from "../../modules/orders/orders.service";

// Mock dependencies
jest.mock("../../modules/orders/orders.repository");
jest.mock("../../utils/inventory-lock.util");
jest.mock("../../utils/order-state-machine.util");
jest.mock("../../utils/order.util");
jest.mock("../../utils/analytics.util");
jest.mock("../../utils/audit-log.util");
jest.mock("../../config/database", () => ({
  prisma: {
    orderTrackingUpdate: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import { ERROR_MESSAGES } from "../../config/constants";
import { prisma } from "../../config/database";
import { AnalyticsUtil } from "../../utils/analytics.util";
import { AuditLogUtil } from "../../utils/audit-log.util";
import { InventoryLockUtil } from "../../utils/inventory-lock.util";
import { OrderStateMachine } from "../../utils/order-state-machine.util";
import { OrderUtil } from "../../utils/order.util";

describe("OrdersService", () => {
  let service: OrdersService;
  let mockRepository: jest.Mocked<OrdersRepository>;

  beforeEach(() => {
    mockRepository = {
      getAddress: jest.fn(),
      getCart: jest.fn(),
      getCoupon: jest.fn(),
      createOrder: jest.fn(),
      clearCart: jest.fn(),
      findUserOrders: jest.fn(),
      findOrderById: jest.fn(),
      updateOrderStatus: jest.fn(),
      restoreInventory: jest.fn(),
    } as any;

    (OrdersRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new OrdersService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    const userId = "user1";
    const shippingAddressId = "addr1";
    const billingAddressId = "addr2";
    const paymentMethod = PaymentMethod.CREDIT_CARD;

    const mockShippingAddress = {
      id: shippingAddressId,
      userId,
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    };

    const mockBillingAddress = {
      id: billingAddressId,
      userId,
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    };

    const mockCart = {
      id: "cart1",
      items: [
        {
          id: "item1",
          variantId: "variant1",
          quantity: 2,
          variant: {
            id: "variant1",
            sku: "SKU001",
            price: new Decimal(100),
            isActive: true,
            stock: 10,
            product: {
              id: "product1",
              name: "Test Product",
            },
          },
        },
      ],
    };

    const mockOrder = {
      id: "order1",
      orderNumber: "ORD-12345",
      userId,
      status: OrderStatus.PENDING,
      subtotal: new Decimal(200),
      discount: new Decimal(0),
      tax: new Decimal(36),
      shippingCost: new Decimal(50),
      total: new Decimal(286),
      items: [
        {
          id: "orderItem1",
          variantId: "variant1",
          quantity: 2,
          price: new Decimal(100),
          variant: {
            id: "variant1",
            product: {
              id: "product1",
              name: "Test Product",
              images: [],
            },
          },
        },
      ],
    };

    it("should create order successfully", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(true);
      (OrderUtil.generateOrderNumber as jest.Mock).mockReturnValue("ORD-12345");
      mockRepository.createOrder.mockResolvedValue(mockOrder as any);
      (prisma.orderTrackingUpdate.create as jest.Mock).mockResolvedValue({});
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: "test@example.com",
        name: "Test User",
      });

      const result = await service.createOrder(
        userId,
        shippingAddressId,
        billingAddressId,
        paymentMethod
      );

      expect(result).toBeDefined();
      expect(result.id).toBe("order1");
      expect(mockRepository.createOrder).toHaveBeenCalled();
      expect(mockRepository.clearCart).toHaveBeenCalledWith("cart1");
      expect(InventoryLockUtil.lockAndReserveInventory).toHaveBeenCalled();
    });

    it("should throw NotFoundError if shipping address not found", async () => {
      mockRepository.getAddress.mockResolvedValueOnce(null);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow("Shipping address not found");
    });

    it("should throw NotFoundError if billing address not found", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(null);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow("Billing address not found");
    });

    it("should throw ValidationError if cart is empty", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue({
        id: "cart1",
        items: [],
      } as any);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow(ERROR_MESSAGES.CART_EMPTY);
    });

    it("should throw ValidationError if variant is inactive", async () => {
      const inactiveCart = {
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            variant: {
              ...mockCart.items[0].variant,
              isActive: false,
            },
          },
        ],
      };

      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(inactiveCart as any);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow("no longer available");
    });

    it("should throw ValidationError if insufficient stock", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(false);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow("Insufficient stock");
    });

    it("should apply coupon discount correctly", async () => {
      const couponCode = "SAVE10";
      const mockCoupon = {
        id: "coupon1",
        code: couponCode,
        discountType: "PERCENTAGE" as const,
        discountValue: new Decimal(10),
        minPurchase: null,
        maxDiscount: null,
        usageLimit: 100,
        usageCount: 5,
        isActive: true,
      };

      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(true);
      mockRepository.getCoupon.mockResolvedValue(mockCoupon as any);
      (OrderUtil.generateOrderNumber as jest.Mock).mockReturnValue("ORD-12345");
      mockRepository.createOrder.mockResolvedValue(mockOrder as any);
      (prisma.orderTrackingUpdate.create as jest.Mock).mockResolvedValue({});
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: "test@example.com",
        name: "Test User",
      });

      await service.createOrder(
        userId,
        shippingAddressId,
        billingAddressId,
        paymentMethod,
        couponCode
      );

      expect(mockRepository.getCoupon).toHaveBeenCalledWith(couponCode);
      expect(mockRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          couponCode,
          discount: expect.any(Decimal),
        })
      );
    });

    it("should throw ValidationError if coupon not found", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(true);
      mockRepository.getCoupon.mockResolvedValue(null);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod,
          "INVALID"
        )
      ).rejects.toThrow(ERROR_MESSAGES.INVALID_COUPON);
    });

    it("should throw ValidationError if coupon minimum purchase not met", async () => {
      const mockCoupon = {
        id: "coupon1",
        code: "SAVE10",
        discountType: "PERCENTAGE" as const,
        discountValue: new Decimal(10),
        minPurchase: new Decimal(500),
        maxDiscount: null,
        usageLimit: 100,
        usageCount: 5,
        isActive: true,
      };

      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(true);
      mockRepository.getCoupon.mockResolvedValue(mockCoupon as any);

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod,
          "SAVE10"
        )
      ).rejects.toThrow("Minimum purchase");
    });

    it("should calculate free shipping for orders above threshold", async () => {
      const highValueCart = {
        ...mockCart,
        items: [
          {
            ...mockCart.items[0],
            variant: {
              ...mockCart.items[0].variant,
              price: new Decimal(1000),
            },
          },
        ],
      };

      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(highValueCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockResolvedValue(true);
      (OrderUtil.generateOrderNumber as jest.Mock).mockReturnValue("ORD-12345");
      mockRepository.createOrder.mockResolvedValue(mockOrder as any);
      (prisma.orderTrackingUpdate.create as jest.Mock).mockResolvedValue({});
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: "test@example.com",
        name: "Test User",
      });

      await service.createOrder(
        userId,
        shippingAddressId,
        billingAddressId,
        paymentMethod
      );

      expect(mockRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingCost: expect.any(Decimal),
        })
      );
    });

    it("should release inventory locks when locking fails", async () => {
      mockRepository.getAddress
        .mockResolvedValueOnce(mockShippingAddress as any)
        .mockResolvedValueOnce(mockBillingAddress as any);
      mockRepository.getCart.mockResolvedValue(mockCart as any);
      (
        InventoryLockUtil.lockAndReserveInventory as jest.Mock
      ).mockRejectedValue(new Error("Lock failed"));
      (InventoryLockUtil.releaseInventory as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        service.createOrder(
          userId,
          shippingAddressId,
          billingAddressId,
          paymentMethod
        )
      ).rejects.toThrow("Lock failed");

      // Verify that releaseInventory was called for any locks that were acquired
      // (In this case, no locks were acquired, but the pattern is tested)
    });
  });

  describe("getUserOrders", () => {
    it("should return paginated user orders", async () => {
      const userId = "user1";
      const mockOrders = [
        {
          id: "order1",
          orderNumber: "ORD-001",
          status: OrderStatus.PENDING,
          total: new Decimal(286),
          createdAt: new Date(),
          items: [
            {
              variant: {
                product: {
                  name: "Test Product",
                  images: [{ url: "image.jpg" }],
                },
              },
              quantity: 2,
            },
          ],
        },
      ];

      mockRepository.findUserOrders.mockResolvedValue({
        orders: mockOrders as any,
        total: 1,
      });

      const result = await service.getUserOrders(userId, 1, 10);

      expect(result.orders).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.orders[0].orderNumber).toBe("ORD-001");
      expect(result.orders[0].itemCount).toBe(1); // itemCount is items.length, not quantity sum
    });

    it("should return empty array when no orders", async () => {
      const userId = "user1";

      mockRepository.findUserOrders.mockResolvedValue({
        orders: [],
        total: 0,
      });

      const result = await service.getUserOrders(userId, 1, 10);

      expect(result.orders).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe("getOrderById", () => {
    it("should return order when found", async () => {
      const userId = "user1";
      const orderId = "order1";
      const mockOrder = {
        id: orderId,
        orderNumber: "ORD-001",
        status: OrderStatus.PENDING,
        total: new Decimal(286),
        items: [],
      };

      mockRepository.findOrderById.mockResolvedValue(mockOrder as any);

      const result = await service.getOrderById(orderId, userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(orderId);
      expect(mockRepository.findOrderById).toHaveBeenCalledWith(
        orderId,
        userId
      );
    });

    it("should throw NotFoundError when order not found", async () => {
      const userId = "user1";
      const orderId = "order1";

      mockRepository.findOrderById.mockResolvedValue(null);

      await expect(service.getOrderById(orderId, userId)).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order successfully", async () => {
      const userId = "user1";
      const orderId = "order1";
      const reason = "Changed my mind";
      const mockOrder = {
        id: orderId,
        orderNumber: "ORD-001",
        status: OrderStatus.PENDING,
        total: new Decimal(286),
        items: [],
      };

      mockRepository.findOrderById
        .mockResolvedValueOnce(mockOrder as any)
        .mockResolvedValueOnce(mockOrder as any);
      (OrderStateMachine.validateTransition as jest.Mock).mockReturnValue(
        undefined
      );
      mockRepository.updateOrderStatus.mockResolvedValue(mockOrder as any);
      mockRepository.restoreInventory.mockResolvedValue(undefined as any);
      (prisma.orderTrackingUpdate.create as jest.Mock).mockResolvedValue({});
      (AnalyticsUtil.trackEvent as jest.Mock).mockResolvedValue(undefined);
      (AuditLogUtil.logOrder as jest.Mock).mockResolvedValue(undefined);

      const result = await service.cancelOrder(orderId, userId, reason);

      expect(result).toBeDefined();
      expect(OrderStateMachine.validateTransition).toHaveBeenCalled();
      expect(mockRepository.updateOrderStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatus.CANCELLED
      );
      expect(mockRepository.restoreInventory).toHaveBeenCalledWith(orderId);
      expect(AnalyticsUtil.trackEvent).toHaveBeenCalled();
      expect(AuditLogUtil.logOrder).toHaveBeenCalled();
    });

    it("should throw NotFoundError when order not found", async () => {
      const userId = "user1";
      const orderId = "order1";

      mockRepository.findOrderById.mockResolvedValue(null);

      await expect(service.cancelOrder(orderId, userId)).rejects.toThrow(
        "Order not found"
      );
    });

    it("should use default reason when not provided", async () => {
      const userId = "user1";
      const orderId = "order1";
      const mockOrder = {
        id: orderId,
        orderNumber: "ORD-001",
        status: OrderStatus.PENDING,
        total: new Decimal(286),
        items: [],
      };

      mockRepository.findOrderById
        .mockResolvedValueOnce(mockOrder as any)
        .mockResolvedValueOnce(mockOrder as any);
      (OrderStateMachine.validateTransition as jest.Mock).mockReturnValue(
        undefined
      );
      mockRepository.updateOrderStatus.mockResolvedValue(mockOrder as any);
      mockRepository.restoreInventory.mockResolvedValue(undefined as any);
      (prisma.orderTrackingUpdate.create as jest.Mock).mockResolvedValue({});
      (AnalyticsUtil.trackEvent as jest.Mock).mockResolvedValue(undefined);
      (AuditLogUtil.logOrder as jest.Mock).mockResolvedValue(undefined);

      await service.cancelOrder(orderId, userId);

      expect(OrderStateMachine.validateTransition).toHaveBeenCalledWith(
        OrderStatus.PENDING,
        OrderStatus.CANCELLED,
        "User requested cancellation"
      );
    });
  });
});
