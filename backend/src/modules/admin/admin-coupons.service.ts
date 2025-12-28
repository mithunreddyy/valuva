import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../utils/error.util";
import { AdminCouponsRepository } from "./admin-coupons.repository";

export class AdminCouponsService {
  private repository: AdminCouponsRepository;

  constructor() {
    this.repository = new AdminCouponsRepository();
  }

  async getAllCoupons(
    page: number,
    limit: number,
    filters?: {
      search?: string;
      isActive?: string;
    }
  ) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit, filters);
  }

  async getCouponById(id: string) {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundError("Coupon not found");
    }
    return coupon;
  }

  async createCoupon(data: any) {
    return this.repository.create(data);
  }

  async updateCoupon(id: string, data: any) {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundError("Coupon not found");
    }
    return this.repository.update(id, data);
  }

  async deleteCoupon(id: string) {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundError("Coupon not found");
    }
    await this.repository.delete(id);
  }

  async toggleCouponStatus(id: string) {
    const coupon = await this.repository.findById(id);
    if (!coupon) {
      throw new NotFoundError("Coupon not found");
    }
    return this.repository.update(id, { isActive: !coupon.isActive });
  }
}

