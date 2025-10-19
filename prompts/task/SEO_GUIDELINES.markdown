# راهنمای SEO (Monorepo)

این سند دستورات لازم برای بهینه‌سازی SEO در اپلیکیشن‌های Next.js ساختار Monorepo را مشخص می‌کند.

## نکته: SEO در هر اپلیکیشن
- هر اپلیکیشن در `apps/` SEO خودش را دارد
- تنظیمات SEO در `app/layout.tsx` هر اپلیکیشن انجام می‌شود
- فایل‌های `sitemap.xml` و `robots.txt` در `public/` هر اپ قرار دارند

## ۱. تنظیم Metadata عمومی
- در `app/layout.tsx`، شیء `metadata` را با موارد زیر تعریف کنید:
  - `title`: عنوان پیش‌فرض پروژه (مثل "پنل ادمین").
  - `description`: توضیحات پیش‌فرض (حداکثر ۱۶۰ کاراکتر).
  - `keywords`: کلمات کلیدی عمومی (با کاما جدا شوند).
  - `viewport`: "width=device-width, initial-scale=1".
  - `icons`: مسیر favicon در `public/icons/` (مثل "/icons/favicon.ico").
  - `robots`: `{ index: true, follow: true }`.
- مثال:
  ```typescript
  export const metadata = {
    title: "پنل ادمین",
    description: "پنل مدیریت با امکانات پیشرفته",
    keywords: "پنل ادمین, مدیریت, وب اپلیکیشن",
    viewport: "width=device-width, initial-scale=1",
    icons: { icon: "/icons/favicon.ico" },
    robots: { index: true, follow: true }
  };
  ```

## ۲. تنظیم Metadata خاص هر صفحه
- در هر فایل `page.tsx`، metadata را تعریف کنید.
- برای صفحات استاتیک، `metadata` را با موارد زیر تعریف کنید:
  - `title`: عنوان منحصربه‌فرد صفحه.
  - `description`: توضیحات منحصربه‌فرد (حداکثر ۱۶۰ کاراکتر).
  - `canonical`: URL کامل صفحه (مثل `${process.env.BASE_URL}/page-url`).
  - `openGraph`: شامل `title`, `description`, `images` (مثل "/images/og-image.jpg").
  - `twitter`: شامل `title`, `description`, `card: "summary_large_image"`.
- برای صفحات داینامیک، از `generateMetadata` استفاده کنید.
- مثال:
  ```typescript
  export async function generateMetadata({ params }) {
    const data = await fetchData(params.id);
    return {
      title: data.title,
      description: data.description,
      canonical: `${process.env.BASE_URL}/${params.slug}`,
      openGraph: {
        title: data.title,
        description: data.description,
        images: `/images/${data.imageId}.jpg`
      },
      twitter: {
        title: data.title,
        description: data.description,
        card: "summary_large_image"
      }
    };
  }
  ```

## ۳. تنظیم Canonical URLs
- در هر صفحه، `canonical` را در `metadata` با URL کامل (شامل `BASE_URL`) تعریف کنید.
- برای صفحات paginated، canonical را به URL اصلی اشاره دهید.
- مثال: `canonical: "${process.env.BASE_URL}/users"`

## ۴. مدیریت Sitemap
- فایل `public/sitemap.xml` را ایجاد کنید.
- تمام URLهای اصلی (با canonical) را در sitemap لیست کنید.
- برای صفحات داینامیک، از تابع `generateSitemaps` استفاده کنید.
- مثال:
  ```typescript
  export async function generateSitemaps() {
    return [{ id: 0, urls: ["/", "/login", "/dashboard"] }];
  }
  ```

## ۵. مدیریت Robots.txt
- فایل `public/robots.txt` را ایجاد کنید.
- دستورات زیر را اضافه کنید:
  ```txt
  User-agent: *
  Allow: /
  Sitemap: ${process.env.BASE_URL}/sitemap.xml
  ```

## ۶. افزودن Structured Data
- برای هر صفحه مرتبط، JSON-LD را در `<script type="application/ld+json">` اضافه کنید.
- از نوع مناسب (مثل WebPage، Article) استفاده کنید.
- مثال:
  ```typescript
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "عنوان صفحه",
      "url": "${process.env.BASE_URL}/page-url"
    }
  </script>
  ```

## ۷. بهینه‌سازی تصاویر SEO
- تصاویر og:image را در `public/images/` ذخیره کنید.
- حجم تصاویر را به کمتر از 100KB بهینه کنید.
- ابعاد تصویر را 1200x630 پیکسل تنظیم کنید.
- مثال: `/images/og-image.jpg`

## ۸. استفاده از Helper برای Metadata
- فایل `lib/seo/helpers.ts` را ایجاد کنید.
- تابع `createPageMetadata` را با ورودی‌های `title`, `description`, `canonical`, `openGraph` تعریف کنید.
- مثال:
  ```typescript
  import { createPageMetadata } from '@/lib/seo/helpers';
  export const metadata = createPageMetadata({
    title: "عنوان صفحه",
    description: "توضیحات صفحه",
    canonical: `${process.env.BASE_URL}/page-url`,
    openGraph: { title: "عنوان OG", description: "توضیحات OG", images: "/images/og-image.jpg" }
  });
  ```

## ۹. بررسی SEO
- از Google Lighthouse برای تست SEO استفاده کنید:
  ```bash
  lighthouse ${process.env.BASE_URL} --view
  ```
- گزارش‌ها را در Google Search Console بررسی کنید.
- خطاهای crawl را برطرف کنید.

## ۱۰. نکات
- برای متغیرهای محیطی (مثل BASE_URL) به GENERAL_GUIDELINES.markdown مراجعه کنید.
- برای سازمان‌دهی فایل‌های استاتیک به GENERAL_GUIDELINES.markdown مراجعه کنید.
- برای مستندسازی تسک‌های مرتبط به TASK_DOCUMENTATION_GUIDELINES.markdown مراجعه کنید.
- برای اقدامات قبل و بعد از تسک به before_task.md و after_task.md مراجعه کنید.