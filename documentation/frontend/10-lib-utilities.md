# 🛠️ Frontend Library & Utilities

**Complete documentation for all utility functions, formatters, validators, and helper functions in the frontend lib directory.**

---

## 📁 File Structure

```
frontend/src/lib/
├── utils.ts                    # General utilities
├── formatters.ts               # Data formatting functions
├── validation.ts               # Validation utilities
├── constants.ts                # Application constants
├── api-client.ts               # API client setup
├── axios.ts                    # Axios configuration
├── react-query.tsx             # React Query provider
├── redux-provider.tsx          # Redux provider
├── cookies.ts                  # Cookie utilities
├── storage.ts                  # Local storage utilities
├── seo.ts                      # SEO utilities
├── analytics.ts                # Analytics utilities
├── error-handler.ts            # Error handling
├── input-sanitizer.ts          # Input sanitization
├── health-check.ts             # Health check utilities
├── pwa.ts                      # PWA utilities
└── validation.ts               # Form validation
```

---

## 🔧 General Utilities

### **File**: `lib/utils.ts`

**Purpose**: General utility functions

---

### **Functions**

#### **1. `cn()`**

**Purpose**: Merge class names (clsx + tailwind-merge)

**Parameters**: `...inputs: ClassValue[]`

**Returns**: `string` - Merged class names

**Features**:

- ✅ Merges Tailwind classes intelligently
- ✅ Handles conditional classes
- ✅ Resolves conflicts (last class wins)

**Usage**:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

#### **2. `formatPrice()`**

**Purpose**: Format price in Indian Rupees

**Parameters**: `price: number`

**Returns**: `string` - Formatted price (e.g., "₹1,234")

**Usage**:

```typescript
const formatted = formatPrice(1234); // "₹1,234"
```

---

#### **3. `formatDate()`**

**Purpose**: Format date in readable format

**Parameters**: `date: string`

**Returns**: `string` - Formatted date (e.g., "Jan 1, 2025")

**Usage**:

```typescript
const formatted = formatDate("2025-01-01"); // "Jan 1, 2025"
```

---

## 📊 Formatters

### **File**: `lib/formatters.ts`

**Purpose**: Data formatting utilities

---

### **Functions**

#### **1. `formatPrice()`**

**Purpose**: Format price with optional decimals

**Parameters**:

- `price: number` - Price value
- `showDecimals: boolean` - Show decimal places (default: false)

**Returns**: `string` - Formatted price

**Usage**:

```typescript
formatPrice(1234.56, false); // "₹1,235"
formatPrice(1234.56, true);  // "₹1,234.56"
```

---

#### **2. `formatDate()`**

**Purpose**: Format date with custom options

**Parameters**:

- `date: string | Date` - Date to format
- `options?: Intl.DateTimeFormatOptions` - Format options

**Returns**: `string` - Formatted date

**Usage**:

```typescript
formatDate(new Date()); // "Jan 1, 2025"
formatDate(new Date(), { dateStyle: "full" }); // "Wednesday, January 1, 2025"
```

---

#### **3. `formatDateTime()`**

**Purpose**: Format date and time

**Parameters**: `date: string | Date`

**Returns**: `string` - Formatted date and time

**Usage**:

```typescript
formatDateTime(new Date()); // "Jan 1, 2025, 10:30 AM"
```

---

#### **4. `formatRelativeTime()`**

**Purpose**: Format relative time (e.g., "2 hours ago")

**Parameters**: `date: string | Date`

**Returns**: `string` - Relative time string

**Usage**:

```typescript
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

---

#### **5. `formatOrderStatus()`**

**Purpose**: Format order status for display

**Parameters**: `status: string`

**Returns**: `string` - Human-readable status

**Usage**:

```typescript
formatOrderStatus("PENDING"); // "Pending"
```

---

#### **6. `formatPaymentMethod()`**

**Purpose**: Format payment method for display

**Parameters**: `method: string`

**Returns**: `string` - Human-readable method

**Usage**:

```typescript
formatPaymentMethod("CREDIT_CARD"); // "Credit Card"
```

---

#### **7. `formatPhone()`**

**Purpose**: Format phone number (Indian format)

**Parameters**: `phone: string`

**Returns**: `string` - Formatted phone (e.g., "+91 98765 43210")

**Usage**:

```typescript
formatPhone("9876543210"); // "+91 98765 43210"
```

---

#### **8. `truncateText()`**

**Purpose**: Truncate text with ellipsis

**Parameters**:

- `text: string` - Text to truncate
- `maxLength: number` - Maximum length

**Returns**: `string` - Truncated text

**Usage**:

```typescript
truncateText("Long text here", 10); // "Long text..."
```

---

#### **9. `formatFileSize()`**

**Purpose**: Format file size in human-readable format

**Parameters**: `bytes: number`

**Returns**: `string` - Formatted size (e.g., "1.5 MB")

**Usage**:

```typescript
formatFileSize(1572864); // "1.5 MB"
```

---

#### **10. `formatPercentage()`**

**Purpose**: Format percentage

**Parameters**:

- `value: number` - Value to format
- `decimals: number` - Decimal places (default: 0)

**Returns**: `string` - Formatted percentage

**Usage**:

```typescript
formatPercentage(25.5, 1); // "25.5%"
```

---

#### **11. `formatSlug()`**

**Purpose**: Convert text to URL-friendly slug

**Parameters**: `text: string`

**Returns**: `string` - URL-friendly slug

**Usage**:

```typescript
formatSlug("Hello World!"); // "hello-world"
```

---

## ✅ Validation Utilities

### **File**: `lib/validation.ts`

**Purpose**: Client-side validation functions

---

### **Functions**

#### **1. `isValidEmail()`**

**Purpose**: Validate email format

**Parameters**: `email: string`

**Returns**: `boolean` - True if valid

**Usage**:

```typescript
if (isValidEmail(email)) {
  // Valid email
}
```

---

#### **2. `isValidPhone()`**

**Purpose**: Validate phone number (Indian format)

**Parameters**: `phone: string`

**Returns**: `boolean` - True if valid

**Usage**:

```typescript
if (isValidPhone(phone)) {
  // Valid phone
}
```

---

#### **3. `validatePassword()`**

**Purpose**: Validate password strength

**Parameters**: `password: string`

**Returns**: `{ isValid: boolean, error?: string }`

**Features**:

- ✅ Checks minimum length
- ✅ Returns error message if invalid

**Usage**:

```typescript
const result = validatePassword(password);
if (!result.isValid) {
  console.error(result.error);
}
```

---

#### **4. `validateName()`**

**Purpose**: Validate name

**Parameters**: `name: string`

**Returns**: `{ isValid: boolean, error?: string }`

**Features**:

- ✅ Checks minimum length
- ✅ Checks maximum length

---

#### **5. `validateRequired()`**

**Purpose**: Validate required field

**Parameters**:

- `value: string | number | undefined | null`
- `fieldName?: string` - Field name for error message

**Returns**: `{ isValid: boolean, error?: string }`

---

#### **6. `isValidUrl()`**

**Purpose**: Validate URL format

**Parameters**: `url: string`

**Returns**: `boolean` - True if valid

---

#### **7. `validateNumber()`**

**Purpose**: Validate number with min/max

**Parameters**:

- `value: number | string`
- `min?: number`
- `max?: number`

**Returns**: `{ isValid: boolean, error?: string }`

---

#### **8. `validateForm()`**

**Purpose**: Validate multiple fields at once

**Parameters**:

- `fields: T` - Field values
- `validators: { [K in keyof T]?: (value: T[K]) => { isValid: boolean; error?: string } }` - Validators

**Returns**: `{ isValid: boolean, errors: Partial<Record<keyof T, string>> }`

**Usage**:

```typescript
const result = validateForm(
  { email, password },
  {
    email: (value) => isValidEmail(value) ? { isValid: true } : { isValid: false, error: "Invalid email" },
    password: validatePassword,
  }
);
```

---

## 🍪 Cookie Utilities

### **File**: `lib/cookies.ts`

**Purpose**: Cookie management utilities

---

### **Functions**

#### **1. `getCookie()`**

**Purpose**: Get cookie value

**Parameters**: `name: string`

**Returns**: `string | null` - Cookie value or null

---

#### **2. `setCookie()`**

**Purpose**: Set cookie

**Parameters**:

- `name: string`
- `value: string`
- `options?: CookieOptions`

**Returns**: `void`

**Options**:

- `expires?: Date` - Expiry date
- `maxAge?: number` - Max age in seconds
- `path?: string` - Cookie path
- `domain?: string` - Cookie domain
- `secure?: boolean` - Secure flag
- `sameSite?: "strict" | "lax" | "none"` - SameSite policy

---

#### **3. `removeCookie()`**

**Purpose**: Remove cookie

**Parameters**: `name: string`

**Returns**: `void`

---

#### **4. `hasCookie()`**

**Purpose**: Check if cookie exists

**Parameters**: `name: string`

**Returns**: `boolean`

---

## 💾 Storage Utilities

### **File**: `lib/storage.ts`

**Purpose**: Local storage and session storage utilities

---

### **Functions**

#### **1. `getLocalStorage()`**

**Purpose**: Get item from local storage

**Parameters**: `key: string`

**Returns**: `T | null` - Parsed value or null

**Features**:

- ✅ Automatic JSON parsing
- ✅ Type-safe

---

#### **2. `setLocalStorage()`**

**Purpose**: Set item in local storage

**Parameters**:

- `key: string`
- `value: T`

**Returns**: `void`

**Features**:

- ✅ Automatic JSON stringification
- ✅ Type-safe

---

#### **3. `removeLocalStorage()`**

**Purpose**: Remove item from local storage

**Parameters**: `key: string`

**Returns**: `void`

---

#### **4. `clearLocalStorage()`**

**Purpose**: Clear all local storage

**Returns**: `void`

---

#### **5. `getSessionStorage()`**

**Purpose**: Get item from session storage

**Parameters**: `key: string`

**Returns**: `T | null`

---

#### **6. `setSessionStorage()`**

**Purpose**: Set item in session storage

**Parameters**:

- `key: string`
- `value: T`

**Returns**: `void`

---

## 🔍 SEO Utilities

### **File**: `lib/seo.ts`

**Purpose**: SEO metadata and utilities

---

### **Functions**

#### **1. `generateMetadata()`**

**Purpose**: Generate page metadata

**Parameters**: Metadata options

**Returns**: `Metadata` - Next.js metadata object

**Usage**:

```typescript
export const metadata = generateMetadata({
  title: "Product Name",
  description: "Product description",
  image: "/product-image.jpg",
});
```

---

#### **2. `generateStructuredData()`**

**Purpose**: Generate JSON-LD structured data

**Parameters**: Structured data options

**Returns**: `string` - JSON-LD string

---

## 📊 Analytics Utilities

### **File**: `lib/analytics.ts`

**Purpose**: Analytics tracking utilities

---

### **Functions**

#### **1. `trackEvent()`**

**Purpose**: Track custom event

**Parameters**:

- `eventName: string`
- `properties?: Record<string, unknown>`

**Returns**: `void`

---

#### **2. `trackPageView()`**

**Purpose**: Track page view

**Parameters**:

- `page: string`
- `properties?: Record<string, unknown>`

**Returns**: `void`

---

## ⚠️ Error Handler

### **File**: `lib/error-handler.ts`

**Purpose**: Error handling utilities

---

### **Functions**

#### **1. `handleApiError()`**

**Purpose**: Handle API errors

**Parameters**: `error: unknown`

**Returns**: `{ message: string, code?: string }`

**Features**:

- ✅ Extracts error message
- ✅ Handles Axios errors
- ✅ Returns user-friendly messages

---

#### **2. `logError()`**

**Purpose**: Log error for debugging

**Parameters**:

- `error: Error`
- `context?: Record<string, unknown>`

**Returns**: `void`

---

## 🧹 Input Sanitizer

### **File**: `lib/input-sanitizer.ts`

**Purpose**: Input sanitization utilities

---

### **Functions**

#### **1. `sanitizeString()`**

**Purpose**: Sanitize string input

**Parameters**:

- `input: string`
- `options?: { maxLength?: number, allowHtml?: boolean }`

**Returns**: `string` - Sanitized string

**Features**:

- ✅ Removes HTML tags
- ✅ Truncates if too long
- ✅ Trims whitespace

---

#### **2. `sanitizeEmail()`**

**Purpose**: Sanitize email input

**Parameters**: `email: string`

**Returns**: `string` - Sanitized email

---

#### **3. `sanitizeSearchQuery()`**

**Purpose**: Sanitize search query

**Parameters**: `query: string`

**Returns**: `string` - Sanitized query

**Features**:

- ✅ Removes special characters
- ✅ Limits length
- ✅ Trims whitespace

---

## 🏥 Health Check

### **File**: `lib/health-check.ts`

**Purpose**: Health check utilities

---

### **Functions**

#### **1. `checkApiHealth()`**

**Purpose**: Check API health

**Returns**: `Promise<boolean>` - True if healthy

---

## 📱 PWA Utilities

### **File**: `lib/pwa.ts`

**Purpose**: Progressive Web App utilities

---

### **Functions**

#### **1. `registerServiceWorker()`**

**Purpose**: Register service worker

**Returns**: `Promise<void>`

---

#### **2. `checkUpdateAvailable()`**

**Purpose**: Check if app update is available

**Returns**: `Promise<boolean>`

---

## 🌐 API Client

### **File**: `lib/axios.ts`

**Purpose**: Production-ready Axios instance with interceptors, error handling, and token refresh

**Features**:

- ✅ Request/response interceptors
- ✅ Automatic token injection
- ✅ Token refresh on 401 errors
- ✅ Analytics tracking
- ✅ Error handling
- ✅ Rate limiting handling
- ✅ Performance monitoring
- ✅ Request sanitization

**Configuration**:

```typescript
const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies
});
```

**Request Interceptor**:

- Adds `Authorization` header with access token
- Adds `X-Session-Id` header for analytics
- Tracks API requests (non-sensitive endpoints)
- Records request start time for performance monitoring

**Response Interceptor**:

- Tracks successful API calls
- Monitors slow responses (> 1 second)
- Handles 401 errors with automatic token refresh
- Handles 429 rate limiting errors
- Tracks API errors for analytics

**Token Refresh Flow**:

1. On 401 error, attempts to refresh token
2. If refresh succeeds, retries original request
3. If refresh fails, clears tokens and redirects to login

**Usage**:

```typescript
import apiClient from "@/lib/axios";

// GET request
const response = await apiClient.get("/products");

// POST request
const response = await apiClient.post("/orders", orderData);

// With error handling
try {
  const response = await apiClient.get("/products");
} catch (error) {
  // Error is automatically handled by interceptor
}
```

---

### **File**: `lib/api-client.ts`

**Purpose**: Re-export of axios instance for consistency

**Exports**:

- `apiClient` - Default export (Axios instance)
- `default` - Default export (same as apiClient)

**Usage**:

```typescript
// Option 1: Direct import (recommended)
import apiClient from "@/lib/axios";

// Option 2: Re-export import (for consistency)
import apiClient from "@/lib/api-client";
```

**Note**: This file provides a centralized export point. Both imports work identically.

---

## 📋 Constants

### **File**: `lib/constants.ts`

**Purpose**: Application-wide constants

---

### **Constants**

#### **Order Status**

```typescript
export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
```

#### **Payment Methods**

```typescript
export const PAYMENT_METHODS = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  UPI: "UPI",
  NET_BANKING: "Net Banking",
  COD: "Cash on Delivery",
};
```

#### **Validation Rules**

```typescript
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};
```

#### **Error Messages**

```typescript
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  // ... more messages
};
```

---

## 📝 Usage Examples

### **Format Price**

```typescript
import { formatPrice } from "@/lib/formatters";

const price = formatPrice(1234.56, true); // "₹1,234.56"
```

### **Validate Form**

```typescript
import { validateForm, isValidEmail, validatePassword } from "@/lib/validation";

const result = validateForm(
  { email, password },
  {
    email: (value) => isValidEmail(value) 
      ? { isValid: true } 
      : { isValid: false, error: "Invalid email" },
    password: validatePassword,
  }
);
```

### **Use Storage**

```typescript
import { setLocalStorage, getLocalStorage } from "@/lib/storage";

setLocalStorage("user", userData);
const user = getLocalStorage<User>("user");
```

---

## 🔗 Related Documentation

- [Components](./07-components.md)
- [State Management](./08-state-management.md)
- [Services & Hooks](./09-services-hooks.md)

---

**Last Updated**: January 2025

