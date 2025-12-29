# 🛍️ Frontend Products

**Complete documentation for product pages, components, hooks, and services.**

---

## 📁 File Structure

```
frontend/src/app/(main)/
├── products/[slug]/page.tsx     # Product detail page
├── shop/page.tsx                # Shop listing page
├── shop/shop-filters.tsx        # Shop filters component
├── shop/shop-sort.tsx           # Shop sort component
├── shop/horizontal-filters.tsx  # Horizontal filters
└── search/page.tsx              # Search results page

frontend/src/components/products/
├── ProductCard.tsx              # Product card component
├── product-detail.tsx           # Product detail component
├── product-grid.tsx             # Product grid layout
├── product-reviews.tsx          # Product reviews component
├── product-recommendations.tsx  # Related products
├── product-image-zoom.tsx       # Image zoom component
├── compare-button.tsx           # Product comparison
├── stock-alert-button.tsx       # Stock alert button
├── recently-viewed.tsx          # Recently viewed products
└── product-card-skeleton.tsx    # Loading skeleton

frontend/src/hooks/
└── use-products.ts              # Products hook

frontend/src/services/
├── products.service.ts          # Products service
└── api/products.ts              # Products API
```

---

## 📄 Product Detail Page

### **File**: `app/(main)/products/[slug]/page.tsx`

**Purpose**: Individual product detail page

**Features**:

- ✅ **Product Information**: Name, description, price, variants
- ✅ **Image Gallery**: Multiple product images with zoom
- ✅ **Variant Selection**: Size and color selection
- ✅ **Add to Cart**: Add to cart functionality
- ✅ **Wishlist**: Add to wishlist button
- ✅ **Reviews**: Product reviews display
- ✅ **Related Products**: Related product recommendations
- ✅ **Stock Status**: Stock availability display
- ✅ **SEO**: Optimized metadata

**Components Used**:

- `ProductDetail`
- `ProductReviews`
- `ProductRecommendations`
- `ProductImageZoom`
- `StockAlertButton`

---

## 🛍️ Shop Page

### **File**: `app/(main)/shop/page.tsx`

**Purpose**: Product listing/shop page

**Features**:

- ✅ **Product Grid**: Paginated product grid
- ✅ **Filters**: Category, price, size, color filters
- ✅ **Sorting**: Price, date, popularity sorting
- ✅ **Pagination**: Page navigation
- ✅ **Search**: Product search
- ✅ **URL State**: Filters in URL for sharing

**Components Used**:

- `ProductGrid`
- `ShopFilters`
- `ShopSort`
- `Pagination`

---

## 🔍 Search Page

### **File**: `app/(main)/search/page.tsx`

**Purpose**: Product search results page

**Features**:

- ✅ **Search Query**: URL-based search query
- ✅ **Search Results**: Paginated results
- ✅ **No Results**: Empty state
- ✅ **Search Suggestions**: Search suggestions
- ✅ **Recent Searches**: Recent search history

---

## 🎴 Product Card Component

### **File**: `components/products/ProductCard.tsx`

**Purpose**: Reusable product card component

**Props**:

```typescript
interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
  showCompare?: boolean;
  variant?: "default" | "compact";
}
```

**Features**:

- ✅ **Product Image**: Primary product image
- ✅ **Product Name**: Product name with link
- ✅ **Price**: Formatted price display
- ✅ **Rating**: Star rating display
- ✅ **Quick Actions**: Wishlist, compare buttons
- ✅ **Hover Effects**: Image zoom on hover
- ✅ **Responsive**: Mobile, tablet, desktop layouts

---

## 📦 Product Detail Component

### **File**: `components/products/product-detail.tsx`

**Purpose**: Product detail display component

**Props**:

```typescript
interface ProductDetailProps {
  product: Product;
  onAddToCart: (variantId: string, quantity: number) => void;
  onAddToWishlist: () => void;
}
```

**Features**:

- ✅ **Product Info**: Name, description, brand, SKU
- ✅ **Price Display**: Base price, compare price, discount
- ✅ **Variant Selection**: Size and color picker
- ✅ **Quantity Selector**: Quantity input
- ✅ **Add to Cart**: Add to cart button
- ✅ **Buy Now**: Direct checkout button
- ✅ **Stock Status**: Stock availability
- ✅ **Share**: Social sharing buttons

---

## 🖼️ Product Image Zoom

### **File**: `components/products/product-image-zoom.tsx`

**Purpose**: Product image zoom functionality

**Features**:

- ✅ **Image Gallery**: Multiple images
- ✅ **Zoom**: Click to zoom
- ✅ **Lightbox**: Full-screen lightbox
- ✅ **Thumbnails**: Thumbnail navigation
- ✅ **Touch Support**: Mobile touch gestures

---

## ⭐ Product Reviews Component

### **File**: `components/products/product-reviews.tsx`

**Purpose**: Product reviews display and submission

**Features**:

- ✅ **Reviews List**: Paginated reviews
- ✅ **Rating Filter**: Filter by rating
- ✅ **Review Form**: Submit review form
- ✅ **Verified Badge**: Verified purchase badge
- ✅ **Helpful Votes**: Helpful/not helpful voting

---

## 🔗 Product Recommendations

### **File**: `components/products/product-recommendations.tsx`

**Purpose**: Related/recommended products

**Features**:

- ✅ **Related Products**: Same category products
- ✅ **Recommended**: AI-based recommendations
- ✅ **Recently Viewed**: Recently viewed products
- ✅ **Carousel**: Horizontal scroll carousel

---

## 🪝 Products Hook

### **File**: `hooks/use-products.ts`

**Purpose**: React Query hook for products

**Methods**:

- `useProducts()` - Get products with filters
- `useProduct()` - Get single product
- `useProductBySlug()` - Get product by slug
- `useSearchProducts()` - Search products
- `useFeaturedProducts()` - Get featured products
- `useNewArrivals()` - Get new arrivals
- `useRelatedProducts()` - Get related products

**Usage**:

```typescript
const { data: products, isLoading } = useProducts({
  categoryId: "cat_123",
  page: 1,
  limit: 20,
});
```

---

## 🔧 Products Service

### **File**: `services/products.service.ts`

**Purpose**: Products API service

**Methods**:

- `getProducts()` - Get products list
- `getProduct()` - Get product by ID
- `getProductBySlug()` - Get product by slug
- `searchProducts()` - Search products
- `getFeaturedProducts()` - Get featured
- `getNewArrivals()` - Get new arrivals
- `getRelatedProducts()` - Get related

---

## 📝 Usage Examples

### **Product Detail Page**

```tsx
export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProductBySlug(params.slug);
  
  if (isLoading) return <Loading />;
  if (!product) return <NotFound />;
  
  return <ProductDetail product={product} />;
}
```

### **Shop Page**

```tsx
const { data, isLoading } = useProducts({
  categoryId: searchParams.category,
  minPrice: searchParams.minPrice,
  maxPrice: searchParams.maxPrice,
  page: searchParams.page || 1,
});
```

---

**Last Updated**: January 2025

