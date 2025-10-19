# راهنمای بعد از پایان تسک

این سند چک‌لیست اقدامات لازم بعد از اتمام هر تسک در پروژه‌های Next.js را ارائه می‌دهد. توسعه‌دهندگان (AI یا انسان) باید این مراحل را به ترتیب انجام دهند.

## فهرست محتوا (TOC)
- [چک‌لیست بعد از تسک](#چک-لیست-بعد-از-تسک)
- [نکات](#نکات)
- [منابع مرتبط](#منابع-مرتبط)

## چک‌لیست بعد از تسک
- [ ] **مستندسازی تسک**:
  - منطق تسک و جزئیات آن را در `docs/tasks/[shamsiDate]-[TaskID]-[TaskName].md` طبق TASK_DOCUMENTATION_GUIDELINES.markdown ثبت کنید.
  - مثال: `docs/tasks/1404-05-01-T123-UserManagement.md`
- [ ] **مستندسازی APIها**:
  - اگر endpoint جدیدی اضافه شده، یک فایل جدید در `docs/api/endpoints/` با جزئیات ورودی، پاسخ، و فلگ `requiresAuth` طبق API_DOCUMENTATION.markdown ایجاد کنید.
- [ ] **تست‌نویسی**:
  - تست‌های واحد یا یکپارچه را در `tests/__tests__/[FeatureName].test.tsx` طبق TESTING_GUIDELINES.markdown بنویسید.
  - پوشش تست حداقل 80% باشد (با `pnpm jest --coverage` بررسی کنید).
- [ ] **به‌روزرسانی داکیومنت‌ها**:
  - کامپوننت‌های جدید را به COMPONENT_GUIDELINES.markdown اضافه کنید.
  - ارورهای جدید را به `lib/utils/errorHandler.ts` طبق GENERAL_GUIDELINES.markdown اضافه کنید.
  - نکات عملکردی جدید را به PERFORMANCE_GUIDELINES.markdown اضافه کنید.
  - نکات SEO جدید را به SEO_GUIDELINES.markdown اضافه کنید.
- [ ] **پیشنهاد عنوان کامیت**:
  - وقتی گفته می‌شود "کامیت بده"، یک عنوان کامیت استاندارد به انگلیسی با فرمت `[نوع تغییر]: [توضیح مختصر]` پیشنهاد دهید.
  - انواع تغییر: `Feat`, `Fix`, `Add`, `Update`, `Refactor`, `Remove`.
  - مثال: `Feat: Add user management`
  - دستور نمونه (برای کامیت تغییرات):
    ```bash
    git commit -m "Feat: Add user management"  # کامیت با عنوان استاندارد
    ```
- [ ] **بررسی کیفیت**:
  - از Google Lighthouse برای تست عملکرد و SEO استفاده کنید (طبق PERFORMANCE_GUIDELINES.markdown و SEO_GUIDELINES.markdown).
  - فایل‌های اضافی یا غیرضروری را حذف کنید.
- [ ] **تأیید کاربر**:
  - قبل از push یا merge، تأیید کاربر (صاحب پروژه) را دریافت کنید.
- [ ] **اطلاع‌رسانی به تیم**:
  - تغییرات را از طریق pull request یا کامیت به تیم اطلاع دهید.

## نکات
- از اضافه کردن پکیج‌ها یا کامپوننت‌های غیراستاندارد پرهیز کنید.
- برای اقدامات قبل و بعد از آپدیت تسک به before_update.md و after_update.md مراجعه کنید.

---

## منابع مرتبط
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.
- [API_DOCUMENTATION.markdown](API_DOCUMENTATION.markdown): برای مستندسازی APIها.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.
- [COMPONENT_GUIDELINES.markdown](COMPONENT_GUIDELINES.markdown): برای کامپوننت‌ها.
- [GENERAL_GUIDELINES.markdown](GENERAL_GUIDELINES.markdown): برای ارورها و تنظیمات.
- [PERFORMANCE_GUIDELINES.markdown](PERFORMANCE_GUIDELINES.markdown): برای عملکرد.
- [SEO_GUIDELINES.markdown](SEO_GUIDELINES.markdown): برای SEO.
- [before_update.markdown](before_update.markdown): برای آپدیت تسک‌ها.
- [after_update.markdown](after_update.markdown): برای پس از آپدیت تسک‌ها.