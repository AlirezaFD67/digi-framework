# راهنمای تست‌نویسی

این سند دستورات لازم برای نوشتن تست‌ها با Jest و React Testing Library را مشخص می‌کند.

## ۱. تنظیمات اولیه
- فایل `jest.config.js` را با تنظیمات زیر ایجاد کنید:
  ```javascript
  module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };
  ```
- فایل `jest.setup.js` را با محتوای زیر ایجاد کنید:
  ```javascript
  import '@testing-library/jest-dom';
  ```

## ۲. محل تست‌ها
- تست‌ها در `tests/__tests__/` با نام `[FeatureName].test.tsx` (مثل `AuthForm.test.tsx`) ایجاد شوند.
- برای جزئیات نام‌گذاری به CODING_GUIDELINES.markdown مراجعه کنید.

## ۳. تست‌نویسی
- **تست‌های کامپوننت**:
  - از React Testing Library برای رندر و بررسی کامپوننت‌ها استفاده کنید.
  - مثال:
    ```typescript
    import { render, screen } from '@testing-library/react';
    import AuthForm from '@/components/features/AuthForm';

    test('رندر فرم لاگین', () => {
      render(<AuthForm />);
      expect(screen.getByPlaceholderText('ایمیل')).toBeInTheDocument();
    });
    ```
- **تست‌های هوک‌ها**:
  - از `@testing-library/react-hooks` برای تست هوک‌ها استفاده کنید.
  - مثال:
    ```typescript
    import { renderHook, act } from '@testing-library/react-hooks';
    import { useLogin } from '@/lib/hooks/useLogin';
    import { login } from '@/lib/api/auth';

    jest.mock('@/lib/api/auth');
    test('تست هوک لاگین', async () => {
      login.mockResolvedValue({ token: 'fake-token', user: { id: '1' } });
      const { result, waitFor } = renderHook(() => useLogin());
      await act(async () => {
        await result.current.mutateAsync({ email: 'test@example.com', password: '123' });
      });
      await waitFor(() => expect(localStorage.getItem('token')).toBe('fake-token'));
    });
    ```
- **تست‌های API**:
  - از msw برای mock کردن APIها استفاده کنید.
  - مثال:
    ```typescript
    import { rest } from 'msw';
    import { setupServer } from 'msw/node';
    import { useLogin } from '@/lib/hooks/useLogin';

    const server = setupServer(
      rest.post('https://api.example.com/auth/login', (req, res, ctx) => {
        return res(ctx.json({ token: 'fake-token', user: { id: '1', email: 'test@example.com' } }));
      })
    );
    ```

## ۴. پوشش تست
- پوشش تست را با دستور زیر بررسی کنید:
  ```bash
  pnpm jest --coverage
  ```
- حداقل پوشش تست 80% برای شاخه‌ها (branches) و خطوط (lines) هدف‌گذاری شود.

## ۵. نکات
- تست‌ها باید مستقل باشند و به داده‌های واقعی وابسته نباشند.
- برای mock کردن context یا providerها، از wrapper در render استفاده کنید:
  ```typescript
  import { AuthProvider } from '@/lib/context/AuthContext';
  render(<AuthForm />, { wrapper: AuthProvider });
  ```
- برای نصب پکیج‌ها به GENERAL_GUIDELINES.markdown مراجعه کنید.
- برای جزئیات API به API_GUIDELINES.markdown و API_DOCUMENTATION.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای اقدامات قبل و بعد از تسک به before_task.md و after_task.md مراجعه کنید.