# راهنمای بعد از پایان تسک

این سند چک‌لیست اقدامات لازم بعد از اتمام هر تسک در پروژه‌های Next.js را ارائه می‌دهد. توسعه‌دهندگان (AI یا انسان) باید این مراحل را به ترتیب انجام دهند.

## فهرست محتوا (TOC)
- [چک‌لیست بعد از تسک](#چک-لیست-بعد-از-تسک)
- [نکات](#نکات)
- [منابع مرتبط](#منابع-مرتبط)

## چک‌لیست بعد از تسک

### 1. چک Build و Type
- [ ] **Build موفقیت‌آمیز**:
  ```bash
  # از ریشه monorepo
  pnpm build
  
  # یا فقط برای یک package/app
  pnpm build --filter [app-name]
  pnpm build --filter @workspace/[package-name]
  ```

- [ ] **TypeScript errors نداشته باشد**:
  ```bash
  pnpm typecheck
  ```

- [ ] **Lint errors برطرف شده**:
  ```bash
  pnpm lint
  ```

### 2. مستندسازی تسک
- [ ] **داکیومنت تسک** (در صورت نیاز):
  - اگر تسک پیچیده بود، در `docs/tasks/` مستند کنید
  - فرمت: `[shamsiDate]-[TaskID]-[TaskName].md`
  - مثال: `docs/tasks/1404-05-01-T123-UserManagement.md`

### 3. مستندسازی API (اگر endpoint جدید اضافه شد)
- [ ] **اگر در `@workspace/framework` endpoint جدید ایجاد کردید**:
  - مستندات در `apps/docs/content/docs/framework/` اضافه شود
  - مثال‌های استفاده در داکیومنت باشد
  - تایپ‌ها و پاسخ‌ها مستند شوند

### 4. مستندسازی کامپوننت (اگر کامپوننت گلوبال اضافه شد)
- [ ] **اگر در `@workspace/custom-ui` کامپوننت جدید ایجاد کردید**:
  - کامپوننت را به `COMPONENT_GUIDELINES.markdown` اضافه کنید
  - نحوه استفاده و props را مستند کنید

- [ ] **اگر در `@workspace/ui` کامپوننت shadcn اضافه کردید**:
  - در `COMPONENT_GUIDELINES.markdown` لیست کنید

### 5. تست‌نویسی
- [ ] **تست‌ها نوشته شده**:
  - تست کامپوننت اپ: `apps/[app-name]/src/__tests__/`
  - تست کامپوننت گلوبال: `packages/custom-ui/src/__tests__/`
  - تست API: `packages/framework/src/__tests__/`

- [ ] **تست‌ها پاس می‌شوند**:
  ```bash
  pnpm test
  
  # با coverage
  pnpm test --coverage
  ```

### 6. Export و Re-export
- [ ] **اگر در package تغییر دادید، export کنید**:
  - در `packages/framework/src/index.ts`
  - در `packages/custom-ui/src/index.ts`
  - در `packages/ui/src/index.ts`

### 7. به‌روزرسانی CHANGELOG (در صورت نیاز)
- [ ] **اگر تغییرات مهمی در package بود**:
  - `packages/framework/CHANGELOG.md` را به‌روزرسانی کنید
  - نسخه package را در `package.json` افزایش دهید (اگر نیاز بود)
### 8. کامیت و Push
- [ ] **پیشنهاد عنوان کامیت**:
  - فرمت: `[type]([scope]): [short description]`
  - **type**: feat, fix, refactor, chore, docs
  - **scope**: نام package یا app
  - مثال‌ها:
    ```bash
    feat(admin-panel): add user management table
    fix(framework): resolve auth token refresh issue
    chore(ui): add new button variant
    refactor(custom-ui): improve error boundary logic
    ```

- [ ] **Stage و Commit**:
  ```bash
  git add .
  git commit -m "feat(admin-panel): add user management"
  ```

- [ ] **تأیید کاربر برای Push**:
  - قبل از push، تأیید بگیرید
  ```bash
  git push origin [branch-name]
  ```

### 9. بررسی کیفیت (اختیاری)
- [ ] **Performance** (برای صفحات جدید):
  - از Lighthouse برای تست عملکرد استفاده کنید
  
- [ ] **SEO** (برای صفحات عمومی):
  - metadata، canonical URLs، og:image چک شوند

### 10. تمیز کاری
- [ ] **فایل‌های موقت حذف شوند**
- [ ] **console.log های debug حذف شوند**
- [ ] **import های استفاده نشده حذف شوند**

### 11. اطلاع‌رسانی به تیم
- [ ] **Pull Request ایجاد شود**:
  - توضیحات واضح از تغییرات
  - اگر breaking change هست، مشخص شود
  - screenshot/gif اگر UI تغییر کرده

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