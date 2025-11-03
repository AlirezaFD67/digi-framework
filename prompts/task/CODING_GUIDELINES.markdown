# راهنمای کدنویسی

این سند دستورات لازم برای کدنویسی، نام‌گذاری، و سازمان‌دهی فایل‌ها را مشخص می‌کند.

## فهرست محتوا (TOC)
- [۱. محل ایجاد فایل‌های جدید](#۱-محل-ایجاد-فایلهای-جدید)
- [۲. روش‌های نام‌گذاری](#۲-روشهای-نامگذاری)
- [۳. استفاده از ابزارهای عمومی](#۳-استفاده-از-ابزارهای-عمومی)
- [۴. نکات TypeScript](#۴-نکات-typescript)
- [۵. بهترین روش‌ها](#۵-بهترین-روشها)
- [۶. نکات](#۶-نکات)
- [منابع مرتبط](#منابع-مرتبط)

## ۱. محل ایجاد فایل‌های جدید (Monorepo)

### 1.1. صفحات جدید (در apps/)
- **تعیین اپلیکیشن**: ابتدا مشخص کنید صفحه برای کدام اپ است (مثل `admin-panel` یا `digimoragheb`)
- **مسیر**: `apps/[app-name]/src/app/` با نام فولدر kebab-case (مثل `users-management/`)
- **فایل**: `page.tsx` برای صفحه اصلی route
- **مثال**: `apps/admin-panel/src/app/users-management/page.tsx`

### 1.2. کامپوننت‌های جدید
**قبل از ایجاد کامپوننت، تصمیم بگیرید:**

#### آیا کامپوننت در بیش از یک اپلیکیشن نیاز است?
- **بله (گلوبال)** → `packages/custom-ui/src/components/`
  - مثال: `packages/custom-ui/src/components/UserCard.tsx`
  - Import: `import { UserCard } from '@workspace/custom-ui'`
  
- **خیر (خاص یک اپ)** → `apps/[app-name]/src/components/`
  - مثال: `apps/admin-panel/src/components/AdminDashboard.tsx`
  - Import: `import AdminDashboard from '@/components/AdminDashboard'`

#### آیا کامپوننت UI پایه است (بدون business logic)?
- **بله** → `packages/ui/src/components/` (shadcn/ui)
  - مثال: `packages/ui/src/components/button.tsx`
  - Import: `import { Button } from '@workspace/ui'`
  - **نکته**: از shadcn CLI استفاده کنید: `pnpm dlx shadcn@latest add button`

**نام‌گذاری کامپوننت‌ها**: PascalCase (مثل `UserForm.tsx`, `AdminNavbar.tsx`)

### 1.3. API و Endpoints جدید
**تمام API logic در `@workspace/framework`:**
- **مسیر**: `packages/framework/src/routes/[feature-name]/`
- **فایل‌ها**:
  - `get.ts`: توابع خام GET
  - `post.ts`: توابع خام POST/PUT/DELETE
  - `query.ts`: React Query hooks
  - `type.ts`: تایپ‌های مرتبط
- **Endpoints**: در `packages/framework/src/utils/endpoints.ts` اضافه کنید
- **Export**: در `packages/framework/src/index.ts`
- **مستندات**: در `apps/docs/content/docs/framework/` + `prompts/framework/add-endpoint/`
- **مثال**: `packages/framework/src/routes/user/`

❌ **ممنوع**: ایجاد API call مستقیم در `apps/` - همیشه از `@workspace/framework` استفاده کنید

### 1.4. هوک‌های جدید
#### هوک‌های API (React Query):
- **مسیر**: `packages/framework/src/routes/[feature]/query.ts`
- **نام**: `use[Feature][Action]` (مثل `useUsersQuery`, `useCreateUserMutation`)

#### هوک‌های گلوبال (غیر API):
- **مسیر**: `packages/custom-ui/src/hooks/`
- **نام**: `use[FeatureName].ts` (مثل `useAuth.ts`)

#### هوک‌های خاص اپ:
- **مسیر**: `apps/[app-name]/src/hooks/`

### 1.5. تایپ‌های جدید
#### تایپ‌های API:
- **مسیر**: `packages/framework/src/routes/[feature]/type.ts`
- **مثال**: `packages/framework/src/routes/user/type.ts`

#### تایپ‌های گلوبال:
- **مسیر**: `packages/custom-ui/src/types/`
- **Export**: در `packages/custom-ui/src/types/index.ts`

#### تایپ‌های خاص اپ:
- **مسیر**: `apps/[app-name]/src/types/`
- **Export**: در `apps/[app-name]/src/types/index.ts`

### 1.6. ثابت‌های جدید
#### ثابت‌های API (endpoints):
- **مسیر**: `packages/framework/src/utils/endpoints.ts`

#### ثابت‌های گلوبال:
- **مسیر**: `packages/custom-ui/src/constants/`

#### ثابت‌های خاص اپ:
- **مسیر**: `apps/[app-name]/src/constants/`

### 1.7. تست‌های جدید
- **تست‌های کامپوننت اپ**: `apps/[app-name]/src/__tests__/`
- **تست‌های کامپوننت گلوبال**: `packages/custom-ui/src/__tests__/`
- **تست‌های framework**: `packages/framework/src/__tests__/`
- **نام**: `[FeatureName].test.tsx` (مثل `UserForm.test.tsx`)

## ۲. روش‌های نام‌گذاری
- **فایل‌ها و کامپوننت‌ها**: PascalCase (مثل `AuthForm.tsx`, `Navbar.tsx`).
- **فولدرها**:
  - در `app/(main)/` و `app/dashboard/`: kebab-case (مثل `users-management`).
  - در `components/`, `lib/`, `types/`, `constants/`: kebab-case (مثل `components/ui`).
- **توابع و متغیرها**: camelCase (مثل `getUsers`, `userData`).
- **ثابت‌ها**:
  - ثابت‌های عمومی: UPPER_CASE (مثل `BASE_URL`).
  - ثابت‌های خاص (مثل endpoints): camelCase.
- **هوک‌ها**: camelCase با پیشوند `use` (مثل `useAuth`, `useLogin`).
- **تایپ‌ها و اینترفیس‌ها**: PascalCase (مثل `User`, `AuthResponse`).
- **کلاس‌های CSS**:
  - از Tailwind استفاده شود.
  - برای CSS modules، از camelCase استفاده شود (مثل `buttonWrapper.module.css`).
  - نام فایل CSS module: `[ComponentName].module.css` (مثل `UserForm.module.css`).

## ۳. استفاده از ابزارهای عمومی (Monorepo)

### 3.1. کامپوننت‌های UI
#### کامپوننت‌های shadcn/ui (پایه):
```typescript
import { Button, Input, Dialog } from '@workspace/ui';

<Button variant="default">کلیک کن</Button>
<Input placeholder="ایمیل" />
```

#### کامپوننت‌های گلوبال (با business logic):
```typescript
import { UserCard, AdminLogin } from '@workspace/custom-ui';

<UserCard userId="123" />
<AdminLogin onSuccess={() => {}} />
```

#### کامپوننت‌های خاص اپ:
```typescript
import AdminDashboard from '@/components/AdminDashboard';

<AdminDashboard />
```

### 3.2. API Calls
**همیشه از `@workspace/framework` استفاده کنید:**

#### استفاده از Hooks (توصیه می‌شود):
```typescript
import { useUserProfileQuery, useUpdateUserProfileMutation } from '@workspace/framework';

function MyComponent() {
  const { data: user, isLoading } = useUserProfileQuery();
  const updateProfile = useUpdateUserProfileMutation();

  const handleUpdate = async () => {
    await updateProfile.mutateAsync({ name: 'جدید' });
  };
}
```

#### استفاده از توابع خام (فقط در صورت نیاز):
```typescript
import { getUserProfile, updateUserProfile } from '@workspace/framework';

const user = await getUserProfile();
await updateUserProfile({ name: 'جدید' });
```

❌ **ممنوع**: API call مستقیم
```typescript
// اشتباه - هرگز این کار را نکنید
const response = await fetch('/api/users');
```

### 3.3. هوک‌ها
#### هوک‌های API (از framework):
```typescript
import { useUsersQuery, useCreateUserMutation } from '@workspace/framework';
```

#### هوک‌های گلوبال (از custom-ui):
```typescript
import { useAuth, useToast } from '@workspace/custom-ui';

const { user, isAuthenticated } = useAuth();
const toast = useToast();
```

#### هوک‌های UI (از ui):
```typescript
import { useMediaQuery, useDebounce } from '@workspace/ui';
```

### 3.4. Context و Providers
#### Setup در اپلیکیشن:
```typescript
// apps/[app-name]/src/app/layout.tsx
import { FrameworkProvider } from '@workspace/framework';
import { CustomUIProvider } from '@workspace/custom-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FrameworkProvider>
          <CustomUIProvider>
            {children}
          </CustomUIProvider>
        </FrameworkProvider>
      </body>
    </html>
  );
}
```

#### استفاده از Auth Context:
```typescript
import { useAuth } from '@workspace/custom-ui';

const { user, setUser, isAuthenticated } = useAuth();
```

## ۴. نکات TypeScript
- تایپ‌های ورودی و خروجی را در `types/` تعریف کنید.
- از `any` پرهیز کنید.
- تایپ‌ها را در `types/index.ts` export کنید:
  ```typescript
  export * from './auth';
  export * from './user';
  ```

## ۵. بهترین روش‌ها
- از prop drilling پرهیز کنید و از Context برای stateهای global استفاده کنید.
- توابع را ساده و تک‌منظوره نگه دارید.
- برای کامپوننت‌های سنگین، از `React.memo` استفاده کنید.
- **مدیریت فرم‌ها**:
  - از `react-hook-form` برای مدیریت فرم‌ها استفاده شود.
  - تایپ‌های فرم را در `types/` تعریف کنید.
  - مثال:
    ```typescript
    import { useForm } from 'react-hook-form';
    import { CreateUserForm } from '@/types/user';

    export const UserForm = () => {
      const { register, handleSubmit } = useForm<CreateUserForm>();
      const onSubmit = (data: CreateUserForm) => {
        // منطق ارسال فرم
      };
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('email')} />
          <button type="submit">ارسال</button>
        </form>
      );
    };
    ```

## ۶. نکات
- از prop drilling پرهیز کنید و از Context برای stateهای global استفاده کنید.
- توابع را ساده و تک‌منظوره نگه دارید.
- برای کامپوننت‌های سنگین، از `React.memo` استفاده کنید.
- **مدیریت فرم‌ها**: از `react-hook-form` برای مدیریت فرم‌ها استفاده شود.
- تایپ‌های ورودی و خروجی را در `types/` تعریف کنید.
- از `any` پرهیز کنید.

---

## منابع مرتبط
- [COMPONENT_GUIDELINES.markdown](COMPONENT_GUIDELINES.markdown): برای کامپوننت‌های استاندارد.
- [API_DOCUMENTATION.markdown](API_DOCUMENTATION.markdown): برای مستندسازی APIها.
- [before_task.markdown](before_task.markdown): برای اقدامات قبل از تسک.
- [after_task.markdown](after_task.markdown): برای اقدامات بعد از تسک.
- [before_update.markdown](before_update.markdown): برای آپدیت تسک‌ها.
- [after_update.markdown](after_update.markdown): برای پس از آپدیت تسک‌ها.
- [GENERAL_GUIDELINES.markdown](GENERAL_GUIDELINES.markdown): برای نصب پکیج‌ها.
- [API_GUIDELINES.markdown](API_GUIDELINES.markdown): برای جزئیات API.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.