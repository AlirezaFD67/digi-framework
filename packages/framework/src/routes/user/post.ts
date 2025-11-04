// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { IUpdateUserProfileRequest, IUpdateUserProfileResponse } from "./type";
import { APIHttpType } from "../../types";

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

export function updateUserProfile(profileData: IUpdateUserProfileRequest): Promise<APIHttpType<IUpdateUserProfileResponse>> {
  return APIHttp.post(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
}

