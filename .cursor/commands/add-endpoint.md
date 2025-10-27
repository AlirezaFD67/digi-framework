---
title: Add New Endpoint
description: راهنمای کامل افزودن endpoint جدید به framework package
---

# ➕ Add New Endpoint

راهنمای کامل برای افزودن endpoint جدید به framework package با استفاده از prompt.

## 🎯 نحوه استفاده

برای افزودن endpoint جدید، اطلاعات زیر را به prompt بدهید:

### 1. **Endpoint Information**
```markdown
**Endpoint Name:** [نام endpoint - مثلاً: users, orders, categories]
**Base Path:** [مسیر پایه - مثلاً: /users, /orders, /categories]
**Description:** [توضیح کوتاه endpoint]
```

### 2. **API Endpoints**
```markdown
**GET Endpoints:**
- LIST: /users (لیست کاربران)
- DETAIL: /users/{id} (جزئیات کاربر)
- SEARCH: /users/search (جستجوی کاربران)

**POST Endpoints:**
- CREATE: /users (ایجاد کاربر)
- BULK_CREATE: /users/bulk (ایجاد دسته‌ای)

**PUT Endpoints:**
- UPDATE: /users/{id} (به‌روزرسانی کاربر)
- BULK_UPDATE: /users/bulk (به‌روزرسانی دسته‌ای)

**DELETE Endpoints:**
- DELETE: /users/{id} (حذف کاربر)
- BULK_DELETE: /users/bulk (حذف دسته‌ای)
```

### 3. **Response Example**
```json
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
```

### 4. **Request Examples**
```json
// Create User Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "isActive": true
}

// Update User Request
{
  "id": "user-1",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}

// User List Query Parameters
{
  "pageNo": 1,
  "rowCount": 10,
  "search": "john",
  "role": "admin",
  "isActive": true
}
```

## 📝 مثال کامل

```
من می‌خوام یک endpoint جدید به framework package اضافه کنم:

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

## 🔧 مراحل پیاده‌سازی

### مرحله 1: افزودن Endpoint به API_ENDPOINTS

```typescript
// src/utils/api-endpoints.ts
const USERS = {
  LIST: "/users",
  DETAIL: "/users",
  SEARCH: "/users/search",
  CREATE: "/users",
  UPDATE: "/users",
  DELETE: "/users",
  BULK_DELETE: "/users/bulk",
} as const;

// اضافه کردن به API_ENDPOINTS
const API_ENDPOINTS = {
  // ... existing endpoints
  USERS, // ← اضافه کردن
} as const;
```

### مرحله 2: ایجاد Route Structure

```bash
# ایجاد فولدر
mkdir -p packages/framework/src/routes/users
```

### مرحله 3: تعریف Types

```typescript
// src/routes/users/type.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive?: boolean;
}

export interface IUpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface IUserListParams extends QueryParams {
  role?: string;
  isActive?: boolean;
}

export interface IUserDetailParams {
  id: string;
}

export interface IUserSearchParams extends QueryParams {
  query: string;
  role?: string;
  isActive?: boolean;
}
```

### مرحله 4: ایجاد توابع API

```typescript
// src/routes/users/get.ts
export function GetUsersList(params?: IUserListParams): Promise<APIHttpPaginatedType<IUser>>
export function GetUserDetail(params: IUserDetailParams): Promise<APIHttpType<IUser>>
export function SearchUsers(params: IUserSearchParams): Promise<APIHttpPaginatedType<IUser>>

// src/routes/users/post.ts
export function CreateUser(userData: ICreateUserRequest): Promise<APIHttpType<IUser>>
export function UpdateUser(userData: IUpdateUserRequest): Promise<APIHttpType<IUser>>

// src/routes/users/delete.ts
export function DeleteUser(userId: string): Promise<APIHttpType<{ message: string }>>
export function BulkDeleteUsers(userIds: string[]): Promise<APIHttpType<{ deleted: number; failed: number }>>
```

### مرحله 5: ایجاد React Query Hooks

```typescript
// src/routes/users/query.ts
export const useUsersQuery = (params?: IUserListParams) => UseQueryResult<APIHttpPaginatedType<IUser>, Error>
export const useUserDetailQuery = (params: IUserDetailParams) => UseQueryResult<APIHttpType<IUser>, Error>
export const useSearchUsersQuery = (params: IUserSearchParams) => UseQueryResult<APIHttpPaginatedType<IUser>, Error>
export const useCreateUserMutation = () => UseMutationResult<IUser, ICreateUserRequest, Error>
export const useUpdateUserMutation = () => UseMutationResult<IUser, IUpdateUserRequest, Error>
export const useDeleteUserMutation = () => UseMutationResult<{ message: string }, string, Error>
export const useBulkDeleteUsersMutation = () => UseMutationResult<{ deleted: number; failed: number }, string[], Error>
```

### مرحله 6: Export و Build

```typescript
// src/routes/users/index.ts
export * from "./type";
export * from "./get";
export * from "./post";
export * from "./delete";
export * from "./query";

// src/index.ts
export * from "./routes/users"; // ← اضافه کردن
```

## 📋 چک‌لیست کامل

### ✅ مراحل تکمیل شده:

- [ ] Endpoint به API_ENDPOINTS اضافه شده
- [ ] فولدر route ایجاد شده
- [ ] فایل type.ts با تمام interfaceها
- [ ] فایل get.ts با توابع GET
- [ ] فایل post.ts با توابع POST/PUT
- [ ] فایل delete.ts با توابع DELETE
- [ ] فایل query.ts با React Query hooks
- [ ] فایل index.ts با تمام exports
- [ ] Route در main index.ts export شده
- [ ] Build موفق
- [ ] تست اولیه موفق

## 🎯 مثال استفاده

```tsx
// components/UserManagement.tsx
import { 
  useUsersQuery, 
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation 
} from "@workspace/framework";

export function UserManagement() {
  const { data: users, isLoading } = useUsersQuery({
    pageNo: 1,
    rowCount: 20,
    isActive: true,
  });

  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();
  const deleteUser = useDeleteUserMutation();

  const handleCreate = async (userData) => {
    await createUser.mutateAsync(userData);
  };

  const handleUpdate = async (userId, userData) => {
    await updateUser.mutateAsync({ id: userId, ...userData });
  };

  const handleDelete = async (userId) => {
    await deleteUser.mutateAsync(userId);
  };

  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

## 🚨 نکات مهم

### 1. **نام‌گذاری**
- فولدر: `kebab-case` (user-profiles, order-items)
- فایل‌ها: `kebab-case` (user-detail.tsx)
- Interfaceها: `PascalCase` با prefix `I` (IUser, ICreateUserRequest)
- Enumها: `PascalCase` (UserStatus, UserRole)

### 2. **ساختار Types**
- همیشه interface اصلی را تعریف کنید
- Request/Response types جداگانه
- Query parameters interface
- Enum برای status ها

### 3. **API Functions**
- همیشه از API_ENDPOINTS استفاده کنید
- Parameters validation
- Error handling مناسب
- Type safety کامل

### 4. **React Query Hooks**
- Query keys معنادار
- Stale time مناسب
- Error handling
- Success callbacks

## 🎯 مرحله بعدی

بعد از افزودن endpoint جدید، می‌توانید:

1. **[Examples](propmts/framework/examples)** - مثال‌های عملی
2. **[API Reference](propmts/framework/api-reference)** - مرجع کامل API
3. **[Usage Guide](propmts/framework/usage)** - راهنمای استفاده

---

**آماده‌اید endpoint جدید اضافه کنید؟ اطلاعات endpoint را به prompt بدهید! 🚀**
