import { API_ENDPOINTS, APIHttp } from "../../utils";
import { 
  AuthTokenRequest, 
  AuthTokenResponse, 
  OTPVerificationRequest, 
  OTPVerificationResponse,
  AdminLoginRequest,
  AdminLoginResponse
} from "./type";
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

export function AdminLogin(
  payload: AdminLoginRequest
): Promise<APIHttpType<AdminLoginResponse>> {
  
  return APIHttp.post<BaseResponseType<AdminLoginResponse>>(API_ENDPOINTS.ADMIN_TOKEN.CREATE, payload);
}


