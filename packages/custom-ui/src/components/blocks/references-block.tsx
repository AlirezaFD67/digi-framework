"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react"
import { ReferencesBlock } from "../../types/content-blocks"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { Plus, Trash2, ExternalLink } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ReferencesBlockComponentProps {
  block: ReferencesBlock;
  onChange: (block: ReferencesBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ReferencesBlockComponent({ 
  block, 
  onChange, 
  isEditing = false 
}: ReferencesBlockComponentProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [newReference, setNewReference] = useState({ title: '', url: '' })

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleTitleChange = (title: string) => {
    onChange({
      ...block,
      data: { ...block.data, title }
    })
  }

  const addReference = () => {
    if (newReference.title.trim() && newReference.url.trim()) {
      const reference = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: newReference.title.trim(),
        url: newReference.url.trim()
      }

      onChange({
        ...block,
        data: {
          ...block.data,
          references: [...block.data.references, reference]
        }
      })

      setNewReference({ title: '', url: '' })
    }
  }

  const removeReference = (id: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        references: block.data.references.filter(ref => ref.id !== id)
      }
    })
  }

  const updateReference = (id: string, field: 'title' | 'url', value: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        references: block.data.references.map(ref => 
          ref.id === id ? { ...ref, [field]: value } : ref
        )
      }
    })
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {block.data.title || "لیست لینک‌های منابع"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {block.data.references.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              هیچ منبعی اضافه نشده است
            </p>
          ) : (
            <div className="space-y-3">
              {block.data.references.map((reference, index) => (
                <div key={reference.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {reference.title}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                      <a 
                        href={reference.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {reference.url}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">لیست لینک‌های منابع</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="references-title">عنوان بخش</Label>
          <Input
            id="references-title"
            value={block.data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="مثال: منابع و مراجع"
          />
        </div>

        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium">افزودن منبع جدید</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="new-ref-title">عنوان منبع</Label>
              <Input
                id="new-ref-title"
                value={newReference.title}
                onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                placeholder="عنوان منبع را وارد کنید"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-ref-url">لینک منبع</Label>
              <Input
                id="new-ref-url"
                value={newReference.url}
                onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <Button 
            onClick={addReference}
            disabled={!newReference.title.trim() || !newReference.url.trim()}
            size="sm"
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            افزودن منبع
          </Button>
        </div>

        {block.data.references.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">منابع موجود</h4>
            {block.data.references.map((reference, index) => (
              <div key={reference.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    منبع {index + 1}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeReference(reference.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">عنوان</Label>
                    <Input
                      value={reference.title}
                      onChange={(e) => updateReference(reference.id, 'title', e.target.value)}
                      placeholder="عنوان منبع"
                      size={1}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">لینک</Label>
                    <Input
                      value={reference.url}
                      onChange={(e) => updateReference(reference.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                      size={1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
