export interface AuthTokenRequest {
  username: string; // title: Username, minLength: 1
  password: string; // title: Password, minLength: 1
}

export type AuthTokenResponse = "NULL"

export interface OTPVerificationRequest {
  userPhone: string;
  userOTP: string;
}

export interface OTPVerificationResponse {
  userPhone: string;
  userOTP: string;
}



