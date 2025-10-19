"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { MapBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { MapPin } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface MapBlockProps {
  block: MapBlock;
  onChange: (block: MapBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function MapBlockComponent({ 
  block, 
  onChange, 
  isEditing = false 
}: MapBlockProps) {
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleLatitudeChange = (latitude: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        latitude: parseFloat(latitude) || 0,
      },
    });
  };

  const handleLongitudeChange = (longitude: string) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        longitude: parseFloat(longitude) || 0,
      },
    });
  };

  const handleTitleChange = (title: string) => {
    onChange({
      ...block,
      data: { ...block.data, title }
    });
  };

  // Removed description text editor; description editing is disabled here

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            نقشه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium mb-1 block">عرض جغرافیایی</label>
              <Input
                type="number"
                step="any"
                value={block.data.latitude}
                onChange={(e) => handleLatitudeChange(e.target.value)}
                placeholder="مثال: 35.6892"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">طول جغرافیایی</label>
              <Input
                type="number"
                step="any"
                value={block.data.longitude}
                onChange={(e) => handleLongitudeChange(e.target.value)}
                placeholder="مثال: 51.3890"
              />
            </div>
          </div>
          <Input
            value={block.data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="عنوان مکان..."
            className="w-full"
          />
          {/* Text editor removed intentionally */}
        </CardContent>
      </Card>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${block.data.latitude},${block.data.longitude}`;
  
  return (
    <div className="mb-4">
      {block.data.latitude && block.data.longitude ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
            <iframe
              src={`https://maps.google.com/maps?q=${block.data.latitude},${block.data.longitude}&hl=fa&z=15&output=embed`}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            {block.data.title && (
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {block.data.title}
              </h4>
            )}
            {block.data.description && (
              <div 
                className="text-sm text-gray-600 dark:text-gray-400 mb-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: block.data.description }}
              />
            )}
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              مشاهده در Google Maps →
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">مختصات نقشه وارد نشده</p>
        </div>
      )}
    </div>
  );
}
