"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react"
import { TableBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { Table, Palette } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TableBlockProps {
  block: TableBlock;
  onChange: (block: TableBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function TableBlockComponent({ 
  block, 
  onChange, 
  isEditing = false 
}: TableBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [localData, setLocalData] = useState(block.data);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleRowsChange = (rows: number) => {
    const newData = {
      ...localData,
      rows,
      data: Array(rows).fill(null).map((_, i) => 
        localData.data[i] || Array(localData.columns).fill('')
      )
    };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  const handleColumnsChange = (columns: number) => {
    const newData = {
      ...localData,
      columns,
      headers: localData.headers.slice(0, columns),
      data: localData.data.map(row => row.slice(0, columns))
    };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...localData.headers];
    newHeaders[index] = value;
    const newData = { ...localData, headers: newHeaders };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...localData.data];
    if (!newData[rowIndex]) newData[rowIndex] = [];
    newData[rowIndex][colIndex] = value;
    const updatedData = { ...localData, data: newData };
    setLocalData(updatedData);
    onChange({ ...block, data: updatedData });
  };

  const handleDescriptionChange = (description: string) => {
    const newData = { ...localData, description };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  const handleDescriptionLinkChange = (descriptionLink: string) => {
    const newData = { ...localData, descriptionLink };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  const handleHeaderColorChange = (color: string) => {
    const newData = { ...localData, headerColor: color };
    setLocalData(newData);
    onChange({ ...block, data: newData });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Table className="h-4 w-4" />
            جدول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">تعداد سطر</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={localData.rows}
                onChange={(e) => handleRowsChange(parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">تعداد ستون</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={localData.columns}
                onChange={(e) => handleColumnsChange(parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              رنگ عنوان ستون‌ها
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={localData.headerColor || '#f3f4f6'}
                onChange={(e) => handleHeaderColorChange(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {localData.headerColor || 'پیش‌فرض'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">عنوان ستون‌ها</label>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${localData.columns}, 1fr)` }}>
              {Array.from({ length: localData.columns }).map((_, index) => (
                <Input
                  key={index}
                  value={localData.headers[index] || ''}
                  onChange={(e) => handleHeaderChange(index, e.target.value)}
                  placeholder={`ستون ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2">داده‌های جدول</label>
            <div className="border rounded-lg overflow-hidden">
              {Array.from({ length: localData.rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid border-b last:border-b-0" 
                     style={{ gridTemplateColumns: `repeat(${localData.columns}, 1fr)` }}>
                  {Array.from({ length: localData.columns }).map((_, colIndex) => (
                    <Input
                      key={colIndex}
                      value={localData.data[rowIndex]?.[colIndex] || ''}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="border-0 rounded-none focus:ring-0"
                      placeholder=""
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              value={localData.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="توضیحات جدول (اختیاری)..."
            />
            <Input
              value={localData.descriptionLink || ''}
              onChange={(e) => handleDescriptionLinkChange(e.target.value)}
              placeholder="لینک توضیحات (اختیاری)..."
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const headerStyle = localData.headerColor ? { backgroundColor: localData.headerColor } : {};
  
  return (
    <div className="mb-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr style={headerStyle}>
              {localData.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localData.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {(localData.description || localData.descriptionLink) && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {localData.description && <p>{localData.description}</p>}
          {localData.descriptionLink && (
            <a 
              href={localData.descriptionLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              مشاهده منبع →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
