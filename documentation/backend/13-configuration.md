# ⚙️ Configuration & Setup

**Complete documentation for environment variables, database configuration, Redis setup, and all configuration files.**

---

## 📁 Configuration Files

```
backend/src/config/
├── env.ts                 # Environment variables
├── database.ts            # Prisma client configuration
├── redis.ts               # Redis connection
├── constants.ts           # Application constants
├── swagger.ts             # API documentation setup
└── sentry.ts              # Error tracking setup
```

---

## 🔐 Environment Variables

### **File**: `config/env.ts`

**Purpose**: Centralized environment variable management and validation

### **Variables**

#### **Database**

- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Required: Yes

#### **JWT Authentication**

- `JWT_SECRET` - JWT access token secret

  - Required: Yes
  - Min Length: 32 characters

- `JWT_REFRESH_SECRET` - JWT refresh token secret

  - Required: Yes
  - Min Length: 32 characters

- `JWT_EXPIRES_IN` - Access token expiry (default: "15m")
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiry (default: "7d")

#### **Server**

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, production, test)
- `CORS_ORIGIN` - Allowed CORS origins (comma-separated)

#### **Redis**

- `REDIS_URL` - Redis connection string
  - Format: `redis://host:port` or `redis://:password@host:port`
  - Optional: Falls back to in-memory cache

#### **Frontend**

- `FRONTEND_URL` - Frontend application URL
  - Used for email links and redirects
  - Default: `http://localhost:3000`

#### **OAuth**

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL

- `APPLE_CLIENT_ID` - Apple Sign In client ID
- `APPLE_TEAM_ID` - Apple team ID
- `APPLE_KEY_ID` - Apple key ID
- `APPLE_PRIVATE_KEY` - Apple private key
- `APPLE_CALLBACK_URL` - Apple callback URL

#### **Email**

- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - From email address

#### **Cloud Storage**

- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

- `AWS_S3_BUCKET` - S3 bucket name
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region

#### **Payment Gateways**

- `SHOPIFY_STORE_URL` - Shopify store URL
- `SHOPIFY_API_KEY` - Shopify API key
- `SHOPIFY_API_SECRET` - Shopify API secret

#### **Shipping**

- `SHIPPING_CARRIER` - Shipping carrier (shiprocket, etc.)
- `SHIPROCKET_EMAIL` - Shiprocket email
- `SHIPROCKET_PASSWORD` - Shiprocket password
- `SHIPPING_PICKUP_PINCODE` - Pickup location pincode

#### **Error Tracking**

- `SENTRY_DSN` - Sentry DSN for error tracking
  - Optional: Error tracking disabled if not provided

#### **Password Hashing**

- `BCRYPT_ROUNDS` - bcrypt salt rounds (default: 10)

#### **Admin**

- `ADMIN_EMAIL` - Default admin email (for seeding)
- `ADMIN_PASSWORD` - Default admin password (for seeding)

---

### **Validation**

All required variables are validated on application startup. Missing variables will cause the application to fail with clear error messages.

---

## 💾 Database Configuration

### **File**: `config/database.ts`

**Purpose**: Prisma Client singleton with production-ready configuration

### **Features**

#### **1. Connection Pooling**

- Configured via `DATABASE_URL` query parameters
- Recommended: `?connection_limit=20&pool_timeout=20&connect_timeout=10`

#### **2. Query Logging**

- **Development**: Logs all queries, errors, warnings
- **Production**: Logs only errors

#### **3. Slow Query Detection**

- Logs queries taking > 1 second
- Includes model, action, and duration

#### **4. Error Handling**

- Connection error logging
- Graceful error handling

#### **5. Graceful Shutdown**

- Disconnects on process exit
- Clean connection closure

**Usage**:

```typescript
import { prisma } from "./config/database";

const user = await prisma.user.findUnique({ where: { id } });
```

---

## 🔴 Redis Configuration

### **File**: `config/redis.ts`

**Purpose**: Redis connection management

### **Functions**

#### **1. `initRedis()`**

**Purpose**: Initialize Redis connection

**Features**:

- ✅ Connects to Redis server
- ✅ Error handling
- ✅ Connection retry logic
- ✅ Graceful fallback if Redis unavailable

#### **2. `getRedis()`**

**Purpose**: Get Redis client instance

**Returns**: `RedisClient | null`

**Usage**:

```typescript
const redis = getRedis();
if (redis) {
  await redis.set("key", "value");
}
```

#### **3. `closeRedis()`**

**Purpose**: Close Redis connection

**Features**:

- ✅ Graceful connection closure
- ✅ Used during shutdown

---

## 📋 Constants

### **File**: `config/constants.ts`

**Purpose**: Application-wide constants

### **Constants**

#### **API Configuration**

- `API_PREFIX` - `/api/v1`

#### **Error Messages**

- `ERROR_MESSAGES` - Standardized error messages
  - `EMAIL_EXISTS` - "Email already exists"
  - `INVALID_CREDENTIALS` - "Invalid email or password"
  - `INVALID_TOKEN` - "Invalid or expired token"
  - `CART_EMPTY` - "Cart is empty"
  - `INSUFFICIENT_STOCK` - "Insufficient stock"
  - `INVALID_COUPON` - "Invalid coupon code"

#### **Success Messages**

- `SUCCESS_MESSAGES` - Standardized success messages
  - `REGISTER` - "Registration successful"
  - `LOGIN` - "Login successful"
  - `LOGOUT` - "Logout successful"
  - `PASSWORD_RESET_REQUEST` - "Password reset email sent"
  - `PASSWORD_RESET_SUCCESS` - "Password reset successful"

#### **HTTP Status Codes**

- `HTTP_STATUS` - HTTP status code constants
  - `OK: 200`
  - `CREATED: 201`
  - `BAD_REQUEST: 400`
  - `UNAUTHORIZED: 401`
  - `FORBIDDEN: 403`
  - `NOT_FOUND: 404`
  - `CONFLICT: 409`
  - `INTERNAL_SERVER_ERROR: 500`

#### **Token Expiry**

- `PASSWORD_RESET_TOKEN_EXPIRY_HOURS` - 24 hours

---

## 📚 Swagger Configuration

### **File**: `config/swagger.ts`

**Purpose**: Swagger/OpenAPI documentation setup

### **Function**: `setupSwagger(app)`

**Features**:

- ✅ Swagger UI at `/api/v1/docs`
- ✅ API schema generation
- ✅ Interactive API testing
- ✅ Request/response examples

**Configuration**:

- API title, version, description
- Server URLs
- Authentication schemes
- Tag organization

---

## 🐛 Sentry Configuration

### **File**: `config/sentry.ts`

**Purpose**: Error tracking and monitoring

### **Function**: `initSentry()`

**Features**:

- ✅ Error capture
- ✅ Performance monitoring
- ✅ Release tracking
- ✅ Environment tagging
- ✅ User context

**Configuration**:

- DSN from environment
- Environment detection
- Release version
- Sample rate

---

## 📝 Environment File Template

### **`.env.example`**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/valuva_db

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# Frontend
FRONTEND_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=/api/v1/auth/oauth/google/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@valuva.com

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment (Shopify)
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret

# Shipping
SHIPPING_CARRIER=shiprocket
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password
SHIPPING_PICKUP_PINCODE=110001

# Error Tracking
SENTRY_DSN=your-sentry-dsn

# Admin (for seeding)
ADMIN_EMAIL=admin@valuva.com
ADMIN_PASSWORD=Admin@123

# Password Hashing
BCRYPT_ROUNDS=10
```

---

## 🔧 Setup Instructions

### **1. Copy Environment File**

```bash
cp .env.example .env
```

### **2. Configure Variables**

Edit `.env` file with your values:

- Database connection string
- JWT secrets (generate secure random strings)
- OAuth credentials
- Email SMTP settings
- Cloud storage credentials

### **3. Generate JWT Secrets**

```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **4. Run Migrations**

```bash
npm run prisma:migrate
```

### **5. Generate Prisma Client**

```bash
npm run prisma:generate
```

### **6. Seed Database** (Optional)

```bash
npm run prisma:seed
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong secrets** - Minimum 32 characters for JWT secrets
3. **Rotate secrets regularly** - Change secrets periodically
4. **Use different secrets** - Different secrets for development/production
5. **Limit CORS origins** - Only allow trusted origins
6. **Secure database** - Use strong database passwords
7. **Enable SSL** - Use SSL for database connections in production

---

## 📊 Configuration Validation

All configuration is validated on startup:

- ✅ Required variables checked
- ✅ Format validation (URLs, emails, etc.)
- ✅ Type validation (numbers, booleans)
- ✅ Range validation (ports, etc.)

**Errors**: Application will fail to start with clear error messages if configuration is invalid.

---

## 🔗 Related Documentation

- [Core Application](./01-core-application.md)
- [Database Setup](../guides/01-getting-started.md)
- [Deployment Guide](../guides/03-deployment.md)

---

**Last Updated**: January 2025
