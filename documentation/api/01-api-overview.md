# 🌐 API Overview

**Complete API documentation for all endpoints, request/response formats, authentication, and use cases.**

---

## 🔗 Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.valuva.com/api/v1
```

---

## 🔐 Authentication

### **JWT Authentication**

Most endpoints require JWT authentication via Bearer token:

```http
Authorization: Bearer <access_token>
```

### **Token Types**

1. **Access Token** - Short-lived (15 minutes)

   - Used for API requests
   - Included in `Authorization` header
   - Automatically refreshed when expired

2. **Refresh Token** - Long-lived (7 days)
   - Used to get new access tokens
   - Stored securely (httpOnly cookie or localStorage)
   - Rotated on each refresh

### **Token Refresh**

**Endpoint**: `POST /api/v1/auth/refresh`

**Request**:

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

**Use Case**: Automatically refresh expired access tokens without requiring user to log in again.

---

## 📋 Response Format

### **Success Response**

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### **Error Response**

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error detail"]
  }
}
```

### **Paginated Response**

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 📊 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 🚦 Rate Limiting

### **General Endpoints**

- **Limit**: 100 requests per 15 minutes per IP

### **Authentication Endpoints**

- **Limit**: 5 requests per 15 minutes per IP

### **Admin Endpoints**

- **Limit**: 200 requests per 15 minutes per admin

**Rate Limit Headers**:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-01-01T12:00:00Z
Retry-After: 300
```

---

## 📁 API Endpoints by Category

---

## 🔓 Public Endpoints (No Authentication)

### **🔐 Authentication**

#### **1. Register User**

**Endpoint**: `POST /api/v1/auth/register`

**Use Case**: Create a new user account

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 98765 43210"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "Registration successful. Please verify your email."
}
```

**Validation**:

- Email must be valid and unique
- Password: min 8 characters, must contain uppercase, lowercase, number, special character
- First name and last name: required, min 2 characters

---

#### **2. Login**

**Endpoint**: `POST /api/v1/auth/login`

**Use Case**: Authenticate user and get access tokens

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### **3. Refresh Token**

**Endpoint**: `POST /api/v1/auth/refresh`

**Use Case**: Get new access token using refresh token

**Request**:

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

---

#### **4. Forgot Password**

**Endpoint**: `POST /api/v1/auth/forgot-password`

**Use Case**: Request password reset email

**Request**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Note**: Email sent with reset link (valid for 1 hour)

---

#### **5. Reset Password**

**Endpoint**: `POST /api/v1/auth/reset-password`

**Use Case**: Reset password using token from email

**Request**:

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

#### **6. Verify Email**

**Endpoint**: `GET /api/v1/auth/verify-email?token=<verification_token>`

**Use Case**: Verify user email address

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### **7. Resend Verification Email**

**Endpoint**: `POST /api/v1/auth/resend-verification`

**Authentication**: Required

**Use Case**: Resend email verification link

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

---

#### **8. Logout**

**Endpoint**: `POST /api/v1/auth/logout`

**Authentication**: Required

**Use Case**: Logout user and invalidate tokens

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **🔗 OAuth Authentication**

#### **9. Google OAuth**

**Endpoint**: `GET /api/v1/auth/oauth/google`

**Use Case**: Initiate Google OAuth login

**Flow**:

1. User clicks "Sign in with Google"
2. Redirected to Google consent screen
3. After consent, redirected to callback URL
4. Backend creates/links account
5. Redirects to frontend with tokens

**Callback**: `GET /api/v1/auth/oauth/google/callback`

**Response**: Redirects to frontend with tokens in URL:

```
https://frontend.com/auth/callback?accessToken=xxx&refreshToken=xxx&success=true
```

---

#### **10. Apple Sign In**

**Endpoint**: `GET /api/v1/auth/oauth/apple`

**Use Case**: Initiate Apple Sign In (requires client-side implementation)

**Status**: Placeholder - requires additional JWT verification setup

---

### **🛍️ Products**

#### **11. List Products**

**Endpoint**: `GET /api/v1/products`

**Use Case**: Browse products with filters, sorting, and pagination

**Query Parameters**:

- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `category` (string) - Category slug
- `subCategory` (string) - Subcategory slug
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `size` (string) - Filter by size
- `color` (string) - Filter by color
- `search` (string) - Search query
- `isFeatured` (boolean) - Featured products only
- `isNewArrival` (boolean) - New arrivals only
- `sort` (string) - Sort order: `price_asc`, `price_desc`, `newest`, `popular`

**Example Request**:

```http
GET /api/v1/products?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&sort=price_asc
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "Product Name",
      "slug": "product-name",
      "basePrice": 999,
      "compareAtPrice": 1299,
      "images": [
        {
          "url": "https://...",
          "isPrimary": true
        }
      ],
      "averageRating": 4.5,
      "reviewCount": 120,
      "isFeatured": true,
      "isNewArrival": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

#### **12. Get Product by Slug**

**Endpoint**: `GET /api/v1/products/:slug`

**Use Case**: Get detailed product information for product page

**Example Request**:

```http
GET /api/v1/products/wireless-headphones
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium wireless headphones...",
    "basePrice": 2999,
    "compareAtPrice": 3999,
    "sku": "WH-001",
    "brand": "TechBrand",
    "images": [...],
    "variants": [
      {
        "id": "var_123",
        "size": "M",
        "color": "Black",
        "colorHex": "#000000",
        "stock": 50,
        "price": 2999
      }
    ],
    "category": {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics"
    },
    "averageRating": 4.5,
    "reviewCount": 120,
    "specifications": {
      "battery": "20 hours",
      "connectivity": "Bluetooth 5.0"
    }
  }
}
```

---

#### **13. Search Products**

**Endpoint**: `GET /api/v1/products/search?q=<query>`

**Use Case**: Search products by name, description, or SKU

**Query Parameters**:

- `q` (string, required) - Search query
- `limit` (number, default: 20) - Max results

**Example Request**:

```http
GET /api/v1/products/search?q=headphones&limit=10
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "basePrice": 2999,
      "image": "https://..."
    }
  ]
}
```

---

#### **14. Get Featured Products**

**Endpoint**: `GET /api/v1/products/featured?limit=12`

**Use Case**: Get featured products for homepage

**Query Parameters**:

- `limit` (number, default: 12) - Number of products

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123",
      "name": "Featured Product",
      "slug": "featured-product",
      "basePrice": 999,
      "image": "https://...",
      "averageRating": 4.5
    }
  ]
}
```

---

#### **15. Get New Arrivals**

**Endpoint**: `GET /api/v1/products/new-arrivals?limit=12`

**Use Case**: Get recently added products

**Query Parameters**:

- `limit` (number, default: 12) - Number of products

**Response**: Same format as featured products

---

### **📂 Categories**

#### **16. List Categories**

**Endpoint**: `GET /api/v1/categories`

**Use Case**: Get all active categories with subcategories

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "image": "https://...",
      "isActive": true,
      "subCategories": [
        {
          "id": "subcat_123",
          "name": "Headphones",
          "slug": "headphones"
        }
      ],
      "_count": {
        "products": 150
      }
    }
  ]
}
```

---

#### **17. Get Category by Slug**

**Endpoint**: `GET /api/v1/categories/:slug`

**Use Case**: Get category details with products

**Example Request**:

```http
GET /api/v1/categories/electronics
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "cat_123",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic products",
    "image": "https://...",
    "subCategories": [...],
    "products": [...]
  }
}
```

---

### **🏠 Homepage**

#### **18. Get Homepage Sections**

**Endpoint**: `GET /api/v1/homepage/sections`

**Use Case**: Get all active homepage sections for dynamic homepage

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "section_123",
      "type": "HERO",
      "title": "Welcome to VALUVA",
      "subtitle": "Premium Products",
      "image": "https://...",
      "isActive": true,
      "sortOrder": 1,
      "config": {
        "ctaText": "Shop Now",
        "ctaLink": "/shop"
      }
    }
  ]
}
```

---

#### **19. Get Featured Products**

**Endpoint**: `GET /api/v1/homepage/featured?limit=12`

**Use Case**: Get featured products for homepage section

**Query Parameters**:

- `limit` (number, default: 12) - Number of products

**Response**: Array of featured products

---

#### **20. Get New Arrivals**

**Endpoint**: `GET /api/v1/homepage/new-arrivals?limit=12`

**Use Case**: Get new arrival products for homepage

**Response**: Array of new arrival products

---

#### **21. Get Best Sellers**

**Endpoint**: `GET /api/v1/homepage/best-sellers?limit=12`

**Use Case**: Get best-selling products for homepage

**Response**: Array of best-selling products

---

### **🎫 Coupons**

#### **22. Validate Coupon**

**Endpoint**: `POST /api/v1/coupons/validate`

**Use Case**: Validate coupon code before applying to order

**Request**:

```json
{
  "code": "SAVE10",
  "orderSubtotal": 1000
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "coupon_123",
    "code": "SAVE10",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "minPurchase": 500,
    "maxDiscount": 500,
    "isActive": true
  }
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Coupon code is invalid or expired"
}
```

---

#### **23. List Active Coupons**

**Endpoint**: `GET /api/v1/coupons?page=1&limit=20`

**Use Case**: Get list of active coupons for display

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "coupon_123",
      "code": "SAVE10",
      "description": "10% off on orders above ₹500",
      "discountType": "PERCENTAGE",
      "discountValue": 10,
      "minPurchase": 500
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### **📦 Order Tracking (Public)**

#### **24. Track Order by Order Number**

**Endpoint**: `POST /api/v1/order-tracking/track`

**Use Case**: Track order status using order number and email (public, no auth required)

**Request**:

```json
{
  "orderNumber": "ORD-2025-001234",
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123",
      "orderNumber": "ORD-2025-001234",
      "status": "SHIPPED",
      "total": 2999,
      "createdAt": "2025-01-01T10:00:00Z"
    },
    "timeline": [
      {
        "status": "PENDING",
        "label": "Order Placed",
        "isCompleted": true,
        "timestamp": "2025-01-01T10:00:00Z"
      },
      {
        "status": "SHIPPED",
        "label": "Shipped",
        "isCompleted": true,
        "isCurrent": true,
        "timestamp": "2025-01-02T14:00:00Z"
      }
    ]
  }
}
```

---

### **🎯 Recommendations**

#### **25. Get Similar Products**

**Endpoint**: `GET /api/v1/recommendations/similar/:productId?limit=5`

**Use Case**: Get products similar to the current product

**Query Parameters**:

- `limit` (number, default: 5) - Number of recommendations

**Example Request**:

```http
GET /api/v1/recommendations/similar/prod_123?limit=5
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "prod_456",
      "name": "Similar Product",
      "slug": "similar-product",
      "basePrice": 999,
      "image": "https://..."
    }
  ]
}
```

---

#### **26. Get Frequently Bought Together**

**Endpoint**: `GET /api/v1/recommendations/frequently-bought/:productId?limit=5`

**Use Case**: Get products frequently bought together with current product

**Response**: Array of recommended products

---

---

## 🔒 Authenticated Endpoints (User Required)

### **🛒 Cart**

#### **27. Get Cart**

**Endpoint**: `GET /api/v1/cart`

**Authentication**: Required

**Use Case**: Get user's shopping cart with all items

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "cart_123",
    "items": [
      {
        "id": "item_123",
        "variantId": "var_123",
        "quantity": 2,
        "price": 999,
        "subtotal": 1998,
        "product": {
          "id": "prod_123",
          "name": "Product Name",
          "slug": "product-name",
          "image": "https://..."
        },
        "variant": {
          "size": "M",
          "color": "Black",
          "colorHex": "#000000",
          "stock": 50
        }
      }
    ],
    "subtotal": 1998,
    "itemCount": 2
  }
}
```

---

#### **28. Add to Cart**

**Endpoint**: `POST /api/v1/cart/items`

**Authentication**: Required

**Use Case**: Add product variant to cart

**Request**:

```json
{
  "variantId": "var_123",
  "quantity": 2
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "item_123",
    "variantId": "var_123",
    "quantity": 2,
    "price": 999,
    "subtotal": 1998
  },
  "message": "Item added to cart"
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Insufficient stock available"
}
```

---

#### **29. Update Cart Item**

**Endpoint**: `PUT /api/v1/cart/items/:itemId`

**Authentication**: Required

**Use Case**: Update quantity of cart item

**Request**:

```json
{
  "quantity": 3
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "item_123",
    "quantity": 3,
    "subtotal": 2997
  },
  "message": "Cart item updated"
}
```

---

#### **30. Remove Cart Item**

**Endpoint**: `DELETE /api/v1/cart/items/:itemId`

**Authentication**: Required

**Use Case**: Remove item from cart

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

#### **31. Clear Cart**

**Endpoint**: `DELETE /api/v1/cart`

**Authentication**: Required

**Use Case**: Remove all items from cart

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### **📦 Orders**

#### **32. Create Order**

**Endpoint**: `POST /api/v1/orders/checkout`

**Authentication**: Required

**Use Case**: Create order from cart items

**Request**:

```json
{
  "shippingAddressId": "addr_123",
  "billingAddressId": "addr_123",
  "paymentMethod": "CREDIT_CARD",
  "couponCode": "SAVE10",
  "notes": "Please deliver before 5 PM"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2025-001234",
    "status": "PENDING",
    "subtotal": 1998,
    "discount": 199.8,
    "tax": 323.64,
    "shippingCost": 50,
    "total": 2171.84,
    "items": [...],
    "payment": {
      "id": "pay_123",
      "status": "PENDING",
      "method": "CREDIT_CARD"
    }
  },
  "message": "Order created successfully"
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Cart is empty",
  "errors": {
    "cart": ["Cannot create order with empty cart"]
  }
}
```

---

#### **33. Get User Orders**

**Endpoint**: `GET /api/v1/orders?page=1&limit=20`

**Authentication**: Required

**Use Case**: Get paginated list of user's orders

**Query Parameters**:

- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string) - Filter by status

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "order_123",
      "orderNumber": "ORD-2025-001234",
      "status": "SHIPPED",
      "total": 2171.84,
      "itemCount": 2,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

#### **34. Get Order Details**

**Endpoint**: `GET /api/v1/orders/:id`

**Authentication**: Required

**Use Case**: Get detailed order information

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2025-001234",
    "status": "SHIPPED",
    "subtotal": 1998,
    "discount": 199.8,
    "tax": 323.64,
    "shippingCost": 50,
    "total": 2171.84,
    "items": [
      {
        "id": "item_123",
        "quantity": 2,
        "price": 999,
        "variant": {
          "size": "M",
          "color": "Black",
          "product": {
            "name": "Product Name",
            "images": [...]
          }
        }
      }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "addressLine1": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001"
    },
    "payment": {
      "status": "COMPLETED",
      "method": "CREDIT_CARD",
      "transactionId": "txn_123"
    },
    "trackingNumber": "TRACK123456",
    "createdAt": "2025-01-01T10:00:00Z"
  }
}
```

---

#### **35. Cancel Order**

**Endpoint**: `PATCH /api/v1/orders/:id/cancel`

**Authentication**: Required

**Use Case**: Cancel an order (only if status is PENDING or PROCESSING)

**Request**:

```json
{
  "reason": "Changed my mind"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "CANCELLED"
  },
  "message": "Order cancelled successfully"
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Order cannot be cancelled. Status: SHIPPED"
}
```

---

### **❤️ Wishlist**

#### **36. Get Wishlist**

**Endpoint**: `GET /api/v1/wishlist`

**Authentication**: Required

**Use Case**: Get user's wishlist items

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "wish_123",
      "productId": "prod_123",
      "name": "Product Name",
      "slug": "product-name",
      "basePrice": 999,
      "compareAtPrice": 1299,
      "image": "https://...",
      "averageRating": 4.5,
      "reviewCount": 120,
      "addedAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

#### **37. Add to Wishlist**

**Endpoint**: `POST /api/v1/wishlist/items`

**Authentication**: Required

**Use Case**: Add product to wishlist

**Request**:

```json
{
  "productId": "prod_123"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "wish_123",
    "productId": "prod_123"
  },
  "message": "Product added to wishlist"
}
```

---

#### **38. Remove from Wishlist**

**Endpoint**: `DELETE /api/v1/wishlist/items/:productId`

**Authentication**: Required

**Use Case**: Remove product from wishlist

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Product removed from wishlist"
}
```

---

### **📍 Addresses**

#### **39. Get User Addresses**

**Endpoint**: `GET /api/v1/addresses`

**Authentication**: Required

**Use Case**: Get all user addresses

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "addr_123",
      "fullName": "John Doe",
      "phone": "+91 98765 43210",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

---

#### **40. Get Address by ID**

**Endpoint**: `GET /api/v1/addresses/:id`

**Authentication**: Required

**Use Case**: Get specific address details

**Response**: Single address object

---

#### **41. Create Address**

**Endpoint**: `POST /api/v1/addresses`

**Authentication**: Required

**Use Case**: Add new shipping/billing address

**Request**:

```json
{
  "fullName": "John Doe",
  "phone": "+91 98765 43210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "addr_123",
    "fullName": "John Doe",
    ...
  },
  "message": "Address created successfully"
}
```

---

#### **42. Update Address**

**Endpoint**: `PUT /api/v1/addresses/:id`

**Authentication**: Required

**Use Case**: Update existing address

**Request**: Same as create address

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "addr_123",
    ...
  },
  "message": "Address updated successfully"
}
```

---

#### **43. Delete Address**

**Endpoint**: `DELETE /api/v1/addresses/:id`

**Authentication**: Required

**Use Case**: Delete address

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### **⭐ Reviews**

#### **44. Get Product Reviews**

**Endpoint**: `GET /api/v1/reviews/products/:productId?page=1&limit=10`

**Use Case**: Get reviews for a product (public endpoint)

**Query Parameters**:

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `rating` (number) - Filter by rating (1-5)

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "rev_123",
      "rating": 5,
      "title": "Great product!",
      "comment": "Very satisfied with the quality",
      "isVerified": true,
      "isApproved": true,
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "averageRating": 4.5
  }
}
```

---

#### **45. Create Review**

**Endpoint**: `POST /api/v1/reviews`

**Authentication**: Required

**Use Case**: Create product review (only if user purchased the product)

**Request**:

```json
{
  "productId": "prod_123",
  "rating": 5,
  "title": "Great product!",
  "comment": "Very satisfied with the quality"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "rev_123",
    "rating": 5,
    "title": "Great product!",
    "comment": "Very satisfied with the quality",
    "isVerified": true,
    "isApproved": false
  },
  "message": "Review submitted. It will be published after approval."
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "You must purchase this product before reviewing"
}
```

---

#### **46. Get User Reviews**

**Endpoint**: `GET /api/v1/reviews/me`

**Authentication**: Required

**Use Case**: Get current user's reviews

**Response**: Array of user's reviews

---

#### **47. Update Review**

**Endpoint**: `PUT /api/v1/reviews/:id`

**Authentication**: Required

**Use Case**: Update own review

**Request**:

```json
{
  "rating": 4,
  "title": "Updated review",
  "comment": "Updated comment"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "rev_123",
    "rating": 4,
    ...
  },
  "message": "Review updated successfully"
}
```

---

#### **48. Delete Review**

**Endpoint**: `DELETE /api/v1/reviews/:id`

**Authentication**: Required

**Use Case**: Delete own review

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### **👤 Users**

#### **49. Get Profile**

**Endpoint**: `GET /api/v1/users/profile`

**Authentication**: Required

**Use Case**: Get current user profile

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+91 98765 43210",
    "isEmailVerified": true,
    "isActive": true,
    "role": "CUSTOMER",
    "createdAt": "2025-01-01T10:00:00Z"
  }
}
```

---

#### **50. Update Profile**

**Endpoint**: `PUT /api/v1/users/profile`

**Authentication**: Required

**Use Case**: Update user profile information

**Request**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 98765 43210"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    ...
  },
  "message": "Profile updated successfully"
}
```

---

#### **51. Change Password**

**Endpoint**: `POST /api/v1/users/change-password`

**Authentication**: Required

**Use Case**: Change user password

**Request**:

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

#### **52. Get User Stats**

**Endpoint**: `GET /api/v1/users/stats`

**Authentication**: Required

**Use Case**: Get user statistics (orders, wishlist, etc.)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalOrders": 5,
    "totalSpent": 15000,
    "wishlistItems": 10,
    "reviews": 3
  }
}
```

---

### **💳 Payments**

#### **53. Confirm Payment**

**Endpoint**: `POST /api/v1/payments/:orderId/confirm`

**Use Case**: Confirm payment after gateway processing

**Request**:

```json
{
  "paymentId": "pay_123",
  "transactionId": "txn_123",
  "gatewayResponse": {
    "status": "success",
    "paymentId": "gateway_payment_id"
  }
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "pay_123",
    "status": "COMPLETED",
    "transactionId": "txn_123"
  },
  "message": "Payment confirmed"
}
```

---

#### **54. Payment Webhook**

**Endpoint**: `POST /api/v1/payments/webhook`

**Use Case**: Receive payment gateway webhooks (validated by secret)

**Request**: Gateway-specific webhook payload

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

### **📦 Order Tracking (Authenticated)**

#### **55. Track Order**

**Endpoint**: `GET /api/v1/order-tracking/:orderNumber`

**Authentication**: Required

**Use Case**: Get detailed order tracking for authenticated user

**Response**: Same format as public tracking but includes more details

---

### **🔔 Stock Alerts**

#### **56. Create Stock Alert**

**Endpoint**: `POST /api/v1/stock-alerts`

**Authentication**: Required

**Use Case**: Create alert for out-of-stock product

**Request**:

```json
{
  "productId": "prod_123"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "alert_123",
    "productId": "prod_123",
    "userId": "user_123",
    "createdAt": "2025-01-01T10:00:00Z"
  },
  "message": "Stock alert created. You'll be notified when product is back in stock."
}
```

---

#### **57. Get User Stock Alerts**

**Endpoint**: `GET /api/v1/stock-alerts`

**Authentication**: Required

**Use Case**: Get all stock alerts for user

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "alert_123",
      "productId": "prod_123",
      "product": {
        "id": "prod_123",
        "name": "Product Name",
        "slug": "product-name",
        "image": "https://...",
        "basePrice": 999
      },
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

#### **58. Delete Stock Alert**

**Endpoint**: `DELETE /api/v1/stock-alerts/:productId`

**Authentication**: Required

**Use Case**: Remove stock alert

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Stock alert removed"
}
```

---

### **🔄 Returns**

#### **59. Get User Returns**

**Endpoint**: `GET /api/v1/returns?page=1&limit=20`

**Authentication**: Required

**Use Case**: Get user's return requests

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "return_123",
      "orderId": "order_123",
      "orderNumber": "ORD-2025-001234",
      "status": "PENDING",
      "reason": "Defective item",
      "items": [...],
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

---

#### **60. Create Return Request**

**Endpoint**: `POST /api/v1/returns`

**Authentication**: Required

**Use Case**: Create return request for order items

**Request**:

```json
{
  "orderId": "order_123",
  "items": [
    {
      "orderItemId": "item_123",
      "quantity": 1,
      "reason": "Defective"
    }
  ],
  "reason": "Product was defective",
  "notes": "Please process refund"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "return_123",
    "orderId": "order_123",
    "status": "PENDING",
    "reason": "Product was defective"
  },
  "message": "Return request created successfully"
}
```

---

#### **61. Get Return Details**

**Endpoint**: `GET /api/v1/returns/:id`

**Authentication**: Required

**Use Case**: Get detailed return request information

**Response**: Detailed return object with timeline

---

### **🎧 Support**

#### **62. Get User Support Tickets**

**Endpoint**: `GET /api/v1/support?page=1&limit=20`

**Authentication**: Required

**Use Case**: Get user's support tickets

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "id": "ticket_123",
      "subject": "Order issue",
      "status": "OPEN",
      "priority": "HIGH",
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

#### **63. Create Support Ticket**

**Endpoint**: `POST /api/v1/support`

**Authentication**: Required

**Use Case**: Create new support ticket

**Request**:

```json
{
  "subject": "Order delivery issue",
  "message": "My order hasn't arrived yet",
  "category": "order",
  "orderId": "order_123"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "ticket_123",
    "subject": "Order delivery issue",
    "status": "OPEN",
    "priority": "MEDIUM"
  },
  "message": "Support ticket created successfully"
}
```

---

#### **64. Get Ticket Details**

**Endpoint**: `GET /api/v1/support/:id`

**Authentication**: Required

**Use Case**: Get detailed ticket with conversation

**Response**: Ticket with messages/conversation

---

#### **65. Reply to Ticket**

**Endpoint**: `POST /api/v1/support/:id/reply`

**Authentication**: Required

**Use Case**: Add reply to support ticket

**Request**:

```json
{
  "message": "Thank you for the update"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "msg_123",
    "message": "Thank you for the update",
    "createdAt": "2025-01-01T10:00:00Z"
  },
  "message": "Reply added successfully"
}
```

---

### **🚚 Shipping**

#### **66. Calculate Shipping Rate**

**Endpoint**: `POST /api/v1/shipping/calculate-rate`

**Use Case**: Calculate shipping cost for order

**Request**:

```json
{
  "address": {
    "postalCode": "400001",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "items": [
    {
      "weight": 0.5,
      "quantity": 2
    }
  ]
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "rate": 50,
    "estimatedDays": 3,
    "carrier": "Standard Shipping"
  }
}
```

---

#### **67. Track Shipment**

**Endpoint**: `GET /api/v1/shipping/track/:trackingNumber`

**Use Case**: Track shipment using tracking number

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "trackingNumber": "TRACK123456",
    "status": "IN_TRANSIT",
    "currentLocation": "Mumbai",
    "estimatedDelivery": "2025-01-05T10:00:00Z",
    "updates": [
      {
        "status": "SHIPPED",
        "location": "Warehouse",
        "timestamp": "2025-01-02T10:00:00Z"
      }
    ]
  }
}
```

---

### **🎯 Recommendations (Authenticated)**

#### **68. Get Recently Viewed**

**Endpoint**: `GET /api/v1/recommendations/recently-viewed?limit=10`

**Authentication**: Required

**Use Case**: Get products recently viewed by user

**Response**: Array of recently viewed products

---

---

## 👑 Admin Endpoints (Admin Required)

### **🔐 Admin Authentication**

#### **69. Admin Login**

**Endpoint**: `POST /api/v1/admin/login`

**Use Case**: Admin authentication (separate from user login)

**Request**:

```json
{
  "email": "admin@valuva.com",
  "password": "AdminPass123!",
  "mfaToken": "123456"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "admin_123",
      "email": "admin@valuva.com",
      "role": "ADMIN",
      "mfaEnabled": true
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "requiresMFA": false
  }
}
```

**Note**: If MFA is enabled, first login returns `requiresMFA: true`, then provide `mfaToken` in second request.

---

#### **70. Get Admin Dashboard**

**Endpoint**: `GET /api/v1/admin/dashboard`

**Authentication**: Admin Required

**Use Case**: Get admin dashboard statistics

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalOrders": 1500,
    "totalRevenue": 5000000,
    "totalUsers": 5000,
    "totalProducts": 500,
    "pendingOrders": 25,
    "recentOrders": [...],
    "topProducts": [...]
  }
}
```

---

#### **71. Get Admin Orders**

**Endpoint**: `GET /api/v1/admin/orders?page=1&limit=20&status=SHIPPED`

**Authentication**: Admin Required

**Use Case**: Get all orders with filters (admin view)

**Query Parameters**:

- `page`, `limit` - Pagination
- `status` - Filter by status
- `startDate`, `endDate` - Date range

**Response**: Paginated orders list

---

#### **72. Get Order by ID (Admin)**

**Endpoint**: `GET /api/v1/admin/orders/:id`

**Authentication**: Admin Required

**Use Case**: Get detailed order information (admin view)

**Response**: Detailed order with customer information

---

#### **73. Update Order Status**

**Endpoint**: `PATCH /api/v1/admin/orders/:orderId/status`

**Authentication**: Admin Required

**Use Case**: Update order status (e.g., PENDING → SHIPPED)

**Request**:

```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRACK123456",
  "notes": "Shipped via standard delivery"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "SHIPPED",
    "trackingNumber": "TRACK123456"
  },
  "message": "Order status updated"
}
```

---

#### **74. Get All Users (Admin)**

**Endpoint**: `GET /api/v1/admin/users?page=1&limit=20`

**Authentication**: Admin Required

**Use Case**: Get all users with pagination

**Response**: Paginated users list

---

#### **75. Get User Details (Admin)**

**Endpoint**: `GET /api/v1/admin/users/:id`

**Authentication**: Admin Required

**Use Case**: Get detailed user information including orders, reviews

**Response**: Detailed user object

---

#### **76. Update User Status**

**Endpoint**: `PATCH /api/v1/admin/users/:id/status`

**Authentication**: Admin Required

**Use Case**: Activate/deactivate user account

**Request**:

```json
{
  "isActive": false
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "isActive": false
  },
  "message": "User status updated"
}
```

---

### **🔐 Admin MFA**

#### **77. Setup MFA**

**Endpoint**: `POST /api/v1/admin/mfa/setup`

**Authentication**: Admin Required

**Use Case**: Initialize MFA setup, get QR code

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "secret": "MFA_SECRET",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": ["CODE1", "CODE2", ...]
  },
  "message": "MFA setup initiated. Scan QR code and verify to enable."
}
```

---

#### **78. Verify and Enable MFA**

**Endpoint**: `POST /api/v1/admin/mfa/verify`

**Authentication**: Admin Required

**Use Case**: Verify MFA token and enable MFA

**Request**:

```json
{
  "token": "123456"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "MFA enabled successfully"
}
```

---

#### **79. Disable MFA**

**Endpoint**: `POST /api/v1/admin/mfa/disable`

**Authentication**: Admin Required

**Use Case**: Disable MFA for admin account

**Request**:

```json
{
  "password": "AdminPass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "MFA disabled successfully"
}
```

---

#### **80. Regenerate Backup Codes**

**Endpoint**: `POST /api/v1/admin/mfa/backup-codes`

**Authentication**: Admin Required

**Use Case**: Generate new backup codes

**Request**:

```json
{
  "password": "AdminPass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "backupCodes": ["NEWCODE1", "NEWCODE2", ...]
  },
  "message": "Backup codes regenerated"
}
```

---

### **🛍️ Products (Admin)**

#### **81. List All Products (Admin)**

**Endpoint**: `GET /api/v1/admin/products?page=1&limit=20`

**Authentication**: Admin Required

**Use Case**: Get all products with admin filters

**Query Parameters**:

- `page`, `limit` - Pagination
- `search` - Search query
- `category` - Filter by category
- `isActive` - Filter by active status

**Response**: Paginated products list

---

#### **82. Create Product**

**Endpoint**: `POST /api/v1/admin/products`

**Authentication**: Admin Required

**Use Case**: Create new product

**Request**:

```json
{
  "name": "New Product",
  "slug": "new-product",
  "description": "Product description",
  "basePrice": 999,
  "categoryId": "cat_123",
  "subCategoryId": "subcat_123",
  "sku": "SKU-001",
  "brand": "Brand Name",
  "isActive": true,
  "isFeatured": false,
  "isNewArrival": true,
  "variants": [
    {
      "size": "M",
      "color": "Black",
      "colorHex": "#000000",
      "stock": 50,
      "price": 999
    }
  ],
  "images": [
    {
      "url": "https://...",
      "isPrimary": true
    }
  ]
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "New Product",
    ...
  },
  "message": "Product created successfully"
}
```

---

#### **83. Get Product (Admin)**

**Endpoint**: `GET /api/v1/admin/products/:id`

**Authentication**: Admin Required

**Use Case**: Get product details (admin view with all data)

**Response**: Complete product object

---

#### **84. Update Product**

**Endpoint**: `PUT /api/v1/admin/products/:id`

**Authentication**: Admin Required

**Use Case**: Update product information

**Request**: Same format as create (all fields optional)

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    ...
  },
  "message": "Product updated successfully"
}
```

---

#### **85. Delete Product**

**Endpoint**: `DELETE /api/v1/admin/products/:id`

**Authentication**: Admin Required

**Use Case**: Delete product (soft delete - sets isActive to false)

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### **📂 Categories (Admin)**

#### **86. List Categories (Admin)**

**Endpoint**: `GET /api/v1/admin/categories`

**Authentication**: Admin Required

**Use Case**: Get all categories including inactive

**Response**: Categories list with admin data

---

#### **87. Create Category**

**Endpoint**: `POST /api/v1/admin/categories`

**Authentication**: Admin Required

**Use Case**: Create new category

**Request**:

```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "image": "https://...",
  "isActive": true,
  "sortOrder": 1
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "cat_123",
    "name": "New Category",
    ...
  },
  "message": "Category created successfully"
}
```

---

#### **88. Update Category**

**Endpoint**: `PUT /api/v1/admin/categories/:id`

**Authentication**: Admin Required

**Use Case**: Update category

**Request**: Same format as create

**Response** (200 OK): Updated category

---

#### **89. Delete Category**

**Endpoint**: `DELETE /api/v1/admin/categories/:id`

**Authentication**: Admin Required

**Use Case**: Delete category

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

#### **90. Create Subcategory**

**Endpoint**: `POST /api/v1/admin/categories/:id/subcategories`

**Authentication**: Admin Required

**Use Case**: Create subcategory under category

**Request**:

```json
{
  "name": "New Subcategory",
  "slug": "new-subcategory",
  "description": "Subcategory description",
  "image": "https://...",
  "isActive": true,
  "sortOrder": 1
}
```

**Response** (201 Created): Subcategory object

---

#### **91. Update Subcategory**

**Endpoint**: `PUT /api/v1/admin/categories/:id/subcategories/:subId`

**Authentication**: Admin Required

**Use Case**: Update subcategory

**Request**: Same format as create

**Response** (200 OK): Updated subcategory

---

#### **92. Delete Subcategory**

**Endpoint**: `DELETE /api/v1/admin/categories/:id/subcategories/:subId`

**Authentication**: Admin Required

**Use Case**: Delete subcategory

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Subcategory deleted successfully"
}
```

---

### **🎫 Coupons (Admin)**

#### **93. List Coupons (Admin)**

**Endpoint**: `GET /api/v1/admin/coupons?page=1&limit=20`

**Authentication**: Admin Required

**Use Case**: Get all coupons including inactive

**Response**: Paginated coupons list

---

#### **94. Create Coupon**

**Endpoint**: `POST /api/v1/admin/coupons`

**Authentication**: Admin Required

**Use Case**: Create new coupon

**Request**:

```json
{
  "code": "SAVE20",
  "description": "20% off on all products",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "minPurchase": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "isActive": true,
  "startsAt": "2025-01-01T00:00:00Z",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "coupon_123",
    "code": "SAVE20",
    ...
  },
  "message": "Coupon created successfully"
}
```

---

#### **95. Update Coupon**

**Endpoint**: `PUT /api/v1/admin/coupons/:id`

**Authentication**: Admin Required

**Use Case**: Update coupon

**Request**: Same format as create

**Response** (200 OK): Updated coupon

---

#### **96. Delete Coupon**

**Endpoint**: `DELETE /api/v1/admin/coupons/:id`

**Authentication**: Admin Required

**Use Case**: Delete coupon

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

---

### **🏠 Homepage (Admin)**

#### **97. Get Homepage Sections (Admin)**

**Endpoint**: `GET /api/v1/admin/homepage/sections`

**Authentication**: Admin Required

**Use Case**: Get all homepage sections including inactive

**Response**: All sections array

---

#### **98. Create Homepage Section**

**Endpoint**: `POST /api/v1/admin/homepage/sections`

**Authentication**: Admin Required

**Use Case**: Create new homepage section

**Request**:

```json
{
  "type": "BANNER",
  "title": "Summer Sale",
  "subtitle": "Up to 50% off",
  "image": "https://...",
  "isActive": true,
  "sortOrder": 1,
  "config": {
    "ctaText": "Shop Now",
    "ctaLink": "/shop",
    "backgroundColor": "#FF5733"
  }
}
```

**Response** (201 Created): Section object

---

#### **99. Update Homepage Section**

**Endpoint**: `PUT /api/v1/admin/homepage/sections/:id`

**Authentication**: Admin Required

**Use Case**: Update homepage section

**Request**: Same format as create

**Response** (200 OK): Updated section

---

#### **100. Delete Homepage Section**

**Endpoint**: `DELETE /api/v1/admin/homepage/sections/:id`

**Authentication**: Admin Required

**Use Case**: Delete homepage section

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Section deleted successfully"
}
```

---

#### **101. Reorder Homepage Sections**

**Endpoint**: `PUT /api/v1/admin/homepage/sections/reorder`

**Authentication**: Admin Required

**Use Case**: Reorder homepage sections

**Request**:

```json
{
  "sectionIds": ["section_1", "section_2", "section_3"]
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "message": "Sections reordered successfully"
}
```

---

#### **102. Toggle Section Visibility**

**Endpoint**: `PUT /api/v1/admin/homepage/sections/:id/toggle`

**Authentication**: Admin Required

**Use Case**: Toggle section active/inactive

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "section_123",
    "isActive": false
  },
  "message": "Section visibility updated"
}
```

---

### **⭐ Reviews (Admin)**

#### **103. Get All Reviews (Admin)**

**Endpoint**: `GET /api/v1/reviews/admin/all?page=1&limit=20`

**Authentication**: Admin Required

**Use Case**: Get all reviews including unapproved

**Query Parameters**:

- `page`, `limit` - Pagination
- `status` - Filter by approval status
- `rating` - Filter by rating

**Response**: Paginated reviews list

---

#### **104. Approve Review**

**Endpoint**: `PATCH /api/v1/reviews/:id/approve`

**Authentication**: Admin Required

**Use Case**: Approve review for public display

**Request**:

```json
{
  "approved": true
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "rev_123",
    "isApproved": true
  },
  "message": "Review approved"
}
```

---

### **📊 Analytics**

#### **105. Get Sales Metrics**

**Endpoint**: `GET /api/v1/analytics/sales-metrics?startDate=2025-01-01&endDate=2025-01-31`

**Authentication**: Admin Required

**Use Case**: Get sales metrics and KPIs

**Query Parameters**:

- `startDate` (ISO date) - Start date
- `endDate` (ISO date) - End date
- `period` (string) - `daily`, `weekly`, `monthly`

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "totalOrders": 1500,
    "averageOrderValue": 3333.33,
    "conversionRate": 2.5,
    "growth": {
      "revenue": 15.5,
      "orders": 10.2
    }
  }
}
```

---

#### **106. Get Top Products**

**Endpoint**: `GET /api/v1/analytics/top-products?limit=10&period=monthly`

**Authentication**: Admin Required

**Use Case**: Get best-selling products

**Query Parameters**:

- `limit` (number, default: 10) - Number of products
- `period` (string) - `daily`, `weekly`, `monthly`, `yearly`
- `startDate`, `endDate` - Date range

**Response** (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "productId": "prod_123",
      "name": "Product Name",
      "totalSold": 500,
      "revenue": 499500,
      "growth": 25.5
    }
  ]
}
```

---

#### **107. Get Revenue Trends**

**Endpoint**: `GET /api/v1/analytics/revenue-trends?startDate=2025-01-01&endDate=20
