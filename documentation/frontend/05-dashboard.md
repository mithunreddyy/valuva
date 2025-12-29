# 👤 Frontend User Dashboard

**Complete documentation for user dashboard pages, components, hooks, and services.**

---

## 📁 File Structure

```
frontend/src/app/(user)/dashboard/
├── page.tsx                    # Dashboard home
├── layout.tsx                  # Dashboard layout
├── orders/page.tsx             # Orders list page
├── orders/[id]/page.tsx        # Order details page
├── addresses/page.tsx          # Addresses management page
└── returns/page.tsx            # Returns page

frontend/src/components/orders/
├── order-card.tsx              # Order summary card
└── order-tracking.tsx          # Order tracking component

frontend/src/hooks/
├── use-orders.ts               # Orders hook
├── use-addresses.ts            # Addresses hook
└── use-users.ts                # Users hook

frontend/src/services/
├── orders.service.ts           # Orders service
├── addresses.service.ts        # Addresses service
└── api/orders.ts               # Orders API
```

---

## 🏠 Dashboard Home

### **File**: `app/(user)/dashboard/page.tsx`

**Purpose**: User dashboard homepage

**Features**:

- ✅ **User Stats**: Order count, total spent, wishlist count
- ✅ **Recent Orders**: Last 5 orders
- ✅ **Quick Actions**: Links to orders, addresses, returns
- ✅ **Account Summary**: User profile summary
- ✅ **Welcome Message**: Personalized welcome

**Components Used**:

- `OrderCard` - Recent orders
- `StatsCard` - Statistics display
- `QuickActions` - Action buttons

---

## 📦 Orders List Page

### **File**: `app/(user)/dashboard/orders/page.tsx`

**Purpose**: User orders listing page

**Features**:

- ✅ **Orders List**: Paginated orders list
- ✅ **Order Cards**: Order summary cards
- ✅ **Status Filter**: Filter by order status
- ✅ **Date Filter**: Filter by date range
- ✅ **Order Details Link**: Link to order details
- ✅ **Cancel Order**: Cancel pending orders

**Components Used**:

- `OrderCard` - Order display
- `Pagination` - Page navigation
- `Filter` - Status and date filters

---

## 📄 Order Details Page

### **File**: `app/(user)/dashboard/orders/[id]/page.tsx`

**Purpose**: Individual order details page

**Features**:

- ✅ **Order Information**: Order number, date, status
- ✅ **Order Items**: List of ordered items
- ✅ **Shipping Address**: Delivery address
- ✅ **Billing Address**: Billing address
- ✅ **Payment Information**: Payment method and status
- ✅ **Order Tracking**: Tracking timeline
- ✅ **Cancel Order**: Cancel button (if applicable)
- ✅ **Reorder**: Reorder button

**Components Used**:

- `OrderTracking` - Tracking timeline
- `OrderItems` - Items list
- `AddressCard` - Address display

---

## 📍 Addresses Page

### **File**: `app/(user)/dashboard/addresses/page.tsx`

**Purpose**: Address management page

**Features**:

- ✅ **Address List**: List of user addresses
- ✅ **Add Address**: Add new address form
- ✅ **Edit Address**: Edit existing address
- ✅ **Delete Address**: Remove address
- ✅ **Set Default**: Set default address
- ✅ **Address Cards**: Visual address cards

**Components Used**:

- `AddressCard` - Address display
- `AddressForm` - Add/edit form
- `Modal` - Address form modal

---

## 🔄 Returns Page

### **File**: `app/(user)/dashboard/returns/page.tsx`

**Purpose**: Return requests page

**Features**:

- ✅ **Returns List**: List of return requests
- ✅ **Create Return**: Create new return request
- ✅ **Return Status**: Status tracking
- ✅ **Return Details**: Return information
- ✅ **Item Selection**: Select items to return

**Components Used**:

- `ReturnCard` - Return display
- `ReturnForm` - Create return form

---

## 📦 Order Card Component

### **File**: `components/orders/order-card.tsx`

**Purpose**: Order summary card component

**Props**:

```typescript
interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
  onCancel?: () => void;
}
```

**Features**:

- ✅ **Order Number**: Display order number
- ✅ **Order Date**: Order date display
- ✅ **Status Badge**: Status with color coding
- ✅ **Item Count**: Number of items
- ✅ **Total**: Order total
- ✅ **Quick Actions**: View details, cancel buttons

---

## 📦 Order Tracking Component

### **File**: `components/orders/order-tracking.tsx`

**Purpose**: Order tracking timeline component

**Props**:

```typescript
interface OrderTrackingProps {
  orderId: string;
  orderNumber: string;
}
```

**Features**:

- ✅ **Timeline**: Visual tracking timeline
- ✅ **Status Updates**: All tracking updates
- ✅ **Location**: Current location display
- ✅ **Estimated Delivery**: Delivery date
- ✅ **Status Icons**: Visual status indicators

---

## 🪝 Orders Hook

### **File**: `hooks/use-orders.ts`

**Purpose**: React Query hook for orders

**Methods**:

- `useOrders(page, limit)` - Get orders query
- `useOrder(id)` - Get single order query
- `useCreateOrder()` - Create order mutation
- `useCancelOrder()` - Cancel order mutation

**Usage**:

```typescript
const { data: orders, isLoading } = useOrders(1, 20);
const { mutate: cancelOrder } = useCancelOrder();
```

---

## 📍 Addresses Hook

### **File**: `hooks/use-addresses.ts`

**Purpose**: React Query hook for addresses

**Methods**:

- `useAddresses()` - Get addresses query
- `useCreateAddress()` - Create address mutation
- `useUpdateAddress()` - Update address mutation
- `useDeleteAddress()` - Delete address mutation
- `useSetDefaultAddress()` - Set default mutation

---

## 👤 Users Hook

### **File**: `hooks/use-users.ts`

**Purpose**: React Query hook for user operations

**Methods**:

- `useProfile()` - Get profile query
- `useUpdateProfile()` - Update profile mutation
- `useChangePassword()` - Change password mutation
- `useUserStats()` - Get user stats query

---

## 🔧 Orders Service

### **File**: `services/orders.service.ts`

**Purpose**: Orders API service

**Methods**:

- `getOrders(page, limit)` - Get orders
- `getOrder(id)` - Get order by ID
- `createOrder(data)` - Create order
- `cancelOrder(id, reason)` - Cancel order

---

## 📝 Usage Examples

### **Dashboard Home**

```tsx
const { data: stats } = useUserStats();
const { data: recentOrders } = useOrders(1, 5);

<DashboardLayout>
  <StatsCard stats={stats} />
  <RecentOrders orders={recentOrders} />
</DashboardLayout>
```

### **Order Details**

```tsx
const { data: order, isLoading } = useOrder(orderId);
const { mutate: cancelOrder } = useCancelOrder();

<OrderDetails order={order}>
  <OrderTracking orderId={order.id} orderNumber={order.orderNumber} />
  {order.status === "PENDING" && (
    <Button onClick={() => cancelOrder(order.id)}>Cancel Order</Button>
  )}
</OrderDetails>
```

---

## 🔗 Related Documentation

- [Orders & Payments](../backend/04-orders-payments.md)
- [Users](../backend/07-users.md)
- [State Management](./08-state-management.md)

---

**Last Updated**: January 2025

