// ============================================================================
// IMPORTS
// ============================================================================

import { useGenericQuery } from "../../utils/generic-query";
import { GetDoctors } from "./get";
import { GetDoctorsParams, GetDoctorsResponse } from "./type";

// ============================================================================
// HOOKS
// ============================================================================

export const useDoctorsListQuery = (searchTerm?: string) => {
  const params: GetDoctorsParams | undefined = searchTerm ? { docFamily: searchTerm } : undefined;
  
  return useGenericQuery<GetDoctorsResponse>(
    () => GetDoctors(params),
    ["get-doctors", searchTerm || "all"]
  );
};

