# 📚 Prompts Collection

مجموعه prompt های آماده برای کار با سیستم‌های مختلف monorepo.

## 🚀 Framework Package

### [🔐 سیستم Authentication](./framework/auth-system/)

مستندات کامل سیستم احراز هویت مبتنی بر OTP:

- **[⚡ راهنمای فوری](./framework/auth-system/quick-reference.md)** - کدهای آماده کپی-پیست
- **[📖 راهنمای سریع](./framework/auth-system/index.mdx)** - شروع سریع و مثال‌های کاربردی
- **[📚 مستندات کامل](./framework/auth-system/login-system-prompt.md)** - راهنمای جامع فنی
- **[📋 README](./framework/auth-system/README.md)** - راهنمای استفاده از مستندات

ویژگی‌های سیستم:
- ورود دو مرحله‌ای با OTP
- ورود ادمین با username و password
- مدیریت امن توکن‌ها
- فرم لاگین مدرن و واکنش‌گرا
- احراز هویت خودکار
- محافظت از مسیرها

### [➕ افزودن Endpoint جدید](./framework/add-endpoint/)

راهنمای کامل برای افزودن endpoint جدید به framework package:

- **[📖 راهنمای کامل](./framework/add-endpoint/index.mdx)** - راهنمای جامع
- **[📝 Template](./framework/add-endpoint/template.md)** - قالب آماده
- **[🚀 Ready-to-Use](./framework/add-endpoint/ready-to-use.md)** - Prompt آماده استفاده

## 🎨 Documentation System

### [📁 اضافه کردن کامپوننت جدید](./docs/add-component/)

برای اضافه کردن کامپوننت جدید به سیستم داکیومنت‌اسیون

### [🔄 آپدیت کامپوننت موجود](./docs/update-component/)

برای آپدیت کردن کامپوننت موجود در سیستم داکیومنت‌اسیون

### [🔧 رفع خطاهای سیستم](./docs/fix-errors/)

برای رفع خطاهای مختلف در سیستم داکیومنت‌اسیون

### [🏗️ سیستم Build و Registry](./docs/build-system/)

برای کار با سیستم Build و Registry

## 🎯 نحوه استفاده

### 1. **انتخاب Prompt مناسب**
بر اساس نیاز خود، prompt مناسب را انتخاب کنید.

### 2. **کپی کردن Prompt**
Prompt را کپی کرده و اطلاعات مورد نیاز خود را جایگزین کنید.

### 3. **ارسال به AI**
Prompt را به AI بدهید و منتظر نتیجه باشید.

## 📋 مثال استفاده

### پیاده‌سازی سیستم لاگین:

#### ورود با OTP (کاربران عادی):

```typescript
// 1. ایجاد صفحه لاگین
import { OTPLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  return (
    <OTPLoginForm
      onSuccess={() => router.push('/dashboard')}
      onError={(error) => console.error(error)}
    />
  );
}
```

#### ورود با Username/Password (ادمین):

```typescript
// 1. ایجاد صفحه لاگین ادمین
import { AdminLoginForm } from "@workspace/custom-ui";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  
  return (
    <AdminLoginForm
      onSuccess={() => router.push('/admin/dashboard')}
      onError={(error) => console.error(error)}
    />
  );
}
```

#### تنظیمات مشترک:

```typescript
// 2. اضافه کردن Provider
import { CustomUIProvider } from "@workspace/custom-ui";

export default function Layout({ children }) {
  return (
    <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
      {children}
    </CustomUIProvider>
  );
}

// 3. استفاده از احراز هویت
import { useAuthContext } from "@workspace/custom-ui";

function MyComponent() {
  const { user, isAuthenticated, logout, loginAsAdmin } = useAuthContext();
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>خروج</button>
      ) : (
        <p>لطفا وارد شوید</p>
      )}
    </div>
  );
}
```

### افزودن Endpoint جدید:

```
من می‌خوام یک endpoint جدید به framework package اضافه کنم. لطفا مراحل زیر رو به ترتیب انجام بده:

1. **تحلیل endpoint**: endpoint رو بررسی کن و مشخصاتش رو تعیین کن
2. **افزودن به API_ENDPOINTS**: endpoint رو به api-endpoints.ts اضافه کن
3. **ایجاد Route Structure**: فولدر و فایل‌های مورد نیاز رو بساز
4. **تعریف Types**: تمام interfaceها و typeهای مربوط به endpoint رو تعریف کن
5. **ایجاد توابع API**: توابع GET، POST، PUT، DELETE رو بساز
6. **ایجاد React Query Hooks**: هوک‌های مربوط به endpoint رو بساز
7. **Export و Build**: endpoint رو export کن و build کن
8. **تست**: مطمئن شو همه چیز درست کار می‌کنه

**Endpoint Information:**

**Endpoint Name:** users
**Base Path:** /users
**Description:** مدیریت کاربران سیستم

**API Endpoints:**
- LIST: /users (لیست کاربران)
- DETAIL: /users/{id} (جزئیات کاربر)
- SEARCH: /users/search (جستجوی کاربران)
- CREATE: /users (ایجاد کاربر)
- UPDATE: /users/{id} (به‌روزرسانی کاربر)
- DELETE: /users/{id} (حذف کاربر)
- BULK_DELETE: /users/bulk (حذف دسته‌ای)

**Response Example:**
{
  "result": {
    "status": "success",
    "message": "Users retrieved successfully"
  },
  "entries": [
    {
      "id": "user-1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "totalRows": 100,
    "pageCount": 10
  }
}

**Request Examples:**

// Create User
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "isActive": true
}

// Update User
{
  "id": "user-1",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}

// Query Parameters
{
  "pageNo": 1,
  "rowCount": 10,
  "search": "john",
  "role": "admin",
  "isActive": true
}
```

## 🎯 مزایای استفاده از Prompts

1. **⚡ سرعت بالا** - نیازی به نوشتن prompt از صفر نیست
2. **🎯 دقت بالا** - prompt های تست شده و بهینه
3. **📋 کامل** - تمام مراحل لازم پوشش داده شده
4. **🔄 قابل استفاده مجدد** - برای endpoint های مختلف
5. **📚 مستندسازی** - راهنمای کامل و جامع

## 🚀 شروع سریع

1. **انتخاب prompt** - بر اساس نیاز خود
2. **کپی کردن** - prompt را کپی کنید
3. **جایگزینی اطلاعات** - اطلاعات endpoint خود را جایگزین کنید
4. **ارسال به AI** - prompt را به AI بدهید
5. **دریافت نتیجه** - endpoint جدید آماده است!

---

**آماده‌اید شروع کنید؟ [افزودن Endpoint جدید](./docs/add-endpoint/ready-to-use.md) را مطالعه کنید! 🚀**