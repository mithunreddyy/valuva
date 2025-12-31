/**
 * Admin Bulk Operations Service
 * Production-ready bulk operations for admin efficiency
 * Handles bulk updates, deletions, and imports with proper validation and error handling
 */

import { OrderStatus } from "@prisma/client";
import { prisma } from "../../config/database";
import { AuditAction, AuditLogUtil } from "../../utils/audit-log.util";
import { ValidationError } from "../../utils/error.util";
import { logger } from "../../utils/logger.util";

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

export class AdminBulkService {
  /**
   * Bulk update product status
   */
  async bulkUpdateProductStatus(
    productIds: string[],
    isActive: boolean,
    userId: string
  ): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const productId of productIds) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          result.failed++;
          result.errors.push({
            id: productId,
            error: "Product not found",
          });
          continue;
        }

        await prisma.product.update({
          where: { id: productId },
          data: { isActive },
        });

        await AuditLogUtil.logAdminAction(
          userId,
          AuditAction.UPDATE,
          "Product",
          productId,
          { isActive }
        );

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          id: productId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info("Bulk product status update completed", {
      total: productIds.length,
      success: result.success,
      failed: result.failed,
      userId,
    });

    return result;
  }

  /**
   * Bulk delete products
   */
  async bulkDeleteProducts(
    productIds: string[],
    userId: string
  ): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const productId of productIds) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          result.failed++;
          result.errors.push({
            id: productId,
            error: "Product not found",
          });
          continue;
        }

        // Check if product has orders
        const orderCount = await prisma.orderItem.count({
          where: {
            variant: {
              productId,
            },
          },
        });

        if (orderCount > 0) {
          result.failed++;
          result.errors.push({
            id: productId,
            error: `Cannot delete product with ${orderCount} order(s)`,
          });
          continue;
        }

        await prisma.product.delete({
          where: { id: productId },
        });

        await AuditLogUtil.logAdminAction(
          userId,
          AuditAction.DELETE,
          "Product",
          productId,
          {}
        );

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          id: productId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info("Bulk product deletion completed", {
      total: productIds.length,
      success: result.success,
      failed: result.failed,
      userId,
    });

    return result;
  }

  /**
   * Bulk update order status
   */
  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: string,
    userId: string
  ): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const orderId of orderIds) {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          result.failed++;
          result.errors.push({
            id: orderId,
            error: "Order not found",
          });
          continue;
        }

        await prisma.order.update({
          where: { id: orderId },
          data: { status: status as OrderStatus },
        });

        await AuditLogUtil.logOrder(
          userId,
          orderId,
          AuditAction.UPDATE,
          { status },
          undefined
        );

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          id: orderId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info("Bulk order status update completed", {
      total: orderIds.length,
      success: result.success,
      failed: result.failed,
      userId,
    });

    return result;
  }

  /**
   * Bulk export data
   */
  async bulkExportData(
    entityType: "products" | "orders" | "users" | "categories",
    filters?: Record<string, unknown>
  ): Promise<unknown[]> {
    switch (entityType) {
      case "products":
        return prisma.product.findMany({
          where: filters,
          include: {
            images: true,
            variants: true,
            category: true,
          },
        });

      case "orders":
        return prisma.order.findMany({
          where: filters,
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            user: true,
            payment: true,
          },
        });

      case "users":
        return prisma.user.findMany({
          where: filters,
          include: {
            addresses: true,
          },
        });

      case "categories":
        return prisma.category.findMany({
          where: filters,
          include: {
            subCategories: true,
          },
        });

      default:
        throw new ValidationError(`Invalid entity type: ${entityType}`);
    }
  }
}
