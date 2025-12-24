import { Decimal } from "@prisma/client/runtime/library";
import { ERROR_MESSAGES } from "../../config/constants";
import { ValidationError } from "../../utils/error.util";
import { CouponsRepository } from "./coupons.repository";

export class CouponsService {
  private repository: CouponsRepository;

  constructor() {
    this.repository = new CouponsRepository();
  }

  async validateCoupon(code: string, orderSubtotal?: Decimal | number) {
    const coupon = await this.repository.findActiveByCode(code);
    if (!coupon) {
      throw new ValidationError(ERROR_MESSAGES.INVALID_COUPON);
    }

    const subtotalDecimal =
      orderSubtotal instanceof Decimal
        ? orderSubtotal
        : orderSubtotal != null
        ? new Decimal(orderSubtotal)
        : null;

    if (subtotalDecimal && coupon.minPurchase) {
      if (subtotalDecimal.lessThan(coupon.minPurchase)) {
        throw new ValidationError(
          `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`
        );
      }
    }

    return coupon;
  }

  async listActive(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.repository.listActive(skip, limit);
  }
}
