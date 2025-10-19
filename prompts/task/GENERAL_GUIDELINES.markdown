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

## ۱. نصب پکیج‌ها (Monorepo)

### 1.1. قوانین نصب در Monorepo
**قبل از نصب، چک کنید:**
1. آیا پکیج در workspace packages (`@workspace/*`) وجود دارد؟
2. آیا پکیج باید در ریشه یا در یک اپ/پکیج خاص نصب شود؟
3. آیا پکیج به صورت global در تمام workspace نیاز است؟

### 1.2. نصب در ریشه Monorepo (Global)
برای پکیج‌هایی که در تمام workspace نیاز هستند:
```bash
# از ریشه monorepo
pnpm add -w [package-name]

# مثال: نصب turbo
pnpm add -w turbo
```

### 1.3. نصب در یک اپلیکیشن خاص
```bash
# از ریشه monorepo
pnpm add [package-name] --filter [app-name]

# مثال: نصب در admin-panel
pnpm add axios --filter admin-panel

# یا رفتن به پوشه اپ
cd apps/admin-panel
pnpm add axios
```

### 1.4. نصب در یک پکیج workspace
```bash
# از ریشه monorepo
pnpm add [package-name] --filter @workspace/[package-name]

# مثال: نصب در framework
pnpm add axios --filter @workspace/framework

# یا رفتن به پوشه پکیج
cd packages/framework
pnpm add axios
```

### 1.5. استفاده از workspace packages
برای استفاده از پکیج‌های داخلی workspace:
```json
// در package.json اپلیکیشن
{
  "dependencies": {
    "@workspace/framework": "workspace:*",
    "@workspace/custom-ui": "workspace:*",
    "@workspace/ui": "workspace:*"
  }
}
```

### 1.6. پکیج‌های توسعه (dev dependencies)
```bash
# global dev dependency
pnpm add -D -w [package-name]

# dev dependency برای یک اپ
pnpm add -D [package-name] --filter [app-name]
```

### 1.7. مثال‌های واقعی
```bash
# نصب React Query در framework (قبلا نصب شده)
pnpm add @tanstack/react-query --filter @workspace/framework

# نصب shadcn component در ui
cd packages/ui
pnpm dlx shadcn@latest add button

# نصب پکیج تست در admin-panel
pnpm add -D vitest --filter admin-panel

# نصب TypeScript در کل workspace
pnpm add -D -w typescript
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