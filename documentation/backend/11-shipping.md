# 🚚 Shipping Module

**Complete documentation for shipping calculations, tracking, and carrier integration files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/shipping/
├── shipping.service.ts          # Shipping business logic
├── shipping.controller.ts      # HTTP request handlers
├── shipping.routes.ts          # Express route definitions
└── shiprocket.service.ts       # Shiprocket carrier integration
```

---

## 🚚 Shipping Service

### **File**: `shipping.service.ts`

**Purpose**: Shipping rate calculation and tracking

### **Class**: `ShippingService`

---

### **Methods**

#### **1. `calculateShippingRate()`**

**Purpose**: Calculate shipping rate for address

**Parameters**:

- `address: { city, state, postalCode, country }` - Delivery address
- `weight: number` - Package weight in kg
- `dimensions?: { length, width, height }` - Package dimensions in cm

**Returns**: `Promise<ShippingRate>`

**Shipping Rate Object**:

```typescript
interface ShippingRate {
  carrier: string;              // Carrier name
  service: string;              // Service type
  rate: number;                // Shipping cost
  estimatedDays: number;       // Estimated delivery days
  trackingAvailable: boolean;  // Whether tracking is available
}
```

**Features**:

- ✅ **Carrier API Integration**: Uses Shiprocket API if configured
- ✅ **Zone-Based Pricing**: Fallback to zone-based pricing
- ✅ **Volumetric Weight**: Calculates chargeable weight
- ✅ **Multiple Zones**: Metro, Tier 2, Default zones
- ✅ **Minimum Weight**: 0.5kg minimum

**Zone Pricing**:

- **Zone 1 (Metro)**: Base ₹50 + ₹15/kg, 2 days
- **Zone 2 (Tier 2)**: Base ₹75 + ₹20/kg, 3 days
- **Zone 3 (Default)**: Base ₹100 + ₹25/kg, 5 days

**Throws**: `ValidationError` if weight <= 0

**Example**:

```typescript
const rate = await shippingService.calculateShippingRate(
  {
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
  },
  2.5, // 2.5 kg
  { length: 30, width: 20, height: 15 }
);
```

---

#### **2. `trackShipment()`**

**Purpose**: Track shipment using tracking number

**Parameters**:

- `trackingNumber: string` - Tracking number

**Returns**: `Promise<TrackingInfo>`

**Tracking Info Object**:

```typescript
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
```

**Features**:

- ✅ **Carrier API**: Uses Shiprocket API if configured
- ✅ **Database Fallback**: Falls back to order tracking updates
- ✅ **Delivery Estimation**: Calculates estimated delivery
- ✅ **Tracking History**: Complete tracking timeline

**Throws**: `NotFoundError` if tracking number not found

**Example**:

```typescript
const tracking = await shippingService.trackShipment("TRACK123456");
```

---

#### **3. `generateShippingLabel()`**

**Purpose**: Generate shipping label for order

**Parameters**:

- `orderId: string` - Order ID

**Returns**: `Promise<{ labelUrl: string, trackingNumber: string }>`

**Features**:

- ✅ **Carrier Integration**: Uses Shiprocket API if configured
- ✅ **Tracking Number**: Generates or uses existing
- ✅ **Label Generation**: Creates printable label
- ✅ **Order Validation**: Only for PROCESSING orders

**Throws**:

- `NotFoundError` if order not found
- `ValidationError` if order not in PROCESSING status
- `NotFoundError` if carrier not configured

**Example**:

```typescript
const { labelUrl, trackingNumber } = await shippingService.generateShippingLabel(
  "order_123"
);
```

---

## 🏪 Shiprocket Service

### **File**: `shiprocket.service.ts`

**Purpose**: Shiprocket carrier API integration

### **Class**: `ShiprocketService`

---

### **Methods**

#### **1. `calculateRate()`**

**Purpose**: Calculate shipping rate via Shiprocket

**Parameters**:

- `pickupPincode: string` - Pickup pincode
- `deliveryPincode: string` - Delivery pincode
- `weight: number` - Weight in kg

**Returns**: `Promise<ShippingRate[]>` - Available rates

**Features**:

- ✅ Authenticates with Shiprocket
- ✅ Gets available shipping options
- ✅ Returns multiple rate options
- ✅ Includes estimated delivery

---

#### **2. `trackShipment()`**

**Purpose**: Track shipment via Shiprocket

**Parameters**:

- `trackingNumber: string` - Shiprocket tracking number

**Returns**: `Promise<TrackingInfo>` - Tracking information

**Features**:

- ✅ Real-time tracking from Shiprocket
- ✅ Complete tracking history
- ✅ Current location and status

---

#### **3. `generateLabel()`**

**Purpose**: Generate shipping label via Shiprocket

**Parameters**:

- `orderData: { orderId, orderNumber, shippingAddress, items, weight, paymentMethod }` - Order data

**Returns**: `Promise<{ labelUrl: string, trackingNumber: string }>`

**Features**:

- ✅ Creates shipment in Shiprocket
- ✅ Generates AWB (Airway Bill)
- ✅ Returns label URL and tracking number
- ✅ Updates order with tracking number

---

## 🎮 Shipping Controller

### **File**: `shipping.controller.ts`

**Purpose**: HTTP request handlers for shipping

### **Methods**

#### **1. `calculateRate`**

- **Route**: `POST /api/v1/shipping/calculate`
- **Authentication**: Required (for checkout)
- **Body**: `{ address, weight, dimensions? }`
- **Handler**: Calls `shippingService.calculateShippingRate()`
- **Response**: Shipping rate

#### **2. `trackShipment`**

- **Route**: `GET /api/v1/shipping/track/:trackingNumber`
- **Authentication**: Optional
- **Handler**: Calls `shippingService.trackShipment()`
- **Response**: Tracking information

#### **3. `generateLabel`** (Admin)

- **Route**: `POST /api/v1/shipping/label/:orderId`
- **Authentication**: Admin required
- **Handler**: Calls `shippingService.generateShippingLabel()`
- **Response**: Label URL and tracking number

---

## 🛣️ Shipping Routes

### **File**: `shipping.routes.ts`

**Route Definitions**:

```typescript
POST   /calculate              # Calculate shipping rate
GET    /track/:trackingNumber  # Track shipment
POST   /label/:orderId         # Generate label (admin)
```

---

## 📊 Database Models

### **Order Model** (Shipping Fields)

- `trackingNumber` - Carrier tracking number
- `shippingAddressId` - Shipping address
- `shippingCost` - Shipping cost
- Relations: `shippingAddress`, `trackingUpdates`

### **OrderTrackingUpdate Model**

- `id`, `orderId`, `status`
- `location`, `description`
- `timestamp`
- Relations: `order`

---

## 🔍 Features

### **Shipping Features**

1. **Multiple Carriers**: Shiprocket integration
2. **Zone-Based Pricing**: Fallback pricing system
3. **Volumetric Weight**: Chargeable weight calculation
4. **Real-Time Tracking**: Carrier API tracking
5. **Label Generation**: Automated label creation
6. **Delivery Estimation**: Estimated delivery dates

### **Carrier Integration**

1. **Shiprocket**: Full integration
2. **API Authentication**: Secure API calls
3. **Error Handling**: Graceful fallbacks
4. **Rate Comparison**: Multiple rate options

---

## 📝 Usage Examples

### **Calculate Shipping Rate**

```http
POST /api/v1/shipping/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "weight": 2.5,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 15
  }
}
```

### **Track Shipment**

```http
GET /api/v1/shipping/track/TRACK123456
```

### **Generate Label** (Admin)

```http
POST /api/v1/shipping/label/order_123
Authorization: Bearer <admin_token>
```

---

## 🔗 Related Files

- **Orders**: `modules/orders/orders.service.ts` - Order information
- **Tracking**: `modules/order-tracking/tracking.service.ts` - Tracking updates
- **Addresses**: `modules/addresses/addresses.service.ts` - Address data

---

**Last Updated**: January 2025

