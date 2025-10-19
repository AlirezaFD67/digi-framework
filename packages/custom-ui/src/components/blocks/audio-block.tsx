"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react"
import { AudioBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { Volume2, Play, Pause, FolderOpen } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface AudioBlockProps {
  block: AudioBlock;
  onChange: (block: AudioBlock) => void;
  isEditing?: boolean;
  articleId?: string;
  itemMedia?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function AudioBlockComponent({ 
  block, 
  onChange, 
  isEditing = false, 
  articleId, 
  itemMedia 
}: AudioBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUrlChange = (url: string) => {
    onChange({
      ...block,
      data: { ...block.data, url }
    });
  };

  const handleTitleChange = (title: string) => {
    onChange({
      ...block,
      data: { ...block.data, title }
    });
  };

  // Removed description text editor; description editing is disabled here

  const togglePlay = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const buildFinalUrl = () => {
    const rawUrl = (block.data.url || '').trim()
    if (!rawUrl) return ''
    
    if (rawUrl.startsWith('http://')) {
      return rawUrl.replace('http://', 'https://')
    }
    if (rawUrl.startsWith('https://')) {
      return rawUrl
    }
    
    const filebase = (process.env.NEXT_PUBLIC_FILEBASE || 'https://digicare24seven.com/').replace(/\/+$/, '/')
    const media = (itemMedia || '').replace(/^\/+/, '').replace(/\/+$/, '/')
    const filePathRaw = rawUrl.replace(/^\/+/, '')
    const encodedPath = filePathRaw
      .split('/')
      .filter(Boolean)
      .map(segment => encodeURIComponent(segment))
      .join('/')
    
    return `${filebase}${media}${encodedPath}`
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Volume2 className="h-4 w-4" />
            فایل صوتی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={block.data.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="لینک فایل صوتی..."
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
            placeholder="عنوان فایل صوتی..."
            className="w-full"
          />
          {/* Text editor removed intentionally */}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      {block.data.url ? (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            
            <div className="flex-1">
              {block.data.title && (
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {block.data.title}
                </h4>
              )}
              {block.data.description && (
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.data.description }}
                />
              )}
            </div>
          </div>
          
          <audio
            ref={setAudioRef}
            src={buildFinalUrl()}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onError={(e) => {
              console.error('Audio failed to load/play', { src: buildFinalUrl(), event: e })
            }}
            className="w-full mt-3"
            controls
          />
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
          <Volume2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">فایل صوتی انتخاب نشده</p>
        </div>
      )}
    </div>
  );
}
