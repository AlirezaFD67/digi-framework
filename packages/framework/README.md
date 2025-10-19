# 🚀 Framework Package

پکیج framework کامل برای مدیریت API calls، data fetching و state management در Nexus Framework monorepo.

## ✨ ویژگی‌های کلیدی

- **🔧 TypeScript کامل** - تمام تایپ‌ها و interfaceها
- **⚡ React Query integration** - کش هوشمند و background updates
- **🌐 HTTP Client مرکزی** - مدیریت token و error handling
- **🔄 Generic Hooks** - قابلیت استفاده مجدد
- **📦 Provider Pattern** - آسان برای setup
- **🗂️ Route Structure** - سازماندهی منظم API calls

## 🏗️ ساختار کلی

```
packages/framework/
├── src/
│   ├── types/           # Core types و base response types
│   ├── utils/           # HTTP client، endpoints، generic hooks
│   ├── providers/       # Framework provider اصلی
│   └── index.ts         # Main exports
├── dist/                # Built files
└── README.md
```

## 🚀 شروع سریع

### 1. نصب
```bash
pnpm add @workspace/framework
```

### 2. Setup Provider
```tsx
import { FrameworkProvider } from "@workspace/framework";

export default function RootLayout({ children }) {
  return (
    <FrameworkProvider>
      {children}
    </FrameworkProvider>
  );
}
```

### 3. استفاده از Hooks
```tsx
import { useGenericQuery, useGenericMutation } from "@workspace/framework";

function MyComponent() {
  const { data, isLoading, error } = useGenericQuery(
    () => fetch('/api/users'),
    ['users']
  );

  const createUser = useGenericMutation(
    (userData) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    ['users']
  );

  // استفاده از data و mutations...
}
```

## 📚 داکیومنت‌اسیون کامل

برای راهنمای کامل و مثال‌های عملی، به داکیومنت‌اسیون مراجعه کنید:

**[📖 داکیومنت‌اسیون Framework Package](../../apps/docs/content/docs/framework/)**

## 🔧 Core Components

### Types
```typescript
import { 
  BaseResponseType, 
  PaginatedResponse, 
  APIHttpType, 
  APIHttpPaginatedType,
  HookOptions,
  MutationOptions 
} from "@workspace/framework";
```

### Utils
```typescript
import { 
  API_ENDPOINTS, 
  APIHttp,
  useGenericQuery,
  useGenericQueryWithParams,
  useGenericMutation,
  useGenericMutationWithOptimisticUpdate 
} from "@workspace/framework";
```

### Providers
```typescript
import { FrameworkProvider, useQueryClient } from "@workspace/framework";
```

## 📍 Available Routes

### Auth Routes
```typescript
import { 
  useCreateAuthTokenMutation,
  useVerifyOTPMutation,
  useAdminLoginMutation 
} from "@workspace/framework";
```

### User Routes
```typescript
import { 
  useUserProfileQuery,
  useUpdateUserProfileMutation 
} from "@workspace/framework";
```

### Article Routes
```typescript
import { 
  useAdminLearningListQuery,
  useAdminLearningDetail,
  useAdminCategoryListQuery,
  useAuthorsListQuery,
  useAddAdminLearningList,
  useUpdateAdminLearningList,
  useAcceptLearningMutation 
} from "@workspace/framework";
```

**[📖 مستندات کامل Article Endpoint](../../apps/docs/content/docs/framework/article-endpoint.mdx)**

## 🎯 افزودن Endpoint جدید

برای افزودن endpoint جدید، از prompt آماده استفاده کنید:

**[➕ افزودن Endpoint جدید](../../prompts/docs/add-endpoint/)**

## 🔄 قوانین استفاده

### ✅ باید انجام دهید:
1. **همیشه از `API_ENDPOINTS` استفاده کنید**
2. **توابع خام در `get.ts`/`post.ts`**
3. **هوک‌ها در `query.ts`**
4. **تایپ‌ها در `type.ts`**
5. **استفاده از generic hooks**

### ❌ نباید انجام دهید:
1. **هاردکد endpoint** - `APIHttp.get("/users")` ❌
2. **مستقیم APIHttp در UI** - فقط از hooks استفاده کنید
3. **تایپ any** - همیشه interface تعریف کنید
4. **Query key تکراری**

## 🎯 نتیجه

Framework package یک راه‌حل کامل و استاندارد برای مدیریت API calls در monorepo است که باعث می‌شود کد تمیز، قابل نگهداری و قابل توسعه باشد.

---

**آماده‌اید شروع کنید؟ [داکیومنت‌اسیون](../../apps/docs/content/docs/framework/) را مطالعه کنید! 🚀**