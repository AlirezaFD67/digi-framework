import { useGenericMutation } from "../../utils/generic-mutation";
import { CreateAuthToken, VerifyOTP } from "./post";
import { AuthTokenRequest, AuthTokenResponse, OTPVerificationRequest, OTPVerificationResponse } from "./type";
import { APIHttpType } from "../../types";

export const useCreateAuthTokenMutation = ():APIHttpType<AuthTokenResponse>=> {
  return useGenericMutation<AuthTokenResponse, AuthTokenRequest>(
    async (data): Promise<AuthTokenResponse> => {
      const response = await CreateAuthToken(data);
      if (response.data.entries) {
        return response.data.entries;
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

  export const useVerifyOTPMutation = (): APIHttpType<OTPVerificationResponse>=>  {
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