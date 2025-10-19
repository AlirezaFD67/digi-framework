# راهنمای بهینه‌سازی عملکرد (Monorepo)

این سند دستورات لازم برای بهینه‌سازی عملکرد در ساختار Monorepo را مشخص می‌کند.

## نکات ویژه Monorepo:
- **Build Caching**: Turborepo به صورت خودکار نتایج build را cache می‌کند
- **Parallel Execution**: تست‌ها و build های مستقل به صورت موازی اجرا می‌شوند
- **Selective Building**: فقط packageهای تغییر یافته rebuild می‌شوند
- **Shared Dependencies**: کتابخانه‌های مشترک یکبار نصب و استفاده می‌شوند

## ۱. بهینه‌سازی رندر
- از React Server Components در `app/` برای کاهش بار client-side استفاده کنید.
- برای کامپوننت‌های سنگین در سمت کلاینت، از `React.memo` استفاده کنید.
- از `useEffect` و `useState` فقط در صورت لزوم استفاده کنید.
- مثال:
  ```typescript
  import { memo } from 'react';
  const HeavyComponent = memo(() => {
    return <div>کامپوننت سنگین</div>;
  });
  ```

## ۲. بهینه‌سازی تصاویر
- تصاویر را در `public/images/` ذخیره کنید.
- از فرمت‌های بهینه (مثل WebP) استفاده کنید.
- از `next/image` برای لود تنبل (lazy loading) و بهینه‌سازی خودکار تصاویر استفاده کنید.
- مثال:
  ```typescript
  import Image from 'next/image';
  <Image src="/images/example.webp" alt="تصویر نمونه" width={1200} height={630} />
  ```

## ۳. بهینه‌سازی درخواست‌های API
- تعداد درخواست‌های API را با استفاده از batching در React Query کاهش دهید.
- از cache در React Query برای جلوگیری از درخواست‌های تکراری استفاده کنید.
- مثال:
  ```typescript
  import { useQuery } from '@tanstack/react-query';
  import { getUsers } from '@/lib/api/users';

  export const useUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
      staleTime: 5 * 60 * 1000, // ۵ دقیقه cache
    });
  };
  ```

## ۴. بهینه‌سازی باندل
- از `next.config.js` برای تنظیمات بهینه‌سازی باندل استفاده کنید.
- ماژول‌های سنگین را به‌صورت dynamic import کنید.
- مثال:
  ```typescript
  import dynamic from 'next/dynamic';
  const HeavyComponent = dynamic(() => import('@/components/features/HeavyComponent'), { ssr: false });
  ```

## ۵. بررسی عملکرد
- از Google Lighthouse برای تست عملکرد استفاده کنید:
  ```bash
  lighthouse ${process.env.BASE_URL} --view
  ```
- امتیاز عملکرد حداقل ۸۰ هدف‌گذاری شود.
- خطاهای گزارش‌شده را برطرف کنید.

## ۶. نکات
- برای مدیریت فایل‌های استاتیک به GENERAL_GUIDELINES.markdown مراجعه کنید.
- برای جزئیات API به API_GUIDELINES.markdown و API_DOCUMENTATION.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای اقدامات قبل و بعد از تسک به before_task.md و after_task.md مراجعه کنید.