// ============================================================================
// IMPORTS
// ============================================================================

import { useGenericMutation } from "../../utils/generic-mutation";
import { UploadFileChunked } from "./post";

// ============================================================================
// HOOKS
// ============================================================================

export function useGlobalFileUploadMutation(
  queryKey: readonly string[] = ["file-upload"]
) {
  return useGenericMutation(
    async ({ file, resourceId, onProgress, chunkSize }: any) => {
      await UploadFileChunked({ file, resourceId, chunkSize, onProgress });
      return { ok: true } as const;
    },
    queryKey
  );
}

