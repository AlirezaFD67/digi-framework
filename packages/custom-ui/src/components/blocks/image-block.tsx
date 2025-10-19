"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { ImageBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

import { Image, FolderOpen } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ImageBlockProps {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
  isEditing?: boolean;
  articleId?: string;
  itemMedia?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ImageBlockComponent({ 
  block, 
  onChange, 
  isEditing = false, 
  articleId, 
  itemMedia 
}: ImageBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================


  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUrlChange = (url: string) => {
    onChange({
      ...block,
      data: { ...block.data, url }
    });
  };

  const handleAltChange = (alt: string) => {
    onChange({
      ...block,
      data: { ...block.data, alt }
    });
  };

  const handleCaptionChange = (caption: string) => {
    onChange({
      ...block,
      data: { ...block.data, caption }
    });
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const buildImageUrl = () => {
    if (block.data.url.startsWith('http://') || block.data.url.startsWith('https://')) {
      return block.data.url
    }
    const filebase = process.env.NEXT_PUBLIC_FILEBASE || 'https://digicare24seven.com/'
    const finalUrl = `${filebase}${itemMedia}${block.data.url}`
    return finalUrl
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Image className="h-4 w-4" />
            تصویر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={block.data.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="لینک تصویر..."
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
          <Input
            value={block.data.alt}
            onChange={(e) => handleAltChange(e.target.value)}
            placeholder="توضیحات تصویر (alt)..."
            className="w-full"
          />
          <Input
            value={block.data.caption || ""}
            onChange={(e) => handleCaptionChange(e.target.value)}
            placeholder="عنوان تصویر (اختیاری)..."
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      {block.data.url ? (
        <div className="text-center">
          <img 
            src={buildImageUrl()}
            alt={block.data.alt}
            className="max-w-full h-auto rounded-lg mx-auto"
            style={{ maxHeight: '500px' }}
          />
          {block.data.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {block.data.caption}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">تصویر انتخاب نشده</p>
        </div>
      )}
    </div>
  );
}
