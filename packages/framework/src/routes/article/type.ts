// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// ============================================================================
// ARTICLE LIST & DISPLAY INTERFACES
// ============================================================================

export interface IAdminLearningListItem {
  itm_ID: string;
  cat_ID: number;
  itm_Cat: string;
  itm_Title: string;
  itm_Minimal: string;
  img_Path: string;
  itm_Img: string;
  itm_View: number;
  DateOfCreation: string;
  itm_Acc: number;
}

export interface IArticle {
  itm_Title: string;
  itm_Minimal: string;
  img_Path: string;
  itm_Img: string;
  itm_View: number;
  itm_Acc: number;
  itm_Desc: string;
}

// ============================================================================
// ARTICLE CREATION & UPDATE INTERFACES
// ============================================================================

export interface IAddArticleRequest {
  catID: number;
  itmTitle: string;
  itmSlug: string;
}

export interface IAddArticleDetailsRequest {
  catID: number;
  itmTitle: string;
  itmID: string;
  narID: number;
  docID: number;
  readTime?: string;
  itmMetaDesc: string;
  itmSlug: string;
  itmMinimal: string;
  coverImage?: File | null;
  thumbImage?: File | null;
}

// ============================================================================
// CONTENT MANAGEMENT INTERFACES
// ============================================================================

export interface ISaveContentRequest {
  itmID: string;
  itmDesc: string;
}

// ============================================================================
// ARTICLE ACCEPTANCE INTERFACES
// ============================================================================

export interface AcceptLearningRequest {
  itmID: string;
  isAccepted: number;
}

export interface AcceptLearningResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// QUERY PARAMETERS INTERFACES
// ============================================================================

export interface GetAdminLearningListParams {
  isAccepted?: number;
  pageNo?: number;
  rowCount?: number;
  itmTitle?: string;
}

