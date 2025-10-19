# راهنمای مستندسازی APIها

این سند دستورات لازم برای مستندسازی endpointهای API در پروژه‌های Next.js را مشخص می‌کند. هر endpoint باید در یک فایل جداگانه در `docs/api/endpoints/` مستند شود تا نظم و دسترسی‌پذیری حفظ شود.

## ۱. محل مستندات
- هر endpoint در یک فایل جداگانه با نام `[Method]-[EndpointName].md` (مثل `POST-login.md`) در `docs/api/endpoints/` ایجاد شود.
- مثال ساختار:
  ```
  docs/api/endpoints/
  ├── GET-users.md
  ├── POST-login.md
  ├── PUT-user-id.md
  ├── DELETE-user-id.md
  ```

## ۲. قالب مستندات endpoint
- هر فایل شامل بخش‌های زیر باشد:
  - **عنوان**: روش و نام endpoint (مثل `POST /auth/login`).
  - **توضیحات**: شرح مختصر هدف endpoint.
  - **requiresAuth**: فلگ boolean که مشخص می‌کند آیا endpoint به توکن احراز هویت نیاز دارد یا خیر.
  - **ورودی‌ها**: ساختار و نوع داده‌های ورودی (مثل JSON).
  - **پاسخ‌ها**: ساختار و نوع داده‌های پاسخ (موفق و خطا).
  - **نمونه**: نمونه‌های واقعی از ورودی و پاسخ.
- مثال:
  ```markdown
  # POST /auth/login

  ## توضیحات
  احراز هویت کاربر و دریافت توکن.

  ## requiresAuth
  خیر

  ## ورودی‌ها
  - `email`: string (اجباری)
  - `password`: string (اجباری)

  ## پاسخ‌ها
  - **موفق (200)**:
    - `token`: string
    - `user`: { id: string, email: string, role: string }
  - **خطا (401)**:
    - `error`: string

  ## نمونه
  **درخواست**:
  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```
  **پاسخ موفق**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "1", "email": "test@example.com", "role": "user" }
  }
  ```
  **پاسخ خطا**:
  ```json
  { "error": "ایمیل یا رمز عبور اشتباه است" }
  ```
  ```

## ۳. فرآیند مستندسازی
- **اضافه کردن endpoint جدید**:
  1. فایل جدید با نام `[Method]-[EndpointName].md` در `docs/api/endpoints/` ایجاد کنید.
  2. اطلاعات ورودی، پاسخ، و فلگ `requiresAuth` را طبق قالب بالا وارد کنید.
  3. نمونه‌های واقعی از درخواست و پاسخ را اضافه کنید.
- **به‌روزرسانی endpoint موجود**:
  1. فایل مربوط به endpoint را در `docs/api/endpoints/` ویرایش کنید.
  2. تغییرات را با تیم هماهنگ کنید.
- توسعه‌دهندگان (AI یا انسان) باید هنگام اضافه کردن endpoint جدید، بلافاصله مستندات آن را ایجاد کنند.

## ۴. نکات
- برای جزئیات API به API_GUIDELINES.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای مدیریت توکن‌ها به AUTH_GUIDELINES.markdown مراجعه کنید.
- از ابزارهای خارجی مثل Swagger فقط در صورت تأیید کاربر استفاده کنید.