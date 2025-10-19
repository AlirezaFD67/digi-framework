// ============================================================================
// IMPORTS
// ============================================================================

import type { IAdminLearningListItem, GetAdminLearningListParams } from "./type";
import type { APIHttpPaginatedType } from "../../types";
import API_ENDPOINTS from "../../utils/api-endpoints";
import APIHttp from "../../utils/api-http";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_PAGE_NO = 1;
const DEFAULT_ROW_COUNT = 10;

// ============================================================================
// ARTICLE LIST FUNCTIONS
// ============================================================================

export function GetAdminLearningList(
  params?: GetAdminLearningListParams,
): Promise<APIHttpPaginatedType<IAdminLearningListItem>> {
  const { isAccepted, pageNo = DEFAULT_PAGE_NO, rowCount = DEFAULT_ROW_COUNT, itmTitle } = params || {};
  
  return APIHttp.get(API_ENDPOINTS.ARTICLES.ADMIN_LEARNING_LIST, {
    params: {
      pageNo,
      rowCount,
      ...(typeof isAccepted === "number" ? { isAccepted } : {}),
      ...(itmTitle ? { itmTitle } : {}),
    },
  });
}

export function GetLearningCategoryList(): Promise<APIHttpPaginatedType<any>> {
  return APIHttp.get(API_ENDPOINTS.ARTICLES.GET_LEARNING_CAT_LIST);
}

// ============================================================================
// ARTICLE DETAIL FUNCTIONS
// ============================================================================

export function GetAdminLearningDetail(id: string): Promise<{ data: any }> {
  const url = `${API_ENDPOINTS.ARTICLES.ADMIN_LEARNING_DETAIL}?itmID=${id}`;
  
  return APIHttp.get(url);
}

export function GetArticleContent(itmID: string): Promise<{ data: any }> {
  return APIHttp.get(API_ENDPOINTS.ARTICLES.ADMIN_LEARNING_BODY_DETAILS, {
    params: { itmID }
  });
}

// ============================================================================
// AUTHOR & FILE FUNCTIONS
// ============================================================================

export function GetAuthorsList(query: string = ""): Promise<APIHttpPaginatedType<any>> {
  return APIHttp.get(API_ENDPOINTS.ARTICLES.SEARCH_DOCS, {
    params: query ? { docFamily: query } : undefined,
  });
}

export function GetArticleFiles(itmID: string): Promise<{ data: any }> {
  return APIHttp.get(API_ENDPOINTS.ARTICLES.ADMIN_FILE_MANAGER_LIST, {
    params: { itmID }
  });
}

