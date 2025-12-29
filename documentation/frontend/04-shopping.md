# 🛒 Frontend Shopping Experience

**Complete documentation for cart, checkout, wishlist, and shopping pages, components, hooks, and services.**

---

## 📁 File Structure

```
frontend/src/app/(main)/
├── cart/page.tsx                # Shopping cart page
├── checkout/page.tsx            # Checkout page
├── wishlist/page.tsx            # Wishlist page
└── compare/page.tsx             # Product comparison page

frontend/src/components/
├── checkout/
│   └── address-selector.tsx     # Address selection component
├── cart/
│   └── CartDrawer.tsx           # Cart drawer component
└── wishlist/
    └── wishlist-item.tsx        # Wishlist item component

frontend/src/hooks/
├── use-cart.ts                  # Cart hook
├── use-wishlist.ts              # Wishlist hook
└── use-coupons.ts               # Coupons hook

frontend/src/services/
├── cart.service.ts              # Cart service
├── wishlist.service.ts         # Wishlist service
└── api/cart.ts                  # Cart API
```

---

## 🛒 Cart Page

### **File**: `app/(main)/cart/page.tsx`

**Purpose**: Shopping cart page

**Features**:

- ✅ **Cart Items Display**: List of all cart items
- ✅ **Quantity Updates**: Increase/decrease quantity
- ✅ **Remove Items**: Remove items from cart
- ✅ **Subtotal Calculation**: Automatic subtotal
- ✅ **Coupon Application**: Apply coupon codes
- ✅ **Proceed to Checkout**: Checkout button
- ✅ **Empty State**: Empty cart message
- ✅ **Responsive**: Mobile, tablet, desktop layouts

**Components Used**:

- `CartDrawer` - Cart items list
- `Button`, `Input` - UI components
- `ProductCard` - Product information

---

## 💳 Checkout Page

### **File**: `app/(main)/checkout/page.tsx`

**Purpose**: Order checkout page

**Features**:

- ✅ **Address Selection**: Shipping and billing addresses
- ✅ **Payment Method**: Payment method selection
- ✅ **Order Summary**: Items, subtotal, tax, shipping, total
- ✅ **Coupon Input**: Coupon code input
- ✅ **Order Notes**: Optional order notes
- ✅ **Form Validation**: Comprehensive validation
- ✅ **Payment Integration**: Payment gateway integration
- ✅ **Order Confirmation**: Order success page

**Components Used**:

- `AddressSelector` - Address selection
- `PaymentMethodSelector` - Payment method
- `OrderSummary` - Order details

**Form Fields**:

- `shippingAddressId` - Shipping address (required)
- `billingAddressId` - Billing address (required)
- `paymentMethod` - Payment method (required)
- `couponCode` - Coupon code (optional)
- `notes` - Order notes (optional)

---

## ❤️ Wishlist Page

### **File**: `app/(main)/wishlist/page.tsx`

**Purpose**: User wishlist page

**Features**:

- ✅ **Wishlist Items**: Grid of wishlist products
- ✅ **Add to Cart**: Quick add to cart
- ✅ **Remove from Wishlist**: Remove button
- ✅ **Empty State**: Empty wishlist message
- ✅ **Product Details**: Product cards with info

**Components Used**:

- `WishlistItem` - Wishlist item component
- `ProductCard` - Product display

---

## 🔄 Compare Page

### **File**: `app/(main)/compare/page.tsx`

**Purpose**: Product comparison page

**Features**:

- ✅ **Product Comparison**: Side-by-side comparison
- ✅ **Feature Comparison**: Compare product features
- ✅ **Add/Remove**: Add or remove products
- ✅ **Maximum Limit**: Limit on number of products (usually 3-4)

**Components Used**:

- `CompareButton` - Add to comparison
- `ProductComparisonTable` - Comparison table

---

## 🛒 Cart Drawer Component

### **File**: `components/cart/CartDrawer.tsx`

**Purpose**: Slide-out cart drawer

**Props**:

```typescript
interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Features**:

- ✅ **Slide-out Animation**: Smooth slide animation
- ✅ **Cart Items**: List of cart items
- ✅ **Quantity Controls**: Update quantity
- ✅ **Remove Items**: Remove from cart
- ✅ **Subtotal**: Cart subtotal display
- ✅ **Checkout Button**: Proceed to checkout
- ✅ **Empty State**: Empty cart message

---

## 📍 Address Selector Component

### **File**: `components/checkout/address-selector.tsx`

**Purpose**: Address selection for checkout

**Props**:

```typescript
interface AddressSelectorProps {
  selectedAddressId?: string;
  onSelect: (addressId: string) => void;
  onAddNew: () => void;
  type: "shipping" | "billing";
}
```

**Features**:

- ✅ **Address List**: List of user addresses
- ✅ **Add New**: Add new address button
- ✅ **Edit Address**: Edit existing address
- ✅ **Default Selection**: Auto-select default address
- ✅ **Address Cards**: Visual address cards

---

## ❤️ Wishlist Item Component

### **File**: `components/wishlist/wishlist-item.tsx`

**Purpose**: Wishlist item display

**Props**:

```typescript
interface WishlistItemProps {
  item: WishlistItem;
  onRemove: () => void;
  onAddToCart: () => void;
}
```

**Features**:

- ✅ **Product Image**: Product image display
- ✅ **Product Info**: Name, price, rating
- ✅ **Add to Cart**: Quick add button
- ✅ **Remove**: Remove from wishlist
- ✅ **Product Link**: Link to product page

---

## 🪝 Cart Hook

### **File**: `hooks/use-cart.ts`

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

## ❤️ Wishlist Hook

### **File**: `hooks/use-wishlist.ts`

**Purpose**: React Query hook for wishlist operations

**Methods**:

- `useWishlist()` - Get wishlist query
- `useAddToWishlist()` - Add mutation
- `useRemoveFromWishlist()` - Remove mutation

---

## 🎫 Coupons Hook

### **File**: `hooks/use-coupons.ts`

**Purpose**: React Query hook for coupons

**Methods**:

- `useValidateCoupon()` - Validate coupon mutation
- `useActiveCoupons()` - Get active coupons query

**Usage**:

```typescript
const { mutate: validateCoupon } = useValidateCoupon({
  onSuccess: (coupon) => {
    setAppliedCoupon(coupon);
  },
});
```

---

## 🔧 Cart Service

### **File**: `services/cart.service.ts`

**Purpose**: Cart API service

**Methods**:

- `getCart()` - Get user cart
- `addToCart(variantId, quantity)` - Add item
- `updateCartItem(itemId, quantity)` - Update item
- `removeCartItem(itemId)` - Remove item
- `clearCart()` - Clear cart

---

## 📝 Usage Examples

### **Cart Page**

```tsx
const { data: cart, isLoading } = useCart();
const { mutate: updateItem } = useUpdateCartItem();

<CartDrawer open={isOpen} onOpenChange={setIsOpen}>
  {cart?.items.map((item) => (
    <CartItem
      key={item.id}
      item={item}
      onUpdate={(quantity) => updateItem({ itemId: item.id, quantity })}
      onRemove={() => removeItem(item.id)}
    />
  ))}
</CartDrawer>
```

### **Checkout Page**

```tsx
const { mutate: createOrder, isLoading } = useCreateOrder();

const handleCheckout = () => {
  createOrder({
    shippingAddressId: selectedShipping,
    billingAddressId: selectedBilling,
    paymentMethod: "CREDIT_CARD",
    couponCode: appliedCoupon?.code,
  });
};
```

---

## 🔗 Related Documentation

- [Orders & Payments](../backend/04-orders-payments.md)
- [Cart & Wishlist](../backend/05-cart-wishlist.md)
- [State Management](./08-state-management.md)

---

**Last Updated**: January 2025

