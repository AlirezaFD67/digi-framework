# 📚 افزودن داکیومنت Framework

راهنمای کامل برای افزودن داکیومنت endpoint جدید به Framework Package.

## 🎯 هدف

این prompt برای موارد زیر استفاده می‌شود:
- ✅ افزودن endpoint جدید به framework package
- ✅ نوشتن داکیومنت کامل برای endpoint
- ✅ آپدیت تمام فایل‌های مرتبط
- ✅ ثبت تغییرات در CHANGELOG

## 📋 شامل چه مراحلی است؟

1. **Framework Package**:
   - افزودن endpoints به `api-endpoints.ts`
   - ایجاد route structure کامل
   - تعریف types & interfaces
   - ایجاد GET/POST/PUT/DELETE functions
   - ایجاد React Query hooks
   - Export و build

2. **Documentation**:
   - ایجاد فایل MDX کامل برای endpoint
   - آپدیت `meta.json`
   - آپدیت `index.mdx`
   - آپدیت `adding-endpoints.mdx`
   - آپدیت `README.md`
   - ایجاد/آپدیت `CHANGELOG.md`

## 🎯 مثال واقعی

برای مشاهده یک مثال کامل و واقعی از پیاده‌سازی:

**Article Endpoint** - یک endpoint کامل با:
- 13 API Endpoints
- 7 Interfaces
- 15 Functions
- 11 React Query Hooks
- داکیومنت کامل با مثال‌های عملی

📖 [مشاهده داکیومنت Article Endpoint](../../../apps/docs/content/docs/framework/article-endpoint.mdx)

## 🚀 نحوه استفاده

### روش 1: استفاده از Prompt کامل

از فایل `index.mdx` استفاده کنید که شامل دستورالعمل کامل و تمام مراحل است.

### روش 2: استفاده گام‌به‌گام

مراحل را یکی‌یکی دنبال کنید:

1. **مرحله Framework** (مراحل 1-8)
2. **مرحله Documentation** (مراحل 9-14)

## 📁 ساختار خروجی

### Framework Package
```
packages/framework/
├── src/
│   ├── utils/
│   │   └── api-endpoints.ts (آپدیت)
│   ├── routes/
│   │   └── [endpoint-name]/
│   │       ├── type.ts
│   │       ├── get.ts
│   │       ├── post.ts
│   │       ├── query.ts
│   │       └── index.ts
│   └── index.ts (آپدیت)
├── CHANGELOG.md (آپدیت/ایجاد)
└── README.md (آپدیت)
```

### Documentation
```
apps/docs/content/docs/framework/
├── meta.json (آپدیت)
├── index.mdx (آپدیت)
├── adding-endpoints.mdx (آپدیت)
└── [endpoint-name]-endpoint.mdx (جدید)
```

## ✅ چک‌لیست

پس از اتمام کار، موارد زیر را بررسی کنید:

### Framework Package:
- [ ] Endpoints در `api-endpoints.ts`
- [ ] Route structure کامل
- [ ] Types & Interfaces
- [ ] GET/POST/PUT functions
- [ ] React Query hooks
- [ ] Exports صحیح
- [ ] Build موفق
- [ ] بدون linter errors

### Documentation:
- [ ] فایل MDX endpoint
- [ ] آپدیت `meta.json`
- [ ] آپدیت `index.mdx`
- [ ] آپدیت `adding-endpoints.mdx`
- [ ] آپدیت `README.md`
- [ ] CHANGELOG کامل

### Quality:
- [ ] مثال‌های کد کامل
- [ ] Best practices
- [ ] Common issues
- [ ] جدول Available Hooks
- [ ] لینک‌های صحیح

## 🎨 الگوهای نام‌گذاری

### Files & Folders
```
kebab-case:
- article/
- user-profile/
- type.ts
- get.ts
```

### Interfaces
```typescript
PascalCase با prefix I:
- IArticle
- ICreateArticleRequest
- IUpdateArticleRequest
```

### Functions
```typescript
PascalCase:
- GetArticleList
- CreateArticle
- UpdateArticle
```

### Hooks
```typescript
camelCase با prefix use:
- useArticleListQuery
- useCreateArticleMutation
- useUpdateArticleMutation
```

### Query Keys
```typescript
kebab-case:
["get-article-list", String(params)]
["get-article-detail", id]
["create-article"]
```

## 📚 منابع مرتبط

- [Framework Package Documentation](../../../apps/docs/content/docs/framework/)
- [Article Endpoint - مثال واقعی](../../../apps/docs/content/docs/framework/article-endpoint.mdx)
- [Adding Endpoints Guide](../../../apps/docs/content/docs/framework/adding-endpoints.mdx)
- [Framework README](../../../packages/framework/README.md)

## 🚨 نکات مهم

1. **API_ENDPOINTS**: همیشه از این const استفاده کنید
2. **Type Safety**: هیچ `any` مجاز نیست
3. **Generic Hooks**: از generic hooks framework استفاده کنید
4. **Query Keys**: unique و معنادار باشند
5. **Documentation**: کامل و با مثال‌های عملی
6. **CHANGELOG**: همه تغییرات ثبت شوند
7. **Build**: قبل از commit حتماً build کنید
8. **Examples**: واقعی و کاربردی باشند

## 🎯 چه موقع استفاده کنیم؟

این prompt را در موارد زیر استفاده کنید:

✅ **باید استفاده شود:**
- افزودن endpoint جدید به framework
- نوشتن داکیومنت کامل endpoint
- ایجاد مثال واقعی برای دیگران
- استانداردسازی ساختار endpoints

❌ **نباید استفاده شود:**
- تغییرات جزئی در endpoint موجود
- رفع باگ ساده
- فقط آپدیت type ها

## 📞 پشتیبانی

برای سوالات یا مشکلات:
- 📖 مراجعه به [داکیومنت اصلی](index.mdx)
- 🔍 بررسی [مثال Article Endpoint](../../../apps/docs/content/docs/framework/article-endpoint.mdx)
- 📋 چک کردن [CHANGELOG](../../../packages/framework/CHANGELOG.md)

---

**آماده برای شروع؟ فایل `index.mdx` را باز کنید! 🚀**

