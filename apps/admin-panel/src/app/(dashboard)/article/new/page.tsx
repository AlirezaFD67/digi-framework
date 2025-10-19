"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ArticleForm from "../_sections/article-form";
import {
  useAddAdminLearningList,
  useAddArticleDetails,
  useAdminLearningDetail,
  type IAddArticleDetailsRequest,
  type IAddArticleRequest,
} from "@workspace/framework";
import { useToast } from "@workspace/custom-ui";

// ============================================================================
// COMPONENT
// ============================================================================

export default function CreateArticlePage() {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const router = useRouter();
  const { success, error } = useToast();
  const addBaseMutation = useAddAdminLearningList();
  const addDetailsMutation = useAddArticleDetails();

  const [articleId, setArticleId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return sessionStorage.getItem("article:create:itmID") || "";
    } catch {
      return "";
    }
  });

  const {
    data: articleData,
    refetch: refetchArticle,
  } = useAdminLearningDetail(articleId);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSaveBasic = async (basicData: any): Promise<string> => {
    const payload: IAddArticleRequest = {
      catID: parseInt(String(basicData.catID ?? "0")),
      itmTitle: String(basicData.itmTitle ?? ""),
      itmSlug: String(basicData.itmSlug ?? ""),
    };
    
    const res: any = await addBaseMutation.mutateAsync(payload);
    const id = String(
      res?.data?.entries?.itmID ??
        res?.data?.entries?.itm_ID ??
        res?.data?.itmID ??
        res?.data?.itm_ID ??
        res?.data?.id ??
        res?.itmID ??
        res?.itm_ID ??
        res?.id ??
        ""
    );
    
    if (!id) {
      error("دریافت شناسه مقاله پس از ایجاد ناموفق بود");
      throw new Error("Missing itm_ID in response");
    }
    
    setArticleId(id);
    try {
      sessionStorage.setItem("article:create:itmID", id);
    } catch {}
    
    return id;
  };

  const handleSaveDetails = async (
    detailsData: any,
    itmID: string
  ): Promise<void> => {
    const payload: IAddArticleDetailsRequest = {
      catID: parseInt(detailsData.catID ?? "0"),
      itmTitle: detailsData.itmTitle ?? "",
      itmID: itmID || "0",
      narID: parseInt(detailsData.narID ?? "0"),
      docID: parseInt(detailsData.docID ?? "0"),
      readTime: detailsData.readTime ?? undefined,
      itmMetaDesc: detailsData.itmMetaDesc ?? "",
      itmSlug: detailsData.itmSlug ?? "",
      itmMinimal: detailsData.itmMinimal ?? "",
      coverImage: detailsData.coverImage ?? null,
      thumbImage: detailsData.thumbImage ?? null,
    };
    
    await addDetailsMutation.mutateAsync(payload);
    await refetchArticle();
  };

  // ============================================================================
  // FUNCTIONS
  // ============================================================================

  const getInitialValues = () => {
    if (!articleData?.data?.entries) return undefined;
    const entries = articleData.data.entries;
    const initial = Array.isArray(entries) ? entries[0] : entries;
    
    return {
      catID: String(initial?.cat_ID ?? ""),
      itmTitle: initial?.itm_Title ?? "",
      itmMinimal: initial?.itm_Minimal ?? "",
      itmMetaDesc: initial?.itm_MetaDesc ?? initial?.itm_Meta ?? "",
      itmSlug: initial?.itm_Slug ?? initial?.itmSlug ?? "",
      narID: String(initial?.nar_ID ?? "0"),
      docID: String(initial?.doc_ID ?? "0"),
      readTime: initial?.readTime ?? "",
      coverImageUrl: (() => {
        const base = initial?.imgPath ?? initial?.img_Path ?? "";
        const name = initial?.itmImg ?? initial?.itm_Img ?? "";
        return name ? `${base}${name}.webp` : "";
      })(),
      thumbImageUrl: (() => {
        const base = initial?.imgPath ?? initial?.img_Path ?? "";
        const name = initial?.itmThumb ?? initial?.itm_Thumb ?? "";
        return name ? `${base}${name}.webp` : "";
      })(),
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ایجاد مقاله جدید</h1>
        <p className="text-muted-foreground">مقاله خود را گام به گام ایجاد کنید</p>
      </div>
      
      <ArticleForm
        onSaveBasic={handleSaveBasic}
        onSaveDetails={handleSaveDetails}
        mode="create"
        initialArticleId={articleId}
        initialValues={getInitialValues()}
      />
    </div>
  );
}

