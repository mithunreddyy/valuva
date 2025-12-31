import { CouponsRepository } from "../../modules/coupons/coupons.repository";
import { CouponsService } from "../../modules/coupons/coupons.service";

// Mock the repository
jest.mock("../../modules/coupons/coupons.repository");

import { Decimal } from "@prisma/client/runtime/library";

describe("CouponsService", () => {
  let service: CouponsService;
  let mockRepository: jest.Mocked<CouponsRepository>;

  beforeEach(() => {
    mockRepository = {
      findActiveByCode: jest.fn(),
      listActive: jest.fn(),
    } as any;

    (CouponsRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new CouponsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("validateCoupon", () => {
    it("should validate coupon successfully", async () => {
      const code = "SAVE10";
      const mockCoupon = {
        id: "1",
        code,
        discountType: "PERCENTAGE",
        discountValue: new Decimal(10),
        minPurchase: null,
        isActive: true,
      };

      mockRepository.findActiveByCode.mockResolvedValue(mockCoupon as any);

      const result = await service.validateCoupon(code);

      expect(result).toEqual(mockCoupon);
      expect(mockRepository.findActiveByCode).toHaveBeenCalledWith(code);
    });

    it("should validate coupon with minimum purchase requirement", async () => {
      const code = "SAVE20";
      const orderSubtotal = new Decimal(1000);
      const mockCoupon = {
        id: "1",
        code,
        discountType: "PERCENTAGE",
        discountValue: new Decimal(20),
        minPurchase: new Decimal(500),
        isActive: true,
      };

      mockRepository.findActiveByCode.mockResolvedValue(mockCoupon as any);

      const result = await service.validateCoupon(code, orderSubtotal);

      expect(result).toEqual(mockCoupon);
    });

    it("should throw ValidationError if coupon not found", async () => {
      mockRepository.findActiveByCode.mockResolvedValue(null);

      await expect(service.validateCoupon("INVALID")).rejects.toThrow();
    });

    it("should throw ValidationError if order subtotal is less than minimum purchase", async () => {
      const code = "SAVE20";
      const orderSubtotal = new Decimal(300);
      const mockCoupon = {
        id: "1",
        code,
        discountType: "PERCENTAGE",
        discountValue: new Decimal(20),
        minPurchase: new Decimal(500),
        isActive: true,
      };

      mockRepository.findActiveByCode.mockResolvedValue(mockCoupon as any);

      await expect(service.validateCoupon(code, orderSubtotal)).rejects.toThrow(
        "Minimum purchase"
      );
    });

    it("should accept number as orderSubtotal", async () => {
      const code = "SAVE10";
      const orderSubtotal = 1000;
      const mockCoupon = {
        id: "1",
        code,
        discountType: "PERCENTAGE",
        discountValue: new Decimal(10),
        minPurchase: new Decimal(500),
        isActive: true,
      };

      mockRepository.findActiveByCode.mockResolvedValue(mockCoupon as any);

      const result = await service.validateCoupon(code, orderSubtotal);

      expect(result).toEqual(mockCoupon);
    });

    it("should work without orderSubtotal", async () => {
      const code = "SAVE10";
      const mockCoupon = {
        id: "1",
        code,
        discountType: "PERCENTAGE",
        discountValue: new Decimal(10),
        minPurchase: null,
        isActive: true,
      };

      mockRepository.findActiveByCode.mockResolvedValue(mockCoupon as any);

      const result = await service.validateCoupon(code);

      expect(result).toEqual(mockCoupon);
    });
  });

  describe("listActive", () => {
    it("should return paginated active coupons", async () => {
      const page = 1;
      const limit = 10;
      const mockCoupons = [
        {
          id: "1",
          code: "SAVE10",
          discountType: "PERCENTAGE",
          discountValue: new Decimal(10),
          isActive: true,
        },
        {
          id: "2",
          code: "SAVE20",
          discountType: "FIXED",
          discountValue: new Decimal(50),
          isActive: true,
        },
      ];

      mockRepository.listActive.mockResolvedValue({
        coupons: mockCoupons as any,
        total: 2,
      });

      const result = await service.listActive(page, limit);

      expect(result.coupons).toEqual(mockCoupons);
      expect(result.total).toBe(2);
      expect(mockRepository.listActive).toHaveBeenCalledWith(0, limit);
    });

    it("should calculate skip correctly for pagination", async () => {
      const page = 2;
      const limit = 10;

      mockRepository.listActive.mockResolvedValue({
        coupons: [],
        total: 0,
      });

      await service.listActive(page, limit);

      expect(mockRepository.listActive).toHaveBeenCalledWith(10, limit);
    });
  });
});

