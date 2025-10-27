// ============================================================================
// IMPORTS
// ============================================================================

import { useGenericQuery } from "../../utils/generic-query";
import { useGenericMutation } from "../../utils/generic-mutation";
import { GetDoctors, GetDoctorProfile } from "./get";
import { insertDoctorProfile } from "./post";
import { GetDoctorsParams, GetDoctorsResponse, IInsertDoctorProfileRequest, IInsertDoctorProfileResponse, IDoctorProfile } from "./type";
import { APIHttpType, HookOptions } from "../../types";

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

export const useDoctorProfileQuery = (options?: HookOptions) => {
  return useGenericQuery<APIHttpType<IDoctorProfile[]>>(
    () => GetDoctorProfile(),
    ["doctor", "profile"], 
    options
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

