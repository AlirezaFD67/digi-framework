# راهنمای قبل از شروع تسک

این سند چک‌لیست اقدامات لازم قبل از شروع هر تسک در پروژه‌های Next.js را ارائه می‌دهد. توسعه‌دهندگان (AI یا انسان) باید این مراحل را به ترتیب انجام دهند.

## فهرست محتوا (TOC)
- [چک‌لیست قبل از شروع](#چک-لیست-قبل-از-شروع)
- [نکات](#نکات)
- [منابع مرتبط](#منابع-مرتبط)

## چک‌لیست قبل از شروع

### 1. بررسی محیط Monorepo
- [ ] **بررسی نسخه‌ها**:
  - Node.js: نسخه 18 یا بالاتر
  - pnpm: نسخه 8 یا بالاتر
  - Turborepo: نصب شده در workspace (بررسی `turbo.json`)
  - Next.js: نسخه مشخص‌شده در `package.json` هر اپ
  - TypeScript: نسخه سازگار (از workspace config استفاده می‌کند)

- [ ] **بررسی Workspace**:
  - فایل `pnpm-workspace.yaml` موجود است
  - تمام پکیج‌ها با `pnpm install` از ریشه نصب شده‌اند
  - Build موفقیت‌آمیز است: `pnpm build`

### 2. تعیین محل تسک
- [ ] **مشخص کنید تسک برای کدام بخش است**:
  - **اپلیکیشن خاص**: `apps/admin-panel/` یا `apps/digimoragheb/`؟
  - **پکیج مشترک**: نیاز به تغییر در `packages/framework/` یا `packages/custom-ui/` یا `packages/ui/`؟
  - **هر دو**: باید هم در package و هم در app تغییر داده شود؟

### 3. بررسی وابستگی‌ها
- [ ] **workspace packages موجود**:
  - `@workspace/framework`: برای API calls
  - `@workspace/custom-ui`: برای کامپوننت‌های گلوبال
  - `@workspace/ui`: برای کامپوننت‌های shadcn/ui
  - `@workspace/eslint-config`: برای lint rules
  - `@workspace/typescript-config`: برای TypeScript config

### 4. مطالعه مستندات
- [ ] **مستندات ضروری**:
  - **ARCHITECTURE.markdown**: برای درک ساختار Monorepo (حتما بخوانید!)
  - **CODING_GUIDELINES.markdown**: برای محل فایل‌ها در Monorepo
  - **COMPONENT_GUIDELINES.markdown**: برای تصمیم‌گیری محل کامپوننت (app vs custom-ui vs ui)
  - **API_GUIDELINES.markdown**: برای استفاده از `@workspace/framework`
  
- [ ] **مستندات اختیاری** (در صورت نیاز):
  - AUTH_GUIDELINES.markdown: برای احراز هویت
  - PERFORMANCE_GUIDELINES.markdown: برای بهینه‌سازی
  - SEO_GUIDELINES.markdown: برای SEO
  - TESTING_GUIDELINES.markdown: برای تست‌نویسی
### 5. چک کامپوننت‌ها و API
- [ ] **قبل از ایجاد کامپوننت جدید**:
  - آیا کامپوننت مشابهی در `@workspace/ui` وجود دارد؟
  - آیا کامپوننت مشابهی در `@workspace/custom-ui` وجود دارد؟
  - آیا این کامپوننت در بیش از یک اپلیکیشن نیاز است؟
    - **بله** → باید در `packages/custom-ui/` ایجاد شود
    - **خیر** → در `apps/[app-name]/src/components/` ایجاد شود

- [ ] **قبل از اضافه کردن API call**:
  - آیا endpoint مشابهی در `@workspace/framework` وجود دارد؟
  - آیا این endpoint در بیش از یک اپلیکیشن نیاز است؟
  - همیشه API logic را در `packages/framework/src/routes/` ایجاد کنید

### 6. ساخت برنچ
- [ ] **ایجاد برنچ از develop**:
  ```bash
  git checkout develop
  git pull
  git checkout -b [type]-[short-description]
  ```
  
  **انواع تغییر**:
  - `feat`: فیچر جدید
  - `fix`: رفع باگ
  - `refactor`: بازسازی کد
  - `chore`: تغییرات config، dependency و...
  
  **مثال**: `feat-add-user-management-to-admin-panel`

### 7. تأیید نهایی
- [ ] **تأیید کاربر**: قبل از شروع تسک، اطمینان حاصل کنید که:
  - تسک واضح و مشخص است
  - محل ایجاد فایل‌ها (app یا package) مشخص است
  - وابستگی‌های لازم موجود هستند

## نکات
- از تکرار کدها یا استفاده از ابزارهای غیراستاندارد پرهیز کنید.
- اطمینان حاصل کنید که محیط توسعه شما با پروژه سازگار است.

---

## منابع مرتبط
- [GENERAL_GUIDELINES.markdown](GENERAL_GUIDELINES.markdown): برای تنظیمات عمومی و پکیج‌ها.
- [CODING_GUIDELINES.markdown](CODING_GUIDELINES.markdown): برای نام‌گذاری و سازمان‌دهی فایل‌ها.
- [COMPONENT_GUIDELINES.markdown](COMPONENT_GUIDELINES.markdown): برای کامپوننت‌های استاندارد.
- [API_GUIDELINES.markdown](API_GUIDELINES.markdown): برای استفاده از APIها.
- [AUTH_GUIDELINES.markdown](AUTH_GUIDELINES.markdown): برای احراز هویت.
- [PERFORMANCE_GUIDELINES.markdown](PERFORMANCE_GUIDELINES.markdown): برای بهینه‌سازی عملکرد.
- [SEO_GUIDELINES.markdown](SEO_GUIDELINES.markdown): برای بهینه‌سازی SEO.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.