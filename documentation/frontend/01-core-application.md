# 🎨 Frontend Core Application

**Complete documentation for Next.js application setup, layouts, routing, and core configuration files.**

---

## 📁 File Structure

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── loading.tsx             # Loading component
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── robots.ts               # SEO robots.txt
│   └── sitemap.ts              # SEO sitemap
├── lib/
│   ├── api-client.ts           # API client setup
│   ├── axios.ts                # Axios configuration
│   ├── react-query.tsx         # React Query provider
│   ├── redux-provider.tsx      # Redux provider
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript types
```

---

## 🏗️ Root Layout

### **File**: `app/layout.tsx`

**Purpose**: Root layout component that wraps all pages

**Features**:

- ✅ **Font Loading**: Pothana2000 and Noto Sans Telugu fonts
- ✅ **Metadata**: SEO metadata configuration
- ✅ **Providers**: React Query, Redux, Toast providers
- ✅ **Error Boundary**: Global error handling
- ✅ **Analytics**: Analytics initialization
- ✅ **PWA**: Progressive Web App setup

**Structure**:

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

---

## 🏠 Homepage

### **File**: `app/page.tsx`

**Purpose**: Main homepage component

**Features**:

- ✅ **Hero Section**: Main banner with CTA
- ✅ **Featured Products**: Featured product showcase
- ✅ **Category Showcase**: Category grid
- ✅ **New Arrivals**: Latest products
- ✅ **SEO**: Optimized metadata

**Components Used**:

- `HeroSection`
- `FeaturedProducts`
- `CategoryShowcase`
- `NewArrivals`

---

## 🎨 Global Styles

### **File**: `app/globals.css`

**Purpose**: Global CSS styles and Tailwind configuration

**Features**:

- ✅ **Tailwind CSS**: Utility-first CSS framework
- ✅ **Custom Variables**: CSS custom properties
- ✅ **Typography**: Font configurations
- ✅ **Animations**: Keyframe animations
- ✅ **Responsive**: Mobile-first responsive design

---

## ⚙️ API Client

### **File**: `lib/api-client.ts`

**Purpose**: Centralized API client configuration

**Features**:

- ✅ **Base URL**: Environment-based API URL
- ✅ **Interceptors**: Request/response interceptors
- ✅ **Error Handling**: Centralized error handling
- ✅ **Token Management**: Automatic token injection
- ✅ **Refresh Logic**: Automatic token refresh

**Usage**:

```typescript
import { apiClient } from "@/lib/api-client";

const response = await apiClient.get("/products");
```

---

## 🔄 React Query Setup

### **File**: `lib/react-query.tsx`

**Purpose**: React Query provider configuration for data fetching and caching

**Features**:

- ✅ **Query Client**: Singleton QueryClient instance
- ✅ **Default Options**: Configured default query/mutation options
- ✅ **Stale Time**: 1 minute stale time for queries
- ✅ **Refetch Behavior**: Disabled refetch on window focus
- ✅ **Retry Logic**: 1 retry attempt on failure
- ✅ **DevTools**: React Query DevTools in development

**Configuration**:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**Component**: `ReactQueryProvider`

**Props**:

- `children: React.ReactNode` - Child components

**Usage**:

```tsx
import { ReactQueryProvider } from "@/lib/react-query";

<ReactQueryProvider>{children}</ReactQueryProvider>;
```

**Features**:

- Prevents unnecessary refetches
- Optimizes network requests
- Provides caching for better performance
- DevTools for debugging queries

---

## 🗄️ Redux Store

### **File**: `lib/redux-provider.tsx`

**Purpose**: Redux store provider for global state management

**Features**:

- ✅ **Store Provider**: React-Redux Provider wrapper
- ✅ **Store Import**: Uses centralized store from `@/store`
- ✅ **Type Safety**: Full TypeScript support

**Component**: `ReduxProvider`

**Props**:

- `children: React.ReactNode` - Child components

**Usage**:

```tsx
import { ReduxProvider } from "@/lib/redux-provider";

<ReduxProvider>{children}</ReduxProvider>;
```

**Store Structure**:

- Auth state (user, tokens)
- Cart state (items, totals)
- UI state (modals, drawers)
- Products state (filters, comparison)
- And more (see state management docs)

---

## 🔀 Next.js Proxy

### **File**: `proxy.ts`

**Purpose**: Next.js middleware proxy for route protection and authentication redirects

**Features**:

- ✅ **Route Protection**: Protects authenticated routes
- ✅ **Auth Redirects**: Redirects authenticated users from auth pages
- ✅ **Token Validation**: Checks access token from cookies
- ✅ **Redirect Handling**: Preserves redirect URLs for login

**Function**: `proxy(request: NextRequest)`

**Parameters**:

- `request: NextRequest` - Next.js request object

**Returns**: `NextResponse` - Response with redirects or pass-through

**Logic**:

1. **Auth Pages** (`/login`, `/register`, `/forgot-password`, etc.):

   - If user has token → Redirect to `/dashboard`
   - If no token → Allow access

2. **Protected Pages** (`/dashboard`, `/admin`, `/checkout`):

   - If user has token → Allow access
   - If no token → Redirect to `/login` with redirect parameter

3. **Public Pages**: Pass through without modification

**Configuration**:

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
```

**Usage**:

The proxy is automatically used by Next.js middleware. No manual import needed.

**Note**: This proxy handles route protection. API calls are made directly via axios, not through this proxy.

---

## 📘 TypeScript Types

### **File**: `types/index.ts`

**Purpose**: Centralized TypeScript type definitions for the entire frontend application

**Features**:

- ✅ **Enums**: User roles, order statuses, payment methods
- ✅ **Interfaces**: All data models (User, Product, Order, etc.)
- ✅ **Type Safety**: Full type coverage for API responses
- ✅ **Reusability**: Shared types across components

### **Enums**

#### **UserRole**

```typescript
enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
```

#### **OrderStatus**

```typescript
enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}
```

#### **PaymentMethod**

```typescript
enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  COD = "COD",
}
```

#### **PaymentStatus**

```typescript
enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
```

### **Interfaces**

#### **User**

- `id`, `email`, `firstName`, `lastName`, `phone?`
- `isEmailVerified`, `isActive`, `role`
- `createdAt`, `updatedAt`

#### **Product**

- `id`, `name`, `slug`, `description`
- `basePrice`, `compareAtPrice`, `sku`
- `images: ProductImage[]`, `variants: ProductVariant[]`
- `category`, `subCategory`
- `averageRating?`, `reviewCount?`

#### **Cart & CartItem**

- `Cart`: `id`, `items: CartItem[]`, `subtotal`, `itemCount`
- `CartItem`: `id`, `variantId`, `quantity`, `price`, `subtotal`
- Includes product and variant information

#### **Order & OrderItem**

- `Order`: `id`, `orderNumber`, `status`, `total`
- `items: OrderItem[]`, `shippingAddress`, `billingAddress`
- `payment?`, `user?`

#### **Address**

- `id`, `fullName`, `phone`
- `addressLine1`, `addressLine2?`, `city`, `state`, `postalCode`, `country`
- `isDefault`

#### **Review**

- `id`, `productId`, `userId`, `rating`, `title?`, `comment`
- `isVerified`, `isApproved`
- `user?`, `product?`

#### **WishlistItem**

- `id`, `productId`, `name`, `slug`
- `basePrice`, `compareAtPrice?`, `image`
- `averageRating`, `reviewCount`, `addedAt`

#### **Coupon**

- `id`, `code`, `description?`
- `discountType`, `discountValue`
- `minPurchase?`, `maxDiscount?`
- `usageLimit?`, `usageCount`
- `isActive`, `startsAt`, `expiresAt`

#### **HomepageSection**

- `id`, `type`, `title`, `subtitle?`
- `isActive`, `sortOrder`
- `config: Record<string, unknown>`

### **Response Types**

#### **PaginatedResponse<T>**

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### **ApiResponse<T>**

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

**Usage**:

```typescript
import { User, Product, Order, Cart } from "@/types";

const user: User = { ... };
const products: Product[] = [ ... ];
const order: Order = { ... };
```

**Benefits**:

- Type safety across the application
- IntelliSense support in IDE
- Compile-time error checking
- Self-documenting code

---

## 🛠️ Utilities

### **File**: `lib/utils.ts`

**Purpose**: Utility functions

**Functions**:

- `cn()` - Class name merger (clsx + tailwind-merge)
- `formatPrice()` - Price formatter
- `formatDate()` - Date formatter
- `slugify()` - URL slug generator
- `truncate()` - Text truncation

---

## 📱 Error Handling

### **File**: `app/error.tsx`

**Purpose**: Global error boundary

**Features**:

- ✅ **Error Display**: User-friendly error messages
- ✅ **Error Logging**: Error reporting
- ✅ **Retry Logic**: Error recovery

---

## 🔍 SEO

### **File**: `app/robots.ts`

**Purpose**: Dynamic robots.txt generation

**Features**:

- ✅ **Allow/Disallow**: Route-based robot rules
- ✅ **Sitemap URL**: Sitemap reference

---

### **File**: `app/sitemap.ts`

**Purpose**: Dynamic sitemap generation

**Features**:

- ✅ **Product Pages**: All product URLs
- ✅ **Category Pages**: All category URLs
- ✅ **Static Pages**: Static page URLs
- ✅ **Priority & Frequency**: SEO optimization

---

## 🎯 Route Groups

### **`(main)`** - Public Routes

- Homepage, products, categories, shop
- Cart, checkout, wishlist
- About, contact, FAQ, policies

### **`(auth)`** - Authentication Routes

- Login, register
- Forgot password, reset password
- Email verification
- Admin login
- OAuth callback

### **`(user)`** - User Dashboard

- Dashboard home
- Orders, order details
- Addresses
- Returns

### **`(admin)`** - Admin Panel

- Admin dashboard
- Products, categories, coupons
- Orders, customers, reviews
- Analytics, homepage management
- Security (MFA)

---

## 🔧 Configuration Files

### **`next.config.ts`**

**Purpose**: Next.js configuration

**Features**:

- ✅ **Image Optimization**: Next.js Image optimization
- ✅ **Environment Variables**: Public env vars
- ✅ **Rewrites**: API proxy configuration
- ✅ **Headers**: Security headers

---

### **`tailwind.config.ts`**

**Purpose**: Tailwind CSS configuration

**Features**:

- ✅ **Theme**: Custom colors, fonts, spacing
- ✅ **Plugins**: Tailwind plugins
- ✅ **Content**: File paths for purging

---

### **`tsconfig.json`**

**Purpose**: TypeScript configuration

**Features**:

- ✅ **Paths**: Path aliases (@/ for src/)
- ✅ **Strict Mode**: TypeScript strict mode
- ✅ **JSX**: React JSX configuration

---

## 📦 Dependencies

### **Core**

- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM

### **State Management**

- `@reduxjs/toolkit` - Redux Toolkit
- `react-redux` - React Redux bindings
- `zustand` - Lightweight state management

### **Data Fetching**

- `@tanstack/react-query` - React Query
- `axios` - HTTP client

### **UI Components**

- `@radix-ui/*` - Headless UI components
- `tailwindcss` - Utility-first CSS
- `framer-motion` - Animations

### **Forms**

- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation

---

## 🚀 Development

### **Start Development Server**

```bash
npm run dev
```

### **Build for Production**

```bash
npm run build
```

### **Start Production Server**

```bash
npm start
```

---

## 🔗 Related Documentation

- [Authentication Pages](./02-authentication.md)
- [Product Pages](./03-products.md)
- [Components](./07-components.md)
- [State Management](./08-state-management.md)

---

**Last Updated**: January 2025
