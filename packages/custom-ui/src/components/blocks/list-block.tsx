"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react"
import { ListBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { List, Plus, Trash2 } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ListBlockProps {
  block: ListBlock;
  onChange: (block: ListBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ListBlockComponent({ 
  block, 
  onChange, 
  isEditing = false 
}: ListBlockProps) {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const addItem = () => {
    const newItems = [...block.data.items, ''];
    onChange({
      ...block,
      data: { ...block.data, items: newItems }
    });
  };

  const removeItem = (index: number) => {
    const newItems = block.data.items.filter((_, i) => i !== index);
    onChange({
      ...block,
      data: { ...block.data, items: newItems }
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.data.items];
    newItems[index] = value;
    onChange({
      ...block,
      data: { ...block.data, items: newItems }
    });
  };

  const toggleOrdered = () => {
    onChange({
      ...block,
      data: { ...block.data, ordered: !block.data.ordered }
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
            <List className="h-4 w-4" />
            لیست
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">نوع لیست:</label>
            <Button
              variant={block.data.ordered ? "default" : "outline"}
              size="sm"
              onClick={toggleOrdered}
            >
              {block.data.ordered ? "شماره‌دار" : "نقطه‌ای"}
            </Button>
          </div>
          
          <div className="space-y-2">
            {block.data.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-6">
                  {block.data.ordered ? `${index + 1}.` : "•"}
                </span>
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`آیتم ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button onClick={addItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            افزودن آیتم جدید
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      {block.data.ordered ? (
        <ol className="list-decimal list-inside space-y-1">
          {block.data.items.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {block.data.items.map((item, index) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
