import axios, { AxiosInstance } from "axios";
import { env } from "../../config/env";
import { ValidationError } from "../../utils/error.util";
import { logger } from "../../utils/logger.util";

interface ShiprocketRate {
  carrier: string;
  service: string;
  rate: number;
  estimatedDays: number;
  trackingAvailable: boolean;
}

interface ShiprocketTracking {
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

/**
 * Shiprocket Shipping Integration
 * Production-ready shipping carrier integration for India
 */
export class ShiprocketService {
  private apiClient: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.apiClient = axios.create({
      baseURL: "https://apiv2.shiprocket.in/v1/external",
      timeout: 10000,
    });
  }

  /**
   * Authenticate with Shiprocket API
   */
  private async authenticate(): Promise<string> {
    if (this.authToken) {
      return this.authToken;
    }

    if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
      throw new ValidationError(
        "Shiprocket credentials not configured. " +
          "Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD environment variables."
      );
    }

    try {
      const response = await this.apiClient.post("/auth/login", {
        email: env.SHIPROCKET_EMAIL,
        password: env.SHIPROCKET_PASSWORD,
      });

      this.authToken = response.data.token;
      logger.info("Shiprocket authentication successful");
      return this.authToken as unknown as string;
    } catch (error: any) {
      logger.error("Shiprocket authentication failed", {
        error: error.response?.data?.message || error.message,
      });
      throw new ValidationError("Failed to authenticate with Shiprocket");
    }
  }

  /**
   * Calculate shipping rate
   */
  async calculateRate(
    pickupPincode: string,
    deliveryPincode: string,
    weight: number,
    codAmount?: number
  ): Promise<ShiprocketRate[]> {
    try {
      const token = await this.authenticate();

      const response = await this.apiClient.post(
        "/courier/serviceability/",
        {
          pickup_pincode: pickupPincode,
          delivery_pincode: deliveryPincode,
          weight: weight,
          cod_amount: codAmount || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rates: ShiprocketRate[] =
        response.data.data.available_courier_companies.map((company: any) => ({
          carrier: company.courier_name,
          service: company.rate.name || "Standard",
          rate: company.rate.rate / 100, // Convert paise to rupees
          estimatedDays: company.estimated_delivery_days || 5,
          trackingAvailable: true,
        }));

      return rates;
    } catch (error: any) {
      logger.error("Shiprocket rate calculation failed", {
        error: error.response?.data?.message || error.message,
        pickupPincode,
        deliveryPincode,
      });
      throw new ValidationError(
        `Failed to calculate shipping rate: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Track shipment
   */
  async trackShipment(trackingNumber: string): Promise<ShiprocketTracking> {
    try {
      const token = await this.authenticate();

      const response = await this.apiClient.get(
        `/courier/track/shipment/${trackingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const trackingData = response.data.data.tracking_data;

      return {
        trackingNumber,
        status: trackingData.shipment_status || "Unknown",
        currentLocation: trackingData.current_location || "Unknown",
        estimatedDelivery: trackingData.estimated_delivery_date
          ? new Date(trackingData.estimated_delivery_date)
          : new Date(),
        history:
          trackingData.track_status?.map((status: any) => ({
            status: status.status || "Unknown",
            location: status.location || "Unknown",
            timestamp: status.date ? new Date(status.date) : new Date(),
          })) || [],
      };
    } catch (error: any) {
      logger.error("Shiprocket tracking failed", {
        error: error.response?.data?.message || error.message,
        trackingNumber,
      });
      throw new ValidationError(
        `Failed to track shipment: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * Generate shipping label
   */
  async generateLabel(orderData: {
    orderId: string;
    orderNumber: string;
    shippingAddress: any;
    items: Array<{
      name: string;
      sku: string;
      quantity: number;
      price: number;
    }>;
    weight: number;
    paymentMethod: string;
  }): Promise<{ labelUrl: string; trackingNumber: string; awbCode: string }> {
    try {
      const token = await this.authenticate();

      // Create shipment
      const shipmentResponse = await this.apiClient.post(
        "/orders/create/adhoc",
        {
          order_id: orderData.orderNumber,
          order_date: new Date().toISOString(),
          pickup_location: "Primary", // Should be configured
          billing_customer_name: orderData.shippingAddress.fullName,
          billing_last_name: "",
          billing_address: orderData.shippingAddress.addressLine1,
          billing_address_2: orderData.shippingAddress.addressLine2 || "",
          billing_city: orderData.shippingAddress.city,
          billing_pincode: orderData.shippingAddress.postalCode,
          billing_state: orderData.shippingAddress.state,
          billing_country: orderData.shippingAddress.country || "India",
          billing_email: orderData.shippingAddress.email || "",
          billing_phone: orderData.shippingAddress.phone,
          shipping_is_billing: true,
          order_items: orderData.items,
          payment_method: orderData.paymentMethod === "COD" ? "COD" : "Prepaid",
          sub_total: orderData.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          length: 10,
          breadth: 10,
          height: 10,
          weight: orderData.weight,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const shipmentId = shipmentResponse.data.shipment_id;

      // Generate AWB and label
      const labelResponse = await this.apiClient.post(
        `/orders/print/awb`,
        {
          shipment_id: [shipmentId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        labelUrl: labelResponse.data.label_url || "",
        trackingNumber: shipmentResponse.data.awb_code || "",
        awbCode: shipmentResponse.data.awb_code || "",
      };
    } catch (error: any) {
      logger.error("Shiprocket label generation failed", {
        error: error.response?.data?.message || error.message,
        orderId: orderData.orderId,
      });
      throw new ValidationError(
        `Failed to generate shipping label: ${error.response?.data?.message || error.message}`
      );
    }
  }
}
