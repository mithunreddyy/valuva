import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../config/database";
import { logger } from "./logger.util";

export interface ReconciliationResult {
  orderId: string;
  orderNumber: string;
  expectedAmount: Decimal;
  actualAmount: Decimal;
  difference: Decimal;
  status: "MATCHED" | "MISMATCH" | "MISSING";
  details: string;
}

/**
 * Payment Reconciliation Utility
 * Ensures payment records match order totals
 * Critical for financial accuracy and fraud detection
 */
export class PaymentReconciliationUtil {
  /**
   * Reconcile payment for an order
   * Verifies payment amount matches order total
   */
  static async reconcileOrder(orderId: string): Promise<ReconciliationResult> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const expectedAmount = order.total;
    const actualAmount = order.payment?.amount || new Decimal(0);
    const difference = expectedAmount.sub(actualAmount);

    let status: "MATCHED" | "MISMATCH" | "MISSING";
    let details = "";

    if (!order.payment) {
      status = "MISSING";
      details = "Payment record not found";
    } else if (difference.abs().lessThan(new Decimal(0.01))) {
      // Allow 1 paise difference for rounding
      status = "MATCHED";
      details = "Payment amount matches order total";
    } else {
      status = "MISMATCH";
      details = `Payment amount mismatch: Expected ${expectedAmount}, Got ${actualAmount}, Difference: ${difference}`;
    }

    const result: ReconciliationResult = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      expectedAmount,
      actualAmount,
      difference,
      status,
      details,
    };

    if (status !== "MATCHED") {
      logger.error("Payment reconciliation mismatch", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        expectedAmount: expectedAmount.toString(),
        actualAmount: actualAmount.toString(),
        difference: difference.toString(),
        status,
      });
    }

    return result;
  }

  /**
   * Reconcile all orders in a date range
   * Used for daily/weekly reconciliation reports
   */
  static async reconcileOrders(
    startDate: Date,
    endDate: Date
  ): Promise<{
    total: number;
    matched: number;
    mismatched: number;
    missing: number;
    results: ReconciliationResult[];
  }> {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        payment: true,
      },
    });

    const results: ReconciliationResult[] = [];
    let matched = 0;
    let mismatched = 0;
    let missing = 0;

    for (const order of orders) {
      const result = await this.reconcileOrder(order.id);
      results.push(result);

      if (result.status === "MATCHED") {
        matched++;
      } else if (result.status === "MISMATCH") {
        mismatched++;
      } else {
        missing++;
      }
    }

    logger.info("Payment reconciliation completed", {
      total: orders.length,
      matched,
      mismatched,
      missing,
      dateRange: { startDate, endDate },
    });

    return {
      total: orders.length,
      matched,
      mismatched,
      missing,
      results,
    };
  }

  /**
   * Find orders with payment discrepancies
   */
  static async findDiscrepancies(
    startDate?: Date,
    endDate?: Date
  ): Promise<ReconciliationResult[]> {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        payment: true,
      },
    });

    const discrepancies: ReconciliationResult[] = [];

    for (const order of orders) {
      const result = await this.reconcileOrder(order.id);
      if (result.status !== "MATCHED") {
        discrepancies.push(result);
      }
    }

    return discrepancies;
  }
}

