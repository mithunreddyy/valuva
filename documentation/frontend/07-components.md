# 🧩 Frontend Components

**Complete documentation for all reusable UI components, their props, usage, and features.**

---

## 📁 Component Structure

```
frontend/src/components/
├── ui/                        # Base UI components (20+ files)
├── products/                  # Product components (10+ files)
├── admin/                     # Admin components (6 files)
├── layout/                    # Layout components (4 files)
├── auth/                      # Auth components (2 files)
├── home/                      # Homepage components (4 files)
├── orders/                    # Order components (2 files)
├── checkout/                  # Checkout components (1 file)
└── wishlist/                  # Wishlist components (1 file)
```

---

## 🎨 UI Components

### **Base Components** (`components/ui/`)

#### **Button** (`button.tsx`)

**Purpose**: Reusable button component

**Props**:

```typescript
interface ButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
```

**Usage**:

```tsx
<Button variant="default" size="lg" isLoading={isSubmitting}>
  Submit
</Button>
```

---

#### **Input** (`input.tsx`)

**Purpose**: Text input component

**Props**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

**Usage**:

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  helperText="Enter your email address"
/>
```

---

#### **Password Input** (`password-input.tsx`)

**Purpose**: Password input with show/hide toggle

**Props**:

```typescript
interface PasswordInputProps extends InputProps {
  showToggle?: boolean;
}
```

**Features**:

- ✅ Show/hide password toggle
- ✅ Strength indicator
- ✅ Validation feedback

---

#### **Select** (`select.tsx`)

**Purpose**: Dropdown select component

**Props**:

```typescript
interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}
```

---

#### **Card** (`card.tsx`)

**Purpose**: Card container component

**Props**:

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}
```

---

#### **Dialog** (`dialog.tsx`)

**Purpose**: Modal dialog component

**Props**:

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}
```

---

#### **Toast** (`toast.tsx`)

**Purpose**: Toast notification component

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

#### **Pagination** (`pagination.tsx`)

**Purpose**: Pagination component

**Props**:

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

---

#### **Skeleton** (`skeleton.tsx`)

**Purpose**: Loading skeleton component

**Usage**:

```tsx
<Skeleton className="h-4 w-32" />
```

---

#### **Badge** (`badge.tsx`)

**Purpose**: Badge component

**Props**:

```typescript
interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
}
```

---

#### **Alert** (`alert.tsx`)

**Purpose**: Alert message component

**Props**:

```typescript
interface AlertProps {
  variant?: "default" | "destructive" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
}
```

---

#### **Tabs** (`tabs.tsx`)

**Purpose**: Tab navigation component

**Usage**:

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content</TabsContent>
</Tabs>
```

---

#### **Dropdown Menu** (`dropdown-menu.tsx`)

**Purpose**: Dropdown menu component

**Usage**:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

#### **Empty State** (`empty-state.tsx`)

**Purpose**: Empty state component

**Props**:

```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
```

---

#### **Loading Spinner** (`loading-spinner.tsx`)

**Purpose**: Loading spinner component

**Props**:

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

---

## 🛍️ Product Components

### **Product Card** (`components/products/ProductCard.tsx`)

**Purpose**: Product card display

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

- ✅ Product image with hover zoom
- ✅ Product name and price
- ✅ Rating display
- ✅ Quick actions (wishlist, compare)
- ✅ Add to cart button
- ✅ Responsive design

---

### **Product Grid** (`components/products/product-grid.tsx`)

**Purpose**: Product grid layout

**Props**:

```typescript
interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}
```

---

### **Product Detail** (`components/products/product-detail.tsx`)

**Purpose**: Product detail display

**Features**:

- ✅ Product information
- ✅ Variant selection
- ✅ Quantity selector
- ✅ Add to cart
- ✅ Stock status

---

## 👑 Admin Components

### **Product Form** (`components/admin/product-form.tsx`)

**Purpose**: Product creation/editing form

**Features**:

- ✅ Product details form
- ✅ Variant management
- ✅ Image upload
- ✅ Category selection
- ✅ Form validation

---

### **Category Form Modal** (`components/admin/category-form-modal.tsx`)

**Purpose**: Category creation/editing modal

**Features**:

- ✅ Category name and description
- ✅ Image upload
- ✅ Sort order
- ✅ Active status toggle

---

### **Image Upload** (`components/admin/image-upload.tsx`)

**Purpose**: Image upload component

**Features**:

- ✅ Drag and drop
- ✅ Image preview
- ✅ Multiple images
- ✅ Image optimization
- ✅ Cloud storage integration

---

## 🏠 Layout Components

### **Header** (`components/layout/header.tsx`)

**Purpose**: Site header/navigation

**Features**:

- ✅ Logo and branding
- ✅ Navigation menu
- ✅ Search bar
- ✅ Cart icon with count
- ✅ User menu
- ✅ Mobile menu

---

### **Footer** (`components/layout/footer.tsx`)

**Purpose**: Site footer

**Features**:

- ✅ Links (About, Contact, FAQ)
- ✅ Newsletter signup
- ✅ Social media links
- ✅ Copyright
- ✅ Responsive centering

---

### **Cookie Consent** (`components/layout/cookie-consent.tsx`)

**Purpose**: Cookie consent banner

**Features**:

- ✅ Cookie policy notice
- ✅ Accept/Decline buttons
- ✅ Persistent storage
- ✅ GDPR compliant

---

## 🛒 Shopping Components

### **Cart Drawer** (`cart/CartDrawer.tsx`)

**Purpose**: Shopping cart drawer

**Features**:

- ✅ Slide-out drawer
- ✅ Cart items list
- ✅ Quantity updates
- ✅ Remove items
- ✅ Subtotal calculation
- ✅ Checkout button

---

### **Address Selector** (`components/checkout/address-selector.tsx`)

**Purpose**: Address selection for checkout

**Features**:

- ✅ Address list
- ✅ Add new address
- ✅ Edit address
- ✅ Default address selection

---

## ❤️ Wishlist Components

### **Wishlist Item** (`components/wishlist/wishlist-item.tsx`)

**Purpose**: Wishlist item display

**Features**:

- ✅ Product information
- ✅ Add to cart button
- ✅ Remove from wishlist
- ✅ Price tracking

---

## 📦 Order Components

### **Order Card** (`components/orders/order-card.tsx`)

**Purpose**: Order summary card

**Features**:

- ✅ Order number and date
- ✅ Order status
- ✅ Item count and total
- ✅ View details link

---

### **Order Tracking** (`components/orders/order-tracking.tsx`)

**Purpose**: Order tracking display

**Features**:

- ✅ Status timeline
- ✅ Tracking updates
- ✅ Location information
- ✅ Estimated delivery

---

## 🏠 Homepage Components

### **Hero Section** (`components/home/hero-section.tsx`)

**Purpose**: Homepage hero banner

**Features**:

- ✅ Main banner image
- ✅ CTA buttons
- ✅ Animated text
- ✅ Responsive design

---

### **Featured Products** (`components/home/featured-products.tsx`)

**Purpose**: Featured products showcase

**Features**:

- ✅ Product grid
- ✅ Section title
- ✅ View all link

---

### **Category Showcase** (`components/home/category-showcase.tsx`)

**Purpose**: Category grid display

**Features**:

- ✅ Category cards
- ✅ Category images
- ✅ Category links

---

### **New Arrivals** (`components/home/new-arrivals.tsx`)

**Purpose**: New arrival products

**Features**:

- ✅ Latest products
- ✅ Product grid
- ✅ Date-based sorting

---

## 🔧 Component Patterns

### **Form Components**

- Use `react-hook-form` for form management
- Use `zod` for validation
- Use `@hookform/resolvers` for integration

### **Data Fetching**

- Use React Query hooks
- Use custom hooks for data fetching
- Implement loading and error states

### **State Management**

- Use Redux for global state
- Use Zustand for local state
- Use React Query for server state

---

## 📝 Usage Examples

### **Product Card**

```tsx
<ProductCard
  product={product}
  showWishlist={true}
  showCompare={true}
  variant="default"
/>
```

### **Form with Validation**

```tsx
const form = useForm({
  resolver: zodResolver(schema),
});

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

---

## 🔗 Related Documentation

- [Products](./03-products.md)
- [State Management](./08-state-management.md)
- [Services & Hooks](./09-services-hooks.md)

---

**Last Updated**: January 2025

