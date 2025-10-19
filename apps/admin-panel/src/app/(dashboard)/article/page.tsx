"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useEffect, useState, useCallback } from "react";

import ArticlesListView from "./_sections/articles-list.view";
import { SearchInput } from "@workspace/custom-ui";

// ============================================================================
// COMPONENT
// ============================================================================

export default function ArticlePage() {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const [searchTerm, setSearchTerm] = useState<string>("");

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // ============================================================================
  // SCROLL RESTORE
  // ============================================================================

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("article:list:scroll") || "0";
    window.scrollTo(0, parseInt(savedScroll, 10));
    return () => {
      sessionStorage.setItem("article:list:scroll", String(window.scrollY));
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">مقاله‌ها</h1>
        <p className="text-muted-foreground">مدیریت و نمایش مقالات سیستم</p>
      </div>
      
      <SearchInput 
        onSearchChange={handleSearchChange}
        placeholder="جستجو در عنوان مقالات..."
      />
      
      <ArticlesListView searchTerm={searchTerm} />
    </div>
  );
}

