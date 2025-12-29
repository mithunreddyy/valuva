# 📘 Type Definitions & Interfaces

**Complete documentation for all TypeScript type definitions, interfaces, and type utilities across the backend.**

---

## 📁 Type Definition Files

```
backend/src/modules/order-tracking/
└── tracking.types.ts              # Order tracking types

backend/src/modules/uploads/
└── upload.interface.ts            # Upload service interface
```

---

## 📦 Order Tracking Types

### **File**: `modules/order-tracking/tracking.types.ts`

**Purpose**: Type definitions for order tracking functionality

---

### **Interface**: `OrderTrackingTimeline`

**Purpose**: Represents a single timeline item in order tracking

```typescript
interface OrderTrackingTimeline {
  status: string;              // Order status
  label: string;                // Human-readable label
  description: string;          // Status description
  timestamp?: Date;             // When this status occurred
  isCompleted: boolean;        // Whether this step is completed
  isCurrent: boolean;           // Whether this is the current step
  location?: string;           // Current location (if applicable)
}
```

**Usage**:

```typescript
const timeline: OrderTrackingTimeline = {
  status: "SHIPPED",
  label: "Shipped",
  description: "Your order has been shipped",
  timestamp: new Date(),
  isCompleted: true,
  isCurrent: false,
  location: "Mumbai Warehouse",
};
```

---

### **Interface**: `OrderTrackingResponse`

**Purpose**: Complete order tracking response with all details

```typescript
interface OrderTrackingResponse {
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
```

**Usage**:

```typescript
const tracking: OrderTrackingResponse = await trackingService.trackOrder(
  orderNumber,
  userId
);
```

---

## 📤 Upload Service Interface

### **File**: `modules/uploads/upload.interface.ts`

**Purpose**: Interface definition for upload service

---

### **Interface**: `UploadServiceInterface`

**Purpose**: Contract for upload service implementations

```typescript
interface UploadServiceInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(url: string): Promise<void>;
  optimizeImage(file: Express.Multer.File): Promise<Buffer>;
}
```

**Methods**:

#### **1. `uploadFile()`**

**Purpose**: Upload file to storage

**Parameters**:

- `file: Express.Multer.File` - File to upload

**Returns**: `Promise<string>` - Public URL of uploaded file

**Features**:

- ✅ Handles file validation
- ✅ Optimizes images
- ✅ Returns public URL

---

#### **2. `deleteFile()`**

**Purpose**: Delete file from storage

**Parameters**:

- `url: string` - File URL to delete

**Returns**: `Promise<void>`

**Features**:

- ✅ Extracts file key from URL
- ✅ Deletes from storage provider
- ✅ Non-blocking (errors don't throw)

---

#### **3. `optimizeImage()`**

**Purpose**: Optimize image before upload

**Parameters**:

- `file: Express.Multer.File` - Image file

**Returns**: `Promise<Buffer>` - Optimized image buffer

**Features**:

- ✅ Resizes if too large
- ✅ Compresses image
- ✅ Converts format if needed

---

**Implementation**:

The `UploadService` class implements this interface:

```typescript
export class UploadService implements UploadServiceInterface {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Implementation
  }
  
  async deleteFile(url: string): Promise<void> {
    // Implementation
  }
  
  async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    // Implementation
  }
}
```

---

## 🔍 Type Utilities

### **Common Type Patterns**

#### **1. Prisma Types**

```typescript
import { Prisma } from "@prisma/client";

// Get type from Prisma model
type User = Prisma.UserGetPayload<{}>;

// Get type with relations
type UserWithOrders = Prisma.UserGetPayload<{
  include: { orders: true };
}>;
```

---

#### **2. Service Response Types**

```typescript
// Standard service response
type ServiceResponse<T> = {
  data: T;
  message?: string;
};

// Paginated response
type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
```

---

#### **3. Error Types**

```typescript
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
```

---

#### **4. Filter Types**

```typescript
type ProductFilters = {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
};
```

---

#### **5. Date Range Types**

```typescript
type DateRange = {
  startDate: Date;
  endDate: Date;
};
```

---

## 📝 Type Usage Examples

### **Using Tracking Types**

```typescript
import { OrderTrackingResponse } from "./tracking.types";

async function getTracking(orderNumber: string): Promise<OrderTrackingResponse> {
  // Implementation
}
```

### **Using Upload Interface**

```typescript
import { UploadServiceInterface } from "./upload.interface";

class S3UploadService implements UploadServiceInterface {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // S3 implementation
  }
  
  async deleteFile(url: string): Promise<void> {
    // S3 deletion
  }
  
  async optimizeImage(file: Express.Multer.File): Promise<Buffer> {
    // Image optimization
  }
}
```

---

## 🔗 Related Documentation

- [Order Tracking](./09-analytics.md#order-tracking-service)
- [Upload Service](./14-remaining-modules.md#upload-service)
- [TypeScript Configuration](../guides/01-getting-started.md)

---

**Last Updated**: January 2025

