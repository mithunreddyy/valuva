# 🔐 Authentication & Authorization Module

**Complete documentation for all authentication-related files, functions, and APIs.**

---

## 📁 File Structure

```
backend/src/modules/auth/
├── auth.service.ts          # Core authentication business logic
├── auth.controller.ts        # HTTP request handlers
├── auth.routes.ts            # Express route definitions
├── auth.repository.ts        # Database access layer
├── auth.validation.ts        # Input validation schemas
├── oauth.service.ts          # OAuth (Google/Apple) service
├── oauth.controller.ts       # OAuth HTTP handlers
├── oauth.routes.ts           # OAuth route definitions
└── oauth.validation.ts       # OAuth validation schemas
```

---

## 🔑 Core Authentication Service

### **File**: `auth.service.ts`

**Purpose**: Handles all authentication business logic including registration, login, password reset, and email verification.

### **Class**: `AuthService`

#### **Constructor**

```typescript
constructor();
```

- Initializes `AuthRepository` instance

---

### **Methods**

#### **1. `register()`**

**Purpose**: Register a new user account

**Parameters**:

- `data`: Registration data object
  - `email: string` - User email address
  - `password: string` - User password
  - `firstName: string` - User first name
  - `lastName: string` - User last name
  - `phone?: string` - Optional phone number
- `ipAddress?: string` - User's IP address for analytics
- `userAgent?: string` - User's browser user agent

**Returns**: `Promise<{ user: Omit<User, "password">, accessToken: string, refreshToken: string }>`

**Features**:

- ✅ Input sanitization (email, names, phone)
- ✅ Password strength validation
- ✅ Email uniqueness check
- ✅ Password hashing with bcrypt
- ✅ JWT token generation (access + refresh)
- ✅ Welcome email sending
- ✅ Analytics tracking
- ✅ Audit logging

**Example**:

```typescript
const result = await authService.register(
  {
    email: "user@example.com",
    password: "SecurePass123!",
    firstName: "John",
    lastName: "Doe",
  },
  "192.168.1.1",
  "Mozilla/5.0..."
);
```

---

#### **2. `login()`**

**Purpose**: Authenticate user and generate tokens

**Parameters**:

- `email: string` - User email
- `password: string` - User password

**Returns**: `Promise<{ user: Omit<User, "password">, accessToken: string, refreshToken: string }>`

**Features**:

- ✅ Email lookup
- ✅ Account status check (active/inactive)
- ✅ Password verification
- ✅ JWT token generation
- ✅ Last login update

**Throws**: `UnauthorizedError` if credentials invalid or account inactive

**Example**:

```typescript
const result = await authService.login("user@example.com", "SecurePass123!");
```

---

#### **3. `refreshToken()`**

**Purpose**: Generate new access token using refresh token

**Parameters**:

- `refreshToken: string` - Valid refresh token

**Returns**: `Promise<{ accessToken: string, refreshToken: string }>`

**Features**:

- ✅ Refresh token validation
- ✅ User lookup
- ✅ Token matching verification
- ✅ New token pair generation

**Throws**: `UnauthorizedError` if token invalid or expired

**Example**:

```typescript
const tokens = await authService.refreshToken(refreshToken);
```

---

#### **4. `logout()`**

**Purpose**: Invalidate user's refresh token

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<void>`

**Features**:

- ✅ Refresh token removal from database

**Example**:

```typescript
await authService.logout(userId);
```

---

#### **5. `forgotPassword()`**

**Purpose**: Initiate password reset process

**Parameters**:

- `email: string` - User email

**Returns**: `Promise<void>`

**Features**:

- ✅ User lookup
- ✅ Password reset token generation
- ✅ Token expiry (24 hours)
- ✅ Reset email sending

**Throws**: `NotFoundError` if user not found

**Example**:

```typescript
await authService.forgotPassword("user@example.com");
```

---

#### **6. `resetPassword()`**

**Purpose**: Reset user password with token

**Parameters**:

- `token: string` - Password reset token
- `newPassword: string` - New password

**Returns**: `Promise<void>`

**Features**:

- ✅ Token validation
- ✅ Token expiry check
- ✅ Password hashing
- ✅ Password update

**Throws**: `UnauthorizedError` if token invalid or expired

**Example**:

```typescript
await authService.resetPassword(token, "NewSecurePass123!");
```

---

#### **7. `verifyEmail()`**

**Purpose**: Verify user email address

**Parameters**:

- `token: string` - Email verification token

**Returns**: `Promise<void>`

**Features**:

- ✅ Token validation
- ✅ Duplicate verification check
- ✅ Email verification status update

**Throws**: `UnauthorizedError` if token invalid, `ConflictError` if already verified

**Example**:

```typescript
await authService.verifyEmail(verificationToken);
```

---

#### **8. `resendVerificationEmail()`**

**Purpose**: Resend email verification link

**Parameters**:

- `userId: string` - User ID

**Returns**: `Promise<void>`

**Features**:

- ✅ User lookup
- ✅ Already verified check
- ✅ New verification token generation
- ✅ Verification email sending

**Throws**: `NotFoundError` if user not found, `ConflictError` if already verified

**Example**:

```typescript
await authService.resendVerificationEmail(userId);
```

---

## 🌐 OAuth Service

### **File**: `oauth.service.ts`

**Purpose**: Handles OAuth authentication (Google, Apple Sign In)

### **Class**: `OAuthService`

### **Interface**: `OAuthProfile`

```typescript
interface OAuthProfile {
  id: string; // Provider user ID
  email: string; // User email
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  picture?: string; // Profile picture URL
  provider: "google" | "apple"; // OAuth provider
}
```

---

### **Methods**

#### **1. `findOrCreateUser()`**

**Purpose**: Find existing OAuth account or create new user

**Parameters**:

- `profile: OAuthProfile` - OAuth provider profile data

**Returns**: `Promise<{ user: any, accessToken: string, refreshToken: string }>`

**Logic Flow**:

1. **Check OAuth Account**: Look for existing OAuth account by provider + providerId
   - If found: Update OAuth account info, update user lastLogin, generate tokens
2. **Check User Email**: If no OAuth account, check if user with email exists
   - If found: Link OAuth account to existing user, generate tokens
3. **Create New User**: If no existing user, create new user + OAuth account
   - Create user with empty password (OAuth users don't need password)
   - Create OAuth account linked to user
   - Generate tokens

**Features**:

- ✅ Automatic account linking (same email)
- ✅ OAuth account updates on login
- ✅ New user creation for OAuth
- ✅ Email auto-verification for OAuth users
- ✅ JWT token generation
- ✅ Name parsing utility

**Example**:

```typescript
const result = await oauthService.findOrCreateUser({
  id: "google_user_123",
  email: "user@gmail.com",
  firstName: "John",
  lastName: "Doe",
  picture: "https://...",
  provider: "google",
});
```

---

#### **2. `parseName()` (Private)**

**Purpose**: Parse and split name from OAuth provider

**Parameters**:

- `firstName?: string` - First name or full name
- `lastName?: string` - Last name

**Returns**: `{ firstName: string, lastName: string }`

**Logic**:

- If both provided: Return as-is
- If only firstName: Split by space, first part = firstName, rest = lastName
- If neither: Return "User" as firstName, empty lastName

---

## 🎮 Authentication Controller

### **File**: `auth.controller.ts`

**Purpose**: HTTP request handlers for authentication endpoints

### **Class**: `AuthController`

### **Methods**

#### **1. `register`**

- **Route**: `POST /api/v1/auth/register`
- **Validation**: `registerSchema`
- **Handler**: Calls `authService.register()`
- **Response**: 201 Created with user + tokens

#### **2. `login`**

- **Route**: `POST /api/v1/auth/login`
- **Validation**: `loginSchema`
- **Handler**: Calls `authService.login()`
- **Response**: 200 OK with user + tokens

#### **3. `refreshToken`**

- **Route**: `POST /api/v1/auth/refresh`
- **Validation**: `refreshTokenSchema`
- **Handler**: Calls `authService.refreshToken()`
- **Response**: 200 OK with new tokens

#### **4. `logout`**

- **Route**: `POST /api/v1/auth/logout`
- **Authentication**: Required
- **Handler**: Calls `authService.logout()`
- **Response**: 200 OK

#### **5. `forgotPassword`**

- **Route**: `POST /api/v1/auth/forgot-password`
- **Validation**: `forgotPasswordSchema`
- **Handler**: Calls `authService.forgotPassword()`
- **Response**: 200 OK

#### **6. `resetPassword`**

- **Route**: `POST /api/v1/auth/reset-password`
- **Validation**: `resetPasswordSchema`
- **Handler**: Calls `authService.resetPassword()`
- **Response**: 200 OK

#### **7. `verifyEmail`**

- **Route**: `GET /api/v1/auth/verify-email?token=...`
- **Handler**: Calls `authService.verifyEmail()`
- **Response**: 200 OK

#### **8. `resendVerification`**

- **Route**: `POST /api/v1/auth/resend-verification`
- **Authentication**: Required
- **Handler**: Calls `authService.resendVerificationEmail()`
- **Response**: 200 OK

---

## 🔄 OAuth Controller

### **File**: `oauth.controller.ts`

**Purpose**: HTTP handlers for OAuth callbacks

### **Methods**

#### **1. `handleOAuthCallback`**

- **Route**: `GET /api/v1/auth/oauth/:provider/callback`
- **Handler**: Processes OAuth profile, calls `oauthService.findOrCreateUser()`
- **Response**: Redirects to frontend with tokens in URL params

---

## 🛣️ Routes

### **File**: `auth.routes.ts`

**Route Definitions**:

```typescript
POST   /register              # User registration
POST   /login                 # User login
POST   /refresh               # Refresh access token
POST   /logout                # User logout (authenticated)
POST   /forgot-password       # Request password reset
POST   /reset-password        # Reset password with token
GET    /verify-email          # Verify email with token
POST   /resend-verification   # Resend verification email (authenticated)
```

### **File**: `oauth.routes.ts`

**Route Definitions**:

```typescript
GET    /google                # Initiate Google OAuth
GET    /google/callback        # Google OAuth callback
GET    /apple                 # Initiate Apple Sign In
GET    /apple/callback        # Apple Sign In callback
```

---

## ✅ Validation Schemas

### **File**: `auth.validation.ts`

**Schemas**:

- `registerSchema` - Email, password, firstName, lastName, phone validation
- `loginSchema` - Email, password validation
- `refreshTokenSchema` - Refresh token validation
- `forgotPasswordSchema` - Email validation
- `resetPasswordSchema` - Token, newPassword validation

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Access token (15min) + Refresh token (7 days)
3. **Input Sanitization**: All inputs sanitized before processing
4. **Password Strength**: Validated on registration/reset
5. **Token Expiry**: Password reset tokens expire in 24 hours
6. **Account Status**: Inactive accounts cannot login
7. **Email Verification**: Optional email verification flow
8. **OAuth Security**: Secure OAuth state encryption

---

## 📊 Database Models

### **User Model** (Prisma)

- `id`, `email`, `password`, `firstName`, `lastName`
- `phone`, `role`, `isEmailVerified`, `isActive`
- `refreshToken`, `passwordResetToken`, `passwordResetExpires`
- `emailVerificationToken`, `emailVerificationExpires`
- `lastLogin`, `createdAt`, `updatedAt`

### **OAuthAccount Model** (Prisma)

- `id`, `userId`, `provider`, `providerId`
- `email`, `firstName`, `lastName`, `picture`
- `accessToken`, `refreshToken`, `expiresAt`
- `createdAt`, `updatedAt`

---

## 🚀 Usage Examples

### **Registration**

```typescript
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### **Login**

```typescript
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### **OAuth (Google)**

```typescript
GET /api/v1/auth/oauth/google
# Redirects to Google OAuth
# Callback: /api/v1/auth/oauth/google/callback
```

---

## 🔗 Related Files

- **Middleware**: `auth.middleware.ts` - JWT authentication middleware
- **Utils**: `jwt.util.ts` - JWT token generation/verification
- **Utils**: `password.util.ts` - Password hashing/verification
- **Utils**: `input-sanitizer.util.ts` - Input sanitization
- **Utils**: `email.util.ts` - Email sending
- **Config**: `env.ts` - Environment variables

---

**Last Updated**: January 2025
