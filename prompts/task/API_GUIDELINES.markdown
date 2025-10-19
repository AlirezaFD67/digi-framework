# راهنمای اتصال به API (با @workspace/framework)

این سند دستورات لازم برای استفاده از `@workspace/framework` برای مدیریت API calls را مشخص می‌کند.

## فهرست محتوا (TOC)
- [۱. معرفی Framework](#۱-معرفی-framework)
- [۲. Setup اولیه](#۲-setup-اولیه)
- [۳. استفاده از Hooks (توصیه می‌شود)](#۳-استفاده-از-hooks-توصیه-می‌شود)
- [۴. استفاده از توابع خام](#۴-استفاده-از-توابع-خام)
- [۵. اضافه کردن Endpoint جدید](#۵-اضافه-کردن-endpoint-جدید)
- [۶. تایپ‌ها](#۶-تایپها)
- [۷. قوانین مهم](#۷-قوانین-مهم)
- [منابع مرتبط](#منابع-مرتبط)

## ۱. معرفی Framework
**تمام API logic در `@workspace/framework` متمرکز شده است.**

### ویژگی‌های کلیدی:
- ✅ **React Query Integration**: کش هوشمند و background updates
- ✅ **HTTP Client مرکزی**: مدیریت token و error handling
- ✅ **Generic Hooks**: قابلیت استفاده مجدد
- ✅ **TypeScript کامل**: تمام تایپ‌ها و interfaceها
- ✅ **Centralized Endpoints**: تمام URLها در یک جا

### ساختار Framework:
```
packages/framework/src/
├── routes/              # API endpoints
│   ├── auth/           # Authentication
│   │   ├── get.ts      # توابع خام GET
│   │   ├── post.ts     # توابع خام POST/PUT/DELETE
│   │   ├── query.ts    # React Query hooks
│   │   └── type.ts     # تایپ‌های مرتبط
│   ├── user/           # User management
│   └── article/        # Articles
├── providers/          # FrameworkProvider
├── utils/              # APIHttp, endpoints, generic hooks
└── types/              # Base types
```

## ۲. Setup اولیه

### 2.1. نصب در اپلیکیشن
اپلیکیشن‌های موجود در `apps/` از قبل `@workspace/framework` را در `package.json` دارند:
```json
{
  "dependencies": {
    "@workspace/framework": "workspace:*"
  }
}
```

### 2.2. Setup Provider
در `app/layout.tsx` هر اپلیکیشن:
```typescript
import { FrameworkProvider } from '@workspace/framework';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FrameworkProvider>
          {children}
        </FrameworkProvider>
      </body>
    </html>
  );
}
```

## ۳. استفاده از Hooks (توصیه می‌شود)

### 3.1. Query (GET) - دریافت داده
```typescript
import { useUserProfileQuery } from '@workspace/framework';

function ProfilePage() {
  const { data: user, isLoading, error, refetch } = useUserProfileQuery();

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در دریافت اطلاعات</div>;

  return <div>{user?.name}</div>;
}
```

### 3.2. Mutation (POST/PUT/DELETE) - تغییر داده
```typescript
import { useUpdateUserProfileMutation } from '@workspace/framework';

function EditProfilePage() {
  const updateProfile = useUpdateUserProfileMutation();

  const handleSubmit = async (formData) => {
    try {
      await updateProfile.mutateAsync({
        name: formData.name,
        email: formData.email
      });
      // موفقیت
    } catch (error) {
      // خطا
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {updateProfile.isPending && <div>در حال ارسال...</div>}
      {/* فرم */}
    </form>
  );
}
```

### 3.3. Query با Parameters
```typescript
import { useAdminLearningDetail } from '@workspace/framework';

function ArticleDetailPage({ id }: { id: string }) {
  const { data: article } = useAdminLearningDetail(id);

  return <div>{article?.title}</div>;
}
```

### 3.4. Mutation با Optimistic Update
```typescript
import { useGenericMutationWithOptimisticUpdate } from '@workspace/framework';

const deleteMutation = useGenericMutationWithOptimisticUpdate(
  (id: string) => deleteArticle(id),
  ['articles'], // query key to invalidate
  {
    onSuccess: () => {
      toast.success('مقاله حذف شد');
    }
  }
);
```

## ۴. استفاده از توابع خام

### 4.1. زمان استفاده
فقط در موارد زیر از توابع خام استفاده کنید:
- Server Components در Next.js
- API Routes
- Server Actions
- زمانی که به React Query دسترسی ندارید

### 4.2. مثال
```typescript
import { getUserProfile, updateUserProfile } from '@workspace/framework';

// در Server Component
async function ServerProfilePage() {
  const user = await getUserProfile();

  return <div>{user.name}</div>;
}

// در Server Action
async function updateProfile(formData: FormData) {
  'use server';
  
  const result = await updateUserProfile({
    name: formData.get('name') as string
  });

  return result;
}
```

## ۵. اضافه کردن Endpoint جدید

### 5.1. ساختار فایل‌ها
```bash
packages/framework/src/routes/[feature-name]/
├── get.ts      # توابع خام GET
├── post.ts     # توابع خام POST/PUT/DELETE
├── query.ts    # React Query hooks
└── type.ts     # تایپ‌های TypeScript
```

### 5.2. مثال کامل

#### Step 1: تعریف تایپ‌ها (`type.ts`)
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CreateProductInput {
  name: string;
  price: number;
}
```

#### Step 2: اضافه کردن endpoint (`utils/endpoints.ts`)
```typescript
export const API_ENDPOINTS = {
  // ...
  PRODUCT: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    CREATE: '/products',
  }
};
```

#### Step 3: توابع خام (`get.ts`, `post.ts`)
```typescript
// get.ts
import { APIHttp } from '../../utils/client';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { Product } from './type';

export const getProducts = () => 
  APIHttp.get<Product[]>(API_ENDPOINTS.PRODUCT.LIST);

export const getProductById = (id: string) => 
  APIHttp.get<Product>(API_ENDPOINTS.PRODUCT.DETAIL(id));

// post.ts
import { CreateProductInput, Product } from './type';

export const createProduct = (data: CreateProductInput) =>
  APIHttp.post<Product>(API_ENDPOINTS.PRODUCT.CREATE, data);
```

#### Step 4: React Query Hooks (`query.ts`)
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProducts, createProduct } from './get';
import type { CreateProductInput } from './type';

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: createProduct,
  });
};
```

#### Step 5: Export در `index.ts`
```typescript
// packages/framework/src/index.ts
export * from './routes/product/get';
export * from './routes/product/post';
export * from './routes/product/query';
export type * from './routes/product/type';
```

### 5.3. راهنمای کامل
برای راهنمای مفصل اضافه کردن endpoint به این‌ها مراجعه کنید:
- `packages/framework/README.md`
- `packages/framework/ADD_ENDPOINT_PROMPT.md`
- `prompts/framework/add-endpoint/`

## ۶. تایپ‌ها

### 6.1. Base Types
```typescript
import type { 
  BaseResponseType,
  PaginatedResponse,
  APIHttpType
} from '@workspace/framework';

// استفاده
interface MyResponse extends BaseResponseType {
  data: MyData;
}
```

### 6.2. محل تایپ‌ها
- **تایپ‌های API**: `packages/framework/src/routes/[feature]/type.ts`
- **تایپ‌های گلوبال**: `packages/custom-ui/src/types/`
- **تایپ‌های خاص اپ**: `apps/[app-name]/src/types/`

## ۷. قوانین مهم

### ✅ باید انجام دهید:
1. **همیشه از `API_ENDPOINTS` استفاده کنید**
   ```typescript
   // ✅ درست
   APIHttp.get(API_ENDPOINTS.USER.PROFILE);
   ```

2. **در UI از Hooks استفاده کنید**
   ```typescript
   // ✅ درست
   const { data } = useUserProfileQuery();
   ```

3. **تایپ‌های دقیق تعریف کنید**
   ```typescript
   // ✅ درست
   interface User { id: string; name: string; }
   ```

### ❌ نباید انجام دهید:
1. **هاردکد endpoint**
   ```typescript
   // ❌ اشتباه
   APIHttp.get('/api/users');
   ```

2. **API call مستقیم در اپ**
   ```typescript
   // ❌ اشتباه
   const response = await fetch('/api/users');
   ```

3. **استفاده از `any`**
   ```typescript
   // ❌ اشتباه
   const data: any = await getUsers();
   ```

---

## منابع مرتبط
- [API_DOCUMENTATION.markdown](API_DOCUMENTATION.markdown): برای مستندسازی APIها.
- [TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown): برای مستندسازی تسک‌ها.
- [before_task.markdown](before_task.markdown): برای اقدامات قبل از تسک.
- [after_task.markdown](after_task.markdown): برای اقدامات بعد از تسک.
- [AUTH_GUIDELINES.markdown](AUTH_GUIDELINES.markdown): برای احراز هویت.
- [TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown): برای تست‌نویسی.