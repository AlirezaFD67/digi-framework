// ============================================================================
// IMPORTS
// ============================================================================

import { useGenericQuery } from "../../utils/generic-query";
import { useGenericMutation } from "../../utils/generic-mutation";
import { GetDoctors } from "./get";
import { insertDoctorProfile } from "./post";
import { GetDoctorsParams, GetDoctorsResponse, IInsertDoctorProfileRequest, IInsertDoctorProfileResponse } from "./type";
import { APIHttpType } from "../../types";

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

// ============================================================================
// DOCTOR PROFILE MUTATION HOOKS
// ============================================================================

export const useInsertDoctorProfileMutation = () => {
  return useGenericMutation<APIHttpType<IInsertDoctorProfileResponse>, IInsertDoctorProfileRequest>(
    insertDoctorProfile,
    ["doctor-profile"], // queryKey for invalidation
    {
      onSuccess: () => {
        // Invalidate doctors list to refresh data
        // Note: You might want to add query invalidation here if you have a query client context
      }
    }
  );
};

