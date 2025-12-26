export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  COD = "COD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
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
  _count?: { products: number };
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  category?: Category;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  price: number;
  isActive: boolean;
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
  totalSold: number;
  categoryId: string;
  category?: Category;
  subCategoryId?: string;
  subCategory?: SubCategory;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating?: number;
  reviewCount?: number;
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

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  price: number;
  subtotal: number;
  variant: {
    size: string;
    color: string;
    product: {
      name: string;
      images: ProductImage[];
    };
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payment?: {
    status: PaymentStatus;
    method: PaymentMethod;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
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
  user?: {
    firstName: string;
    lastName: string;
  };
  product?: {
    name: string;
    slug: string;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice?: number;
  image: string | null;
  averageRating: number;
  reviewCount: number;
  addedAt: string;
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

export interface HomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  isActive: boolean;
  sortOrder: number;
  config: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
