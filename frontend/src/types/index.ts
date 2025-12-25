export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number;
  sku: string;
  brand?: string;
  material?: string;
  careInstructions?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  totalStock: number;
  categoryId: string;
  subCategoryId?: string;
  category: Category;
  subCategory?: SubCategory;
  variants: ProductVariant[];
  images: ProductImage[];
  averageRating: number;
  reviewCount: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  price: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  subCategories?: SubCategory[];
  productsCount: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  variant: {
    size: string;
    color: string;
    colorHex?: string;
    stock: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  items: OrderItem[];
  shippingAddress: Address;
  payment: Payment;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  variant: ProductVariant & { product: Product };
}

export interface Payment {
  id: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  method: string;
  transactionId?: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}
