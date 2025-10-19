"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { ReactNode } from "react";
import { GripVertical } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DragHandleProps {
  className?: string;
  children?: ReactNode;
  iconClassName?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function DragHandle({ 
  className = "", 
  children,
  iconClassName = ""
}: DragHandleProps) {
  return (
    <div
      className={`cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded ${className}`}
    >
      <GripVertical className={`h-4 w-4 text-gray-400 dark:text-gray-500 ${iconClassName}`} />
      {children}
    </div>
  );
}
