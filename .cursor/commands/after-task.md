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

### 5. تست‌نویسی (اجباری - کامل)

**⚠️ مهم: تست‌نویسی برای هر تسک اجباری است و باید به صورت کامل انجام شود.**

#### 5.1. شناسایی موارد نیاز به تست
- [ ] **لیست کنید چه چیزهایی باید تست شوند**:
  - کامپوننت‌های جدید یا تغییر یافته
  - هوک‌های جدید (React Hooks)
  - توابع API (اگر endpoint جدید اضافه شد)
  - توابع utility و helper
  - Logic های business
  - فرم‌ها و validation
  - User interactions (کلیک، تایپ، submit)

#### 5.2. تست کامپوننت‌ها (Component Tests)

##### A. تست کامپوننت خاص اپلیکیشن
```typescript
// مثال: apps/admin-panel/src/__tests__/components/UserManagementTable.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import UserManagementTable from '@/components/UserManagementTable';

describe('UserManagementTable', () => {
  // 1. تست رندر اولیه
  it('should render table with users', () => {
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@example.com', role: 'admin' },
      { id: '2', name: 'User 2', email: 'user2@example.com', role: 'user' },
    ];

    render(<UserManagementTable users={mockUsers} />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  // 2. تست state خالی
  it('should show empty state when no users', () => {
    render(<UserManagementTable users={[]} />);
    
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  // 3. تست user interactions
  it('should handle delete button click', async () => {
    const mockOnDelete = vi.fn();
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@example.com', role: 'user' },
    ];

    render(<UserManagementTable users={mockUsers} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  // 4. تست با data fetching
  it('should fetch and display users', async () => {
    renderWithProviders(<UserManagementTable />);

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  // 5. تست error handling
  it('should display error message on fetch failure', async () => {
    // Mock API error
    renderWithProviders(<UserManagementTable />);

    await waitFor(() => {
      expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
    });
  });
});
```

##### B. تست کامپوننت گلوبال (در custom-ui)
```typescript
// مثال: packages/custom-ui/src/__tests__/components/AdminLoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminLoginForm } from '../../auth/AdminLoginForm';
import { CustomUIProvider } from '../../providers/CustomUIProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
        {children}
      </CustomUIProvider>
    </QueryClientProvider>
  );
};

describe('AdminLoginForm', () => {
  // 1. تست رندر فرم
  it('should render login form with all fields', () => {
    render(<AdminLoginForm />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // 2. تست validation
  it('should show validation errors for empty fields', async () => {
    render(<AdminLoginForm />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  // 3. تست successful login
  it('should call onSuccess after successful login', async () => {
    const onSuccess = vi.fn();
    
    render(<AdminLoginForm onSuccess={onSuccess} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  // 4. تست error handling
  it('should call onError on login failure', async () => {
    const onError = vi.fn();
    
    render(<AdminLoginForm onError={onError} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  // 5. تست loading state
  it('should show loading state during login', async () => {
    render(<AdminLoginForm />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});
```

#### 5.3. تست Hooks و API

##### A. تست React Hooks
```typescript
// مثال: packages/framework/src/__tests__/routes/user/query.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfileQuery, useUpdateUserProfileMutation } from '../../../routes/user/query';

describe('User Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // تست Query Hook
  describe('useUserProfileQuery', () => {
    it('should fetch user profile successfully', async () => {
      const { result } = renderHook(() => useUserProfileQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should handle fetch error', async () => {
      // Mock error response
      const { result } = renderHook(() => useUserProfileQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  // تست Mutation Hook
  describe('useUpdateUserProfileMutation', () => {
    it('should update user profile successfully', async () => {
      const { result } = renderHook(() => useUpdateUserProfileMutation(), { wrapper });

      const updateData = { name: 'New Name', email: 'new@example.com' };

      await result.current.mutateAsync(updateData);

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toMatchObject(updateData);
    });

    it('should handle update error', async () => {
      const { result } = renderHook(() => useUpdateUserProfileMutation(), { wrapper });

      try {
        await result.current.mutateAsync({ name: '' }); // Invalid data
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(result.current.isError).toBe(true);
    });
  });
});
```

##### B. تست توابع API خام
```typescript
// مثال: packages/framework/src/__tests__/routes/user/get.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { getUserProfile, getUsers } from '../../../routes/user/get';

const server = setupServer(
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
  }),
  
  http.get('/api/users', () => {
    return HttpResponse.json({
      entries: [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ],
      metadata: { totalRows: 2, pageCount: 1 },
    });
  })
);

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('User API Functions', () => {
  it('should fetch user profile', async () => {
    const profile = await getUserProfile();

    expect(profile).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should fetch users list', async () => {
    const result = await getUsers({ pageNo: 1, rowCount: 10 });

    expect(result.entries).toHaveLength(2);
    expect(result.metadata.totalRows).toBe(2);
  });

  it('should handle API error', async () => {
    server.use(
      http.get('/api/user/profile', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(getUserProfile()).rejects.toThrow();
  });
});
```

#### 5.4. تست Integration (End-to-End Flow)
```typescript
// مثال: apps/admin-panel/src/__tests__/flows/user-management.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import UserManagementPage from '@/app/admin/users/page';

describe('User Management Flow', () => {
  it('should complete full user creation flow', async () => {
    renderWithProviders(<UserManagementPage />);

    // 1. کلیک روی دکمه "Add User"
    const addButton = screen.getByRole('button', { name: /add user/i });
    fireEvent.click(addButton);

    // 2. پر کردن فرم
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'newuser@example.com' },
    });

    // 3. Submit فرم
    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    // 4. بررسی موفقیت
    await waitFor(() => {
      expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
    });

    // 5. بررسی نمایش در جدول
    expect(screen.getByText('New User')).toBeInTheDocument();
    expect(screen.getByText('newuser@example.com')).toBeInTheDocument();
  });
});
```

#### 5.5. اجرای تست‌ها و بررسی Coverage
- [ ] **اجرای تست‌ها**:
  ```bash
  # تست در محل تغییر
  pnpm test --filter admin-panel
  pnpm test --filter @workspace/custom-ui
  pnpm test --filter @workspace/framework
  
  # تست تمام workspace
  pnpm test
  ```

- [ ] **بررسی Coverage**:
  ```bash
  # با coverage report
  pnpm test --coverage
  
  # Coverage برای یک package خاص
  pnpm test --coverage --filter @workspace/custom-ui
  ```

- [ ] **اهداف Coverage (اجباری)**:
  - **حداقل 80%** برای packages (custom-ui, framework)
  - **حداقل 70%** برای applications
  - **100%** برای utility functions و helpers
  - **100%** برای توابع API خام

#### 5.6. چک‌لیست تست‌نویسی کامل
- [ ] **تست‌های پایه**:
  - ✅ رندر صحیح کامپوننت
  - ✅ نمایش props به درستی
  - ✅ State خالی (empty state)
  - ✅ Loading state
  - ✅ Error state

- [ ] **تست‌های Interaction**:
  - ✅ کلیک روی دکمه‌ها
  - ✅ تایپ در input fields
  - ✅ Submit فرم‌ها
  - ✅ Navigation و routing
  - ✅ Modal/Dialog باز و بسته شدن

- [ ] **تست‌های Validation**:
  - ✅ Required fields
  - ✅ Format validation (email, phone, etc.)
  - ✅ Custom validation rules
  - ✅ Error messages نمایش داده می‌شوند

- [ ] **تست‌های API**:
  - ✅ Successful API calls
  - ✅ API error handling
  - ✅ Loading states
  - ✅ Data transformation
  - ✅ Cache invalidation (برای mutations)

- [ ] **تست‌های Edge Cases**:
  - ✅ Empty data
  - ✅ Very long text
  - ✅ Special characters
  - ✅ Network errors
  - ✅ Timeout scenarios

#### 5.7. مستندسازی تست‌ها
- [ ] **هر تست باید**:
  - توضیح واضح داشته باشد (`it('should ...')`)
  - فقط یک چیز را تست کند (Single Responsibility)
  - مستقل از سایر تست‌ها باشد
  - قابل تکرار باشد (Reproducible)

#### 5.8. راهنمای کامل تست
برای راهنمای گام‌به‌گام کامل تست‌نویسی به منابع زیر مراجعه کنید:
- **[COMPLETE_TESTING_GUIDE.markdown](COMPLETE_TESTING_GUIDE.markdown)**: ⭐ راهنمای جامع تست‌نویسی بعد از تسک
- **[TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown)**: راهنمای تکنیکال و setup تست‌ها

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
  - **scope**: صفحه‌ای که روی آن کار می‌شود
  - مثال‌ها:
    ```bash
    feat(user-management): add role filter to users table
    fix(login): resolve auth token refresh issue
    chore(dashboard): update chart library
    refactor(profile): improve form validation logic
    ```

- [ ] **پیشنهاد عنوان کامیت به کاربر**:
  - فقط عنوان کامیت را به کاربر پیشنهاد دهید
  - **هیچ‌وقت خودتان کامیت مستقیم ندهید**
  - کاربر خودش کامیت می‌دهد و اعلام می‌کند
  - مثال پیشنهاد:
    ```
    feat(user-management): add role filter to users table
    ```

- [ ] **بعد از کامیت کاربر**:
  - منتظر اعلام کاربر برای مراحل بعدی بمانید
  - برای push نیز تأیید کاربر لازم است

### 9. بررسی کیفیت (اختیاری)
- [ ] **Performance** (برای صفحات جدید):
  - از Lighthouse برای تست عملکرد استفاده کنید
  
- [ ] **SEO** (برای صفحات عمومی):
  - metadata، canonical URLs، og:image چک شوند

### 10. تمیز کاری
- [ ] **فایل‌های موقت حذف شوند**
- [ ] **console.log های debug حذف شوند**
- [ ] **import های استفاده نشده حذف شوند**
- [ ] **فایل‌های تست mock حذف یا به جای مناسب منتقل شوند**

### 11. اطلاع‌رسانی به تیم
- [ ] **Pull Request ایجاد شود**:
  - توضیحات واضح از تغییرات
  - اگر breaking change هست، مشخص شود
  - screenshot/gif اگر UI تغییر کرده

## نکات مهم

### ✅ الزامی است:
1. **تست‌نویسی کامل**: هر تسکی باید تست‌های جامع داشته باشد
2. **Coverage حداقل 80%**: برای packages و 70% برای applications
3. **تست قبل از کامیت**: همیشه `pnpm test` را اجرا کنید
4. **Build موفق**: `pnpm build` باید بدون خطا اجرا شود

### ❌ ممنوع است:
1. **کامیت بدون تست**: هرگز کد بدون تست کامیت نکنید
2. **پکیج‌های غیراستاندارد**: فقط از workspace packages استفاده کنید
3. **Skip کردن تست‌ها**: تست‌ها را disable یا skip نکنید

### 📚 منابع:
- **[TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown)**: راهنمای کامل تست‌نویسی
- **[before_update.markdown](before_update.markdown)** و **[after_update.markdown](after_update.markdown)**: برای آپدیت تسک‌ها

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

