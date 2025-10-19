// ============================================================================
// IMPORTS
// ============================================================================

import { useGenericQuery } from "../../utils/generic-query";
import { useGenericMutation } from "../../utils/generic-mutation";

import {
  GetAdminLearningList,
  GetAdminLearningDetail,
  GetLearningCategoryList,
  GetAuthorsList,
  GetArticleFiles,
  GetArticleContent,
} from "./get";

import {
  addArticle,
  updateArticle,
  addArticleDetails,
  saveArticleContent,
} from "./post";

import { AcceptLearning } from "./update";
import type { GetAdminLearningListParams } from "./type";

// ============================================================================
// ARTICLE LIST QUERIES
// ============================================================================

export const useAdminLearningListQuery = (params?: GetAdminLearningListParams) =>
  useGenericQuery(
    () => GetAdminLearningList(params),
    [
      "get-admin-learning-list", 
      String(params?.isAccepted ?? "all"),
      String(params?.pageNo ?? 1),
      String(params?.rowCount ?? 10),
      String(params?.itmTitle ?? "")
    ]
  );

export const useAdminCategoryListQuery = () =>
  useGenericQuery(GetLearningCategoryList, ["get-admin-learning-categories"]);

export const useAuthorsListQuery = (query?: string) =>
  useGenericQuery(
    () => GetAuthorsList(query ?? ""),
    ["get-admin-learning-authors", String(query ?? "")]
  );

// ============================================================================
// ARTICLE DETAIL QUERIES
// ============================================================================

export const useAdminLearningDetail = (id: string) =>
  useGenericQuery(
    () => GetAdminLearningDetail(id),
    ["get-admin-learning-detail", id],
    { enabled: Boolean(id && id !== "0") }
  );

export const useArticleFilesList = (itmID: string) =>
  useGenericQuery(
    () => GetArticleFiles(itmID),
    ["get-article-files", itmID],
    { enabled: Boolean(itmID && itmID !== "0") }
  );

export const useArticleContent = (itmID: string) =>
  useGenericQuery(
    () => GetArticleContent(itmID),
    ["get-article-content", itmID],
    { enabled: Boolean(itmID && itmID !== "0") }
  );

// ============================================================================
// ARTICLE MUTATIONS
// ============================================================================

export const useAddAdminLearningList = () =>
  useGenericMutation(addArticle, ["addArticle"]);

export const useUpdateAdminLearningList = () =>
  useGenericMutation(updateArticle, ["updateArticle"]);

export const useAddArticleDetails = () =>
  useGenericMutation(addArticleDetails, ["addArticleDetails"]);

export const useSaveArticleContent = () =>
  useGenericMutation(saveArticleContent, ["saveArticleContent"]);

export const useAcceptLearningMutation = () =>
  useGenericMutation(AcceptLearning, ["get-admin-learning-list"]);

