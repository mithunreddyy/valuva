# 📦 Orders & Payments Module

**Complete documentation for order processing and payment integration files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/orders/
├── orders.service.ts          # Order business logic
├── orders.controller.ts       # HTTP request handlers
├── orders.routes.ts           # Express route definitions
├── orders.repository.ts       # Database access layer
└── orders.validation.ts       # Input validation schemas

backend/src/modules/payments/
├── payments.service.ts        # Payment business logic
├── payments.controller.ts     # HTTP request handlers
├── payments.routes.ts         # Express route definitions
├── payments.repository.ts     # Database access layer
├── payments.validation.ts     # Input validation schemas
└── shopify-payment.service.ts # Shopify payment integration
```

---

## 📦 Orders Service

### **File**: `orders.service.ts`

**Purpose**: Handles order creation, management, cancellation, and status updates.

### **Class**: `OrdersService`

**Constants**:

- `TAX_RATE = 0.18` (18% tax)
- `SHIPPING_COST = 50` (₹50 shipping)
- `FREE_SHIPPING_THRESHOLD = 1000` (Free shipping above ₹1000)

---

### **Methods**

#### **1. `createOrder()`**

**Purpose**: Create new order from cart

**Parameters**:

- `userId: string` - User ID
- `shippingAddressId: string` - Shipping address ID
- `billingAddressId: string` - Billing address ID
- `paymentMethod: PaymentMethod` - Payment method (CREDIT_CARD, DEBIT_CARD, UPI, etc.)
- `couponCode?: string` - Optional coupon code
- `notes?: string` - Order notes
- `ipAddress?: string` - User IP address
- `userAgent?: string` - User agent

**Returns**: `Promise<Order>` - Created order

**Features**:

- ✅ Validates addresses belong to user
- ✅ Validates cart is not empty
- ✅ **Inventory Locking**: Prevents race conditions
- ✅ Validates product variants are active
- ✅ Calculates subtotal from cart items
- ✅ Applies coupon discount (if valid)
- ✅ Calculates tax (18%)
- ✅ Calculates shipping (free above ₹1000)
- ✅ Generates unique order number
- ✅ Creates order with all items
- ✅ Clears cart after order creation
- ✅ Creates initial tracking update
- ✅ Audit logging
- ✅ Analytics tracking

**Order Calculation Flow**:

1. Calculate subtotal from cart items
2. Apply coupon discount (if provided)
3. Calculate after-discount amount
4. Calculate shipping (free if above threshold)
5. Calculate tax (18% of after-discount)
6. Calculate total = after-discount + tax + shipping

**Inventory Locking**:

- Locks inventory atomically for all items
- Prevents overselling
- Releases locks if order creation fails
- 5-second timeout per lock

**Throws**:

- `NotFoundError` if address not found
- `ValidationError` if cart empty, variant inactive, or insufficient stock

**Example**:

```typescript
const order = await ordersService.createOrder(
  userId,
  "address_123",
  "address_123",
  "CREDIT_CARD",
  "SAVE10",
  "Please deliver in morning"
);
```

---

#### **2. `getUserOrders()`**

**Purpose**: Get paginated list of user orders

**Parameters**:

- `userId: string` - User ID
- `page: number` - Page number
- `limit: number` - Items per page

**Returns**: `Promise<{ orders: Order[], total: number }>`

**Features**:

- ✅ Pagination support
- ✅ Includes order summary (status, total, item count)
- ✅ Includes product details for each item
- ✅ Sorted by creation date (newest first)

**Example**:

```typescript
const { orders, total } = await ordersService.getUserOrders(userId, 1, 20);
```

---

#### **3. `getOrderById()`**

**Purpose**: Get order details by ID

**Parameters**:

- `orderId: string` - Order ID
- `userId: string` - User ID (for authorization)

**Returns**: `Promise<Order>` - Order with all details

**Features**:

- ✅ Full order details
- ✅ Includes items, addresses, payment info
- ✅ User authorization check

**Throws**: `NotFoundError` if order not found

**Example**:

```typescript
const order = await ordersService.getOrderById("order_123", userId);
```

---

#### **4. `cancelOrder()`**

**Purpose**: Cancel user order

**Parameters**:

- `orderId: string` - Order ID
- `userId: string` - User ID
- `reason?: string` - Cancellation reason

**Returns**: `Promise<Order>` - Updated order

**Features**:

- ✅ Validates order belongs to user
- ✅ **State Machine Validation**: Ensures valid status transition
- ✅ Updates order status to CANCELLED
- ✅ **Restores Inventory**: Returns stock to available
- ✅ Creates tracking update
- ✅ Analytics tracking
- ✅ Audit logging

**State Machine**:

- Validates transition from current status to CANCELLED
- Prevents invalid transitions (e.g., can't cancel DELIVERED order)

**Throws**:

- `NotFoundError` if order not found
- `ValidationError` if invalid status transition

**Example**:

```typescript
const order = await ordersService.cancelOrder(
  "order_123",
  userId,
  "Changed my mind"
);
```

---

## 🎮 Orders Controller

### **File**: `orders.controller.ts`

**Purpose**: HTTP request handlers for order endpoints

### **Methods**

#### **1. `createOrder`**

- **Route**: `POST /api/v1/orders`
- **Authentication**: Required
- **Body**: `{ shippingAddressId, billingAddressId, paymentMethod, couponCode?, notes? }`
- **Handler**: Calls `ordersService.createOrder()`
- **Response**: Created order (201 Created)

#### **2. `getUserOrders`**

- **Route**: `GET /api/v1/orders`
- **Authentication**: Required
- **Query**: `page`, `limit`
- **Handler**: Calls `ordersService.getUserOrders()`
- **Response**: Paginated orders list

#### **3. `getOrderById`**

- **Route**: `GET /api/v1/orders/:id`
- **Authentication**: Required
- **Handler**: Calls `ordersService.getOrderById()`
- **Response**: Order details

#### **4. `cancelOrder`**

- **Route**: `POST /api/v1/orders/:id/cancel`
- **Authentication**: Required
- **Body**: `{ reason? }`
- **Handler**: Calls `ordersService.cancelOrder()`
- **Response**: Updated order

---

## 🛣️ Orders Routes

### **File**: `orders.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user orders
POST   /                    # Create order
GET    /:id                 # Get order by ID
POST   /:id/cancel          # Cancel order
```

**All routes require authentication**

---

## 💳 Payments Service

### **File**: `payments.service.ts`

**Purpose**: Handles payment processing and integration with payment gateways

### **Class**: `PaymentsService`

### **Methods**

#### **1. `initializePayment()`**

**Purpose**: Initialize payment session with payment gateway

**Parameters**:

- `orderId: string` - Order ID
- `returnUrl: string` - Return URL after payment
- `cancelUrl: string` - Cancel URL

**Returns**: `Promise<PaymentSession>` - Payment session details

**Features**:

- ✅ Validates order exists
- ✅ Creates payment record
- ✅ Initializes payment gateway session
- ✅ Returns payment URL/session ID

**Example**:

```typescript
const session = await paymentsService.initializePayment(
  "order_123",
  "https://example.com/success",
  "https://example.com/cancel"
);
```

---

#### **2. `verifyPayment()`**

**Purpose**: Verify payment status from gateway

**Parameters**:

- `paymentId: string` - Payment ID
- `gatewayResponse: any` - Gateway response data

**Returns**: `Promise<Payment>` - Updated payment record

**Features**:

- ✅ Verifies payment signature
- ✅ Updates payment status
- ✅ Updates order status if paid
- ✅ Handles webhook verification

**Example**:

```typescript
const payment = await paymentsService.verifyPayment(
  "payment_123",
  gatewayResponse
);
```

---

## 🏪 Shopify Payment Service

### **File**: `shopify-payment.service.ts`

**Purpose**: Shopify payment gateway integration

### **Class**: `ShopifyPaymentService`

### **Methods**

#### **1. `createCheckout()`**

**Purpose**: Create Shopify checkout session

**Parameters**:

- `orderId: string` - Order ID
- `returnUrl: string` - Return URL

**Returns**: `Promise<{ checkoutUrl: string, checkoutId: string }>`

**Features**:

- ✅ Creates Shopify checkout
- ✅ Adds order items to checkout
- ✅ Sets up return URLs
- ✅ Returns checkout URL

---

#### **2. `verifyWebhook()`**

**Purpose**: Verify Shopify webhook signature

**Parameters**:

- `payload: string` - Webhook payload
- `signature: string` - Webhook signature

**Returns**: `Promise<boolean>` - True if valid

---

## 🎮 Payments Controller

### **File**: `payments.controller.ts`

**Purpose**: HTTP request handlers for payment endpoints

### **Methods**

#### **1. `initializePayment`**

- **Route**: `POST /api/v1/payments/initialize`
- **Authentication**: Required
- **Body**: `{ orderId, returnUrl, cancelUrl }`
- **Handler**: Calls `paymentsService.initializePayment()`
- **Response**: Payment session

#### **2. `verifyPayment`**

- **Route**: `POST /api/v1/payments/verify`
- **Authentication**: Required
- **Body**: `{ paymentId, gatewayResponse }`
- **Handler**: Calls `paymentsService.verifyPayment()`
- **Response**: Payment status

#### **3. `handleWebhook`**

- **Route**: `POST /api/v1/payments/webhook`
- **Authentication**: Webhook signature verification
- **Handler**: Processes payment webhook
- **Response**: 200 OK

---

## 🛣️ Payments Routes

### **File**: `payments.routes.ts`

**Route Definitions**:

```typescript
POST   /initialize            # Initialize payment
POST   /verify                # Verify payment
POST   /webhook               # Payment webhook
```

**Routes require authentication except webhook**

---

## 📊 Database Models

### **Order Model** (Prisma)

- `id`, `orderNumber`, `userId`
- `status` (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `subtotal`, `discount`, `tax`, `shippingCost`, `total`
- `shippingAddressId`, `billingAddressId`
- `paymentMethod`, `couponCode`, `notes`
- `createdAt`, `updatedAt`
- Relations: `user`, `items`, `shippingAddress`, `billingAddress`, `payment`, `trackingUpdates`

### **OrderItem Model** (Prisma)

- `id`, `orderId`, `variantId`, `quantity`, `price`
- `createdAt`, `updatedAt`
- Relations: `order`, `variant`

### **Payment Model** (Prisma)

- `id`, `orderId`, `amount`, `status`
- `paymentMethod`, `gateway`, `gatewayTransactionId`
- `createdAt`, `updatedAt`
- Relations: `order`

---

## 🔍 Features

### **Order Features**

1. **Inventory Locking**: Prevents race conditions and overselling
2. **State Machine**: Validates order status transitions
3. **Automatic Calculations**: Subtotal, discount, tax, shipping, total
4. **Coupon Support**: Percentage and fixed amount discounts
5. **Free Shipping**: Automatic free shipping above threshold
6. **Order Tracking**: Automatic tracking update creation
7. **Audit Logging**: Complete audit trail
8. **Analytics**: Order creation and cancellation tracking

### **Payment Features**

1. **Multiple Gateways**: Shopify, Stripe, Razorpay support
2. **Webhook Verification**: Secure webhook handling
3. **Payment Status**: Real-time payment status updates
4. **Order Integration**: Automatic order status updates on payment

---

## 📝 Usage Examples

### **Create Order**

```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": "address_123",
  "billingAddressId": "address_123",
  "paymentMethod": "CREDIT_CARD",
  "couponCode": "SAVE10",
  "notes": "Please deliver in morning"
}
```

### **Get Orders**

```http
GET /api/v1/orders?page=1&limit=20
Authorization: Bearer <token>
```

### **Initialize Payment**

```http
POST /api/v1/payments/initialize
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_123",
  "returnUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

---

## 🔗 Related Files

- **Cart**: `modules/cart/cart.service.ts` - Uses cart to create orders
- **Inventory**: `utils/inventory-lock.util.ts` - Inventory locking
- **State Machine**: `utils/order-state-machine.util.ts` - Order status management
- **Order Utils**: `utils/order.util.ts` - Order number generation
- **Analytics**: `utils/analytics.util.ts` - Order analytics

---

**Last Updated**: January 2025
