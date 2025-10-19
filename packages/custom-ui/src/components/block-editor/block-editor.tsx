"use client"

// IMPORTS
import { useState, useRef, useEffect } from "react"
import { ContentBlock, ContentBlockType } from "../../types/content-blocks"

import BlockRenderer from "../blocks/block-renderer"
import DragHandle from "./drag-handle"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { useToast } from "../../contexts/toast-context"

import {
  Plus,
  Eye,
  Edit3,
  Save,
  Trash2,
  FileText,
  Play,
  Image,
  MousePointerClick,
  Quote,
  Table,
  HelpCircle,
  MapPin,
  Volume2,
  Link,
  ChevronDown,
  ChevronRight,
  List,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from "lucide-react"

// TYPES & INTERFACES
interface BlockEditorProps {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
  onSave?: (content: ContentBlock[]) => Promise<void>;
  articleId?: string;
  itemMedia?: string;
  isLoading?: boolean;
  renderFileSelector?: (articleId: string, onSelect: (url: string) => void) => React.ReactNode;
}

// CONSTANTS
const BLOCK_TYPES = [
  {
    type: 'heading' as ContentBlockType,
    label: 'عنوان',
    icon: <FileText className="h-4 w-4 text-orange-500" />,
    defaultData: { level: 2, text: '', id: '' }
  },
  {
    type: 'paragraph' as ContentBlockType,
    label: 'پاراگراف',
    icon: <FileText className="h-4 w-4 text-orange-500" />,
    defaultData: { text: '' }
  },
  {
    type: 'video' as ContentBlockType,
    label: 'ویدیو',
    icon: <Play className="h-4 w-4 text-orange-500" />,
    defaultData: { url: '', description: '', source: 'aparat' }
  },
  {
    type: 'image' as ContentBlockType,
    label: 'تصویر',
    icon: <Image className="h-4 w-4 text-orange-500" />,
    defaultData: { url: '', alt: '', caption: '' }
  },
  {
    type: 'callToAction' as ContentBlockType,
    label: 'کال تو اکشن',
    icon: <MousePointerClick className="h-4 w-4 text-orange-500" />,
    defaultData: { image: '', title: '', subtitle: '', buttonText: '', buttonLink: '' }
  },
  {
    type: 'quote' as ContentBlockType,
    label: 'نقل قول',
    icon: <Quote className="h-4 w-4 text-orange-500" />,
    defaultData: { englishText: '', persianText: '', referenceLink: '' }
  },
  {
    type: 'table' as ContentBlockType,
    label: 'جدول',
    icon: <Table className="h-4 w-4 text-orange-500" />,
    defaultData: { rows: 3, columns: 3, headers: [] as string[], data: [] as string[][], headerColor: '' }
  },
  {
    type: 'faq' as ContentBlockType,
    label: 'سوالات متداول',
    icon: <HelpCircle className="h-4 w-4 text-orange-500" />,
    defaultData: { questions: [] as any[] }
  },
  {
    type: 'map' as ContentBlockType,
    label: 'نقشه',
    icon: <MapPin className="h-4 w-4 text-orange-500" />,
    defaultData: { latitude: 0, longitude: 0, title: '', description: '' }
  },
  {
    type: 'audio' as ContentBlockType,
    label: 'فایل صوتی',
    icon: <Volume2 className="h-4 w-4 text-orange-500" />,
    defaultData: { url: '', title: '', description: '' }
  },
  {
    type: 'list' as ContentBlockType,
    label: 'لیست',
    icon: <FileText className="h-4 w-4 text-orange-500" />,
    defaultData: { items: [] as string[], ordered: false }
  },
  {
    type: 'references' as ContentBlockType,
    label: 'لیست منابع',
    icon: <Link className="h-4 w-4 text-orange-500" />,
    defaultData: { title: '', references: [] as any[] }
  },
  {
    type: 'tableOfContents' as ContentBlockType,
    label: 'فهرست مطالب',
    icon: <List className="h-4 w-4 text-orange-500" />,
    defaultData: { items: [] as any[] }
  }
];

// Heading icons for collapsed preview
const headingIcons = {
  1: <Heading1 className="h-4 w-4 text-orange-500" />,
  2: <Heading2 className="h-4 w-4 text-orange-500" />,
  3: <Heading3 className="h-4 w-4 text-orange-500" />,
  4: <Heading4 className="h-4 w-4 text-orange-500" />,
  5: <Heading5 className="h-4 w-4 text-orange-500" />,
  6: <Heading6 className="h-4 w-4 text-orange-500" />,
};

// COMPONENT
export default function BlockEditor({ content, onChange, onSave, articleId, itemMedia, isLoading = false }: BlockEditorProps) {
  // STATE
  const [isEditing, setIsEditing] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedBlockIndices, setExpandedBlockIndices] = useState<number[]>([]); // همه بلوک‌ها بسته باشند
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState<boolean>(false);

  const dragRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const previousContentLengthRef = useRef<number>(0);
  const { success, error: showError } = useToast();
  const scrollRestoredRef = useRef<boolean>(false);
  const isRestoringScrollRef = useRef<boolean>(false);

  // EFFECTS
  useEffect(() => {
    // وقتی محتوا تغییر می‌کند، بلوک‌های باز را حفظ کن و contentLoaded را تنظیم کن
    if (content.length > 0) {
      setContentLoaded(true);
      // Migration: اضافه کردن type به آیتم‌های tableOfContents قدیمی
      const needsTableOfContentsMigration = content.some(block =>
        block.type === 'tableOfContents' &&
        block.data.items &&
        block.data.items.some((item: any) => !item.type)
      );

      if (needsTableOfContentsMigration) {
        const migratedContent = content.map(block => {
          if (block.type === 'tableOfContents' && block.data.items) {
            return {
              ...block,
              data: {
                ...block.data,
                items: block.data.items.map((item: any) => ({
                  ...item,
                  type: item.type || 'h2'
                }))
              }
            };
          }
          // برای video blocks قدیمی اگر source وجود ندارد، آن را خالی نگه می‌داریم تا کاربر خودش انتخاب کند
          // این منطقی‌تر است تا اینکه پیشفرض 'aparat' بگذاریم
          return block;
        });
        onChange(migratedContent);
        return;
      }

      // اگر تعداد بلوک‌ها تغییر کرده، ایندکس‌های معتبر را حفظ کن
      const validIndices = expandedBlockIndices.filter((index: number) => index < content.length);
      if (validIndices.length !== expandedBlockIndices.length) {
        setExpandedBlockIndices(validIndices);
      }
    }
    previousContentLengthRef.current = content.length;
  }, [content.length, onChange]);

  // اطمینان حاصل کن که وقتی کامپوننت remount می‌شود، محتوای قبلی حفظ شود
  useEffect(() => {
    if (content.length > 0) {
      // وقتی کامپوننت دوباره mount می‌شود، expandedBlockIndices را خالی نگه دار
      setExpandedBlockIndices([]);
      setIsEditing(true);
    }
  }, []); // این فقط یک بار اجرا می‌شود وقتی کامپوننت mount می‌شود

  // اطمینان حاصل کن که وقتی کامپوننت mount می‌شود، همه بلوک‌ها در حالت ویرایش باشند
  useEffect(() => {
    if (content.length > 0) {
      setIsEditing(true);
      // تنظیم اولیه expandedBlockIndices - همه بلوک‌ها بسته باشند
      if (expandedBlockIndices.length === 0 && content.length > 0) {
        setExpandedBlockIndices([]);
      }
    }
  }, [content.length, expandedBlockIndices.length]);

  // ذخیره scroll position در هر تغییر
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container || !articleId) {
      console.log('❌ Cannot setup scroll listener:', { hasContainer: !!container, articleId });
      return;
    }

    const storageKey = `block-editor:scroll:${articleId}`;
    console.log('✅ Setting up scroll listener for:', storageKey);

    const handleScroll = () => {
      if (isRestoringScrollRef.current) {
        // در حال بازیابی اسکرول هستیم؛ مقدار موقت را ذخیره نکن
        return;
      }
      if (contentContainerRef.current) {
        const scrollTop = contentContainerRef.current.scrollTop;
        console.log('💾 Saving scroll:', scrollTop);
        sessionStorage.setItem(storageKey, String(scrollTop));
      }
    };

    container.addEventListener('scroll', handleScroll);
    console.log('✅ Scroll listener attached');

    return () => {
      container.removeEventListener('scroll', handleScroll);
      // ذخیره نهایی در unmount
      if (contentContainerRef.current) {
        const scrollTop = contentContainerRef.current.scrollTop;
        console.log('💾 Final save on unmount:', scrollTop);
        sessionStorage.setItem(storageKey, String(scrollTop));
      }
    };
  }, [articleId]);

  // بازیابی scroll position با استفاده از requestAnimationFrame برای اطمینان از render کامل
  useEffect(() => {
    console.log('🔍 Scroll restore check:', {
      hasContainer: !!contentContainerRef.current,
      articleId,
      contentLength: content.length,
      scrollRestored: scrollRestoredRef.current
    });

    if (!contentContainerRef.current || !articleId || content.length === 0 || scrollRestoredRef.current) {
      console.log('❌ Skipping scroll restore');
      return;
    }

    const storageKey = `block-editor:scroll:${articleId}`;
    const savedScroll = sessionStorage.getItem(storageKey);
    
    console.log('📦 Saved scroll:', savedScroll);
    
    if (savedScroll) {
      // استفاده از چند requestAnimationFrame برای اطمینان کامل
      isRestoringScrollRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (contentContainerRef.current) {
              const scrollValue = parseInt(savedScroll, 10);
              contentContainerRef.current.scrollTop = scrollValue;
              scrollRestoredRef.current = true;
              console.log('✅ Scroll restored to:', scrollValue);
              // کمی تاخیر برای جلوگیری از ذخیره 0 پس از رندر مجدد
              setTimeout(() => {
                isRestoringScrollRef.current = false;
              }, 300);
            }
          });
        });
      });
    } else {
      scrollRestoredRef.current = true;
      console.log('⚠️ No saved scroll found');
    }
  }, [articleId, content.length]);

  // Reset scroll restored flag when content becomes empty (unmount scenario)
  useEffect(() => {
    if (content.length === 0) {
      console.log('🔄 Content empty, resetting scroll flag');
      scrollRestoredRef.current = false;
    }
  }, [content.length]);

  // Reset scroll restored flag when articleId changes
  useEffect(() => {
    console.log('🔄 ArticleId changed, resetting scroll flag');
    scrollRestoredRef.current = false;
  }, [articleId]);

  // ذخیره/بازیابی اسکرول هنگام تغییر وضعیت تب مرورگر (visibilitychange)
  useEffect(() => {
    if (!articleId) return;

    const storageKey = `block-editor:scroll:${articleId}`;
    const tryRestoreScroll = (savedScroll: string | null) => {
      if (!savedScroll) return;
      const target = parseInt(savedScroll, 10);

      let attempts = 0;
      const maxAttempts = 20; // ~20 frames

      const restore = () => {
        attempts += 1;
        if (!contentContainerRef.current) {
          if (attempts < maxAttempts) requestAnimationFrame(restore);
          return;
        }

        const container = contentContainerRef.current;
        // اگر محتوا هنوز رندر نشده، چند فریم دیگر تلاش کن
        const canScroll = container.scrollHeight > container.clientHeight;
        if (!canScroll && attempts < maxAttempts) {
          requestAnimationFrame(restore);
          return;
        }

        container.scrollTop = target;

        // اگر مقدار تنظیم نشد (مثلاً هنوز DOM کامل نیست)، مجدد تلاش کن
        if (Math.abs(container.scrollTop - target) > 1 && attempts < maxAttempts) {
          requestAnimationFrame(restore);
        }
      };

      requestAnimationFrame(restore);
    };

    const handleVisibilityOrFocus = () => {
      try {
        if (!contentContainerRef.current) return;
        if (document.visibilityState === 'hidden') {
          // ذخیره موقعیت اسکرول هنگام ترک تب
          const scrollTop = contentContainerRef.current.scrollTop;
          sessionStorage.setItem(storageKey, String(scrollTop));
        } else if (document.visibilityState === 'visible') {
          // بازیابی اسکرول هنگام بازگشت به تب/فوکوس
          const savedScroll = sessionStorage.getItem(storageKey);
          tryRestoreScroll(savedScroll);
        }
      } catch {}
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [articleId, content.length]);

  // اسکرول به انتهای BlockEditor وقتی بلوک جدید از Sticky Sidebar اضافه می‌شود
  useEffect(() => {
    if (!shouldScrollToEnd || !contentContainerRef.current) return;

    // استفاده از setTimeout با تاخیر کوچک برای اطمینان از رندر کامل DOM در Chrome
    const timeoutId = setTimeout(() => {
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({
          top: contentContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
      setShouldScrollToEnd(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [shouldScrollToEnd, content.length]);

  // BLOCK MANAGEMENT FUNCTIONS
  const addBlock = (blockType: ContentBlockType, insertAtIndex?: number) => {
    const blockTypeConfig = BLOCK_TYPES.find(bt => bt.type === blockType);
    if (!blockTypeConfig) return;

    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      order: content.length,
      data: blockTypeConfig.defaultData
    } as ContentBlock;

    let newContent: ContentBlock[];

    if (insertAtIndex !== undefined) {
      // اضافه کردن بلاک در موقعیت مشخص
      newContent = [...content];
      newContent.splice(insertAtIndex + 1, 0, newBlock);
    } else {
      // اضافه کردن در انتها (از Sticky Sidebar)
      newContent = [...content, newBlock];
      // فقط برای بلوک‌های اضافه شده از sidebar، اسکرول به انتها برو
      setShouldScrollToEnd(true);
    }

    // به‌روزرسانی فیلد order برای همه بلوک‌ها
    const updatedContent = newContent.map((block, index) => ({
      ...block,
      order: index
    }));

    onChange(updatedContent);

    // بلوک جدید اضافه شده باز باشد
    const newBlockIndex = insertAtIndex !== undefined ? insertAtIndex + 1 : updatedContent.length - 1;
    setExpandedBlockIndices([newBlockIndex]);
  };

  const updateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newContent = [...content];
    newContent[index] = updatedBlock;
    onChange(newContent);
  };

  const removeBlock = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);

    // به‌روزرسانی فیلد order برای همه بلوک‌های باقی‌مانده
    const updatedContent = newContent.map((block, i) => ({
      ...block,
      order: i
    }));

    onChange(updatedContent);

    // حذف ایندکس بلوک حذف شده از لیست بلوک‌های باز
    const newExpandedIndices = expandedBlockIndices
      .filter((i: number) => i !== index)
      .map((i: number) => i > index ? i - 1 : i);
    setExpandedBlockIndices(newExpandedIndices);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newContent = [...content];
    const [movedBlock] = newContent.splice(fromIndex, 1);
    if (!movedBlock) return;
    newContent.splice(toIndex, 0, movedBlock);

    // به‌روزرسانی فیلد order برای همه بلوک‌ها بر اساس موقعیت جدید
    const updatedContent = newContent.map((block, index) => ({
      ...block,
      order: index
    }));

    onChange(updatedContent);

    // به‌روزرسانی ایندکس‌های بلوک‌های باز بعد از جابجایی
    const newExpandedIndices = expandedBlockIndices.map((i: number) => {
      if (i === fromIndex) return toIndex;
      if (fromIndex < i && toIndex >= i) return i - 1;
      if (fromIndex > i && toIndex <= i) return i + 1;
      return i;
    });
    setExpandedBlockIndices(newExpandedIndices);
  };

  // DRAG & DROP HANDLERS
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveBlock(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // UI HELPER FUNCTIONS
  const toggleBlockExpansion = (index: number) => {
    setExpandedBlockIndices(prev => {
      if (prev.includes(index)) {
        // اگر بلوک باز است، آن را ببند
        return prev.filter((i: number) => i !== index);
      } else {
        // اگر بلوک بسته است، آن را باز کن
        return [...prev, index];
      }
    });
  };

  const getBlockTypeLabel = (blockType: ContentBlockType) => {
    const blockTypeConfig = BLOCK_TYPES.find(bt => bt.type === blockType);
    return blockTypeConfig?.label || blockType;
  };

  const getBlockTypeIcon = (blockType: ContentBlockType) => {
    const blockTypeConfig = BLOCK_TYPES.find(bt => bt.type === blockType);
    return blockTypeConfig?.icon || <FileText className="h-4 w-4 text-orange-500" />;
  };

  // SAVE FUNCTION
  const handleSaveContent = async () => {
    if (!onSave) {
      showError("عملکرد ذخیره تعریف نشده است");
      return;
    }

    try {
      await onSave(content);
      success("محتوا با موفقیت ذخیره شد");
    } catch (err) {
      console.error('Error saving content:', err);
      showError("خطا در ذخیره محتوا");
    }
  };

  // RENDER
  return (
    <div className="flex gap-4">
      {/* Loading Screen */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-lg">در حال بارگذاری...</div>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoading && (
        <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              ویرایش
            </Button>
            <Button
              variant={!isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <Eye className="h-4 w-4 mr-2" />
              پیش‌نمایش
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Button 
              onClick={handleSaveContent} 
              size="sm"
              disabled={saveContentMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveContentMutation.isPending ? "در حال ذخیره..." : "ذخیره محتوا"}
            </Button> */}
          </div>
        </div>

        {/* Content Blocks */}
        <div ref={contentContainerRef} className="space-y-2 h-[90vh] overflow-y-auto">
          {content.map((block, index) => {
            const isExpanded = expandedBlockIndices.includes(index);
            const isMinimized = !isEditing || !isExpanded;
            
            return (
              <div 
                key={block.id} 
                className={`relative group transition-all duration-200 ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${
                  dragOverIndex === index ? 'border-2 border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onDragOver={(e: React.DragEvent) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e: React.DragEvent) => handleDrop(e, index)}
              >
                {/* Block Header */}
                <div 
                  className={`border rounded-t-lg p-3 cursor-pointer transition-colors ${
                    isExpanded ? 'border-b-0' : 'rounded-b-lg'
                  }`}
                  style={{
                    backgroundColor: '#2AB3C6',
                    borderColor: '#2AB3C6'
                  }}
                  draggable={isEditing}
                  onDragStart={(e: React.DragEvent) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => isEditing && toggleBlockExpansion(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isEditing && <DragHandle />}
                      {getBlockTypeIcon(block.type)}
                      <span className="font-medium text-sm text-white">
                        {getBlockTypeLabel(block.type)}
                      </span>
                      <span className="text-xs text-white/80">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                              }}
                              className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white border-green-500"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            {BLOCK_TYPES.map((blockType) => (
                              <DropdownMenuItem
                                key={blockType.type}
                                  onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  addBlock(blockType.type, index);
                                }}
                                className="flex items-center gap-2 p-2"
                              >
                                {blockType.icon}
                                <span className="text-sm">{blockType.label}</span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                            onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            removeBlock(index);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            toggleBlockExpansion(index);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Block Content */}
                {isExpanded && (
                  <div className="bg-white dark:bg-gray-800 border border-t-0 rounded-b-lg">
                    <BlockRenderer
                      block={block}
                      onChange={(updatedBlock) => updateBlock(index, updatedBlock)}
                      isEditing={isEditing}
                      articleId={articleId}
                      itemMedia={itemMedia}
                    />
                  </div>
                )}

                {/* Collapsed Preview for Table of Contents */}
                {!isExpanded && block.type === 'tableOfContents' && (
                  <div className="bg-white dark:bg-gray-800 border border-t-0 rounded-b-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <List className="h-4 w-4" />
                      <span className="text-sm">فهرست مطالب ({block.data.items?.length || 0} آیتم)</span>
                    </div>
                  </div>
                )}

                {/* Collapsed Preview for Heading */}
                {!isExpanded && block.type === 'heading' && block.data.text && (
                  <div className="bg-white dark:bg-gray-800 border border-t-0 rounded-b-lg p-4">
                    <div className="flex items-center gap-2">
                      {headingIcons[block.data.level]}
                      <span className={`text-sm font-medium ${
                        block.data.level === 1 ? 'text-2xl' :
                        block.data.level === 2 ? 'text-xl' :
                        block.data.level === 3 ? 'text-lg' :
                        'text-base'
                      } text-gray-800 dark:text-gray-200`}>
                        {block.data.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {content.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              هیچ محتوایی وجود ندارد
            </h3>
            <p className="text-gray-500 mb-4">
              برای شروع، یک بلوک از منوی سمت چپ انتخاب کنید
            </p>
          </div>
        )}
        </div>
      )}

      {/* Sticky Sidebar - Block Types */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Plus className="h-4 w-4 text-orange-500" />
                بلوک‌ جدید
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {BLOCK_TYPES.map((blockType) => (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    size="sm"
                    className="w-full h-auto p-3 flex items-center gap-3 justify-start"
                    onClick={() => addBlock(blockType.type)}
                    disabled={!isEditing}
                  >
                    {blockType.icon}
                    <span className="text-sm">{blockType.label}</span>
                  </Button>
                ))}
                
                {/* Save Content Button */}
                {onSave && (
                  <Button 
                    onClick={handleSaveContent}
                    className="w-full bg-orange-500 hover:bg-orange-600 mt-8"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    ذخیره محتوا
                  </Button>
                )}

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
