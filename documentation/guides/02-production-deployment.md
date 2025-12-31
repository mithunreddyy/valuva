# 🚀 Production Deployment Guide

**Complete guide for deploying Valuva E-Commerce Platform to production.**

---

## 📋 Pre-Production Checklist

### **Code Quality**

- [ ] All TypeScript/ESLint errors resolved
- [ ] All tests passing (`npm run test` in backend)
- [ ] No console.log statements in production code
- [ ] Code review completed
- [ ] Security audit performed

### **Database**

- [ ] All migrations tested and applied
- [ ] Database backup strategy in place
- [ ] Connection pooling configured
- [ ] Indexes optimized for production queries

### **Environment Variables**

- [ ] All required environment variables documented
- [ ] Secrets stored securely (not in code)
- [ ] Production values configured
- [ ] CORS origins updated for production domain

### **Performance**

- [ ] Frontend bundle size optimized
- [ ] Images optimized and using CDN
- [ ] Caching strategy implemented
- [ ] Database queries optimized

### **Security**

- [ ] JWT secrets are strong and unique
- [ ] HTTPS/SSL certificates configured
- [ ] Rate limiting configured
- [ ] Helmet security headers enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints

### **Monitoring**

- [ ] Error tracking (Sentry) configured
- [ ] Logging strategy in place
- [ ] Health check endpoints tested
- [ ] Uptime monitoring configured

---

## 🔐 Environment Variables

### **Backend Production Environment Variables**

Create `.env` file in `backend/` directory:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/valuva_db?connection_limit=20&pool_timeout=20&connect_timeout=10

# JWT Secrets (MUST be strong, unique, 32+ characters)
JWT_SECRET=your-production-jwt-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=your-production-refresh-secret-minimum-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Update with your production frontend URL)
CORS_ORIGIN=https://valuva.in,https://www.valuva.in

# Frontend URL (for email links, redirects)
FRONTEND_URL=https://valuva.in

# Password Hashing
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Payment Gateway - Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Cloud Storage (Choose one: s3, cloudinary, or local)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OR for AWS S3
# STORAGE_PROVIDER=s3
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=valuva-production

# Redis (Optional but recommended for production)
REDIS_URL=redis://your-redis-host:6379
# OR
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@valuva.in

# Shipping Carrier (Optional)
SHIPPING_CARRIER=shiprocket
SHIPROCKET_EMAIL=your-email@example.com
SHIPROCKET_PASSWORD=your-password

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.valuva.in/api/v1/auth/google/callback

# Error Tracking - Sentry
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### **Frontend Production Environment Variables**

Create `.env.local` file in `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.valuva.in

# App URL
NEXT_PUBLIC_APP_URL=https://valuva.in

# OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

---

## 🗄️ Database Setup

### **1. Production Database**

```bash
# Connect to production PostgreSQL
psql -h your-db-host -U your-user -d postgres

# Create database
CREATE DATABASE valuva_db;

# Create user (if needed)
CREATE USER valuva_user WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE valuva_db TO valuva_user;
```

### **2. Run Migrations**

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (production)
npx prisma migrate deploy

# OR if using custom migration script
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### **3. Seed Initial Data (Optional)**

```bash
# Only run once in production
npm run prisma:seed
```

**⚠️ Warning**: Only seed if you need initial admin user or test data. Remove seed script after first deployment.

---

## 🏗️ Build Process

### **Backend Build**

```bash
cd backend

# Install dependencies
npm ci --production=false

# Build TypeScript
npm run build

# Generate Prisma Client
npm run prisma:generate

# Verify build
ls -la dist/
```

### **Frontend Build**

```bash
cd frontend

# Install dependencies
npm ci

# Build Next.js application
npm run build

# Verify build
ls -la .next/
```

---

## 🐳 Docker Deployment

### **Option 1: Docker Compose (Recommended for Single Server)**

```bash
cd backend

# Update docker-compose.yml with production environment variables
# Then run:
docker-compose up -d --build
```

**Update `docker-compose.yml` for production:**

```yaml
services:
  postgres:
    # ... existing config ...
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD} # Use strong password
    # Remove port mapping in production or use internal network only
    # ports:
    #   - "5432:5432"

  backend:
    # ... existing config ...
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      # ... other env vars ...
    # Remove volume mount in production
    # volumes:
    #   - .:/app
```

### **Option 2: Individual Docker Containers**

**Backend Dockerfile** (already exists):

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npm run build
RUN npm run prisma:generate

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 5000
CMD ["npm", "start"]
```

**Build and run:**

```bash
# Build backend image
cd backend
docker build -t valuva-backend:latest .

# Run backend container
docker run -d \
  --name valuva-backend \
  -p 5000:5000 \
  --env-file .env \
  valuva-backend:latest
```

**Frontend Dockerfile** (create if needed):

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Note**: Update `next.config.ts` to enable standalone output:

```typescript
output: 'standalone',
```

---

## ☁️ Cloud Platform Deployment

### **Vercel (Frontend - Recommended)**

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
cd frontend
vercel --prod
```

3. **Configure Environment Variables:**

   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables

4. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### **Railway / Render / Heroku (Backend)**

#### **Railway**

1. **Connect Repository:**

   - Go to Railway.app
   - New Project → Deploy from GitHub

2. **Configure:**

   - Root Directory: `backend`
   - Build Command: `npm run build && npm run prisma:generate`
   - Start Command: `npm start`

3. **Add PostgreSQL Service:**

   - Add PostgreSQL service
   - Link to backend service
   - Update `DATABASE_URL` automatically

4. **Environment Variables:**
   - Add all required environment variables in Railway dashboard

#### **Render**

1. **Create Web Service:**

   - New → Web Service
   - Connect GitHub repository

2. **Configure:**

   - Environment: `Node`
   - Build Command: `cd backend && npm ci && npm run build && npm run prisma:generate`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`

3. **Add PostgreSQL:**

   - New → PostgreSQL
   - Copy connection string to `DATABASE_URL`

4. **Environment Variables:**
   - Add all required variables

### **AWS / DigitalOcean / Linode (VPS)**

1. **Server Setup:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

2. **Clone and Build:**

```bash
# Clone repository
git clone https://github.com/your-username/valuva.git
cd valuva

# Backend
cd backend
npm ci
npm run build
npm run prisma:generate

# Frontend
cd ../frontend
npm ci
npm run build
```

3. **Configure PM2:**

```bash
# Backend PM2 config (ecosystem.config.js)
cd backend
pm2 start dist/server.js --name valuva-backend
pm2 save
pm2 startup
```

4. **Configure Nginx:**

**Backend Nginx Config** (`/etc/nginx/sites-available/valuva-api`):

```nginx
server {
    listen 80;
    server_name api.valuva.in;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Frontend Nginx Config** (`/etc/nginx/sites-available/valuva`):

```nginx
server {
    listen 80;
    server_name valuva.in www.valuva.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable sites:**

```bash
sudo ln -s /etc/nginx/sites-available/valuva-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/valuva /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **SSL with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d valuva.in -d www.valuva.in -d api.valuva.in
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Example**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd backend
          npm ci

      - name: Build
        run: |
          cd backend
          npm run build

      - name: Deploy to Railway/Render
        # Add deployment steps for your platform
        run: |
          echo "Deploy backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build
        run: |
          cd frontend
          npm run build

      - name: Deploy to Vercel
        # Add Vercel deployment steps
        run: |
          echo "Deploy frontend"
```

---

## ✅ Post-Deployment Verification

### **1. Health Checks**

```bash
# Backend health
curl https://api.valuva.in/health

# Frontend
curl https://valuva.in
```

### **2. API Endpoints**

```bash
# Test products endpoint
curl https://api.valuva.in/api/v1/products

# Test authentication
curl -X POST https://api.valuva.in/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### **3. Database**

```bash
# Check database connection
cd backend
npx prisma studio
# Or connect via psql
```

### **4. Frontend**

- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Images load from CDN/storage

---

## 📊 Monitoring & Maintenance

### **1. Error Tracking (Sentry)**

- Monitor errors in Sentry dashboard
- Set up alerts for critical errors
- Review error trends weekly

### **2. Logging**

```bash
# View backend logs (PM2)
pm2 logs valuva-backend

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **3. Performance Monitoring**

- Monitor API response times
- Track database query performance
- Monitor frontend Core Web Vitals
- Set up uptime monitoring (UptimeRobot, Pingdom)

### **4. Database Maintenance**

```bash
# Regular backups
pg_dump -h host -U user -d valuva_db > backup_$(date +%Y%m%d).sql

# Vacuum database (weekly)
psql -h host -U user -d valuva_db -c "VACUUM ANALYZE;"
```

### **5. Security Updates**

```bash
# Update dependencies regularly
npm audit
npm audit fix

# Update system packages
sudo apt update && sudo apt upgrade
```

---

## 🔒 Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Strong JWT secrets (32+ characters, random)
- [ ] Database credentials secured
- [ ] Environment variables not in code
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (if using sessions)
- [ ] Security headers (Helmet)
- [ ] Regular security audits
- [ ] Dependencies updated
- [ ] Secrets rotated periodically

---

## 🚨 Rollback Procedure

### **If Deployment Fails:**

1. **Backend Rollback:**

```bash
# Revert to previous version
git checkout previous-commit-hash
cd backend
npm ci
npm run build
pm2 restart valuva-backend
```

2. **Frontend Rollback:**

```bash
# Vercel: Use dashboard to rollback to previous deployment
# Or via CLI:
vercel rollback
```

3. **Database Rollback:**

```bash
# Revert last migration (if needed)
cd backend
npx prisma migrate resolve --rolled-back migration_name
```

---

## 📈 Performance Optimization

### **Backend**

- Enable Redis caching
- Optimize database queries
- Use connection pooling
- Enable compression
- Implement CDN for static assets

### **Frontend**

- Enable Next.js Image Optimization
- Use CDN for images
- Enable caching headers
- Optimize bundle size
- Lazy load components
- Use React.memo for expensive components

---

## 🧪 Testing Before Production

### **1. Local Production Build Test**

```bash
# Backend
cd backend
npm run build
npm start
# Test endpoints

# Frontend
cd frontend
npm run build
npm start
# Test in browser
```

### **2. Staging Environment**

- Deploy to staging first
- Test all features
- Load testing
- Security testing

### **3. Checklist**

- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Product browsing works
- [ ] Cart and checkout work
- [ ] Payment integration works
- [ ] Email notifications work
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] No console errors

---

## 📞 Support & Troubleshooting

### **Common Issues**

1. **Database Connection Error**

   - Check `DATABASE_URL` format
   - Verify database is accessible
   - Check firewall rules

2. **CORS Errors**

   - Verify `CORS_ORIGIN` includes frontend URL
   - Check frontend `NEXT_PUBLIC_API_URL`

3. **Build Failures**

   - Check Node.js version (18+)
   - Clear `node_modules` and rebuild
   - Check for TypeScript errors

4. **Environment Variables Not Loading**
   - Verify `.env` file exists
   - Check variable names match
   - Restart application after changes

---

## 📝 Next Steps After Deployment

1. **Set up monitoring alerts**
2. **Configure automated backups**
3. **Set up CI/CD pipeline**
4. **Document deployment process**
5. **Train team on deployment**
6. **Schedule regular maintenance**
7. **Plan for scaling**

---

**Last Updated**: January 2025

**For questions or issues, refer to:**

- [Getting Started Guide](./01-getting-started.md)
- [Configuration Documentation](../backend/13-configuration.md)
- [API Documentation](../api/01-api-overview.md)
