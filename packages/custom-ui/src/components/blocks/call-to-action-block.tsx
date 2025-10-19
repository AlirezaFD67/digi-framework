"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { CallToActionBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { MousePointerClick, FolderOpen } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface CallToActionBlockProps {
  block: CallToActionBlock;
  onChange: (block: CallToActionBlock) => void;
  isEditing?: boolean;
  articleId?: string;
  itemMedia?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function CallToActionBlockComponent({ 
  block, 
  onChange, 
  isEditing = false, 
  articleId 
}: CallToActionBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================


  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleImageChange = (image: string) => {
    onChange({
      ...block,
      data: { ...block.data, image }
    });
  };

  const handleTitleChange = (title: string) => {
    onChange({
      ...block,
      data: { ...block.data, title }
    });
  };

  const handleSubtitleChange = (subtitle: string) => {
    onChange({
      ...block,
      data: { ...block.data, subtitle }
    });
  };

  const handleButtonTextChange = (buttonText: string) => {
    onChange({
      ...block,
      data: { ...block.data, buttonText }
    });
  };

  const handleButtonLinkChange = (buttonLink: string) => {
    onChange({
      ...block,
      data: { ...block.data, buttonLink }
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
            <MousePointerClick className="h-4 w-4" />
            کال تو اکشن
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={block.data.image}
              onChange={(e) => handleImageChange(e.target.value)}
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
            value={block.data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="عنوان اصلی..."
            className="w-full"
          />
          <Input
            value={block.data.subtitle}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder="زیرعنوان..."
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              value={block.data.buttonText}
              onChange={(e) => handleButtonTextChange(e.target.value)}
              placeholder="متن دکمه..."
              className="flex-1"
            />
            <Input
              value={block.data.buttonLink}
              onChange={(e) => handleButtonLinkChange(e.target.value)}
              placeholder="لینک دکمه..."
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {block.data.image && (
            <div className="flex-shrink-0">
              <img 
                src={block.data.image} 
                alt={block.data.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {block.data.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {block.data.subtitle}
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open(block.data.buttonLink, '_blank')}
            >
              {block.data.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
