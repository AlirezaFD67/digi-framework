# راهنمای بعد از پایان آپدیت تسک

این سند چک‌لیست اقدامات لازم بعد از اتمام آپدیت هر تسک در پروژه‌های Next.js را ارائه می‌دهد. توسعه‌دهندگان (AI یا انسان) باید این مراحل را به ترتیب انجام دهند تا تغییرات کامل و استاندارد اعمال شوند.

## چک‌لیست بعد از آپدیت
- [ ] **مستندسازی آپدیت تسک**:
  - منطق آپدیت و جزئیات تغییرات را در `docs/tasks/[shamsiDate]-[TaskID]-[TaskName]-v[n].md` طبق TASK_DOCUMENTATION_GUIDELINES.markdown ثبت کنید (n شماره نسخه آپدیت، مثل v1 برای اولین آپدیت).
  - لینک به داکیومنت تسک اصلی و لیست دقیق تغییرات (چه چیزی تغییر کرد، چرا، و چطور) را اضافه کنید.
  - مثال: `docs/tasks/1404-05-01-T123-UserManagement-v1.md`
- [ ] **مستندسازی APIها**:
  - اگر endpoint تغییر کرده، فایل مربوطه در `docs/api/endpoints/` را طبق API_DOCUMENTATION.markdown به‌روزرسانی کنید.
- [ ] **تست‌نویسی و به‌روزرسانی**:
  - تست‌های واحد یا یکپارچه را در `tests/__tests__/[FeatureName].test.tsx` طبق TESTING_GUIDELINES.markdown به‌روزرسانی کنید.
  - پوشش تست حداقل 80% باشد (با `pnpm jest --coverage` بررسی کنید).
- [ ] **به‌روزرسانی داکیومنت‌ها**:
  - کامپوننت‌های تغییرکرده را به COMPONENT_GUIDELINES.markdown اضافه یا به‌روزرسانی کنید.
  - ارورهای جدید یا تغییرکرده را به `lib/utils/errorHandler.ts` طبق GENERAL_GUIDELINES.markdown اضافه کنید.
  - نکات عملکردی جدید را به PERFORMANCE_GUIDELINES.markdown اضافه کنید.
  - نکات SEO جدید را به SEO_GUIDELINES.markdown اضافه کنید.
  - جستجو در کل پروژه برای به‌روزرسانی همه references مرتبط (مثل constants، utils، hooks).
- [ ] **پیشنهاد عنوان کامیت**:
  - وقتی گفته می‌شود "کامیت بده"، یک عنوان کامیت استاندارد به انگلیسی با فرمت `[نوع تغییر]: [توضیح مختصر آپدیت]` پیشنهاد دهید.
  - انواع تغییر: `Feat`, `Fix`, `Add`, `Update`, `Refactor`, `Remove`.
  - مثال: `Update: Revise user management policy`
  - دستور نمونه:
    ```bash
    git commit -m "Update: Revise user management policy"
    ```
- [ ] **بررسی کیفیت**:
  - از Google Lighthouse برای تست عملکرد و SEO استفاده کنید (طبق PERFORMANCE_GUIDELINES.markdown و SEO_GUIDELINES.markdown).
  - فایل‌های اضافی یا غیرضروری را حذف کنید.
  - کل پروژه را برای سازگاری با تغییرات (مثل شکستن کدهای وابسته) تست کنید.
- [ ] **تأیید کاربر**:
  - قبل از push یا merge، تأیید کاربر (صاحب پروژه) را دریافت کنید.
- [ ] **اطلاع‌رسانی به تیم**:
  - تغییرات را از طریق pull request یا کامیت به تیم اطلاع دهید.

## نکات
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای به‌روزرسانی داکیومنت‌های API به API_DOCUMENTATION.markdown مراجعه کنید.
- از اضافه کردن پکیج‌ها یا کامپوننت‌های غیراستاندارد پرهیز کنید.
- همه تغییرات باید با معماری پروژه (طبق ARCHITECTURE.markdown) هم‌خوانی داشته باشند.