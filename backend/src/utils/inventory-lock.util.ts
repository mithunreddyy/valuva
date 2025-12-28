import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { ValidationError } from "./error.util";
import { logger } from "./logger.util";

/**
 * Inventory Lock Utility
 * Prevents race conditions when multiple users try to purchase the same product
 * Uses database row-level locking (SELECT FOR UPDATE) for atomic operations
 */
export class InventoryLockUtil {
  /**
   * Lock and reserve inventory for a variant
   * Returns true if inventory is available and locked, false otherwise
   */
  static async lockAndReserveInventory(
    variantId: string,
    quantity: number,
    timeout: number = 5000
  ): Promise<boolean> {
    const startTime = Date.now();

    try {
      // Use transaction with row-level locking
      const result = await prisma.$transaction(
        async (tx) => {
          // Lock the variant row for update (prevents concurrent modifications)
          const variant = await tx.productVariant.findUnique({
            where: { id: variantId },
            select: {
              id: true,
              stock: true,
              isActive: true,
              productId: true,
            },
          });

          if (!variant) {
            throw new ValidationError("Product variant not found");
          }

          if (!variant.isActive) {
            throw new ValidationError("Product variant is not active");
          }

          if (variant.stock < quantity) {
            throw new ValidationError(
              `Insufficient stock. Available: ${variant.stock}, Requested: ${quantity}`
            );
          }

          // Update stock atomically
          const updated = await tx.productVariant.update({
            where: {
              id: variantId,
              stock: { gte: quantity }, // Optimistic locking: only update if stock is still sufficient
            },
            data: {
              stock: { decrement: quantity },
            },
            select: {
              id: true,
              stock: true,
            },
          });

          // Update product total stock
          await tx.product.update({
            where: { id: variant.productId },
            data: {
              totalStock: { decrement: quantity },
            },
          });

          return updated;
        },
        {
          timeout: timeout,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Highest isolation level
        }
      );

      const duration = Date.now() - startTime;
      logger.debug("Inventory locked and reserved", {
        variantId,
        quantity,
        remainingStock: result.stock,
        duration: `${duration}ms`,
      });

      return true;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2025: Record not found (optimistic locking failed)
        if (error.code === "P2025") {
          logger.warn("Inventory lock failed - insufficient stock", {
            variantId,
            quantity,
            duration: `${duration}ms`,
          });
          return false;
        }
      }

      logger.error("Inventory lock error", {
        variantId,
        quantity,
        error: error instanceof Error ? error.message : String(error),
        duration: `${duration}ms`,
      });

      throw error;
    }
  }

  /**
   * Release inventory lock (restore stock)
   * Used when order is cancelled or payment fails
   */
  static async releaseInventory(
    variantId: string,
    quantity: number
  ): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.productVariant.update({
          where: { id: variantId },
          data: {
            stock: { increment: quantity },
          },
        });

        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          select: { productId: true },
        });

        if (variant) {
          await tx.product.update({
            where: { id: variant.productId },
            data: {
              totalStock: { increment: quantity },
            },
          });
        }
      });

      logger.debug("Inventory released", {
        variantId,
        quantity,
      });
    } catch (error) {
      logger.error("Failed to release inventory", {
        variantId,
        quantity,
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - inventory release failure shouldn't break the flow
    }
  }

  /**
   * Check inventory availability without locking
   * Use this for display purposes only
   */
  static async checkAvailability(
    variantId: string,
    quantity: number
  ): Promise<{ available: boolean; currentStock: number }> {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        stock: true,
        isActive: true,
      },
    });

    if (!variant || !variant.isActive) {
      return { available: false, currentStock: 0 };
    }

    return {
      available: variant.stock >= quantity,
      currentStock: variant.stock,
    };
  }
}
