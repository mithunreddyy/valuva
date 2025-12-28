import { OrderStatus } from "@prisma/client";
import { ValidationError } from "./error.util";
import { logger } from "./logger.util";

/**
 * Order State Machine
 * Defines valid state transitions for orders
 * Prevents invalid state changes and ensures data consistency
 */
export class OrderStateMachine {
  private static readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PROCESSING]: [
      OrderStatus.SHIPPED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.SHIPPED]: [
      OrderStatus.DELIVERED,
      OrderStatus.REFUNDED,
    ],
    [OrderStatus.DELIVERED]: [
      OrderStatus.REFUNDED,
    ],
    [OrderStatus.CANCELLED]: [], // Terminal state
    [OrderStatus.REFUNDED]: [], // Terminal state
  };

  /**
   * Check if a state transition is valid
   */
  static isValidTransition(
    from: OrderStatus,
    to: OrderStatus
  ): boolean {
    if (from === to) {
      return true; // Same state is always valid
    }

    const validNextStates = this.VALID_TRANSITIONS[from];
    if (!validNextStates) {
      logger.warn("Unknown order status", { status: from });
      return false;
    }

    return validNextStates.includes(to);
  }

  /**
   * Validate and transition order status
   * Throws error if transition is invalid
   */
  static validateTransition(
    from: OrderStatus,
    to: OrderStatus,
    context?: string
  ): void {
    if (!this.isValidTransition(from, to)) {
      const errorMessage = context
        ? `Invalid order status transition: ${from} → ${to}. ${context}`
        : `Invalid order status transition: ${from} → ${to}`;

      logger.error("Invalid order state transition", {
        from,
        to,
        context,
      });

      throw new ValidationError(errorMessage);
    }
  }

  /**
   * Get all valid next states for a given status
   */
  static getValidNextStates(from: OrderStatus): OrderStatus[] {
    return this.VALID_TRANSITIONS[from] || [];
  }

  /**
   * Check if order can be cancelled
   */
  static canCancel(status: OrderStatus): boolean {
    return this.isValidTransition(status, OrderStatus.CANCELLED);
  }

  /**
   * Check if order can be refunded
   */
  static canRefund(status: OrderStatus): boolean {
    return this.isValidTransition(status, OrderStatus.REFUNDED);
  }

  /**
   * Check if order is in terminal state
   */
  static isTerminalState(status: OrderStatus): boolean {
    return (
      status === OrderStatus.CANCELLED ||
      status === OrderStatus.REFUNDED
    );
  }

  /**
   * Check if order can be modified
   */
  static canModify(status: OrderStatus): boolean {
    return (
      status === OrderStatus.PENDING ||
      status === OrderStatus.PROCESSING
    );
  }
}

