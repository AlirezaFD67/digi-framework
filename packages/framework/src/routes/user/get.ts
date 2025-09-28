import { API_ENDPOINTS, apiGet } from "../../utils";
import { AxiosResponse } from "axios";
import { IUserProfile } from "./type";

export function GetUserProfile(): Promise<AxiosResponse<IUserProfile>> {
  return apiGet<IUserProfile>(API_ENDPOINTS.USER.PROFILE);
}
