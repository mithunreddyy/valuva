# 🚀 Core Application - Backend

**Complete documentation for the core backend application files, server setup, and configuration.**

---

## 📁 Core Files

```
backend/src/
├── server.ts              # Application entry point
├── app.ts                 # Express app configuration
└── config/                # Configuration files
    ├── env.ts             # Environment variables
    ├── database.ts        # Prisma client setup
    ├── redis.ts           # Redis connection
    ├── constants.ts       # Application constants
    ├── swagger.ts         # API documentation
    └── sentry.ts          # Error tracking
```

---

## 🎯 Server Entry Point

### **File**: `server.ts`

**Purpose**: Application entry point that initializes all services and starts the server.

### **Key Functions**

#### **1. `startServer()`**

**Purpose**: Initialize all services and start HTTP server

**Initialization Order**:

1. ✅ **Sentry** - Error tracking (initialized first)
2. ✅ **Redis** - Cache connection
3. ✅ **Background Jobs** - Email queue, stock alerts
4. ✅ **Scheduler** - Scheduled tasks
5. ✅ **Database** - Prisma connection
6. ✅ **HTTP Server** - Express app listening

**Features**:

- Graceful error handling
- Connection logging
- Environment detection
- Service status reporting

**Example**:

```typescript
// Server starts on configured PORT
// Logs: Server started on port 5000
```

---

#### **2. `gracefulShutdown()`**

**Purpose**: Clean shutdown of all services

**Shutdown Order**:

1. ✅ Stop scheduled jobs
2. ✅ Close background job queues
3. ✅ Close Redis connection
4. ✅ Disconnect Prisma database
5. ✅ Exit process

**Triggers**: `SIGINT`, `SIGTERM` signals

---

## 🏗️ Express Application

### **File**: `app.ts`

**Purpose**: Configure Express application with all middleware and routes.

### **Function**: `createApp()`

**Returns**: `Application` - Configured Express app

---

### **Middleware Stack** (Order Matters!)

#### **1. Request ID Middleware**

- **Purpose**: Add unique request ID to each request
- **Position**: First middleware
- **File**: `request-id.middleware.ts`

#### **2. Performance Monitoring**

- **Purpose**: Track request performance metrics
- **File**: `performance.middleware.ts`

#### **3. Security (Helmet)**

- **Purpose**: Set security HTTP headers
- **Features**: XSS protection, content security policy, etc.

#### **4. CORS**

- **Purpose**: Cross-origin resource sharing
- **Config**: `env.CORS_ORIGIN`, credentials enabled

#### **5. Rate Limiting**

- **Purpose**: Prevent API abuse
- **Types**: General, Auth, Admin rate limiters
- **File**: `rate-limit.middleware.ts`

#### **6. Compression**

- **Purpose**: Compress response bodies
- **Library**: `compression`

#### **7. Body Parsing**

- **JSON**: `express.json({ limit: "10mb" })`
- **URL Encoded**: `express.urlencoded({ extended: true, limit: "10mb" })`

#### **8. Session (OAuth)**

- **Purpose**: Session management for OAuth
- **Config**: Secure cookies, 24h expiry
- **Secret**: `env.JWT_SECRET`

#### **9. Passport**

- **Purpose**: OAuth authentication
- **Init**: `passport.initialize()`, `passport.session()`

#### **10. Logging (Morgan)**

- **Purpose**: HTTP request logging
- **Mode**: Development only

---

### **Health Check Endpoints**

#### **`GET /health`**

- **Purpose**: Basic health check
- **Response**: Status, uptime, environment, version, features

#### **`GET /ready`**

- **Purpose**: Readiness probe (Kubernetes)
- **Checks**: Database, Redis connectivity

#### **`GET /live`**

- **Purpose**: Liveness probe (Kubernetes)
- **Checks**: Application running

---

### **API Routes**

#### **Public Routes** (No Authentication)

```typescript
/api/v1/auth              # Authentication
/api/v1/auth/oauth         # OAuth (Google/Apple)
/api/v1/products           # Product listing
/api/v1/categories         # Categories
/api/v1/homepage           # Homepage sections
/api/v1/coupons            # Coupon validation
```

#### **Authenticated Routes** (User Required)

```typescript
/api/v1/cart               # Shopping cart
/api/v1/orders             # Order management
/api/v1/wishlist           # Wishlist
/api/v1/addresses          # User addresses
/api/v1/reviews            # Product reviews
/api/v1/users              # User profile
/api/v1/payments           # Payment processing
/api/v1/order-tracking     # Order tracking
```

#### **Admin Routes** (Admin Required)

```typescript
/api/v1/admin              # Admin operations
/api/v1/admin/products      # Product CRUD
/api/v1/admin/categories    # Category CRUD
/api/v1/admin/coupons       # Coupon CRUD
/api/v1/admin/homepage      # Homepage sections
/api/v1/analytics          # Analytics data
/api/v1/uploads             # File uploads
```

#### **Additional Routes**

```typescript
/api/v1/recommendations     # Product recommendations
/api/v1/stock-alerts        # Stock alerts
/api/v1/newsletter          # Newsletter subscription
/api/v1/returns             # Return requests
/api/v1/shipping            # Shipping calculations
/api/v1/support             # Support tickets
```

---

### **Error Handling**

#### **404 Handler**

- **File**: `error.middleware.ts`
- **Purpose**: Handle undefined routes

#### **Error Handler**

- **File**: `error.middleware.ts`
- **Purpose**: Global error handling
- **Features**: Error logging, formatted responses

---

## ⚙️ Configuration Files

### **File**: `config/env.ts`

**Purpose**: Centralized environment variable management

**Key Variables**:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `REDIS_URL` - Redis connection string
- `CORS_ORIGIN` - Allowed CORS origins
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `SENTRY_DSN` - Sentry error tracking
- `FRONTEND_URL` - Frontend application URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `APPLE_CLIENT_ID` - Apple Sign In client ID
- Email configuration (SMTP)
- Cloud storage (S3/Cloudinary)

**Validation**: All required variables validated on startup

---

### **File**: `config/database.ts`

**Purpose**: Prisma Client singleton with production-ready configuration

**Features**:

- ✅ Connection pooling (via DATABASE_URL)
- ✅ Query logging (development)
- ✅ Error handling
- ✅ Slow query detection (production)
- ✅ Graceful shutdown

**Usage**:

```typescript
import { prisma } from "./config/database";
const user = await prisma.user.findUnique({ where: { id } });
```

---

### **File**: `config/redis.ts`

**Purpose**: Redis connection management

**Functions**:

- `initRedis()` - Initialize Redis connection
- `getRedis()` - Get Redis client
- `closeRedis()` - Close connection

**Usage**: Caching, rate limiting, session storage

---

### **File**: `config/constants.ts`

**Purpose**: Application-wide constants

**Constants**:

- `API_PREFIX` - `/api/v1`
- `ERROR_MESSAGES` - Standardized error messages
- `SUCCESS_MESSAGES` - Success messages
- `HTTP_STATUS` - HTTP status codes
- `PASSWORD_RESET_TOKEN_EXPIRY_HOURS` - Token expiry

---

### **File**: `config/swagger.ts`

**Purpose**: Swagger/OpenAPI documentation setup

**Endpoint**: `/api/v1/docs`

**Features**:

- API documentation
- Interactive testing
- Schema definitions

---

### **File**: `config/sentry.ts`

**Purpose**: Sentry error tracking initialization

**Features**:

- Error capture
- Performance monitoring
- Release tracking

---

## 🔄 Background Jobs

### **File**: `jobs/email-queue.job.ts`

**Purpose**: Email queue management

**Functions**:

- `initEmailQueue()` - Initialize email queue
- `closeEmailQueue()` - Close queue

**Usage**: Async email sending

---

### **File**: `jobs/stock-alerts.job.ts`

**Purpose**: Stock alert notifications

**Functions**:

- `initStockAlertQueue()` - Initialize queue
- `closeStockAlertQueue()` - Close queue

**Usage**: Low stock notifications

---

### **File**: `jobs/scheduler.ts`

**Purpose**: Scheduled tasks

**Functions**:

- `initScheduler()` - Start scheduler
- `stopScheduler()` - Stop scheduler

**Tasks**: Daily reports, cleanup jobs, etc.

---

## 📊 Application Features

### **Production-Ready Features**

- ✅ **Connection Pooling** - Database connection management
- ✅ **Caching** - Redis-based caching
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Error Tracking** - Sentry integration
- ✅ **Logging** - Structured logging
- ✅ **Health Checks** - Kubernetes-ready
- ✅ **Graceful Shutdown** - Clean service termination
- ✅ **Background Jobs** - Async task processing
- ✅ **Scheduled Tasks** - Cron-like scheduling
- ✅ **Security** - Helmet, CORS, input validation
- ✅ **API Documentation** - Swagger/OpenAPI

---

## 🚀 Startup Sequence

1. **Initialize Sentry** (error tracking)
2. **Initialize Redis** (caching)
3. **Initialize Background Jobs** (email, stock alerts)
4. **Initialize Scheduler** (scheduled tasks)
5. **Connect Database** (Prisma)
6. **Start HTTP Server** (Express)
7. **Log Startup Info** (port, environment, services)

---

## 🔧 Development

### **Start Development Server**

```bash
cd backend
npm run dev
```

### **Build for Production**

```bash
npm run build
```

### **Start Production Server**

```bash
npm start
```

---

## 📝 Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/valuva_db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 🔗 Related Documentation

- [Authentication](./02-authentication.md)
- [Products & Categories](./03-products-categories.md)
- [Orders & Payments](./04-orders-payments.md)
- [Utilities & Middleware](./12-utilities-middleware.md)
- [Configuration](./13-configuration.md)

---

**Last Updated**: January 2025
