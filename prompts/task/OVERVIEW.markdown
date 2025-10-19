# نمای کلی داکیومنت‌های Monorepo

این فایل معرفی‌کننده تمامی داکیومنت‌های راهنما در **Monorepo** مبتنی بر Next.js، Turborepo و pnpm است. هر داکیومنت به یک حوزه خاص اختصاص دارد و باید بر اساس نیاز مطالعه شود.

## ساختار Monorepo
```
digi-framework/
├── apps/              # اپلیکیشن‌های Next.js
│   ├── admin-panel/
│   ├── application-expert/
│   └── docs/
├── packages/          # پکیج‌های مشترک
│   ├── framework/     # API Management
│   ├── custom-ui/     # کامپوننت‌های گلوبال
│   ├── ui/            # shadcn/ui components
│   ├── eslint-config/
│   └── typescript-config/
└── prompts/task/      # این داکیومنت‌ها
```

از این فایل برای پیدا کردن سریع راهنمایی‌های مورد نیاز استفاده کنید.

## لیست داکیومنت‌ها

### مراحل قبل و بعد از تسک
- **[before_task.markdown](before_task.markdown)**: چک‌لیست اقدامات قبل از شروع هر تسک. **اولین فایلی که قبل از هر تسک مطالعه کن**.
- **[after_task.markdown](after_task.markdown)**: چک‌لیست اقدامات بعد از پایان تسک. **بعد از کامل شدن تسک، این فایل رو بررسی کن**.
- **[before_update.markdown](before_update.markdown)**: چک‌لیست قبل از آپدیت تسک.
- **[after_update.markdown](after_update.markdown)**: چک‌لیست بعد از آپدیت تسک.

### راهنمایی‌های فنی
- **[API_GUIDELINES.markdown](API_GUIDELINES.markdown)**: نحوه اتصال به API و استفاده از `@workspace/framework`.
- **[API_DOCUMENTATION.markdown](API_DOCUMENTATION.markdown)**: قالب مستندسازی endpointهای API.
- **[ARCHITECTURE.markdown](ARCHITECTURE.markdown)**: معماری Monorepo و ساختار workspace.
- **[AUTH_GUIDELINES.markdown](AUTH_GUIDELINES.markdown)**: احراز هویت با `@workspace/custom-ui` و `@workspace/framework`.
- **[CODING_GUIDELINES.markdown](CODING_GUIDELINES.markdown)**: نام‌گذاری، محل فایل‌ها در Monorepo، workspace packages.
- **[COMPONENT_GUIDELINES.markdown](COMPONENT_GUIDELINES.markdown)**: کامپوننت‌های `@workspace/ui` و `@workspace/custom-ui`.
- **[GENERAL_GUIDELINES.markdown](GENERAL_GUIDELINES.markdown)**: نصب پکیج‌ها با pnpm workspace، تنظیمات.
- **[PERFORMANCE_GUIDELINES.markdown](PERFORMANCE_GUIDELINES.markdown)**: بهینه‌سازی عملکرد در Monorepo.
- **[SEO_GUIDELINES.markdown](SEO_GUIDELINES.markdown)**: بهینه‌سازی SEO برای هر اپلیکیشن.
- **[TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown)**: تست‌نویسی در Monorepo با Vitest و MSW.
- **[COMPLETE_TESTING_GUIDE.markdown](COMPLETE_TESTING_GUIDE.markdown)**: ⭐ راهنمای کامل تست‌نویسی بعد از هر تسک.

### مستندسازی
- **[TASK_DOCUMENTATION_GUIDELINES.markdown](TASK_DOCUMENTATION_GUIDELINES.markdown)**: قالب مستندسازی تسک‌ها و آپدیت‌ها.

## نکات کلی
- **ترتیب مطالعه**: همیشه از `before_task.markdown` شروع کن، سپس داکیومنت‌های مرتبط با حوزه تسک رو مطالعه کن، و در پایان `after_task.markdown` رو بررسی کن.
- **ارجاع متقابل**: هر داکیومنت به بقیه ارجاع می‌ده – دنبال لینک‌ها برو تا کامل بفهمی.
- **به‌روزرسانی**: اگر پیشنهادی برای بهبود داری، با تیم مشورت کن.
- **استفاده از TOC**: هر داکیومنت حالا فهرست محتوا (TOC) در ابتدای فایل داره برای دسترسی سریع.

## سوالات رایج (FAQ)
- **چرا کامپوننت‌های استاندارد اجباری هستن؟** برای یکپارچگی و جلوگیری از نصب پکیج‌های غیرضروری.
- **اگر تسک جدید نیاز به کامپوننت جدید داره؟** به `COMPONENT_GUIDELINES.markdown` مراجعه کن و کامپوننت رو به لیست اضافه کن.
- **چطور پوشش تست رو بررسی کنم؟** از دستور `pnpm jest --coverage` استفاده کن.

اگر سؤالی داری، این فایل رو چک کن یا با تیم ارتباط بگیر.
