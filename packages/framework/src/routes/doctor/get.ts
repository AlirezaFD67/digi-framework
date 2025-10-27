// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { GetDoctorsParams, GetDoctorsResponse, IDoctorProfile } from "./type";
import { APIHttpType, BaseResponseType } from "../../types";

// ============================================================================
// FUNCTIONS
// ============================================================================

export const GetDoctors = async (params?: GetDoctorsParams): Promise<GetDoctorsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.docFamily) {
    searchParams.append("docFamily", params.docFamily);
  }

  const url = `${API_ENDPOINTS.DOCTORS.GET_DOCTORS}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  return APIHttp.get(url);
};

export const GetDoctorProfile = (): Promise<APIHttpType<IDoctorProfile[]>> => {
  return APIHttp.get<BaseResponseType<IDoctorProfile[]>>(API_ENDPOINTS.DOCTOR_PROFILE.GET_PROFILE);
};

