import { prisma } from "../../config/database";
import { EmailUtil } from "../../utils/email.util";
import { NotFoundError } from "../../utils/error.util";

export class StockAlertsService {
  async createStockAlert(userId: string, productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Check if alert already exists
    const existingAlert = await prisma.stockAlert.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingAlert) {
      return existingAlert;
    }

    const alert = await prisma.stockAlert.create({
      data: {
        userId,
        productId,
      },
    });

    return alert;
  }

  async deleteStockAlert(userId: string, productId: string) {
    await prisma.stockAlert.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async getUserStockAlerts(userId: string) {
    const alerts = await prisma.stockAlert.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            category: true,
          },
        },
      },
    });

    return alerts;
  }

  async checkAndNotifyStockAlerts(productId: string) {
    // This should be called when product stock is updated
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return;
    }

    // Check if product has stock
    const hasStock = product.variants.some((variant) => variant.stock > 0);

    if (hasStock) {
      const alerts = await prisma.stockAlert.findMany({
        where: { productId },
        include: {
          user: true,
        },
      });

      // Send email notifications
      for (const alert of alerts) {
        await EmailUtil.sendEmail(
          alert.user.email,
          "Product Back in Stock",
          `Great news! ${product.name} is now back in stock. Visit our website to purchase.`
        );

        // Delete alert after notification
        await prisma.stockAlert.delete({
          where: {
            userId_productId: {
              userId: alert.userId,
              productId: alert.productId,
            },
          },
        });
      }
    }
  }
}
