"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { List, Plus, Trash2 } from "lucide-react";

import { TableOfContentsBlock } from "../../types/content-blocks";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import DragHandle from "../block-editor/drag-handle";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TableOfContentsBlockProps {
  block: TableOfContentsBlock;
  onChange: (block: TableOfContentsBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TableOfContentsBlockComponent({
  block,
  onChange,
  isEditing = false,
}: TableOfContentsBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const addItem = (insertIndex?: number) => {
    const newItem = {
      title: "",
      id: "",
      type: "h2" as const,
    };

    const newItems = [...block.data.items];
    
    // اگر index مشخص شده، در آن موقعیت اضافه کن، وگرنه در انتها
    if (insertIndex !== undefined) {
      newItems.splice(insertIndex, 0, newItem);
    } else {
      newItems.push(newItem);
    }

    onChange({
      ...block,
      data: {
        ...block.data,
        items: newItems,
      },
    });
  };

  const removeItem = (index: number) => {
    const newItems = block.data.items.filter((_, i) => i !== index);
    onChange({
      ...block,
      data: {
        ...block.data,
        items: newItems,
      },
    });
  };

  const updateItem = (index: number, field: "title" | "id" | "type", value: string) => {
    const newItems = [...block.data.items];
    const currentItem = newItems[index];
    if (!currentItem) return;
    newItems[index] = {
      ...currentItem,
      [field]: value,
    };

    onChange({
      ...block,
      data: {
        ...block.data,
        items: newItems,
      },
    });
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...block.data.items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    if (!movedItem) return;
    newItems.splice(toIndex, 0, movedItem);

    onChange({
      ...block,
      data: {
        ...block.data,
        items: newItems,
      },
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItemIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverItemIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex !== null && draggedItemIndex !== dropIndex) {
      moveItem(draggedItemIndex, dropIndex);
    }
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
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
            فهرست مطالب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            {block.data.items.map((item, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 space-y-3 transition-all duration-200 ${
                  draggedItemIndex === index ? 'opacity-50 scale-95 rotate-2' : ''
                } ${
                  dragOverItemIndex === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg' : 'border-gray-200 dark:border-gray-700'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {/* Drag Handle Component */}
                    <DragHandle className="!p-1 !bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700" />

                    <Label className="text-sm">نوع هدینگ:</Label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Label htmlFor={`type-h3-${index}`} className="text-sm">H3</Label>
                      <Switch
                        id={`type-h3-${index}`}
                        checked={item.type === "h3"}
                        onCheckedChange={(checked) => updateItem(index, "type", checked ? "h3" : "h2")}
                      />
                      <Label htmlFor={`type-h3-${index}`} className="text-sm">H2</Label>
                    </div>
                  </div>
                  
                  {/* دکمه‌های افزودن و حذف */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(index + 1)}
                      className="bg-orange-300 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
                      title="افزودن آیتم جدید در پایین"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      title="حذف آیتم"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="عنوان آیتم..."
                    className="w-full"
                  />
                  <Input
                    value={item.id}
                    onChange={(e) => updateItem(index, "id", e.target.value)}
                    placeholder="شناسه منحصر به فرد..."
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* دکمه افزودن در انتها یا اولین آیتم */}
          <Button 
            variant="outline" 
            onClick={() => addItem()} 
            className="w-full !bg-orange-300"
          >
            <Plus className="h-4 w-4 mr-2 " />
            {block.data.items.length === 0 ? 'افزودن اولین آیتم' : 'افزودن آیتم در انتها'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        فهرست مطالب
      </h2>
      {block.data.items.length > 0 ? (
        <div className="space-y-2">
          {block.data.items.map((item, index) => {
            const HeadingTag = item.type === "h2" ? "h2" : "h3";
            const headingClass = item.type === "h2"
              ? "text-lg font-semibold"
              : "text-base font-medium";

            return (
              <div key={index} className="border-l-2 border-blue-200 pl-3">
                <HeadingTag className={`${headingClass} text-gray-900 dark:text-gray-100 mb-1`}>
                  <a
                    href={`#${item.id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    {item.title || `آیتم ${index + 1}`}
                  </a>
                </HeadingTag>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          هیچ آیتمی در فهرست وجود ندارد
        </p>
      )}
    </div>
  );
}
