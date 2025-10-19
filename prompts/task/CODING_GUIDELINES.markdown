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

## ۱. محل ایجاد فایل‌های جدید
- **صفحات جدید**:
  - صفحات سایت اصلی در `app/(main)/` با نام فولدر kebab-case (مثل `users-management/`) ایجاد شوند.
  - صفحات داشبورد در `app/dashboard/` با نام فولدر kebab-case (مثل `users-management/`) ایجاد شوند.
  - فایل `page.tsx` برای صفحه اصلی route ایجاد شود.
  - مثال: `app/(main)/users-management/page.tsx` یا `app/dashboard/users-management/page.tsx`
- **کامپوننت‌های جدید**:
  - کامپوننت‌های عمومی (مثل Button): در `components/ui/` با shadcn ایجاد شوند.
  - کامپوننت‌های خاص فیچر (مثل UserForm): در `components/features/` با نام PascalCase (مثل `UserForm.tsx`؛ اگر خاص سایت یا داشبورد، در نام‌گذاری مشخص کنید مثل `DashboardUserForm.tsx`).
  - کامپوننت‌های layout (مثل Navbar): در `components/layout/` با نام PascalCase (مثل `Navbar.tsx`؛ اگر خاص سایت یا داشبورد، جدا تعریف کنید مثل `MainNavbar.tsx` یا `DashboardSidebar.tsx`).
  - برای انتخاب کامپوننت‌ها، به COMPONENT_GUIDELINES.markdown مراجعه کنید.
- **توابع API جدید**:
  - در `lib/api/` با نام kebab-case (مثل `users.ts`) ایجاد شوند.
  - از apiClient در `lib/api/client.ts` استفاده شود.
  - مستندات API را در `docs/api/endpoints/` طبق API_DOCUMENTATION.markdown اضافه کنید.
- **هوک‌های جدید**:
  - در `lib/hooks/` با نام `use[FeatureName].ts` (مثل `useUsers.ts`) ایجاد شوند.
  - از React Query برای queries/mutations استفاده شود.
- **تایپ‌های جدید**:
  - در `types/` با نام kebab-case (مثل `user.ts`) ایجاد شوند.
  - در `types/index.ts` export شوند.
- **ثابت‌های جدید**:
  - در `constants/index.ts` یا `constants/endpoints.ts` اضافه شوند.
- **تست‌های جدید**:
  - در `tests/__tests__/` با نام `[FeatureName].test.tsx` (مثل `AuthForm.test.tsx`) ایجاد شوند.

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

## ۳. استفاده از ابزارهای عمومی
- **کامپوننت‌های UI**:
  - از کامپوننت‌های استاندارد در COMPONENT_GUIDELINES.markdown استفاده شود.
  - مثال:
    ```typescript
    import { Button } from '@/components/ui';
    <Button>کلیک کن</Button>
    ```
- **توابع API**:
  - از `lib/api/client.ts` برای درخواست‌ها استفاده شود.
  - مثال:
    ```typescript
    import apiClient from '@/lib/api/client';
    const data = await apiClient.get('/users');
    ```
- **هوک‌ها**:
  - از هوک‌های موجود در `lib/hooks/` استفاده شود.
  - برای فیچر جدید، هوک جدید ایجاد شود.
- **Context**:
  - برای stateهای global (مثل auth) از `lib/context/AuthContext.tsx` استفاده شود.
  - مثال:
    ```typescript
    import { useAuth } from '@/lib/hooks/useAuth';
    const { user, setUser } = useAuth();
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