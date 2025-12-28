import { prisma } from "../config/database";
import { logger } from "./logger.util";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  PAYMENT = "PAYMENT",
  ORDER = "ORDER",
  REFUND = "REFUND",
  INVENTORY = "INVENTORY",
  ADMIN_ACTION = "ADMIN_ACTION",
}

export interface AuditLogData {
  userId?: string;
  adminId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Audit Logging Utility
 * Logs all critical operations for compliance and security
 * Production-ready audit trail for financial and sensitive operations
 */
export class AuditLogUtil {
  /**
   * Create an audit log entry
   */
  static async log(data: AuditLogData): Promise<void> {
    try {
      // In production, you might want to use a separate audit log table
      // For now, we'll use structured logging
      logger.info("Audit log", {
        userId: data.userId,
        adminId: data.adminId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
        timestamp: new Date().toISOString(),
      });

      // Optionally store in database for long-term retention
      // Uncomment if you add an AuditLog model to Prisma schema
      /*
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          adminId: data.adminId,
          action: data.action,
          resourceType: data.resourceType,
          resourceId: data.resourceId,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          metadata: data.metadata,
        },
      });
      */
    } catch (error) {
      // Don't let audit logging failures break the main flow
      logger.error("Failed to create audit log", {
        error: error instanceof Error ? error.message : String(error),
        auditData: data,
      });
    }
  }

  /**
   * Log user action
   */
  static async logUserAction(
    userId: string,
    action: AuditAction,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log admin action
   */
  static async logAdminAction(
    adminId: string,
    action: AuditAction,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      adminId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log payment transaction
   */
  static async logPayment(
    userId: string,
    orderId: string,
    amount: number,
    paymentMethod: string,
    status: string,
    transactionId?: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: AuditAction.PAYMENT,
      resourceType: "Payment",
      resourceId: transactionId,
      details: {
        orderId,
        amount,
        paymentMethod,
        status,
        transactionId,
      },
      ipAddress,
    });
  }

  /**
   * Log order creation/update
   */
  static async logOrder(
    userId: string,
    orderId: string,
    action: AuditAction,
    details?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resourceType: "Order",
      resourceId: orderId,
      details,
      ipAddress,
    });
  }

  /**
   * Log inventory changes
   */
  static async logInventory(
    adminId: string,
    variantId: string,
    change: number,
    reason: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      adminId,
      action: AuditAction.INVENTORY,
      resourceType: "ProductVariant",
      resourceId: variantId,
      details: {
        change,
        reason,
      },
      ipAddress,
    });
  }
}

