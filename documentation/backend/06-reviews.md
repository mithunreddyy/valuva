# ⭐ Reviews Module

**Complete documentation for product reviews and ratings files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/reviews/
├── reviews.service.ts          # Review business logic
├── reviews.controller.ts       # HTTP request handlers
├── reviews.routes.ts           # Express route definitions
├── reviews.repository.ts       # Database access layer
└── reviews.validation.ts        # Input validation schemas
```

---

## ⭐ Reviews Service

### **File**: `reviews.service.ts`

**Purpose**: Handles product review creation, management, and moderation.

### **Class**: `ReviewsService`

---

### **Methods**

#### **1. `createReview()`**

**Purpose**: Create new product review

**Parameters**:

- `userId: string` - User ID
- `productId: string` - Product ID
- `rating: number` - Rating (1-5)
- `comment: string` - Review comment
- `title?: string` - Optional review title

**Returns**: `Promise<Review>` - Created review

**Features**:

- ✅ Validates product exists
- ✅ Prevents duplicate reviews (one per user per product)
- ✅ Checks if user purchased product (for verified badge)
- ✅ Sets `isVerified: true` if user purchased
- ✅ Default `isApproved: false` (requires admin approval)

**Throws**:

- `NotFoundError` if product not found
- `ConflictError` if user already reviewed product

**Example**:

```typescript
const review = await reviewsService.createReview(
  userId,
  "prod_123",
  5,
  "Great product!",
  "Excellent quality"
);
```

---

#### **2. `getProductReviews()`**

**Purpose**: Get paginated reviews for a product

**Parameters**:

- `productId: string` - Product ID
- `page: number` - Page number
- `limit: number` - Items per page
- `rating?: number` - Filter by rating (1-5)

**Returns**: `Promise<{ reviews: Review[], total: number, page: number, limit: number }>`

**Features**:

- ✅ Only approved reviews
- ✅ Pagination support
- ✅ Optional rating filter
- ✅ Includes user information
- ✅ Sorted by creation date (newest first)

**Throws**: `NotFoundError` if product not found

**Example**:

```typescript
const { reviews, total } = await reviewsService.getProductReviews(
  "prod_123",
  1,
  20,
  5 // Only 5-star reviews
);
```

---

#### **3. `getUserReviews()`**

**Purpose**: Get paginated reviews by user

**Parameters**:

- `userId: string` - User ID
- `page: number` - Page number
- `limit: number` - Items per page

**Returns**: `Promise<{ reviews: Review[], total: number, page: number, limit: number }>`

**Features**:

- ✅ Pagination support
- ✅ Includes product information
- ✅ Sorted by creation date (newest first)

**Example**:

```typescript
const { reviews, total } = await reviewsService.getUserReviews(userId, 1, 20);
```

---

#### **4. `updateReview()`**

**Purpose**: Update user's own review

**Parameters**:

- `reviewId: string` - Review ID
- `userId: string` - User ID
- `data: { rating?: number, title?: string, comment?: string }` - Update data

**Returns**: `Promise<Review>` - Updated review

**Features**:

- ✅ Validates review belongs to user
- ✅ Allows partial updates
- ✅ Resets approval status (requires re-approval)

**Throws**:

- `NotFoundError` if review not found
- `ValidationError` if user doesn't own review

**Example**:

```typescript
const review = await reviewsService.updateReview("review_123", userId, {
  rating: 4,
  comment: "Updated comment",
});
```

---

#### **5. `deleteReview()`**

**Purpose**: Delete user's own review

**Parameters**:

- `reviewId: string` - Review ID
- `userId: string` - User ID

**Returns**: `Promise<void>`

**Features**:

- ✅ Validates review belongs to user
- ✅ Permanently deletes review

**Throws**:

- `NotFoundError` if review not found
- `ValidationError` if user doesn't own review

**Example**:

```typescript
await reviewsService.deleteReview("review_123", userId);
```

---

#### **6. `approveReview()`**

**Purpose**: Approve or reject review (Admin only)

**Parameters**:

- `reviewId: string` - Review ID
- `isApproved: boolean` - Approval status

**Returns**: `Promise<Review>` - Updated review

**Features**:

- ✅ Admin-only operation
- ✅ Updates approval status
- ✅ Controls review visibility

**Throws**: `NotFoundError` if review not found

**Example**:

```typescript
const review = await reviewsService.approveReview("review_123", true);
```

---

#### **7. `getAllReviewsForAdmin()`**

**Purpose**: Get all reviews for admin moderation

**Parameters**:

- `page: number` - Page number
- `limit: number` - Items per page
- `filters?: { isApproved?: boolean, rating?: number }` - Filter options

**Returns**: `Promise<{ reviews: Review[], total: number, page: number, limit: number }>`

**Features**:

- ✅ Admin-only operation
- ✅ Filter by approval status
- ✅ Filter by rating
- ✅ Includes user and product information
- ✅ Pagination support

**Example**:

```typescript
const { reviews, total } = await reviewsService.getAllReviewsForAdmin(1, 20, {
  isApproved: false,
  rating: 5,
});
```

---

## 🎮 Reviews Controller

### **File**: `reviews.controller.ts`

**Purpose**: HTTP request handlers for review endpoints

### **Methods**

#### **1. `createReview`**

- **Route**: `POST /api/v1/reviews`
- **Authentication**: Required
- **Body**: `{ productId, rating, comment, title? }`
- **Handler**: Calls `reviewsService.createReview()`
- **Response**: Created review (201 Created)

#### **2. `getProductReviews`**

- **Route**: `GET /api/v1/reviews/product/:productId`
- **Query**: `page`, `limit`, `rating?`
- **Handler**: Calls `reviewsService.getProductReviews()`
- **Response**: Paginated reviews

#### **3. `getUserReviews`**

- **Route**: `GET /api/v1/reviews/user`
- **Authentication**: Required
- **Query**: `page`, `limit`
- **Handler**: Calls `reviewsService.getUserReviews()`
- **Response**: Paginated reviews

#### **4. `updateReview`**

- **Route**: `PUT /api/v1/reviews/:id`
- **Authentication**: Required
- **Body**: `{ rating?, title?, comment? }`
- **Handler**: Calls `reviewsService.updateReview()`
- **Response**: Updated review

#### **5. `deleteReview`**

- **Route**: `DELETE /api/v1/reviews/:id`
- **Authentication**: Required
- **Handler**: Calls `reviewsService.deleteReview()`
- **Response**: 204 No Content

#### **6. `approveReview`** (Admin)

- **Route**: `PUT /api/v1/admin/reviews/:id/approve`
- **Authentication**: Admin required
- **Body**: `{ isApproved: boolean }`
- **Handler**: Calls `reviewsService.approveReview()`
- **Response**: Updated review

#### **7. `getAllReviews`** (Admin)

- **Route**: `GET /api/v1/admin/reviews`
- **Authentication**: Admin required
- **Query**: `page`, `limit`, `isApproved?`, `rating?`
- **Handler**: Calls `reviewsService.getAllReviewsForAdmin()`
- **Response**: Paginated reviews

---

## 🛣️ Reviews Routes

### **File**: `reviews.routes.ts`

**Route Definitions**:

```typescript
# User Routes
POST   /                      # Create review
GET    /product/:productId   # Get product reviews
GET    /user                 # Get user reviews
PUT    /:id                  # Update review
DELETE /:id                  # Delete review

# Admin Routes
GET    /admin                # Get all reviews (admin)
PUT    /admin/:id/approve    # Approve/reject review (admin)
```

---

## 💾 Reviews Repository

### **File**: `reviews.repository.ts`

**Purpose**: Database access layer for reviews

### **Class**: `ReviewsRepository`

### **Methods**

#### **1. `createReview()`**

**Purpose**: Create review in database

**Parameters**: `{ productId, userId, rating, title?, comment }`

**Returns**: `Promise<Review>`

**Features**:

- ✅ Includes user and product relations
- ✅ Sets default `isApproved: false`

---

#### **2. `findReviewById()`**

**Purpose**: Find review by ID

**Parameters**: `id: string`

**Returns**: `Promise<Review | null>`

---

#### **3. `findUserReviewForProduct()`**

**Purpose**: Check if user already reviewed product

**Parameters**: `userId: string, productId: string`

**Returns**: `Promise<Review | null>`

**Features**:

- ✅ Uses unique constraint `productId_userId`

---

#### **4. `getProductReviews()`**

**Purpose**: Get paginated product reviews

**Parameters**: `productId, skip, take, rating?`

**Returns**: `Promise<{ reviews: Review[], total: number }>`

**Features**:

- ✅ Only approved reviews
- ✅ Optional rating filter
- ✅ Includes user information
- ✅ Transaction for count + reviews

---

#### **5. `getUserReviews()`**

**Purpose**: Get paginated user reviews

**Parameters**: `userId, skip, take`

**Returns**: `Promise<{ reviews: Review[], total: number }>`

**Features**:

- ✅ Includes product information
- ✅ Transaction for count + reviews

---

#### **6. `updateReview()`**

**Purpose**: Update review

**Parameters**: `id: string, data: any`

**Returns**: `Promise<Review>`

---

#### **7. `deleteReview()`**

**Purpose**: Delete review

**Parameters**: `id: string`

**Returns**: `Promise<void>`

---

#### **8. `checkUserPurchasedProduct()`**

**Purpose**: Check if user purchased product

**Parameters**: `userId: string, productId: string`

**Returns**: `Promise<boolean>`

**Features**:

- ✅ Checks for DELIVERED orders
- ✅ Used for verified purchase badge

---

#### **9. `getAllReviewsForAdmin()`**

**Purpose**: Get all reviews for admin

**Parameters**: `skip, take, filters?`

**Returns**: `Promise<{ reviews: Review[], total: number }>`

**Features**:

- ✅ Filter by approval status
- ✅ Filter by rating
- ✅ Includes user and product information

---

## 📊 Database Models

### **Review Model** (Prisma)

- `id`, `productId`, `userId`
- `rating` (1-5), `title`, `comment`
- `isApproved` (default: false)
- `isVerified` (default: false) - Verified purchase badge
- `createdAt`, `updatedAt`
- Relations: `product`, `user`
- Unique: `productId_userId`

---

## 🔍 Features

### **Review Features**

1. **One Review Per User**: Prevents duplicate reviews
2. **Rating System**: 1-5 star rating
3. **Moderation**: Admin approval required
4. **Verified Purchase**: Badge for verified purchases
5. **Pagination**: Efficient pagination support
6. **Filtering**: Filter by rating
7. **User Ownership**: Users can only edit/delete own reviews

---

## 📝 Usage Examples

### **Create Review**

```http
POST /api/v1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "prod_123",
  "rating": 5,
  "title": "Excellent product",
  "comment": "Great quality and fast delivery!"
}
```

### **Get Product Reviews**

```http
GET /api/v1/reviews/product/prod_123?page=1&limit=20&rating=5
```

### **Update Review**

```http
PUT /api/v1/reviews/review_123
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}
```

---

## 🔗 Related Files

- **Products**: `modules/products/products.service.ts` - Product information
- **Orders**: `modules/orders/orders.service.ts` - Purchase verification
- **Admin**: `modules/admin/admin.controller.ts` - Review moderation

---

**Last Updated**: January 2025
