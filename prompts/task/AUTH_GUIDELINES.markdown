# راهنمای Authentication و کنترل دسترسی

این سند دستورات لازم برای پیاده‌سازی authentication و مدیریت دسترسی کاربران را مشخص می‌کند.

## ۱. تنظیم Context برای Authentication
- فایل `lib/context/AuthContext.tsx` را ایجاد کنید.
- context را با نوع `AuthContextType` شامل `user` (از نوع `User | null`) و تابع `setUser` تعریف کنید.
- از `AuthProvider` برای wrap کردن اپلیکیشن در `app/(main)/layout.tsx` یا `app/dashboard/layout.tsx` (بسته به نیاز) استفاده کنید.
- مثال:
  ```typescript
  import { createContext, useState } from 'react';
  import { User } from '@/types/user';

  export const AuthContext = createContext(undefined);
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
  };
  ```

## ۲. تنظیم Middleware برای حفاظت از Routes
- فایل `middleware.ts` را در ریشه پروژه ایجاد کنید.
- routes محافظت‌شده را در `config.matcher` تعریف کنید (مثل `["/dashboard/:path*", "/admin/:path*"]`).
- token را از cookies بررسی کنید.
- اگر token وجود نداشت یا معتبر نبود، کاربر را به `/login` ریدایرکت کنید و URL اصلی را در query parameter `redirect` ذخیره کنید.
- مثال:
  ```typescript
  import { NextResponse } from 'next/server';

  export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*']
  };
  ```

## ۳. فانکشن عمومی برای چک لاگین با مودال
- فایل `lib/auth/helpers.ts` را ایجاد کنید.
- تابع `requireAuth` را تعریف کنید که:
  - وضعیت لاگین را با `useAuth` بررسی کند.
  - اگر کاربر لاگین نبود، مودال لاگین (با `AuthForm` از `components/features/AuthForm.tsx`) را باز کند.
  - بعد از لاگین موفق، callback ورودی را اجرا کند.
- از shadcn/ui Dialog برای مودال استفاده کنید.
- مثال:
  ```typescript
  import { requireAuth } from '@/lib/auth/helpers';

  const handleClick = () => {
    requireAuth(() => {
      // کد بعد از لاگین
    });
  };
  ```

## ۴. ریدایرکت به صفحه لاگین برای صفحات Protected
- در صفحات protected (مثل `app/dashboard/page.tsx`)، از `useAuth` و `useRouter` برای چک client-side استفاده کنید.
- اگر کاربر لاگین نبود، به `/login` ریدایرکت کنید.
- مثال:
  ```typescript
  'use client';
  import { useRouter } from 'next/navigation';
  import { useAuth } from '@/lib/hooks/useAuth';
  import { useEffect } from 'react';

  export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user]);

    if (!user) return null;
    return <div>محتوای داشبورد</div>;
  }
  ```

## ۵. مدیریت نقش‌های کاربری
- نقش‌های کاربری (مثل admin، user) را در تایپ `User` در `types/user.ts` تعریف کنید.
- دسترسی‌ها را در middleware یا کامپوننت‌ها بر اساس نقش کاربر بررسی کنید.
- مثال:
  ```typescript
  export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
  }
  ```

## ۶. نکات
- برای مدیریت token به API_GUIDELINES.markdown مراجعه کنید.
- برای مستندسازی APIها به API_DOCUMENTATION.markdown مراجعه کنید.
- برای تست‌های authentication به TESTING_GUIDELINES.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای اقدامات قبل و بعد از تسک به before_task.md و after_task.md مراجعه کنید.
- برای اقدامات قبل و بعد از آپدیت تسک به before_update.md و after_update.md مراجعه کنید.