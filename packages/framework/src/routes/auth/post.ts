import { API_ENDPOINTS, APIHttp } from "../../utils";
import { AuthTokenRequest, AuthTokenResponse, OTPVerificationRequest, OTPVerificationResponse } from "./type";
import { APIHttpType, BaseResponseType } from "../../types";

export function CreateAuthToken(
  payload: AuthTokenRequest
): Promise<APIHttpType<AuthTokenResponse>> {
  
  return APIHttp.post<BaseResponseType<AuthTokenResponse>>(API_ENDPOINTS.AUTH_TOKEN.CREATE, {
    username: payload.username,
    password: "0",
  });
}

export function VerifyOTP(
  payload: OTPVerificationRequest
): Promise<APIHttpType<OTPVerificationResponse>> {
  
  return APIHttp.post<BaseResponseType<OTPVerificationResponse>>(API_ENDPOINTS.AUTH.OTP_VERIFY, payload);
}


