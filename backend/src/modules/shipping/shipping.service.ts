import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { NotFoundError, ValidationError } from "../../utils/error.util";
import { logger } from "../../utils/logger.util";
import { ShiprocketService } from "./shiprocket.service";

interface ShippingRate {
  carrier: string;
  service: string;
  rate: number;
  estimatedDays: number;
  trackingAvailable: boolean;
}

interface TrackingInfo {
  trackingNumber: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: Date;
  history: Array<{
    status: string;
    location: string;
    timestamp: Date;
  }>;
}

export class ShippingService {
  private shiprocketService: ShiprocketService;

  constructor() {
    this.shiprocketService = new ShiprocketService();
  }

  /**
   * Calculate shipping rate based on address, weight, and dimensions
   * Uses real carrier APIs when configured, falls back to zone-based pricing
   */
  async calculateShippingRate(
    address: {
      city: string;
      state: string;
      postalCode: string;
      country: string;
    },
    weight: number, // in kg
    dimensions?: {
      length: number; // in cm
      width: number;
      height: number;
    }
  ): Promise<ShippingRate> {
    if (weight <= 0) {
      throw new ValidationError("Weight must be greater than 0");
    }

    // Use real carrier API if configured
    if (
      env.SHIPPING_CARRIER === "shiprocket" &&
      env.SHIPROCKET_EMAIL &&
      env.SHIPROCKET_PASSWORD
    ) {
      try {
        // Extract pincode from address (assuming Indian addresses)
        const pickupPincode = process.env.SHIPPING_PICKUP_PINCODE || "110001"; // Default to Delhi
        const deliveryPincode = address.postalCode;

        const rates = await this.shiprocketService.calculateRate(
          pickupPincode,
          deliveryPincode,
          weight
        );

        if (rates.length > 0) {
          // Return the first (cheapest) rate
          return rates[0];
        }
      } catch (error) {
        logger.warn("Carrier API failed, falling back to zone-based pricing", {
          error: error instanceof Error ? error.message : String(error),
        });
        // Fall through to zone-based pricing
      }
    }

    // Zone-based pricing for India (fallback)
    const zones: Record<
      string,
      { baseRate: number; perKgRate: number; estimatedDays: number }
    > = {
      // Metro cities - Zone 1
      mumbai: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      delhi: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      bangalore: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      chennai: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      kolkata: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      hyderabad: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },
      pune: { baseRate: 50, perKgRate: 15, estimatedDays: 2 },

      // Tier 2 cities - Zone 2
      ahmedabad: { baseRate: 75, perKgRate: 20, estimatedDays: 3 },
      jaipur: { baseRate: 75, perKgRate: 20, estimatedDays: 3 },
      surat: { baseRate: 75, perKgRate: 20, estimatedDays: 3 },
      lucknow: { baseRate: 75, perKgRate: 20, estimatedDays: 3 },

      // Default - Zone 3
      default: { baseRate: 100, perKgRate: 25, estimatedDays: 5 },
    };

    const cityLower = address.city.toLowerCase();
    const zone = zones[cityLower] || zones.default;

    // Calculate volumetric weight if dimensions provided
    let chargeableWeight = weight;
    if (dimensions) {
      const volumetricWeight =
        (dimensions.length * dimensions.width * dimensions.height) / 5000; // in kg
      chargeableWeight = Math.max(weight, volumetricWeight);
    }

    // Minimum weight is 0.5kg
    chargeableWeight = Math.max(chargeableWeight, 0.5);

    // Calculate rate
    const rate = zone.baseRate + chargeableWeight * zone.perKgRate;

    logger.info("Shipping rate calculated", {
      city: address.city,
      state: address.state,
      weight,
      chargeableWeight,
      rate,
    });

    return {
      carrier: "Standard Shipping",
      service: "Ground",
      rate: Math.round(rate * 100) / 100, // Round to 2 decimal places
      estimatedDays: zone.estimatedDays,
      trackingAvailable: true,
    };
  }

  /**
   * Track shipment using carrier API or order tracking updates
   */
  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    // Try carrier API first if configured
    if (
      env.SHIPPING_CARRIER === "shiprocket" &&
      env.SHIPROCKET_EMAIL &&
      env.SHIPROCKET_PASSWORD
    ) {
      try {
        return await this.shiprocketService.trackShipment(trackingNumber);
      } catch (error) {
        logger.warn("Carrier tracking failed, falling back to database", {
          error: error instanceof Error ? error.message : String(error),
        });
        // Fall through to database tracking
      }
    }

    // Fallback to database tracking
    const order = await prisma.order.findFirst({
      where: { trackingNumber },
      include: {
        trackingUpdates: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Tracking number not found");
    }

    // Get latest tracking update
    const latestUpdate =
      order.trackingUpdates[order.trackingUpdates.length - 1];

    if (!latestUpdate) {
      throw new NotFoundError("No tracking information available");
    }

    // Calculate estimated delivery based on order status
    let estimatedDelivery = new Date();
    if (order.status === "SHIPPED") {
      estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    } else if (order.status === "DELIVERED") {
      estimatedDelivery = new Date();
    } else {
      estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    }

    return {
      trackingNumber,
      status: latestUpdate.status,
      currentLocation: latestUpdate.location,
      estimatedDelivery,
      history: order.trackingUpdates.map((update) => ({
        status: update.status,
        location: update.location,
        timestamp: update.timestamp,
      })),
    };
  }

  /**
   * Generate shipping label
   * Production: Integrate with carrier label generation API
   */
  async generateShippingLabel(
    orderId: string
  ): Promise<{ labelUrl: string; trackingNumber: string }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingAddress: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.status !== "PROCESSING") {
      throw new ValidationError(
        "Shipping label can only be generated for orders in PROCESSING status"
      );
    }

    // Generate tracking number if not exists
    let trackingNumber = order.trackingNumber;
    if (!trackingNumber) {
      trackingNumber = `VALUVA${order.orderNumber.slice(-8)}${Date.now().toString().slice(-6)}`;
      await prisma.order.update({
        where: { id: orderId },
        data: { trackingNumber },
      });
    }

    // Use carrier API if configured
    if (
      env.SHIPPING_CARRIER === "shiprocket" &&
      env.SHIPROCKET_EMAIL &&
      env.SHIPROCKET_PASSWORD
    ) {
      try {
        const items = order.items.map((item) => ({
          name: item.variant.product.name,
          sku: item.variant.sku,
          quantity: item.quantity,
          price: Number(item.price),
        }));

        // Calculate total weight (estimate 0.5kg per item if not available)
        const weight = items.reduce(
          (sum, item) => sum + item.quantity * 0.5,
          0
        );

        const labelData = await this.shiprocketService.generateLabel({
          orderId: order.id,
          orderNumber: order.orderNumber,
          shippingAddress: order.shippingAddress,
          items,
          weight,
          paymentMethod: "Prepaid",
        });

        // Update order with tracking number from carrier
        if (
          labelData.trackingNumber &&
          labelData.trackingNumber !== trackingNumber
        ) {
          await prisma.order.update({
            where: { id: orderId },
            data: { trackingNumber: labelData.trackingNumber },
          });
        }

        logger.info("Shipping label generated via Shiprocket", {
          orderId,
          trackingNumber: labelData.trackingNumber,
        });

        return {
          labelUrl: labelData.labelUrl,
          trackingNumber: labelData.trackingNumber,
        };
      } catch (error) {
        logger.error("Carrier label generation failed", {
          error: error instanceof Error ? error.message : String(error),
          orderId,
        });
        throw new ValidationError(
          `Failed to generate shipping label: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // If no carrier configured, throw error
    throw new NotFoundError(
      "Shipping label generation requires carrier API integration. " +
        "Please configure shipping carrier credentials (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD) in environment variables."
    );
  }
}
