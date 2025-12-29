# 🛒 Cart & Wishlist Module

**Complete documentation for shopping cart and wishlist management files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/cart/
├── cart.service.ts          # Cart business logic
├── cart.controller.ts       # HTTP request handlers
├── cart.routes.ts           # Express route definitions
├── cart.repository.ts       # Database access layer
└── cart.validation.ts       # Input validation schemas

backend/src/modules/wishlist/
├── wishlist.service.ts      # Wishlist business logic
├── wishlist.controller.ts   # HTTP request handlers
├── wishlist.routes.ts       # Express route definitions
├── wishlist.repository.ts   # Database access layer
└── wishlist.validation.ts   # Input validation schemas
```

---

## 🛒 Cart Service

### **File**: `cart.service.ts`

**Purpose**: Handles shopping cart operations including add, update, remove, and clear.

### **Class**: `CartService`

#### **Constructor**

```typescript
constructor();
```

- Initializes `CartRepository` instance

---

### **Methods**

#### **1. `getCart()`**

**Purpose**: Get user's shopping cart with all items

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<{ id: string, items: CartItem[], subtotal: number, itemCount: number }>`

**Features**:

- ✅ Auto-creates cart if doesn't exist
- ✅ Calculates subtotal
- ✅ Counts total items
- ✅ Includes product details (name, slug, image)
- ✅ Includes variant details (size, color, stock)

**Example**:

```typescript
const cart = await cartService.getCart(userId);
```

---

#### **2. `addToCart()`**

**Purpose**: Add product variant to cart

**Parameters**:

- `userId: string` - User ID
- `variantId: string` - Product variant ID
- `quantity: number` - Quantity to add

**Returns**: `Promise<Cart>` - Updated cart

**Features**:

- ✅ Validates variant exists and is active
- ✅ Checks stock availability
- ✅ Upserts cart item (increments if exists)
- ✅ Tracks analytics (add to cart event)
- ✅ Returns updated cart

**Throws**:

- `NotFoundError` if variant not found
- `ValidationError` if variant inactive or insufficient stock

**Example**:

```typescript
const cart = await cartService.addToCart(userId, "variant_123", 2);
```

---

#### **3. `updateCartItem()`**

**Purpose**: Update quantity of cart item

**Parameters**:

- `userId: string` - User ID
- `itemId: string` - Cart item ID
- `quantity: number` - New quantity

**Returns**: `Promise<Cart>` - Updated cart

**Features**:

- ✅ Validates cart item belongs to user
- ✅ Checks stock availability
- ✅ Updates quantity
- ✅ Returns updated cart

**Throws**:

- `NotFoundError` if cart item not found
- `ValidationError` if insufficient stock

**Example**:

```typescript
const cart = await cartService.updateCartItem(userId, "item_123", 3);
```

---

#### **4. `removeCartItem()`**

**Purpose**: Remove item from cart

**Parameters**:

- `userId: string` - User ID
- `itemId: string` - Cart item ID

**Returns**: `Promise<Cart>` - Updated cart

**Features**:

- ✅ Validates cart item belongs to user
- ✅ Removes item
- ✅ Tracks analytics (remove from cart event)
- ✅ Returns updated cart

**Throws**: `NotFoundError` if cart item not found

**Example**:

```typescript
const cart = await cartService.removeCartItem(userId, "item_123");
```

---

#### **5. `clearCart()`**

**Purpose**: Clear all items from cart

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<Cart>` - Empty cart

**Features**:

- ✅ Removes all cart items
- ✅ Returns empty cart structure

**Example**:

```typescript
const cart = await cartService.clearCart(userId);
```

---

## 🎮 Cart Controller

### **File**: `cart.controller.ts`

**Purpose**: HTTP request handlers for cart endpoints

### **Class**: `CartController`

### **Methods**

#### **1. `getCart`**

- **Route**: `GET /api/v1/cart`
- **Authentication**: Required
- **Handler**: Calls `cartService.getCart()`
- **Response**: Cart with items, subtotal, item count

#### **2. `addToCart`**

- **Route**: `POST /api/v1/cart`
- **Authentication**: Required
- **Body**: `{ variantId: string, quantity: number }`
- **Handler**: Calls `cartService.addToCart()`
- **Response**: Updated cart

#### **3. `updateCartItem`**

- **Route**: `PUT /api/v1/cart/:itemId`
- **Authentication**: Required
- **Body**: `{ quantity: number }`
- **Handler**: Calls `cartService.updateCartItem()`
- **Response**: Updated cart

#### **4. `removeCartItem`**

- **Route**: `DELETE /api/v1/cart/:itemId`
- **Authentication**: Required
- **Handler**: Calls `cartService.removeCartItem()`
- **Response**: Updated cart

#### **5. `clearCart`**

- **Route**: `DELETE /api/v1/cart`
- **Authentication**: Required
- **Handler**: Calls `cartService.clearCart()`
- **Response**: Empty cart

---

## 🛣️ Cart Routes

### **File**: `cart.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user cart
POST   /                    # Add item to cart
PUT    /:itemId             # Update cart item
DELETE /:itemId             # Remove cart item
DELETE /                    # Clear cart
```

**All routes require authentication**

---

## 💾 Cart Repository

### **File**: `cart.repository.ts`

**Purpose**: Database access layer for cart operations

### **Class**: `CartRepository`

### **Methods**

#### **1. `findOrCreateCart()`**

**Purpose**: Find existing cart or create new one

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<CartWithItems>`

**Features**:

- ✅ Auto-creates cart if doesn't exist
- ✅ Includes all items with variants and products
- ✅ Includes product images

---

#### **2. `getCart()`**

**Purpose**: Get user's cart

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<CartWithItems | null>`

---

#### **3. `addCartItem()`**

**Purpose**: Add or update cart item

**Parameters**:

- `cartId: string` - Cart ID
- `variantId: string` - Variant ID
- `quantity: number` - Quantity

**Returns**: `Promise<CartItem>`

**Features**:

- ✅ Uses upsert (creates or increments)
- ✅ Includes variant and product relations

---

#### **4. `updateCartItem()`**

**Purpose**: Update cart item quantity

**Parameters**:

- `itemId: string` - Cart item ID
- `quantity: number` - New quantity

**Returns**: `Promise<CartItem>`

---

#### **5. `removeCartItem()`**

**Purpose**: Remove cart item

**Parameters**:

- `itemId: string` - Cart item ID

**Returns**: `Promise<void>`

---

#### **6. `clearCart()`**

**Purpose**: Clear all cart items

**Parameters**:

- `cartId: string` - Cart ID

**Returns**: `Promise<void>`

---

#### **7. `getCartItemById()`**

**Purpose**: Get cart item by ID

**Parameters**:

- `itemId: string` - Cart item ID

**Returns**: `Promise<CartItem | null>`

---

#### **8. `getVariantById()`**

**Purpose**: Get product variant by ID

**Parameters**:

- `variantId: string` - Variant ID

**Returns**: `Promise<ProductVariant | null>`

---

## ❤️ Wishlist Service

### **File**: `wishlist.service.ts`

**Purpose**: Handles wishlist operations

### **Class**: `WishlistService`

### **Methods**

#### **1. `getUserWishlist()`**

**Purpose**: Get user's wishlist

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<WishlistItem[]>`

**Features**:

- ✅ Includes product details
- ✅ Calculates average rating
- ✅ Includes review count
- ✅ Includes product images

**Example**:

```typescript
const wishlist = await wishlistService.getUserWishlist(userId);
```

---

#### **2. `addToWishlist()`**

**Purpose**: Add product to wishlist

**Parameters**:

- `userId: string` - User ID
- `productId: string` - Product ID

**Returns**: `Promise<WishlistItem[]>` - Updated wishlist

**Features**:

- ✅ Validates product exists
- ✅ Prevents duplicates
- ✅ Returns updated wishlist

**Throws**:

- `NotFoundError` if product not found
- `ConflictError` if already in wishlist

**Example**:

```typescript
const wishlist = await wishlistService.addToWishlist(userId, "prod_123");
```

---

#### **3. `removeFromWishlist()`**

**Purpose**: Remove product from wishlist

**Parameters**:

- `userId: string` - User ID
- `productId: string` - Product ID

**Returns**: `Promise<WishlistItem[]>` - Updated wishlist

**Example**:

```typescript
const wishlist = await wishlistService.removeFromWishlist(userId, "prod_123");
```

---

## 🎮 Wishlist Controller

### **File**: `wishlist.controller.ts`

**Purpose**: HTTP request handlers for wishlist endpoints

### **Methods**

#### **1. `getWishlist`**

- **Route**: `GET /api/v1/wishlist`
- **Authentication**: Required
- **Handler**: Calls `wishlistService.getUserWishlist()`
- **Response**: Wishlist items array

#### **2. `addToWishlist`**

- **Route**: `POST /api/v1/wishlist`
- **Authentication**: Required
- **Body**: `{ productId: string }`
- **Handler**: Calls `wishlistService.addToWishlist()`
- **Response**: Updated wishlist

#### **3. `removeFromWishlist`**

- **Route**: `DELETE /api/v1/wishlist/:productId`
- **Authentication**: Required
- **Handler**: Calls `wishlistService.removeFromWishlist()`
- **Response**: Updated wishlist

---

## 🛣️ Wishlist Routes

### **File**: `wishlist.routes.ts`

**Route Definitions**:

```typescript
GET    /                    # Get user wishlist
POST   /                    # Add product to wishlist
DELETE /:productId          # Remove product from wishlist
```

**All routes require authentication**

---

## 📊 Database Models

### **Cart Model** (Prisma)

- `id`, `userId`
- `createdAt`, `updatedAt`
- Relations: `user`, `items`

### **CartItem Model** (Prisma)

- `id`, `cartId`, `variantId`, `quantity`
- `createdAt`, `updatedAt`
- Relations: `cart`, `variant`
- Unique: `cartId_variantId`

### **Wishlist Model** (Prisma)

- `id`, `userId`, `productId`
- `createdAt`, `updatedAt`
- Relations: `user`, `product`
- Unique: `userId_productId`

---

## 🔍 Features

### **Cart Features**

1. **Auto-Creation**: Cart created automatically for new users
2. **Stock Validation**: Checks stock before adding/updating
3. **Upsert Logic**: Increments quantity if item already exists
4. **Analytics**: Tracks add/remove from cart events
5. **Subtotal Calculation**: Automatic price calculation
6. **Item Count**: Total item quantity tracking

### **Wishlist Features**

1. **Duplicate Prevention**: Prevents adding same product twice
2. **Product Validation**: Validates product exists
3. **Rating Display**: Shows average rating and review count
4. **Product Details**: Includes full product information

---

## 📝 Usage Examples

### **Get Cart**

```http
GET /api/v1/cart
Authorization: Bearer <token>
```

### **Add to Cart**

```http
POST /api/v1/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "variantId": "variant_123",
  "quantity": 2
}
```

### **Update Cart Item**

```http
PUT /api/v1/cart/item_123
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### **Get Wishlist**

```http
GET /api/v1/wishlist
Authorization: Bearer <token>
```

### **Add to Wishlist**

```http
POST /api/v1/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_123"
}
```

---

## 🔗 Related Files

- **Orders**: `modules/orders/orders.service.ts` - Uses cart to create orders
- **Products**: `modules/products/products.service.ts` - Product information
- **Analytics**: `utils/analytics.util.ts` - Cart analytics tracking

---

**Last Updated**: January 2025
