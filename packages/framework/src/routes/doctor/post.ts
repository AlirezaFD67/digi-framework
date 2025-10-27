// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { IInsertDoctorProfileRequest, IInsertDoctorProfileResponse } from "./type";
import { APIHttpType } from "../../types";

// ============================================================================
// DOCTOR PROFILE FUNCTIONS
// ============================================================================

export function insertDoctorProfile(profileData: IInsertDoctorProfileRequest): Promise<APIHttpType<IInsertDoctorProfileResponse>> {
  return APIHttp.post(API_ENDPOINTS.DOCTOR_PROFILE.INSERT, profileData);
}
