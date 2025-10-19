# راهنمای اتصال به API

این سند دستورات لازم برای اتصال به API و استفاده از apiClient برای عملیات CRUD را مشخص می‌کند.

## فهرست محتوا (TOC)
- [۱. تنظیمات اولیه](#۱-تنظیمات-اولیه)
- [۲. تعریف توابع API](#۲-تعریف-توابع-api)
- [۳. عملیات CRUD](#۳-عملیات-crud)
- [۴. استفاده از React Query](#۴-استفاده-از-react-query)
- [۵. مدیریت مسیرهای API](#۵-مدیریت-مسیرهای-api)
- [۶. تایپ‌ها](#۶-تایپها)
- [۷. نکات](#۷-نکات)
- [منابع مرتبط](#منابع-مرتبط)

## ۱. تنظیمات اولیه
- فایل `lib/api/client.ts` را برای wrapper fetch با interceptor ایجاد کنید.
- قابلیت‌های apiClient:
  - افزودن Authorization header با token از localStorage.
  - مدیریت refresh token (اگر `ENABLE_REFRESH_TOKEN` در `constants/index.ts` برابر true باشد).
  - پشتیبانی از عملیات GET، POST، PUT، DELETE.

## ۲. تعریف توابع API
- برای هر فیچر، فایل جدید در `lib/api/` ایجاد کنید (مثل `auth.ts`, `users.ts`).
- از apiClient برای درخواست‌ها استفاده کنید.
- مثال:
  ```typescript
  import apiClient from '@/lib/api/client';
  import { AuthResponse, LoginForm } from '@/types/auth';

  export const login = (data: LoginForm) => apiClient.post<AuthResponse>('/auth/login', data);
  ```

## ۳. عملیات CRUD
- توابع CRUD را در فایل‌های مربوطه در `lib/api/` تعریف کنید (مثل `users.ts`).
- ساختار استاندارد:
  - GET: برای دریافت داده (لیست یا تک آیتم).
  - POST: برای ایجاد آیتم جدید.
  - PUT: برای به‌روزرسانی آیتم.
  - DELETE: برای حذف آیتم.
- مثال:
  ```typescript
  import apiClient from '@/lib/api/client';
  import { User, CreateUserForm, UpdateUserForm } from '@/types/user';

  export const getUsers = () => apiClient.get<User[]>('/users');
  export const getUserById = (id: string) => apiClient.get<User>(`/users/${id}`);
  export const createUser = (data: CreateUserForm) => apiClient.post<User>('/users', data);
  export const updateUser = (id: string, data: UpdateUserForm) => apiClient.put<User>(`/users/${id}`, data);
  export const deleteUser = (id: string) => apiClient.delete<void>(`/users/${id}`);
  ```

## ۴. استفاده از React Query
- برای queries (GET) و mutations (POST، PUT، DELETE) از React Query استفاده کنید.
- هوک‌های مربوطه را در `lib/hooks/` ایجاد کنید.
- نام‌گذاری هوک‌ها: `use[Feature][Action]` (مثل `useUsers`, `useCreateUser`).
- مثال:
  ```typescript
  import { useQuery, useMutation } from '@tanstack/react-query';
  import { getUsers, createUser } from '@/lib/api/users';
  import { useAuth } from '@/lib/hooks/useAuth';

  export const useUsers = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: getUsers,
    });
  };

  export const useCreateUser = () => {
    const { setUser } = useAuth();
    return useMutation({
      mutationFn: createUser,
      onSuccess: (data) => {
        // به‌روزرسانی state یا cache
      },
    });
  };
  ```

## ۵. مدیریت مسیرهای API
- مسیرهای API را در `constants/endpoints.ts` تعریف کنید.
- مثال:
  ```typescript
  export const ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH_TOKEN: '/auth/refresh',
    },
    USERS: {
      BASE: '/users',
      BY_ID: (id: string) => `/users/${id}`,
    },
  };
  ```

## ۶. تایپ‌ها
- تایپ‌های ورودی و خروجی API را در `types/` تعریف کنید.
- تایپ‌های فرم (مثل `CreateUserForm`) را جدا از مدل اصلی (مثل `User`) تعریف کنید.
- مثال:
  ```typescript
  export interface User {
    id: string;
    email: string;
    name: string;
  }

  export interface CreateUserForm {
    email: string;
    password: string;
    name: string;
  }
  ```
- تایپ‌ها را در `types/index.ts` export کنید:
  ```typescript
  export * from './auth';
  export * from './user';
  ```

## ۷. نکات
- از `ENABLE_REFRESH_TOKEN` در `constants/index.ts` برای فعال/غیرفعال کردن refresh token استفاده کنید.
- از تایپ‌های دقیق برای ورودی و خروجی API استفاده کنید و از `any` پرهیز کنید.

---

## منابع مرتبط
- [API_DOCUMENTATION.markdown](API_DOCUMENTATION.markdown): برای مستندسازی APIها.
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.
- [before_task.markdown](before_task.markdown): برای اقدامات قبل از تسک.
- [after_task.markdown](after_task.markdown): برای اقدامات بعد از تسک.
- [AUTH_GUIDELINES.markdown](AUTH_GUIDELINES.markdown): برای احراز هویت.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.