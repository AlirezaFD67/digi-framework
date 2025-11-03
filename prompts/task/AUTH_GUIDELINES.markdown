# راهنمای Authentication و کنترل دسترسی (Monorepo)

این سند دستورات لازم برای پیاده‌سازی authentication و مدیریت دسترسی کاربران در ساختار Monorepo را مشخص می‌کند.

## معرفی سیستم Authentication

**تمام سیستم authentication در `@workspace/custom-ui` و `@workspace/framework` پیاده‌سازی شده است.**

### ویژگی‌های کلیدی:
- ✅ **AdminLoginForm**: فرم لاگین آماده برای ادمین (username/password)
- ✅ **OTPLoginForm**: فرم لاگین OTP برای کاربران عادی
- ✅ **AuthGuard**: محافظت خودکار از route‌ها
- ✅ **useAuthContext**: Hook مدیریت authentication
- ✅ **Token Management**: مدیریت خودکار token در cookie
- ✅ **Auto Redirect**: ریدایرکت خودکار در صورت عدم احراز هویت

### راهنماهای کامل:
برای جزئیات کامل سیستم authentication به این منابع مراجعه کنید:
- **[prompts/framework/auth-system/](../../framework/auth-system/)**: پرامپت‌های کامل auth
- **[packages/custom-ui/ADMIN_LOGIN_USAGE.md](../../../packages/custom-ui/ADMIN_LOGIN_USAGE.md)**: راهنمای Admin Login
- **[prompts/framework/auth-system/README.md](../../framework/auth-system/README.md)**: معماری کامل سیستم

## ۱. Setup Provider در اپلیکیشن

### 1.1. نصب و Import
```typescript
// در apps/[app-name]/src/app/layout.tsx
import { CustomUIProvider } from '@workspace/custom-ui';
import { FrameworkProvider } from '@workspace/framework';

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <FrameworkProvider>
          <CustomUIProvider 
            loginRoute="/admin/auth"  // مسیر صفحه لاگین
            appRoute="/admin/dashboard"  // مسیر بعد از لاگین
          >
            {children}
          </CustomUIProvider>
        </FrameworkProvider>
      </body>
    </html>
  );
}
```

### 1.2. تنظیم Environment Variables
```env
# در .env.local هر اپلیکیشن
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api.com
```

## ۲. ایجاد صفحه Login

### 2.1. Admin Login (username/password)
```typescript
// apps/admin-panel/src/app/admin/auth/page.tsx
import { AdminLoginForm } from '@workspace/custom-ui';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <AdminLoginForm
      title="ورود به پنل ادمین"
      description="نام کاربری و رمز عبور خود را وارد کنید"
      onSuccess={() => {
        router.push('/admin/dashboard');
      }}
      onError={(error) => {
        console.error('Login failed:', error);
      }}
    />
  );
}
```

### 2.2. OTP Login (برای کاربران عادی)
```typescript
// apps/digimoragheb/src/app/auth/page.tsx
import { OTPLoginForm } from '@workspace/custom-ui';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <OTPLoginForm
      onSuccess={() => {
        router.push('/dashboard');
      }}
      onError={(error) => {
        console.error('Login failed:', error);
      }}
    />
  );
}
```

## ۳. محافظت از Route‌ها (Protected Routes)

### 3.1. استفاده از AuthGuard
**روش توصیه شده: استفاده از `AuthGuard` از `@workspace/custom-ui`**

```typescript
// apps/admin-panel/src/app/admin/dashboard/layout.tsx
import { AuthGuard } from '@workspace/custom-ui';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
```

### 3.2. محافظت دستی (اختیاری)
اگر نیاز به کنترل بیشتر دارید:

```typescript
'use client';
import { useAuthContext } from '@workspace/custom-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>محتوای محافظت شده</div>;
}
```

## ۴. استفاده از Auth Context

### 4.1. دریافت اطلاعات کاربر
```typescript
'use client';
import { useAuthContext } from '@workspace/custom-ui';

export default function UserProfile() {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### 4.2. Login دستی (Programmatic Login)
```typescript
'use client';
import { useAuthContext } from '@workspace/custom-ui';
import { useState } from 'react';

export default function CustomLoginForm() {
  const { loginAsAdmin } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginAsAdmin({ username, password });
      console.log('Login successful:', result);
      // Redirect manually if needed
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 4.3. Logout
```typescript
'use client';
import { useAuthContext } from '@workspace/custom-ui';

export default function LogoutButton() {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    // User will be redirected to loginRoute automatically
  };

  return (
    <button onClick={handleLogout}>
      خروج از سیستم
    </button>
  );
}
```

## ۵. API Endpoints (در @workspace/framework)

سیستم authentication از endpointهای زیر در `@workspace/framework` استفاده می‌کند:

### 5.1. Admin Login
```typescript
// استفاده خودکار توسط AdminLoginForm
import { useAdminLoginMutation } from '@workspace/framework';

const loginMutation = useAdminLoginMutation();
await loginMutation.mutateAsync({
  username: 'admin',
  password: 'password123'
});
```

**Endpoint:** `/admin-api-token`  
**Method:** POST  
**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "8lua8BOfjJvXS...",
  "user_id": 47,
  "email": "admin@example.com"
}
```

### 5.2. OTP Authentication
```typescript
// استفاده خودکار توسط OTPLoginForm
import { 
  useCreateAuthTokenMutation, 
  useVerifyOTPMutation 
} from '@workspace/framework';
```

## ۶. مدیریت نقش‌های کاربری (Roles)

### 6.1. تعریف تایپ‌های User
```typescript
// در packages/custom-ui/src/types/ یا apps/[app]/src/types/
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'expert';
  permissions?: string[];
}
```

### 6.2. چک کردن نقش کاربر
```typescript
'use client';
import { useAuthContext } from '@workspace/custom-ui';

export default function AdminOnlyComponent() {
  const { user } = useAuthContext();

  if (user?.role !== 'admin') {
    return <div>دسترسی محدود - فقط ادمین</div>;
  }

  return <div>پنل مدیریت ادمین</div>;
}
```

### 6.3. Role-based AuthGuard (سفارشی)
```typescript
// در apps/[app]/src/components/guards/RoleGuard.tsx
'use client';
import { useAuthContext } from '@workspace/custom-ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user || !allowedRoles.includes(user.role))) {
      router.push('/unauthorized');
    }
  }, [user, isAuthenticated, loading, allowedRoles, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

// استفاده:
<RoleGuard allowedRoles={['admin']}>
  <AdminPanel />
</RoleGuard>
```

## ۷. راهنماهای تکمیلی

### برای راهنمای کامل به این منابع مراجعه کنید:

#### 📚 داکیومنت‌های جامع:
- **[prompts/framework/auth-system/](../../framework/auth-system/)**: 
  - `index.mdx`: Quick start guide
  - `login-system-prompt.md`: داکیومنت کامل فنی
  - `quick-reference.md`: Cheat sheet و کدهای آماده

#### 📦 راهنماهای Package:
- **[packages/custom-ui/ADMIN_LOGIN_USAGE.md](../../../packages/custom-ui/ADMIN_LOGIN_USAGE.md)**: راهنمای کامل Admin Login
- **[packages/framework/README.md](../../../packages/framework/README.md)**: API endpoints و framework

#### 🔗 منابع مرتبط:
- **[API_GUIDELINES.markdown](API_GUIDELINES.markdown)**: برای استفاده از `@workspace/framework`
- **[TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown)**: برای تست‌های authentication
- **[ARCHITECTURE.markdown](ARCHITECTURE.markdown)**: برای درک ساختار Monorepo

## ۸. نکات مهم

### ✅ باید انجام دهید:
1. **همیشه از `@workspace/custom-ui` استفاده کنید** برای authentication
2. **AuthGuard را در layout استفاده کنید** برای محافظت از route‌ها
3. **Environment variables را تنظیم کنید** (`NEXT_PUBLIC_REST_API_ENDPOINT`)
4. **Provider را در root layout اضافه کنید**

### ❌ نباید انجام دهید:
1. **سیستم auth خودتان را از صفر نسازید** - از custom-ui استفاده کنید
2. **Token را دستی مدیریت نکنید** - AuthContext این کار را انجام می‌دهد
3. **API call مستقیم برای auth نزنید** - از hooks استفاده کنید