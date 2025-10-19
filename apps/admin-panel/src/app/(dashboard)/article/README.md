# 📝 Article Management System

این سیستم برای مدیریت کامل مقالات در پنل ادمین طراحی شده است.

## 📂 ساختار فایل‌ها

```
article/
├── README.md                           # این فایل
├── page.tsx                            # صفحه اصلی لیست مقالات
├── new/
│   └── page.tsx                        # صفحه ایجاد مقاله جدید
├── [id]/
│   └── page.tsx                        # صفحه ویرایش مقاله (TODO)
└── _sections/
    ├── articles-list.view.tsx          # نمایش لیست مقالات
    └── article-form/
        ├── index.ts
        └── article-form.tsx            # فرم چند مرحله‌ای مقاله
```

## 🔗 اتصالات و Dependencies

### 1. Framework Routes (`@workspace/framework`)

تمام API endpoints و React Query hooks از این پکیج import می‌شوند:

#### API Endpoints:
```typescript
// در packages/framework/src/utils/api-endpoints.ts
ARTICLES = {
  ADMIN_LEARNING_LIST: "/adminlearninglist",           // لیست مقالات
  ADD_ARTICLE: "/admininsertlearningbase1",            // ایجاد مقاله (اطلاعات اولیه)
  ADD_ARTICLE_BASE2: "/admininsertlearningbase2",      // افزودن جزئیات مقاله
  UPDATE_ARTICLE: "/adminupdatelearning",              // به‌روزرسانی مقاله
  GET_LEARNING_CAT_LIST: "/getlearningcatlist",        // لیست دسته‌بندی‌ها
  UPLOAD_THUMBNAIL: "/adminuploadlearningimage",       // آپلود تصویر شاخص
  ADMIN_LEARNING_DETAIL: "/adminlearningbasedetails",  // جزئیات مقاله
  ADMIN_LEARNING_BODY_DETAILS: "/adminlearningbodydetails", // محتوای مقاله
  SEARCH_DOCS: "/adminlearningsearchdoc",              // جستجوی دکتر
  ADMIN_FILE_MANAGER_LIST: "/adminfilemanagerlist",    // لیست فایل‌های مقاله
  SAVE_CONTENT: "/admininsertlearningbody",            // ذخیره محتوای بلوکی
  ACCEPT_LEARNING: "/adminacceptlearning",             // تایید/رد مقاله
  UPLOAD_FILE: "/adminuploadnewfile",                  // آپلود فایل جدید
}

DOCTORS = {
  GET_DOCTORS: "/getdoctors",                          // لیست دکترها
}

FILE = {
  UPLOAD_CHUNK: "/adminuploadnewfile",                 // آپلود chunked فایل‌های بزرگ
}
```

#### React Query Hooks:
```typescript
// Query Hooks (برای دریافت داده)
useAdminLearningListQuery()          // لیست مقالات با pagination و جستجو
useAdminCategoryListQuery()          // لیست دسته‌بندی‌ها
useAuthorsListQuery()                // لیست نویسندگان
useDoctorsListQuery()                // لیست دکترها
useAdminLearningDetail(id)           // جزئیات یک مقاله
useArticleContent(id)                // محتوای بلوکی مقاله
useArticleFilesList(id)              // لیست فایل‌های مقاله

// Mutation Hooks (برای تغییر داده)
useAddAdminLearningList()            // ایجاد مقاله جدید
useUpdateAdminLearningList()         // به‌روزرسانی مقاله
useAddArticleDetails()               // افزودن جزئیات مقاله
useSaveArticleContent()              // ذخیره محتوای بلوکی
useAcceptLearningMutation()          // تایید/رد مقاله
useGlobalFileUploadMutation()        // آپلود فایل با chunking
```

### 2. Custom UI Components (`@workspace/custom-ui`)

#### استفاده شده در Article List:
```typescript
import {
  CustomTable,        // جدول با pagination و sort
  CustomPagination,   // صفحه‌بندی
  SearchInput,        // جستجوی debounced
} from "@workspace/custom-ui";
```

#### استفاده شده در Article Form:
```typescript
import {
  SearchableSelect,   // انتخابگر با قابلیت جستجو
  SimpleRichEditor,   // ویرایشگر متن ساده
  UploadBox,          // آپلود فایل با drag & drop و chunking
  Button,            
  Card,
  Input,
  useToast,          // نمایش پیام‌های موفقیت/خطا
} from "@workspace/custom-ui";
```

### 3. UI Components (`@workspace/ui`)

```typescript
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
```

## 📋 صفحات و Sections

### 1. صفحه لیست مقالات (`page.tsx`)

**مسئولیت‌ها:**
- مدیریت state جستجو
- تنظیم عنوان header
- scroll restoration با sessionStorage

**Props به ArticlesListView:**
```typescript
searchTerm: string  // عبارت جستجو
```

### 2. نمایش لیست مقالات (`articles-list.view.tsx`)

**قابلیت‌ها:**
- ✅ نمایش جدولی مقالات با ستون‌های: عنوان، دسته‌بندی، اسلاگ، تاریخ، بازدید، وضعیت
- ✅ فیلتر بر اساس وضعیت (فعال/در انتظار تایید)
- ✅ جستجو بر اساس عنوان مقاله
- ✅ Pagination سمت سرور
- ✅ دکمه‌های عملیات: مشاهده، ویرایش، انتشار/لغو انتشار
- ✅ نمایش badge تعداد مقالات منتشر شده در header

**State Management:**
```typescript
const [isAccepted, setIsAccepted] = useState<number>(1);  // 1=فعال, 0=در انتظار
const [currentPage, setCurrentPage] = useState<number>(1);
```

**API Integration:**
```typescript
const { data, isLoading } = useAdminLearningListQuery({ 
  isAccepted, 
  pageNo: currentPage,
  rowCount: 10,
  itmTitle: searchTerm || undefined
});
```

### 3. صفحه ایجاد مقاله (`new/page.tsx`)

**مسئولیت‌ها:**
- مدیریت flow ایجاد مقاله
- نگهداری `itmID` در sessionStorage
- مدیریت tab navigation
- فراخوانی API برای ذخیره مراحل مختلف

**Flow ایجاد مقاله:**
```
1. ذخیره اطلاعات اولیه (Tab 1) → دریافت itmID
2. ذخیره جزئیات (Tab 2) → با itmID موجود
3. آپلود فایل‌ها (Tab 3) → با itmID موجود
4. پیش‌نمایش و نهایی‌سازی (Tab 4)
5. هدایت به لیست مقالات
```

### 4. فرم مقاله (`article-form/article-form.tsx`)

**ساختار 4 تبی:**

#### Tab 1: اطلاعات اولیه (Basic Info)
```typescript
interface BasicData {
  catID: string;          // دسته‌بندی (required)
  itmTitle: string;       // عنوان (required)
  itmMinimal: string;     // خلاصه
  itmMetaDesc: string;    // توضیحات متا
  itmSlug: string;        // URL slug (required)
}
```

**Components:**
- `SearchableSelect` برای انتخاب دسته‌بندی
- `Input` برای عنوان و اسلاگ
- `Textarea` برای خلاصه و متا
- Auto-generate slug از عنوان

#### Tab 2: جزئیات و تصویر شاخص (Details & Cover)
```typescript
interface DetailData {
  narID: string;          // نویسنده/راوی
  docID: string;          // دکتر مرتبط
  readTime: string;       // زمان مطالعه (دقیقه)
  coverImage: File | null; // تصویر شاخص
}
```

**Components:**
- `SearchableSelect` برای نویسنده و دکتر
- `Input` برای زمان مطالعه
- `UploadBox` برای تصویر شاخص (با chunked upload)

**ویژگی‌های UploadBox:**
- ✅ Drag & Drop
- ✅ نمایش پیشرفت آپلود
- ✅ Chunked upload برای فایل‌های بزرگ
- ✅ پیش‌نمایش تصویر

#### Tab 3: فایل‌ها و پیوست‌ها (Files & Attachments)
```typescript
interface FileItem {
  id: string;
  name: string;
  size: number;
  url?: string;
  uploadProgress?: number;
}
```

**قابلیت‌ها:**
- ✅ آپلود چند فایل
- ✅ نمایش لیست فایل‌های آپلود شده
- ✅ حذف فایل
- ✅ نمایش پیشرفت آپلود real-time
- ✅ Auto-save پس از آپلود موفق

#### Tab 4: محتوا و پیش‌نمایش (Content & Preview)
```typescript
interface ContentData {
  itmDesc: string;        // محتوای ساده (SimpleRichEditor)
  // BlockEditor content در آینده اضافه خواهد شد
}
```

**Components:**
- `SimpleRichEditor` برای محتوای ساده
- Preview section (TODO)

**ویژگی‌های SimpleRichEditor:**
- ✅ Bold, Italic, Underline
- ✅ Headings (H1-H6)
- ✅ Lists (ordered/unordered)
- ✅ Links
- ✅ Text alignment
- ✅ RTL support

## 🚀 نحوه استفاده

### مشاهده لیست مقالات:
```
/article
```

### ایجاد مقاله جدید:
```
/article/new
```

### ویرایش مقاله:
```
/article/edit/[id]  (TODO)
```

## 🔄 Data Flow

### ایجاد مقاله جدید:
```
1. User کلیک روی "افزودن مقاله جدید"
   ↓
2. sessionStorage.removeItem("article:create:itmID")
   ↓
3. Navigate to /article/new
   ↓
4. Tab 1: کاربر اطلاعات اولیه را پر می‌کند
   ↓
5. Submit Tab 1 → useAddAdminLearningList() → دریافت itmID
   ↓
6. sessionStorage.setItem("article:create:itmID", itmID)
   ↓
7. Auto navigate به Tab 2
   ↓
8. Tab 2: آپلود تصویر و جزئیات → useAddArticleDetails()
   ↓
9. Tab 3: آپلود فایل‌های پیوست → useGlobalFileUploadMutation()
   ↓
10. Tab 4: محتوا و نهایی‌سازی → useSaveArticleContent()
    ↓
11. sessionStorage.removeItem("article:create:itmID")
    ↓
12. Navigate to /article
```

### جستجو و فیلتر:
```
User تایپ در SearchInput
   ↓
Debounce 500ms
   ↓
setSearchTerm()
   ↓
useEffect → setCurrentPage(1)
   ↓
useAdminLearningListQuery refetch
   ↓
Update table
```

## 📦 Custom UI Components در Article

### 1. BlockEditor Components (در custom-ui)

**مسیر:** `packages/custom-ui/src/components/`

#### Block Components:
```
blocks/
├── audio-block.tsx              # بلوک صوتی
├── call-to-action-block.tsx     # بلوک دعوت به اقدام (CTA)
├── faq-block.tsx                # بلوک سوالات متداول
├── heading-block.tsx            # بلوک عنوان (H1-H6)
├── image-block.tsx              # بلوک تصویر
├── list-block.tsx               # بلوک لیست
├── map-block.tsx                # بلوک نقشه
├── paragraph-block.tsx          # بلوک پاراگراف
├── quote-block.tsx              # بلوک نقل‌قول
├── references-block.tsx         # بلوک منابع
├── table-block.tsx              # بلوک جدول
├── table-of-contents-block.tsx  # بلوک فهرست مطالب
├── video-block.tsx              # بلوک ویدیو
├── block-renderer.tsx           # Renderer برای نمایش بلوک‌ها
└── index.ts
```

#### BlockEditor Core:
```
block-editor/
├── block-editor.tsx             # ویرایشگر اصلی بلوک‌ها
├── drag-handle.tsx              # دسته کشیدن بلوک‌ها
└── index.ts
```

#### Rich Text Editor:
```
rich-text-editor/
├── rich-text-editor.tsx         # ویرایشگر متن پیشرفته (با styled-jsx)
└── index.ts
```

**نکته مهم:** RichTextEditor به دلیل مشکلات TypeScript با styled-jsx، از export اصلی custom-ui حذف شده. برای استفاده مستقیم:
```typescript
import RichTextEditor from "@workspace/custom-ui/dist/components/rich-text-editor/rich-text-editor"
```

### 2. Content Block Types

**مسیر:** `packages/custom-ui/src/types/content-blocks.ts`

```typescript
type ContentBlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'video' 
  | 'image' 
  | 'call-to-action' 
  | 'quote' 
  | 'table' 
  | 'faq' 
  | 'audio' 
  | 'map' 
  | 'list' 
  | 'references' 
  | 'table-of-contents';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  order: number;
  data: any; // هر بلوک data structure خاص خودش را دارد
}
```

## ⚠️ TODO و بهبودها

### فعلاً موجود نیست:
- [ ] صفحه ویرایش مقاله (`/article/edit/[id]`)
- [ ] استفاده از BlockEditor در Tab 4 (فعلاً SimpleRichEditor است)
- [ ] Preview واقعی مقاله
- [ ] File Selector Modal در BlockEditor
- [ ] Drag & Drop برای مرتب‌سازی بلوک‌ها (dependencies نصب شده اما integrate نشده)

### نیاز به بهبود:
- [ ] استفاده واقعی از `useToast` به جای `alert()` در article-form
- [ ] Error handling بهتر
- [ ] Validation فرم‌ها با zod یا yup
- [ ] Optimistic updates در mutations
- [ ] Image optimization برای تصاویر آپلود شده
- [ ] RTL styling بهتر در برخی components

## 🐛 مشکلات شناخته شده

1. **ESLint Warning:** 
   ```
   Invalid Options: - Unknown options: useEslintrc, extensions
   ```
   این warning در build ظاهر می‌شود اما مانع build نمی‌شود.

2. **RichTextEditor TypeScript:**
   به دلیل styled-jsx، type definitions کامل تولید نمی‌شود.

3. **Toast در article-form:**
   فعلاً از `alert()` استفاده می‌شود (خط 98-99).

## 📚 مستندات مرتبط

- [Framework Package README](/packages/framework/README.md)
- [Custom UI Package README](/packages/custom-ui/README.md)
- [Toast System Usage](/packages/custom-ui/TOAST_USAGE.md)
- [Error System Usage](/packages/custom-ui/ERROR_SYSTEM_USAGE.md)

## 🤝 مشارکت

برای افزودن قابلیت جدید یا بهبود:

1. بررسی TODO list بالا
2. ایجاد branch جدید
3. پیاده‌سازی تغییرات
4. تست در محیط development
5. Build کردن برای اطمینان از عدم خطا
6. ارسال Pull Request

---

**آخرین به‌روزرسانی:** October 2025  
**نسخه:** 1.0.0  
**وضعیت:** ✅ Production Ready (با TODO های ذکر شده)

