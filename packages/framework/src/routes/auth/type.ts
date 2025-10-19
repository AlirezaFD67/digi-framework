export interface AuthTokenRequest {
  username: string; // title: Username, minLength: 1
  password: string; // title: Password, minLength: 1
}

export interface AuthTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface OTPVerificationRequest {
  userPhone: string;
  userOTP: string;
}

export interface OTPVerificationResponse {
  "username": string,
  "userPassword": string,
  "token": string,
  "userExistance": boolean
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user_id: number;
  email: string;
}



