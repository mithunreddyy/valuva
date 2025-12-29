# 📊 Analytics & Order Tracking Module

**Complete documentation for analytics, order tracking, and recommendation files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/analytics/
├── analytics.service.ts          # Analytics business logic
├── analytics.controller.ts       # HTTP request handlers
├── analytics.routes.ts           # Express route definitions
├── analytics.repository.ts       # Database access layer
└── analytics.validation.ts       # Input validation schemas

backend/src/modules/order-tracking/
├── tracking.service.ts           # Order tracking business logic
├── tracking.controller.ts        # HTTP request handlers
├── tracking.routes.ts            # Express route definitions
├── tracking.repository.ts        # Database access layer
├── tracking.types.ts             # Type definitions
└── tracking.validation.ts        # Input validation schemas

backend/src/modules/recommendations/
├── recommendations.service.ts     # Product recommendations
├── recommendations.controller.ts # HTTP request handlers
└── recommendations.routes.ts     # Express route definitions
```

---

## 📊 Analytics Service

### **File**: `analytics.service.ts`

**Purpose**: Business analytics and reporting

### **Class**: `AnalyticsService`

---

### **Methods**

#### **1. `getSalesMetrics()`**

**Purpose**: Get sales metrics for date range

**Parameters**:

- `dateRange: { startDate: Date, endDate: Date }` - Date range

**Returns**: `Promise<SalesMetrics>`

**Metrics**:

- `totalRevenue` - Total revenue in period
- `totalOrders` - Total orders count
- `averageOrderValue` - Average order value
- `conversionRate` - Conversion rate percentage
- `revenueGrowth` - Revenue growth vs previous period

**Features**:

- ✅ Redis caching
- ✅ Period comparison (current vs previous)
- ✅ Conversion rate calculation
- ✅ Growth percentage calculation

**Example**:

```typescript
const metrics = await analyticsService.getSalesMetrics({
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-01-31"),
});
```

---

#### **2. `getTopProducts()`**

**Purpose**: Get top-selling products

**Parameters**:

- `dateRange: DateRange` - Date range
- `limit: number` - Number of products (default: 10)

**Returns**: `Promise<TopProduct[]>`

**Product Data**:

- `id`, `name`, `slug`
- `totalSold` - Units sold
- `revenue` - Total revenue
- `averageRating` - Average rating

**Features**:

- ✅ Sorted by total sold
- ✅ Includes revenue and ratings
- ✅ Redis caching

---

#### **3. `getUserAnalytics()`**

**Purpose**: Get user analytics

**Parameters**:

- `dateRange: DateRange` - Date range

**Returns**: `Promise<UserAnalytics>`

**Metrics**:

- `totalUsers` - Total users
- `newUsers` - New users in period
- `activeUsers` - Active users
- `userGrowth` - User growth percentage

---

#### **4. `getProductAnalytics()`**

**Purpose**: Get product analytics

**Parameters**:

- `productId: string` - Product ID
- `dateRange: DateRange` - Date range

**Returns**: `Promise<ProductAnalytics>`

**Metrics**:

- `views` - Product views
- `addsToCart` - Add to cart events
- `purchases` - Purchase count
- `revenue` - Revenue from product
- `conversionRate` - View to purchase rate

---

## 🎮 Analytics Controller

### **File**: `analytics.controller.ts`

**Purpose**: HTTP request handlers for analytics

### **Methods**

#### **1. `getSalesMetrics`**

- **Route**: `GET /api/v1/analytics/sales`
- **Authentication**: Admin required
- **Query**: `startDate`, `endDate`
- **Handler**: Calls `analyticsService.getSalesMetrics()`
- **Response**: Sales metrics

#### **2. `getTopProducts`**

- **Route**: `GET /api/v1/analytics/products`
- **Authentication**: Admin required
- **Query**: `startDate`, `endDate`, `limit`
- **Handler**: Calls `analyticsService.getTopProducts()`
- **Response**: Top products array

#### **3. `getUserAnalytics`**

- **Route**: `GET /api/v1/analytics/users`
- **Authentication**: Admin required
- **Query**: `startDate`, `endDate`
- **Handler**: Calls `analyticsService.getUserAnalytics()`
- **Response**: User analytics

#### **4. `getProductAnalytics`**

- **Route**: `GET /api/v1/analytics/products/:productId`
- **Authentication**: Admin required
- **Query**: `startDate`, `endDate`
- **Handler**: Calls `analyticsService.getProductAnalytics()`
- **Response**: Product analytics

---

## 🛣️ Analytics Routes

### **File**: `analytics.routes.ts`

**Route Definitions**:

```typescript
GET    /sales                    # Sales metrics
GET    /products                 # Top products
GET    /products/:productId       # Product analytics
GET    /users                    # User analytics
GET    /overview                 # Analytics overview
```

**All routes require admin authentication**

---

## 📦 Order Tracking Service

### **File**: `tracking.service.ts`

**Purpose**: Order tracking and status updates

### **Class**: `OrderTrackingService`

---

### **Methods**

#### **1. `trackOrder()`**

**Purpose**: Track order by order number (authenticated)

**Parameters**:

- `orderNumber: string` - Order number
- `userId: string` - User ID

**Returns**: `Promise<OrderTrackingResponse>`

**Features**:

- ✅ Validates order belongs to user
- ✅ Returns tracking timeline
- ✅ Includes status, location, description

**Throws**:

- `NotFoundError` if order not found
- `UnauthorizedError` if order doesn't belong to user

**Example**:

```typescript
const tracking = await trackingService.trackOrder("ORD123456", userId);
```

---

#### **2. `trackOrderPublic()`**

**Purpose**: Track order publicly (no authentication)

**Parameters**:

- `orderNumber: string` - Order number
- `email: string` - Order email

**Returns**: `Promise<OrderTrackingResponse>`

**Features**:

- ✅ Public tracking (no login required)
- ✅ Validates order number + email match
- ✅ Returns tracking information

**Throws**: `NotFoundError` if order not found or email mismatch

**Example**:

```typescript
const tracking = await trackingService.trackOrderPublic(
  "ORD123456",
  "user@example.com"
);
```

---

#### **3. `updateOrderTracking()`**

**Purpose**: Update order tracking (Admin)

**Parameters**:

- `orderId: string` - Order ID
- `data: { status?, location?, description? }` - Update data

**Returns**: `Promise<OrderTrackingResponse>`

**Features**:

- ✅ Updates order status
- ✅ Creates tracking update if status changed
- ✅ Sends notification (if configured)

**Throws**: `NotFoundError` if order not found

---

#### **4. `addTrackingUpdate()`**

**Purpose**: Add manual tracking update

**Parameters**:

- `orderId: string` - Order ID
- `status: string` - Status
- `location: string` - Current location
- `description: string` - Update description
- `timestamp?: Date` - Optional timestamp

**Returns**: `Promise<{ success: boolean, message: string }>`

**Features**:

- ✅ Creates tracking update entry
- ✅ Updates order status if different

---

#### **5. `getAllActiveOrders()`**

**Purpose**: Get all active orders for tracking (Admin)

**Returns**: `Promise<Order[]>`

**Features**:

- ✅ Returns orders with tracking updates
- ✅ Sorted by status and date

---

## 🎮 Tracking Controller

### **File**: `tracking.controller.ts`

**Purpose**: HTTP request handlers for tracking

### **Methods**

#### **1. `trackOrder`**

- **Route**: `GET /api/v1/order-tracking`
- **Authentication**: Required
- **Query**: `orderNumber`
- **Handler**: Calls `trackingService.trackOrder()`
- **Response**: Tracking information

#### **2. `trackOrderPublic`**

- **Route**: `GET /api/v1/order-tracking/:orderNumber`
- **Authentication**: Not required
- **Query**: `email`
- **Handler**: Calls `trackingService.trackOrderPublic()`
- **Response**: Tracking information

#### **3. `updateTracking`** (Admin)

- **Route**: `PUT /api/v1/order-tracking/:orderId`
- **Authentication**: Admin required
- **Body**: `{ status, location, description }`
- **Handler**: Calls `trackingService.updateOrderTracking()`
- **Response**: Updated tracking

---

## 🛣️ Tracking Routes

### **File**: `tracking.routes.ts`

**Route Definitions**:

```typescript
GET    /                         # Track order (authenticated)
GET    /:orderNumber             # Track order (public)
PUT    /:orderId                # Update tracking (admin)
POST   /:orderId/updates        # Add tracking update (admin)
```

---

## 🎯 Recommendations Service

### **File**: `recommendations.service.ts`

**Purpose**: Product recommendations engine

### **Class**: `RecommendationsService`

---

### **Methods**

#### **1. `trackProductView()`**

**Purpose**: Track product view for recommendations

**Parameters**:

- `productId: string` - Product ID
- `userId?: string` - User ID (if authenticated)
- `ipAddress?: string` - User IP
- `userAgent?: string` - User agent

**Returns**: `Promise<void>`

**Features**:

- ✅ Creates product view record
- ✅ Increments product view count
- ✅ Used for personalized recommendations
- ✅ Non-blocking (errors don't break flow)

**Example**:

```typescript
await recommendationsService.trackProductView(
  "prod_123",
  userId,
  "192.168.1.1",
  "Mozilla/5.0..."
);
```

---

#### **2. `getRecentlyViewed()`**

**Purpose**: Get recently viewed products for user

**Parameters**:

- `userId: string` - User ID
- `limit: number` - Number of products (default: 10)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Gets unique products from view history
- ✅ Maintains view order
- ✅ Fallback to order history if no views
- ✅ Fallback to wishlist if no orders
- ✅ Fallback to featured products if nothing

**Example**:

```typescript
const products = await recommendationsService.getRecentlyViewed(userId, 10);
```

---

#### **3. `getSimilarProducts()`**

**Purpose**: Get similar products (same category)

**Parameters**:

- `productId: string` - Product ID
- `limit: number` - Number of products (default: 5)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Finds products in same category
- ✅ Excludes current product
- ✅ Sorted by relevance

**Throws**: `NotFoundError` if product not found

---

#### **4. `getFrequentlyBoughtTogether()`**

**Purpose**: Get products frequently bought together

**Parameters**:

- `productId: string` - Product ID
- `limit: number` - Number of products (default: 5)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Analyzes order history
- ✅ Finds products bought together
- ✅ Sorted by frequency
- ✅ Fallback to similar products if no data

**Throws**: `NotFoundError` if product not found

---

## 🎮 Recommendations Controller

### **File**: `recommendations.controller.ts`

**Purpose**: HTTP request handlers for recommendations

### **Methods**

#### **1. `getRecommendations`**

- **Route**: `GET /api/v1/recommendations`
- **Authentication**: Optional
- **Query**: `userId?`, `productId?`, `type?`
- **Handler**: Calls recommendation service
- **Response**: Recommended products

---

## 🛣️ Recommendations Routes

### **File**: `recommendations.routes.ts`

**Route Definitions**:

```typescript
GET    /                         # Get recommendations
GET    /recently-viewed          # Get recently viewed
GET    /similar/:productId       # Get similar products
GET    /frequently-bought/:productId # Get frequently bought together
```

---

## 📊 Database Models

### **ProductView Model** (Prisma)

- `id`, `productId`, `userId?`
- `ipAddress?`, `userAgent?`
- `viewedAt`
- Relations: `product`, `user`

### **OrderTrackingUpdate Model** (Prisma)

- `id`, `orderId`, `status`
- `location`, `description`
- `timestamp`
- Relations: `order`

---

## 🔍 Features

### **Analytics Features**

1. **Sales Metrics**: Revenue, orders, AOV, conversion
2. **Product Analytics**: Views, conversions, revenue
3. **User Analytics**: Growth, activity, retention
4. **Period Comparison**: Current vs previous period
5. **Caching**: Redis caching for performance

### **Tracking Features**

1. **Real-time Updates**: Live tracking updates
2. **Public Tracking**: No login required
3. **Status Timeline**: Visual status progression
4. **Location Tracking**: Current location display
5. **Notifications**: Automatic customer notifications

### **Recommendations Features**

1. **View Tracking**: Product view history
2. **Personalized**: User-based recommendations
3. **Similar Products**: Category-based similarity
4. **Frequently Bought**: Order-based recommendations
5. **Fallback Logic**: Multiple fallback strategies

---

## 📝 Usage Examples

### **Get Sales Metrics**

```http
GET /api/v1/analytics/sales?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <admin_token>
```

### **Track Order**

```http
GET /api/v1/order-tracking?orderNumber=ORD123456
Authorization: Bearer <token>
```

### **Get Recommendations**

```http
GET /api/v1/recommendations?userId=user_123&type=recently-viewed
```

---

## 🔗 Related Files

- **Orders**: `modules/orders/orders.service.ts` - Order data
- **Products**: `modules/products/products.service.ts` - Product data
- **Analytics Util**: `utils/analytics.util.ts` - Analytics tracking

---

**Last Updated**: January 2025

