"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "lucide-react";

import { HeadingBlock } from "../../types/content-blocks";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface HeadingBlockProps {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const headingIcons = {
  1: <Heading1 className="h-4 w-4" />,
  2: <Heading2 className="h-4 w-4" />,
  3: <Heading3 className="h-4 w-4" />,
  4: <Heading4 className="h-4 w-4" />,
  5: <Heading5 className="h-4 w-4" />,
  6: <Heading6 className="h-4 w-4" />,
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function HeadingBlockComponent({
  block,
  onChange,
  isEditing = false,
}: HeadingBlockProps) {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleLevelChange = (level: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        level: parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6,
      },
    });
  };

  const handleTextChange = (text: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        text,
      },
    });
  };

  const handleIdChange = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        id,
      },
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
            {headingIcons[block.data.level]}
            عنوان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Select
              value={block.data.level.toString()}
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.data.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="عنوان را وارد کنید..."
              className="flex-1"
            />
          </div>
          <Input
            value={block.data.id || ''}
            onChange={(e) => handleIdChange(e.target.value)}
            placeholder="شناسه منحصر به فرد (اختیاری)..."
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  }

  const HeadingTag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;

  return (
    <div className="mb-4">
      <HeadingTag 
        className="font-bold text-gray-900 dark:text-gray-100"
        id={block.data.id}
      >
        {block.data.text}
      </HeadingTag>
    </div>
  );
}
