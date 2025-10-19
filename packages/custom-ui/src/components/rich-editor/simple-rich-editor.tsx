"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useRef, useEffect, useState } from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SimpleRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FONT_SIZES = [
  { label: 'کوچک', value: '12px' },
  { label: 'عادی', value: '14px' },
  { label: 'متوسط', value: '16px' },
  { label: 'بزرگ', value: '18px' },
  { label: 'خیلی بزرگ', value: '20px' },
];

const COLORS = [
  { label: 'مشکی', value: '#000000' },
  { label: 'خاکستری تیره', value: '#374151' },
  { label: 'خاکستری', value: '#6B7280' },
  { label: 'قرمز', value: '#DC2626' },
  { label: 'نارنجی', value: '#EA580C' },
  { label: 'زرد', value: '#CA8A04' },
  { label: 'سبز', value: '#16A34A' },
  { label: 'آبی', value: '#2563EB' },
  { label: 'بنفش', value: '#7C3AED' },
  { label: 'صورتی', value: '#DB2777' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function SimpleRichEditor({
  value,
  onChange,
  placeholder,
  className,
  readOnly = false
}: SimpleRichEditorProps) {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.simple-rich-editor')) {
        setShowColorPicker(false);
        setShowFontSizePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInput = () => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML.trim()) {
        onChange(currentHTML);
      } else {
        onChange('');
      }
    }
  };

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = () => {
    setIsFocused(false);
    if (editorRef.current) {
      const cleanHTML = cleanupHTML(editorRef.current.innerHTML);
      if (cleanHTML !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = cleanHTML;
        onChange(cleanHTML);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertParagraph', false);
      setTimeout(() => {
        editorRef.current?.focus();
      }, 0);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const cleanupHTML = (html: string): string => {
    if (!html.trim()) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const divs = tempDiv.querySelectorAll('div');
    divs.forEach(div => {
      if (div.innerHTML.trim()) {
        const p = document.createElement('p');
        p.innerHTML = div.innerHTML;
        p.style.cssText = div.style.cssText;
        div.parentNode?.replaceChild(p, div);
      }
    });

    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent?.trim()) {
        textNodes.push(node as Text);
      }
    }

    textNodes.forEach(textNode => {
      if (textNode.parentNode && 
          textNode.parentNode.nodeType === Node.ELEMENT_NODE &&
          !['P', 'LI', 'A', 'SPAN'].includes((textNode.parentNode as Element).tagName)) {
        const p = document.createElement('p');
        p.appendChild(textNode.cloneNode());
        textNode.parentNode.replaceChild(p, textNode);
      }
    });

    const emptyPs = tempDiv.querySelectorAll('p:empty');
    emptyPs.forEach(p => p.remove());

    const content = tempDiv.innerHTML.trim();
    if (content) {
      return `<div>${content}</div>`;
    }
    
    return '';
  };

  // ============================================================================
  // TOOLBAR ACTIONS
  // ============================================================================

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  const toggleBold = () => execCommand('bold');
  const toggleItalic = () => execCommand('italic');
  const toggleUnderline = () => execCommand('underline');
  
  const insertLink = () => {
    const url = prompt('لینک را وارد کنید:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const setFontSize = (size: string) => {
    execCommand('fontSize', '7');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size;
      range.surroundContents(span);
      handleInput();
    }
    setShowFontSizePicker(false);
  };

  const setColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const setAlignment = (align: string) => {
    execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  const insertList = (type: 'ordered' | 'unordered') => {
    editorRef.current?.focus();
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList');
      } else {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current!);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList');
      }
    } else {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current!);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      execCommand(type === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={cn("simple-rich-editor", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-b-0 rounded-t-md bg-gray-50 dark:bg-gray-800">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={toggleBold}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm font-bold"
          title="بولد"
        >
          B
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm italic"
          title="ایتالیک"
        >
          I
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm underline"
          title="زیرخط"
        >
          U
        </button>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Font Size */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontSizePicker(!showFontSizePicker)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
            title="اندازه فونت"
          >
            Aa
          </button>
          {showFontSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 min-w-[120px]">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => setFontSize(size.value)}
                  className="w-full px-3 py-1 text-right hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  style={{ fontSize: size.value }}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
            title="رنگ متن"
          >
            🎨
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 min-w-[150px] p-2">
              <div className="grid grid-cols-5 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setColor(color.value)}
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => setAlignment('right')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="راست چین"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setAlignment('center')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="وسط چین"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setAlignment('left')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="چپ چین"
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => insertList('unordered')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="لیست نقطه‌ای"
          onMouseDown={(e) => e.preventDefault()}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertList('ordered')}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="لیست شماره‌ای"
          onMouseDown={(e) => e.preventDefault()}
        >
          1.
        </button>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
          title="لینک"
        >
          🔗
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          if (editorRef.current && !readOnly) {
            const selection = window.getSelection();
            const range = document.createRange();
            
            if (!editorRef.current.textContent?.trim()) {
              range.setStart(editorRef.current, 0);
              range.collapse(true);
            } else {
              const clickNode = e.target as Node;
              if (clickNode.nodeType === Node.TEXT_NODE) {
                range.setStart(clickNode, 0);
              } else {
                range.setStart(editorRef.current, 0);
              }
              range.collapse(true);
            }
            
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }}
        className={cn(
          "min-h-[100px] p-3 border rounded-b-md outline-none",
          "text-sm leading-relaxed",
          "bg-white dark:bg-gray-900",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          isFocused && "ring-2 ring-blue-500 ring-opacity-50",
          readOnly && "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
        )}
        style={{ direction: 'rtl', textAlign: 'right' }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

