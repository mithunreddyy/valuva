# ✅ Production Deployment Checklist

**Quick reference checklist for production deployment.**

---

## 🔴 Critical (Must Do Before Production)

- [ ] **Environment Variables**

  - [ ] All backend `.env` variables configured
  - [ ] All frontend `.env.local` variables configured
  - [ ] JWT secrets are strong (32+ characters, random)
  - [ ] Database URL configured
  - [ ] CORS origins updated to production domain
  - [ ] Payment gateway credentials configured

- [ ] **Database**

  - [ ] Production database created
  - [ ] All migrations applied (`prisma migrate deploy`)
  - [ ] Prisma client generated
  - [ ] Database backup strategy in place
  - [ ] Connection pooling configured

- [ ] **Security**

  - [ ] HTTPS/SSL certificates configured
  - [ ] Strong passwords for all services
  - [ ] Secrets not committed to git
  - [ ] Rate limiting enabled
  - [ ] CORS properly configured
  - [ ] Security headers enabled (Helmet)

- [ ] **Build & Test**
  - [ ] Backend builds successfully (`npm run build`)
  - [ ] Frontend builds successfully (`npm run build`)
  - [ ] All tests passing
  - [ ] No TypeScript/ESLint errors
  - [ ] Tested locally in production mode

---

## 🟡 Important (Should Do)

- [ ] **Monitoring**

  - [ ] Sentry error tracking configured
  - [ ] Logging strategy in place
  - [ ] Health check endpoints tested
  - [ ] Uptime monitoring configured

- [ ] **Performance**

  - [ ] Redis caching configured (optional but recommended)
  - [ ] CDN configured for images/assets
  - [ ] Database indexes optimized
  - [ ] Frontend bundle size optimized

- [ ] **Storage**

  - [ ] Cloud storage configured (Cloudinary/S3)
  - [ ] Image upload tested
  - [ ] File storage permissions correct

- [ ] **Email**
  - [ ] SMTP configured
  - [ ] Email templates tested
  - [ ] Password reset emails work
  - [ ] Order confirmation emails work

---

## 🟢 Nice to Have

- [ ] **CI/CD**

  - [ ] GitHub Actions workflow configured
  - [ ] Automated testing in pipeline
  - [ ] Automated deployment

- [ ] **Documentation**

  - [ ] API documentation updated
  - [ ] Deployment process documented
  - [ ] Runbook for common issues

- [ ] **Backup & Recovery**
  - [ ] Automated database backups
  - [ ] Backup restoration tested
  - [ ] Rollback procedure documented

---

## 📋 Pre-Launch Testing

- [ ] **Functionality**

  - [ ] User registration works
  - [ ] User login works
  - [ ] Product browsing works
  - [ ] Cart functionality works
  - [ ] Checkout process works
  - [ ] Payment processing works
  - [ ] Order confirmation works
  - [ ] Email notifications work

- [ ] **Responsive Design**

  - [ ] Mobile view tested
  - [ ] Tablet view tested
  - [ ] Desktop view tested
  - [ ] All pages responsive

- [ ] **Performance**

  - [ ] Page load times acceptable
  - [ ] API response times acceptable
  - [ ] Images load correctly
  - [ ] No console errors

- [ ] **Security**
  - [ ] Authentication required for protected routes
  - [ ] CSRF protection (if applicable)
  - [ ] Input validation works
  - [ ] SQL injection prevention verified

---

## 🚀 Deployment Steps

1. [ ] **Prepare Environment**

   - [ ] Set up production server/hosting
   - [ ] Configure domain names
   - [ ] Set up SSL certificates

2. [ ] **Database Setup**

   - [ ] Create production database
   - [ ] Run migrations
   - [ ] Seed initial data (if needed)

3. [ ] **Backend Deployment**

   - [ ] Build backend (`npm run build`)
   - [ ] Deploy to server
   - [ ] Configure environment variables
   - [ ] Start backend service
   - [ ] Verify health endpoint

4. [ ] **Frontend Deployment**

   - [ ] Build frontend (`npm run build`)
   - [ ] Deploy to hosting (Vercel/Netlify)
   - [ ] Configure environment variables
   - [ ] Verify deployment

5. [ ] **Post-Deployment**
   - [ ] Test all critical flows
   - [ ] Monitor error logs
   - [ ] Verify monitoring is working
   - [ ] Document any issues

---

## 🔍 Post-Launch Monitoring (First 24 Hours)

- [ ] Monitor error rates
- [ ] Check server resources (CPU, memory)
- [ ] Monitor database performance
- [ ] Check API response times
- [ ] Verify email delivery
- [ ] Monitor payment processing
- [ ] Check user registrations
- [ ] Review access logs

---

## 📝 Quick Commands Reference

```bash
# Backend
cd backend
npm ci
npm run build
npm run prisma:generate
npx prisma migrate deploy
npm start

# Frontend
cd frontend
npm ci
npm run build
npm start

# Database
npx prisma studio
pg_dump -h host -U user -d valuva_db > backup.sql

# Docker
docker-compose up -d --build
docker-compose logs -f
```

---

**Print this checklist and check off items as you complete them!**
