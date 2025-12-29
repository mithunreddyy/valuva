# 💾 Repositories & Validation Schemas

**Complete documentation for all repository files and validation schemas across all modules.**

---

## 📁 Repository Files

Repositories handle all database access operations using Prisma. Each module has a repository that abstracts database queries.

---

## 🔐 Auth Repository

### **File**: `modules/auth/auth.repository.ts`

**Purpose**: Database access for authentication operations

**Methods**:

#### **1. `findUserByEmail()`**

**Purpose**: Find user by email

**Parameters**: `email: string`

**Returns**: `Promise<User | null>`

**Features**:

- ✅ Includes password for login verification
- ✅ Includes refresh token

---

#### **2. `findUserById()`**

**Purpose**: Find user by ID

**Parameters**: `id: string`

**Returns**: `Promise<User | null>`

**Features**:

- ✅ Excludes password by default
- ✅ Includes all user relations

---

#### **3. `createUser()`**

**Purpose**: Create new user

**Parameters**: User data

**Returns**: `Promise<User>`

**Features**:

- ✅ Hashes password before storing
- ✅ Sets default role (USER)
- ✅ Sets default active status

---

#### **4. `updateUser()`**

**Purpose**: Update user data

**Parameters**: `id: string, data: UserUpdateInput`

**Returns**: `Promise<User>`

---

#### **5. `updateUserPassword()`**

**Purpose**: Update user password

**Parameters**: `id: string, hashedPassword: string`

**Returns**: `Promise<void>`

---

#### **6. `updateRefreshToken()`**

**Purpose**: Update user refresh token

**Parameters**: `id: string, refreshToken: string`

**Returns**: `Promise<void>`

---

## 📦 Products Repository

### **File**: `modules/products/products.repository.ts`

**Purpose**: Database access for product operations

**Methods**:

#### **1. `findProducts()`**

**Purpose**: Find products with filters

**Parameters**: `filters, skip, take, orderBy`

**Returns**: `Promise<{ products: Product[], total: number }>`

**Features**:

- ✅ Complex filtering (category, price, size, color)
- ✅ Full-text search
- ✅ Includes relations (category, images, variants, reviews)
- ✅ Transaction for count + products

---

#### **2. `findProductById()`**

**Purpose**: Find product by ID

**Parameters**: `id: string`

**Returns**: `Promise<Product | null>`

**Features**:

- ✅ Includes all relations
- ✅ Increments view count
- ✅ Only active products

---

#### **3. `findProductBySlug()`**

**Purpose**: Find product by slug

**Parameters**: `slug: string`

**Returns**: `Promise<Product | null>`

**Features**:

- ✅ SEO-friendly lookup
- ✅ Includes all relations
- ✅ Increments view count

---

#### **4. `searchProducts()`**

**Purpose**: Search products by query

**Parameters**: `query: string, limit: number`

**Returns**: `Promise<{ products: Product[], total: number }>`

**Features**:

- ✅ Searches name, description, brand, SKU
- ✅ Case-insensitive
- ✅ Sorted by popularity

---

#### **5. `findRelatedProducts()`**

**Purpose**: Find related products

**Parameters**: `productId, categoryId, limit`

**Returns**: `Promise<Product[]>`

---

## 🛒 Cart Repository

### **File**: `modules/cart/cart.repository.ts`

**Purpose**: Database access for cart operations

**Methods**:

#### **1. `findOrCreateCart()`**

**Purpose**: Find or create user cart

**Parameters**: `userId: string`

**Returns**: `Promise<CartWithItems>`

**Features**:

- ✅ Auto-creates if doesn't exist
- ✅ Includes all items with variants and products

---

#### **2. `getCart()`**

**Purpose**: Get user cart

**Parameters**: `userId: string`

**Returns**: `Promise<CartWithItems | null>`

---

#### **3. `addCartItem()`**

**Purpose**: Add or update cart item

**Parameters**: `cartId, variantId, quantity`

**Returns**: `Promise<CartItem>`

**Features**:

- ✅ Uses upsert (creates or increments)
- ✅ Includes variant and product relations

---

#### **4. `updateCartItem()`**

**Purpose**: Update cart item quantity

**Parameters**: `itemId, quantity`

**Returns**: `Promise<CartItem>`

---

#### **5. `removeCartItem()`**

**Purpose**: Remove cart item

**Parameters**: `itemId: string`

**Returns**: `Promise<void>`

---

#### **6. `clearCart()`**

**Purpose**: Clear all cart items

**Parameters**: `cartId: string`

**Returns**: `Promise<void>`

---

## 📦 Orders Repository

### **File**: `modules/orders/orders.repository.ts`

**Purpose**: Database access for order operations

**Methods**:

#### **1. `createOrder()`**

**Purpose**: Create new order

**Parameters**: Order data

**Returns**: `Promise<Order>`

**Features**:

- ✅ Creates order with items
- ✅ Links addresses
- ✅ Creates payment record
- ✅ Transaction for atomicity

---

#### **2. `findOrderById()`**

**Purpose**: Find order by ID

**Parameters**: `id: string, userId?: string`

**Returns**: `Promise<Order | null>`

**Features**:

- ✅ Includes all relations
- ✅ User authorization check

---

#### **3. `findUserOrders()`**

**Purpose**: Find user orders

**Parameters**: `userId, skip, take`

**Returns**: `Promise<{ orders: Order[], total: number }>`

---

#### **4. `updateOrderStatus()`**

**Purpose**: Update order status

**Parameters**: `id, status, trackingNumber?`

**Returns**: `Promise<Order>`

---

#### **5. `restoreInventory()`**

**Purpose**: Restore inventory for cancelled order

**Parameters**: `orderId: string`

**Returns**: `Promise<void>`

**Features**:

- ✅ Increments variant stock
- ✅ Called on order cancellation

---

## ❤️ Wishlist Repository

### **File**: `modules/wishlist/wishlist.repository.ts`

**Purpose**: Database access for wishlist operations

**Methods**:

#### **1. `getUserWishlist()`**

**Purpose**: Get user wishlist

**Parameters**: `userId: string`

**Returns**: `Promise<WishlistItem[]>`

**Features**:

- ✅ Includes product details
- ✅ Includes product images
- ✅ Includes reviews for rating

---

#### **2. `addToWishlist()`**

**Purpose**: Add product to wishlist

**Parameters**: `userId, productId`

**Returns**: `Promise<Wishlist>`

**Features**:

- ✅ Uses unique constraint
- ✅ Prevents duplicates

---

#### **3. `removeFromWishlist()`**

**Purpose**: Remove from wishlist

**Parameters**: `userId, productId`

**Returns**: `Promise<void>`

---

#### **4. `isInWishlist()`**

**Purpose**: Check if product in wishlist

**Parameters**: `userId, productId`

**Returns**: `Promise<boolean>`

---

## ⭐ Reviews Repository

### **File**: `modules/reviews/reviews.repository.ts`

**Purpose**: Database access for review operations

**Methods**:

#### **1. `createReview()`**

**Purpose**: Create review

**Parameters**: Review data

**Returns**: `Promise<Review>`

**Features**:

- ✅ Includes user and product relations
- ✅ Sets default `isApproved: false`

---

#### **2. `findReviewById()`**

**Purpose**: Find review by ID

**Parameters**: `id: string`

**Returns**: `Promise<Review | null>`

---

#### **3. `findUserReviewForProduct()`**

**Purpose**: Check if user reviewed product

**Parameters**: `userId, productId`

**Returns**: `Promise<Review | null>`

**Features**:

- ✅ Uses unique constraint `productId_userId`

---

#### **4. `getProductReviews()`**

**Purpose**: Get paginated product reviews

**Parameters**: `productId, skip, take, rating?`

**Returns**: `Promise<{ reviews: Review[], total: number }>`

**Features**:

- ✅ Only approved reviews
- ✅ Optional rating filter
- ✅ Transaction for count + reviews

---

#### **5. `checkUserPurchasedProduct()`**

**Purpose**: Check if user purchased product

**Parameters**: `userId, productId`

**Returns**: `Promise<boolean>`

**Features**:

- ✅ Checks for DELIVERED orders
- ✅ Used for verified purchase badge

---

## 👤 Users Repository

### **File**: `modules/users/users.repository.ts`

**Purpose**: Database access for user operations

**Methods**:

#### **1. `getUserById()`**

**Purpose**: Get user by ID

**Parameters**: `id: string`

**Returns**: `Promise<User | null>`

**Features**:

- ✅ Excludes password
- ✅ Includes user stats

---

#### **2. `getUserByIdWithPassword()`**

**Purpose**: Get user with password (for password change)

**Parameters**: `id: string`

**Returns**: `Promise<User | null>`

---

#### **3. `updateProfile()`**

**Purpose**: Update user profile

**Parameters**: `id, data`

**Returns**: `Promise<User>`

---

#### **4. `updatePassword()`**

**Purpose**: Update user password

**Parameters**: `id, hashedPassword`

**Returns**: `Promise<void>`

---

#### **5. `getUserStats()`**

**Purpose**: Get user statistics

**Parameters**: `userId: string`

**Returns**: `Promise<UserStats>`

**Features**:

- ✅ Order count
- ✅ Total spent
- ✅ Wishlist count
- ✅ Review count

---

## 📍 Addresses Repository

### **File**: `modules/addresses/addresses.repository.ts`

**Purpose**: Database access for address operations

**Methods**:

#### **1. `getUserAddresses()`**

**Purpose**: Get user addresses

**Parameters**: `userId: string`

**Returns**: `Promise<Address[]>`

---

#### **2. `createAddress()`**

**Purpose**: Create address

**Parameters**: Address data

**Returns**: `Promise<Address>`

**Features**:

- ✅ Sets as default if first address

---

#### **3. `updateAddress()`**

**Purpose**: Update address

**Parameters**: `id, data`

**Returns**: `Promise<Address>`

---

#### **4. `deleteAddress()`**

**Purpose**: Delete address

**Parameters**: `id: string`

**Returns**: `Promise<void>`

**Features**:

- ✅ Prevents deletion if used in orders

---

#### **5. `setDefaultAddress()`**

**Purpose**: Set default address

**Parameters**: `id, userId`

**Returns**: `Promise<Address>`

**Features**:

- ✅ Unsets other default addresses
- ✅ Sets this as default

---

## 📋 Validation Schemas

All validation schemas use Zod for runtime type checking and validation.

---

## 🔐 Auth Validation

### **File**: `modules/auth/auth.validation.ts`

**Schemas**:

#### **1. `registerSchema`**

**Fields**:

- `email` - Email (required, email format, unique)
- `password` - Password (required, min 8 chars, strength validation)
- `firstName` - First name (required, min 2 chars)
- `lastName` - Last name (required, min 2 chars)
- `phone` - Phone (optional, Indian format)

**Validation Rules**:

- Email must be valid format
- Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Names: min 2 chars, max 50 chars

---

#### **2. `loginSchema`**

**Fields**:

- `email` - Email (required, email format)
- `password` - Password (required)

---

#### **3. `refreshTokenSchema`**

**Fields**:

- `refreshToken` - Refresh token (required, string)

---

#### **4. `forgotPasswordSchema`**

**Fields**:

- `email` - Email (required, email format)

---

#### **5. `resetPasswordSchema`**

**Fields**:

- `token` - Reset token (required, string)
- `newPassword` - New password (required, min 8 chars, strength validation)

---

#### **6. `verifyEmailSchema`**

**Fields**:

- `token` - Verification token (required, string)

---

## 📦 Products Validation

### **File**: `modules/products/products.validation.ts`

**Schemas**:

#### **1. `productFiltersSchema`**

**Fields**:

- `categoryId` - Category ID (optional, UUID)
- `subCategoryId` - Subcategory ID (optional, UUID)
- `minPrice` - Minimum price (optional, number, >= 0)
- `maxPrice` - Maximum price (optional, number, >= minPrice)
- `size` - Size filter (optional, string)
- `color` - Color filter (optional, string)
- `search` - Search query (optional, string, max 200 chars)
- `isFeatured` - Featured filter (optional, boolean)
- `isNewArrival` - New arrival filter (optional, boolean)

---

## 🛒 Cart Validation

### **File**: `modules/cart/cart.validation.ts`

**Schemas**:

#### **1. `addToCartSchema`**

**Fields**:

- `variantId` - Variant ID (required, UUID)
- `quantity` - Quantity (required, number, min 1, max 10)

---

#### **2. `updateCartItemSchema`**

**Fields**:

- `quantity` - Quantity (required, number, min 1, max 10)

---

## 📦 Orders Validation

### **File**: `modules/orders/orders.validation.ts`

**Schemas**:

#### **1. `createOrderSchema`**

**Fields**:

- `shippingAddressId` - Shipping address ID (required, UUID)
- `billingAddressId` - Billing address ID (required, UUID)
- `paymentMethod` - Payment method (required, enum)
- `couponCode` - Coupon code (optional, string)
- `notes` - Order notes (optional, string, max 500 chars)

---

#### **2. `cancelOrderSchema`**

**Fields**:

- `reason` - Cancellation reason (optional, string, max 200 chars)

---

## ⭐ Reviews Validation

### **File**: `modules/reviews/reviews.validation.ts`

**Schemas**:

#### **1. `createReviewSchema`**

**Fields**:

- `productId` - Product ID (required, UUID)
- `rating` - Rating (required, number, min 1, max 5)
- `title` - Review title (optional, string, max 100 chars)
- `comment` - Review comment (required, string, min 10, max 1000 chars)

---

#### **2. `updateReviewSchema`**

**Fields**:

- `rating` - Rating (optional, number, min 1, max 5)
- `title` - Review title (optional, string, max 100 chars)
- `comment` - Review comment (optional, string, min 10, max 1000 chars)

---

## 👤 Users Validation

### **File**: `modules/users/users.validation.ts`

**Schemas**:

#### **1. `updateProfileSchema`**

**Fields**:

- `firstName` - First name (optional, string, min 2, max 50)
- `lastName` - Last name (optional, string, min 2, max 50)
- `phone` - Phone (optional, string, Indian format)
- `dateOfBirth` - Date of birth (optional, date)

---

#### **2. `changePasswordSchema`**

**Fields**:

- `currentPassword` - Current password (required, string)
- `newPassword` - New password (required, string, min 8 chars, strength validation)

---

## 📍 Addresses Validation

### **File**: `modules/addresses/addresses.validation.ts`

**Schemas**:

#### **1. `createAddressSchema`**

**Fields**:

- `type` - Address type (required, enum: HOME, WORK, OTHER)
- `firstName` - First name (required, string, min 2, max 50)
- `lastName` - Last name (required, string, min 2, max 50)
- `phone` - Phone (required, string, Indian format)
- `addressLine1` - Address line 1 (required, string, max 200)
- `addressLine2` - Address line 2 (optional, string, max 200)
- `city` - City (required, string, max 100)
- `state` - State (required, string, max 100)
- `pincode` - Pincode (required, string, 6 digits)
- `country` - Country (required, string, default: "India")

---

#### **2. `updateAddressSchema`**

**Fields**: Same as create, all optional

---

## 👑 Admin Validation

### **File**: `modules/admin/admin.validation.ts`

**Schemas**:

#### **1. `adminLoginSchema`**

**Fields**:

- `email` - Admin email (required, email format)
- `password` - Admin password (required, string)
- `mfaToken` - MFA token (optional, string, 6 digits)

---

## 🔐 Admin MFA Validation

### **File**: `modules/admin/admin-mfa.validation.ts`

**Schemas**:

#### **1. `verifyMFASchema`**

**Fields**:

- `token` - MFA token (required, string, 6 digits)
- `secret` - MFA secret (required, string)
- `backupCodes` - Backup codes (required, array of 10 strings)

---

#### **2. `disableMFASchema`**

**Fields**:

- `password` - Admin password (required, string)

---

## 📦 Admin Products Validation

### **File**: `modules/admin/admin-products.validation.ts`

**Schemas**:

#### **1. `createProductSchema`**

**Fields**:

- `name` - Product name (required, string, min 3, max 200)
- `description` - Description (required, string, min 10, max 5000)
- `brand` - Brand (optional, string, max 100)
- `sku` - SKU (required, string, unique)
- `basePrice` - Base price (required, number, min 0)
- `compareAtPrice` - Compare price (optional, number, >= basePrice)
- `categoryId` - Category ID (required, UUID)
- `subCategoryId` - Subcategory ID (optional, UUID)
- `isFeatured` - Featured (optional, boolean)
- `isNewArrival` - New arrival (optional, boolean)
- `variants` - Product variants (required, array)
- `images` - Product images (required, array, min 1)

---

#### **2. `updateProductSchema`**

**Fields**: Same as create, all optional except `id`

---

## 📂 Admin Categories Validation

### **File**: `modules/admin/admin-categories.validation.ts`

**Schemas**:

#### **1. `createCategorySchema`**

**Fields**:

- `name` - Category name (required, string, min 2, max 100)
- `description` - Description (optional, string, max 500)
- `image` - Image URL (optional, string, URL format)
- `sortOrder` - Sort order (optional, number, default: 0)

---

#### **2. `createSubCategorySchema`**

**Fields**:

- `name` - Subcategory name (required, string, min 2, max 100)
- `description` - Description (optional, string, max 500)
- `image` - Image URL (optional, string, URL format)
- `sortOrder` - Sort order (optional, number, default: 0)

---

## 🎫 Admin Coupons Validation

### **File**: `modules/admin/admin-coupons.validation.ts`

**Schemas**:

#### **1. `createCouponSchema`**

**Fields**:

- `code` - Coupon code (required, string, uppercase, unique)
- `discountType` - Discount type (required, enum: PERCENTAGE, FIXED)
- `discountValue` - Discount value (required, number, min 0)
- `minPurchase` - Minimum purchase (optional, number, min 0)
- `maxDiscount` - Maximum discount (optional, number, min 0)
- `usageLimit` - Usage limit (optional, number, min 1)
- `expiresAt` - Expiry date (optional, date, future date)

---

## 🏠 Admin Homepage Validation

### **File**: `modules/admin/admin-homepage.validation.ts`

**Schemas**:

#### **1. `createSectionSchema`**

**Fields**:

- `type` - Section type (required, enum: HERO, FEATURED, NEW_ARRIVALS, CATEGORIES, BANNER)
- `title` - Section title (optional, string, max 200)
- `content` - Section content (optional, JSON)
- `image` - Image URL (optional, string, URL format)
- `order` - Display order (optional, number, default: 0)

---

## 📊 Analytics Validation

### **File**: `modules/analytics/analytics.validation.ts`

**Schemas**:

#### **1. `dateRangeSchema`**

**Fields**:

- `startDate` - Start date (required, date)
- `endDate` - End date (required, date, >= startDate)

---

## 📦 Tracking Validation

### **File**: `modules/order-tracking/tracking.validation.ts`

**Schemas**:

#### **1. `trackOrderSchema`**

**Fields**:

- `orderNumber` - Order number (required, string)

---

#### **2. `trackOrderPublicSchema`**

**Fields**:

- `orderNumber` - Order number (required, string)
- `email` - Order email (required, email format)

---

## 💳 Payments Validation

### **File**: `modules/payments/payments.validation.ts`

**Schemas**:

#### **1. `initializePaymentSchema`**

**Fields**:

- `orderId` - Order ID (required, UUID)
- `returnUrl` - Return URL (required, string, URL format)
- `cancelUrl` - Cancel URL (required, string, URL format)

---

## 🎫 Coupons Validation

### **File**: `modules/coupons/coupons.validation.ts`

**Schemas**:

#### **1. `validateCouponSchema`**

**Fields**:

- `code` - Coupon code (required, string, uppercase)
- `orderSubtotal` - Order subtotal (optional, number, min 0)

---

## 🏠 Homepage Validation

### **File**: `modules/homepage/homepage.validation.ts`

**Schemas**:

#### **1. `getSectionsSchema`**

**Fields**: None (public endpoint)

---

## ❤️ Wishlist Validation

### **File**: `modules/wishlist/wishlist.validation.ts`

**Schemas**:

#### **1. `addToWishlistSchema`**

**Fields**:

- `productId` - Product ID (required, UUID)

---

## 📝 Validation Patterns

### **Common Validation Rules**

1. **Email**: Valid email format, unique constraint
2. **Password**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
3. **Name**: Min 2 chars, max 50 chars, alphanumeric + spaces
4. **Phone**: Indian format (10 digits, optional +91)
5. **UUID**: Valid UUID v4 format
6. **URL**: Valid URL format
7. **Date**: Valid date, future dates for expiry
8. **Number**: Min/max constraints, positive numbers

---

## 🔍 Validation Features

1. **Type Safety**: Zod provides TypeScript type inference
2. **Runtime Validation**: Validates at runtime before processing
3. **Error Messages**: User-friendly error messages
4. **Sanitization**: Input sanitization before validation
5. **Custom Validators**: Module-specific validation logic

---

## 📝 Usage Examples

### **Validate Request**

```typescript
import { validate } from "../../middleware/validate.middleware";
import { registerSchema } from "./auth.validation";

router.post("/register", validate(registerSchema), controller.register);
```

### **Use Schema Type**

```typescript
import { registerSchema } from "./auth.validation";
import { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
```

---

## 🔗 Related Documentation

- [Authentication](./02-authentication.md)
- [Products & Categories](./03-products-categories.md)
- [Orders & Payments](./04-orders-payments.md)
- [Middleware](./12-utilities-middleware.md#middleware)

---

**Last Updated**: January 2025

