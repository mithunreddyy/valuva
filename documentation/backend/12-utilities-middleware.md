# 🛠️ Utilities & Middleware

**Complete documentation for all utility functions and middleware.**

---

## 📁 Utilities Directory

```
backend/src/utils/
├── jwt.util.ts                    # JWT token operations
├── password.util.ts                # Password hashing/verification
├── cache.util.ts                   # Redis/in-memory caching
├── logger.util.ts                  # Structured logging
├── error.util.ts                   # Custom error classes
├── response.util.ts                # HTTP response formatting
├── email.util.ts                   # Email sending
├── analytics.util.ts                # Analytics tracking
├── audit-log.util.ts               # Audit logging
├── input-sanitizer.util.ts         # Input sanitization
├── slug.util.ts                    # URL slug generation
├── pagination.util.ts              # Pagination helpers
├── query.util.ts                   # Database query builders
├── order.util.ts                   # Order utilities
├── product.util.ts                 # Product utilities
├── inventory-lock.util.ts          # Inventory locking
├── order-state-machine.util.ts     # Order state management
├── circuit-breaker.util.ts         # Circuit breaker pattern
├── retry.util.ts                   # Retry logic
├── oauth-encryption.util.ts        # OAuth state encryption
├── full-text-search.util.ts        # Full-text search
├── webhook-verification.util.ts    # Webhook signature verification
├── payment-reconciliation.util.ts  # Payment reconciliation
├── cache-invalidation.util.ts      # Cache invalidation
└── email-templates/                # Email templates
```

---

## 🔐 JWT Utility

### **File**: `jwt.util.ts`

**Purpose**: JWT token generation and verification

### **Class**: `JWTUtil`

#### **Methods**

##### **1. `generateAccessToken()`**

```typescript
static generateAccessToken(payload: TokenPayload): string
```

- **Purpose**: Generate access token (short-lived)
- **Payload**: `{ userId, email, role }`
- **Expiry**: 15 minutes (configurable)
- **Secret**: `env.JWT_SECRET`

##### **2. `generateRefreshToken()`**

```typescript
static generateRefreshToken(payload: TokenPayload): string
```

- **Purpose**: Generate refresh token (long-lived)
- **Payload**: `{ userId, email, role }`
- **Expiry**: 7 days (configurable)
- **Secret**: `env.JWT_REFRESH_SECRET`

##### **3. `verifyAccessToken()`**

```typescript
static verifyAccessToken(token: string): TokenPayload
```

- **Purpose**: Verify and decode access token
- **Throws**: Error if invalid/expired

##### **4. `verifyRefreshToken()`**

```typescript
static verifyRefreshToken(token: string): TokenPayload
```

- **Purpose**: Verify and decode refresh token
- **Throws**: Error if invalid/expired

##### **5. `generatePasswordResetToken()`**

```typescript
static generatePasswordResetToken(): string
```

- **Purpose**: Generate password reset token
- **Expiry**: 1 hour

---

## 🔒 Password Utility

### **File**: `password.util.ts`

**Purpose**: Password hashing and verification using bcrypt

### **Class**: `PasswordUtil`

#### **Methods**

##### **1. `hash()`**

```typescript
static async hash(password: string): Promise<string>
```

- **Purpose**: Hash password with bcrypt
- **Rounds**: Configurable via `env.BCRYPT_ROUNDS` (default: 10)
- **Returns**: Hashed password string

##### **2. `compare()`**

```typescript
static async compare(password: string, hash: string): Promise<boolean>
```

- **Purpose**: Compare plain password with hash
- **Returns**: `true` if match, `false` otherwise

---

## 💾 Cache Utility

### **File**: `cache.util.ts`

**Purpose**: Redis-based caching with in-memory fallback

### **Class**: `CacheUtil`

**Features**:

- ✅ Redis primary storage
- ✅ In-memory fallback
- ✅ TTL support
- ✅ Pattern-based deletion
- ✅ Cache-aside pattern

#### **Methods**

##### **1. `get()`**

```typescript
static async get<T>(key: string): Promise<T | null>
```

- **Purpose**: Get value from cache
- **Returns**: Cached value or `null`

##### **2. `set()`**

```typescript
static async set<T>(key: string, value: T, ttl?: number): Promise<void>
```

- **Purpose**: Set value in cache
- **TTL**: Time to live in seconds (default: 3600)

##### **3. `delete()`**

```typescript
static async delete(key: string): Promise<void>
```

- **Purpose**: Delete single key from cache

##### **4. `deletePattern()`**

```typescript
static async deletePattern(pattern: string): Promise<void>
```

- **Purpose**: Delete all keys matching pattern
- **Example**: `deletePattern("products:*")`

##### **5. `clear()`**

```typescript
static async clear(): Promise<void>
```

- **Purpose**: Clear all cache (Redis + memory)

##### **6. `getOrSet()`**

```typescript
static async getOrSet<T>(
  key: string,
  callback: () => Promise<T>,
  ttl?: number
): Promise<T>
```

- **Purpose**: Cache-aside pattern
- **Logic**: Get from cache, if miss call callback and cache result

---

## 📝 Logger Utility

### **File**: `logger.util.ts`

**Purpose**: Structured logging with multiple levels

### **Methods**

- `logger.info()` - Info logs
- `logger.error()` - Error logs
- `logger.warn()` - Warning logs
- `logger.debug()` - Debug logs

**Features**:

- Structured JSON logging
- Request ID tracking
- Error stack traces
- Production-ready

---

## ⚠️ Error Utility

### **File**: `error.util.ts`

**Purpose**: Custom error classes for different error types

### **Error Classes**

#### **1. `NotFoundError`**

- **HTTP Status**: 404
- **Usage**: Resource not found

#### **2. `ValidationError`**

- **HTTP Status**: 400
- **Usage**: Input validation failures

#### **3. `UnauthorizedError`**

- **HTTP Status**: 401
- **Usage**: Authentication failures

#### **4. `ForbiddenError`**

- **HTTP Status**: 403
- **Usage**: Authorization failures

#### **5. `ConflictError`**

- **HTTP Status**: 409
- **Usage**: Resource conflicts (duplicate email, etc.)

#### **6. `InternalServerError`**

- **HTTP Status**: 500
- **Usage**: Server errors

---

## 📤 Response Utility

### **File**: `response.util.ts`

**Purpose**: Standardized HTTP response formatting

### **Class**: `ResponseUtil`

#### **Methods**

##### **1. `success()`**

```typescript
static success(
  res: Response,
  data: any,
  message?: string,
  statusCode?: number
): Response
```

- **Purpose**: Send success response
- **Status**: 200 (default) or custom
- **Format**: `{ success: true, data, message }`

##### **2. `error()`**

```typescript
static error(
  res: Response,
  message: string,
  statusCode?: number,
  errors?: any
): Response
```

- **Purpose**: Send error response
- **Format**: `{ success: false, message, errors }`

---

## 📧 Email Utility

### **File**: `email.util.ts`

**Purpose**: Email sending with templates

### **Class**: `EmailUtil`

#### **Methods**

##### **`sendEmail()`**

```typescript
static async sendEmail(options: {
  to: string;
  subject: string;
  template?: string;
  text?: string;
  html?: string;
}): Promise<void>
```

- **Purpose**: Send email
- **Features**: Template support, HTML/text emails

---

## 📊 Analytics Utility

### **File**: `analytics.util.ts`

**Purpose**: Track user events and analytics

### **Class**: `AnalyticsUtil`

#### **Methods**

##### **`trackEvent()`**

```typescript
static async trackEvent(options: {
  userId?: string;
  eventType: AnalyticsEventType;
  properties?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void>
```

- **Purpose**: Track analytics event
- **Event Types**: PAGE_VIEW, PURCHASE, CART_ADD, etc.

---

## 🔍 Audit Log Utility

### **File**: `audit-log.util.ts`

**Purpose**: Log user actions for audit trail

### **Class**: `AuditLogUtil`

#### **Methods**

##### **`logUserAction()`**

```typescript
static async logUserAction(
  userId: string,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void>
```

- **Purpose**: Log user action
- **Actions**: CREATE, UPDATE, DELETE, LOGIN, etc.

---

## 🧹 Input Sanitizer Utility

### **File**: `input-sanitizer.util.ts`

**Purpose**: Sanitize and validate user inputs

### **Class**: `InputSanitizer`

#### **Methods**

- `sanitizeString()` - Sanitize strings
- `sanitizeEmail()` - Validate and sanitize emails
- `sanitizePhone()` - Validate phone numbers
- `validatePasswordStrength()` - Password validation
- `sanitizeHTML()` - HTML sanitization

---

## 🔗 Slug Utility

### **File**: `slug.util.ts`

**Purpose**: Generate URL-friendly slugs

### **Methods**

- `generateSlug()` - Generate slug from string
- `ensureUniqueSlug()` - Ensure unique slug in database

---

## 📄 Pagination Utility

### **File**: `pagination.util.ts`

**Purpose**: Pagination helpers

### **Methods**

- `calculatePagination()` - Calculate skip/limit
- `formatPaginationResponse()` - Format paginated response

---

## 🔒 Inventory Lock Utility

### **File**: `inventory-lock.util.ts`

**Purpose**: Prevent race conditions in inventory updates

### **Class**: `InventoryLockUtil`

#### **Methods**

##### **`lockAndReserveInventory()`**

```typescript
static async lockAndReserveInventory(
  variantId: string,
  quantity: number,
  timeout: number
): Promise<boolean>
```

- **Purpose**: Lock and reserve inventory atomically
- **Returns**: `true` if locked, `false` if failed

##### **`releaseInventory()`**

```typescript
static async releaseInventory(
  variantId: string,
  quantity: number
): Promise<void>
```

- **Purpose**: Release locked inventory

---

## 🔄 Order State Machine Utility

### **File**: `order-state-machine.util.ts`

**Purpose**: Manage order state transitions

### **Class**: `OrderStateMachine`

**States**: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → CANCELLED

**Methods**:

- `canTransition()` - Check if state transition is valid
- `getNextStates()` - Get possible next states

---

## ⚡ Circuit Breaker Utility

### **File**: `circuit-breaker.util.ts`

**Purpose**: Prevent cascading failures

**Features**:

- Open/Closed/Half-Open states
- Failure threshold
- Timeout handling

---

## 🔁 Retry Utility

### **File**: `retry.util.ts`

**Purpose**: Retry failed operations

**Features**:

- Exponential backoff
- Max retry attempts
- Custom retry conditions

---

## 🔐 OAuth Encryption Utility

### **File**: `oauth-encryption.util.ts`

**Purpose**: Encrypt/decrypt OAuth state

**Methods**:

- `encryptState()` - Encrypt OAuth state
- `decryptState()` - Decrypt OAuth state

---

## 🔍 Full-Text Search Utility

### **File**: `full-text-search.util.ts`

**Purpose**: Full-text search implementation

**Features**:

- PostgreSQL full-text search
- Ranking
- Highlighting

---

## 📡 Webhook Verification Utility

### **File**: `webhook-verification.util.ts`

**Purpose**: Verify webhook signatures

**Methods**:

- `verifyShopifyWebhook()` - Verify Shopify webhooks
- `verifyGenericWebhook()` - Generic webhook verification

---

## 💰 Payment Reconciliation Utility

### **File**: `payment-reconciliation.util.ts`

**Purpose**: Reconcile payments with orders

**Features**:

- Payment matching
- Discrepancy detection
- Reconciliation reports

---

## 🗑️ Cache Invalidation Utility

### **File**: `cache-invalidation.util.ts`

**Purpose**: Invalidate related cache entries

**Methods**:

- `invalidateProductCache()` - Invalidate product-related cache
- `invalidateUserCache()` - Invalidate user-related cache

---

## 🛡️ Middleware

### **File**: `middleware/auth.middleware.ts`

**Purpose**: JWT authentication middleware

**Function**: `authenticate`

- Verifies JWT token
- Attaches user to `req.user`
- Returns 401 if invalid

---

### **File**: `middleware/rbac.middleware.ts`

**Purpose**: Role-based access control

**Function**: `authorize(roles: string[])`

- Checks user role
- Returns 403 if unauthorized

---

### **File**: `middleware/rate-limit.middleware.ts`

**Purpose**: Rate limiting

**Types**:

- General rate limiter
- Auth rate limiter (stricter)
- Admin rate limiter

---

### **File**: `middleware/error.middleware.ts`

**Purpose**: Global error handling

**Functions**:

- `errorHandler` - Handle errors
- `notFoundHandler` - Handle 404

---

### **File**: `middleware/validate.middleware.ts`

**Purpose**: Request validation

**Function**: `validate(schema)`

- Validates request body/query/params
- Returns 400 if invalid

---

### **File**: `middleware/async.middleware.ts`

**Purpose**: Async error handling wrapper

**Function**: `asyncHandler(fn)`

- Wraps async route handlers
- Catches errors automatically

---

### **File**: `middleware/performance.middleware.ts`

**Purpose**: Performance monitoring

**Features**:

- Request duration tracking
- Slow request detection
- Metrics collection

---

### **File**: `middleware/request-id.middleware.ts`

**Purpose**: Add unique request ID

**Features**:

- UUID generation
- Request tracking
- Log correlation

---

### **File**: `middleware/compression.middleware.ts`

**Purpose**: Response compression middleware for reducing bandwidth and improving performance

**Function**: `compressionMiddleware`

**Features**:

- ✅ Production-only compression
- ✅ Supports gzip, deflate, and brotli
- ✅ Sets appropriate Content-Encoding headers
- ✅ Sets Vary header for caching
- ✅ Checks client Accept-Encoding support

**Usage**:

```typescript
import { compressionMiddleware } from "./middleware/compression.middleware";
app.use(compressionMiddleware);
```

**Note**: For full compression, use `express-compression` middleware. This is a lightweight version that sets headers.

---

### **File**: `middleware/health.middleware.ts`

**Purpose**: Health check endpoints for monitoring and load balancers

**Functions**:

#### **1. `healthCheck`**

- **Purpose**: Comprehensive health check endpoint
- **Checks**: Database, Redis, Memory usage
- **Returns**: Health status with detailed checks
- **Status Codes**: 200 (healthy), 503 (unhealthy)

**Response Format**:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "redis": "healthy",
    "memory": {
      "status": "healthy",
      "rss": 150,
      "heapTotal": 50,
      "heapUsed": 30,
      "external": 10
    }
  }
}
```

#### **2. `readinessCheck`**

- **Purpose**: Kubernetes/Docker readiness probe
- **Checks**: Critical dependencies (database)
- **Returns**: Ready/not ready status
- **Status Codes**: 200 (ready), 503 (not ready)

#### **3. `livenessCheck`**

- **Purpose**: Kubernetes/Docker liveness probe
- **Checks**: Application is alive
- **Returns**: Alive status with uptime
- **Status Code**: 200

**Usage**:

```typescript
import { healthCheck, readinessCheck, livenessCheck } from "./middleware/health.middleware";
app.get("/health", healthCheck);
app.get("/ready", readinessCheck);
app.get("/live", livenessCheck);
```

---

### **File**: `middleware/rate-limit-redis.middleware.ts`

**Purpose**: Redis-based distributed rate limiting for multi-server deployments

**Class**: `RedisRateLimiter`

**Features**:

- ✅ Redis primary storage
- ✅ In-memory fallback if Redis unavailable
- ✅ Automatic cleanup of expired entries
- ✅ Custom key generation
- ✅ Rate limit headers (X-RateLimit-*)
- ✅ Retry-After header on limit exceeded

**Pre-configured Limiters**:

1. **`general`**: 100 requests per 15 minutes
2. **`strict`**: 10 requests per minute
3. **`auth`**: 5 requests per minute (for authentication endpoints)
4. **`admin`**: 200 requests per 15 minutes (for admin endpoints)

**Usage**:

```typescript
import { redisRateLimiters } from "./middleware/rate-limit-redis.middleware";
app.use("/api/auth", redisRateLimiters.auth.middleware());
app.use("/api/admin", redisRateLimiters.admin.middleware());
```

**Custom Limiter**:

```typescript
import { createRedisRateLimiter } from "./middleware/rate-limit-redis.middleware";
const customLimiter = createRedisRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20,
  message: "Custom rate limit exceeded",
  keyGenerator: (req) => `custom:${req.ip}`,
});
app.use("/api/custom", customLimiter.middleware());
```

**Key Generation**:

- Default: Uses user ID if authenticated, otherwise IP address
- Custom: Can provide `keyGenerator` function

**Headers**:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Reset time (ISO string)
- `Retry-After`: Seconds until retry (when limited)

---

### **File**: `middleware/security.middleware.ts`

**Purpose**: Security headers and CSRF protection

**Functions**:

#### **1. `csrfProtection`**

- **Purpose**: CSRF token validation for state-changing requests
- **Skips**: GET, HEAD, OPTIONS methods
- **Skips**: Webhook endpoints (validated by secret)
- **Checks**: X-CSRF-Token header or csrf-token cookie
- **Validates**: Token against session token
- **Status Code**: 403 if validation fails

**Usage**:

```typescript
import { csrfProtection } from "./middleware/security.middleware";
app.use(csrfProtection);
```

#### **2. `cspHeaders`**

- **Purpose**: Content Security Policy headers
- **Features**:
  - Strict CSP in production
  - Relaxed CSP in development
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin

**Usage**:

```typescript
import { cspHeaders } from "./middleware/security.middleware";
app.use(cspHeaders);
```

#### **3. `sanitizeInput`**

- **Purpose**: Input sanitization to prevent XSS attacks
- **Sanitizes**: Request body, query parameters, URL parameters
- **Removes**: Script tags, event handlers, javascript: protocols
- **Recursive**: Sanitizes nested objects and arrays

**Usage**:

```typescript
import { sanitizeInput } from "./middleware/security.middleware";
app.use(sanitizeInput);
```

---

### **File**: `middleware/upload.middleware.ts`

**Purpose**: File upload middleware using Multer

**Export**: `uploadMiddleware`

**Features**:

- ✅ Memory storage (files in memory)
- ✅ Image file filtering (jpeg, jpg, png, gif, webp)
- ✅ File size limit: 5MB
- ✅ MIME type validation
- ✅ File extension validation

**Usage**:

```typescript
import { uploadMiddleware } from "./middleware/upload.middleware";
app.post("/upload", uploadMiddleware.single("image"), (req, res) => {
  const file = req.file; // Express.Multer.File
  // Process file
});
```

**Multer Methods**:

- `single(fieldName)` - Single file upload
- `array(fieldName, maxCount)` - Multiple files
- `fields(fields)` - Multiple fields with files

**File Object**:

```typescript
{
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer; // File content
}
```

---

### **File**: `middleware/validation.middleware.ts`

**Purpose**: Enhanced validation middleware with input sanitization

**Function**: `validationMiddleware`

**Features**:

- ✅ Sanitizes query parameters (max depth: 3)
- ✅ Sanitizes body parameters (max depth: 10)
- ✅ Sanitizes URL parameters (max depth: 2)
- ✅ Uses `InputSanitizer` utility
- ✅ HTML not allowed by default
- ✅ Error handling and logging

**Usage**:

```typescript
import { validationMiddleware } from "./middleware/validation.middleware";
app.use(validationMiddleware);
```

**Note**: This is different from `validate.middleware.ts` which validates against Zod schemas. This middleware sanitizes all inputs before validation.

---

## 📧 Email Templates

### **Directory**: `utils/email-templates/`

**Purpose**: React-based email templates using `@react-email/components`

**Files**:

1. **`index.ts`** - Template exports and renderer
2. **`order-confirmation.tsx`** - Order confirmation email
3. **`order-shipped.tsx`** - Order shipped notification
4. **`password-reset.tsx`** - Password reset email
5. **`welcome.tsx`** - Welcome email for new users

### **Template Renderer**

**Function**: `renderEmailTemplate`

```typescript
import { renderEmailTemplate, OrderConfirmationEmail } from "./utils/email-templates";
const html = await renderEmailTemplate(
  <OrderConfirmationEmail order={order} />
);
```

**Exported Templates**:

- `OrderConfirmationEmail` - Order confirmation
- `OrderShippedEmail` - Shipping notification
- `PasswordResetEmail` - Password reset
- `WelcomeEmail` - Welcome message

**Usage with EmailUtil**:

```typescript
import { EmailUtil } from "./utils/email.util";
import { renderEmailTemplate, OrderConfirmationEmail } from "./utils/email-templates";

const html = await renderEmailTemplate(
  <OrderConfirmationEmail order={order} />
);

await EmailUtil.sendEmail({
  to: user.email,
  subject: "Order Confirmation",
  html,
});
```

**Template Props**:

Each template accepts specific props:

- **OrderConfirmationEmail**: `{ order: Order }`
- **OrderShippedEmail**: `{ order: Order, trackingNumber?: string }`
- **PasswordResetEmail**: `{ resetLink: string, userName: string }`
- **WelcomeEmail**: `{ userName: string, loginLink: string }`

---

## 📚 Usage Examples

### **JWT Token**

```typescript
const token = JWTUtil.generateAccessToken({ userId, email, role });
const payload = JWTUtil.verifyAccessToken(token);
```

### **Password**

```typescript
const hash = await PasswordUtil.hash("password123");
const isValid = await PasswordUtil.compare("password123", hash);
```

### **Cache**

```typescript
await CacheUtil.set("key", data, 3600);
const data = await CacheUtil.get("key");
await CacheUtil.delete("key");
```

### **Error**

```typescript
throw new NotFoundError("User not found");
throw new ValidationError("Invalid input");
```

---

**Last Updated**: January 2025
