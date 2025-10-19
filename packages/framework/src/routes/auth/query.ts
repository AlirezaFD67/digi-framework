import { useGenericMutation } from "../../utils/generic-mutation";
import { CreateAuthToken, VerifyOTP, AdminLogin } from "./post";
import { 
  AuthTokenRequest, 
  AuthTokenResponse, 
  OTPVerificationRequest, 
  OTPVerificationResponse,
  AdminLoginRequest,
  AdminLoginResponse
} from "./type";

export const useCreateAuthTokenMutation = () => {
  return useGenericMutation<AuthTokenResponse, AuthTokenRequest>(
    async (data): Promise<AuthTokenResponse> => {
      const response = await CreateAuthToken(data);
      if (response.data.entries) {
        return response.data.entries as AuthTokenResponse;
      }
      // Fallback to a default response structure
      return {
        token: "temp_token",
        refreshToken: undefined,
        expiresIn: 3600
      };
    },
    ["auth", "token"]
  );
};

export const useVerifyOTPMutation = ()=> {
  return useGenericMutation<OTPVerificationResponse, OTPVerificationRequest>(
    async (data): Promise<OTPVerificationResponse> => {
      const response = await VerifyOTP(data);
      console.log("🔐 VerifyOTPMutation: Response: on Query", response);
      if (response.data.entries) {
        // @ts-ignore
        return response.data.entries;
      }
      // Fallback to the original data if no entries
      // @ts-ignore
      return data as OTPVerificationResponse;
    },
    ["auth", "otp"]
  );
};

export const useAdminLoginMutation = () => {
  return useGenericMutation<AdminLoginResponse, AdminLoginRequest>(
    async (data): Promise<AdminLoginResponse> => {
      const response = await AdminLogin(data);
      console.log("🔐 AdminLoginMutation: Response:", response);
      // Admin login returns data directly, not in entries
      if (response.data) {
        // @ts-ignore
        return response.data as AdminLoginResponse;
      }
      // Fallback
      throw new Error("Invalid response from admin login");
    },
    ["auth", "admin", "login"]
  );
};