# 🗄️ Frontend State Management

**Complete documentation for Redux, Zustand stores, slices, and state management patterns.**

---

## 📁 File Structure

```
frontend/src/store/
├── index.ts                    # Store configuration
├── auth-store.ts              # Zustand auth store
├── cart-store.ts              # Zustand cart store
├── selectors.ts               # Redux selectors
├── store-utils.ts             # Store utilities
└── slices/
    ├── authSlice.ts           # Auth Redux slice
    ├── cartSlice.ts           # Cart Redux slice
    ├── productsSlice.ts       # Products Redux slice
    ├── categoriesSlice.ts     # Categories Redux slice
    ├── wishlistSlice.ts       # Wishlist Redux slice
    ├── ordersSlice.ts         # Orders Redux slice
    ├── addressesSlice.ts      # Addresses Redux slice
    ├── reviewsSlice.ts        # Reviews Redux slice
    ├── comparisonSlice.ts     # Product comparison slice
    ├── filtersSlice.ts        # Filter state slice
    └── uiSlice.ts             # UI state slice
```

---

## 🔄 Redux Store

### **File**: `store/index.ts`

**Purpose**: Redux store configuration

**Features**:

- ✅ **Redux Toolkit**: Configured with RTK
- ✅ **Redux Persist**: State persistence
- ✅ **DevTools**: Redux DevTools integration
- ✅ **Middleware**: Custom middleware

**Store Structure**:

```typescript
{
  auth: AuthState,
  cart: CartState,
  products: ProductsState,
  categories: CategoriesState,
  wishlist: WishlistState,
  orders: OrdersState,
  addresses: AddressesState,
  reviews: ReviewsState,
  comparison: ComparisonState,
  filters: FiltersState,
  ui: UIState,
}
```

---

## 🔐 Auth Slice

### **File**: `store/slices/authSlice.ts`

**Purpose**: Authentication state management

**State**:

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Actions**:

- `setAuth()` - Set user and tokens
- `clearAuth()` - Clear auth state
- `updateUser()` - Update user data
- `setLoading()` - Set loading state

**Usage**:

```typescript
const dispatch = useAppDispatch();
dispatch(setAuth(user, accessToken, refreshToken));
```

---

## 🛒 Cart Slice

### **File**: `store/slices/cartSlice.ts`

**Purpose**: Shopping cart state management

**State**:

```typescript
interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
}
```

**Actions**:

- `addToCart()` - Add item to cart
- `updateCartItem()` - Update item quantity
- `removeCartItem()` - Remove item
- `clearCart()` - Clear cart
- `setCart()` - Set entire cart

**Usage**:

```typescript
const cart = useAppSelector((state) => state.cart);
dispatch(addToCart({ variantId, quantity }));
```

---

## 📦 Products Slice

### **File**: `store/slices/productsSlice.ts`

**Purpose**: Products state management

**State**:

```typescript
interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  pagination: PaginationState;
  isLoading: boolean;
}
```

**Actions**:

- `setProducts()` - Set products list
- `setCurrentProduct()` - Set current product
- `setFilters()` - Update filters
- `setPagination()` - Update pagination

---

## 📂 Categories Slice

### **File**: `store/slices/categoriesSlice.ts`

**Purpose**: Categories state management

**State**:

```typescript
interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
}
```

**Actions**:

- `setCategories()` - Set categories
- `setCurrentCategory()` - Set current category

---

## ❤️ Wishlist Slice

### **File**: `store/slices/wishlistSlice.ts`

**Purpose**: Wishlist state management

**State**:

```typescript
interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}
```

**Actions**:

- `addToWishlist()` - Add product
- `removeFromWishlist()` - Remove product
- `setWishlist()` - Set entire wishlist

---

## 📦 Orders Slice

### **File**: `store/slices/ordersSlice.ts`

**Purpose**: Orders state management

**State**:

```typescript
interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: PaginationState;
  isLoading: boolean;
}
```

**Actions**:

- `setOrders()` - Set orders list
- `setCurrentOrder()` - Set current order
- `addOrder()` - Add new order
- `updateOrder()` - Update order status

---

## 🏠 Addresses Slice

### **File**: `store/slices/addressesSlice.ts`

**Purpose**: Addresses state management

**State**:

```typescript
interface AddressesState {
  addresses: Address[];
  defaultAddress: Address | null;
  isLoading: boolean;
}
```

**Actions**:

- `setAddresses()` - Set addresses
- `addAddress()` - Add new address
- `updateAddress()` - Update address
- `removeAddress()` - Remove address
- `setDefaultAddress()` - Set default address

---

## ⭐ Reviews Slice

### **File**: `store/slices/reviewsSlice.ts`

**Purpose**: Reviews state management

**State**:

```typescript
interface ReviewsState {
  reviews: Review[];
  currentReview: Review | null;
  pagination: PaginationState;
  isLoading: boolean;
}
```

**Actions**:

- `setReviews()` - Set reviews
- `addReview()` - Add new review
- `updateReview()` - Update review
- `removeReview()` - Remove review

---

## 🔄 Comparison Slice

### **File**: `store/slices/comparisonSlice.ts`

**Purpose**: Product comparison state

**State**:

```typescript
interface ComparisonState {
  products: Product[];
  maxCompare: number; // Usually 3-4
}
```

**Actions**:

- `addToComparison()` - Add product to compare
- `removeFromComparison()` - Remove product
- `clearComparison()` - Clear all

---

## 🔍 Filters Slice

### **File**: `store/slices/filtersSlice.ts`

**Purpose**: Filter state management

**State**:

```typescript
interface FiltersState {
  category: string | null;
  subCategory: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  size: string | null;
  color: string | null;
  sort: string;
}
```

**Actions**:

- `setFilter()` - Set single filter
- `setFilters()` - Set multiple filters
- `clearFilters()` - Clear all filters

---

## 🎨 UI Slice

### **File**: `store/slices/uiSlice.ts`

**Purpose**: UI state management

**State**:

```typescript
interface UIState {
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  modals: {
    [key: string]: boolean;
  };
  notifications: Notification[];
}
```

**Actions**:

- `toggleSidebar()` - Toggle sidebar
- `toggleCartDrawer()` - Toggle cart drawer
- `openModal()` - Open modal
- `closeModal()` - Close modal
- `addNotification()` - Add notification
- `removeNotification()` - Remove notification

---

## 🪝 Zustand Stores

### **Auth Store** (`store/auth-store.ts`)

**Purpose**: Lightweight auth state (Zustand)

**State**:

```typescript
interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user, accessToken, refreshToken) => void;
  clearAuth: () => void;
  updateUser: (user) => void;
}
```

**Usage**:

```typescript
const { user, setAuth } = useAuthStore();
setAuth(user, accessToken, refreshToken);
```

---

### **Cart Store** (`store/cart-store.ts`)

**Purpose**: Lightweight cart state (Zustand)

**State**:

```typescript
interface CartStore {
  items: CartItem[];
  addItem: (item) => void;
  removeItem: (itemId) => void;
  updateItem: (itemId, quantity) => void;
  clearCart: () => void;
}
```

---

## 🎯 Selectors

### **File**: `store/selectors.ts`

**Purpose**: Redux selectors for computed state

**Selectors**:

- `selectIsAuthenticated` - Check if user is authenticated
- `selectCartItemCount` - Get cart item count
- `selectCartSubtotal` - Calculate cart subtotal
- `selectWishlistCount` - Get wishlist count
- `selectUserOrders` - Get user orders
- `selectProductById` - Get product by ID

**Usage**:

```typescript
const isAuthenticated = useAppSelector(selectIsAuthenticated);
const cartCount = useAppSelector(selectCartItemCount);
```

---

## 🔧 Store Utilities

### **File**: `store/store-utils.ts`

**Purpose**: Store utility functions

**Functions**:

- `createAppAsyncThunk()` - Create async thunk
- `createSliceWithLoading()` - Create slice with loading state
- `persistState()` - Persist state configuration

---

## 📝 Usage Patterns

### **Redux Pattern**

```typescript
// Dispatch action
const dispatch = useAppDispatch();
dispatch(addToCart({ variantId, quantity }));

// Select state
const cart = useAppSelector((state) => state.cart);
```

### **Zustand Pattern**

```typescript
// Use store
const { user, setAuth } = useAuthStore();
setAuth(user, accessToken, refreshToken);
```

### **React Query Pattern**

```typescript
// Server state (React Query)
const { data: products } = useProducts();

// Client state (Redux/Zustand)
const cart = useAppSelector((state) => state.cart);
```

---

## 🔗 Related Documentation

- [Services & Hooks](./09-services-hooks.md)
- [Components](./07-components.md)
- [Core Application](./01-core-application.md)

---

**Last Updated**: January 2025

