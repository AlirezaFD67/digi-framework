// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface IUploadChunkRequest {
  file: File;
  resourceId?: string;
  chunkSize?: number;
  onProgress?: (percent: number) => void;
}

export interface IUploadChunkResponse {
  result?: any;
}

