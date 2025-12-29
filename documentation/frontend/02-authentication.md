# 🔐 Frontend Authentication

**Complete documentation for authentication pages, components, hooks, and OAuth integration.**

---

## 📁 File Structure

```
frontend/src/app/(auth)/
├── login/page.tsx                # Login page
├── register/page.tsx              # Registration page
├── admin-login/page.tsx          # Admin login page
├── forgot-password/page.tsx      # Forgot password page
├── reset-password/page.tsx       # Reset password page
├── verify-email/page.tsx         # Email verification page
└── auth/callback/page.tsx        # OAuth callback page

frontend/src/components/auth/
├── oauth-buttons.tsx             # OAuth sign-in buttons
└── oauth-error-boundary.tsx      # OAuth error handling

frontend/src/hooks/
└── use-oauth.ts                  # OAuth hook

frontend/src/services/
└── auth.service.ts               # Authentication service
```

---

## 🔑 Login Page

### **File**: `app/(auth)/login/page.tsx`

**Purpose**: User login page

**Features**:

- ✅ **Email/Password Login**: Standard login form
- ✅ **OAuth Buttons**: Google and Apple Sign In
- ✅ **Password Toggle**: Show/hide password
- ✅ **Form Validation**: React Hook Form + Zod
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Button loading indicators
- ✅ **Redirect**: Redirects to dashboard on success
- ✅ **Remember Me**: Optional remember me checkbox

**Components Used**:

- `PasswordInput` - Password input with toggle
- `OAuthButtons` - Social login buttons
- `Button`, `Input`, `Label` - UI components

**Form Fields**:

- `email` - Email address (required, email format)
- `password` - Password (required, min 8 chars)
- `rememberMe` - Remember me checkbox (optional)

---

## 📝 Register Page

### **File**: `app/(auth)/register/page.tsx`

**Purpose**: User registration page

**Features**:

- ✅ **Registration Form**: Full registration form
- ✅ **OAuth Buttons**: Google and Apple Sign In
- ✅ **Password Toggle**: Show/hide password
- ✅ **Password Strength**: Visual password strength indicator
- ✅ **Form Validation**: Comprehensive validation
- ✅ **Email Verification**: Email verification flow
- ✅ **Auto Login**: Automatic login after registration

**Form Fields**:

- `firstName` - First name (required)
- `lastName` - Last name (required)
- `email` - Email address (required, email format, unique)
- `password` - Password (required, min 8 chars, strength validation)
- `confirmPassword` - Password confirmation (must match)
- `phone` - Phone number (optional)
- `agreeToTerms` - Terms agreement (required)

---

## 👑 Admin Login Page

### **File**: `app/(auth)/admin-login/page.tsx`

**Purpose**: Admin login page with MFA support

**Features**:

- ✅ **Admin Login**: Email/password login
- ✅ **MFA Support**: Two-step authentication
- ✅ **MFA Token Input**: TOTP token input field
- ✅ **Password Toggle**: Show/hide password
- ✅ **Error Handling**: Admin-specific error messages
- ✅ **Redirect**: Redirects to admin dashboard

**MFA Flow**:

1. Enter email and password
2. If MFA enabled, show token input
3. Enter MFA token from authenticator app
4. Complete login

---

## 🔄 OAuth Callback

### **File**: `app/(auth)/auth/callback/page.tsx`

**Purpose**: Handles OAuth redirects from providers

**Features**:

- ✅ **Token Parsing**: Extracts tokens from URL
- ✅ **State Verification**: Verifies OAuth state
- ✅ **Token Storage**: Stores tokens securely
- ✅ **User Data**: Updates auth store with user data
- ✅ **Redirect**: Redirects to dashboard or original page
- ✅ **Error Handling**: Handles OAuth errors gracefully

**Query Parameters**:

- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `success` - Success status
- `error` - Error message (if failed)

---

## 🔘 OAuth Buttons Component

### **File**: `components/auth/oauth-buttons.tsx`

**Purpose**: Social login buttons (Google, Apple)

**Features**:

- ✅ **Google Sign In**: Google OAuth button
- ✅ **Apple Sign In**: Apple Sign In button (placeholder)
- ✅ **Loading States**: Button loading indicators
- ✅ **Error Handling**: Error boundary integration
- ✅ **Responsive**: Mobile, tablet, desktop layouts
- ✅ **Accessibility**: ARIA labels and keyboard navigation

**Props**:

```typescript
interface OAuthButtonsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  variant?: "default" | "outline";
}
```

**Usage**:

```tsx
<OAuthButtons 
  onSuccess={() => router.push("/dashboard")}
  onError={(error) => toast.error(error.message)}
/>
```

---

## 🛡️ OAuth Error Boundary

### **File**: `components/auth/oauth-error-boundary.tsx`

**Purpose**: Catches and handles OAuth errors

**Features**:

- ✅ **Error Catching**: Catches React errors
- ✅ **User-Friendly Messages**: Displays readable error messages
- ✅ **Retry Functionality**: Allows retry
- ✅ **Error Logging**: Logs errors for debugging

**Usage**:

```tsx
<OAuthErrorBoundary>
  <OAuthButtons />
</OAuthErrorBoundary>
```

---

## 🪝 OAuth Hook

### **File**: `hooks/use-oauth.ts`

**Purpose**: Reusable OAuth logic

**Features**:

- ✅ **Google Sign In**: Initiates Google OAuth
- ✅ **Apple Sign In**: Initiates Apple Sign In (placeholder)
- ✅ **Loading State**: Loading state management
- ✅ **Error Handling**: Error state management

**Usage**:

```typescript
const { handleGoogleSignIn, handleAppleSignIn, isLoading, error } = useOAuth();

await handleGoogleSignIn();
```

---

## 🔧 Auth Service

### **File**: `services/auth.service.ts`

**Purpose**: Authentication API service

**Methods**:

#### **1. `login()`**

**Purpose**: User login

**Parameters**: `{ email: string, password: string }`

**Returns**: `Promise<{ user, accessToken, refreshToken }>`

---

#### **2. `register()`**

**Purpose**: User registration

**Parameters**: `{ email, password, firstName, lastName, phone? }`

**Returns**: `Promise<{ user, accessToken, refreshToken }>`

---

#### **3. `logout()`**

**Purpose**: User logout

**Returns**: `Promise<void>`

---

#### **4. `refreshToken()`**

**Purpose**: Refresh access token

**Parameters**: `refreshToken: string`

**Returns**: `Promise<{ accessToken, refreshToken }>`

---

#### **5. `forgotPassword()`**

**Purpose**: Request password reset

**Parameters**: `email: string`

**Returns**: `Promise<void>`

---

#### **6. `resetPassword()`**

**Purpose**: Reset password with token

**Parameters**: `{ token: string, newPassword: string }`

**Returns**: `Promise<void>`

---

#### **7. `verifyEmail()`**

**Purpose**: Verify email address

**Parameters**: `token: string`

**Returns**: `Promise<void>`

---

## 🎯 Authentication Flow

### **Standard Login Flow**

1. User enters email and password
2. Form validation
3. API call to `/api/v1/auth/login`
4. Store tokens in Redux/auth store
5. Redirect to dashboard

### **OAuth Flow**

1. User clicks OAuth button (Google/Apple)
2. Redirect to provider OAuth page
3. User authorizes
4. Provider redirects to `/auth/callback`
5. Extract tokens from URL
6. Store tokens and user data
7. Redirect to dashboard

### **Registration Flow**

1. User fills registration form
2. Form validation
3. API call to `/api/v1/auth/register`
4. Store tokens
5. Send verification email
6. Redirect to dashboard (or verification page)

---

## 🔐 Security Features

1. **Password Hashing**: Passwords hashed on backend
2. **JWT Tokens**: Secure token-based authentication
3. **Token Refresh**: Automatic token refresh
4. **Secure Storage**: Tokens stored securely (httpOnly cookies or secure storage)
5. **CSRF Protection**: CSRF token validation
6. **OAuth State**: OAuth state verification
7. **Input Validation**: Client and server-side validation

---

## 📝 Usage Examples

### **Login**

```tsx
const { mutate: login, isLoading } = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
    setAuth(data.user, data.accessToken, data.refreshToken);
    router.push("/dashboard");
  },
});

login({ email: "user@example.com", password: "password123" });
```

### **OAuth**

```tsx
const { handleGoogleSignIn } = useOAuth();

<Button onClick={handleGoogleSignIn}>
  Sign in with Google
</Button>
```

---

## 🔗 Related Files

- **Backend Auth**: `backend/src/modules/auth/auth.service.ts`
- **Auth Store**: `store/auth-store.ts`
- **API Client**: `lib/api-client.ts`

---

**Last Updated**: January 2025

