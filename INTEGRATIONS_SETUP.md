# Complete Integration Setup Guide

This document lists **all integrations** that need to be configured throughout the Valuva project.

## Total Integrations: **15**

---

## 🔴 **REQUIRED INTEGRATIONS** (Must Setup)

### 1. **PostgreSQL Database**

- **Purpose**: Primary database for all application data
- **Status**: ✅ Required
- **Configuration**:
  - `DATABASE_URL=postgresql://user:password@host:port/database`
- **Setup**: Use Postgres.app or Docker
- **Location**: `backend/.env`

---

### 2. **SMTP Email Service**

- **Purpose**: Send transactional emails (welcome, password reset, order confirmations, etc.)
- **Status**: ✅ Required for production
- **Configuration**:
  - `SMTP_HOST` - SMTP server hostname
  - `SMTP_PORT` - SMTP port (usually 587 or 465)
  - `SMTP_SECURE` - Use TLS/SSL (true/false)
  - `SMTP_USER` - SMTP username
  - `SMTP_PASS` - SMTP password
  - `SMTP_FROM` - From email address
- **Providers**: Gmail, SendGrid, Mailgun, AWS SES, etc.
- **Location**: `backend/.env`

---

## 🟡 **OPTIONAL BUT RECOMMENDED INTEGRATIONS**

### 3. **Razorpay Payment Gateway**

- **Purpose**: Process payments, refunds, and payment webhooks
- **Status**: 🟡 Optional (required for e-commerce functionality)
- **Configuration**:
  - `RAZORPAY_KEY_ID` - Razorpay API key ID
  - `RAZORPAY_KEY_SECRET` - Razorpay API secret
  - `RAZORPAY_WEBHOOK_SECRET` - Webhook verification secret
- **Setup**: Create account at https://razorpay.com
- **Location**: `backend/.env`

---

### 4. **Redis**

- **Purpose**: Caching, session storage, background job queues
- **Status**: 🟡 Optional (recommended for production)
- **Configuration**:
  - `REDIS_URL` - Full Redis connection URL (preferred)
  - OR `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` - Individual settings
- **Setup**: Local Redis, Redis Cloud, AWS ElastiCache, etc.
- **Location**: `backend/.env`

---

### 5. **Sentry Error Tracking**

- **Purpose**: Error monitoring, performance tracking, crash reporting
- **Status**: 🟡 Optional (highly recommended for production)
- **Configuration**:
  - `SENTRY_DSN` - Sentry Data Source Name
  - `SENTRY_ENVIRONMENT` - Environment name (development/production)
  - `SENTRY_TRACES_SAMPLE_RATE` - Performance monitoring sample rate
- **Setup**: Create account at https://sentry.io
- **Location**:
  - `backend/.env` (Backend)
  - `frontend/.env.local` (Frontend - auto-configured via @sentry/nextjs)

---

### 6. **Cloud Storage (AWS S3 or Cloudinary)**

- **Purpose**: Store product images, user uploads, media files
- **Status**: 🟡 Optional (defaults to local storage)
- **Configuration**:

  - `STORAGE_PROVIDER` - Choose: `s3`, `cloudinary`, or `local`

  **For AWS S3:**

  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `AWS_S3_BUCKET`

  **For Cloudinary:**

  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- **Setup**:
  - AWS S3: Create bucket in AWS Console
  - Cloudinary: Create account at https://cloudinary.com
- **Location**: `backend/.env`

---

### 7. **OAuth Providers (Google)**

- **Purpose**: Social login authentication
- **Status**: 🟡 Optional
- **Configuration**:
  - `GOOGLE_CLIENT_ID` - Google OAuth Client ID
  - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
  - `GOOGLE_CALLBACK_URL` - OAuth callback URL
- **Setup**:
  1. Go to https://console.cloud.google.com
  2. Create OAuth 2.0 credentials
  3. Add authorized redirect URIs
- **Location**: `backend/.env`

---

### 8. **OAuth Providers (Apple)**

- **Purpose**: Apple Sign In authentication
- **Status**: 🟡 Optional
- **Configuration**:
  - `APPLE_CLIENT_ID` - Apple Service ID
  - `APPLE_TEAM_ID` - Apple Developer Team ID
  - `APPLE_KEY_ID` - Apple Key ID
  - `APPLE_PRIVATE_KEY` - Apple Private Key (PEM format)
  - `APPLE_CALLBACK_URL` - OAuth callback URL
  - `OAUTH_ENCRYPTION_KEY` - Key for encrypting OAuth tokens
- **Setup**: Apple Developer Account required
- **Location**: `backend/.env`

---

### 9. **Web Push Notifications (VAPID)**

- **Purpose**: Browser push notifications for order updates, promotions, etc.
- **Status**: 🟡 Optional
- **Configuration**:
  - `VAPID_PUBLIC_KEY` - VAPID public key
  - `VAPID_PRIVATE_KEY` - VAPID private key
- **Setup**: Generate VAPID keys using `web-push` library
- **Location**: `backend/.env`

---

### 10. **Shipping Carriers**

- **Purpose**: Shipping label generation, tracking, rate calculation
- **Status**: 🟡 Optional
- **Configuration**:

  - `SHIPPING_CARRIER` - Choose: `shiprocket`, `delhivery`, `fedex`, `ups`, or `none`

  **For Shiprocket:**

  - `SHIPROCKET_EMAIL` - Shiprocket account email
  - `SHIPROCKET_PASSWORD` - Shiprocket account password

  **For Delhivery:**

  - `DELHIVERY_API_KEY` - Delhivery API key

- **Setup**:
  - Shiprocket: https://www.shiprocket.in
  - Delhivery: https://www.delhivery.com
- **Location**: `backend/.env`

---

### 11. **Vercel Analytics** (Frontend)

- **Purpose**: Web analytics and performance monitoring
- **Status**: 🟡 Optional (auto-enabled if deployed on Vercel)
- **Configuration**: Auto-configured when deployed to Vercel
- **Setup**: Deploy to Vercel or configure manually
- **Location**: `frontend/src/app/layout.tsx`

---

## 🟢 **OPTIONAL INTEGRATIONS** (Nice to Have)

### 12. **Prometheus Metrics**

- **Purpose**: Application metrics collection (HTTP, DB, business metrics)
- **Status**: 🟢 Optional (built-in, no external service needed)
- **Configuration**: Endpoint available at `/metrics`
- **Setup**: No external setup required
- **Location**: Built into backend

---

### 13. **Feature Flags**

- **Purpose**: Enable/disable features dynamically
- **Status**: 🟢 Optional (environment variable based)
- **Configuration**: Environment variables with `FEATURE_` prefix
- **Setup**: No external setup required
- **Location**: `backend/.env`

---

### 14. **API Response Caching**

- **Purpose**: Cache API responses for better performance
- **Status**: 🟢 Optional (built-in middleware)
- **Configuration**: Automatic for public GET endpoints
- **Setup**: No external setup required
- **Location**: Built into backend

---

### 15. **Database Query Performance Monitoring**

- **Purpose**: Track slow database queries
- **Status**: 🟢 Optional (built-in Prisma middleware)
- **Configuration**: Automatic logging of slow queries
- **Setup**: No external setup required
- **Location**: Built into backend

---

## 📋 **Summary by Priority**

### **Must Setup (2)**

1. PostgreSQL Database
2. SMTP Email Service

### **Highly Recommended (5)**

3. Razorpay Payment Gateway
4. Redis
5. Sentry Error Tracking
6. Cloud Storage (S3/Cloudinary)
7. OAuth Providers (Google/Apple)

### **Optional (8)**

8. Web Push Notifications
9. Shipping Carriers
10. Vercel Analytics
11. Prometheus Metrics
12. Feature Flags
13. API Response Caching
14. Database Query Performance Monitoring
15. Other monitoring/analytics tools

---

## 🔧 **Quick Setup Checklist**

### Backend Environment Variables (`backend/.env`)

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - JWT signing secret (min 32 chars)
- [ ] `JWT_REFRESH_SECRET` - JWT refresh secret (min 32 chars)
- [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - Email configuration
- [ ] `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - Payment gateway
- [ ] `REDIS_URL` or `REDIS_HOST` - Redis connection
- [ ] `SENTRY_DSN` - Error tracking
- [ ] `STORAGE_PROVIDER` + AWS/Cloudinary credentials - File storage
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth
- [ ] `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` - Push notifications
- [ ] `SHIPPING_CARRIER` + credentials - Shipping integration

### Frontend Environment Variables (`frontend/.env.local`)

- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL
- [ ] `NEXT_PUBLIC_APP_URL` - Frontend application URL

---

## 📚 **Additional Resources**

- See `ENV_SETUP.md` for detailed environment variable setup
- See `PRODUCTION_ENHANCEMENTS.md` for production features
- See `FRONTEND_ENHANCEMENTS.md` for frontend features

---

**Note**: Most integrations are optional and the application will work with just PostgreSQL and SMTP configured. However, for a production-ready e-commerce platform, it's recommended to set up at least the "Highly Recommended" integrations.
