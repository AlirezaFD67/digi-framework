// ============================================================================
// IMPORTS
// ============================================================================

import APIHttp from "../../utils/api-http";
import API_ENDPOINTS from "../../utils/api-endpoints";
import { GetDoctorsParams, GetDoctorsResponse } from "./type";

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

