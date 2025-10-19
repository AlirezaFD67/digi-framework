"use client"

// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react"
import { FAQBlock } from "../../types/content-blocks"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea";
import RichTextEditor from "../rich-text-editor";

import { HelpCircle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FAQBlockProps {
  block: FAQBlock;
  onChange: (block: FAQBlock) => void;
  isEditing?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function FAQBlockComponent({ 
  block, 
  onChange, 
  isEditing = false 
}: FAQBlockProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const addQuestion = () => {
    const newQuestions = [...block.data.questions, { question: '', answer: '' }];
    onChange({
      ...block,
      data: { ...block.data, questions: newQuestions }
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = block.data.questions.filter((_, i) => i !== index);
    onChange({
      ...block,
      data: { ...block.data, questions: newQuestions }
    });
  };

  const updateQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const newQuestions = [...block.data.questions];
    const currentQuestion = newQuestions[index];
    if (!currentQuestion) return;
    newQuestions[index] = { ...currentQuestion, [field]: value };
    onChange({
      ...block,
      data: { ...block.data, questions: newQuestions }
    });
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <HelpCircle className="h-4 w-4" />
            سوالات متداول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {block.data.questions.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">سوال {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">سوال</label>
                <Input
                  value={item.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  placeholder="سوال را وارد کنید..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">پاسخ</label>
                <RichTextEditor
                  value={item.answer}
                  onChange={(value) => updateQuestion(index, 'answer', value)}
                  placeholder="پاسخ را وارد کنید..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
          
          <Button onClick={addQuestion} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            افزودن سوال جدید
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-4">
      <div className="space-y-2">
        {block.data.questions.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full px-4 py-3 text-right flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">{item.question}</span>
              {expandedItems.has(index) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedItems.has(index) && (
              <div className="px-4 pb-3 border-t">
                <div 
                  className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
