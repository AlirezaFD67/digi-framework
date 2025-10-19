# 🔐 راهنمای استفاده از Admin Login System

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
3. [استفاده سریع](#استفاده-سریع)
4. [تنظیمات پیشرفته](#تنظیمات-پیشرفته)
5. [API Reference](#api-reference)

---

## معرفی

سیستم Admin Login یک راه‌حل کامل برای احراز هویت ادمین‌ها با استفاده از username و password است.

### ویژگی‌های کلیدی:

- ✅ ورود با username و password
- ✅ رابط کاربری مدرن و واکنش‌گرا
- ✅ مدیریت خودکار توکن
- ✅ پشتیبانی کامل از TypeScript
- ✅ سازگار با Next.js App Router
- ✅ طراحی Glass morphism زیبا

---

## نصب و راه‌اندازی

### پیش‌نیازها

```bash
# اطمینان حاصل کنید که پکیج‌های لازم نصب شده‌اند
pnpm install @workspace/custom-ui @workspace/framework
```

### تنظیم متغیرهای محیطی

در فایل `.env.local` خود:

```env
NEXT_PUBLIC_REST_API_ENDPOINT=http://your-api-url.com
```

---

## استفاده سریع

### 1️⃣ ایجاد صفحه لاگین ادمین

```tsx
// app/admin/auth/page.tsx
import { AdminLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <AdminLoginForm
      onSuccess={() => router.push("/admin/dashboard")}
      onError={(error) => console.error("Login failed:", error)}
    />
  );
}
```

### 2️⃣ اضافه کردن Provider

```tsx
// app/layout.tsx
import { CustomUIProvider } from "@workspace/custom-ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CustomUIProvider 
          loginRoute="/admin/auth" 
          appRoute="/admin/dashboard"
        >
          {children}
        </CustomUIProvider>
      </body>
    </html>
  );
}
```

### 3️⃣ محافظت از صفحات ادمین

```tsx
// app/admin/dashboard/layout.tsx
import { AuthGuard } from "@workspace/custom-ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
```

---

## تنظیمات پیشرفته

### سفارشی‌سازی فرم لاگین

```tsx
<AdminLoginForm
  // متن‌های سفارشی
  title="ورود به پنل مدیریت"
  description="لطفا اطلاعات خود را وارد کنید"
  submitButtonText="ورود"
  
  // تصویر پس‌زمینه
  heroImageSrc="https://example.com/admin-hero.jpg"
  
  // نظرات کاربران (testimonials)
  testimonials={[
    {
      avatarSrc: "https://example.com/avatar1.jpg",
      name: "علی احمدی",
      handle: "@aliahmadi",
      text: "بهترین پنل مدیریت!"
    }
  ]}
  
  // رویدادها
  onSuccess={() => {
    console.log("Login successful!");
    router.push("/admin/dashboard");
  }}
  onError={(error) => {
    console.error("Login failed:", error);
    toast.error("خطا در ورود به سیستم");
  }}
/>
```

### استفاده از Auth Context

```tsx
import { useAuthContext } from "@workspace/custom-ui";

function AdminComponent() {
  const { user, isAuthenticated, logout, loginAsAdmin } = useAuthContext();

  // ورود دستی
  const handleManualLogin = async () => {
    try {
      const result = await loginAsAdmin({
        username: "admin",
        password: "password123"
      });
      console.log("Login successful:", result);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // خروج
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>خوش آمدید!</p>
          <button onClick={handleLogout}>خروج</button>
        </>
      ) : (
        <button onClick={handleManualLogin}>ورود</button>
      )}
    </div>
  );
}
```

---

## API Reference

### AdminLoginForm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | کلاس CSS سفارشی |
| `onSuccess` | `() => void` | `undefined` | تابع فراخوانی بعد از ورود موفق |
| `onError` | `(error: any) => void` | `undefined` | تابع فراخوانی در صورت خطا |
| `title` | `string` | `"ورود به پنل ادمین"` | عنوان فرم |
| `description` | `string` | `"نام کاربری و رمز عبور خود را وارد کنید"` | توضیحات فرم |
| `submitButtonText` | `string` | `"ورود"` | متن دکمه ورود |
| `heroImageSrc` | `string` | `undefined` | آدرس تصویر پس‌زمینه |
| `testimonials` | `Array` | `[]` | آرایه‌ای از نظرات کاربران |

### useAuthContext Hook

```typescript
interface AuthContext {
  user: any;                    // اطلاعات کاربر
  isAuthenticated: boolean;     // وضعیت احراز هویت
  loading: boolean;             // وضعیت بارگذاری
  loginAsAdmin: (data: {        // ورود ادمین
    username: string;
    password: string;
  }) => Promise<any>;
  logout: () => Promise<void>;  // خروج
  initialize: () => Promise<void>; // مقداردهی اولیه
}
```

### Admin Login API

**Endpoint:** `/admin-api-token`

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
  "token": "8lua8BOfjJvXS4c7A20BXbDyG3zNqYh6qdkiYZTTTUlHRg3taCnO-cnzqZynQ96P",
  "user_id": 47,
  "email": "admin@example.com"
}
```

---

## مثال‌های کاربردی

### مثال 1: صفحه لاگین ساده

```tsx
import { AdminLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  
  return (
    <AdminLoginForm
      onSuccess={() => router.push("/admin")}
    />
  );
}
```

### مثال 2: صفحه لاگین با تنظیمات کامل

```tsx
import { AdminLoginFormExample } from "@workspace/custom-ui";

export default function Page() {
  return <AdminLoginFormExample />;
}
```

### مثال 3: ورود برنامه‌نویسی (Programmatic)

```tsx
"use client";

import { useAuthContext } from "@workspace/custom-ui";
import { useState } from "react";

export default function CustomLoginPage() {
  const { loginAsAdmin } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginAsAdmin({ username, password });
      console.log("Success:", result);
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Error:", error);
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

---

## نکات مهم

### امنیت

- ✅ توکن‌ها به صورت خودکار در کوکی ذخیره می‌شوند
- ✅ درخواست‌های API به صورت خودکار توکن را اضافه می‌کنند
- ✅ در صورت 401 (Unauthorized)، کاربر به صفحه لاگین redirect می‌شود

### بهینه‌سازی

- ✅ استفاده از React Query برای مدیریت state
- ✅ Caching خودکار درخواست‌ها
- ✅ Retry خودکار در صورت خطا

### سازگاری

- ✅ Next.js 13+ (App Router)
- ✅ React 18+
- ✅ TypeScript

---

## رفع مشکلات رایج

### مشکل: توکن ذخیره نمی‌شود

```tsx
// اطمینان حاصل کنید که CustomUIProvider اضافه شده است
<CustomUIProvider loginRoute="/admin/auth" appRoute="/admin/dashboard">
  {children}
</CustomUIProvider>
```

### مشکل: بعد از لاگین redirect نمی‌شود

```tsx
// از useRouter استفاده کنید
const router = useRouter();

<AdminLoginForm
  onSuccess={() => router.push("/admin/dashboard")}
/>
```

### مشکل: خطای CORS

```env
# در فایل .env.local
NEXT_PUBLIC_REST_API_ENDPOINT=http://correct-api-url.com
```

---

## پشتیبانی

برای گزارش مشکلات یا درخواست ویژگی‌های جدید، لطفاً یک Issue در GitHub ایجاد کنید.

---

**نسخه:** 1.0.0  
**آخرین به‌روزرسانی:** 2024

