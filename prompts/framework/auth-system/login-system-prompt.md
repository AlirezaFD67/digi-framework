# User Login System - Complete Implementation Guide

## 📋 Overview

This document describes the complete OTP-based authentication system implemented in the digi-framework monorepo. The system uses a two-step verification process: phone number validation followed by OTP (One-Time Password) verification.

## 🏗️ Architecture

The login system is built across three main layers:

### 1. **Framework Layer** (`packages/framework`)
   - API endpoints configuration
   - HTTP client setup
   - React Query mutations
   - Authentication utilities

### 2. **Custom UI Layer** (`packages/custom-ui`)
   - Authentication context and provider
   - OTP login form component
   - Authentication hooks
   - Auth guards

### 3. **Application Layer** (e.g., `apps/digimoragheb`, `apps/admin-panel`)
   - Login pages
   - Route protection
   - Provider setup

---

## 🔧 Technical Implementation

### 1. API Configuration

**File:** `packages/framework/src/utils/api-endpoints.ts`

```typescript
// Authentication endpoints
const AUTH = {
  OTP_VERIFY: "/authenticateOTP",
} as const;

// Auth token endpoint (Django-style token auth)
const AUTH_TOKEN = {
  CREATE: "/api-token-auth",
} as const;

// User management endpoints
const USER = {
  PROFILE: "/getuserprofile",
} as const;
```

### 2. HTTP Client Setup

**File:** `packages/framework/src/utils/api-http.ts`

**Key Features:**
- Axios-based HTTP client with interceptors
- Automatic token injection in request headers
- Token format: `Authorization: Token ${token}`
- Automatic logout on 401 (Unauthorized)
- Comprehensive error handling
- Base URL: `${NEXT_PUBLIC_REST_API_ENDPOINT}/api`

**Request Interceptor:**
```typescript
APIHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  }
);
```

**Response Interceptor:**
```typescript
APIHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthTokens();
      window.location.href = "/login";
    }
    return Promise.reject(apiError);
  }
);
```

### 3. Authentication API Functions

**File:** `packages/framework/src/routes/auth/post.ts`

```typescript
// Step 1: Create auth token and send OTP
export function CreateAuthToken(
  payload: AuthTokenRequest
): Promise<APIHttpType<AuthTokenResponse>> {
  return APIHttp.post<BaseResponseType<AuthTokenResponse>>(
    API_ENDPOINTS.AUTH_TOKEN.CREATE, 
    {
      username: payload.username,
      password: "0", // Static password for OTP flow
    }
  );
}

// Step 2: Verify OTP code
export function VerifyOTP(
  payload: OTPVerificationRequest
): Promise<APIHttpType<OTPVerificationResponse>> {
  return APIHttp.post<BaseResponseType<OTPVerificationResponse>>(
    API_ENDPOINTS.AUTH.OTP_VERIFY, 
    payload
  );
}
```

### 4. Type Definitions

**File:** `packages/framework/src/routes/auth/type.ts`

```typescript
// Request to create auth token (send OTP)
export interface AuthTokenRequest {
  username: string; // Phone number
  password: string; // Static "0" for OTP flow
}

// Response after requesting OTP
export interface AuthTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

// Request to verify OTP
export interface OTPVerificationRequest {
  userPhone: string; // User's phone number
  userOTP: string;   // 6-digit OTP code
}

// Response after OTP verification
export interface OTPVerificationResponse {
  username: string;
  userPassword: string;
  token: string;
  userExistance: boolean;
}
```

### 5. React Query Mutations

**File:** `packages/framework/src/routes/auth/query.ts`

```typescript
// Hook for creating auth token (sending OTP)
export const useCreateAuthTokenMutation = () => {
  return useGenericMutation<AuthTokenResponse, AuthTokenRequest>(
    async (data): Promise<AuthTokenResponse> => {
      const response = await CreateAuthToken(data);
      if (response.data.entries) {
        return response.data.entries as AuthTokenResponse;
      }
      return {
        token: "temp_token",
        refreshToken: undefined,
        expiresIn: 3600
      };
    },
    ["auth", "token"]
  );
};

// Hook for verifying OTP
export const useVerifyOTPMutation = () => {
  return useGenericMutation<OTPVerificationResponse, OTPVerificationRequest>(
    async (data): Promise<OTPVerificationResponse> => {
      const response = await VerifyOTP(data);
      if (response.data.entries) {
        return response.data.entries;
      }
      return data as OTPVerificationResponse;
    },
    ["auth", "otp"]
  );
};
```

### 6. Authentication Provider

**File:** `packages/custom-ui/src/contexts/auth/auth-provider.tsx`

**Key Features:**
- Manages authentication state using `useReducer`
- Provides login and logout functionality
- Handles token storage in cookies
- Fetches user profile after authentication
- Manages loading states

**Main Functions:**

```typescript
// Initialize authentication state
const initialize = async () => {
  const token = getAuthToken();
  
  if (!token || !isAuthenticated()) {
    dispatch({ type: Types.INITIAL, payload: { user: null } });
    return;
  }

  // If profile data is available, use it
  if (profileData && !profileLoading) {
    const user = profileData.data.entries[0];
    dispatch({
      type: Types.INITIAL,
      payload: { user: user },
    });
  }
};

// Step 1: Login with phone number (send OTP)
const loginWithToken = async (data: { username: string; password: string }) => {
  const res = await createTokenMutation.mutateAsync(data);
  // OTP is sent to the user's phone
  return res;
};

// Step 2: Verify OTP code
const verifyOTP = async (data: { userPhone: string; userOTP: string }) => {
  const res = await verifyOTPMutation.mutateAsync(data);
  
  // After successful OTP verification, save the token
  if (res.token) {
    setAuthToken(res.token);
  }
  
  return res;
};

// Logout function
const logout = async () => {
  clearAuthTokens();
  dispatch({ type: Types.LOGOUT });
  window?.location.reload();
};
```

**Context Value:**
```typescript
{
  user: state.user,
  method: "jwt",
  loading: isLoading,
  isAuthenticated: !!state.user,
  loginRoute,
  appRoute,
  loginWithToken,   // Send OTP
  verifyOTP,        // Verify OTP
  logout,           // Logout user
  initialize,       // Initialize auth state
}
```

### 7. OTP Login Form Component

**File:** `packages/custom-ui/src/components/auth/otp-login-form.tsx`

**Features:**
- Two-step form (phone → OTP)
- Phone number validation (Iranian format: 09xxxxxxxxx)
- 6-digit OTP input
- Resend OTP with cooldown timer
- Loading states and error handling
- Responsive design with testimonials
- Modern UI with glass morphism effects

**Component Structure:**

```typescript
export function OTPLoginForm({
  className,
  onSuccess,        // Called after successful login
  onError,          // Called on login errors
  title,            // Form title
  description,      // Form description
  submitButtonText, // "Send OTP" button text
  otpButtonText,    // "Verify OTP" button text
  resendButtonText, // "Resend OTP" button text
  showResendButton, // Show/hide resend button
  resendCooldown,   // Cooldown timer (default: 60 seconds)
  heroImageSrc,     // Hero image for right side
  testimonials,     // Testimonial cards
}: OTPLoginFormProps) {
  // ... implementation
}
```

**Flow:**

1. **Phone Step:**
   - User enters phone number (09xxxxxxxxx)
   - Validates format
   - Calls `loginWithToken()` to send OTP
   - Moves to OTP step

2. **OTP Step:**
   - Shows phone number
   - User enters 6-digit OTP code
   - Validates OTP format
   - Calls `verifyOTP()` to verify
   - On success, calls `onSuccess()`

3. **Resend OTP:**
   - 60-second cooldown timer
   - Re-sends OTP by calling `loginWithToken()` again

### 8. Application Setup

**File:** `apps/[app-name]/src/app/auth/page.tsx`

```typescript
export default function AuthPage() {
  const router = useRouter();

  const sampleTestimonials = [
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
      name: "سارا احمدی",
      handle: "@sara_ahmadi",
      text: "پلتفرم فوق‌العاده‌ای است! تجربه کاربری بی‌نظیر..."
    },
    // ... more testimonials
  ];

  return (
    <div className="w-screen h-screen">
      <OTPLoginForm
        heroImageSrc="https://images.unsplash.com/photo-..."
        testimonials={sampleTestimonials}
        onSuccess={() => router.push('/dashboard')}
        onError={(error: any) => console.log(error)}
      />
    </div>
  );
}
```

**Layout File:** `apps/[app-name]/src/app/auth/layout.tsx`

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomUIProvider 
      loginRoute="/auth/login" 
      appRoute="/dashboard" 
      mode="dashboard" 
      themeConfig={{ attribute: "class" }} 
      sidebarConfig={{ defaultOpen: true }}
    >
      {children}
    </CustomUIProvider>
  );
}
```

---

## 🔄 Authentication Flow

### Complete Login Flow:

```
1. User visits login page
   ↓
2. Enters phone number (09xxxxxxxxx)
   ↓
3. Clicks "Send OTP"
   ↓
4. System calls `loginWithToken({ username: phone, password: "0" })`
   ↓
5. Backend sends OTP code to user's phone
   ↓
6. UI switches to OTP step
   ↓
7. User enters 6-digit OTP code
   ↓
8. Clicks "Verify OTP"
   ↓
9. System calls `verifyOTP({ userPhone, userOTP })`
   ↓
10. Backend validates OTP and returns token
   ↓
11. Token is saved to cookies via `setAuthToken(token)`
   ↓
12. User profile is fetched via `useUserProfileQuery()`
   ↓
13. Auth state is updated with user data
   ↓
14. `onSuccess()` callback is triggered
   ↓
15. User is redirected to dashboard
```

### Token Management:

```typescript
// Save token to cookies
setAuthToken(token);

// Get token from cookies
const token = getAuthToken();

// Check if user is authenticated
const isAuth = isAuthenticated();

// Clear all tokens
clearAuthTokens();

// Remove specific token
removeAuthToken();
```

---

## 📦 Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api-endpoint.com
```

---

## 🎨 UI Components Used

### Form Components:
- `FormProvider` - Form context provider
- `RHFInput` - React Hook Form input with validation
- `RHFOTP` - OTP input component
- `RHFButton` - Button with loading state

### UI Components:
- `Button` - Base button component
- Icons: `Smartphone`, `Shield`, `ArrowLeft` from lucide-react

---

## 🔒 Security Features

1. **Token-based Authentication:**
   - JWT tokens stored in HTTP-only cookies
   - Automatic token injection in API requests
   - Token format: `Token ${token}`

2. **Automatic Session Management:**
   - Auto-logout on 401 (Unauthorized)
   - Token validation on app initialization
   - Profile refresh on token validity

3. **Client-side Validation:**
   - Phone number format validation
   - OTP format validation (6 digits, numeric only)
   - Required field validation

4. **Error Handling:**
   - Network error handling
   - API error responses
   - User-friendly error messages
   - Error callbacks for custom handling

---

## 🎯 Key Hooks and Utilities

### Authentication Hooks:
```typescript
import { useAuthContext } from "@workspace/custom-ui";

const { 
  user,              // Current user object
  isAuthenticated,   // Boolean authentication status
  loading,           // Loading state
  loginWithToken,    // Send OTP function
  verifyOTP,         // Verify OTP function
  logout,            // Logout function
  loginRoute,        // Login route path
  appRoute,          // App route path
} = useAuthContext();
```

### API Mutation Hooks:
```typescript
import { useCreateAuthTokenMutation, useVerifyOTPMutation } from "@workspace/framework";

const createToken = useCreateAuthTokenMutation();
const verifyOTP = useVerifyOTPMutation();
```

### Cookie Utilities:
```typescript
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  clearAuthTokens,
  isAuthenticated 
} from "@workspace/framework";
```

---

## 📝 Usage Examples

### Basic Login Page:

```typescript
"use client";

import { OTPLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <OTPLoginForm
      onSuccess={() => router.push('/dashboard')}
      onError={(error) => console.error('Login failed:', error)}
    />
  );
}
```

### Custom Login with Testimonials:

```typescript
"use client";

import { OTPLoginForm } from "@workspace/custom-ui";

export default function LoginPage() {
  const testimonials = [
    {
      avatarSrc: "/avatar1.jpg",
      name: "John Doe",
      handle: "@johndoe",
      text: "Amazing platform!"
    }
  ];

  return (
    <OTPLoginForm
      heroImageSrc="/hero-image.jpg"
      testimonials={testimonials}
      title="Welcome Back"
      description="Enter your phone number"
      submitButtonText="Send Code"
      otpButtonText="Verify"
      resendCooldown={90}
      onSuccess={() => console.log("Success!")}
    />
  );
}
```

### Protected Route:

```typescript
"use client";

import { AuthGuard } from "@workspace/custom-ui";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourProtectedContent />
    </AuthGuard>
  );
}
```

---

## 🧪 Testing

### Test Phone Numbers:
Ensure your backend supports test phone numbers for development:
- Format: `09xxxxxxxxx` (Iranian mobile format)

### Test OTP Codes:
Configure your backend to accept test OTP codes in development mode.

---

## 🐛 Common Issues & Solutions

### Issue 1: Token not being saved
**Solution:** Check that `setAuthToken()` is being called after successful OTP verification.

### Issue 2: 401 Unauthorized errors
**Solution:** Ensure the token format is correct: `Token ${token}` (not `Bearer`).

### Issue 3: User redirected to login after refresh
**Solution:** Check that cookies are properly configured and `getAuthToken()` is working.

### Issue 4: OTP not being sent
**Solution:** Verify that:
- `NEXT_PUBLIC_REST_API_ENDPOINT` is set correctly
- Backend endpoints are accessible
- Phone number format is correct

---

## 📊 State Management

### Auth State Structure:

```typescript
{
  user: null | UserObject,
  loading: boolean,
  isAuthenticated: boolean,
  method: "jwt",
  loginRoute: string,
  appRoute: string,
}
```

### Loading States:
1. **Initial Load:** `loading = true` while checking authentication
2. **Phone Submit:** Button shows "در حال ارسال..." (Sending...)
3. **OTP Verify:** Button shows "در حال تایید..." (Verifying...)
4. **Profile Load:** Background loading after OTP verification

---

## 🌐 API Endpoints Summary

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/api/api-token-auth` | POST | Send OTP | `{ username, password: "0" }` | `{ token, refreshToken?, expiresIn? }` |
| `/api/authenticateOTP` | POST | Verify OTP | `{ userPhone, userOTP }` | `{ username, token, userExistance }` |
| `/api/getuserprofile` | GET | Get profile | - | `{ data: { entries: [user] } }` |

---

## 🎓 Best Practices

1. **Always wrap your app with `CustomUIProvider`** to enable authentication context
2. **Use `AuthGuard`** for protected routes
3. **Handle errors gracefully** with `onError` callback
4. **Show loading states** during authentication operations
5. **Clear tokens on logout** using `clearAuthTokens()`
6. **Validate phone numbers** on the client side before submission
7. **Use proper TypeScript types** from `@workspace/framework`
8. **Test with different network conditions** to ensure robustness

---

## 🔄 Future Improvements

Potential enhancements to consider:

1. **Biometric Authentication:** Add fingerprint/face ID support
2. **Remember Device:** Option to skip OTP on trusted devices
3. **Social Login:** Add OAuth providers (Google, Apple, etc.)
4. **Password Login:** Alternative login method
5. **Multi-factor Authentication:** Additional security layer
6. **Session Management:** Advanced session handling
7. **Token Refresh:** Automatic token refresh before expiry
8. **Rate Limiting:** Client-side rate limiting for OTP requests

---

## 📚 Related Documentation

- [Error Management System](/prompts/docs/error-system.md)
- [Form Components](/packages/custom-ui/src/components/form/README.md)
- [API Utilities](/packages/framework/README.md)
- [Auth Guards](/packages/custom-ui/src/auth/guard/README.md)

---

## 🤝 Contributing

When modifying the authentication system:

1. Update all related type definitions
2. Test both phone and OTP steps thoroughly
3. Ensure error handling is comprehensive
4. Update this documentation
5. Add unit tests for new functionality
6. Test token persistence across page reloads

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Maintained By:** digi-framework Team


