"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, Trash } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { useGlobalFileUploadMutation } from "@workspace/framework";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UploadBoxProps {
  resourceId?: string;
  className?: string;
  onAllUploaded?: () => void;
  disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function UploadBox({
  resourceId,
  className,
  onAllUploaded,
  disabled,
}: UploadBoxProps) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progresses, setProgresses] = useState<number[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadMutation = useGlobalFileUploadMutation([
    "file-upload",
    String(resourceId ?? "none"),
  ]);
  const isDisabled = disabled || !resourceId;
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const onSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    setSelectedFiles((prev) => {
      const deduped = incoming.filter(
        (file) =>
          !prev.some((f) => f.name === file.name && f.size === file.size)
      );
      return [...prev, ...deduped];
    });
    setProgresses((prev) => [...prev, ...incoming.map(() => 0)]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setProgresses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startUpload = useCallback(async () => {
    for (let fileIndex = 0; fileIndex < selectedFiles.length; fileIndex++) {
      const file = selectedFiles[fileIndex];
      await uploadMutation.mutateAsync({
        file,
        resourceId,
        chunkSize: 5 * 1024 * 1024,
        onProgress: (p: number) => {
          setProgresses((prev) => {
            const next = [...prev];
            next[fileIndex] = p;
            return next;
          });
        },
      });
    }
    onAllUploaded?.();
    setSelectedFiles([]);
    setProgresses([]);
  }, [selectedFiles, resourceId, uploadMutation, onAllUploaded]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isDisabled) return;
      setIsDragActive(false);
      const incoming = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => {
        const deduped = incoming.filter(
          (file) =>
            !prev.some((f) => f.name === file.name && f.size === file.size)
        );
        return [...prev, ...deduped];
      });
      setProgresses((prev) => [...prev, ...incoming.map(() => 0)]);
    },
    [isDisabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isDisabled) return;
      setIsDragActive(true);
    },
    [isDisabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive
            ? "border-orange-500 bg-orange-50"
            : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">فایل‌های مقاله را آپلود کنید</p>
          <p className="text-sm text-gray-500">
            فایل‌ها را انتخاب کنید یا اینجا بکشید و رها کنید
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => inputRef.current?.click()}
            type="button"
            disabled={isDisabled}
          >
            انتخاب فایل
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={onSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mkv,.mp3,.wav,.ogg,.aac,.webm,.flac,.wmv,.m4a"
          disabled={isDisabled}
        />
        {isDisabled && (
          <div className="text-xs text-muted-foreground mt-2">
            ابتدا اطلاعات اولیه را ذخیره کنید
          </div>
        )}
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="p-3 bg-gray-50 rounded border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFile(idx)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Progress value={progresses[idx] ?? 0} />
                <div className="text-xs text-gray-500 mt-1">
                  {progresses[idx] ?? 0}%
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={startUpload} disabled={uploadMutation.isPending}>
              شروع آپلود
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

