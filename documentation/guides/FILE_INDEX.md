# 📑 Complete File Index

**Index of all files in the codebase with their documentation locations.**

---

## 🔍 How to Use This Index

1. Find your file in the list below
2. Check the **Documentation** column for where it's documented
3. Navigate to that documentation file

**Legend**:

- ✅ = Fully documented
- 📝 = Partially documented
- ⏳ = Documentation pending
- 🔗 = See related documentation

---

## 📁 Backend Files

### **Core Application**

| File                  | Documentation                                                            | Status |
| --------------------- | ------------------------------------------------------------------------ | ------ |
| `server.ts`           | [Core Application](./backend/01-core-application.md#server-entry-point)  | ✅     |
| `app.ts`              | [Core Application](./backend/01-core-application.md#express-application) | ✅     |
| `config/env.ts`       | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |
| `config/database.ts`  | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |
| `config/redis.ts`     | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |
| `config/constants.ts` | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |
| `config/swagger.ts`   | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |
| `config/sentry.ts`    | [Core Application](./backend/01-core-application.md#configuration-files) | ✅     |

### **Authentication Module**

| File                               | Documentation                                                                | Status |
| ---------------------------------- | ---------------------------------------------------------------------------- | ------ |
| `modules/auth/auth.service.ts`     | [Authentication](./backend/02-authentication.md#core-authentication-service) | ✅     |
| `modules/auth/auth.controller.ts`  | [Authentication](./backend/02-authentication.md#authentication-controller)   | ✅     |
| `modules/auth/auth.routes.ts`      | [Authentication](./backend/02-authentication.md#routes)                      | ✅     |
| `modules/auth/auth.repository.ts`  | [Authentication](./backend/02-authentication.md)                             | 📝     |
| `modules/auth/auth.validation.ts`  | [Authentication](./backend/02-authentication.md#validation-schemas)          | ✅     |
| `modules/auth/oauth.service.ts`    | [Authentication](./backend/02-authentication.md#oauth-service)               | ✅     |
| `modules/auth/oauth.controller.ts` | [Authentication](./backend/02-authentication.md#oauth-controller)            | ✅     |
| `modules/auth/oauth.routes.ts`     | [Authentication](./backend/02-authentication.md#routes)                      | ✅     |
| `modules/auth/oauth.validation.ts` | [Authentication](./backend/02-authentication.md#validation-schemas)          | 📝     |

### **Products Module**

| File                                      | Documentation                                   | Status |
| ----------------------------------------- | ----------------------------------------------- | ------ |
| `modules/products/products.service.ts`    | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/products/products.controller.ts` | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/products/products.routes.ts`     | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/products/products.repository.ts` | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/products/products.validation.ts` | [Products](./backend/03-products-categories.md) | ⏳     |

### **Categories Module**

| File                                          | Documentation                                   | Status |
| --------------------------------------------- | ----------------------------------------------- | ------ |
| `modules/categories/categories.service.ts`    | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/categories/categories.controller.ts` | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/categories/categories.routes.ts`     | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/categories/categories.repository.ts` | [Products](./backend/03-products-categories.md) | ⏳     |
| `modules/categories/categories.validation.ts` | [Products](./backend/03-products-categories.md) | ⏳     |

### **Orders Module**

| File                                  | Documentation                             | Status |
| ------------------------------------- | ----------------------------------------- | ------ |
| `modules/orders/orders.service.ts`    | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/orders/orders.controller.ts` | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/orders/orders.routes.ts`     | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/orders/orders.repository.ts` | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/orders/orders.validation.ts` | [Orders](./backend/04-orders-payments.md) | ⏳     |

### **Payments Module**

| File                                          | Documentation                             | Status |
| --------------------------------------------- | ----------------------------------------- | ------ |
| `modules/payments/payments.service.ts`        | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/payments/payments.controller.ts`     | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/payments/payments.routes.ts`         | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/payments/payments.repository.ts`     | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/payments/payments.validation.ts`     | [Orders](./backend/04-orders-payments.md) | ⏳     |
| `modules/payments/shopify-payment.service.ts` | [Orders](./backend/04-orders-payments.md) | ⏳     |

### **Cart Module**

| File                              | Documentation                         | Status |
| --------------------------------- | ------------------------------------- | ------ |
| `modules/cart/cart.service.ts`    | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/cart/cart.controller.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/cart/cart.routes.ts`     | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/cart/cart.repository.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/cart/cart.validation.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |

### **Wishlist Module**

| File                                      | Documentation                         | Status |
| ----------------------------------------- | ------------------------------------- | ------ |
| `modules/wishlist/wishlist.service.ts`    | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/wishlist/wishlist.controller.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/wishlist/wishlist.routes.ts`     | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/wishlist/wishlist.repository.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |
| `modules/wishlist/wishlist.validation.ts` | [Cart](./backend/05-cart-wishlist.md) | ⏳     |

### **Reviews Module**

| File                                    | Documentation                      | Status |
| --------------------------------------- | ---------------------------------- | ------ |
| `modules/reviews/reviews.service.ts`    | [Reviews](./backend/06-reviews.md) | ⏳     |
| `modules/reviews/reviews.controller.ts` | [Reviews](./backend/06-reviews.md) | ⏳     |
| `modules/reviews/reviews.routes.ts`     | [Reviews](./backend/06-reviews.md) | ⏳     |
| `modules/reviews/reviews.repository.ts` | [Reviews](./backend/06-reviews.md) | ⏳     |
| `modules/reviews/reviews.validation.ts` | [Reviews](./backend/06-reviews.md) | ⏳     |

### **Users Module**

| File                                | Documentation                  | Status |
| ----------------------------------- | ------------------------------ | ------ |
| `modules/users/users.service.ts`    | [Users](./backend/07-users.md) | ⏳     |
| `modules/users/users.controller.ts` | [Users](./backend/07-users.md) | ⏳     |
| `modules/users/users.routes.ts`     | [Users](./backend/07-users.md) | ⏳     |
| `modules/users/users.repository.ts` | [Users](./backend/07-users.md) | ⏳     |
| `modules/users/users.validation.ts` | [Users](./backend/07-users.md) | ⏳     |

### **Addresses Module**

| File                                        | Documentation                  | Status |
| ------------------------------------------- | ------------------------------ | ------ |
| `modules/addresses/addresses.service.ts`    | [Users](./backend/07-users.md) | ⏳     |
| `modules/addresses/addresses.controller.ts` | [Users](./backend/07-users.md) | ⏳     |
| `modules/addresses/addresses.routes.ts`     | [Users](./backend/07-users.md) | ⏳     |
| `modules/addresses/addresses.repository.ts` | [Users](./backend/07-users.md) | ⏳     |
| `modules/addresses/addresses.validation.ts` | [Users](./backend/07-users.md) | ⏳     |

### **Admin Module**

| File                                           | Documentation                  | Status |
| ---------------------------------------------- | ------------------------------ | ------ |
| `modules/admin/admin.service.ts`               | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin.controller.ts`            | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin.routes.ts`                | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin.repository.ts`            | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin.validation.ts`            | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-mfa.service.ts`           | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-mfa.controller.ts`        | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-products.service.ts`      | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-products.controller.ts`   | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-categories.service.ts`    | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-categories.controller.ts` | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-coupons.service.ts`       | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-coupons.controller.ts`    | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-homepage.service.ts`      | [Admin](./backend/08-admin.md) | ⏳     |
| `modules/admin/admin-homepage.controller.ts`   | [Admin](./backend/08-admin.md) | ⏳     |

### **Analytics Module**

| File                                        | Documentation                          | Status |
| ------------------------------------------- | -------------------------------------- | ------ |
| `modules/analytics/analytics.service.ts`    | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/analytics/analytics.controller.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/analytics/analytics.routes.ts`     | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/analytics/analytics.repository.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/analytics/analytics.validation.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |

### **Order Tracking Module**

| File                                            | Documentation                          | Status |
| ----------------------------------------------- | -------------------------------------- | ------ |
| `modules/order-tracking/tracking.service.ts`    | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/order-tracking/tracking.controller.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/order-tracking/tracking.routes.ts`     | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/order-tracking/tracking.repository.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/order-tracking/tracking.validation.ts` | [Analytics](./backend/09-analytics.md) | ⏳     |
| `modules/order-tracking/tracking.types.ts`      | [Analytics](./backend/09-analytics.md) | ⏳     |

### **Recommendations Module**

| File                                                    | Documentation                                                     | Status |
| ------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| `modules/recommendations/recommendations.service.ts`    | [Analytics](./backend/09-analytics.md#recommendations-service)    | ✅     |
| `modules/recommendations/recommendations.controller.ts` | [Analytics](./backend/09-analytics.md#recommendations-controller) | ✅     |
| `modules/recommendations/recommendations.routes.ts`     | [Analytics](./backend/09-analytics.md#recommendations-routes)     | ✅     |

### **Support Module**

| File                                    | Documentation                              | Status |
| --------------------------------------- | ------------------------------------------ | ------ |
| `modules/support/support.service.ts`    | [Support](./backend/10-support-returns.md) | ⏳     |
| `modules/support/support.controller.ts` | [Support](./backend/10-support-returns.md) | ⏳     |
| `modules/support/support.routes.ts`     | [Support](./backend/10-support-returns.md) | ⏳     |

### **Returns Module**

| File                                    | Documentation                              | Status |
| --------------------------------------- | ------------------------------------------ | ------ |
| `modules/returns/returns.service.ts`    | [Support](./backend/10-support-returns.md) | ⏳     |
| `modules/returns/returns.controller.ts` | [Support](./backend/10-support-returns.md) | ⏳     |
| `modules/returns/returns.routes.ts`     | [Support](./backend/10-support-returns.md) | ⏳     |

### **Stock Alerts Module**

| File                                              | Documentation                                                                  | Status |
| ------------------------------------------------- | ------------------------------------------------------------------------------ | ------ |
| `modules/stock-alerts/stock-alerts.service.ts`    | [Remaining Modules](./backend/14-remaining-modules.md#stock-alerts-service)    | ✅     |
| `modules/stock-alerts/stock-alerts.controller.ts` | [Remaining Modules](./backend/14-remaining-modules.md#stock-alerts-controller) | ✅     |
| `modules/stock-alerts/stock-alerts.routes.ts`     | [Remaining Modules](./backend/14-remaining-modules.md#stock-alerts-routes)     | ✅     |

### **Uploads Module**

| File                                   | Documentation                                                            | Status |
| -------------------------------------- | ------------------------------------------------------------------------ | ------ |
| `modules/uploads/upload.service.ts`    | [Remaining Modules](./backend/14-remaining-modules.md#upload-service)    | ✅     |
| `modules/uploads/upload.controller.ts` | [Remaining Modules](./backend/14-remaining-modules.md#upload-controller) | ✅     |
| `modules/uploads/upload.routes.ts`     | [Remaining Modules](./backend/14-remaining-modules.md#upload-routes)     | ✅     |
| `modules/uploads/upload.interface.ts`  | [Remaining Modules](./backend/14-remaining-modules.md#upload-service)    | ✅     |

### **Coupons Module**

| File                                    | Documentation                                                             | Status |
| --------------------------------------- | ------------------------------------------------------------------------- | ------ |
| `modules/coupons/coupons.service.ts`    | [Remaining Modules](./backend/14-remaining-modules.md#coupons-service)    | ✅     |
| `modules/coupons/coupons.controller.ts` | [Remaining Modules](./backend/14-remaining-modules.md#coupons-controller) | ✅     |
| `modules/coupons/coupons.routes.ts`     | [Remaining Modules](./backend/14-remaining-modules.md#coupons-routes)     | ✅     |
| `modules/coupons/coupons.repository.ts` | [Remaining Modules](./backend/14-remaining-modules.md#coupons-service)    | ✅     |
| `modules/coupons/coupons.validation.ts` | [Remaining Modules](./backend/14-remaining-modules.md#coupons-service)    | ✅     |

### **Homepage Module**

| File                                      | Documentation                                                              | Status |
| ----------------------------------------- | -------------------------------------------------------------------------- | ------ |
| `modules/homepage/homepage.service.ts`    | [Remaining Modules](./backend/14-remaining-modules.md#homepage-service)    | ✅     |
| `modules/homepage/homepage.controller.ts` | [Remaining Modules](./backend/14-remaining-modules.md#homepage-controller) | ✅     |
| `modules/homepage/homepage.routes.ts`     | [Remaining Modules](./backend/14-remaining-modules.md#homepage-routes)     | ✅     |
| `modules/homepage/homepage.repository.ts` | [Remaining Modules](./backend/14-remaining-modules.md#homepage-service)    | ✅     |
| `modules/homepage/homepage.validation.ts` | [Remaining Modules](./backend/14-remaining-modules.md#homepage-service)    | ✅     |

### **Newsletter Module**

| File                                          | Documentation                                                                | Status |
| --------------------------------------------- | ---------------------------------------------------------------------------- | ------ |
| `modules/newsletter/newsletter.service.ts`    | [Remaining Modules](./backend/14-remaining-modules.md#newsletter-service)    | ✅     |
| `modules/newsletter/newsletter.controller.ts` | [Remaining Modules](./backend/14-remaining-modules.md#newsletter-controller) | ✅     |
| `modules/newsletter/newsletter.routes.ts`     | [Remaining Modules](./backend/14-remaining-modules.md#newsletter-routes)     | ✅     |

### **Shipping Module**

| File                                      | Documentation                        | Status |
| ----------------------------------------- | ------------------------------------ | ------ |
| `modules/shipping/shipping.service.ts`    | [Shipping](./backend/11-shipping.md) | ⏳     |
| `modules/shipping/shipping.controller.ts` | [Shipping](./backend/11-shipping.md) | ⏳     |
| `modules/shipping/shipping.routes.ts`     | [Shipping](./backend/11-shipping.md) | ⏳     |
| `modules/shipping/shiprocket.service.ts`  | [Shipping](./backend/11-shipping.md) | ⏳     |

### **Utilities**

| File                                   | Documentation                                                                    | Status |
| -------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| `utils/jwt.util.ts`                    | [Utilities](./backend/12-utilities-middleware.md#jwt-utility)                    | ✅     |
| `utils/password.util.ts`               | [Utilities](./backend/12-utilities-middleware.md#password-utility)               | ✅     |
| `utils/cache.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md#cache-utility)                  | ✅     |
| `utils/logger.util.ts`                 | [Utilities](./backend/12-utilities-middleware.md#logger-utility)                 | ✅     |
| `utils/error.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md#error-utility)                  | ✅     |
| `utils/response.util.ts`               | [Utilities](./backend/12-utilities-middleware.md#response-utility)               | ✅     |
| `utils/email.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md#email-utility)                  | ✅     |
| `utils/analytics.util.ts`              | [Utilities](./backend/12-utilities-middleware.md#analytics-utility)              | ✅     |
| `utils/audit-log.util.ts`              | [Utilities](./backend/12-utilities-middleware.md#audit-log-utility)              | ✅     |
| `utils/input-sanitizer.util.ts`        | [Utilities](./backend/12-utilities-middleware.md#input-sanitizer-utility)        | ✅     |
| `utils/slug.util.ts`                   | [Utilities](./backend/12-utilities-middleware.md#slug-utility)                   | ✅     |
| `utils/pagination.util.ts`             | [Utilities](./backend/12-utilities-middleware.md#pagination-utility)             | ✅     |
| `utils/query.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md)                                | 📝     |
| `utils/order.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md)                                | 📝     |
| `utils/product.util.ts`                | [Utilities](./backend/12-utilities-middleware.md)                                | 📝     |
| `utils/inventory-lock.util.ts`         | [Utilities](./backend/12-utilities-middleware.md#inventory-lock-utility)         | ✅     |
| `utils/order-state-machine.util.ts`    | [Utilities](./backend/12-utilities-middleware.md#order-state-machine-utility)    | ✅     |
| `utils/circuit-breaker.util.ts`        | [Utilities](./backend/12-utilities-middleware.md#circuit-breaker-utility)        | ✅     |
| `utils/retry.util.ts`                  | [Utilities](./backend/12-utilities-middleware.md#retry-utility)                  | ✅     |
| `utils/oauth-encryption.util.ts`       | [Utilities](./backend/12-utilities-middleware.md#oauth-encryption-utility)       | ✅     |
| `utils/full-text-search.util.ts`       | [Utilities](./backend/12-utilities-middleware.md#full-text-search-utility)       | ✅     |
| `utils/webhook-verification.util.ts`   | [Utilities](./backend/12-utilities-middleware.md#webhook-verification-utility)   | ✅     |
| `utils/payment-reconciliation.util.ts` | [Utilities](./backend/12-utilities-middleware.md#payment-reconciliation-utility) | ✅     |
| `utils/cache-invalidation.util.ts`     | [Utilities](./backend/12-utilities-middleware.md#cache-invalidation-utility)     | ✅     |
| `utils/email-templates/index.ts`       | [Utilities](./backend/12-utilities-middleware.md#email-templates)                | ✅     |
| `utils/email-templates/*.tsx`          | [Utilities](./backend/12-utilities-middleware.md#email-templates)                | ✅     |

### **Middleware**

| File                                        | Documentation                                                                 | Status |
| ------------------------------------------- | ----------------------------------------------------------------------------- | ------ |
| `middleware/auth.middleware.ts`             | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/rbac.middleware.ts`             | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/rate-limit.middleware.ts`       | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/rate-limit-redis.middleware.ts` | [Utilities](./backend/12-utilities-middleware.md#rate-limit-redis-middleware) | ✅     |
| `middleware/error.middleware.ts`            | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/validate.middleware.ts`         | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/validation.middleware.ts`       | [Utilities](./backend/12-utilities-middleware.md#validation-middleware)       | ✅     |
| `middleware/async.middleware.ts`            | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/performance.middleware.ts`      | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/request-id.middleware.ts`       | [Utilities](./backend/12-utilities-middleware.md#middleware)                  | ✅     |
| `middleware/compression.middleware.ts`      | [Utilities](./backend/12-utilities-middleware.md#compression-middleware)      | ✅     |
| `middleware/health.middleware.ts`           | [Utilities](./backend/12-utilities-middleware.md#health-middleware)           | ✅     |
| `middleware/security.middleware.ts`         | [Utilities](./backend/12-utilities-middleware.md#security-middleware)         | ✅     |
| `middleware/upload.middleware.ts`           | [Utilities](./backend/12-utilities-middleware.md#upload-middleware)           | ✅     |

### **Background Jobs**

| File                       | Documentation                                                        | Status |
| -------------------------- | -------------------------------------------------------------------- | ------ |
| `jobs/email-queue.job.ts`  | [Core Application](./backend/01-core-application.md#background-jobs) | ✅     |
| `jobs/stock-alerts.job.ts` | [Core Application](./backend/01-core-application.md#background-jobs) | ✅     |
| `jobs/scheduler.ts`        | [Core Application](./backend/01-core-application.md#background-jobs) | ✅     |

---

## 📁 Frontend Files

### **Core Application**

| File                     | Documentation                                                        | Status |
| ------------------------ | -------------------------------------------------------------------- | ------ |
| `app/layout.tsx`         | [Frontend Core](./frontend/01-core-application.md)                   | ⏳     |
| `app/page.tsx`           | [Frontend Core](./frontend/01-core-application.md)                   | ⏳     |
| `app/globals.css`        | [Frontend Core](./frontend/01-core-application.md)                   | ⏳     |
| `proxy.ts`               | [Frontend Core](./frontend/01-core-application.md#nextjs-proxy)      | ✅     |
| `types/index.ts`         | [Frontend Core](./frontend/01-core-application.md#typescript-types)  | ✅     |
| `lib/react-query.tsx`    | [Frontend Core](./frontend/01-core-application.md#react-query-setup) | ✅     |
| `lib/redux-provider.tsx` | [Frontend Core](./frontend/01-core-application.md#redux-store)       | ✅     |
| `cart/CartDrawer.tsx`    | [Shopping](./frontend/04-shopping.md#cart-drawer-component)          | ✅     |

### **Authentication Pages**

| File                                | Documentation                                    | Status |
| ----------------------------------- | ------------------------------------------------ | ------ |
| `app/(auth)/login/page.tsx`         | [Frontend Auth](./frontend/02-authentication.md) | ⏳     |
| `app/(auth)/register/page.tsx`      | [Frontend Auth](./frontend/02-authentication.md) | ⏳     |
| `app/(auth)/admin-login/page.tsx`   | [Frontend Auth](./frontend/02-authentication.md) | ⏳     |
| `app/(auth)/auth/callback/page.tsx` | [Frontend Auth](./frontend/02-authentication.md) | ⏳     |

### **Components**

| File                                       | Documentation                                      | Status |
| ------------------------------------------ | -------------------------------------------------- | ------ |
| `components/auth/oauth-buttons.tsx`        | [Frontend Auth](./frontend/02-authentication.md)   | ⏳     |
| `components/auth/oauth-error-boundary.tsx` | [Frontend Auth](./frontend/02-authentication.md)   | ⏳     |
| `components/ui/*`                          | [Frontend Components](./frontend/07-components.md) | ⏳     |

---

## 📚 Documentation Status Summary

- **✅ Fully Documented**: 60+ files (Core infrastructure, utilities, middleware, remaining modules)
- **📝 Partially Documented**: 5 files
- **⏳ Pending**: ~250 files (Mostly module service/controller/repository files that are documented in their module docs but marked as pending for individual file tracking)

---

## 🚀 Quick Navigation

- [Main Documentation Index](./README.md)
- [Backend Documentation](./backend/)
- [Frontend Documentation](./frontend/)
- [API Documentation](./api/)
- [Guides](./guides/)

---

**Last Updated**: January 2025
