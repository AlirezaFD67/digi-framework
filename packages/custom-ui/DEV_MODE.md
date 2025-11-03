# Dev Mode - بدون نیاز به Build

این پکیج اکنون در حالت توسعه (Dev Mode) قرار دارد که نیازی به build کردن ندارد.

## تغییرات اعمال شده

### 1. تغییر در `package.json`
فیلد `exports` از اشاره به فایل‌های بیلد شده (`dist`) به فایل‌های سورس (`src`) تغییر کرد:

```json
{
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./components/*": {
      "types": "./src/components/*.tsx",
      "default": "./src/components/*.tsx"
    },
    "./auth/*": {
      "types": "./src/auth/*.tsx",
      "default": "./src/auth/*.tsx"
    },
    "./hooks/*": {
      "types": "./src/hooks/*.ts",
      "default": "./src/hooks/*.ts"
    }
  }
}
```

### 2. تنظیم Next.js
در فایل `next.config.ts` هر دو اپلیکیشن، پکیج‌ها در `transpilePackages` قرار گرفتند:

```typescript
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/custom-ui", "@workspace/framework"],
}
```

## مزایا

✅ **بدون Build**: نیازی به اجرای `pnpm build` برای پکیج `custom-ui` نیست  
✅ **تغییرات لحظه‌ای**: تغییرات در کد بلافاصله اعمال می‌شوند  
✅ **سرعت بالاتر در توسعه**: دیگر نیازی به منتظر ماندن برای build نیست  
✅ **کمتر خطا**: کد مستقیماً از سورس خوانده می‌شود  

## نحوه استفاده

### قبلاً (نیاز به Build):
```bash
# تغییر در custom-ui
cd packages/custom-ui
pnpm build

# سپس مشاهده تغییرات در app
cd ../../apps/digimoragheb
pnpm dev
```

### اکنون (بدون Build):
```bash
# فقط اجرای dev server
cd apps/digimoragheb
pnpm dev

# تغییرات در custom-ui بلافاصله اعمال می‌شوند!
```

## نکات مهم

1. **برای Production همچنان باید Build شود**:
   ```bash
   pnpm build
   ```

2. **پکیج‌های زیر در حالت Dev Mode هستند**:
   - `@workspace/custom-ui`
   - `@workspace/framework`
   - `@workspace/ui`

3. **اگر خطا دیدید**:
   - Next.js dev server را ریستارت کنید
   - Cache را پاک کنید: `rm -rf .next`
   - node_modules را دوباره نصب کنید: `pnpm install`

## بازگشت به حالت Build

اگر به هر دلیلی خواستید دوباره از فایل‌های build استفاده کنید:

1. در `package.json` پکیج، exports را به `dist` تغییر دهید
2. پکیج را build کنید: `pnpm build`
3. (اختیاری) پکیج را از `transpilePackages` در `next.config.ts` حذف کنید

