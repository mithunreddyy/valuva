# 👑 Frontend Admin Panel

**Complete documentation for admin dashboard, CRUD pages, analytics, and security pages, components, hooks, and services.**

---

## 📁 File Structure

```
frontend/src/app/(admin)/admin/
├── page.tsx                    # Admin dashboard
├── layout.tsx                  # Admin layout
├── products/page.tsx           # Products list
├── products/[id]/page.tsx      # Product edit
├── categories/page.tsx         # Categories management
├── coupons/page.tsx            # Coupons management
├── orders/page.tsx             # Orders list
├── orders/[id]/page.tsx        # Order details
├── customers/page.tsx          # Customers list
├── reviews/page.tsx            # Reviews moderation
├── homepage/page.tsx           # Homepage sections
├── analytics/page.tsx          # Analytics dashboard
├── tracking/page.tsx           # Order tracking
└── security/page.tsx           # MFA security

frontend/src/components/admin/
├── product-form.tsx            # Product form
├── category-form-modal.tsx     # Category form
├── subcategory-form-modal.tsx  # Subcategory form
├── coupon-form-modal.tsx       # Coupon form
├── homepage-section-form-modal.tsx # Homepage section form
└── image-upload.tsx            # Image upload

frontend/src/hooks/
└── use-admin.ts                # Admin hook

frontend/src/services/
└── api/admin.ts                # Admin API
```

---

## 🏠 Admin Dashboard

### **File**: `app/(admin)/admin/page.tsx`

**Purpose**: Admin dashboard homepage

**Features**:

- ✅ **Sales Overview**: Total revenue, orders, users
- ✅ **Recent Orders**: Last 10 orders
- ✅ **Top Products**: Best-selling products
- ✅ **Growth Metrics**: Revenue and user growth
- ✅ **Quick Stats**: Key metrics cards
- ✅ **Charts**: Revenue and sales charts

**Components Used**:

- `StatsCard` - Statistics display
- `RecentOrders` - Orders list
- `TopProducts` - Products list
- `Charts` - Data visualization

---

## 📦 Products Management

### **File**: `app/(admin)/admin/products/page.tsx`

**Purpose**: Products list and management

**Features**:

- ✅ **Products Table**: Paginated products table
- ✅ **Search & Filters**: Search, category, status filters
- ✅ **Create Product**: Add new product button
- ✅ **Edit Product**: Edit product link
- ✅ **Delete Product**: Delete product (soft delete)
- ✅ **Bulk Actions**: Bulk operations

**Components Used**:

- `ProductTable` - Products table
- `ProductForm` - Product creation/editing
- `ImageUpload` - Image upload

---

### **File**: `app/(admin)/admin/products/[id]/page.tsx`

**Purpose**: Product edit page

**Features**:

- ✅ **Product Form**: Full product editing form
- ✅ **Variants Management**: Add/edit/delete variants
- ✅ **Images Management**: Upload/manage images
- ✅ **Category Selection**: Category and subcategory
- ✅ **SEO Settings**: Slug, meta description
- ✅ **Publishing**: Active status, featured, new arrival

---

## 📂 Categories Management

### **File**: `app/(admin)/admin/categories/page.tsx`

**Purpose**: Categories and subcategories management

**Features**:

- ✅ **Categories Tree**: Hierarchical category display
- ✅ **Create Category**: Add new category
- ✅ **Edit Category**: Edit category
- ✅ **Delete Category**: Delete category
- ✅ **Subcategories**: Manage subcategories
- ✅ **Reorder**: Drag and drop reordering

**Components Used**:

- `CategoryFormModal` - Category form
- `SubCategoryFormModal` - Subcategory form
- `CategoryTree` - Category hierarchy

---

## 🎫 Coupons Management

### **File**: `app/(admin)/admin/coupons/page.tsx`

**Purpose**: Coupon management

**Features**:

- ✅ **Coupons Table**: List of all coupons
- ✅ **Create Coupon**: Add new coupon
- ✅ **Edit Coupon**: Edit coupon
- ✅ **Delete Coupon**: Delete coupon
- ✅ **Usage Tracking**: Usage count and limits
- ✅ **Status Toggle**: Activate/deactivate

**Components Used**:

- `CouponFormModal` - Coupon form
- `CouponTable` - Coupons table

---

## 📦 Orders Management

### **File**: `app/(admin)/admin/orders/page.tsx`

**Purpose**: Orders list and management

**Features**:

- ✅ **Orders Table**: All orders with filters
- ✅ **Status Filter**: Filter by status
- ✅ **Date Filter**: Filter by date range
- ✅ **Search**: Search by order number
- ✅ **Status Update**: Update order status
- ✅ **Tracking**: Add tracking number

---

### **File**: `app/(admin)/admin/orders/[id]/page.tsx`

**Purpose**: Order details and management

**Features**:

- ✅ **Order Details**: Complete order information
- ✅ **Status Update**: Update order status
- ✅ **Tracking Update**: Add tracking updates
- ✅ **Customer Info**: Customer details
- ✅ **Payment Info**: Payment details
- ✅ **Shipping Label**: Generate shipping label

---

## 👥 Customers Management

### **File**: `app/(admin)/admin/customers/page.tsx`

**Purpose**: Customer management

**Features**:

- ✅ **Customers Table**: List of all users
- ✅ **Search**: Search by name/email
- ✅ **Filter**: Filter by role, status
- ✅ **User Details**: View user details
- ✅ **Status Toggle**: Activate/deactivate users
- ✅ **User Stats**: User statistics

---

## ⭐ Reviews Moderation

### **File**: `app/(admin)/admin/reviews/page.tsx`

**Purpose**: Review moderation

**Features**:

- ✅ **Reviews Table**: All reviews
- ✅ **Approval**: Approve/reject reviews
- ✅ **Filter**: Filter by status, rating
- ✅ **Review Details**: Full review information
- ✅ **Bulk Actions**: Bulk approve/reject

---

## 🏠 Homepage Management

### **File**: `app/(admin)/admin/homepage/page.tsx`

**Purpose**: Homepage sections management

**Features**:

- ✅ **Sections List**: All homepage sections
- ✅ **Create Section**: Add new section
- ✅ **Edit Section**: Edit section
- ✅ **Delete Section**: Remove section
- ✅ **Reorder**: Drag and drop reordering
- ✅ **Toggle Visibility**: Show/hide sections

**Components Used**:

- `HomepageSectionFormModal` - Section form
- `SectionList` - Sections list with drag-drop

---

## 📊 Analytics Dashboard

### **File**: `app/(admin)/admin/analytics/page.tsx`

**Purpose**: Analytics and reporting

**Features**:

- ✅ **Sales Metrics**: Revenue, orders, AOV
- ✅ **Charts**: Revenue and sales charts
- ✅ **Top Products**: Best-selling products
- ✅ **User Analytics**: User growth and activity
- ✅ **Date Range**: Date range selection
- ✅ **Export**: Export reports

---

## 🔐 Security Page

### **File**: `app/(admin)/admin/security/page.tsx`

**Purpose**: Admin security and MFA

**Features**:

- ✅ **MFA Setup**: Setup multi-factor authentication
- ✅ **QR Code**: Display QR code for setup
- ✅ **Backup Codes**: Display and regenerate backup codes
- ✅ **MFA Status**: Current MFA status
- ✅ **Disable MFA**: Disable MFA option
- ✅ **Password Change**: Change admin password

**Components Used**:

- `MFASetup` - MFA setup component
- `QRCodeDisplay` - QR code display
- `BackupCodes` - Backup codes display

---

## 📦 Product Form Component

### **File**: `components/admin/product-form.tsx`

**Purpose**: Product creation/editing form

**Props**:

```typescript
interface ProductFormProps {
  product?: Product;
  onSave: (data: ProductData) => void;
  onCancel: () => void;
}
```

**Features**:

- ✅ **Product Details**: Name, description, price, SKU
- ✅ **Category Selection**: Category and subcategory
- ✅ **Variants**: Add/edit/delete variants
- ✅ **Images**: Upload and manage images
- ✅ **SEO**: Slug, meta description
- ✅ **Publishing**: Active, featured, new arrival toggles
- ✅ **Form Validation**: Comprehensive validation

---

## 📂 Category Form Modal

### **File**: `components/admin/category-form-modal.tsx`

**Purpose**: Category creation/editing modal

**Props**:

```typescript
interface CategoryFormModalProps {
  category?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryData) => void;
}
```

**Features**:

- ✅ **Category Name**: Name input
- ✅ **Description**: Description textarea
- ✅ **Image Upload**: Category image
- ✅ **Sort Order**: Display order
- ✅ **Active Toggle**: Active status

---

## 🎫 Coupon Form Modal

### **File**: `components/admin/coupon-form-modal.tsx`

**Purpose**: Coupon creation/editing modal

**Features**:

- ✅ **Coupon Code**: Unique code
- ✅ **Discount Type**: Percentage or fixed
- ✅ **Discount Value**: Discount amount
- ✅ **Min Purchase**: Minimum purchase requirement
- ✅ **Max Discount**: Maximum discount cap
- ✅ **Usage Limit**: Usage limit
- ✅ **Expiry Date**: Expiration date

---

## 🖼️ Image Upload Component

### **File**: `components/admin/image-upload.tsx`

**Purpose**: Image upload component

**Props**:

```typescript
interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
}
```

**Features**:

- ✅ **Drag and Drop**: Drag and drop upload
- ✅ **Image Preview**: Preview uploaded images
- ✅ **Multiple Images**: Support multiple uploads
- ✅ **Image Optimization**: Automatic optimization
- ✅ **Remove Images**: Remove uploaded images
- ✅ **Progress**: Upload progress indicator

---

## 🪝 Admin Hook

### **File**: `hooks/use-admin.ts`

**Purpose**: React Query hook for admin operations

**Methods**:

- `useAdminLogin()` - Admin login mutation
- `useDashboardStats()` - Dashboard stats query
- `useAdminOrders()` - Orders query
- `useUpdateOrderStatus()` - Update order mutation
- `useAdminUsers()` - Users query
- `useUpdateUserStatus()` - Update user status mutation

---

## 🔧 Admin Service

### **File**: `services/api/admin.ts`

**Purpose**: Admin API service

**Methods**:

- `adminLogin()` - Admin login
- `getDashboardStats()` - Dashboard statistics
- `getOrders()` - Get orders
- `updateOrderStatus()` - Update order status
- `getUsers()` - Get users
- `updateUserStatus()` - Update user status

---

## 📝 Usage Examples

### **Admin Dashboard**

```tsx
const { data: stats, isLoading } = useDashboardStats();

<AdminLayout>
  <StatsGrid stats={stats?.overview} />
  <RecentOrders orders={stats?.recentOrders} />
  <TopProducts products={stats?.topProducts} />
</AdminLayout>
```

### **Product Form**

```tsx
const { mutate: saveProduct } = useSaveProduct();

<ProductForm
  product={product}
  onSave={(data) => saveProduct(data)}
  onCancel={() => router.back()}
/>
```

---

## 🔗 Related Documentation

- [Admin Module](../backend/08-admin.md)
- [Products](../backend/03-products-categories.md)
- [Orders](../backend/04-orders-payments.md)

---

**Last Updated**: January 2025

