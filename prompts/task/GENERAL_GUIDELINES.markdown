# راهنمای عمومی پروژه

این سند دستورات عمومی برای مدیریت خطاها، لاگ‌گیری، سازمان‌دهی فایل‌های استاتیک، و نصب پکیج‌ها را مشخص می‌کند.

## فهرست محتوا (TOC)
- [۱. نصب پکیج‌ها](#۱-نصب-پکیجها)
- [۲. متغیرهای محیطی](#۲-متغیرهای-محیطی)
- [۳. مدیریت خطاها](#۳-مدیریت-خطاها)
- [۴. لاگ‌گیری](#۴-لاگگیری)
- [۵. سازمان‌دهی فایل‌های استاتیک](#۵-سازماندهی-فایلهای-استاتیک)
- [۶. مستندسازی عمومی](#۶-مستندسازی-عمومی)
- [۷. نکات](#۷-نکات)
- [منابع مرتبط](#منابع-مرتبط)

## ۱. نصب پکیج‌ها
- همه پکیج‌ها را با pnpm نصب کنید:
  ```bash
  pnpm install [package-name]
  ```
- برای پکیج‌های توسعه:
  ```bash
  pnpm add -D [package-name]
  ```
- مثال برای پکیج‌های اصلی:
  ```bash
  pnpm install next typescript @tanstack/react-query tailwindcss postcss autoprefixer @types/react-hook-form
  pnpm add -D jest @testing-library/react @testing-library/jest-dom
  ```

## ۲. متغیرهای محیطی
- متغیرهای محیطی را در `.env` تعریف کنید.
- مثال:
  ```env
  BASE_URL=https://api.example.com
  ```
- متغیرها را در `constants/index.ts` استفاده کنید:
  ```typescript
  export const BASE_URL = process.env BASE_URL || 'https://api.example.com';
  ```

## ۳. مدیریت خطاها
- فایل `lib/utils/errorHandler.ts` را ایجاد کنید.
- تابع `handleApiError` را با مشخصات زیر تعریف کنید:
  - خطاهای 401 را با refresh token (اگر `ENABLE_REFRESH_TOKEN` در `constants/index.ts` true باشد) مدیریت کند.
  - خطاهای دیگر (مثل 400، 500) را با shadcn/ui Toast به کاربر نمایش دهد.
- در کامپوننت‌ها از try-catch استفاده کنید.
- مثال:
  ```typescript
  import { handleApiError } from '@/lib/utils/errorHandler';
  try {
    const data = await apiClient.get('/users');
  } catch (error) {
    handleApiError(error);
  }
  ```

## ۴. لاگ‌گیری
- فایل `lib/utils/logger.ts` را ایجاد کنید.
- تابع `log` را برای لاگ‌گیری درخواست‌ها و خطاها تعریف کنید.
- لاگ‌ها را در محیط توسعه در console و در محیط production به سرویس (مثل Sentry) ارسال کنید.
- مثال:
  ```typescript
  import { log } from '@/lib/utils/logger';
  log('info', 'درخواست GET به /users', { status: 200 });
  ```

## ۵. سازمان‌دهی فایل‌های استاتیک
- فایل‌های استاتیک را در `public/` ذخیره کنید:
  - `public/images/` برای تصاویر (مثل `og-image.jpg`).
  - `public/icons/` برای آیکون‌ها (مثل `favicon.ico`).
  - `public/fonts/` برای فونت‌های سفارشی.
- مسیرها را با `/` شروع کنید (مثل `/images/og-image.jpg`).

## ۶. مستندسازی عمومی
- برای مستندسازی تسک‌ها به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.

## ۷. نکات
- برای تست‌نویسی به TESTING_GUIDELINES.markdown مراجعه کنید.
- برای جزئیات API به API_GUIDELINES.markdown مراجعه کنید.

---

## منابع مرتبط
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.
- [API_GUIDELINES.markdown](API_GUIDELINES.markdown): برای جزئیات API.