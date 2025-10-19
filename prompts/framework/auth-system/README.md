# Authentication System Prompts

This directory contains comprehensive documentation and prompts for the digi-framework authentication system.

## 📁 Files

### [`index.mdx`](./index.mdx)
Quick start guide and overview of the authentication system. Perfect for getting started quickly or as a reference guide.

**Contents:**
- Quick start examples
- Key features overview
- Core components summary
- Common usage patterns
- Troubleshooting guide

### [`login-system-prompt.md`](./login-system-prompt.md)
Complete, in-depth documentation of the entire authentication system. This is the main technical reference.

**Contents:**
- Complete architecture overview
- Technical implementation details
- API endpoints and configuration
- React components and hooks
- Complete authentication flow
- Security features
- Usage examples
- Best practices
- Future improvements

### [`quick-reference.md`](./quick-reference.md)
Cheat sheet with copy-paste code snippets and common use cases.

**Contents:**
- Quick implementation snippets
- Common use cases
- API endpoints summary
- Available exports
- Props reference
- Troubleshooting guide

## 🎯 When to Use Each Document

### Use `quick-reference.md` when:
- You need a quick code snippet
- You're looking for copy-paste solutions
- You need a cheat sheet
- You want to see common patterns at a glance

### Use `index.mdx` when:
- You need a quick reference
- You're implementing a basic login page
- You want to see common usage patterns
- You need troubleshooting help

### Use `login-system-prompt.md` when:
- You're implementing advanced features
- You need to understand the architecture
- You're modifying the authentication system
- You need detailed technical specifications
- You're onboarding new developers

## 🚀 Quick Implementation

For a basic login implementation, you only need these steps:

1. **Create a login page:**
```typescript
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

2. **Wrap your app with the provider:**
```typescript
import { CustomUIProvider } from "@workspace/custom-ui";

export default function Layout({ children }) {
  return (
    <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
      {children}
    </CustomUIProvider>
  );
}
```

3. **Set environment variable:**
```bash
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api.com
```

That's it! You have a fully functional OTP-based authentication system.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│                  (apps/application-expert)                   │
│  - Login Pages                                               │
│  - Protected Routes                                          │
│  - Provider Setup                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                     Custom UI Layer                          │
│                   (packages/custom-ui)                       │
│  - AuthProvider (Context)                                    │
│  - OTPLoginForm (Component)                                  │
│  - AuthGuard (Protection)                                    │
│  - useAuthContext (Hook)                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                     Framework Layer                          │
│                   (packages/framework)                       │
│  - API Endpoints                                             │
│  - HTTP Client                                               │
│  - React Query Mutations                                     │
│  - Token Utilities                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

```
User → Enter Phone → Send OTP → Enter OTP → Verify → Token Saved → Profile Loaded → Dashboard
```

## 🔐 Security Features

- ✅ Token-based authentication (JWT)
- ✅ HTTP-only cookies for storage
- ✅ Automatic token injection
- ✅ Auto-logout on 401
- ✅ Client-side validation
- ✅ Secure password handling

## 📝 Key Exports

### From `@workspace/framework`:
```typescript
import {
  useCreateAuthTokenMutation,
  useVerifyOTPMutation,
  getAuthToken,
  setAuthToken,
  clearAuthTokens,
  isAuthenticated
} from "@workspace/framework";
```

### From `@workspace/custom-ui`:
```typescript
import {
  AuthProvider,
  useAuthContext,
  OTPLoginForm,
  AuthGuard
} from "@workspace/custom-ui";
```

## 🎨 Customization

The authentication system is highly customizable:

- **Custom styling** - Pass className or use Tailwind
- **Custom text** - All button and label text can be customized
- **Custom flow** - Use hooks for custom authentication flows
- **Custom UI** - Build your own forms using the auth hooks
- **Custom validation** - Add your own validation rules

## 🧪 Testing

### Test Credentials:
- Phone format: `09xxxxxxxxx`
- Backend should provide test OTP codes for development

### Test Scenarios:
1. Valid phone + valid OTP
2. Valid phone + invalid OTP
3. Invalid phone format
4. Network errors
5. Token expiry
6. Session persistence

## 📚 Related Documentation

- [Framework Package](/packages/framework/README.md)
- [Custom UI Package](/packages/custom-ui/README.md)
- [Error Management](/packages/custom-ui/ERROR_SYSTEM_USAGE.md)
- [Add Endpoint Prompt](/prompts/framework/add-endpoint/index.mdx)

## 🔧 Development

### Project Structure:
```
prompts/framework/auth-system/
├── README.md                    # This file
├── index.mdx                    # Quick start guide
└── login-system-prompt.md       # Complete documentation
```

### Updating Documentation:

When updating the authentication system:

1. Update technical details in `login-system-prompt.md`
2. Update quick start examples in `index.mdx`
3. Update this README if structure changes
4. Add version number and date to updates
5. Test all code examples before committing

## 🤝 Contributing

To contribute to this documentation:

1. **For quick fixes:** Update the relevant section
2. **For new features:** Add to both files + examples
3. **For breaking changes:** Update all examples and add migration guide
4. **Test all code examples** before submitting
5. **Follow the existing format** and style

## 📞 Getting Help

If you need help:

1. Check `index.mdx` for quick answers
2. Read `login-system-prompt.md` for detailed explanations
3. Review code examples in both files
4. Check related documentation
5. Contact the development team

---

**Maintained By:** digi-framework Team  
**Last Updated:** October 2025  
**Version:** 1.0.0

