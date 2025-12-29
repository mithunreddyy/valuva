# 🔧 Frontend Services & Hooks

**Complete documentation for all API services, React hooks, and data fetching patterns.**

---

## 📁 File Structure

```
frontend/src/services/
├── api/                        # API service files (20+ files)
│   ├── auth.ts                # Auth API
│   ├── products.ts            # Products API
│   ├── cart.ts                # Cart API
│   ├── orders.ts              # Orders API
│   ├── wishlist.ts            # Wishlist API
│   ├── reviews.ts             # Reviews API
│   ├── users.ts               # Users API
│   ├── addresses.ts           # Addresses API
│   ├── coupons.ts             # Coupons API
│   ├── categories.ts          # Categories API
│   ├── homepage.ts            # Homepage API
│   ├── admin.ts               # Admin API
│   ├── admin-mfa.ts           # Admin MFA API
│   └── ...                    # More API files
├── auth.service.ts            # Auth service
├── cart.service.ts            # Cart service
├── products.service.ts        # Products service
├── orders.service.ts          # Orders service
├── wishlist.service.ts       # Wishlist service
├── categories.service.ts      # Categories service
└── coupons.service.ts         # Coupons service

frontend/src/hooks/
├── use-auth.ts                # Auth hook
├── use-cart.ts                # Cart hook
├── use-products.ts            # Products hook
├── use-orders.ts              # Orders hook
├── use-wishlist.ts            # Wishlist hook
├── use-categories.ts          # Categories hook
├── use-coupons.ts             # Coupons hook
├── use-reviews.ts             # Reviews hook
├── use-users.ts               # Users hook
├── use-addresses.ts           # Addresses hook
├── use-admin.ts               # Admin hook
├── use-analytics.ts           # Analytics hook
├── use-homepage.ts            # Homepage hook
├── use-recommendations.ts     # Recommendations hook
├── use-tracking.ts            # Order tracking hook
├── use-oauth.ts               # OAuth hook
├── use-toast.ts               # Toast hook
└── use-cookies.ts             # Cookies hook
```

---

## 🔐 Auth Service & Hook

### **Service**: `services/auth.service.ts`

**Methods**:

- `login(email, password)` - User login
- `register(data)` - User registration
- `logout()` - User logout
- `refreshToken(refreshToken)` - Refresh access token
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password
- `verifyEmail(token)` - Verify email

### **Hook**: `hooks/use-auth.ts`

**Purpose**: React Query hook for authentication

**Methods**:

- `useLogin()` - Login mutation
- `useRegister()` - Registration mutation
- `useLogout()` - Logout mutation
- `useRefreshToken()` - Token refresh mutation
- `useForgotPassword()` - Forgot password mutation
- `useResetPassword()` - Reset password mutation
- `useVerifyEmail()` - Email verification mutation

**Usage**:

```typescript
const { mutate: login, isLoading } = useLogin({
  onSuccess: (data) => {
    setAuth(data.user, data.accessToken, data.refreshToken);
    router.push("/dashboard");
  },
});
```

---

## 🛒 Cart Service & Hook

### **Service**: `services/cart.service.ts`

**Methods**:

- `getCart()` - Get user cart
- `addToCart(variantId, quantity)` - Add item
- `updateCartItem(itemId, quantity)` - Update item
- `removeCartItem(itemId)` - Remove item
- `clearCart()` - Clear cart

### **Hook**: `hooks/use-cart.ts`

**Purpose**: React Query hook for cart operations

**Methods**:

- `useCart()` - Get cart query
- `useAddToCart()` - Add to cart mutation
- `useUpdateCartItem()` - Update item mutation
- `useRemoveCartItem()` - Remove item mutation
- `useClearCart()` - Clear cart mutation

**Usage**:

```typescript
const { data: cart, isLoading } = useCart();
const { mutate: addToCart } = useAddToCart();
```

---

## 📦 Products Service & Hook

### **Service**: `services/products.service.ts`

**Methods**:

- `getProducts(filters, page, limit)` - Get products
- `getProduct(id)` - Get product by ID
- `getProductBySlug(slug)` - Get product by slug
- `searchProducts(query, limit)` - Search products
- `getFeaturedProducts(limit)` - Get featured
- `getNewArrivals(limit)` - Get new arrivals
- `getRelatedProducts(productId)` - Get related

### **Hook**: `hooks/use-products.ts`

**Purpose**: React Query hook for products

**Methods**:

- `useProducts(filters, page, limit)` - Products query
- `useProduct(id)` - Single product query
- `useProductBySlug(slug)` - Product by slug query
- `useSearchProducts(query, limit)` - Search query
- `useFeaturedProducts(limit)` - Featured query
- `useNewArrivals(limit)` - New arrivals query
- `useRelatedProducts(productId)` - Related products query

**Usage**:

```typescript
const { data: products, isLoading } = useProducts({
  categoryId: "cat_123",
  page: 1,
  limit: 20,
});
```

---

## 📦 Orders Service & Hook

### **Service**: `services/orders.service.ts`

**Methods**:

- `getOrders(page, limit)` - Get user orders
- `getOrder(id)` - Get order by ID
- `createOrder(data)` - Create order
- `cancelOrder(id, reason)` - Cancel order

### **Hook**: `hooks/use-orders.ts`

**Purpose**: React Query hook for orders

**Methods**:

- `useOrders(page, limit)` - Orders query
- `useOrder(id)` - Single order query
- `useCreateOrder()` - Create order mutation
- `useCancelOrder()` - Cancel order mutation

---

## ❤️ Wishlist Service & Hook

### **Service**: `services/wishlist.service.ts`

**Methods**:

- `getWishlist()` - Get wishlist
- `addToWishlist(productId)` - Add product
- `removeFromWishlist(productId)` - Remove product

### **Hook**: `hooks/use-wishlist.ts`

**Purpose**: React Query hook for wishlist

**Methods**:

- `useWishlist()` - Wishlist query
- `useAddToWishlist()` - Add mutation
- `useRemoveFromWishlist()` - Remove mutation

---

## ⭐ Reviews Service & Hook

### **Service**: `services/api/reviews.ts`

**Methods**:

- `getProductReviews(productId, page, limit, rating?)` - Get reviews
- `createReview(data)` - Create review
- `updateReview(id, data)` - Update review
- `deleteReview(id)` - Delete review

### **Hook**: `hooks/use-reviews.ts`

**Purpose**: React Query hook for reviews

**Methods**:

- `useProductReviews(productId, page, limit, rating?)` - Reviews query
- `useCreateReview()` - Create mutation
- `useUpdateReview()` - Update mutation
- `useDeleteReview()` - Delete mutation

---

## 👤 Users Service & Hook

### **Service**: `services/api/users.ts`

**Methods**:

- `getProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `changePassword(data)` - Change password
- `getUserStats()` - Get user statistics

### **Hook**: `hooks/use-users.ts`

**Purpose**: React Query hook for users

**Methods**:

- `useProfile()` - Profile query
- `useUpdateProfile()` - Update mutation
- `useChangePassword()` - Change password mutation
- `useUserStats()` - Stats query

---

## 📍 Addresses Service & Hook

### **Service**: `services/api/addresses.ts`

**Methods**:

- `getAddresses()` - Get addresses
- `createAddress(data)` - Create address
- `updateAddress(id, data)` - Update address
- `deleteAddress(id)` - Delete address
- `setDefaultAddress(id)` - Set default

### **Hook**: `hooks/use-addresses.ts`

**Purpose**: React Query hook for addresses

**Methods**:

- `useAddresses()` - Addresses query
- `useCreateAddress()` - Create mutation
- `useUpdateAddress()` - Update mutation
- `useDeleteAddress()` - Delete mutation
- `useSetDefaultAddress()` - Set default mutation

---

## 👑 Admin Service & Hook

### **Service**: `services/api/admin.ts`

**Methods**:

- `adminLogin(email, password, mfaToken?)` - Admin login
- `getDashboardStats()` - Dashboard stats
- `getOrders(page, limit)` - Get orders
- `updateOrderStatus(id, status)` - Update order
- `getUsers(page, limit)` - Get users
- `updateUserStatus(id, isActive)` - Update user status

### **Hook**: `hooks/use-admin.ts`

**Purpose**: React Query hook for admin operations

**Methods**:

- `useAdminLogin()` - Admin login mutation
- `useDashboardStats()` - Dashboard stats query
- `useAdminOrders()` - Orders query
- `useUpdateOrderStatus()` - Update order mutation

---

## 🔐 Admin MFA Service & Hook

### **Service**: `services/api/admin-mfa.ts`

**Methods**:

- `setupMFA()` - Setup MFA
- `verifyMFA(token, secret, backupCodes)` - Verify and enable
- `disableMFA(password)` - Disable MFA
- `regenerateBackupCodes(password)` - Regenerate codes

---

## 📊 Analytics Hook

### **Hook**: `hooks/use-analytics.ts`

**Purpose**: Analytics tracking hook

**Methods**:

- `trackEvent(eventType, properties)` - Track event
- `trackPageView(page)` - Track page view
- `trackProductView(productId)` - Track product view
- `trackAddToCart(productId, variantId)` - Track add to cart
- `trackPurchase(orderId, total)` - Track purchase

**Usage**:

```typescript
const { trackEvent } = useAnalytics();
trackEvent("PURCHASE", { orderId, total });
```

---

## 🏠 Homepage Hook

### **Hook**: `hooks/use-homepage.ts`

**Purpose**: Homepage data hook

**Methods**:

- `useHomepageSections()` - Get sections
- `useFeaturedProducts()` - Get featured
- `useNewArrivals()` - Get new arrivals
- `useBestSellers()` - Get best sellers

---

## 🎯 Recommendations Hook

### **Hook**: `hooks/use-recommendations.ts`

**Purpose**: Product recommendations hook

**Methods**:

- `useRecommendations(productId)` - Get recommendations
- `usePersonalizedRecommendations()` - Get personalized
- `useRecentlyViewed()` - Get recently viewed

---

## 📦 Tracking Hook

### **Hook**: `hooks/use-tracking.ts`

**Purpose**: Order tracking hook

**Methods**:

- `useOrderTracking(orderNumber)` - Get tracking
- `useTrackingUpdates(orderId)` - Get updates

---

## 🍪 Toast Hook

### **Hook**: `hooks/use-toast.ts`

**Purpose**: Toast notification hook

**Usage**:

```typescript
import { toast } from "@/hooks/use-toast";

toast({
  title: "Success",
  description: "Product added to cart",
  variant: "default",
});
```

---

## 🍪 Cookies Hook

### **Hook**: `hooks/use-cookies.ts`

**Purpose**: Cookie management hook

**Methods**:

- `getCookie(name)` - Get cookie
- `setCookie(name, value, options)` - Set cookie
- `removeCookie(name)` - Remove cookie
- `hasCookie(name)` - Check if cookie exists

---

## 📝 API Service Pattern

### **Standard API Service** (`services/api/*.ts`)

**Structure**:

```typescript
export const productsApi = {
  getProducts: (filters, page, limit) =>
    apiClient.get("/products", { params: { ...filters, page, limit } }),
  
  getProduct: (id) =>
    apiClient.get(`/products/${id}`),
  
  // More methods...
};
```

---

## 🪝 React Query Hook Pattern

### **Standard Hook** (`hooks/use-*.ts`)

**Structure**:

```typescript
export function useProducts(filters, page, limit) {
  return useQuery({
    queryKey: ["products", filters, page, limit],
    queryFn: () => productsApi.getProducts(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
}
```

---

## 🔄 Data Fetching Patterns

### **Query Pattern**

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["key", params],
  queryFn: () => api.getData(params),
});
```

### **Mutation Pattern**

```typescript
const { mutate, isLoading } = useMutation({
  mutationFn: api.createData,
  onSuccess: () => {
    queryClient.invalidateQueries(["data"]);
  },
});
```

### **Optimistic Updates**

```typescript
const { mutate } = useMutation({
  mutationFn: api.updateData,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(["data"]);
    const previous = queryClient.getQueryData(["data"]);
    queryClient.setQueryData(["data"], newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(["data"], context.previous);
  },
});
```

---

## 📝 Usage Examples

### **Products with Filters**

```typescript
const { data: products, isLoading } = useProducts(
  { categoryId: "cat_123", minPrice: 100 },
  1,
  20
);
```

### **Add to Cart**

```typescript
const { mutate: addToCart, isLoading } = useAddToCart({
  onSuccess: () => {
    toast.success("Added to cart");
    queryClient.invalidateQueries(["cart"]);
  },
});

addToCart({ variantId: "var_123", quantity: 2 });
```

### **Create Order**

```typescript
const { mutate: createOrder, isLoading } = useCreateOrder({
  onSuccess: (order) => {
    router.push(`/orders/${order.id}`);
    toast.success("Order placed successfully");
  },
});

createOrder({
  shippingAddressId: "addr_123",
  billingAddressId: "addr_123",
  paymentMethod: "CREDIT_CARD",
});
```

---

## 🔗 Related Documentation

- [State Management](./08-state-management.md)
- [Components](./07-components.md)
- [API Documentation](../api/01-api-overview.md)

---

**Last Updated**: January 2025

