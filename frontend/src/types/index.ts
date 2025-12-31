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
  RAZORPAY = "RAZORPAY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ReturnStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
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

// Auth Form Data Types
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
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

// Product Variant Data Types (for create/update operations)
export interface ProductVariantData {
  productId: string;
  sku: string;
  size: string;
  color: string;
  colorHex?: string;
  stock: number;
  price: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  basePrice: number;
  compareAtPrice?: number;
  sku: string;
  brand?: string;
  material?: string;
  careInstructions?: string;
  washCareInstructions?: string;
  specifications?: Record<string, string | number>;
  sizeGuide?: {
    title?: string;
    measurements?: Array<{
      size: string;
      chest?: string;
      waist?: string;
      length?: string;
      sleeve?: string;
      [key: string]: string | undefined;
    }>;
    notes?: string;
  };
  shippingInfo?: {
    processingTime?: string;
    shippingTime?: string;
    freeShipping?: boolean;
    returnable?: boolean;
    exchangeable?: boolean;
  };
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
  reviews?: Review[];
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

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  paymentGatewayResponse?: Record<string, unknown>;
  refundAmount?: number;
  refundReason?: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  notes?: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payment?: Payment;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Order Creation Types
export interface CreateOrderData {
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
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

// Return Request Types
export interface ReturnRequest {
  id: string;
  userId: string;
  orderId: string;
  orderItemIds: string[];
  reason: string;
  description?: string;
  status: ReturnStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    orderNumber: string;
    items?: OrderItem[];
  };
}

export interface CreateReturnRequestData {
  orderId: string;
  orderItemIds: string[];
  reason: string;
  description?: string;
}

export interface UpdateReturnStatusData {
  status: ReturnStatus;
  adminNotes?: string;
}

// Support Ticket Types
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  replies?: TicketReply[];
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface TicketReply {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateSupportTicketData {
  subject: string;
  message: string;
  category: string;
}

export interface CreateTicketReplyData {
  message: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: "general" | "order" | "return" | "product" | "other";
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
  };
}

// Stock Alert Types
export interface StockAlert {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string; isPrimary?: boolean }>;
  };
}

// Payment Gateway Types (Razorpay)
export interface RazorpayOrderResponse {
  orderId: string;
  amount: string;
  currency: string;
  keyId: string;
  receipt: string;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: string;
}

// User Stats Types
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue?: number;
  favoriteCategory?: {
    id: string;
    name: string;
  };
}

// Product Sort Types
export type ProductSortOption =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "popular"
  | "name_asc"
  | "name_desc"
  | "rating_desc";

// Product Filter Types
export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sort?: ProductSortOption;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

// Cookie Preference Types
export type CookieCategory =
  | "essential"
  | "performance"
  | "functionality"
  | "targeting";

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  performance: boolean;
  functionality: boolean;
  targeting: boolean;
  consentGiven: boolean;
  consentDate?: string;
}

// Address Form Data Types
export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Form Validation Types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult<T extends Record<string, unknown>> {
  isValid: boolean;
  errors: Partial<Record<keyof T, string>>;
}

// Analytics Event Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export interface ProductViewEvent extends AnalyticsEvent {
  name: "product_view";
  properties: {
    productId: string;
    productName: string;
    categoryId?: string;
    price: number;
  };
}

export interface AddToCartEvent extends AnalyticsEvent {
  name: "add_to_cart";
  properties: {
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
  };
}

export interface CheckoutEvent extends AnalyticsEvent {
  name: "checkout_started" | "order_completed";
  properties: {
    orderId?: string;
    orderNumber?: string;
    total: number;
    itemCount: number;
    paymentMethod?: PaymentMethod;
  };
}

// Newsletter Types
export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

// Order Tracking Types
export interface OrderTracking {
  orderNumber: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  id: string | null | undefined;
  status: OrderStatus;
  timestamp: string;
  location?: string;
  description?: string;
}

// MFA (Multi-Factor Authentication) Types
export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  otpAuthUrl: string;
}

export interface MFAVerifyData {
  token: string;
  secret: string;
  backupCodes: string[];
}

export interface MFABackupCodesResponse {
  backupCodes: string[];
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Loading State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  topProducts: Array<{
    id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

export interface InventoryUpdateData {
  variantId: string;
  change: number;
  reason: string;
  notes?: string;
}

export interface ProductImageData {
  productId: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

// Standardized Response Wrappers
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export type StandardResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Pagination Types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "order" | "product" | "promotion" | "system";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Search Types
export interface SearchResult {
  products: Product[];
  categories: Category[];
  total: number;
  query: string;
}

export interface SearchSuggestion {
  type: "product" | "category" | "query";
  text: string;
  url: string;
}

// Recommendation Types
export interface ProductRecommendation {
  product: Product;
  reason: string;
  score: number;
}

// Review Form Types
export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
}

// Coupon Application Types
export interface CouponApplicationResult {
  isValid: boolean;
  discount: number;
  message?: string;
  coupon?: Coupon;
}

// Cart Operations Types
export interface AddToCartData {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

// Wishlist Operations Types
export interface AddToWishlistData {
  productId: string;
}

// Category Operations Types
export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// Homepage Section Types
export interface CreateHomepageSectionData {
  type: string;
  title: string;
  subtitle?: string;
  isActive?: boolean;
  sortOrder?: number;
  config: Record<string, unknown>;
}

export interface UpdateHomepageSectionData {
  title?: string;
  subtitle?: string;
  isActive?: boolean;
  sortOrder?: number;
  config?: Record<string, unknown>;
}

// User Profile Update Types
export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Newsletter Types (Extended)
export interface NewsletterSubscriptionData {
  email: string;
}

// Stock Alert Types (Extended)
export interface CreateStockAlertData {
  productId: string;
}

// OAuth Types
export interface OAuthProvider {
  name: "google" | "apple" | "facebook";
  enabled: boolean;
}

export interface OAuthCallbackData {
  code: string;
  state?: string;
  provider: "google" | "apple";
}

// Health Check Types
export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: boolean;
    cache?: boolean;
    storage?: boolean;
  };
  version?: string;
}
