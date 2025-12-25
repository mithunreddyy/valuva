export interface OrderTrackingTimeline {
  status: string;
  label: string;
  description: string;
  timestamp?: Date;
  isCompleted: boolean;
  isCurrent: boolean;
  location?: string;
}

export interface OrderTrackingResponse {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: Date;
    estimatedDelivery?: Date;
    total: number;
  };
  shipping: {
    trackingNumber?: string;
    carrierName?: string;
    currentLocation?: string;
    shippingAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      phone: string;
    };
  };
  timeline: OrderTrackingTimeline[];
  updates: Array<{
    id: string;
    status: string;
    location: string;
    description: string;
    timestamp: Date;
  }>;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}
