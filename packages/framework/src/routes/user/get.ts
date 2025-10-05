import { API_ENDPOINTS, APIHttp } from "../../utils";
import { IUserProfile } from "./type";
import { APIHttpType, BaseResponseType } from "../../types";

export function GetUserProfile(): Promise<APIHttpType<IUserProfile>> {
  return APIHttp.get<BaseResponseType<IUserProfile>>(API_ENDPOINTS.USER.PROFILE);
}
