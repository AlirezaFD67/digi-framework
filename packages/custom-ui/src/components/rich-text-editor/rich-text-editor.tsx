"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Palette,
  Highlighter,
  Eraser,
  IndentIncrease,
  IndentDecrease,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "متن را وارد کنید...",
  className = "",
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // selection
  const savedSelectionRef = useRef<Range | null>(null);

  // toolbar states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState<string>("#000000");
  const [currentHighlightColor, setCurrentHighlightColor] =
    useState<string>("transparent");
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const [currentHeadingLevel, setCurrentHeadingLevel] = useState<
    1 | 2 | 3 | 4 | 5 | 6 | null
  >(null);

  // control flags
  const isInternalUpdateRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  // ---- Custom Undo/Redo ----
  const MAX_HISTORY = 100;
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const lastHtmlRef = useRef<string>("");

  const pushSnapshotFromHtml = (html: string) => {
    const stack = undoStackRef.current;
    const normalized = html ?? "";
    if (stack.length === 0 || stack[stack.length - 1] !== normalized) {
      if (stack.length >= MAX_HISTORY) stack.shift();
      stack.push(normalized);
    }
  };

  const resetHistoryWith = (html: string) => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    lastHtmlRef.current = html ?? "";
    pushSnapshotFromHtml(lastHtmlRef.current);
  };

  const placeCaretAtEnd = (el: HTMLElement) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const applyHtml = (html: string) => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = html ?? "";
    placeCaretAtEnd(editorRef.current);
    saveSelection();
    updateToolbarFromSelection();
  };

  const doUndo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const undo = undoStackRef.current;
    const redo = redoStackRef.current;
    if (undo.length <= 1) return;
    const current = editor.innerHTML;
    if (redo.length >= MAX_HISTORY) redo.shift();
    redo.push(current);
    undo.pop();
    const prev = undo[undo.length - 1] ?? "";
    isInternalUpdateRef.current = true;
    applyHtml(prev);
    lastHtmlRef.current = prev;
    onChange(prev);
  };

  const doRedo = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const undo = undoStackRef.current;
    const redo = redoStackRef.current;
    if (redo.length === 0) return;
    const next = redo.pop() as string;
    if (undo.length >= MAX_HISTORY) undo.shift();
    undo.push(next);
    isInternalUpdateRef.current = true;
    applyHtml(next);
    lastHtmlRef.current = next;
    onChange(next);
  };

  // init
  useLayoutEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = value ?? "";
    resetHistoryWith(value ?? "");
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reflect external value changes
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    if (value !== ed.innerHTML) {
      ed.innerHTML = value ?? "";
      lastHtmlRef.current = value ?? "";
      resetHistoryWith(value ?? "");
      updateToolbarFromSelection();
    }
  }, [value]);

  // selection helpers
  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current && editorRef.current.contains(range.startContainer)) {
      savedSelectionRef.current = range;
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;
    if (savedSelectionRef.current) {
      selection.removeAllRanges();
      try {
        selection.addRange(savedSelectionRef.current);
      } catch {
        if (editorRef.current) placeCaretAtEnd(editorRef.current);
      }
    } else if (editorRef.current) {
      placeCaretAtEnd(editorRef.current);
    }
  };

  const isBlockTag = (tagName: string) => {
    if (!tagName) return false;
    if (tagName === "P" || tagName === "DIV") return true;
    if (tagName.startsWith("H")) {
      const n = Number(tagName.substring(1));
      return n >= 1 && n <= 6;
    }
    return false;
  };

  const updateToolbarFromSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editorRef.current || !editorRef.current.contains(range.startContainer))
      return;

    try {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
    } catch {}

    let el: HTMLElement | null = selection.anchorNode as HTMLElement | null;
    if (el && el.nodeType === Node.TEXT_NODE) el = el.parentElement;
    while (el && el !== editorRef.current && !isBlockTag(el.tagName)) {
      el = el.parentElement as HTMLElement | null;
    }
    if (el) {
      if (/^H[1-6]$/.test(el.tagName)) {
        const lvl = parseInt(el.tagName.substring(1), 10) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        setCurrentHeadingLevel(lvl);
      } else {
        setCurrentHeadingLevel(null);
      }

      const computed = window.getComputedStyle(el);
      const fontSizePx = parseInt(computed.fontSize || "16", 10);
      if (!Number.isNaN(fontSizePx)) setCurrentFontSize(fontSizePx);
      setCurrentTextColor(computed.color || "#000000");
      const bg = computed.backgroundColor;
      setCurrentHighlightColor(
        !bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent"
          ? "transparent"
          : bg
      );
    }
  };

  useEffect(() => {
    const handler = () => updateToolbarFromSelection();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withSnapshot = (fn: () => void) => {
    if (!editorRef.current) return;
    pushSnapshotFromHtml(lastHtmlRef.current);
    redoStackRef.current = [];
    editorRef.current.focus();
    restoreSelection();
    fn();
    const newHtml = editorRef.current.innerHTML;
    lastHtmlRef.current = newHtml;
    isInternalUpdateRef.current = true;
    onChange(newHtml);
    saveSelection();
    updateToolbarFromSelection();
    hasUserInteractedRef.current = true;
  };

  const execCommand = (command: string, value?: string) => {
    withSnapshot(() => {
      document.execCommand(command, false, value);
    });
  };

  // --- IMPORTANT: intercept native history ops ---
  const handleBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
    const ie = e.nativeEvent as any;
    const inputType: string | undefined = ie?.inputType;
    if (inputType && inputType.startsWith("history")) {
      e.preventDefault();
      if (inputType === "historyUndo") doUndo();
      else if (inputType === "historyRedo") doRedo();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!editorRef.current) return;
    pushSnapshotFromHtml(lastHtmlRef.current);
    redoStackRef.current = [];
    const html = editorRef.current.innerHTML;
    lastHtmlRef.current = html;
    isInternalUpdateRef.current = true;
    onChange(html);
    hasUserInteractedRef.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = isMac ? e.metaKey : e.ctrlKey;

    // Undo/Redo — layout independent
    if (mod && e.code === "KeyZ") {
      e.preventDefault();
      if (e.shiftKey) doRedo();
      else doUndo();
      return;
    }
    if (mod && e.code === "KeyY") {
      e.preventDefault();
      doRedo();
      return;
    }

    // Indent/Outdent with Tab / Shift+Tab
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) outdent();
      else indent();
      return;
    }
  };

  // تشخیص جهت متن بر اساس محتوای واقعی
  const detectTextDirection = (element: HTMLElement): 'rtl' | 'ltr' => {
    // اگر dir صراحتاً تنظیم شده، از آن استفاده کن
    const explicitDir = element.getAttribute('dir');
    if (explicitDir === 'rtl' || explicitDir === 'ltr') {
      return explicitDir;
    }
    
    // بررسی محتوای متن
    const text = element.textContent || '';
    const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    const rtlMatches = text.match(rtlChars);
    const rtlCount = rtlMatches ? rtlMatches.length : 0;
    const totalChars = text.replace(/\s/g, '').length;
    
    // اگر بیش از 30% کاراکترها RTL هستند، متن RTL است
    return totalChars > 0 && rtlCount / totalChars > 0.3 ? 'rtl' : 'ltr';
  };

  // === Indent / Outdent ===
  const indent = () => {
    withSnapshot(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (!editorRef.current || !editorRef.current.contains(range.startContainer)) return;

      // پیدا کردن بلوک والد (p, div, h1-h6, li) و حذف blockquoteهای قدیمی
      let node: Node | null = range.startContainer;
      
      // اگر یک text node است، به parent element برو
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }
      
      // پیدا کردن blockquote یا بلوک والد
      let blockElement: HTMLElement | null = null;
      let blockquoteToRemove: HTMLElement | null = null;
      
      let current = node as HTMLElement;
      while (current && current !== editorRef.current) {
        const tag = current.tagName;
        
        // اگر blockquote دیدیم، علامت‌گذاری کن برای حذف
        if (tag === 'BLOCKQUOTE') {
          blockquoteToRemove = current;
        }
        
        // اگر بلوک اصلی پیدا شد
        if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag) || tag === 'LI') {
          blockElement = current;
          break;
        }
        
        current = current.parentElement as HTMLElement;
      }

      if (blockElement && blockElement !== editorRef.current) {
        // اگر blockquote وجود داشت، محتوای داخلش را بیرون بیاور
        if (blockquoteToRemove && blockquoteToRemove.parentElement) {
          const fragment = document.createDocumentFragment();
          while (blockquoteToRemove.firstChild) {
            fragment.appendChild(blockquoteToRemove.firstChild);
          }
          blockquoteToRemove.parentElement.replaceChild(fragment, blockquoteToRemove);
        }
        
        // تورفتگی از سمت راست (فارسی)
        const currentMargin = parseInt(blockElement.style.marginRight || '0', 10);
        blockElement.style.marginRight = `${currentMargin + 40}px`;
       
      }
    });
  };

  const outdent = () => {
    withSnapshot(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      if (!editorRef.current || !editorRef.current.contains(range.startContainer)) return;

      // پیدا کردن بلوک والد و حذف blockquoteهای قدیمی
      let node: Node | null = range.startContainer;
      
      // اگر یک text node است، به parent element برو
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }
      
      // پیدا کردن blockquote یا بلوک والد
      let blockElement: HTMLElement | null = null;
      let blockquoteToRemove: HTMLElement | null = null;
      
      let current = node as HTMLElement;
      while (current && current !== editorRef.current) {
        const tag = current.tagName;
        
        // اگر blockquote دیدیم، علامت‌گذاری کن برای حذف
        if (tag === 'BLOCKQUOTE') {
          blockquoteToRemove = current;
        }
        
        // اگر بلوک اصلی پیدا شد
        if (tag === 'P' || tag === 'DIV' || /^H[1-6]$/.test(tag) || tag === 'LI') {
          blockElement = current;
          break;
        }
        
        current = current.parentElement as HTMLElement;
      }

      if (blockElement && blockElement !== editorRef.current) {
        // اگر blockquote وجود داشت، محتوای داخلش را بیرون بیاور
        if (blockquoteToRemove && blockquoteToRemove.parentElement) {
          const fragment = document.createDocumentFragment();
          while (blockquoteToRemove.firstChild) {
            fragment.appendChild(blockquoteToRemove.firstChild);
          }
          blockquoteToRemove.parentElement.replaceChild(fragment, blockquoteToRemove);
        }
        
        // کاهش تورفتگی از سمت راست (فارسی)
        const currentMargin = parseInt(blockElement.style.marginRight || '0', 10);
        const newMargin = Math.max(0, currentMargin - 40);
        blockElement.style.marginRight = newMargin === 0 ? '' : `${newMargin}px`;
        
      }
    });
  };

  // formatting actions
  const toggleBold = () => {
    execCommand("bold");
    setIsBold((v) => !v);
  };
  const toggleItalic = () => {
    execCommand("italic");
    setIsItalic((v) => !v);
  };
  const toggleUnderline = () => {
    execCommand("underline");
    setIsUnderline((v) => !v);
  };
  const insertList = (ordered: boolean) =>
    execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
  const alignText = (alignment: string) =>
    execCommand(
      "justify" + alignment.charAt(0).toUpperCase() + alignment.slice(1)
    );
  const insertLink = () => {
    const url = prompt("لینک را وارد کنید:");
    if (url) execCommand("createLink", url);
  };
  const removeLink = () => execCommand("unlink");

  const insertHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    withSnapshot(() => {
      document.execCommand("formatBlock", false, `<h${level}>`);
      const sizeMap: Record<number, number> = {
        1: 32,
        2: 28,
        3: 24,
        4: 20,
        5: 18,
        6: 16,
      };
      applyFontSize(sizeMap[level] || 20, /*useSnapshot*/ false);
    });
    setCurrentHeadingLevel(level);
  };

  const insertParagraph = () => {
    withSnapshot(() => {
      document.execCommand("formatBlock", false, "<p>");
      setCurrentHeadingLevel(null);
      setCurrentFontSize(16);
      if (editorRef.current) placeCaretAtEnd(editorRef.current);
    });
  };

  const setTextColor = (color: string) => {
    setCurrentTextColor(color);
    execCommand("foreColor", color);
  };
  const setHighlightColor = (color: string) => {
    setCurrentHighlightColor(color);
    withSnapshot(() => {
      document.execCommand("hiliteColor", false, color);
      document.execCommand("backColor", false, color);
    });
  };

  const clearFormatting = () => {
    withSnapshot(() => {
      document.execCommand("removeFormat", false);
      document.execCommand("unlink", false);
    });
    setCurrentTextColor("#000000");
    setCurrentHighlightColor("transparent");
    setCurrentFontSize(16);
  };

  const applyFontSize = (px: number, useSnapshot: boolean = true) => {
    const run = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (!editorRef.current.contains(range.startContainer)) return;

      try {
        if (range.collapsed) {
          const span = document.createElement("span");
          span.style.fontSize = `${px}px`;
          span.appendChild(document.createTextNode("\u200B"));
          range.insertNode(span);
          const newRange = document.createRange();
          newRange.setStart(span.firstChild as Text, 1);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          const contents = range.cloneContents();
          const wrapper = document.createElement("span");
          wrapper.style.fontSize = `${px}px`;
          wrapper.appendChild(contents);
          range.deleteContents();
          range.insertNode(wrapper);
          const newRange = document.createRange();
          newRange.setStartAfter(wrapper);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        setCurrentFontSize(px);
        saveSelection();
      } catch {
        document.execCommand("fontSize", false, "4");
      }
    };

    if (useSnapshot) withSnapshot(run);
    else run();
  };

  if (readOnly) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
          {/* Heading Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={currentHeadingLevel ? "default" : "outline"}
                size="sm"
                className="h-8 px-3"
                onMouseDown={(e) => e.preventDefault()}
                title={
                  currentHeadingLevel
                    ? `Heading ${currentHeadingLevel}`
                    : "Paragraph"
                }
              >
                {currentHeadingLevel ? `H${currentHeadingLevel}` : "P"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => insertHeading(1)}>
                <Heading1 className="h-4 w-4 mr-2" />
                عنوان 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(2)}>
                <Heading2 className="h-4 w-4 mr-2" />
                عنوان 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(3)}>
                <Heading3 className="h-4 w-4 mr-2" />
                عنوان 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(4)}>
                <span className="h-4 w-4 mr-2 text-sm font-bold">H4</span>
                عنوان 4
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(5)}>
                <span className="h-4 w-4 mr-2 text-sm font-bold">H5</span>
                عنوان 5
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => insertHeading(6)}>
                <span className="h-4 w-4 mr-2 text-sm font-bold">H6</span>
                عنوان 6
              </DropdownMenuItem>
              <DropdownMenuItem onClick={insertParagraph}>
                <Type className="h-4 w-4 mr-2" />
                پاراگراف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={currentFontSize !== 16 ? "default" : "outline"}
                size="sm"
                className="h-8 px-3"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Type className="h-4 w-4 mr-1" />
                سایز {currentFontSize}px
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[12, 14, 16, 18, 20, 24, 28, 32].map((px) => (
                <DropdownMenuItem key={px} onClick={() => applyFontSize(px)}>
                  {px} px
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Strong/Em/Underline */}
          <Button
            variant={isBold ? "default" : "outline"}
            size="sm"
            onClick={toggleBold}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isItalic ? "default" : "outline"}
            size="sm"
            onClick={toggleItalic}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isUnderline ? "default" : "outline"}
            size="sm"
            onClick={toggleUnderline}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Underline className="h-4 w-4" />
          </Button>

          {/* Text color */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={currentTextColor !== "#000000" ? "default" : "outline"}
                size="sm"
                className="h-8 px-3"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Palette className="h-4 w-4 mr-1" />
                رنگ متن
                <span
                  className="ml-2 h-3 w-3 rounded-sm border"
                  style={{ backgroundColor: currentTextColor }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
              <div className="grid grid-cols-6 gap-2 p-1">
                {[
                  "#000000",
                  "#ef4444",
                  "#f59e0b",
                  "#10b981",
                  "#0ea5e9",
                  "#6366f1",
                  "#8b5cf6",
                  "#ec4899",
                  "#f97316",
                  "#22c55e",
                  "#06b6d4",
                  "#3f3f46",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className="h-6 w-6 rounded border"
                    style={{
                      backgroundColor: c,
                      borderColor: c === "#000000" ? "#e5e7eb" : c,
                    }}
                    aria-label={`set text color ${c}`}
                  />
                ))}
                <div className="col-span-6 flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={currentTextColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-6 w-10"
                  />
                  <span className="text-xs text-muted-foreground">سفارشی</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Highlight color */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={
                  currentHighlightColor !== "transparent"
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="h-8 px-3"
                onMouseDown={(e) => e.preventDefault()}
              >
                <Highlighter className="h-4 w-4 mr-1" />
                پس‌زمینه
                <span
                  className="ml-2 h-3 w-3 rounded-sm border"
                  style={{
                    backgroundColor:
                      currentHighlightColor === "transparent"
                        ? "#ffffff"
                        : currentHighlightColor,
                  }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
              <div className="grid grid-cols-6 gap-2 p-1">
                {[
                  "transparent",
                  "#fde68a",
                  "#bbf7d0",
                  "#bae6fd",
                  "#e9d5ff",
                  "#fecaca",
                  "#d9f99d",
                  "#fecdd3",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setHighlightColor(c)}
                    className="h-6 w-6 rounded border"
                    style={{
                      backgroundColor: c === "transparent" ? "#ffffff" : c,
                      borderColor: "#e5e7eb",
                    }}
                    aria-label={`set highlight color ${c}`}
                    title={c === "transparent" ? "بدون رنگ" : c}
                  />
                ))}
                <div className="col-span-6 flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={
                      currentHighlightColor === "transparent"
                        ? "#ffffff"
                        : currentHighlightColor
                    }
                    onChange={(e) => setHighlightColor(e.target.value)}
                    className="h-6 w-10"
                  />
                  <span className="text-xs text-muted-foreground">سفارشی</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={clearFormatting}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
            title="حذف فرمت"
          >
            <Eraser className="h-4 w-4" />
          </Button>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Lists */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertList(false)}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertList(true)}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          {/* Indent / Outdent */}
          <Button
            variant="outline"
            size="sm"
            onClick={indent}
            className="h-8 w-8 p-0"
            title="تورفتگی (Tab)"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IndentIncrease className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={outdent}
            className="h-8 w-8 p-0"
            title="حذف تورفتگی (Shift+Tab)"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IndentDecrease className="h-4 w-4" />
          </Button>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Alignment */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignText("left")}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignText("center")}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignText("right")}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Links */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const url = prompt("لینک را وارد کنید:");
              if (url) execCommand("createLink", url);
            }}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => execCommand("unlink")}
            className="h-8 w-8 p-0"
            onMouseDown={(e) => e.preventDefault()}
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="p-4">
          <div
            ref={editorRef}
            contentEditable
            onBeforeInput={handleBeforeInput}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={() => {
              saveSelection();
              updateToolbarFromSelection();
            }}
            onKeyUp={() => {
              saveSelection();
              updateToolbarFromSelection();
            }}
            onSelect={() => {
              saveSelection();
              updateToolbarFromSelection();
            }}
            onFocus={() => {
              hasUserInteractedRef.current = true;
            }}
            className="rte-area min-h-[120px] outline-none max-w-none"
            style={{
              fontFamily: "inherit",
              textAlign: "right",
            }}
            dir="rtl"
            data-placeholder={placeholder}
            suppressContentEditableWarning
          />
        </div>
      </CardContent>

      <style jsx={true as any}>{`
  [contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
  }

  [contenteditable] {
    line-height: 1.6;
  }

  /* پاراگراف و هدینگ‌ها */
  [contenteditable] p { margin: 0.5em 0; direction: rtl; text-align: right; }
  [contenteditable] div { direction: rtl; text-align: right; }
  [contenteditable] h1, [contenteditable] h2, [contenteditable] h3, 
  [contenteditable] h4, [contenteditable] h5, [contenteditable] h6 {
    margin: 1em 0 0.5em 0;
    font-weight: bold;
    direction: rtl; text-align: right;
  }
  [contenteditable] h1 { font-size: 2em; }
  [contenteditable] h2 { font-size: 1.5em; }
  [contenteditable] h3 { font-size: 1.17em; }
  [contenteditable] h4 { font-size: 1em; }
  [contenteditable] h5 { font-size: 0.83em; }
  [contenteditable] h6 { font-size: 0.67em; }

  /* ✅ فیکس قطعی لیست‌ها */
  [contenteditable] ul, 
  [contenteditable] ol {
    /* هرچی preflight/prose خراب کرده رو خنثی کن */
    list-style: revert !important;          /* برگردوندن نوع مارکر پیش‌فرض */
    list-style-position: inside !important; /* داخل خط تا در RTL سمت راست بیاد */
    margin: 0.5em 0 !important;
    padding: 0 !important;                  /* چون position: inside داریم، padding لازم نیست */
    direction: rtl;
    text-align: right;
  }

  /* سطوح تو در تو */
  [contenteditable] ul ul { list-style-type: circle !important; }
  [contenteditable] ul ul ul { list-style-type: square !important; }
  [contenteditable] ol { counter-reset: item; }
  [contenteditable] ol li { counter-increment: item; }
  [contenteditable] ol li::marker {
    /* شماره‌ها واضح‌تر بشن */
    font-variant-numeric: tabular-nums;
  }

  /* آیتم‌ها */
  [contenteditable] li { margin: .25em 0; }

  /* لینک‌ها */
  [contenteditable] a { color: #3b82f6; text-decoration: underline; }
  [contenteditable] a:hover { color: #2563eb; }

  /* blockquote که برخی مرورگرها برای indent می‌سازند (RTL-friendly) */
  [contenteditable] blockquote {
    margin: .5em 1.5em .5em 0;
    border-right: 3px solid #e5e7eb;
    padding-right: .75em;
  }
`}</style>

<style jsx={true as any} global={true as any}>{`
  /* ✅ لیست‌ها داخل ادیتور: مارکرها را برگردان و RTL-safe کن */
  .rte-area ul,
  .rte-area ol {
    list-style-position: outside !important;
    margin: 0.5em 0 !important;
    padding: 0 !important;
    direction: rtl;
    text-align: right;
  }
  .rte-area ul { list-style-type: disc !important; }
  .rte-area ol { list-style-type: decimal !important; }

  /* جای مارکر در RTL سمت راست است؛ با padding-right فاصله بده */
  .rte-area ul,
  .rte-area ol { padding-right: 1.25em !important; }

  /* سطوح تو در تو */
  .rte-area ul ul { list-style-type: circle !important; }
  .rte-area ul ul ul { list-style-type: square !important; }
  .rte-area ol ol { list-style-type: lower-alpha !important; }
  .rte-area ol ol ol { list-style-type: lower-roman !important; }

  .rte-area li { margin: .25em 0; }
  .rte-area li::marker {
    font-variant-numeric: tabular-nums;
    opacity: .9;
  }
`}</style>

    </Card>
  );
}
