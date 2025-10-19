// ============================================================================
// IMPORTS
// ============================================================================

import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@workspace/ui/components/input";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SearchInputProps {
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const SearchInput = ({ 
  onSearchChange, 
  placeholder = "جستجو...",
  debounceMs = 300,
  className = ""
}: SearchInputProps) => {
  // ============================================================================
  // STATE
  // ============================================================================

  const [inputValue, setInputValue] = useState<string>("");

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(inputValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearchChange, debounceMs]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`mb-4 flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className="pr-10"
        />
      </div>
    </div>
  );
};

export default SearchInput;

