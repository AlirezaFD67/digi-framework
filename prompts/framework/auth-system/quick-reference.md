# Authentication System - Quick Reference Card

## 🚀 Quick Implementation (Copy & Paste)

### 1. Login Page Setup
```typescript
"use client";
import { OTPLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  return (
    <OTPLoginForm
      onSuccess={() => router.push('/dashboard')}
      onError={(error) => console.error(error)}
    />
  );
}
```

### 2. Provider Setup (Layout)
```typescript
"use client";
import { CustomUIProvider } from "@workspace/custom-ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CustomUIProvider 
      loginRoute="/auth" 
      appRoute="/dashboard"
      mode="dashboard"
    >
      {children}
    </CustomUIProvider>
  );
}
```

### 3. Environment Variable
```bash
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api.com
```

---

## 🎯 Common Use Cases

### Get Current User
```typescript
import { useAuthContext } from "@workspace/custom-ui";

function Component() {
  const { user, isAuthenticated, loading } = useAuthContext();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome, {user?.name}</div>;
}
```

### Logout
```typescript
import { useAuthContext } from "@workspace/custom-ui";

function Component() {
  const { logout } = useAuthContext();
  
  return <button onClick={logout}>Logout</button>;
}
```

### Protect Route
```typescript
import { AuthGuard } from "@workspace/custom-ui";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourProtectedContent />
    </AuthGuard>
  );
}
```

### Custom Login Form
```typescript
import { useAuthContext } from "@workspace/custom-ui";

function CustomLogin() {
  const { loginWithToken, verifyOTP } = useAuthContext();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");

  const handleSendOTP = async () => {
    await loginWithToken({ username: phone, password: "0" });
    setStep("otp");
  };

  const handleVerifyOTP = async (otp: string) => {
    await verifyOTP({ userPhone: phone, userOTP: otp });
    // Success! Token is saved automatically
  };

  // Your custom UI here...
}
```

---

## 📡 API Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/api/api-token-auth` | POST | Send OTP | `{ username, password: "0" }` | `{ token }` |
| `/api/authenticateOTP` | POST | Verify OTP | `{ userPhone, userOTP }` | `{ token, username }` |
| `/api/getuserprofile` | GET | Get Profile | Headers: `Token ${token}` | `{ entries: [user] }` |

---

## 🔑 Available Exports

### From `@workspace/framework`:
```typescript
import {
  // Mutations
  useCreateAuthTokenMutation,
  useVerifyOTPMutation,
  useUserProfileQuery,
  
  // Utilities
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  clearAuthTokens,
  isAuthenticated,
  
  // Constants
  API_ENDPOINTS,
} from "@workspace/framework";
```

### From `@workspace/custom-ui`:
```typescript
import {
  // Components
  OTPLoginForm,
  AuthGuard,
  
  // Context & Hooks
  AuthProvider,
  useAuthContext,
  
  // Provider
  CustomUIProvider,
} from "@workspace/custom-ui";
```

---

## 🎨 OTPLoginForm Props

```typescript
<OTPLoginForm
  // Callbacks
  onSuccess={() => {}}           // Called after successful login
  onError={(error) => {}}        // Called on error
  
  // Customization
  title="ورود با کد تایید"      // Form title
  description="..."              // Form description
  submitButtonText="ارسال کد"    // Send OTP button
  otpButtonText="تایید کد"       // Verify OTP button
  resendButtonText="ارسال مجدد"  // Resend button
  
  // Options
  showResendButton={true}        // Show/hide resend
  resendCooldown={60}            // Cooldown in seconds
  
  // UI
  className="custom-class"       // Additional classes
  heroImageSrc="/hero.jpg"       // Hero image URL
  testimonials={[...]}           // Testimonial array
/>
```

---

## 🔄 Authentication Flow

```
┌─────────────┐
│ Enter Phone │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│  Send OTP    │ ← loginWithToken({ username, password: "0" })
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Enter OTP   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Verify OTP   │ ← verifyOTP({ userPhone, userOTP })
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Save Token  │ ← setAuthToken(token)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Load Profile │ ← useUserProfileQuery()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Dashboard   │
└──────────────┘
```

---

## 🐛 Troubleshooting

### Problem: Token not persisting
```typescript
// Solution: Check cookie configuration
import { getAuthToken, setAuthToken } from "@workspace/framework";

// Test token storage
setAuthToken("test-token");
console.log(getAuthToken()); // Should log "test-token"
```

### Problem: 401 Unauthorized
```typescript
// Solution: Verify token format
// Should be: "Token ${token}"
// NOT: "Bearer ${token}"
```

### Problem: OTP not received
```typescript
// Solution: Check endpoint and format
// Phone should be: "09xxxxxxxxx"
// Endpoint: /api/api-token-auth
// Request: { username: "09123456789", password: "0" }
```

### Problem: Redirect loop
```typescript
// Solution: Ensure routes are different
<CustomUIProvider 
  loginRoute="/auth"      // ← Different
  appRoute="/dashboard"   // ← Different
>
```

---

## 🔒 Security Best Practices

1. **Use HTTPS** in production
2. **HTTP-only cookies** for tokens
3. **Validate on server** - Don't trust client
4. **Rate limiting** for OTP requests
5. **Token expiration** - Set appropriate timeout
6. **Clear tokens** on logout

---

## 📞 Quick Help

### Need to...
- **Implement basic login?** → Use `OTPLoginForm` component
- **Get current user?** → Use `useAuthContext()` hook
- **Protect a route?** → Wrap with `<AuthGuard>`
- **Custom login flow?** → Use `loginWithToken()` and `verifyOTP()`
- **Check if authenticated?** → Use `isAuthenticated()` or `useAuthContext().isAuthenticated`
- **Logout?** → Call `logout()` from `useAuthContext()`

---

## 📚 Full Documentation

For complete details, see:
- [Quick Start Guide](./index.mdx)
- [Complete Documentation](./login-system-prompt.md)
- [README](./README.md)

---

**Last Updated:** October 2025  
**Version:** 1.0.0


