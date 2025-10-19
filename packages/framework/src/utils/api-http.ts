import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { APIError, APIHttpType, BaseResponseType } from "../types";
import { getAuthToken, clearAuthTokens } from "./cookie-utils";

/**
 * HTTP Client configuration
 */
const APIHttp: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT + "/api",
  timeout: 70000,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Debug: Log API configuration
// console.log("🌐 APIHttp: Base URL configured as:", process.env.NEXT_PUBLIC_REST_API_ENDPOINT + "/api");
// console.log("🌐 APIHttp: Environment variable:", process.env.NEXT_PUBLIC_REST_API_ENDPOINT);

/**
 * Request interceptor - Add authentication token
 */
APIHttp.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookie utilities
    const token = getAuthToken();

    // console.log("📤 APIHttp: Request interceptor - URL:", config.url);
    // console.log("📤 APIHttp: Request interceptor - Method:", config.method);
    // console.log("📤 APIHttp: Request interceptor - Data:", config.data);
    // console.log("📤 APIHttp: Request interceptor - Token:", token ? "Present" : "None");

    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("💥 APIHttp: Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors and notifications
 */
APIHttp.interceptors.response.use(
  (response: AxiosResponse) => {
    // // Handle successful responses
    // console.log("📥 APIHttp: Response interceptor - Status:", response.status);
    // console.log("📥 APIHttp: Response interceptor - URL:", response.config.url);
    // console.log("📥 APIHttp: Response interceptor - Data:", response.data);
    return response;
  },
  (error) => {
    // Handle error responses
    // console.error("💥 APIHttp: Response interceptor - Error occurred:", error);
    // console.error("💥 APIHttp: Response interceptor - Error response:", error.response);
    // console.error("💥 APIHttp: Response interceptor - Error status:", error.response?.status);
    // console.error("💥 APIHttp: Response interceptor - Error data:", error.response?.data);
    
    const apiError: APIError = {
      message: error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
      code: error.response?.data?.code,
    };

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth tokens and redirect to login
      console.log("🔐 APIHttp: 401 Unauthorized - clearing tokens");
      clearAuthTokens();
      if (typeof window !== "undefined") {
        // You can dispatch a logout action here or redirect to login
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      // Forbidden - show access denied message
      console.error("🚫 APIHttp: Access denied:", apiError.message);
    }

    if (error.response?.status >= 500) {
      // Server error - show generic error message
      console.error("🔥 APIHttp: Server error:", apiError.message);
    }

    // You can integrate with toast notifications here
    // toast.error(apiError.message);

    return Promise.reject(apiError);
  }
);

/**
 * Generic GET request
 */
export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<APIHttpType<T>> => {
  return APIHttp.get<BaseResponseType<T>>(url, config);
};

/**
 * Generic POST request
 */
export const apiPost = <T, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig
): Promise<APIHttpType<T>> => {
  return APIHttp.post<BaseResponseType<T>>(url, data, config);
};

/**
 * Generic PUT request
 */
export const apiPut = <T, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig
): Promise<APIHttpType<T>> => {
  return APIHttp.put<BaseResponseType<T>>(url, data, config);
};

/**
 * Generic PATCH request
 */
export const apiPatch = <T, D = any>(
  url: string, 
  data?: D, 
  config?: AxiosRequestConfig
): Promise<APIHttpType<T>> => {
  return APIHttp.patch<BaseResponseType<T>>(url, data, config);
};

/**
 * Generic DELETE request
 */
export const apiDelete = <T>(url: string, config?: AxiosRequestConfig): Promise<APIHttpType<T>> => {
  return APIHttp.delete<BaseResponseType<T>>(url, config);
};

/**
 * Upload file with progress tracking
 */
export const apiUpload = <T>(
  url: string,
  formData: FormData,
  onUploadProgress?: (progressEvent: any) => void
): Promise<APIHttpType<T>> => {
  return APIHttp.post<BaseResponseType<T>>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export default APIHttp;
