# راهنمای کامپوننت‌های استاندارد (Monorepo)

این سند کامپوننت‌های استاندارد در Monorepo را مشخص می‌کند. توسعه‌دهندگان (AI یا انسان) باید از پکیج‌های مناسب استفاده کنند و از تکرار کامپوننت‌ها جلوگیری کنند.

## ۱. هدف
- **یکپارچگی**: استفاده از یک کامپوننت واحد برای هر نوع قابلیت در تمام اپلیکیشن‌ها
- **قابلیت استفاده مجدد**: کامپوننت‌های مشترک در `packages/` قرار دارند
- **جلوگیری از تکرار**: کامپوننت‌های مشابه در اپلیکیشن‌های مختلف ایجاد نشود
- **نگهداری آسان**: تغییرات در یک جا تأثیر بر تمام اپ‌ها دارد

## ۲. سلسله مراتب کامپوننت‌ها

```
┌─────────────────────────────────────────────────────┐
│  @workspace/ui (shadcn/ui)                         │
│  کامپوننت‌های UI پایه - بدون business logic        │
│  Button, Input, Dialog, Form, Slider...            │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ استفاده می‌کند
                        │
┌─────────────────────────────────────────────────────┐
│  @workspace/custom-ui                               │
│  کامپوننت‌های گلوبال با business logic            │
│  UserCard, AdminLogin, ErrorBoundary...            │
└─────────────────────────────────────────────────────┘
                        ▲
                        │ استفاده می‌کند
                        │
┌─────────────────────────────────────────────────────┐
│  apps/[app-name]/src/components                    │
│  کامپوننت‌های خاص هر اپلیکیشن                     │
│  AdminDashboard, ExpertPanel...                    │
└─────────────────────────────────────────────────────┘
```

## ۳. لیست کامپوننت‌های استاندارد

### 3.1. کامپوننت‌های UI پایه (@workspace/ui)

| نوع کامپوننت | نام کامپوننت | محل | توضیحات | نحوه نصب |
|--------------|--------------|-----|---------|----------|
| دکمه | Button | `packages/ui/src/components/button.tsx` | دکمه‌های عمومی با variants مختلف | `pnpm dlx shadcn@latest add button` |
| اینپوت | Input | `packages/ui/src/components/input.tsx` | فیلدهای متنی | `pnpm dlx shadcn@latest add input` |
| تکست‌اریا | Textarea | `packages/ui/src/components/textarea.tsx` | ورودی چندخطی | `pnpm dlx shadcn@latest add textarea` |
| مودال | Dialog | `packages/ui/src/components/dialog.tsx` | مودال‌های عمومی | `pnpm dlx shadcn@latest add dialog` |
| اسلایدر | Slider | `packages/ui/src/components/slider.tsx` | اسلایدرهای عددی | `pnpm dlx shadcn@latest add slider` |
| فرم | Form | `packages/ui/src/components/form.tsx` | مدیریت فرم با react-hook-form | `pnpm dlx shadcn@latest add form` |
| Card | Card | `packages/ui/src/components/card.tsx` | کارت‌های نمایشی | `pnpm dlx shadcn@latest add card` |
| Table | Table | `packages/ui/src/components/table.tsx` | جداول داده | `pnpm dlx shadcn@latest add table` |
| Select | Select | `packages/ui/src/components/select.tsx` | دراپ‌داون انتخاب | `pnpm dlx shadcn@latest add select` |
| Checkbox | Checkbox | `packages/ui/src/components/checkbox.tsx` | چک‌باکس | `pnpm dlx shadcn@latest add checkbox` |

**نحوه استفاده:**
```typescript
import { Button, Input, Dialog } from '@workspace/ui';

<Button variant="default">ارسال</Button>
<Input placeholder="ایمیل خود را وارد کنید" />
```

### 3.2. کامپوننت‌های گلوبال (@workspace/custom-ui)

| نوع کامپوننت | نام کامپوننت | محل | توضیحات | محدودیت استفاده |
|--------------|--------------|-----|---------|------------------|
| احراز هویت ادمین | AdminLogin | `packages/custom-ui/src/auth/AdminLogin.tsx` | فرم لاگین ادمین با OTP | پنل‌های ادمین |
| کنترل دسترسی | ProtectedRoute | `packages/custom-ui/src/auth/ProtectedRoute.tsx` | محافظت از route‌ها | همه اپ‌ها |
| مدیریت خطا | ErrorBoundary | `packages/custom-ui/src/components/ErrorBoundary.tsx` | مدیریت خطاهای React | همه اپ‌ها |
| Toast | Toast | `packages/custom-ui/src/components/Toast.tsx` | نوتیفیکیشن‌ها | **فقط پنل‌های ادمین** |
| Loading | LoadingSpinner | `packages/custom-ui/src/components/LoadingSpinner.tsx` | اسپینر لودینگ | همه اپ‌ها |

**نحوه استفاده:**
```typescript
import { AdminLogin, ErrorBoundary, Toast } from '@workspace/custom-ui';

<ErrorBoundary>
  <AdminLogin onSuccess={() => {}} />
  <Toast message="عملیات موفق" />
</ErrorBoundary>
```

### 3.3. کامپوننت‌های خاص هر اپلیکیشن

این کامپوننت‌ها در `apps/[app-name]/src/components/` قرار دارند و فقط در همان اپلیکیشن استفاده می‌شوند:

**مثال برای admin-panel:**
- `AdminDashboard.tsx`: داشبورد اصلی ادمین
- `UserManagementTable.tsx`: جدول مدیریت کاربران
- `StatisticsCard.tsx`: کارت آمار (خاص ادمین)

**مثال برای digimoragheb:**
- `ProductCard.tsx`: کارت محصول
- `CategoryList.tsx`: لیست دسته‌بندی‌ها
- `SearchFilters.tsx`: فیلترهای جستجو

## ۴. قوانین استفاده

### ✅ باید انجام دهید:
1. **قبل از ایجاد کامپوننت، چک کنید**:
   - آیا کامپوننت مشابهی در `@workspace/ui` وجود دارد؟
   - آیا کامپوننت مشابهی در `@workspace/custom-ui` وجود دارد؟
   - آیا این کامپوننت در بیش از یک اپ نیاز است؟

2. **استفاده از workspace packages**:
   ```typescript
   // ✅ درست
   import { Button } from '@workspace/ui';
   import { AdminLogin } from '@workspace/custom-ui';
   ```

3. **برای کامپوننت UI جدید از shadcn استفاده کنید**:
   ```bash
   # از ریشه monorepo
   cd packages/ui
   pnpm dlx shadcn@latest add [component-name]
   ```

### ❌ نباید انجام دهید:
1. **نصب پکیج تکراری**:
   ```typescript
   // ❌ اشتباه - نصب کتابخانه مودال جدید
   npm install react-modal
   ```

2. **تکرار کامپوننت در اپ‌های مختلف**:
   ```typescript
   // ❌ اشتباه - ایجاد Button در هر اپ
   apps/admin-panel/src/components/Button.tsx
   apps/digimoragheb/src/components/Button.tsx
   
   // ✅ درست - استفاده از @workspace/ui
   import { Button } from '@workspace/ui';
   ```

3. **استفاده از Toast در غیر پنل‌های ادمین**:
   ```typescript
   // ❌ اشتباه - استفاده در صفحات عمومی
   apps/main-site/src/app/page.tsx → <Toast />
   
   // ✅ درست - فقط در پنل ادمین
   apps/admin-panel/src/app/dashboard/page.tsx → <Toast />
   ```

## ۵. فرآیند اضافه کردن کامپوننت جدید

### 5.1. کامپوننت UI پایه (shadcn)
```bash
# 1. رفتن به پکیج ui
cd packages/ui

# 2. اضافه کردن کامپوننت
pnpm dlx shadcn@latest add [component-name]

# 3. export کردن در index
# در packages/ui/src/index.ts
export * from './components/[component-name]';

# 4. استفاده در اپ
import { [ComponentName] } from '@workspace/ui';
```

### 5.2. کامپوننت گلوبال (با business logic)
```bash
# 1. ایجاد کامپوننت
packages/custom-ui/src/components/MyComponent.tsx

# 2. تایپ‌ها
packages/custom-ui/src/types/my-component.ts

# 3. export کردن
# در packages/custom-ui/src/index.ts
export { MyComponent } from './components/MyComponent';

# 4. به‌روزرسانی این سند
# اضافه کردن به جدول 3.2

# 5. تست
packages/custom-ui/src/__tests__/MyComponent.test.tsx
```

### 5.3. کامپوننت خاص اپ
```bash
# 1. ایجاد کامپوننت
apps/[app-name]/src/components/SpecificComponent.tsx

# 2. استفاده مستقیم
import SpecificComponent from '@/components/SpecificComponent';
```

## ۶. نکات مهم
- **برای shadcn components**: همیشه از CLI استفاده کنید تا تنظیمات درست اعمال شود
- **برای کامپوننت‌های گلوبال**: اگر در دو اپ نیاز شد، به `custom-ui` منتقل کنید
- **برای تست‌نویسی**: به TESTING_GUIDELINES.markdown مراجعه کنید
- **برای محل فایل‌ها**: به CODING_GUIDELINES.markdown مراجعه کنید
- **برای معماری**: به ARCHITECTURE.markdown مراجعه کنید