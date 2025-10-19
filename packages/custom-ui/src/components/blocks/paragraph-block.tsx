"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { ParagraphBlock } from "../../types/content-blocks";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

import { FileText } from "lucide-react";
import RichTextEditor from "../rich-text-editor";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ParagraphBlockProps {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ParagraphBlockComponent({
  block,
  onChange,
  isEditing = false,
}: ParagraphBlockProps) {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleTextChange = (text: string) => {
    onChange({
      ...block,
      data: { ...block.data, text },
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
            <FileText className="h-4 w-4" />
            پاراگراف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RichTextEditor
            value={block.data.text || ""}
            onChange={(value) => {
              handleTextChange(value);
            }}
            className="min-h-[100px]"
            placeholder="متن پاراگراف را وارد کنید..."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <div
        className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: block.data.text }}
      />
    </div>
  );
}
