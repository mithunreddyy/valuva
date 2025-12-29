# 📦 Products & Categories Module

**Complete documentation for product and category management files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/products/
├── products.service.ts          # Product business logic
├── products.controller.ts       # HTTP request handlers
├── products.routes.ts            # Express route definitions
├── products.repository.ts        # Database access layer
└── products.validation.ts        # Input validation schemas

backend/src/modules/categories/
├── categories.service.ts         # Category business logic
├── categories.controller.ts      # HTTP request handlers
├── categories.routes.ts          # Express route definitions
├── categories.repository.ts      # Database access layer
└── categories.validation.ts      # Input validation schemas
```

---

## 🛍️ Products Service

### **File**: `products.service.ts`

**Purpose**: Handles all product-related business logic including listing, searching, filtering, and related products.

### **Class**: `ProductsService`

#### **Constructor**

```typescript
constructor();
```

- Initializes `ProductsRepository` instance
- Sets cache TTL to 3600 seconds (1 hour)

---

### **Methods**

#### **1. `getProducts()`**

**Purpose**: Get paginated list of products with filters and sorting

**Parameters**:

- `filters: ProductFilters` - Filter object
  - `categoryId?: string` - Filter by category
  - `subCategoryId?: string` - Filter by subcategory
  - `minPrice?: number` - Minimum price filter
  - `maxPrice?: number` - Maximum price filter
  - `size?: string` - Filter by size
  - `color?: string` - Filter by color
  - `search?: string` - Search query
  - `isFeatured?: boolean` - Featured products only
  - `isNewArrival?: boolean` - New arrivals only
- `page: number` - Page number (default: 1)
- `limit: number` - Items per page (default: 20)
- `sort?: string` - Sort order (`price_asc`, `price_desc`, `newest`, `popular`)

**Returns**: `Promise<{ products: any[], total: number, page: number, limit: number, totalPages: number }>`

**Features**:

- ✅ Redis caching with cache-aside pattern
- ✅ Pagination support
- ✅ Multiple filter options
- ✅ Sorting (price, date, popularity)
- ✅ Average rating calculation
- ✅ Review count aggregation

**Cache Key**: `products:${JSON.stringify(filters)}:${page}:${limit}:${sort}`

**Example**:

```typescript
const result = await productsService.getProducts(
  {
    categoryId: "cat_123",
    minPrice: 100,
    maxPrice: 1000,
  },
  1,
  20,
  "price_asc"
);
```

---

#### **2. `getProductBySlug()`**

**Purpose**: Get single product by slug with full details

**Parameters**:

- `slug: string` - Product slug

**Returns**: `Promise<Product & { averageRating: number, reviewCount: number }>`

**Features**:

- ✅ Redis caching
- ✅ Average rating calculation
- ✅ Review count
- ✅ Full product details with variants, images, reviews

**Cache Key**: `product:slug:${slug}`

**Throws**: `NotFoundError` if product not found

**Example**:

```typescript
const product = await productsService.getProductBySlug("cotton-kurta-123");
```

---

#### **3. `getProductById()`**

**Purpose**: Get single product by ID with full details

**Parameters**:

- `id: string` - Product ID

**Returns**: `Promise<Product & { averageRating: number, reviewCount: number }>`

**Features**:

- ✅ Redis caching
- ✅ Average rating calculation
- ✅ Review count

**Cache Key**: `product:id:${id}`

**Throws**: `NotFoundError` if product not found

**Example**:

```typescript
const product = await productsService.getProductById("prod_123");
```

---

#### **4. `getFeaturedProducts()`**

**Purpose**: Get featured products

**Parameters**:

- `limit: number` - Number of products (default: 12)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Redis caching with cache-aside pattern
- ✅ Sorted by total sold (popularity)
- ✅ Average rating calculation
- ✅ Review count

**Cache Key**: `products:featured:${limit}`

**Example**:

```typescript
const featured = await productsService.getFeaturedProducts(12);
```

---

#### **5. `getNewArrivals()`**

**Purpose**: Get new arrival products

**Parameters**:

- `limit: number` - Number of products (default: 12)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Redis caching with cache-aside pattern
- ✅ Sorted by creation date (newest first)
- ✅ Average rating calculation
- ✅ Review count

**Cache Key**: `products:new-arrivals:${limit}`

**Example**:

```typescript
const newArrivals = await productsService.getNewArrivals(12);
```

---

#### **6. `searchProducts()`**

**Purpose**: Search products by query string

**Parameters**:

- `query: string` - Search query
- `limit: number` - Number of results (default: 20)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Redis caching (30 minutes TTL)
- ✅ Case-insensitive search
- ✅ Searches name, description, brand, SKU
- ✅ Average rating calculation
- ✅ Returns empty array if query is empty

**Cache Key**: `products:search:${query.toLowerCase()}:${limit}`

**Example**:

```typescript
const results = await productsService.searchProducts("cotton kurta", 20);
```

---

#### **7. `getRelatedProducts()`**

**Purpose**: Get related products from same category

**Parameters**:

- `productId: string` - Product ID

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Finds products in same category
- ✅ Excludes current product
- ✅ Sorted by total sold (popularity)
- ✅ Average rating calculation
- ✅ Review count

**Throws**: `NotFoundError` if product not found

**Example**:

```typescript
const related = await productsService.getRelatedProducts("prod_123");
```

---

## 🎮 Products Controller

### **File**: `products.controller.ts`

**Purpose**: HTTP request handlers for product endpoints

### **Class**: `ProductsController`

### **Methods**

#### **1. `getProducts`**

- **Route**: `GET /api/v1/products`
- **Query Parameters**: `page`, `limit`, `categoryId`, `subCategoryId`, `minPrice`, `maxPrice`, `size`, `color`, `search`, `isFeatured`, `isNewArrival`, `sort`
- **Handler**: Calls `productsService.getProducts()`
- **Response**: Paginated product list

#### **2. `getProductById`**

- **Route**: `GET /api/v1/products/:id`
- **Handler**: Calls `productsService.getProductById()`
- **Features**: Increments view count asynchronously
- **Response**: Product details

#### **3. `getProductBySlug`**

- **Route**: `GET /api/v1/products/:slug`
- **Handler**: Calls `productsService.getProductBySlug()`
- **Features**:
  - Tracks product view for recommendations
  - Tracks analytics
  - Increments view count
- **Response**: Product details

#### **4. `getRelatedProducts`**

- **Route**: `GET /api/v1/products/:id/related`
- **Handler**: Calls `productsService.getRelatedProducts()`
- **Response**: Related products array

#### **5. `searchProducts`**

- **Route**: `GET /api/v1/products/search?q=...`
- **Query Parameters**: `q` (required), `limit`
- **Handler**: Calls `productsService.searchProducts()`
- **Features**:
  - Sanitizes search query
  - Tracks search analytics
- **Response**: Search results array

#### **6. `getFeaturedProducts`**

- **Route**: `GET /api/v1/products/featured`
- **Query Parameters**: `limit` (default: 12)
- **Handler**: Calls `productsService.getFeaturedProducts()`
- **Response**: Featured products array

#### **7. `getNewArrivals`**

- **Route**: `GET /api/v1/products/new-arrivals`
- **Query Parameters**: `limit` (default: 12)
- **Handler**: Calls `productsService.getNewArrivals()`
- **Response**: New arrival products array

---

## 🛣️ Products Routes

### **File**: `products.routes.ts`

**Route Definitions**:

```typescript
GET    /                          # Get products (with filters)
GET    /search                   # Search products
GET    /featured                 # Get featured products
GET    /new-arrivals             # Get new arrivals
GET    /:slug                    # Get product by slug
```

**All routes are public** (no authentication required)

---

## 💾 Products Repository

### **File**: `products.repository.ts`

**Purpose**: Database access layer for products

### **Class**: `ProductsRepository`

### **Interface**: `ProductFilters`

```typescript
interface ProductFilters {
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}
```

---

### **Methods**

#### **1. `findProducts()`**

**Purpose**: Find products with filters, pagination, and sorting

**Parameters**:

- `filters: ProductFilters` - Filter criteria
- `skip: number` - Skip count for pagination
- `take: number` - Take count for pagination
- `orderBy: Prisma.ProductOrderByWithRelationInput` - Sort order

**Returns**: `Promise<{ products: Product[], total: number }>`

**Features**:

- ✅ Complex filtering (category, price, size, color, search)
- ✅ Includes category, subcategory, images, variants, reviews
- ✅ Transaction for count + products
- ✅ Only active products

---

#### **2. `findProductById()`**

**Purpose**: Find product by ID with full relations

**Parameters**:

- `id: string` - Product ID

**Returns**: `Promise<Product | null>`

**Features**:

- ✅ Includes all relations (category, images, variants, reviews)
- ✅ Increments view count
- ✅ Only active products

---

#### **3. `findProductBySlug()`**

**Purpose**: Find product by slug with full relations

**Parameters**:

- `slug: string` - Product slug

**Returns**: `Promise<Product | null>`

**Features**:

- ✅ Includes all relations
- ✅ Increments view count
- ✅ Only active products

---

#### **4. `searchProducts()`**

**Purpose**: Search products by query

**Parameters**:

- `query: string` - Search query
- `limit: number` - Result limit

**Returns**: `Promise<{ products: Product[], total: number }>`

**Features**:

- ✅ Searches name, description, brand, SKU
- ✅ Case-insensitive search
- ✅ Sorted by popularity and views

---

#### **5. `findRelatedProducts()`**

**Purpose**: Find related products in same category

**Parameters**:

- `productId: string` - Product ID to exclude
- `categoryId: string` - Category ID
- `limit: number` - Result limit (default: 8)

**Returns**: `Promise<Product[]>`

**Features**:

- ✅ Same category
- ✅ Excludes current product
- ✅ Sorted by total sold

---

#### **6. `getAvailableSizes()`**

**Purpose**: Get available sizes for a product

**Parameters**:

- `productId: string` - Product ID

**Returns**: `Promise<string[]>`

**Features**:

- ✅ Only active variants with stock > 0
- ✅ Distinct sizes

---

#### **7. `getAvailableColors()`**

**Purpose**: Get available colors for a product

**Parameters**:

- `productId: string` - Product ID

**Returns**: `Promise<{ color: string, colorHex: string | null }[]>`

**Features**:

- ✅ Only active variants with stock > 0
- ✅ Distinct colors with hex codes

---

## 📂 Categories Service

### **File**: `categories.service.ts`

**Purpose**: Handles category-related business logic

### **Class**: `CategoriesService`

### **Methods**

#### **1. `getCategories()`**

**Purpose**: Get all categories with subcategories

**Returns**: `Promise<Category[]>`

**Example**:

```typescript
const categories = await categoriesService.getCategories();
```

---

#### **2. `getCategoryBySlug()`**

**Purpose**: Get category by slug

**Parameters**:

- `slug: string` - Category slug

**Returns**: `Promise<Category>`

**Throws**: `NotFoundError` if category not found

**Example**:

```typescript
const category = await categoriesService.getCategoryBySlug("mens-wear");
```

---

#### **3. `getSubCategoryBySlug()`**

**Purpose**: Get subcategory by slugs

**Parameters**:

- `categorySlug: string` - Category slug
- `subCategorySlug: string` - Subcategory slug

**Returns**: `Promise<SubCategory>`

**Throws**: `NotFoundError` if subcategory not found

**Example**:

```typescript
const subCategory = await categoriesService.getSubCategoryBySlug(
  "mens-wear",
  "kurtas"
);
```

---

## 🎮 Categories Controller

### **File**: `categories.controller.ts`

**Purpose**: HTTP request handlers for category endpoints

### **Methods**

#### **1. `getCategories`**

- **Route**: `GET /api/v1/categories`
- **Handler**: Calls `categoriesService.getCategories()`
- **Response**: Categories array

#### **2. `getCategoryBySlug`**

- **Route**: `GET /api/v1/categories/:slug`
- **Handler**: Calls `categoriesService.getCategoryBySlug()`
- **Response**: Category details

#### **3. `getSubCategoryBySlug`**

- **Route**: `GET /api/v1/categories/:categorySlug/:subCategorySlug`
- **Handler**: Calls `categoriesService.getSubCategoryBySlug()`
- **Response**: Subcategory details

---

## 🛣️ Categories Routes

### **File**: `categories.routes.ts`

**Route Definitions**:

```typescript
GET    /                          # Get all categories
GET    /:slug                    # Get category by slug
GET    /:categorySlug/:subCategorySlug  # Get subcategory
```

**All routes are public** (no authentication required)

---

## 📊 Database Models

### **Product Model** (Prisma)

- `id`, `name`, `slug`, `description`, `brand`, `sku`
- `basePrice`, `categoryId`, `subCategoryId`
- `isActive`, `isFeatured`, `isNewArrival`
- `totalSold`, `viewCount`
- `createdAt`, `updatedAt`
- Relations: `category`, `subCategory`, `images`, `variants`, `reviews`

### **Category Model** (Prisma)

- `id`, `name`, `slug`, `description`, `image`
- `isActive`, `sortOrder`
- `createdAt`, `updatedAt`
- Relations: `subCategories`, `products`

### **SubCategory Model** (Prisma)

- `id`, `name`, `slug`, `description`, `image`
- `categoryId`, `isActive`, `sortOrder`
- `createdAt`, `updatedAt`
- Relations: `category`, `products`

---

## 🔍 Features

### **Product Features**

1. **Caching**: Redis-based caching for performance
2. **Filtering**: Multiple filter options (category, price, size, color)
3. **Search**: Full-text search across name, description, brand, SKU
4. **Sorting**: Price, date, popularity sorting
5. **Ratings**: Automatic average rating calculation
6. **Related Products**: Smart related product suggestions
7. **View Tracking**: Automatic view count increment
8. **Analytics**: Product view and search tracking

### **Category Features**

1. **Hierarchical**: Categories with subcategories
2. **Slug-based**: SEO-friendly URLs
3. **Active Filtering**: Only active categories shown

---

## 📝 Usage Examples

### **Get Products with Filters**

```http
GET /api/v1/products?categoryId=cat_123&minPrice=100&maxPrice=1000&sort=price_asc&page=1&limit=20
```

### **Search Products**

```http
GET /api/v1/products/search?q=cotton%20kurta&limit=20
```

### **Get Product by Slug**

```http
GET /api/v1/products/cotton-kurta-123
```

### **Get Featured Products**

```http
GET /api/v1/products/featured?limit=12
```

### **Get Categories**

```http
GET /api/v1/categories
```

---

## 🔗 Related Files

- **Admin Products**: `modules/admin/admin-products.service.ts` - Admin CRUD operations
- **Admin Categories**: `modules/admin/admin-categories.service.ts` - Admin category management
- **Utils**: `utils/product.util.ts` - Product utilities
- **Utils**: `utils/cache.util.ts` - Caching utilities
- **Utils**: `utils/analytics.util.ts` - Analytics tracking

---

**Last Updated**: January 2025
