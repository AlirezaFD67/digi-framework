# راهنمای قبل از شروع تسک

این سند چک‌لیست اقدامات لازم قبل از شروع هر تسک در پروژه‌های Next.js را ارائه می‌دهد. توسعه‌دهندگان (AI یا انسان) باید این مراحل را به ترتیب انجام دهند.

## فهرست محتوا (TOC)
- [چک‌لیست قبل از شروع](#چک-لیست-قبل-از-شروع)
- [نکات](#نکات)
- [منابع مرتبط](#منابع-مرتبط)

## چک‌لیست قبل از شروع
- [ ] **بررسی نسخه‌ها**:
  - Node.js: نسخه 18 یا بالاتر (یا نسخه مشخص‌شده در پروژه).
  - pnpm: آخرین نسخه پایدار.
  - Next.js: نسخه مشخص‌شده در `package.json`.
  - TypeScript: نسخه سازگار با پروژه.
- [ ] **بررسی فایل‌های تنظیمات**:
  - فایل `.env` برای متغیرهای محیطی (طبق GENERAL_GUIDELINES.markdown).
  - فایل `next.config.js` و `tsconfig.json` برای تنظیمات پروژه.
  - فایل `.gitignore` برای جلوگیری از ورود فایل‌های غیرضروری به گیت.
- [ ] **مطالعه مستندات**:
  - CODING_GUIDELINES.markdown: برای نام‌گذاری و سازمان‌دهی فایل‌ها.
  - COMPONENT_GUIDELINES.markdown: برای استفاده از کامپوننت‌های استاندارد.
  - API_GUIDELINES.markdown: برای استفاده از APIها.
  - AUTH_GUIDELINES.markdown: برای احراز هویت.
  - PERFORMANCE_GUIDELINES.markdown: برای بهینه‌سازی عملکرد.
  - SEO_GUIDELINES.markdown: برای بهینه‌سازی SEO.
  - TESTING_GUIDELINES.markdown: برای تست‌نویسی.
- [ ] **ساخت برنچ**:
  - وقتی گفته می‌شود "برنچ بساز"، یک برنچ جدید از روی برنچ `develop` با فرمت `[نوع تغییر]: [توضیح مختصر]` ایجاد کنید.
  - انواع تغییر: `Feat`, `Fix`, `Add`, `Update`, `Refactor`, `Remove`.
  - مثال: `Feat: Add user management`
  - دستور نمونه (برای بروزرسانی و ایجاد برنچ):
    ```bash
    git checkout develop  # سوئیچ به برنچ اصلی توسعه
    git pull             # دریافت آخرین تغییرات
    git checkout -b Feat-Add-user-management  # ایجاد برنچ جدید
    ```
- [ ] **بررسی کامپوننت‌های استاندارد**:
  - فقط از کامپوننت‌های لیست‌شده در COMPONENT_GUIDELINES.markdown استفاده کنید.
  - استفاده از کامپوننت‌های غیراستاندارد یا پکیج‌های جدید ممنوع است.
- [ ] **تأیید کاربر**:
  - قبل از شروع تسک، تأیید کاربر (صاحب پروژه) را دریافت کنید.

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