# 👤 Users Module

**Complete documentation for user management, profiles, and addresses files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/users/
├── users.service.ts          # User business logic
├── users.controller.ts       # HTTP request handlers
├── users.routes.ts           # Express route definitions
├── users.repository.ts       # Database access layer
└── users.validation.ts       # Input validation schemas

backend/src/modules/addresses/
├── addresses.service.ts      # Address business logic
├── addresses.controller.ts  # HTTP request handlers
├── addresses.routes.ts      # Express route definitions
├── addresses.repository.ts  # Database access layer
└── addresses.validation.ts  # Input validation schemas
```

---

## 👤 Users Service

### **File**: `users.service.ts`

**Purpose**: Handles user profile management and user operations.

### **Class**: `UsersService`

---

### **Methods**

#### **1. `getProfile()`**

**Purpose**: Get user profile

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<User>` - User profile (without password)

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
const profile = await usersService.getProfile(userId);
```

---

#### **2. `updateProfile()`**

**Purpose**: Update user profile

**Parameters**:

- `userId: string` - User ID
- `data: { firstName?, lastName?, phone?, dateOfBirth? }` - Update data

**Returns**: `Promise<User>` - Updated user profile

**Features**:

- ✅ Validates user exists
- ✅ Allows partial updates
- ✅ Excludes password from response

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
const profile = await usersService.updateProfile(userId, {
  firstName: "John",
  phone: "+1234567890",
});
```

---

#### **3. `changePassword()`**

**Purpose**: Change user password

**Parameters**:

- `userId: string` - User ID
- `currentPassword: string` - Current password
- `newPassword: string` - New password

**Returns**: `Promise<void>`

**Features**:

- ✅ Validates current password
- ✅ Hashes new password
- ✅ Updates password in database

**Throws**:

- `NotFoundError` if user not found
- `UnauthorizedError` if current password incorrect

**Example**:

```typescript
await usersService.changePassword(userId, "OldPassword123!", "NewPassword123!");
```

---

#### **4. `getUserStats()`**

**Purpose**: Get user statistics

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<UserStats>` - User statistics

**Features**:

- ✅ Order count
- ✅ Total spent
- ✅ Wishlist count
- ✅ Review count

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
const stats = await usersService.getUserStats(userId);
```

---

#### **5. `getAllUsers()`** (Admin)

**Purpose**: Get paginated list of all users

**Parameters**:

- `page: number` - Page number
- `limit: number` - Items per page
- `filters?: { isActive?, role?, search? }` - Filter options

**Returns**: `Promise<{ users: User[], total: number, page: number, limit: number }>`

**Features**:

- ✅ Admin-only operation
- ✅ Pagination support
- ✅ Filter by active status
- ✅ Filter by role
- ✅ Search by name/email

**Example**:

```typescript
const { users, total } = await usersService.getAllUsers(1, 20, {
  isActive: true,
  role: "USER",
});
```

---

#### **6. `getUserDetails()`** (Admin)

**Purpose**: Get detailed user information (Admin)

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<UserDetails>` - Detailed user information

**Features**:

- ✅ Admin-only operation
- ✅ Includes orders, addresses, reviews
- ✅ Complete user history

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
const details = await usersService.getUserDetails("user_123");
```

---

#### **7. `updateUserStatus()`** (Admin)

**Purpose**: Activate or deactivate user

**Parameters**:

- `userId: string` - User ID
- `isActive: boolean` - Active status

**Returns**: `Promise<User>` - Updated user

**Features**:

- ✅ Admin-only operation
- ✅ Prevents deactivated users from logging in

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
const user = await usersService.updateUserStatus("user_123", false);
```

---

## 🎮 Users Controller

### **File**: `users.controller.ts`

**Purpose**: HTTP request handlers for user endpoints

### **Methods**

#### **1. `getProfile`**

- **Route**: `GET /api/v1/users/me`
- **Authentication**: Required
- **Handler**: Calls `usersService.getProfile()`
- **Response**: User profile

#### **2. `updateProfile`**

- **Route**: `PUT /api/v1/users/me`
- **Authentication**: Required
- **Body**: `{ firstName?, lastName?, phone?, dateOfBirth? }`
- **Handler**: Calls `usersService.updateProfile()`
- **Response**: Updated profile

#### **3. `changePassword`**

- **Route**: `POST /api/v1/users/me/change-password`
- **Authentication**: Required
- **Body**: `{ currentPassword, newPassword }`
- **Handler**: Calls `usersService.changePassword()`
- **Response**: 200 OK

#### **4. `getUserStats`**

- **Route**: `GET /api/v1/users/me/stats`
- **Authentication**: Required
- **Handler**: Calls `usersService.getUserStats()`
- **Response**: User statistics

#### **5. `getAllUsers`** (Admin)

- **Route**: `GET /api/v1/admin/users`
- **Authentication**: Admin required
- **Query**: `page`, `limit`, `isActive?`, `role?`, `search?`
- **Handler**: Calls `usersService.getAllUsers()`
- **Response**: Paginated users

#### **6. `getUserDetails`** (Admin)

- **Route**: `GET /api/v1/admin/users/:id`
- **Authentication**: Admin required
- **Handler**: Calls `usersService.getUserDetails()`
- **Response**: User details

#### **7. `updateUserStatus`** (Admin)

- **Route**: `PUT /api/v1/admin/users/:id/status`
- **Authentication**: Admin required
- **Body**: `{ isActive: boolean }`
- **Handler**: Calls `usersService.updateUserStatus()`
- **Response**: Updated user

---

## 🛣️ Users Routes

### **File**: `users.routes.ts`

**Route Definitions**:

```typescript
# User Routes
GET    /me                    # Get profile
PUT    /me                    # Update profile
POST   /me/change-password     # Change password
GET    /me/stats              # Get user stats

# Admin Routes
GET    /admin/users           # Get all users
GET    /admin/users/:id       # Get user details
PUT    /admin/users/:id/status # Update user status
```

---

## 📍 Addresses Service

### **File**: `addresses.service.ts`

**Purpose**: Handles user address management

### **Class**: `AddressesService`

### **Methods**

#### **1. `getUserAddresses()`**

**Purpose**: Get all user addresses

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<Address[]>` - User addresses

**Example**:

```typescript
const addresses = await addressesService.getUserAddresses(userId);
```

---

#### **2. `createAddress()`**

**Purpose**: Create new address

**Parameters**:

- `userId: string` - User ID
- `data: AddressData` - Address data

**Returns**: `Promise<Address>` - Created address

**Features**:

- ✅ Validates address data
- ✅ Sets as default if first address

**Example**:

```typescript
const address = await addressesService.createAddress(userId, {
  type: "HOME",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  addressLine1: "123 Main St",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  country: "India",
});
```

---

#### **3. `updateAddress()`**

**Purpose**: Update address

**Parameters**:

- `addressId: string` - Address ID
- `userId: string` - User ID
- `data: AddressData` - Update data

**Returns**: `Promise<Address>` - Updated address

**Features**:

- ✅ Validates address belongs to user
- ✅ Allows partial updates

**Throws**:

- `NotFoundError` if address not found
- `ValidationError` if address doesn't belong to user

**Example**:

```typescript
const address = await addressesService.updateAddress("address_123", userId, {
  city: "Delhi",
});
```

---

#### **4. `deleteAddress()`**

**Purpose**: Delete address

**Parameters**:

- `addressId: string` - Address ID
- `userId: string` - User ID

**Returns**: `Promise<void>`

**Features**:

- ✅ Validates address belongs to user
- ✅ Prevents deletion if used in orders

**Throws**:

- `NotFoundError` if address not found
- `ValidationError` if address doesn't belong to user or is in use

**Example**:

```typescript
await addressesService.deleteAddress("address_123", userId);
```

---

#### **5. `setDefaultAddress()`**

**Purpose**: Set default address

**Parameters**:

- `addressId: string` - Address ID
- `userId: string` - User ID

**Returns**: `Promise<Address>` - Updated address

**Features**:

- ✅ Validates address belongs to user
- ✅ Unsets other default addresses
- ✅ Sets this address as default

**Throws**:

- `NotFoundError` if address not found
- `ValidationError` if address doesn't belong to user

**Example**:

```typescript
const address = await addressesService.setDefaultAddress("address_123", userId);
```

---

## 🎮 Addresses Controller

### **File**: `addresses.controller.ts`

**Purpose**: HTTP request handlers for address endpoints

### **Methods**

#### **1. `getAddresses`**

- **Route**: `GET /api/v1/addresses`
- **Authentication**: Required
- **Handler**: Calls `addressesService.getUserAddresses()`
- **Response**: Addresses array

#### **2. `createAddress`**

- **Route**: `POST /api/v1/addresses`
- **Authentication**: Required
- **Body**: Address data
- **Handler**: Calls `addressesService.createAddress()`
- **Response**: Created address (201 Created)

#### **3. `updateAddress`**

- **Route**: `PUT /api/v1/addresses/:id`
- **Authentication**: Required
- **Body**: Address data
- **Handler**: Calls `addressesService.updateAddress()`
- **Response**: Updated address

#### **4. `deleteAddress`**

- **Route**: `DELETE /api/v1/addresses/:id`
- **Authentication**: Required
- **Handler**: Calls `addressesService.deleteAddress()`
- **Response**: 204 No Content

#### **5. `setDefaultAddress`**

- **Route**: `PUT /api/v1/addresses/:id/default`
- **Authentication**: Required
- **Handler**: Calls `addressesService.setDefaultAddress()`
- **Response**: Updated address

---

## 🛣️ Addresses Routes

### **File**: `addresses.routes.ts`

**Route Definitions**:

```typescript
GET    /                      # Get user addresses
POST   /                      # Create address
PUT    /:id                   # Update address
DELETE /:id                   # Delete address
PUT    /:id/default           # Set default address
```

**All routes require authentication**

---

## 📊 Database Models

### **User Model** (Prisma)

- `id`, `email`, `password`, `firstName`, `lastName`
- `phone`, `dateOfBirth`, `role` (USER, ADMIN)
- `isEmailVerified`, `isActive`
- `refreshToken`, `lastLogin`
- `createdAt`, `updatedAt`
- Relations: `orders`, `addresses`, `reviews`, `wishlist`, `cart`

### **Address Model** (Prisma)

- `id`, `userId`, `type` (HOME, WORK, OTHER)
- `firstName`, `lastName`, `phone`
- `addressLine1`, `addressLine2`, `city`, `state`, `pincode`, `country`
- `isDefault`
- `createdAt`, `updatedAt`
- Relations: `user`, `orders` (shipping/billing)

---

## 🔍 Features

### **User Features**

1. **Profile Management**: Update personal information
2. **Password Change**: Secure password updates
3. **User Statistics**: Order count, total spent, etc.
4. **Admin Management**: User listing, details, status updates
5. **Role-Based Access**: USER and ADMIN roles

### **Address Features**

1. **Multiple Addresses**: Users can have multiple addresses
2. **Default Address**: One default address per user
3. **Address Types**: HOME, WORK, OTHER
4. **Order Integration**: Used for shipping and billing
5. **Validation**: Address validation and ownership checks

---

## 📝 Usage Examples

### **Get Profile**

```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

### **Update Profile**

```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "phone": "+1234567890"
}
```

### **Create Address**

```http
POST /api/v1/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "HOME",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "addressLine1": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India"
}
```

---

## 🔗 Related Files

- **Auth**: `modules/auth/auth.service.ts` - User authentication
- **Orders**: `modules/orders/orders.service.ts` - Uses addresses for orders
- **Password Util**: `utils/password.util.ts` - Password hashing

---

**Last Updated**: January 2025
