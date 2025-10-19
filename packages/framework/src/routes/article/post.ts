// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { IAddArticleRequest, IAddArticleDetailsRequest, ISaveContentRequest } from "./type";
import { APIHttpType } from "../../types";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// ============================================================================
// ARTICLE MANAGEMENT FUNCTIONS
// ============================================================================

export function addArticle(articleData: IAddArticleRequest): Promise<APIHttpType<string>> {
  return APIHttp.post(API_ENDPOINTS.ARTICLES.ADD_ARTICLE, articleData);
}

export function updateArticle(articleData: IAddArticleRequest): Promise<APIHttpType<string>> {
  return APIHttp.put(API_ENDPOINTS.ARTICLES.UPDATE_ARTICLE, articleData);
}

export function saveArticleContent(contentData: ISaveContentRequest): Promise<APIHttpType<string>> {
  return APIHttp.put(API_ENDPOINTS.ARTICLES.SAVE_CONTENT, contentData);
}

// ============================================================================
// ARTICLE DETAILS FUNCTIONS
// ============================================================================

export function addArticleDetails(details: IAddArticleDetailsRequest): Promise<APIHttpType<string>> {
  const formData = new FormData();
  formData.append('catID', String(details.catID));
  formData.append('itmTitle', details.itmTitle);
  formData.append('itmID', details.itmID);
  formData.append('narID', String(details.narID));
  formData.append('docID', String(details.docID));
  if (typeof details.readTime === 'string' && details.readTime.trim() !== '') {
    formData.append('readTime', details.readTime.trim());
  }
  formData.append('itmMetaDesc', details.itmMetaDesc);
  formData.append('itmSlug', details.itmSlug);
  formData.append('itmMinimal', details.itmMinimal);
  
  if (details.coverImage) formData.append('coverImage', details.coverImage);
  if (details.thumbImage) formData.append('thumbImage', details.thumbImage);

  return APIHttp.put(API_ENDPOINTS.ARTICLES.ADD_ARTICLE_BASE2, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ============================================================================
// FILE UPLOAD FUNCTIONS
// ============================================================================

export function uploadArticleThumbnail(thumbnail: File): Promise<APIHttpType<any>> {
  const formData = new FormData();
  formData.append("thumbnail", thumbnail);

  return APIHttp.post(API_ENDPOINTS.ARTICLES.UPLOAD_THUMBNAIL, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export function uploadArticleFile(selectedFile: File, itmID: string): Promise<any> {
  const formData = new FormData();

  formData.append('selectedFile', selectedFile);

  formData.append(
    'data',
    JSON.stringify({
      itmID: itmID,
      chunkIndex: 0,
      totalChunks: 1,
      originalFilename: selectedFile.name,
    })
  );
  
  return APIHttp.post(API_ENDPOINTS.ARTICLES.UPLOAD_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export async function uploadArticleFileChunked(
  selectedFile: File,
  itmID: string,
  chunkSize = DEFAULT_CHUNK_SIZE,
  onProgress?: (percent: number) => void
): Promise<void> {
  const totalChunks = Math.ceil(selectedFile.size / chunkSize);
  let uploadedChunks = 0;

  const uploadChunk = async (chunkIndex: number) => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(selectedFile.size, start + chunkSize);
    const chunk = selectedFile.slice(start, end);
    
    const formData = new FormData();

    formData.append('selectedFile', chunk, selectedFile.name);

    formData.append(
      'data',
      JSON.stringify({
        itmID: itmID,
        chunkIndex: chunkIndex,
        totalChunks: totalChunks,
        originalFilename: selectedFile.name,
      })
    );
    
    await APIHttp.post(API_ENDPOINTS.ARTICLES.UPLOAD_FILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    uploadedChunks++;
    if (onProgress) {
      onProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }
  };

  // آپلود چانک‌ها به ترتیب (sequential)
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    await uploadChunk(chunkIndex);
  }
}

