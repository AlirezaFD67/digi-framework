# 🔔 Toast Notification System - راهنمای سریع

سیستم Toast کامل برای نمایش پیام‌ها به کاربران.

## ⚡ شروع سریع

### 1. Setup (خودکار در CustomUIProvider)

```tsx
// app/layout.tsx
import { CustomUIProvider } from "@workspace/custom-ui"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CustomUIProvider
          mode="dashboard"
          toastConfig={{
            position: "top-right"  // اختیاری
          }}
        >
          {children}
        </CustomUIProvider>
      </body>
    </html>
  )
}
```

**✅ ToastProvider و ToastContainer خودکار اضافه می‌شوند!**

---

### 2. استفاده در کامپوننت

```tsx
import { useToast } from "@workspace/custom-ui"

function MyComponent() {
  const { success, error, warning, info } = useToast()

  return (
    <div>
      <button onClick={() => success('ذخیره شد')}>ذخیره</button>
      <button onClick={() => error('خطا رخ داد')}>خطا</button>
      <button onClick={() => warning('دقت کنید')}>هشدار</button>
      <button onClick={() => info('اطلاعات جدید')}>اطلاعات</button>
    </div>
  )
}
```

---

## 📋 API

### Methods

```tsx
const toast = useToast()

// متدهای سریع
toast.success(message, title?)    // موفقیت (5 ثانیه)
toast.error(message, title?)      // خطا (7 ثانیه)
toast.warning(message, title?)    // هشدار (6 ثانیه)
toast.info(message, title?)       // اطلاعات (5 ثانیه)

// متدهای پیشرفته
toast.addToast({                  // toast سفارشی
  type: 'success',
  message: 'پیام',
  title: 'عنوان',
  duration: 5000,
  dismissible: true
})

toast.removeToast(id)             // حذف toast خاص
toast.clearToasts()               // حذف همه
```

---

## 🎯 مثال‌های کاربردی

### CRUD Operations

```tsx
// Create
await api.create(data)
toast.success('ایجاد شد')

// Update  
await api.update(data)
toast.success('به‌روزرسانی شد')

// Delete
await api.delete(id)
toast.success('حذف شد')
```

### با Form

```tsx
import { useAddAdminLearningList } from "@workspace/framework"

const mutation = useAddAdminLearningList()

const handleSubmit = async (data) => {
  try {
    await mutation.mutateAsync(data)
    toast.success('مقاله ایجاد شد', 'موفقیت')
  } catch (err) {
    toast.error('خطا در ایجاد مقاله', 'خطا')
  }
}
```

### File Upload

```tsx
const handleUpload = async (files) => {
  toast.info('در حال آپلود...')
  
  try {
    await upload(files)
    toast.success('آپلود شد')
  } catch {
    toast.error('خطا در آپلود')
  }
}
```

### API Errors

```tsx
try {
  await api.call()
  toast.success('موفق')
} catch (err) {
  if (err.status === 401) {
    toast.error('لطفا وارد شوید', 'خطای احراز هویت')
  } else if (err.status === 403) {
    toast.warning('دسترسی ندارید', 'عدم دسترسی')
  } else {
    toast.error('خطای سرور')
  }
}
```

---

## ⚙️ تنظیمات

### Position Options

```tsx
<CustomUIProvider
  toastConfig={{
    position: "top-right"     // پیش‌فرض
    // position: "top-left"
    // position: "top-center"
    // position: "bottom-right"
    // position: "bottom-left"
    // position: "bottom-center"
  }}
>
```

### Toast Types

- `success` ✅ - سبز، 5 ثانیه
- `error` ❌ - قرمز، 7 ثانیه  
- `warning` ⚠️ - زرد، 6 ثانیه
- `info` ℹ️ - آبی، 5 ثانیه

---

## ✨ ویژگی‌ها

- ✅ **4 نوع پیام** - Success, Error, Warning, Info
- ✅ **Auto-dismiss** - بسته شدن خودکار با زمان قابل تنظیم
- ✅ **Manual dismiss** - دکمه بستن
- ✅ **RTL Support** - پشتیبانی کامل راست به چپ
- ✅ **Animation** - انیمیشن نرم ورود و خروج
- ✅ **Positioning** - 6 موقعیت مختلف
- ✅ **Max Toasts** - محدودیت تعداد نمایش
- ✅ **Timestamp** - نمایش زمان
- ✅ **TypeScript** - Type-safe کامل

---

## 📚 مستندات کامل

برای جزئیات بیشتر:
- [داکیومنت کامل](/docs/custom-ui/toast)
- [Error System](/docs/custom-ui/error-system)
- [مثال‌های بیشتر](/docs/custom-ui/examples)

---

**آماده استفاده است! 🚀**

