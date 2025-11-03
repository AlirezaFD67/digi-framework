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
    "./types": {
      "types": "./src/types/index.ts",
      "default": "./src/types/index.ts"
    },
    "./utils": {
      "types": "./src/utils/index.ts",
      "default": "./src/utils/index.ts"
    },
    "./providers": {
      "types": "./src/providers/index.ts",
      "default": "./src/providers/index.ts"
    }
  }
}
```

### 2. تنظیم Next.js
در فایل `next.config.ts` هر دو اپلیکیشن، پکیج در `transpilePackages` قرار گرفت:

```typescript
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/custom-ui", "@workspace/framework"],
}
```

## مزایا

✅ **بدون Build**: نیازی به اجرای `pnpm build` برای پکیج `framework` نیست  
✅ **تغییرات لحظه‌ای**: تغییرات در API routes و utilities بلافاصله اعمال می‌شوند  
✅ **سرعت بالاتر در توسعه**: دیگر نیازی به منتظر ماندن برای build نیست  
✅ **Debugging آسان‌تر**: می‌توانید مستقیماً کد TypeScript را دیباگ کنید  

## نحوه استفاده

### قبلاً (نیاز به Build):
```bash
# تغییر در framework
cd packages/framework
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

# تغییرات در framework بلافاصله اعمال می‌شوند!
```

## مثال: اضافه کردن یک Endpoint جدید

```typescript
// packages/framework/src/routes/your-new-route.ts
import { apiGet, apiPost } from "../utils/api-http";

export const getYourData = () => apiGet<YourType>("/your-endpoint");
export const createYourData = (data: YourType) => apiPost<YourType>("/your-endpoint", data);

// تغییرات بلافاصله در app قابل استفاده هستند، بدون build!
```

## نکات مهم

1. **برای Production همچنان باید Build شود**:
   ```bash
   pnpm build
   ```

2. **اگر خطا دیدید**:
   - Next.js dev server را ریستارت کنید
   - Cache را پاک کنید: `rm -rf .next`
   - node_modules را دوباره نصب کنید: `pnpm install`

3. **Type Safety**: تمام type checking در زمان توسعه فعال است

## بازگشت به حالت Build

اگر به هر دلیلی خواستید دوباره از فایل‌های build استفاده کنید:

1. در `package.json` پکیج، exports را به `dist` تغییر دهید
2. پکیج را build کنید: `pnpm build`
3. (اختیاری) پکیج را از `transpilePackages` در `next.config.ts` حذف کنید

