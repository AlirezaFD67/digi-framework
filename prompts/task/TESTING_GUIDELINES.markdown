# راهنمای تست‌نویسی (Monorepo)

این سند دستورات لازم برای نوشتن تست‌ها در ساختار Monorepo با Jest/Vitest و React Testing Library را مشخص می‌کند.

## ۱. محل تست‌ها در Monorepo

### 1.1. تست‌های اپلیکیشن
```
apps/[app-name]/src/__tests__/
├── components/
│   ├── AdminDashboard.test.tsx
│   └── UserTable.test.tsx
├── pages/
│   └── HomePage.test.tsx
└── utils/
    └── helpers.test.ts
```

### 1.2. تست‌های کامپوننت گلوبال
```
packages/custom-ui/src/__tests__/
├── components/
│   ├── AdminLoginForm.test.tsx
│   ├── ErrorBoundary.test.tsx
│   └── Toast.test.tsx
└── hooks/
    └── useAuthContext.test.ts
```

### 1.3. تست‌های Framework
```
packages/framework/src/__tests__/
├── routes/
│   ├── auth.test.ts
│   ├── user.test.ts
│   └── article.test.ts
└── utils/
    └── client.test.ts
```

## ۲. تنظیمات تست

### 2.1. تنظیمات در اپلیکیشن (apps/)
```javascript
// apps/admin-panel/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@workspace/custom-ui': path.resolve(__dirname, '../../packages/custom-ui/src'),
      '@workspace/framework': path.resolve(__dirname, '../../packages/framework/src'),
      '@workspace/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
```

### 2.2. Setup File
```typescript
// apps/admin-panel/src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

## ۳. تست‌نویسی در Monorepo

### 3.1. تست کامپوننت (از custom-ui)
```typescript
// packages/custom-ui/src/__tests__/components/AdminLoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminLoginForm } from '../../components/AdminLoginForm';
import { CustomUIProvider } from '../../providers/CustomUIProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
      {children}
    </CustomUIProvider>
  </QueryClientProvider>
);

describe('AdminLoginForm', () => {
  it('should render login form', () => {
    render(<AdminLoginForm />, { wrapper });
    
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const onSuccess = vi.fn();
    
    render(<AdminLoginForm onSuccess={onSuccess} />, { wrapper });
    
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

### 3.2. تست Hook (از framework)
```typescript
// packages/framework/src/__tests__/routes/user.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserProfileQuery } from '../../routes/user/query';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useUserProfileQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should fetch user profile', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useUserProfileQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

### 3.3. Mock API با MSW
```typescript
// packages/framework/src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/admin-api-token', () => {
    return HttpResponse.json({
      token: 'fake-token',
      user_id: 1,
      email: 'admin@example.com',
    });
  }),

  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
  }),
];

// packages/framework/src/__tests__/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { beforeAll, afterEach, afterAll } from 'vitest';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3.4. تست کامپوننت اپلیکیشن
```typescript
// apps/admin-panel/src/__tests__/components/UserTable.test.tsx
import { render, screen } from '@testing-library/react';
import UserTable from '@/components/UserTable';
import { describe, it, expect } from 'vitest';

describe('UserTable', () => {
  it('should render users table', () => {
    const users = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];

    render(<UserTable users={users} />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });
});
```

## ۴. اجرای تست‌ها

### 4.1. تست تمام workspace
```bash
# از ریشه monorepo
pnpm test

# با coverage
pnpm test --coverage
```

### 4.2. تست یک اپلیکیشن خاص
```bash
pnpm test --filter admin-panel

# یا رفتن به پوشه
cd apps/admin-panel
pnpm test
```

### 4.3. تست یک پکیج خاص
```bash
pnpm test --filter @workspace/custom-ui
pnpm test --filter @workspace/framework

# یا رفتن به پوشه
cd packages/custom-ui
pnpm test
```

### 4.4. تست در watch mode
```bash
pnpm test --watch
```

## ۵. پوشش تست (Coverage)

### 5.1. بررسی Coverage
```bash
# کل workspace
pnpm test --coverage

# یک package خاص
pnpm test --coverage --filter @workspace/custom-ui
```

### 5.2. هدف Coverage
- **حداقل 80%** برای packages (custom-ui, framework)
- **حداقل 70%** برای applications
- **100%** برای utility functions و helpers

### 5.3. گزارش Coverage
```bash
# تولید گزارش HTML
pnpm test --coverage --reporter=html

# مشاهده گزارش
open coverage/index.html
```

## ۶. نکات مهم

### ✅ باید انجام دهید:
1. **Mock کردن workspace packages**: در تست‌های اپ، package ها را mock کنید
2. **استفاده از MSW**: برای mock API calls
3. **Cleanup بعد از هر تست**: با `afterEach(cleanup)`
4. **Provider wrapper**: برای تست کامپوننت‌هایی که به context نیاز دارند

### ❌ نباید انجام دهید:
1. **تست‌های وابسته به هم**: هر تست باید مستقل باشد
2. **API call واقعی**: همیشه mock کنید
3. **Hardcoded delays**: از `waitFor` استفاده کنید نه `setTimeout`

### 📝 مثال Wrapper برای تست
```typescript
// apps/admin-panel/src/__tests__/utils/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomUIProvider } from '@workspace/custom-ui';
import { FrameworkProvider } from '@workspace/framework';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <FrameworkProvider>
      <QueryClientProvider client={queryClient}>
        <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
          {children}
        </CustomUIProvider>
      </QueryClientProvider>
    </FrameworkProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// استفاده:
import { renderWithProviders } from './utils/test-utils';

test('my component', () => {
  renderWithProviders(<MyComponent />);
  // ...
});
```

## ۷. منابع مرتبط
- **[ARCHITECTURE.markdown](ARCHITECTURE.markdown)**: ساختار Monorepo
- **[CODING_GUIDELINES.markdown](CODING_GUIDELINES.markdown)**: محل فایل‌های تست
- **[API_GUIDELINES.markdown](API_GUIDELINES.markdown)**: تست API calls