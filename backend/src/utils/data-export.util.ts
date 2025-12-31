/**
 * Data Export/Import Utility
 * Production-ready data export and import functionality
 * Supports CSV, JSON formats with proper validation
 */

import { prisma } from "../config/database";
import { logger } from "./logger.util";

export type ExportFormat = "csv" | "json";

export interface ExportOptions {
  format: ExportFormat;
  outputPath?: string;
  fields?: string[];
  filters?: Record<string, unknown>;
}

export class DataExportUtil {
  /**
   * Export products to CSV/JSON
   */
  async exportProducts(options: ExportOptions): Promise<string> {
    const { format, outputPath, fields, filters } = options;

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    if (format === "csv") {
      return this.exportToCSV(products, outputPath, fields);
    } else {
      return this.exportToJSON(products, outputPath, fields);
    }
  }

  /**
   * Export orders to CSV/JSON
   */
  async exportOrders(options: ExportOptions): Promise<string> {
    const { format, outputPath, fields, filters } = options;

    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (format === "csv") {
      return this.exportToCSV(orders, outputPath, fields);
    } else {
      return this.exportToJSON(orders, outputPath, fields);
    }
  }

  /**
   * Export users to CSV/JSON
   */
  async exportUsers(options: ExportOptions): Promise<string> {
    const { format, outputPath, fields, filters } = options;

    const users = await prisma.user.findMany({
      where: filters,
      include: {
        addresses: true,
      },
    });

    // Remove sensitive data
    const sanitized = users.map((user) => ({
      ...user,
      password: undefined,
      refreshToken: undefined,
      passwordResetToken: undefined,
    }));

    if (format === "csv") {
      return this.exportToCSV(sanitized, outputPath, fields);
    } else {
      return this.exportToJSON(sanitized, outputPath, fields);
    }
  }

  /**
   * Export to CSV format
   */
  private async exportToCSV(
    data: unknown[],
    outputPath?: string,
    fields?: string[]
  ): Promise<string> {
    if (data.length === 0) {
      throw new Error("No data to export");
    }

    // Determine fields to export
    const firstItem = data[0];
    if (!firstItem || typeof firstItem !== "object") {
      throw new Error("Invalid data format");
    }
    const exportFields =
      fields || Object.keys(firstItem as Record<string, unknown>);

    // Create CSV header
    const header = exportFields.join(",") + "\n";

    // Create CSV rows
    const rows = data.map((item) => {
      return exportFields
        .map((field) => {
          const value = this.getNestedValue(item, field);
          // Escape commas and quotes in CSV
          const stringValue = String(value || "").replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(",");
    });

    const csv = header + rows.join("\n");

    if (outputPath) {
      const fs = require("fs/promises");
      await fs.writeFile(outputPath, csv, "utf-8");
      logger.info("Data exported to CSV", {
        path: outputPath,
        rows: data.length,
      });
      return outputPath;
    }

    return csv;
  }

  /**
   * Export to JSON format
   */
  private async exportToJSON(
    data: unknown[],
    outputPath?: string,
    fields?: string[]
  ): Promise<string> {
    let exportData = data;

    // Filter fields if specified
    if (fields) {
      exportData = data.map((item) => {
        const filtered: Record<string, unknown> = {};
        for (const field of fields) {
          filtered[field] = this.getNestedValue(item, field);
        }
        return filtered;
      });
    }

    const json = JSON.stringify(exportData, null, 2);

    if (outputPath) {
      const fs = require("fs/promises");
      await fs.writeFile(outputPath, json, "utf-8");
      logger.info("Data exported to JSON", {
        path: outputPath,
        rows: data.length,
      });
      return outputPath;
    }

    return json;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split(".").reduce((current: unknown, prop: string) => {
      if (current && typeof current === "object" && prop in current) {
        return (current as Record<string, unknown>)[prop];
      }
      return undefined;
    }, obj);
  }

  /**
   * Import data from JSON
   */
  async importFromJSON(
    filePath: string,
    entityType: "products" | "orders" | "users"
  ): Promise<{ imported: number; errors: number }> {
    const fs = require("fs/promises");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error("Import data must be an array");
    }

    let imported = 0;
    let errors = 0;

    for (const item of data) {
      try {
        switch (entityType) {
          case "products":
            await this.importProduct(item);
            break;
          case "users":
            await this.importUser(item);
            break;
          default:
            throw new Error(`Import not supported for ${entityType}`);
        }
        imported++;
      } catch (error) {
        errors++;
        logger.error("Import item failed", {
          entityType,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info("Data import completed", {
      entityType,
      imported,
      errors,
    });

    return { imported, errors };
  }

  private async importProduct(data: Record<string, unknown>): Promise<void> {
    // Validate required fields
    const name = data.name;
    const basePrice = data.basePrice;
    const categoryId = data.categoryId;

    if (
      typeof name !== "string" ||
      typeof basePrice !== "number" ||
      typeof categoryId !== "string"
    ) {
      throw new Error("Missing required fields: name, basePrice, categoryId");
    }

    const { SlugUtil } = await import("../utils/slug.util");
    const productSlug = SlugUtil.generate(name);

    await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description:
          typeof data.description === "string" ? data.description : "",
        basePrice,
        compareAtPrice:
          typeof data.compareAtPrice === "number"
            ? data.compareAtPrice
            : undefined,
        sku: typeof data.sku === "string" ? data.sku : `SKU-${Date.now()}`,
        category: {
          connect: { id: categoryId },
        },
        isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        isFeatured: data.isFeatured === true,
        isNewArrival: data.isNewArrival === true,
      },
    });
  }

  private async importUser(data: Record<string, unknown>): Promise<void> {
    // Validate required fields
    const email = data.email;
    const firstName = data.firstName;
    const lastName = data.lastName;

    if (
      typeof email !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string"
    ) {
      throw new Error("Missing required fields: email, firstName, lastName");
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Note: Password should be hashed before import
    // This is a simplified version - in production, require pre-hashed passwords
    await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password:
          typeof data.password === "string"
            ? data.password
            : "CHANGE_PASSWORD_REQUIRED",
        phone: typeof data.phone === "string" ? data.phone : undefined,
        isEmailVerified: data.isEmailVerified === true,
      },
    });
  }
}

export const dataExport = new DataExportUtil();
