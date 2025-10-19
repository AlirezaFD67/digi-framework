# معماری پروژه (Monorepo)

این سند ساختار و اصول معماری Monorepo مبتنی بر Next.js و Turborepo را مشخص می‌کند.

## ۱. معماری کلی Monorepo
پروژه یک **Monorepo** است که با **Turborepo** و **pnpm workspaces** مدیریت می‌شود و شامل:
- **apps/**: اپلیکیشن‌های Next.js (هر کدام یک پروژه مستقل)
- **packages/**: پکیج‌های مشترک (framework، custom-ui، ui، eslint-config، typescript-config)

### تکنولوژی‌های استفاده شده:
- **Next.js** با App Router برای routing و React Server Components
- **TypeScript** برای تایپ‌های قوی
- **React Query** (در @workspace/framework) برای مدیریت API calls
- **Tailwind CSS** برای استایل‌دهی
- **shadcn/ui** (در @workspace/ui) برای کامپوننت‌های پایه
- **Turborepo** برای مدیریت build و task orchestration
- **pnpm** برای مدیریت بسته‌ها

### اصول کلیدی:
- **تفکیک اپلیکیشن و لایبرری**: هر اپلیکیشن در `apps/` مستقل است و از پکیج‌های مشترک در `packages/` استفاده می‌کند.
- **قابلیت استفاده مجدد**: کامپوننت‌های گلوبال در `@workspace/custom-ui` و API logic در `@workspace/framework` قرار دارند.
- **استانداردسازی**: تنظیمات eslint و typescript در پکیج‌های مشترک مرکزی شده‌اند.

## ۲. ساختار Monorepo
```
digi-framework/                    # ریشه monorepo
├── apps/                          # اپلیکیشن‌های Next.js
│   ├── admin-panel/               # پنل ادمین
│   │   ├── src/
│   │   │   ├── app/               # App Router (صفحات و layouts)
│   │   │   ├── components/        # کامپوننت‌های خاص این اپلیکیشن
│   │   │   ├── constants/         # ثابت‌های خاص این اپلیکیشن
│   │   │   └── types/             # تایپ‌های خاص این اپلیکیشن
│   │   ├── public/                # فایل‌های استاتیک
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   ├── application-expert/        # اپلیکیشن کارشناس
│   │   └── ... (ساختار مشابه admin-panel)
│   └── docs/                      # داکیومنتیشن سایت
│       └── ... (Fumadocs)
├── packages/                      # پکیج‌های مشترک
│   ├── framework/                 # 🎯 API Management & Data Fetching
│   │   ├── src/
│   │   │   ├── routes/            # API endpoints (auth, user, article...)
│   │   │   ├── providers/         # FrameworkProvider (React Query setup)
│   │   │   ├── utils/             # APIHttp, endpoints, generic hooks
│   │   │   └── types/             # Base types (BaseResponseType...)
│   │   └── README.md              # داکیومنت استفاده
│   ├── custom-ui/                 # 🎨 کامپوننت‌های گلوبال
│   │   ├── src/
│   │   │   ├── components/        # کامپوننت‌های مشترک بین اپ‌ها
│   │   │   ├── contexts/          # Context providers
│   │   │   ├── hooks/             # هوک‌های مشترک
│   │   │   ├── auth/              # سیستم احراز هویت
│   │   │   ├── constants/         # ثابت‌های گلوبال
│   │   │   └── types/             # تایپ‌های گلوبال
│   │   └── README.md
│   ├── ui/                        # 🧩 shadcn/ui Components
│   │   ├── src/
│   │   │   ├── components/        # Button, Input, Dialog...
│   │   │   ├── hooks/             # هوک‌های UI
│   │   │   └── styles/            # استایل‌های پایه
│   │   └── package.json
│   ├── eslint-config/             # تنظیمات ESLint مشترک
│   └── typescript-config/         # تنظیمات TypeScript مشترک
├── prompts/                       # پرامپت‌های AI و مستندات
│   ├── task/                      # راهنماهای توسعه
│   ├── framework/                 # راهنماهای framework
│   └── docs/                      # راهنماهای docs
├── pnpm-workspace.yaml            # تنظیمات workspace
├── turbo.json                     # تنظیمات Turborepo
└── package.json                   # پکیج اصلی monorepo
```

## ۳. جزئیات هر بخش

### 3.1. apps/ (اپلیکیشن‌ها)
هر اپلیکیشن در `apps/` یک پروژه Next.js مستقل است:
- **ساختار داخلی**: `src/app/` (App Router)، `src/components/` (کامپوننت‌های خاص)
- **وابستگی‌ها**: از `@workspace/framework`، `@workspace/custom-ui`، `@workspace/ui` استفاده می‌کند
- **نام‌گذاری صفحات**: در `src/app/` با فولدرهای kebab-case (مثل `users-management/`)

### 3.2. packages/framework (API Management)
**تمام logic مربوط به API در این پکیج قرار دارد:**
- **routes/**: هر فیچر یک فولدر (مثل `auth/`, `user/`, `article/`)
  - `get.ts`: توابع خام GET
  - `post.ts`: توابع خام POST/PUT/DELETE
  - `query.ts`: React Query hooks
  - `type.ts`: تایپ‌های مربوط به این endpoint
- **providers/**: `FrameworkProvider` برای setup React Query
- **utils/**: `APIHttp` (HTTP client)، `endpoints.ts` (API paths)، generic hooks

**قوانین استفاده از framework:**
- ✅ همیشه از `API_ENDPOINTS` در `utils/endpoints.ts` استفاده کنید
- ✅ توابع خام در `get.ts`/`post.ts`، هوک‌ها در `query.ts`
- ❌ هرگز endpoint را هاردکد نکنید
- ❌ مستقیم `APIHttp` در UI استفاده نکنید (فقط از hooks)

### 3.3. packages/custom-ui (کامپوننت‌های گلوبال)
**کامپوننت‌های مشترک بین تمام اپلیکیشن‌ها:**
- کامپوننت‌های پیچیده و business logic دار
- سیستم احراز هویت (`auth/`)
- Context providers و هوک‌های مشترک
- **زمان استفاده**: وقتی کامپوننت در بیش از یک اپلیکیشن نیاز است

### 3.4. packages/ui (shadcn/ui)
**کامپوننت‌های پایه UI:**
- Button، Input، Dialog، Form، Slider و...
- استایل‌های Tailwind
- هوک‌های UI ساده
- **نکته**: این پکیج فقط UI دارد، بدون business logic

## ۴. فلوی توسعه در Monorepo

### 4.1. اضافه کردن فیچر جدید به یک اپلیکیشن
1. **تعیین محل**: آیا فقط برای یک اپ است یا چند اپ؟
   - **فقط یک اپ**: در `apps/[app-name]/src/components/`
   - **چند اپ**: در `packages/custom-ui/src/components/`
2. **API مورد نیاز**: endpoint جدید در `packages/framework/src/routes/`
3. **تایپ‌ها**:
   - تایپ‌های خاص اپ: در `apps/[app-name]/src/types/`
   - تایپ‌های گلوبال: در `packages/custom-ui/src/types/`
4. **استفاده از کامپوننت‌ها**: از `@workspace/ui` برای UI پایه، از `@workspace/custom-ui` برای کامپوننت‌های پیچیده

### 4.2. اضافه کردن Endpoint جدید
1. فولدر جدید در `packages/framework/src/routes/[feature-name]/`
2. فایل‌ها: `get.ts`، `post.ts`، `query.ts`، `type.ts`
3. endpoint را در `utils/endpoints.ts` اضافه کنید
4. export در `index.ts` اصلی
5. مستندات در `apps/docs/content/docs/framework/`
6. **راهنما**: `prompts/framework/add-endpoint/` را مطالعه کنید

### 4.3. اضافه کردن کامپوننت گلوبال جدید
1. کامپوننت را در `packages/custom-ui/src/components/` ایجاد کنید
2. تایپ‌ها را در `packages/custom-ui/src/types/` تعریف کنید
3. export در `packages/custom-ui/src/index.ts`
4. در اپلیکیشن: `import { MyComponent } from '@workspace/custom-ui'`

## ۵. قوانین مهم Monorepo

### ✅ باید انجام دهید:
1. **از workspace packages استفاده کنید**: `@workspace/framework`, `@workspace/custom-ui`, `@workspace/ui`
2. **کامپوننت‌های گلوبال در custom-ui**: اگر در بیش از یک اپ نیاز است
3. **تمام API logic در framework**: هیچ‌وقت API call مستقیم در اپ‌ها ننویسید
4. **pnpm برای نصب**: همیشه از ریشه monorepo با `pnpm install`
5. **تنظیمات مشترک**: از `@workspace/eslint-config` و `@workspace/typescript-config`

### ❌ نباید انجام دهید:
1. **تکرار کد بین اپ‌ها**: اگر چیزی مشترک است، به `custom-ui` منتقل کنید
2. **API call مستقیم**: همیشه از `@workspace/framework` استفاده کنید
3. **نصب پکیج تکراری**: اگر پکیجی در workspace هست، از آن استفاده کنید
4. **شکستن dependency graph**: اپ‌ها به packages وابسته‌اند، نه بالعکس

## ۶. نکات
- برای جزئیات framework به `packages/framework/README.md` مراجعه کنید
- برای اضافه کردن endpoint به `prompts/framework/add-endpoint/` مراجعه کنید
- برای محل و نام‌گذاری فایل‌ها به CODING_GUIDELINES.markdown مراجعه کنید
- برای کامپوننت‌های استاندارد به COMPONENT_GUIDELINES.markdown مراجعه کنید
- برای API Guidelines به API_GUIDELINES.markdown مراجعه کنید