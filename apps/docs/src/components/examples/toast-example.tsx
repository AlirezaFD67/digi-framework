"use client"

import { useToast, Button } from "@workspace/custom-ui"

export default function ToastExample() {
  const { success, error, warning, info, addToast } = useToast()

  return (
    <div className="flex flex-wrap gap-3 p-6">
      {/* Basic Toasts */}
      <Button
        variant="default"
        onClick={() => success('عملیات با موفقیت انجام شد')}
      >
        Success Toast
      </Button>

      <Button
        variant="destructive"
        onClick={() => error('خطایی رخ داد')}
      >
        Error Toast
      </Button>

      <Button
        variant="secondary"
        onClick={() => warning('لطفا دقت کنید')}
      >
        Warning Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => info('اطلاعات جدید موجود است')}
      >
        Info Toast
      </Button>

      {/* Toast with Title */}
      <Button
        variant="default"
        onClick={() => success('فایل با موفقیت آپلود شد', 'آپلود موفق')}
      >
        With Title
      </Button>

      {/* Custom Duration */}
      <Button
        variant="outline"
        onClick={() => addToast({
          type: 'info',
          title: 'پیام طولانی',
          message: 'این پیام 10 ثانیه نمایش داده می‌شود',
          duration: 10000
        })}
      >
        Long Duration (10s)
      </Button>

      {/* Multiple Toasts */}
      <Button
        variant="default"
        onClick={() => {
          success('مرحله 1 تکمیل شد')
          setTimeout(() => success('مرحله 2 تکمیل شد'), 500)
          setTimeout(() => success('مرحله 3 تکمیل شد'), 1000)
        }}
      >
        Sequential Toasts
      </Button>
    </div>
  )
}

