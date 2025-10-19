// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import type { IUploadChunkRequest } from "./type";

// ============================================================================
// FUNCTIONS
// ============================================================================

export async function UploadFileChunked({
  file,
  resourceId = "",
  chunkSize = 5 * 1024 * 1024,
  onProgress,
}: IUploadChunkRequest): Promise<void> {
  const totalChunks = Math.ceil(file.size / chunkSize);
  let uploadedChunks = 0;

  const uploadChunk = async (chunkIndex: number) => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunk = file.slice(start, end);
    
    const formData = new FormData();

    // فایل (تیکه chunk)
    formData.append("selectedFile", chunk, file.name);

    // بقیه دیتا به شکل JSON
    await APIHttp.post(API_ENDPOINTS.FILE.UPLOAD_CHUNK, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params:{
        itmID: resourceId,
        chunkIndex: chunkIndex,
        totalChunks: totalChunks,
        originalFilename: file.name,
      }
    });
    
    uploadedChunks++;
    if (onProgress)
      onProgress(Math.round((uploadedChunks / totalChunks) * 100));
  };

  // آپلود چانک‌ها به ترتیب (sequential)
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    await uploadChunk(chunkIndex);
  }
}

