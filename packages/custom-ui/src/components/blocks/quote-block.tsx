"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { QuoteBlock } from "../../types/content-blocks";

import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import RichTextEditor from "../rich-text-editor";

import { Quote } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface QuoteBlockProps {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function QuoteBlockComponent({
  block,
  onChange,
  isEditing = false,
}: QuoteBlockProps) {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleEnglishTextChange = (englishText: string) => {
    onChange({
      ...block,
      data: { ...block.data, englishText },
    });
  };

  const handlePersianTextChange = (persianText: string) => {
    onChange({
      ...block,
      data: { ...block.data, persianText },
    });
  };

  const handleReferenceLinkChange = (referenceLink: string) => {
    onChange({
      ...block,
      data: { ...block.data, referenceLink },
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Quote className="h-4 w-4" />
            نقل قول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              متن انگلیسی
            </label>
            <RichTextEditor
              value={block.data.englishText}
              onChange={handleEnglishTextChange}
              placeholder="متن انگلیسی را وارد کنید..."
              className="min-h-[100px]"
            />
          </div>
            <label className="text-sm font-medium mb-1 block">
              ترجمه فارسی
            </label>
            <RichTextEditor
              value={block.data.persianText}
              onChange={handlePersianTextChange}
              placeholder="ترجمه فارسی را وارد کنید..."
              className="min-h-[100px]"
            />
          </div>
         

          <Input
            value={block.data.referenceLink}
            onChange={(e) => handleReferenceLinkChange(e.target.value)}
            placeholder="لینک منبع (اختیاری)..."
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <blockquote className="border-r-4 border-blue-500 pr-4 py-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="mb-3">
          <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
            متن انگلیسی:
          </p>
          <div
            className="text-gray-700 dark:text-gray-300 italic text-lg prose prose-sm max-w-none text-right [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:relative [&_li]:pl-4 [&_ul_li::before]:absolute [&_ul_li::before]:left-0 [&_ol_li::before]:absolute [&_ol_li::before]:left-0"
            style={{ direction: 'ltr' }}
            dangerouslySetInnerHTML={{ __html: block.data.englishText }}
          />
        </div>
        <div className="mb-3">
          <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
            ترجمه فارسی:
          </p>
          <div
            className="text-gray-600 dark:text-gray-400 prose prose-sm max-w-none [&_ul]:pr-6 [&_ol]:pr-6 [&_li]:relative [&_li]:pr-4 [&_ul_li::before]:absolute [&_ul_li::before]:right-0 [&_ol_li::before]:absolute [&_ol_li::before]:right-0"
            style={{ direction: 'rtl', textAlign: 'right' }}
            dangerouslySetInnerHTML={{ __html: block.data.persianText }}
          />
        </div>
        {block.data.referenceLink && (
          <div className="text-sm mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
            <a
              href={block.data.referenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              منبع نقل قول →
            </a>
          </div>
        )}
      </blockquote>
    </div>
  );
}
