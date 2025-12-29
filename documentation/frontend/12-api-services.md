# 🔌 Frontend API Services

**Complete documentation for all API service files in the frontend services/api directory.**

---

## 📁 File Structure

```
frontend/src/services/api/
├── auth.ts                    # Authentication API
├── products.ts                # Products API
├── cart.ts                    # Cart API
├── orders.ts                  # Orders API
├── wishlist.ts               # Wishlist API
├── reviews.ts                 # Reviews API
├── users.ts                   # Users API
├── addresses.ts               # Addresses API
├── coupons.ts                 # Coupons API
├── categories.ts              # Categories API
├── homepage.ts                # Homepage API
├── admin.ts                   # Admin API
├── admin-mfa.ts               # Admin MFA API
├── contact.ts                 # Contact API
├── newsletter.ts              # Newsletter API
├── returns.ts                 # Returns API
├── support.ts                 # Support API
├── stock-alerts.ts            # Stock alerts API
├── tracking.ts                # Order tracking API
├── recommendations.ts         # Recommendations API
└── payments.ts                # Payments API
```

---

## 🔐 Auth API

### **File**: `services/api/auth.ts`

**Purpose**: Authentication API endpoints

**Methods**:

#### **1. `login()`**

**Purpose**: User login

**Parameters**: `{ email: string, password: string }`

**Returns**: `Promise<{ user, accessToken, refreshToken }>`

**Endpoint**: `POST /api/v1/auth/login`

---

#### **2. `register()`**

**Purpose**: User registration

**Parameters**: `{ email, password, firstName, lastName, phone? }`

**Returns**: `Promise<{ user, accessToken, refreshToken }>`

**Endpoint**: `POST /api/v1/auth/register`

---

#### **3. `logout()`**

**Purpose**: User logout

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/auth/logout`

---

#### **4. `refreshToken()`**

**Purpose**: Refresh access token

**Parameters**: `refreshToken: string`

**Returns**: `Promise<{ accessToken, refreshToken }>`

**Endpoint**: `POST /api/v1/auth/refresh`

---

#### **5. `forgotPassword()`**

**Purpose**: Request password reset

**Parameters**: `email: string`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/auth/forgot-password`

---

#### **6. `resetPassword()`**

**Purpose**: Reset password with token

**Parameters**: `{ token: string, newPassword: string }`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/auth/reset-password`

---

#### **7. `verifyEmail()`**

**Purpose**: Verify email address

**Parameters**: `token: string`

**Returns**: `Promise<void>`

**Endpoint**: `GET /api/v1/auth/verify-email?token=...`

---

## 📦 Products API

### **File**: `services/api/products.ts`

**Purpose**: Products API endpoints

**Methods**:

#### **1. `getProducts()`**

**Purpose**: Get products with filters

**Parameters**: `{ filters, page, limit, sort? }`

**Returns**: `Promise<{ products, total, page, limit, totalPages }>`

**Endpoint**: `GET /api/v1/products`

---

#### **2. `getProduct()`**

**Purpose**: Get product by ID

**Parameters**: `id: string`

**Returns**: `Promise<Product>`

**Endpoint**: `GET /api/v1/products/:id`

---

#### **3. `getProductBySlug()`**

**Purpose**: Get product by slug

**Parameters**: `slug: string`

**Returns**: `Promise<Product>`

**Endpoint**: `GET /api/v1/products/:slug`

---

#### **4. `searchProducts()`**

**Purpose**: Search products

**Parameters**: `{ query: string, limit?: number }`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/products/search?q=...`

---

#### **5. `getFeaturedProducts()`**

**Purpose**: Get featured products

**Parameters**: `limit?: number`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/products/featured`

---

#### **6. `getNewArrivals()`**

**Purpose**: Get new arrivals

**Parameters**: `limit?: number`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/products/new-arrivals`

---

#### **7. `getRelatedProducts()`**

**Purpose**: Get related products

**Parameters**: `productId: string`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/products/:id/related`

---

## 🛒 Cart API

### **File**: `services/api/cart.ts`

**Purpose**: Cart API endpoints

**Methods**:

#### **1. `getCart()`**

**Purpose**: Get user cart

**Returns**: `Promise<Cart>`

**Endpoint**: `GET /api/v1/cart`

---

#### **2. `addToCart()`**

**Purpose**: Add item to cart

**Parameters**: `{ variantId: string, quantity: number }`

**Returns**: `Promise<Cart>`

**Endpoint**: `POST /api/v1/cart`

---

#### **3. `updateCartItem()`**

**Purpose**: Update cart item

**Parameters**: `{ itemId: string, quantity: number }`

**Returns**: `Promise<Cart>`

**Endpoint**: `PUT /api/v1/cart/:itemId`

---

#### **4. `removeCartItem()`**

**Purpose**: Remove cart item

**Parameters**: `itemId: string`

**Returns**: `Promise<Cart>`

**Endpoint**: `DELETE /api/v1/cart/:itemId`

---

#### **5. `clearCart()`**

**Purpose**: Clear cart

**Returns**: `Promise<Cart>`

**Endpoint**: `DELETE /api/v1/cart`

---

## 📦 Orders API

### **File**: `services/api/orders.ts`

**Purpose**: Orders API endpoints

**Methods**:

#### **1. `getOrders()`**

**Purpose**: Get user orders

**Parameters**: `{ page?: number, limit?: number }`

**Returns**: `Promise<{ orders, total }>`

**Endpoint**: `GET /api/v1/orders`

---

#### **2. `getOrder()`**

**Purpose**: Get order by ID

**Parameters**: `id: string`

**Returns**: `Promise<Order>`

**Endpoint**: `GET /api/v1/orders/:id`

---

#### **3. `createOrder()`**

**Purpose**: Create order

**Parameters**: `{ shippingAddressId, billingAddressId, paymentMethod, couponCode?, notes? }`

**Returns**: `Promise<Order>`

**Endpoint**: `POST /api/v1/orders`

---

#### **4. `cancelOrder()`**

**Purpose**: Cancel order

**Parameters**: `{ id: string, reason?: string }`

**Returns**: `Promise<Order>`

**Endpoint**: `POST /api/v1/orders/:id/cancel`

---

## ❤️ Wishlist API

### **File**: `services/api/wishlist.ts`

**Purpose**: Wishlist API endpoints

**Methods**:

#### **1. `getWishlist()`**

**Purpose**: Get user wishlist

**Returns**: `Promise<WishlistItem[]>`

**Endpoint**: `GET /api/v1/wishlist`

---

#### **2. `addToWishlist()`**

**Purpose**: Add product to wishlist

**Parameters**: `{ productId: string }`

**Returns**: `Promise<WishlistItem[]>`

**Endpoint**: `POST /api/v1/wishlist`

---

#### **3. `removeFromWishlist()`**

**Purpose**: Remove from wishlist

**Parameters**: `productId: string`

**Returns**: `Promise<WishlistItem[]>`

**Endpoint**: `DELETE /api/v1/wishlist/:productId`

---

## ⭐ Reviews API

### **File**: `services/api/reviews.ts`

**Purpose**: Reviews API endpoints

**Methods**:

#### **1. `getProductReviews()`**

**Purpose**: Get product reviews

**Parameters**: `{ productId, page?, limit?, rating? }`

**Returns**: `Promise<{ reviews, total, page, limit }>`

**Endpoint**: `GET /api/v1/reviews/product/:productId`

---

#### **2. `createReview()`**

**Purpose**: Create review

**Parameters**: `{ productId, rating, comment, title? }`

**Returns**: `Promise<Review>`

**Endpoint**: `POST /api/v1/reviews`

---

#### **3. `updateReview()`**

**Purpose**: Update review

**Parameters**: `{ id, rating?, title?, comment? }`

**Returns**: `Promise<Review>`

**Endpoint**: `PUT /api/v1/reviews/:id`

---

#### **4. `deleteReview()`**

**Purpose**: Delete review

**Parameters**: `id: string`

**Returns**: `Promise<void>`

**Endpoint**: `DELETE /api/v1/reviews/:id`

---

## 👤 Users API

### **File**: `services/api/users.ts`

**Purpose**: Users API endpoints

**Methods**:

#### **1. `getProfile()`**

**Purpose**: Get user profile

**Returns**: `Promise<User>`

**Endpoint**: `GET /api/v1/users/me`

---

#### **2. `updateProfile()`**

**Purpose**: Update profile

**Parameters**: `{ firstName?, lastName?, phone?, dateOfBirth? }`

**Returns**: `Promise<User>`

**Endpoint**: `PUT /api/v1/users/me`

---

#### **3. `changePassword()`**

**Purpose**: Change password

**Parameters**: `{ currentPassword, newPassword }`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/users/me/change-password`

---

#### **4. `getUserStats()`**

**Purpose**: Get user statistics

**Returns**: `Promise<UserStats>`

**Endpoint**: `GET /api/v1/users/me/stats`

---

## 📍 Addresses API

### **File**: `services/api/addresses.ts`

**Purpose**: Addresses API endpoints

**Methods**:

#### **1. `getAddresses()`**

**Purpose**: Get user addresses

**Returns**: `Promise<Address[]>`

**Endpoint**: `GET /api/v1/addresses`

---

#### **2. `createAddress()`**

**Purpose**: Create address

**Parameters**: Address data

**Returns**: `Promise<Address>`

**Endpoint**: `POST /api/v1/addresses`

---

#### **3. `updateAddress()`**

**Purpose**: Update address

**Parameters**: `{ id, ...addressData }`

**Returns**: `Promise<Address>`

**Endpoint**: `PUT /api/v1/addresses/:id`

---

#### **4. `deleteAddress()`**

**Purpose**: Delete address

**Parameters**: `id: string`

**Returns**: `Promise<void>`

**Endpoint**: `DELETE /api/v1/addresses/:id`

---

#### **5. `setDefaultAddress()`**

**Purpose**: Set default address

**Parameters**: `id: string`

**Returns**: `Promise<Address>`

**Endpoint**: `PUT /api/v1/addresses/:id/default`

---

## 🎫 Coupons API

### **File**: `services/api/coupons.ts`

**Purpose**: Coupons API endpoints

**Methods**:

#### **1. `getActiveCoupons()`**

**Purpose**: Get active coupons

**Parameters**: `{ page?, limit? }`

**Returns**: `Promise<{ coupons, total }>`

**Endpoint**: `GET /api/v1/coupons`

---

#### **2. `validateCoupon()`**

**Purpose**: Validate coupon code

**Parameters**: `{ code: string, orderSubtotal? }`

**Returns**: `Promise<Coupon>`

**Endpoint**: `POST /api/v1/coupons/validate`

---

## 📂 Categories API

### **File**: `services/api/categories.ts`

**Purpose**: Categories API endpoints

**Methods**:

#### **1. `getCategories()`**

**Purpose**: Get all categories

**Returns**: `Promise<Category[]>`

**Endpoint**: `GET /api/v1/categories`

---

#### **2. `getCategoryBySlug()`**

**Purpose**: Get category by slug

**Parameters**: `slug: string`

**Returns**: `Promise<Category>`

**Endpoint**: `GET /api/v1/categories/:slug`

---

## 🏠 Homepage API

### **File**: `services/api/homepage.ts`

**Purpose**: Homepage API endpoints

**Methods**:

#### **1. `getSections()`**

**Purpose**: Get homepage sections

**Returns**: `Promise<HomepageSection[]>`

**Endpoint**: `GET /api/v1/homepage/sections`

---

#### **2. `getFeatured()`**

**Purpose**: Get featured products

**Parameters**: `limit?: number`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/homepage/featured`

---

#### **3. `getNewArrivals()`**

**Purpose**: Get new arrivals

**Parameters**: `limit?: number`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/homepage/new-arrivals`

---

## 👑 Admin API

### **File**: `services/api/admin.ts`

**Purpose**: Admin API endpoints

**Methods**:

#### **1. `adminLogin()`**

**Purpose**: Admin login

**Parameters**: `{ email, password, mfaToken? }`

**Returns**: `Promise<{ admin, accessToken, refreshToken, requiresMFA? }>`

**Endpoint**: `POST /api/v1/admin/login`

---

#### **2. `getDashboardStats()`**

**Purpose**: Get dashboard statistics

**Returns**: `Promise<DashboardStats>`

**Endpoint**: `GET /api/v1/admin/dashboard`

---

#### **3. `getOrders()`**

**Purpose**: Get all orders (Admin)

**Parameters**: `{ page?, limit? }`

**Returns**: `Promise<{ orders, total }>`

**Endpoint**: `GET /api/v1/admin/orders`

---

#### **4. `updateOrderStatus()`**

**Purpose**: Update order status

**Parameters**: `{ id, status, trackingNumber? }`

**Returns**: `Promise<Order>`

**Endpoint**: `PUT /api/v1/admin/orders/:id/status`

---

## 🔐 Admin MFA API

### **File**: `services/api/admin-mfa.ts`

**Purpose**: Admin MFA API endpoints

**Methods**:

#### **1. `setupMFA()`**

**Purpose**: Setup MFA

**Returns**: `Promise<{ secret, qrCode, backupCodes, otpAuthUrl }>`

**Endpoint**: `POST /api/v1/admin/mfa/setup`

---

#### **2. `verifyMFA()`**

**Purpose**: Verify and enable MFA

**Parameters**: `{ token, secret, backupCodes }`

**Returns**: `Promise<{ success: boolean }>`

**Endpoint**: `POST /api/v1/admin/mfa/verify`

---

#### **3. `disableMFA()`**

**Purpose**: Disable MFA

**Parameters**: `{ password }`

**Returns**: `Promise<{ success: boolean }>`

**Endpoint**: `POST /api/v1/admin/mfa/disable`

---

## 📧 Contact API

### **File**: `services/api/contact.ts`

**Purpose**: Contact form API

**Methods**:

#### **1. `submitContact()`**

**Purpose**: Submit contact form

**Parameters**: `{ name, email, phone?, subject, message, category? }`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/contact`

---

## 📬 Newsletter API

### **File**: `services/api/newsletter.ts`

**Purpose**: Newsletter API endpoints

**Methods**:

#### **1. `subscribe()`**

**Purpose**: Subscribe to newsletter

**Parameters**: `{ email: string }`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/newsletter/subscribe`

---

#### **2. `unsubscribe()`**

**Purpose**: Unsubscribe from newsletter

**Parameters**: `{ email: string, token? }`

**Returns**: `Promise<void>`

**Endpoint**: `POST /api/v1/newsletter/unsubscribe`

---

## 🔄 Returns API

### **File**: `services/api/returns.ts`

**Purpose**: Returns API endpoints

**Methods**:

#### **1. `getReturns()`**

**Purpose**: Get user returns

**Returns**: `Promise<ReturnRequest[]>`

**Endpoint**: `GET /api/v1/returns`

---

#### **2. `createReturn()`**

**Purpose**: Create return request

**Parameters**: `{ orderId, orderItemIds, reason, description? }`

**Returns**: `Promise<ReturnRequest>`

**Endpoint**: `POST /api/v1/returns`

---

## 🎧 Support API

### **File**: `services/api/support.ts`

**Purpose**: Support API endpoints

**Methods**:

#### **1. `getTickets()`**

**Purpose**: Get user tickets

**Returns**: `Promise<SupportTicket[]>`

**Endpoint**: `GET /api/v1/support`

---

#### **2. `createTicket()`**

**Purpose**: Create support ticket

**Parameters**: `{ subject, message, category }`

**Returns**: `Promise<SupportTicket>`

**Endpoint**: `POST /api/v1/support`

---

#### **3. `getTicket()`**

**Purpose**: Get ticket details

**Parameters**: `id: string`

**Returns**: `Promise<SupportTicket>`

**Endpoint**: `GET /api/v1/support/:id`

---

#### **4. `addReply()`**

**Purpose**: Add reply to ticket

**Parameters**: `{ ticketId, message }`

**Returns**: `Promise<TicketReply>`

**Endpoint**: `POST /api/v1/support/:id/reply`

---

## 📢 Stock Alerts API

### **File**: `services/api/stock-alerts.ts`

**Purpose**: Stock alerts API endpoints

**Methods**:

#### **1. `getAlerts()`**

**Purpose**: Get user stock alerts

**Returns**: `Promise<StockAlert[]>`

**Endpoint**: `GET /api/v1/stock-alerts`

---

#### **2. `createAlert()`**

**Purpose**: Create stock alert

**Parameters**: `{ productId: string }`

**Returns**: `Promise<StockAlert>`

**Endpoint**: `POST /api/v1/stock-alerts`

---

#### **3. `deleteAlert()`**

**Purpose**: Delete stock alert

**Parameters**: `productId: string`

**Returns**: `Promise<void>`

**Endpoint**: `DELETE /api/v1/stock-alerts/:productId`

---

## 📦 Tracking API

### **File**: `services/api/tracking.ts`

**Purpose**: Order tracking API endpoints

**Methods**:

#### **1. `trackOrder()`**

**Purpose**: Track order (authenticated)

**Parameters**: `orderNumber: string`

**Returns**: `Promise<OrderTrackingResponse>`

**Endpoint**: `GET /api/v1/order-tracking?orderNumber=...`

---

#### **2. `trackOrderPublic()`**

**Purpose**: Track order (public)

**Parameters**: `{ orderNumber, email }`

**Returns**: `Promise<OrderTrackingResponse>`

**Endpoint**: `GET /api/v1/order-tracking/:orderNumber?email=...`

---

## 🎯 Recommendations API

### **File**: `services/api/recommendations.ts`

**Purpose**: Recommendations API endpoints

**Methods**:

#### **1. `getRecommendations()`**

**Purpose**: Get product recommendations

**Parameters**: `{ userId?, productId?, type? }`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/recommendations`

---

#### **2. `getRecentlyViewed()`**

**Purpose**: Get recently viewed products

**Parameters**: `limit?: number`

**Returns**: `Promise<Product[]>`

**Endpoint**: `GET /api/v1/recommendations/recently-viewed`

---

## 💳 Payments API

### **File**: `services/api/payments.ts`

**Purpose**: Payments API endpoints

**Methods**:

#### **1. `initializePayment()`**

**Purpose**: Initialize payment

**Parameters**: `{ orderId, returnUrl, cancelUrl }`

**Returns**: `Promise<PaymentSession>`

**Endpoint**: `POST /api/v1/payments/initialize`

---

#### **2. `verifyPayment()`**

**Purpose**: Verify payment

**Parameters**: `{ paymentId, gatewayResponse }`

**Returns**: `Promise<Payment>`

**Endpoint**: `POST /api/v1/payments/verify`

---

## 📝 API Service Pattern

### **Standard API Service Structure**

```typescript
import { apiClient } from "@/lib/api-client";

export const productsApi = {
  getProducts: (filters, page, limit, sort) =>
    apiClient.get("/products", {
      params: { ...filters, page, limit, sort },
    }),

  getProduct: (id) =>
    apiClient.get(`/products/${id}`),

  // More methods...
};
```

---

## 🔧 API Client Configuration

### **File**: `lib/api-client.ts`

**Purpose**: Centralized API client

**Features**:

- ✅ Base URL configuration
- ✅ Request interceptors (token injection)
- ✅ Response interceptors (error handling)
- ✅ Automatic token refresh
- ✅ Error handling

---

## 📝 Usage Examples

### **Using Products API**

```typescript
import { productsApi } from "@/services/api/products";

const products = await productsApi.getProducts(
  { categoryId: "cat_123" },
  1,
  20,
  "price_asc"
);
```

### **Using Cart API**

```typescript
import { cartApi } from "@/services/api/cart";

const cart = await cartApi.addToCart({
  variantId: "var_123",
  quantity: 2,
});
```

---

## 🔗 Related Documentation

- [Services & Hooks](./09-services-hooks.md)
- [API Overview](../api/01-api-overview.md)
- [State Management](./08-state-management.md)

---

**Last Updated**: January 2025

