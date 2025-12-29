# 👑 Admin Module

**Complete documentation for admin panel, CRUD operations, MFA, and analytics files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/admin/
├── admin.service.ts              # Admin authentication & dashboard
├── admin.controller.ts           # Admin HTTP handlers
├── admin.routes.ts               # Admin routes
├── admin.repository.ts           # Admin database access
├── admin.validation.ts           # Admin validation
├── admin-mfa.service.ts          # Multi-factor authentication
├── admin-mfa.controller.ts       # MFA HTTP handlers
├── admin-mfa.validation.ts       # MFA validation
├── admin-products.service.ts     # Product CRUD operations
├── admin-products.controller.ts  # Product CRUD handlers
├── admin-products.routes.ts      # Product CRUD routes
├── admin-products.repository.ts  # Product CRUD database
├── admin-products.validation.ts  # Product CRUD validation
├── admin-categories.service.ts   # Category CRUD operations
├── admin-categories.controller.ts # Category CRUD handlers
├── admin-categories.routes.ts    # Category CRUD routes
├── admin-categories.repository.ts # Category CRUD database
├── admin-categories.validation.ts # Category CRUD validation
├── admin-coupons.service.ts      # Coupon CRUD operations
├── admin-coupons.controller.ts  # Coupon CRUD handlers
├── admin-coupons.routes.ts       # Coupon CRUD routes
├── admin-coupons.repository.ts  # Coupon CRUD database
├── admin-coupons.validation.ts  # Coupon CRUD validation
├── admin-homepage.service.ts     # Homepage section management
├── admin-homepage.controller.ts  # Homepage HTTP handlers
├── admin-homepage.routes.ts      # Homepage routes
├── admin-homepage.repository.ts  # Homepage database
└── admin-homepage.validation.ts  # Homepage validation
```

---

## 👑 Admin Service

### **File**: `admin.service.ts`

**Purpose**: Handles admin authentication, dashboard, and order management.

### **Class**: `AdminService`

---

### **Methods**

#### **1. `login()`**

**Purpose**: Admin login with optional MFA

**Parameters**:

- `email: string` - Admin email
- `password: string` - Admin password
- `mfaToken?: string` - MFA token (if MFA enabled)

**Returns**: `Promise<{ admin: Admin, accessToken: string, refreshToken: string, requiresMFA: boolean }>`

**Features**:

- ✅ Validates admin credentials
- ✅ Checks admin is active
- ✅ **MFA Support**: Requires MFA token if enabled
- ✅ Returns `requiresMFA: true` if MFA enabled but token not provided
- ✅ Generates JWT tokens
- ✅ Updates last login

**Throws**:

- `UnauthorizedError` if credentials invalid or admin inactive
- `UnauthorizedError` if MFA token invalid

**Example**:

```typescript
// First login attempt (MFA enabled)
const result = await adminService.login("admin@valuva.com", "password");
if (result.requiresMFA) {
  // Prompt for MFA token
  const finalResult = await adminService.login(
    "admin@valuva.com",
    "password",
    mfaToken
  );
}
```

---

#### **2. `getDashboardStats()`**

**Purpose**: Get admin dashboard statistics

**Returns**: `Promise<{ overview: Stats, recentOrders: Order[], topProducts: Product[] }>`

**Features**:

- ✅ Sales overview (total revenue, orders, users)
- ✅ Recent orders (last 10)
- ✅ Top products (best sellers)
- ✅ Growth metrics

**Example**:

```typescript
const stats = await adminService.getDashboardStats();
```

---

#### **3. `updateOrderStatus()`**

**Purpose**: Update order status (Admin)

**Parameters**:

- `orderId: string` - Order ID
- `status: OrderStatus` - New status
- `trackingNumber?: string` - Optional tracking number

**Returns**: `Promise<Order>` - Updated order

**Features**:

- ✅ Validates status transition
- ✅ Updates tracking if provided
- ✅ Creates tracking update

**Example**:

```typescript
const order = await adminService.updateOrderStatus(
  "order_123",
  "SHIPPED",
  "TRACK123456"
);
```

---

#### **4. `getOrders()`**

**Purpose**: Get paginated orders (Admin)

**Parameters**:

- `page: number` - Page number
- `limit: number` - Items per page

**Returns**: `Promise<{ orders: Order[], total: number }>`

**Example**:

```typescript
const { orders, total } = await adminService.getOrders(1, 20);
```

---

#### **5. `getUsers()`**

**Purpose**: Get paginated users (Admin)

**Parameters**:

- `page: number` - Page number
- `limit: number` - Items per page

**Returns**: `Promise<{ users: User[], total: number }>`

**Example**:

```typescript
const { users, total } = await adminService.getUsers(1, 20);
```

---

#### **6. `getOrderById()`**

**Purpose**: Get order details (Admin)

**Parameters**:

- `orderId: string` - Order ID

**Returns**: `Promise<Order>` - Order details

**Example**:

```typescript
const order = await adminService.getOrderById("order_123");
```

---

## 🔐 Admin MFA Service

### **File**: `admin-mfa.service.ts`

**Purpose**: Multi-factor authentication for admin accounts

### **Class**: `AdminMFAService`

---

### **Methods**

#### **1. `setupMFA()`**

**Purpose**: Generate MFA secret and QR code

**Parameters**:

- `adminId: string` - Admin ID

**Returns**: `Promise<{ secret: string, qrCode: string, backupCodes: string[], otpAuthUrl: string }>`

**Features**:

- ✅ Generates TOTP secret
- ✅ Creates QR code for authenticator apps
- ✅ Generates backup codes (10 codes)
- ✅ Returns OTP Auth URL

**Example**:

```typescript
const { qrCode, backupCodes } = await mfaService.setupMFA(adminId);
// Display QR code to admin
// Store backup codes securely
```

---

#### **2. `verifyAndEnableMFA()`**

**Purpose**: Verify MFA token and enable MFA

**Parameters**:

- `adminId: string` - Admin ID
- `token: string` - MFA token from authenticator app
- `secret: string` - MFA secret
- `backupCodes: string[]` - Backup codes

**Returns**: `Promise<{ success: boolean }>`

**Features**:

- ✅ Verifies token is valid
- ✅ Hashes backup codes before storing
- ✅ Enables MFA on admin account
- ✅ Stores secret and backup codes

**Throws**: `UnauthorizedError` if token invalid

**Example**:

```typescript
await mfaService.verifyAndEnableMFA(adminId, token, secret, backupCodes);
```

---

#### **3. `verifyMFAToken()`**

**Purpose**: Verify MFA token during login

**Parameters**:

- `adminId: string` - Admin ID
- `token: string` - MFA token

**Returns**: `Promise<boolean>` - True if valid

**Features**:

- ✅ Verifies TOTP token
- ✅ Checks backup codes
- ✅ Consumes backup code if used

**Example**:

```typescript
const isValid = await mfaService.verifyMFAToken(adminId, token);
```

---

#### **4. `disableMFA()`**

**Purpose**: Disable MFA for admin

**Parameters**:

- `adminId: string` - Admin ID
- `password: string` - Admin password (for security)

**Returns**: `Promise<{ success: boolean }>`

**Features**:

- ✅ Validates password
- ✅ Disables MFA
- ✅ Clears secret and backup codes

**Throws**: `UnauthorizedError` if password invalid

**Example**:

```typescript
await mfaService.disableMFA(adminId, password);
```

---

#### **5. `regenerateBackupCodes()`**

**Purpose**: Regenerate backup codes

**Parameters**:

- `adminId: string` - Admin ID
- `password: string` - Admin password

**Returns**: `Promise<{ backupCodes: string[] }>`

**Features**:

- ✅ Validates password
- ✅ Generates new backup codes
- ✅ Hashes and stores codes

**Throws**: `UnauthorizedError` if password invalid

**Example**:

```typescript
const { backupCodes } = await mfaService.regenerateBackupCodes(
  adminId,
  password
);
```

---

## 🎮 Admin Controller

### **File**: `admin.controller.ts`

**Purpose**: HTTP request handlers for admin endpoints

### **Methods**

#### **1. `login`**

- **Route**: `POST /api/v1/admin/login`
- **Body**: `{ email, password, mfaToken? }`
- **Handler**: Calls `adminService.login()`
- **Response**: Admin data + tokens or `requiresMFA: true`

#### **2. `getDashboard`**

- **Route**: `GET /api/v1/admin/dashboard`
- **Authentication**: Admin required
- **Handler**: Calls `adminService.getDashboardStats()`
- **Response**: Dashboard statistics

#### **3. `updateOrderStatus`**

- **Route**: `PUT /api/v1/admin/orders/:id/status`
- **Authentication**: Admin required
- **Body**: `{ status, trackingNumber? }`
- **Handler**: Calls `adminService.updateOrderStatus()`
- **Response**: Updated order

---

## 🔐 Admin MFA Controller

### **File**: `admin-mfa.controller.ts`

**Purpose**: HTTP request handlers for MFA endpoints

### **Methods**

#### **1. `setupMFA`**

- **Route**: `POST /api/v1/admin/mfa/setup`
- **Authentication**: Admin required
- **Handler**: Calls `adminMFAService.setupMFA()`
- **Response**: QR code and backup codes

#### **2. `verifyMFA`**

- **Route**: `POST /api/v1/admin/mfa/verify`
- **Authentication**: Admin required
- **Body**: `{ token, secret, backupCodes }`
- **Handler**: Calls `adminMFAService.verifyAndEnableMFA()`
- **Response**: Success status

#### **3. `disableMFA`**

- **Route**: `POST /api/v1/admin/mfa/disable`
- **Authentication**: Admin required
- **Body**: `{ password }`
- **Handler**: Calls `adminMFAService.disableMFA()`
- **Response**: Success status

#### **4. `regenerateBackupCodes`**

- **Route**: `POST /api/v1/admin/mfa/regenerate-backup-codes`
- **Authentication**: Admin required
- **Body**: `{ password }`
- **Handler**: Calls `adminMFAService.regenerateBackupCodes()`
- **Response**: New backup codes

---

## 📦 Admin Products Service

### **File**: `admin-products.service.ts`

**Purpose**: Product CRUD operations for admin

### **Methods**

#### **1. `createProduct()`**

**Purpose**: Create new product

**Parameters**: Product data (name, description, price, category, variants, images)

**Returns**: `Promise<Product>` - Created product

**Features**:

- ✅ Validates category exists
- ✅ Generates slug from name
- ✅ Creates product variants
- ✅ Uploads and links images
- ✅ Invalidates product cache

---

#### **2. `updateProduct()`**

**Purpose**: Update existing product

**Parameters**: `productId: string, data: ProductData`

**Returns**: `Promise<Product>` - Updated product

**Features**:

- ✅ Validates product exists
- ✅ Updates slug if name changed
- ✅ Updates variants
- ✅ Updates images
- ✅ Invalidates cache

---

#### **3. `deleteProduct()`**

**Purpose**: Delete product (soft delete)

**Parameters**: `productId: string`

**Returns**: `Promise<void>`

**Features**:

- ✅ Soft delete (sets `isActive: false`)
- ✅ Prevents deletion if has orders
- ✅ Invalidates cache

---

#### **4. `getProducts()`**

**Purpose**: Get paginated products (Admin)

**Parameters**: `page: number, limit: number, filters?`

**Returns**: `Promise<{ products: Product[], total: number }>`

---

## 📂 Admin Categories Service

### **File**: `admin-categories.service.ts`

**Purpose**: Category and subcategory CRUD operations

### **Methods**

#### **1. `createCategory()`**

**Purpose**: Create new category

**Parameters**: Category data (name, description, image, sortOrder)

**Returns**: `Promise<Category>` - Created category

---

#### **2. `createSubCategory()`**

**Purpose**: Create new subcategory

**Parameters**: `categoryId: string, data: SubCategoryData`

**Returns**: `Promise<SubCategory>` - Created subcategory

---

#### **3. `updateCategory()`**

**Purpose**: Update category

**Parameters**: `categoryId: string, data: CategoryData`

**Returns**: `Promise<Category>` - Updated category

---

#### **4. `deleteCategory()`**

**Purpose**: Delete category

**Parameters**: `categoryId: string`

**Returns**: `Promise<void>`

**Features**:

- ✅ Prevents deletion if has products
- ✅ Invalidates cache

---

## 🎫 Admin Coupons Service

### **File**: `admin-coupons.service.ts`

**Purpose**: Coupon CRUD operations

### **Methods**

#### **1. `createCoupon()`**

**Purpose**: Create new coupon

**Parameters**: Coupon data (code, discountType, discountValue, minPurchase, maxDiscount, usageLimit, expiresAt)

**Returns**: `Promise<Coupon>` - Created coupon

---

#### **2. `updateCoupon()`**

**Purpose**: Update coupon

**Parameters**: `couponId: string, data: CouponData`

**Returns**: `Promise<Coupon>` - Updated coupon

---

#### **3. `deleteCoupon()`**

**Purpose**: Delete coupon

**Parameters**: `couponId: string`

**Returns**: `Promise<void>`

---

## 🏠 Admin Homepage Service

### **File**: `admin-homepage.service.ts`

**Purpose**: Homepage section management

### **Methods**

#### **1. `createSection()`**

**Purpose**: Create homepage section

**Parameters**: Section data (type, title, content, image, order)

**Returns**: `Promise<HomepageSection>` - Created section

**Section Types**: HERO, FEATURED, NEW_ARRIVALS, CATEGORIES, BANNER

---

#### **2. `updateSection()`**

**Purpose**: Update homepage section

**Parameters**: `sectionId: string, data: SectionData`

**Returns**: `Promise<HomepageSection>` - Updated section

---

#### **3. `reorderSections()`**

**Purpose**: Reorder homepage sections

**Parameters**: `sections: { id: string, order: number }[]`

**Returns**: `Promise<void>`

---

#### **4. `toggleSection()`**

**Purpose**: Toggle section visibility

**Parameters**: `sectionId: string`

**Returns**: `Promise<HomepageSection>` - Updated section

---

## 🛣️ Admin Routes

### **File**: `admin.routes.ts`

**Route Definitions**:

```typescript
POST   /login                 # Admin login
GET    /dashboard             # Dashboard stats
GET    /orders                # Get orders
GET    /orders/:id            # Get order details
PUT    /orders/:id/status     # Update order status
GET    /users                 # Get users
```

### **File**: `admin-mfa.routes.ts`

```typescript
POST   /mfa/setup                    # Setup MFA
POST   /mfa/verify                   # Verify and enable MFA
POST   /mfa/disable                  # Disable MFA
POST   /mfa/regenerate-backup-codes # Regenerate backup codes
```

### **File**: `admin-products.routes.ts`

```typescript
GET    /admin/products        # Get products
POST   /admin/products        # Create product
GET    /admin/products/:id    # Get product
PUT    /admin/products/:id    # Update product
DELETE /admin/products/:id    # Delete product
```

### **File**: `admin-categories.routes.ts`

```typescript
GET    /admin/categories                    # Get categories
POST   /admin/categories                    # Create category
PUT    /admin/categories/:id                # Update category
DELETE /admin/categories/:id                # Delete category
POST   /admin/categories/:id/subcategories # Create subcategory
PUT    /admin/categories/:id/subcategories/:subId # Update subcategory
DELETE /admin/categories/:id/subcategories/:subId # Delete subcategory
```

### **File**: `admin-coupons.routes.ts`

```typescript
GET    /admin/coupons        # Get coupons
POST   /admin/coupons         # Create coupon
PUT    /admin/coupons/:id    # Update coupon
DELETE /admin/coupons/:id     # Delete coupon
```

### **File**: `admin-homepage.routes.ts`

```typescript
GET    /admin/homepage/sections        # Get sections
POST   /admin/homepage/sections         # Create section
PUT    /admin/homepage/sections/:id     # Update section
DELETE /admin/homepage/sections/:id     # Delete section
PUT    /admin/homepage/sections/reorder # Reorder sections
PUT    /admin/homepage/sections/:id/toggle # Toggle visibility
```

---

## 📊 Database Models

### **Admin Model** (Prisma)

- `id`, `email`, `password`, `firstName`, `lastName`
- `role` (ADMIN, SUPER_ADMIN)
- `isActive`
- `mfaEnabled`, `mfaSecret`, `backupCodes`
- `refreshToken`, `lastLogin`
- `createdAt`, `updatedAt`

---

## 🔍 Features

### **Admin Features**

1. **Secure Authentication**: Password + optional MFA
2. **Multi-Factor Authentication**: TOTP with backup codes
3. **Dashboard Analytics**: Sales, orders, products stats
4. **Order Management**: Status updates, tracking
5. **User Management**: View, activate/deactivate users
6. **Product CRUD**: Full product management
7. **Category CRUD**: Category and subcategory management
8. **Coupon Management**: Create and manage discount coupons
9. **Homepage Management**: Dynamic homepage sections

---

## 📝 Usage Examples

### **Admin Login**

```http
POST /api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@valuva.com",
  "password": "Admin@123"
}
```

### **Setup MFA**

```http
POST /api/v1/admin/mfa/setup
Authorization: Bearer <admin_token>
```

### **Create Product**

```http
POST /api/v1/admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Cotton Kurta",
  "description": "Premium cotton kurta",
  "basePrice": 999,
  "categoryId": "cat_123",
  "variants": [...],
  "images": [...]
}
```

---

## 🔗 Related Files

- **Auth**: `modules/auth/auth.service.ts` - Similar authentication logic
- **Products**: `modules/products/products.service.ts` - Public product access
- **Orders**: `modules/orders/orders.service.ts` - Order processing
- **Analytics**: `modules/analytics/analytics.service.ts` - Dashboard analytics

---

**Last Updated**: January 2025
