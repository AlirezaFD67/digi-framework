"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  onSearchChange?: (text: string) => void;
  valueLabel?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SearchableSelect({
  options,
  value,
  onValueChange,
  onSearchChange,
  valueLabel,
  placeholder = "Pick value",
  className,
  disabled = false,
  isLoading = false,
}: SearchableSelectProps) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [displayValue, setDisplayValue] = React.useState("");
  const [lastSelected, setLastSelected] = React.useState<Option | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = React.useMemo(() => {
    const normalized = (s: string | undefined) => (s || "").toLowerCase().trim();

    const base = searchValue
      ? options.filter((option) =>
          (option.label || "").toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    const seen = new Set<string>();
    return base
      .filter((opt) => !(searchValue && value && opt.value === value))
      .filter((opt) => {
        const key = `${opt.value || ""}::${normalized(opt.label)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [options, searchValue, value]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  React.useEffect(() => {
    if (open) return;

    if (selectedOption) {
      setDisplayValue(selectedOption.label);
      setLastSelected(selectedOption);
    } else if (value && valueLabel) {
      setDisplayValue(valueLabel);
    } else {
      setDisplayValue("");
    }
  }, [open, value, valueLabel, selectedOption]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setDisplayValue(newValue);
    setOpen(true);
    onSearchChange?.(newValue);
  };

  const handleInputFocus = () => {
    if (!open && displayValue) {
      setSearchValue(displayValue);
    }
    setOpen(true);
  };

  const handleSelect = (option: Option) => {
    onValueChange?.(option.value);
    setDisplayValue(option.label);
    setLastSelected(option);
    setSearchValue("");
    setOpen(false);
    setTimeout(() => inputRef.current?.blur(), 0);
    onSearchChange?.("");
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setOpen(false);
      if (searchValue.trim().length === 0) {
        const label = selectedOption?.label ?? lastSelected?.label ?? "";
        setDisplayValue(label);
      } else {
        setDisplayValue(searchValue);
      }
    }, 0);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative cursor-text" onClick={handleContainerClick}>
        <input
          ref={inputRef}
          type="text"
          value={open ? searchValue : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 pr-10 text-sm border rounded-md",
            "focus:outline-none focus:ring-0 focus:border-blue-500",
            "placeholder:text-gray-400 border-input",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {searchValue ? "No options found" : "برای جستجو تایپ کنید"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

