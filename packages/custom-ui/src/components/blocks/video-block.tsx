"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { VideoBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import { Play, FolderOpen } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type VideoSource = 'internal' | 'aparat' | '';

interface VideoBlockProps {
  block: VideoBlock;
  onChange: (block: VideoBlock) => void;
  isEditing?: boolean;
  articleId?: string;
  itemMedia?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function VideoBlockComponent({
  block,
  onChange,
  isEditing = false,
  articleId,
  itemMedia,
}: VideoBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================


  // منبع ویدیو - پیشفرض آپارات
  const currentSource: VideoSource = (block.data as any).source || 'aparat';

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUrlChange = (url: string) => {
    onChange({
      ...block,
      data: { ...block.data, url }
    });
  };


  const handleSourceChange = (source: VideoSource) => {
    onChange({
      ...block,
      data: { ...block.data, source } as any
    });
  };

  const handleDescriptionChange = (description: string) => {
    onChange({
      ...block,
      data: { ...block.data, description }
    });
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const buildVideoUrl = () => {
    const source = currentSource;

    if (source === 'aparat') {
      // برای آپارات: اگر کد iframe باشد، آن را برمی‌گردانیم
      // اگر URL ساده باشد، آن را هم برمی‌گردانیم
      return block.data.url;
    } else {
      // برای فایل داخلی
      if (
        block.data.url.startsWith("http://") ||
        block.data.url.startsWith("https://")
      ) {
        return block.data.url;
      }
      const filebase =
        process.env.NEXT_PUBLIC_FILEBASE || "https://digicare24seven.com/";
      const finalUrl = `${filebase}${itemMedia}${block.data.url}`;
      return finalUrl;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Play className="h-4 w-4" />
            ویدیو
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* منبع ویدیو */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">منبع ویدیو</Label>
            <RadioGroup dir="rtl"
              value={currentSource}
              onValueChange={handleSourceChange}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="aparat" id="aparat" />
                <Label htmlFor="aparat" className="text-sm cursor-pointer">
                  آپارات
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal" className="text-sm cursor-pointer">
                  داخلی
                </Label>
              </div>
            </RadioGroup>
          </div>

          {currentSource === 'aparat' ? (
            <Textarea
              value={block.data.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="کد iframe ویدیو از آپارات را وارد کنید..."
              className="w-full min-h-[100px]"
              rows={4}
            />
          ) : (
            <div className="flex gap-2">
              <Input
                value={block.data.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="نام فایل ویدیو داخلی را وارد کنید..."
                className="flex-1"
              />
              {articleId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={true} title="File selector not available"
                  className="shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">توضیحات ویدیو</Label>
            <Textarea
              value={block.data.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="توضیحات ویدیو را وارد کنید..."
              className="w-full min-h-[80px]"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      {block.data.url ? (
        <div className="text-center">
          {currentSource === 'aparat' && block.data.url.includes('<iframe') ? (
            // نمایش کد iframe آپارات
            <div
              className="w-full"
              dangerouslySetInnerHTML={{ __html: block.data.url }}
            />
          ) : (
            // نمایش ویدیو داخلی یا URL ساده آپارات
            <video
              src={buildVideoUrl()}
              controls
              className="w-full rounded-lg mx-auto"
              style={{ maxHeight: "600px" }}
            />
          )}
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-500">ویدیو انتخاب نشده</p>
        </div>
      )}
      {block.data.description && (
        <div
          className="text-gray-600 dark:text-gray-400 text-sm prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: block.data.description }}
        />
      )}
    </div>
  );
}
