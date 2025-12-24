import { ORDER_NUMBER_PREFIX } from "../config/constants";

export class OrderUtil {
  static generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${ORDER_NUMBER_PREFIX}-${timestamp}-${random}`;
  }
}
