import { UseMutationResult } from "@tanstack/react-query";
import { useGenericMutation } from "../../utils/generic-mutation";
import { AxiosResponse } from "axios";
import { CreateAuthToken, VerifyOTP } from "./post";
import { AuthTokenRequest, AuthTokenResponse, OTPVerificationRequest, OTPVerificationResponse } from "./type";

export const useCreateAuthTokenMutation = (): UseMutationResult<
  AxiosResponse<AuthTokenResponse>,
  Error,
  AuthTokenRequest
> => {
  return useGenericMutation<AxiosResponse<AuthTokenResponse>, AuthTokenRequest>(
    (data) => CreateAuthToken(data),
    ["auth", "token"]
  );
};

export const useVerifyOTPMutation = (): UseMutationResult<
  AxiosResponse<OTPVerificationResponse>,
  Error,
  OTPVerificationRequest
> => {
  return useGenericMutation<AxiosResponse<OTPVerificationResponse>, OTPVerificationRequest>(
    (data) => VerifyOTP(data),
    ["auth", "otp"]
  );
};