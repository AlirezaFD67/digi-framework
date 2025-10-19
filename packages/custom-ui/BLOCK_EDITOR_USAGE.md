# 📝 Block Editor - راهنمای استفاده

Block Editor یک ویرایشگر محتوای پیشرفته بر اساس بلوک است که امکان ایجاد محتوای غنی و منعطف را فراهم می‌کند.

## 📦 نصب و Import

### نصب Dependencies

```bash
pnpm add styled-jsx
```

### Import کردن

```typescript
// Main BlockEditor
import { BlockEditor } from "@workspace/custom-ui";

// Individual Blocks (optional)
import {
  HeadingBlock,
  ParagraphBlock,
  VideoBlock,
  ImageBlock,
  // ... other blocks
} from "@workspace/custom-ui";

// Types
import type {
  ContentBlock,
  ContentBlockType,
  HeadingBlockType,
  ParagraphBlockType,
  // ... other types
} from "@workspace/custom-ui";

// RichTextEditor (جداگانه به دلیل styled-jsx)
import RichTextEditor from "@workspace/custom-ui/dist/components/rich-text-editor/rich-text-editor";
```

## 🎯 استفاده اولیه

### مثال ساده

```typescript
"use client";

import { useState } from "react";
import { BlockEditor } from "@workspace/custom-ui";
import type { ContentBlock } from "@workspace/custom-ui";

export default function MyArticleEditor() {
  const [content, setContent] = useState<ContentBlock[]>([]);

  const handleSave = async (blocks: ContentBlock[]) => {
    const contentJson = JSON.stringify(blocks);
    
    // ذخیره در API
    await fetch('/api/articles/123/content', {
      method: 'POST',
      body: JSON.stringify({ itmDesc: contentJson }),
    });
  };

  return (
    <BlockEditor
      content={content}
      onChange={setContent}
      onSave={handleSave}
      articleId="123"
    />
  );
}
```

## 🔧 Props

### BlockEditor Props

```typescript
interface BlockEditorProps {
  content: ContentBlock[];                    // آرایه بلوک‌های محتوا
  onChange: (content: ContentBlock[]) => void; // callback تغییر محتوا
  onSave?: (content: ContentBlock[]) => Promise<void>; // callback ذخیره
  articleId?: string;                         // شناسه مقاله
  itemMedia?: string;                         // URL رسانه اصلی
  isLoading?: boolean;                        // وضعیت loading
  renderFileSelector?: (                      // رندر file selector سفارشی
    articleId: string, 
    onSelect: (url: string) => void
  ) => React.ReactNode;
}
```

### مثال کامل

```typescript
import { BlockEditor } from "@workspace/custom-ui";
import { useSaveArticleContent } from "@workspace/framework";

export default function ArticleContentTab({ articleId }: { articleId: string }) {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const saveContentMutation = useSaveArticleContent();

  // بارگذاری محتوای موجود
  useEffect(() => {
    const loadContent = async () => {
      const response = await fetch(`/api/articles/${articleId}/content`);
      const data = await response.json();
      
      if (data.itmDesc) {
        try {
          const parsed = JSON.parse(data.itmDesc);
          setContent(Array.isArray(parsed) ? parsed : []);
        } catch {
          setContent([]);
        }
      }
    };
    
    if (articleId) loadContent();
  }, [articleId]);

  // ذخیره محتوا
  const handleSave = async (blocks: ContentBlock[]) => {
    const contentJson = JSON.stringify(blocks);
    
    await saveContentMutation.mutateAsync({
      itmID: articleId,
      itmDesc: contentJson,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <BlockEditor
        content={content}
        onChange={setContent}
        onSave={handleSave}
        articleId={articleId}
        isLoading={saveContentMutation.isPending}
      />
    </div>
  );
}
```

## 🧱 انواع بلوک‌ها

### 1. Heading Block (عنوان)

```typescript
interface HeadingBlock {
  id: string;
  type: 'heading';
  order: number;
  data: {
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    content: string;
  };
}
```

**استفاده:**
- عنوان اصلی مقاله (H1)
- عنوان بخش‌ها (H2, H3)
- زیرعنوان‌ها (H4, H5, H6)

### 2. Paragraph Block (پاراگراف)

```typescript
interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  order: number;
  data: {
    content: string; // HTML content با فرمت‌بندی
  };
}
```

**ویژگی‌ها:**
- Rich text editing با RichTextEditor
- پشتیبانی از Bold, Italic, Underline
- لینک‌ها و فرمت‌های متن

### 3. Video Block (ویدیو)

```typescript
interface VideoBlock {
  id: string;
  type: 'video';
  order: number;
  data: {
    url: string;           // URL ویدیو
    title: string;         // عنوان ویدیو
    description: string;   // توضیحات
    platform: 'youtube' | 'vimeo' | 'aparat' | 'custom';
  };
}
```

**پلتفرم‌های پشتیبانی شده:**
- YouTube
- Vimeo
- آپارات
- Custom (فایل مستقیم)

### 4. Image Block (تصویر)

```typescript
interface ImageBlock {
  id: string;
  type: 'image';
  order: number;
  data: {
    url: string;       // URL تصویر
    alt: string;       // متن جایگزین
    caption: string;   // توضیحات تصویر
  };
}
```

### 5. Call-to-Action Block (دعوت به اقدام)

```typescript
interface CallToActionBlock {
  id: string;
  type: 'call-to-action';
  order: number;
  data: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
  };
}
```

### 6. Quote Block (نقل‌قول)

```typescript
interface QuoteBlock {
  id: string;
  type: 'quote';
  order: number;
  data: {
    content: string;
    author: string;
    source: string;
  };
}
```

### 7. Table Block (جدول)

```typescript
interface TableBlock {
  id: string;
  type: 'table';
  order: number;
  data: {
    headers: string[];
    rows: string[][];
  };
}
```

### 8. FAQ Block (سوالات متداول)

```typescript
interface FAQBlock {
  id: string;
  type: 'faq';
  order: number;
  data: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
}
```

### 9. Audio Block (صوت)

```typescript
interface AudioBlock {
  id: string;
  type: 'audio';
  order: number;
  data: {
    url: string;
    title: string;
    description: string;
  };
}
```

### 10. Map Block (نقشه)

```typescript
interface MapBlock {
  id: string;
  type: 'map';
  order: number;
  data: {
    latitude: number;
    longitude: number;
    zoom: number;
    title: string;
  };
}
```

### 11. List Block (لیست)

```typescript
interface ListBlock {
  id: string;
  type: 'list';
  order: number;
  data: {
    listType: 'ordered' | 'unordered';
    items: string[];
  };
}
```

### 12. References Block (منابع)

```typescript
interface ReferencesBlock {
  id: string;
  type: 'references';
  order: number;
  data: {
    references: Array<{
      title: string;
      url: string;
      author: string;
    }>;
  };
}
```

### 13. Table of Contents Block (فهرست مطالب)

```typescript
interface TableOfContentsBlock {
  id: string;
  type: 'table-of-contents';
  order: number;
  data: {
    items: Array<{
      title: string;
      id: string;
      type: 'h2' | 'h3';
    }>;
  };
}
```

## 🎨 سفارشی‌سازی

### استفاده از File Selector سفارشی

```typescript
<BlockEditor
  content={content}
  onChange={setContent}
  renderFileSelector={(articleId, onSelect) => (
    <MyCustomFileSelector
      articleId={articleId}
      onFileSelect={(file) => onSelect(file.url)}
    />
  )}
/>
```

### تنظیم Theme و Styling

BlockEditor از Tailwind CSS استفاده می‌کند. می‌توانید کلاس‌های CSS خود را override کنید:

```css
/* در فایل CSS global */
.block-editor-container {
  /* سفارشی‌سازی container */
}

.block-item {
  /* سفارشی‌سازی هر بلوک */
}
```

## 📊 مدیریت State

### Local Storage (پیشنهادی برای Draft)

```typescript
import { useEffect } from "react";

export default function ArticleEditor({ articleId }: { articleId: string }) {
  const [content, setContent] = useState<ContentBlock[]>(() => {
    // بارگذاری از localStorage
    const saved = localStorage.getItem(`article:${articleId}:draft`);
    return saved ? JSON.parse(saved) : [];
  });

  // ذخیره خودکار در localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`article:${articleId}:draft`, JSON.stringify(content));
    }, 1000); // debounce 1 second

    return () => clearTimeout(timer);
  }, [content, articleId]);

  return (
    <BlockEditor
      content={content}
      onChange={setContent}
      articleId={articleId}
    />
  );
}
```

### با React Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

export default function ArticleEditor({ articleId }: { articleId: string }) {
  // بارگذاری محتوا
  const { data } = useQuery({
    queryKey: ['article-content', articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}/content`);
      const data = await response.json();
      return data.itmDesc ? JSON.parse(data.itmDesc) : [];
    },
  });

  const [content, setContent] = useState<ContentBlock[]>(data || []);

  // ذخیره محتوا
  const saveMutation = useMutation({
    mutationFn: async (blocks: ContentBlock[]) => {
      await fetch(`/api/articles/${articleId}/content`, {
        method: 'POST',
        body: JSON.stringify({ itmDesc: JSON.stringify(blocks) }),
      });
    },
  });

  return (
    <BlockEditor
      content={content}
      onChange={setContent}
      onSave={(blocks) => saveMutation.mutateAsync(blocks)}
      isLoading={saveMutation.isPending}
    />
  );
}
```

## 🔍 Scroll Restoration

```typescript
useEffect(() => {
  // بازیابی scroll position
  const savedScroll = sessionStorage.getItem(`article:${articleId}:scroll`);
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll, 10));
  }

  // ذخیره scroll position قبل از unmount
  return () => {
    sessionStorage.setItem(`article:${articleId}:scroll`, String(window.scrollY));
  };
}, [articleId]);
```

## ⚡ بهینه‌سازی عملکرد

### Lazy Loading برای بلوک‌های سنگین

```typescript
import dynamic from 'next/dynamic';

const BlockEditor = dynamic(() => import('@workspace/custom-ui').then(mod => mod.BlockEditor), {
  ssr: false,
  loading: () => <div>در حال بارگذاری ویرایشگر...</div>
});
```

### Debounce برای onChange

```typescript
import { useDebounce } from "@workspace/custom-ui";

export default function ArticleEditor() {
  const [content, setContent] = useState<ContentBlock[]>([]);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    // Auto-save با debounce
    if (debouncedContent.length > 0) {
      localStorage.setItem('draft', JSON.stringify(debouncedContent));
    }
  }, [debouncedContent]);

  return <BlockEditor content={content} onChange={setContent} />;
}
```

## 🐛 رفع مشکلات رایج

### مشکل 1: بلوک‌ها رندر نمی‌شوند

**علت:** محتوای JSON به درستی parse نشده.

**راه‌حل:**
```typescript
try {
  const parsed = JSON.parse(contentJson);
  setContent(Array.isArray(parsed) ? parsed : []);
} catch (error) {
  console.error('Failed to parse content:', error);
  setContent([]);
}
```

### مشکل 2: RichTextEditor import error

**علت:** RichTextEditor از export اصلی custom-ui حذف شده.

**راه‌حل:**
```typescript
// ❌ این کار نمی‌کند
import { RichTextEditor } from "@workspace/custom-ui";

// ✅ این کار می‌کند
import RichTextEditor from "@workspace/custom-ui/dist/components/rich-text-editor/rich-text-editor";
```

### مشکل 3: TypeScript errors برای styled-jsx

**علت:** styled-jsx نیاز به تنظیمات خاص TypeScript دارد.

**راه‌حل:** این مشکل در build time است و روی runtime تأثیری ندارد.

### مشکل 4: File upload در بلوک‌ها کار نمی‌کند

**علت:** File selector context موجود نیست.

**راه‌حل:**
```typescript
<BlockEditor
  renderFileSelector={(articleId, onSelect) => (
    <YourFileSelectorModal
      articleId={articleId}
      onSelect={onSelect}
    />
  )}
/>
```

## 📝 مثال کامل Production

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { BlockEditor } from "@workspace/custom-ui";
import { useSaveArticleContent } from "@workspace/framework";
import type { ContentBlock } from "@workspace/custom-ui";

interface ArticleContentEditorProps {
  articleId: string;
  initialContent?: string;
  onSaveSuccess?: () => void;
}

export default function ArticleContentEditor({
  articleId,
  initialContent,
  onSaveSuccess,
}: ArticleContentEditorProps) {
  // Parse initial content
  const [content, setContent] = useState<ContentBlock[]>(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        `article:${articleId}:draft`,
        JSON.stringify(content)
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, articleId]);

  // Save mutation
  const saveContentMutation = useSaveArticleContent();

  // Save handler
  const handleSave = useCallback(
    async (blocks: ContentBlock[]) => {
      try {
        const contentJson = JSON.stringify(blocks);

        await saveContentMutation.mutateAsync({
          itmID: articleId,
          itmDesc: contentJson,
        });

        // Clear draft on successful save
        localStorage.removeItem(`article:${articleId}:draft`);

        onSaveSuccess?.();
      } catch (error) {
        console.error("Failed to save content:", error);
        throw error;
      }
    },
    [articleId, saveContentMutation, onSaveSuccess]
  );

  // Scroll restoration
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(
      `article:${articleId}:editor:scroll`
    );
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }

    return () => {
      sessionStorage.setItem(
        `article:${articleId}:editor:scroll`,
        String(window.scrollY)
      );
    };
  }, [articleId]);

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <BlockEditor
        content={content}
        onChange={setContent}
        onSave={handleSave}
        articleId={articleId}
        isLoading={saveContentMutation.isPending}
      />
    </div>
  );
}
```

## 📚 منابع بیشتر

- [Article Management README](../../apps/admin-panel/src/app/(dashboard)/article/README.md)
- [Framework Package](../framework/README.md)
- [Custom UI Components](./README.md)

---

**نسخه:** 1.0.0  
**وضعیت:** ✅ Production Ready

