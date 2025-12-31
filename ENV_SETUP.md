# Environment Variables Setup

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://valuva_user:valuva_pass@localhost:5432/valuva_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
# For production: CORS_ORIGIN=https://valuva.in

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Razorpay Payment Gateway (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Redis (Optional - for caching and background jobs)
REDIS_URL=redis://localhost:6379

# Sentry (Optional - for error tracking)
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=development

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/oauth/google/callback
# For production: GOOGLE_CALLBACK_URL=https://valuva.in/api/v1/auth/oauth/google/callback
```

## Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
# For production: NEXT_PUBLIC_API_URL=https://valuva.in

# Application URL (for SEO and OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: NEXT_PUBLIC_APP_URL=https://valuva.in
```

## Quick Start

1. **Install dependencies:**

   ```bash
   npm run install:all
   ```

2. **Set up database:**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Start development servers:**

   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 3000) concurrently.

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Start production servers:**
   ```bash
   npm run start
   ```

## Individual Commands

- **Backend only:**

  ```bash
  npm run dev:backend
  npm run build:backend
  npm run start:backend
  ```

- **Frontend only:**
  ```bash
  npm run dev:frontend
  npm run build:frontend
  npm run start:frontend
  ```
