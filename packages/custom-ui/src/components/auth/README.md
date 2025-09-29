# OTP Login Form Component

A comprehensive OTP (One-Time Password) login form component for the custom-ui package that handles phone number verification and OTP code validation.

## Features

- 📱 **Phone Number Input**: Iranian phone number formatting and validation
- 🔐 **OTP Verification**: 6-digit OTP code input with validation
- ⏱️ **Resend Timer**: Built-in cooldown timer for OTP resend functionality
- 🎨 **Modern UI**: Clean, responsive design with loading states
- ✅ **Form Validation**: Comprehensive client-side validation
- 🔄 **Two-Step Process**: Phone number → OTP verification flow
- 🎯 **Auth Integration**: Seamless integration with existing auth context

## Usage

### Basic Usage

```tsx
import { OTPLoginForm } from "@workspace/custom-ui"

export function LoginPage() {
  const handleSuccess = () => {
    console.log("Login successful!")
    // Redirect to dashboard
  }

  const handleError = (error: any) => {
    console.error("Login failed:", error)
    // Show error toast
  }

  return (
    <OTPLoginForm
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
}
```

### Advanced Usage with Customization

```tsx
import { OTPLoginForm } from "@workspace/custom-ui"

export function CustomLoginPage() {
  return (
    <OTPLoginForm
      title="Welcome Back"
      description="Enter your phone number to receive a verification code"
      submitButtonText="Send Code"
      otpButtonText="Verify Code"
      resendButtonText="Resend Code"
      showResendButton={true}
      resendCooldown={60}
      onSuccess={() => {
        // Handle successful login
        router.push('/dashboard')
      }}
      onError={(error) => {
        // Handle login error
        toast.error(error.message)
      }}
      className="max-w-sm"
    />
  )
}
```

### Full Page Example

```tsx
import { OTPLoginFormExample } from "@workspace/custom-ui"

export function LoginPage() {
  return <OTPLoginFormExample />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onSuccess` | `() => void` | - | Callback when login is successful |
| `onError` | `(error: any) => void` | - | Callback when login fails |
| `title` | `string` | `"Login with OTP"` | Form title |
| `description` | `string` | `"Enter your phone number to receive a verification code"` | Form description |
| `submitButtonText` | `string` | `"Send OTP"` | Phone submission button text |
| `otpButtonText` | `string` | `"Verify OTP"` | OTP verification button text |
| `resendButtonText` | `string` | `"Resend OTP"` | Resend button text |
| `showResendButton` | `boolean` | `true` | Whether to show resend button |
| `resendCooldown` | `number` | `60` | Resend cooldown in seconds |

## Form Validation

### Phone Number Validation
- Required field
- Must match Iranian phone number format: `09xxxxxxxxx`
- Real-time formatting as user types

### OTP Validation
- Required field
- Must be exactly 6 digits
- Only numeric characters allowed
- Real-time validation feedback

## Integration with Auth Context

The component integrates with the existing `AuthContext` and uses:

- `loginWithToken()` - Sends OTP to phone number
- `verifyOTP()` - Verifies the OTP code

Make sure your app is wrapped with the `AuthProvider`:

```tsx
import { AuthProvider } from "@workspace/custom-ui"

export function App() {
  return (
    <AuthProvider>
      <OTPLoginForm />
    </AuthProvider>
  )
}
```

## Styling

The component uses Tailwind CSS classes and can be customized with:

- Custom `className` prop
- CSS custom properties
- Tailwind utility classes

## Error Handling

The component handles various error scenarios:

- Network errors during API calls
- Invalid phone number format
- Invalid OTP code
- Server-side validation errors

Errors are displayed in a user-friendly format with appropriate styling.

## Accessibility

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Dependencies

- `react-hook-form` - Form state management
- `@workspace/ui` - Base UI components
- `@workspace/framework` - Auth context and API calls

## Examples

See `otp-login-form-example.tsx` for a complete implementation example.


