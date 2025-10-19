# معماری پروژه

این سند ساختار و اصول معماری پروژه‌های مبتنی بر Next.js را مشخص می‌کند.

## ۱. معماری پروژه
- پروژه از تکنولوژی‌های زیر استفاده می‌کند:
  - Next.js با App Router برای routing و پشتیبانی از React Server Components.
  - TypeScript برای تایپ‌های قوی و جلوگیری از خطاها.
  - React Query برای مدیریت درخواست‌های API (queries و mutations).
  - Tailwind CSS و shadcn/ui برای استایل‌دهی و کامپوننت‌های آماده.
  - Context API برای مدیریت stateهای ساده (مثل authentication).
- اصول کلیدی:
  - کامپوننت‌محور: صفحات، layoutها، و UI به‌صورت کامپوننت طراحی شوند.
  - سادگی و قابلیت استفاده مجدد: ساختار برای پروژه‌های کوچک تا متوسط قابل‌استفاده باشد.
  - تمرکز: APIها، تایپ‌ها، و ثابت‌ها در مکان‌های مشخص (lib/, types/, constants/) قرار گیرند.
  - جداسازی سایت اصلی و داشبورد: صفحات سایت اصلی در `app/(main)/` و داشبورد ادمین در `app/dashboard/` قرار گیرند. کامپوننت‌ها، lib، types، constants و tests مشترک هستند، مگر اینکه کامپوننت خاصی برای سایت اصلی یا داشبورد تعریف شود (در `components/features/` مشخص کنید اگر لازم است).

## ۲. وابستگی‌های پروژه
- پکیج‌های اصلی:
  - Next.js
  - TypeScript
  - @tanstack/react-query
  - tailwindcss
  - shadcn/ui
- برای نصب پکیج‌ها، به GENERAL_GUIDELINES.markdown مراجعه کنید.

## ۳. ساختار پروژه
- فایل‌ها و دایرکتوری‌ها به‌صورت زیر سازمان‌دهی شوند:
  ```
  project-root/
  ├── app/                      # routing و صفحات اصلی
  │   ├── (main)/               # صفحات سایت اصلی
  │   │   ├── layout.tsx        # layout اصلی سایت (مثل navbar عمومی)
  │   │   ├── page.tsx          # صفحه اصلی سایت (مثل صفحه هوم)
  │   │   ├── login/page.tsx    # صفحه لاگین (مشترک، اما در سایت اصلی)
  │   │   └── globals.css       # استایل‌های Tailwind و shadcn (مشترک)
  │   ├── dashboard/            # پنل ادمین و داشبورد کاربر
  │   │   ├── layout.tsx        # layout داشبورد (مثل sidebar ادمین)
  │   │   └── page.tsx          # صفحه اصلی داشبورد (مثل پنل مدیریت)
  │   └── errors/               # صفحات ارور (مشترک)
  │       ├── 404/page.tsx      # صفحه 404 (Not Found)
  │       ├── 500/page.tsx      # صفحه 500 (Server Error)
  │       └── [code]/page.tsx   # صفحه عمومی برای سایر کدهای ارور
  ├── components/               # کامپوننت‌های UI (مشترک، مگر اینکه خاص تعریف شود)
  │   ├── ui/                   # کامپوننت‌های shadcn (مثل Button، Input)
  │   ├── features/             # کامپوننت‌های خاص فیچر (مثل AuthForm؛ اگر خاص سایت یا داشبورد، در نام‌گذاری مشخص کنید)
  │   └── layout/               # کامپوننت‌های layout (مثل Navbar؛ اگر خاص سایت یا داشبورد، جدا تعریف کنید)
  ├── lib/                      # توابع و ابزارهای عمومی (مشترک)
  │   ├── api/                  # توابع API (به API_GUIDELINES مراجعه کنید)
  │   ├── hooks/                # هوک‌های عمومی (مثل useAuth)
  │   ├── context/              # context برای state (مثل AuthContext)
  │   └── utils/                # ابزارهای عمومی (مثل errorHandler)
  ├── types/                    # تایپ‌های TypeScript (مشترک)
  ├── constants/                # ثابت‌ها (مثل endpoints) (مشترک)
  ├── tests/                    # تست‌ها (به TESTING_GUIDELINES مراجعه کنید) (مشترک)
  ├── docs/                     # مستندات پروژه
  │   ├── api/endpoints/        # مستندات endpointهای API
  │   ├── tasks/                # مستندات تسک‌ها
  │   ├── before_task.md        # چک‌لیست قبل از تسک
  │   ├── after_task.md         # چک‌لیست بعد از تسک
  │   ├── before_update.md      # چک‌لیست قبل از آپدیت تسک
  │   ├── after_update.md       # چک‌لیست بعد از آپدیت تسک
  │   └── API_DOCUMENTATION.md  # راهنمای مستندسازی APIها
  ├── public/                   # assets استاتیک (مثل images/, icons/) (مشترک)
  ├── .env                      # متغیرهای محیطی
  ├── next.config.js            # تنظیمات Next.js
  ├── tsconfig.json             # تنظیمات TypeScript
  └── package.json
  ```

## ۴. نکات
- برای جزئیات APIها به API_GUIDELINES.markdown و API_DOCUMENTATION.markdown مراجعه کنید.
- برای محل و نام‌گذاری فایل‌ها به CODING_GUIDELINES.markdown مراجعه کنید.
- برای تست‌پذیری به TESTING_GUIDELINES.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای اقدامات قبل و بعد از تسک به before_task.md و after_task.md مراجعه کنید.
- برای اقدامات قبل و بعد از آپدیت تسک به before_update.md و after_update.md مراجعه کنید.