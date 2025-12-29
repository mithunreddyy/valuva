# 🔧 Remaining Backend Modules

**Complete documentation for stock alerts, uploads, coupons, homepage, and newsletter modules.**

---

## 📁 File Structure

```
backend/src/modules/stock-alerts/
├── stock-alerts.service.ts      # Stock alert business logic
├── stock-alerts.controller.ts  # HTTP request handlers
└── stock-alerts.routes.ts      # Express route definitions

backend/src/modules/uploads/
├── upload.service.ts            # File upload service
├── upload.controller.ts         # HTTP request handlers
├── upload.routes.ts             # Express route definitions
└── upload.interface.ts          # Upload service interface

backend/src/modules/coupons/
├── coupons.service.ts           # Coupon validation
├── coupons.controller.ts       # HTTP request handlers
├── coupons.routes.ts           # Express route definitions
├── coupons.repository.ts       # Database access layer
└── coupons.validation.ts        # Input validation schemas

backend/src/modules/homepage/
├── homepage.service.ts         # Homepage sections
├── homepage.controller.ts     # HTTP request handlers
├── homepage.routes.ts          # Express route definitions
├── homepage.repository.ts      # Database access layer
└── homepage.validation.ts     # Input validation schemas

backend/src/modules/newsletter/
├── newsletter.service.ts       # Newsletter subscription
├── newsletter.controller.ts    # HTTP request handlers
└── newsletter.routes.ts        # Express route definitions
```

---

## 📢 Stock Alerts Service

### **File**: `stock-alerts.service.ts`

**Purpose**: Stock alert notifications for out-of-stock products

### **Class**: `StockAlertsService`

---

### **Methods**

#### **1. `createStockAlert()`**

**Purpose**: Create stock alert for product

**Parameters**:

- `userId: string` - User ID
- `productId: string` - Product ID

**Returns**: `Promise<StockAlert>` - Created or existing alert

**Features**:

- ✅ Validates product exists
- ✅ Prevents duplicate alerts (one per user per product)
- ✅ Returns existing alert if already exists

**Throws**: `NotFoundError` if product not found

**Example**:

```typescript
const alert = await stockAlertsService.createStockAlert(userId, "prod_123");
```

---

#### **2. `deleteStockAlert()`**

**Purpose**: Delete stock alert

**Parameters**:

- `userId: string` - User ID
- `productId: string` - Product ID

**Returns**: `Promise<void>`

**Features**:

- ✅ Deletes alert using unique constraint
- ✅ No error if alert doesn't exist

**Example**:

```typescript
await stockAlertsService.deleteStockAlert(userId, "prod_123");
```

---

#### **3. `getUserStockAlerts()`**

**Purpose**: Get user's stock alerts

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<StockAlert[]>` - User alerts with product info

**Features**:

- ✅ Includes product details
- ✅ Includes product images
- ✅ Includes category information

**Example**:

```typescript
const alerts = await stockAlertsService.getUserStockAlerts(userId);
```

---

#### **4. `checkAndNotifyStockAlerts()`**

**Purpose**: Check stock and send notifications (Background Job)

**Parameters**:

- `productId: string` - Product ID

**Returns**: `Promise<void>`

**Features**:

- ✅ Checks if product has stock
- ✅ Finds all alerts for product
- ✅ Sends email notifications
- ✅ Deletes alerts after notification
- ✅ Called automatically when stock is updated

**Example**:

```typescript
// Called by background job when stock is updated
await stockAlertsService.checkAndNotifyStockAlerts("prod_123");
```

---

## 🎮 Stock Alerts Controller

### **File**: `stock-alerts.controller.ts`

**Purpose**: HTTP request handlers for stock alerts

### **Methods**

#### **1. `createAlert`**

- **Route**: `POST /api/v1/stock-alerts`
- **Authentication**: Required
- **Body**: `{ productId }`
- **Handler**: Calls `stockAlertsService.createStockAlert()`
- **Response**: Created alert (201 Created)

#### **2. `getAlerts`**

- **Route**: `GET /api/v1/stock-alerts`
- **Authentication**: Required
- **Handler**: Calls `stockAlertsService.getUserStockAlerts()`
- **Response**: User alerts array

#### **3. `deleteAlert`**

- **Route**: `DELETE /api/v1/stock-alerts/:productId`
- **Authentication**: Required
- **Handler**: Calls `stockAlertsService.deleteStockAlert()`
- **Response**: 204 No Content

---

## 🛣️ Stock Alerts Routes

### **File**: `stock-alerts.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user stock alerts
POST   /                    # Create stock alert
DELETE /:productId          # Delete stock alert
```

**All routes require authentication**

---

## 📤 Upload Service

### **File**: `upload.service.ts`

**Purpose**: File upload to cloud storage (S3, Cloudinary)

### **Class**: `UploadService`

---

### **Methods**

#### **1. `uploadFile()`**

**Purpose**: Upload file to configured storage provider

**Parameters**:

- `file: Express.Multer.File | { buffer, mimetype, size, originalname }` - File to upload

**Returns**: `Promise<string>` - Public URL of uploaded file

**Features**:

- ✅ **Multiple Providers**: S3, Cloudinary support
- ✅ **File Validation**: Type and size validation
- ✅ **Image Optimization**: Automatic image optimization
- ✅ **Circuit Breaker**: Prevents cascading failures
- ✅ **Retry Logic**: Automatic retry on failure
- ✅ **Error Handling**: Comprehensive error handling

**Allowed Types**:

- `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`

**File Size Limit**: 10MB

**Throws**:

- `ValidationError` if file type not allowed
- `ValidationError` if file size exceeds limit
- `ValidationError` if storage provider not configured

**Example**:

```typescript
const url = await uploadService.uploadFile(req.file);
```

---

#### **2. `deleteFile()`**

**Purpose**: Delete file from storage

**Parameters**:

- `url: string` - File URL to delete

**Returns**: `Promise<void>`

**Features**:

- ✅ Supports S3 and Cloudinary
- ✅ Extracts file key from URL
- ✅ Non-blocking (errors don't throw)

**Example**:

```typescript
await uploadService.deleteFile("https://...");
```

---

#### **3. `optimizeImage()`** (Private)

**Purpose**: Optimize image before upload

**Parameters**:

- `file: Express.Multer.File` - Image file

**Returns**: `Promise<Buffer>` - Optimized image buffer

**Features**:

- ✅ **Resize**: Max 2000px on longest side
- ✅ **Compress**: Quality 85%
- ✅ **Format**: JPEG/PNG optimization
- ✅ **Progressive**: Progressive JPEG
- ✅ **Sharp Library**: High-performance processing

---

### **Storage Providers**

#### **AWS S3**

**Configuration**:

- `STORAGE_PROVIDER=s3`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_REGION`

**Features**:

- ✅ Public read access
- ✅ Cache control headers
- ✅ Retry logic
- ✅ Circuit breaker

---

#### **Cloudinary**

**Configuration**:

- `STORAGE_PROVIDER=cloudinary`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Features**:

- ✅ Automatic optimization
- ✅ Format conversion
- ✅ Quality optimization
- ✅ Folder organization

---

## 🎮 Upload Controller

### **File**: `upload.controller.ts`

**Purpose**: HTTP request handlers for file uploads

### **Methods**

#### **1. `uploadImage`**

- **Route**: `POST /api/v1/uploads/image`
- **Authentication**: Admin required
- **Body**: Multipart form data with `file`
- **Handler**: Calls `uploadService.uploadFile()`
- **Response**: File URL

#### **2. `uploadImages`**

- **Route**: `POST /api/v1/uploads/images`
- **Authentication**: Admin required
- **Body**: Multipart form data with multiple `files`
- **Handler**: Calls `uploadService.uploadFile()` for each
- **Response**: Array of file URLs

---

## 🛣️ Upload Routes

### **File**: `upload.routes.ts`

**Route Definitions**:

```typescript
POST   /image                # Upload single image (admin)
POST   /images               # Upload multiple images (admin)
```

**All routes require admin authentication**

---

## 🎫 Coupons Service

### **File**: `coupons.service.ts`

**Purpose**: Coupon validation and management

### **Class**: `CouponsService`

---

### **Methods**

#### **1. `validateCoupon()`**

**Purpose**: Validate coupon code

**Parameters**:

- `code: string` - Coupon code
- `orderSubtotal?: Decimal | number` - Order subtotal (for min purchase check)

**Returns**: `Promise<Coupon>` - Valid coupon

**Features**:

- ✅ Validates coupon exists and is active
- ✅ Checks minimum purchase requirement
- ✅ Returns coupon with discount details

**Throws**:

- `ValidationError` if coupon invalid
- `ValidationError` if minimum purchase not met

**Example**:

```typescript
const coupon = await couponsService.validateCoupon("SAVE10", 1000);
```

---

#### **2. `listActive()`**

**Purpose**: Get list of active coupons

**Parameters**:

- `page: number` - Page number
- `limit: number` - Items per page

**Returns**: `Promise<{ coupons: Coupon[], total: number }>`

**Features**:

- ✅ Only active coupons
- ✅ Pagination support
- ✅ Sorted by creation date

**Example**:

```typescript
const { coupons, total } = await couponsService.listActive(1, 20);
```

---

## 🎮 Coupons Controller

### **File**: `coupons.controller.ts`

**Purpose**: HTTP request handlers for coupons

### **Methods**

#### **1. `validateCoupon`**

- **Route**: `POST /api/v1/coupons/validate`
- **Body**: `{ code, orderSubtotal? }`
- **Handler**: Calls `couponsService.validateCoupon()`
- **Response**: Valid coupon

#### **2. `listActive`**

- **Route**: `GET /api/v1/coupons`
- **Query**: `page`, `limit`
- **Handler**: Calls `couponsService.listActive()`
- **Response**: Paginated active coupons

---

## 🛣️ Coupons Routes

### **File**: `coupons.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # List active coupons
POST   /validate            # Validate coupon code
```

**Routes are public** (no authentication required)

---

## 🏠 Homepage Service

### **File**: `homepage.service.ts`

**Purpose**: Homepage section management

### **Class**: `HomepageService`

---

### **Methods**

#### **1. `getSections()`**

**Purpose**: Get active homepage sections

**Returns**: `Promise<HomepageSection[]>` - Active sections

**Features**:

- ✅ Only active sections
- ✅ Sorted by order
- ✅ Includes section content

**Example**:

```typescript
const sections = await homepageService.getSections();
```

---

#### **2. `getFeatured()`**

**Purpose**: Get featured products for homepage

**Returns**: `Promise<Product[]>` - Featured products

**Features**:

- ✅ Includes average rating
- ✅ Includes review count
- ✅ Formatted product data

**Example**:

```typescript
const products = await homepageService.getFeatured();
```

---

#### **3. `getNewArrivals()`**

**Purpose**: Get new arrival products

**Returns**: `Promise<Product[]>` - New arrival products

**Features**:

- ✅ Sorted by creation date
- ✅ Includes ratings and reviews

---

#### **4. `getBestSellers()`**

**Purpose**: Get best-selling products

**Returns**: `Promise<Product[]>` - Best sellers

**Features**:

- ✅ Sorted by total sold
- ✅ Includes ratings and reviews

---

## 🎮 Homepage Controller

### **File**: `homepage.controller.ts`

**Purpose**: HTTP request handlers for homepage

### **Methods**

#### **1. `getSections`**

- **Route**: `GET /api/v1/homepage/sections`
- **Handler**: Calls `homepageService.getSections()`
- **Response**: Sections array

#### **2. `getFeatured`**

- **Route**: `GET /api/v1/homepage/featured`
- **Query**: `limit?` (default: 12)
- **Handler**: Calls `homepageService.getFeatured()`
- **Response**: Featured products

#### **3. `getNewArrivals`**

- **Route**: `GET /api/v1/homepage/new-arrivals`
- **Query**: `limit?` (default: 12)
- **Handler**: Calls `homepageService.getNewArrivals()`
- **Response**: New arrival products

#### **4. `getBestSellers`**

- **Route**: `GET /api/v1/homepage/best-sellers`
- **Query**: `limit?` (default: 12)
- **Handler**: Calls `homepageService.getBestSellers()`
- **Response**: Best seller products

---

## 🛣️ Homepage Routes

### **File**: `homepage.routes.ts`

**Route Definitions**:

```typescript
GET    /sections            # Get homepage sections
GET    /featured             # Get featured products
GET    /new-arrivals         # Get new arrivals
GET    /best-sellers         # Get best sellers
```

**All routes are public** (no authentication required)

---

## 📧 Newsletter Service

### **File**: `newsletter.service.ts`

**Purpose**: Newsletter subscription management

### **Class**: `NewsletterService`

---

### **Methods**

#### **1. `subscribe()`**

**Purpose**: Subscribe to newsletter

**Parameters**:

- `email: string` - Email address

**Returns**: `Promise<User>` - Subscription record

**Features**:

- ✅ Checks if email already subscribed
- ✅ Reactivates if previously unsubscribed
- ✅ Creates new subscription if new email
- ✅ Sends welcome email

**Throws**:

- `ConflictError` if already subscribed

**Example**:

```typescript
const subscription = await newsletterService.subscribe("user@example.com");
```

---

#### **2. `unsubscribe()`**

**Purpose**: Unsubscribe from newsletter

**Parameters**:

- `email: string` - Email address
- `token?: string` - Unsubscribe token (optional)

**Returns**: `Promise<User>` - Updated subscription

**Features**:

- ✅ Validates email exists
- ✅ Validates token if provided
- ✅ Sets subscription to inactive
- ✅ Prevents future emails

**Throws**:

- `NotFoundError` if subscription not found
- `NotFoundError` if token invalid

**Example**:

```typescript
await newsletterService.unsubscribe("user@example.com", token);
```

---

#### **3. `getAllSubscriptions()`** (Admin)

**Purpose**: Get all newsletter subscriptions

**Parameters**:

- `page: number` - Page number (default: 1)
- `limit: number` - Items per page (default: 50)

**Returns**: `Promise<{ data: User[], pagination: Pagination }>`

**Features**:

- ✅ Admin-only operation
- ✅ Pagination support
- ✅ Sorted by creation date

**Example**:

```typescript
const { data: subscriptions, pagination } = await newsletterService.getAllSubscriptions(1, 50);
```

---

## 🎮 Newsletter Controller

### **File**: `newsletter.controller.ts`

**Purpose**: HTTP request handlers for newsletter

### **Methods**

#### **1. `subscribe`**

- **Route**: `POST /api/v1/newsletter/subscribe`
- **Body**: `{ email }`
- **Handler**: Calls `newsletterService.subscribe()`
- **Response**: Subscription record (201 Created)

#### **2. `unsubscribe`**

- **Route**: `POST /api/v1/newsletter/unsubscribe`
- **Body**: `{ email, token? }`
- **Handler**: Calls `newsletterService.unsubscribe()`
- **Response**: Updated subscription

---

## 🛣️ Newsletter Routes

### **File**: `newsletter.routes.ts`

**Route Definitions**:

```typescript
POST   /subscribe            # Subscribe to newsletter
POST   /unsubscribe          # Unsubscribe from newsletter
```

**Routes are public** (no authentication required)

---

## 📊 Database Models

### **StockAlert Model** (Prisma)

- `id`, `userId`, `productId`
- `createdAt`
- Relations: `user`, `product`
- Unique: `userId_productId`

### **Coupon Model** (Prisma)

- `id`, `code`, `discountType` (PERCENTAGE, FIXED)
- `discountValue`, `minPurchase?`, `maxDiscount?`
- `usageLimit?`, `usageCount`
- `isActive`, `expiresAt?`
- `createdAt`, `updatedAt`

### **HomepageSection Model** (Prisma)

- `id`, `type` (HERO, FEATURED, NEW_ARRIVALS, CATEGORIES, BANNER)
- `title`, `content`, `image`, `order`
- `isActive`, `config` (JSON)
- `createdAt`, `updatedAt`

---

## 🔍 Features

### **Stock Alerts Features**

1. **Alert Creation**: Users can create alerts for out-of-stock products
2. **Automatic Notifications**: Email sent when product back in stock
3. **Duplicate Prevention**: One alert per user per product
4. **Background Processing**: Automatic checking and notification

### **Upload Features**

1. **Multiple Providers**: S3, Cloudinary support
2. **Image Optimization**: Automatic resize and compress
3. **File Validation**: Type and size validation
4. **Error Resilience**: Circuit breaker and retry logic
5. **Secure Storage**: Secure cloud storage

### **Coupon Features**

1. **Validation**: Code validation with min purchase check
2. **Active Listing**: Public list of active coupons
3. **Usage Tracking**: Usage count and limits
4. **Expiry Management**: Automatic expiry handling

### **Homepage Features**

1. **Dynamic Sections**: Configurable homepage sections
2. **Product Showcases**: Featured, new arrivals, best sellers
3. **Caching**: Redis caching for performance
4. **Admin Management**: Admin can manage sections

### **Newsletter Features**

1. **Subscription Management**: Subscribe/unsubscribe
2. **Token Verification**: Secure unsubscribe
3. **Welcome Emails**: Automatic welcome email
4. **Admin Access**: Admin can view all subscriptions

---

## 📝 Usage Examples

### **Create Stock Alert**

```http
POST /api/v1/stock-alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_123"
}
```

### **Upload Image**

```http
POST /api/v1/uploads/image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

file: [image file]
```

### **Validate Coupon**

```http
POST /api/v1/coupons/validate
Content-Type: application/json

{
  "code": "SAVE10",
  "orderSubtotal": 1000
}
```

### **Subscribe Newsletter**

```http
POST /api/v1/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## 🔗 Related Files

- **Products**: `modules/products/products.service.ts` - Product information
- **Orders**: `modules/orders/orders.service.ts` - Coupon usage in orders
- **Email**: `utils/email.util.ts` - Email notifications
- **Admin**: `modules/admin/admin-homepage.service.ts` - Homepage management

---

**Last Updated**: January 2025

