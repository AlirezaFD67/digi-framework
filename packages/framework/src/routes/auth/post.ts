import { API_ENDPOINTS, apiPost } from "../../utils";
import { AxiosResponse } from "axios";
import { AuthTokenRequest, AuthTokenResponse, OTPVerificationRequest, OTPVerificationResponse } from "./type";

export function CreateAuthToken(
  payload: AuthTokenRequest
): Promise<AxiosResponse<AuthTokenResponse>> {
  return apiPost<AuthTokenResponse>(API_ENDPOINTS.AUTH_TOKEN.CREATE, {
    username: payload.username,
    password: "0",
  });
}

export function VerifyOTP(
  payload: OTPVerificationRequest
): Promise<AxiosResponse<OTPVerificationResponse>> {
  return apiPost<OTPVerificationResponse>(API_ENDPOINTS.AUTH.OTP_VERIFY, payload);
}


