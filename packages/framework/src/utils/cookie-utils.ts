import cookies from "js-cookie";

/**
 * Cookie utility functions for managing authentication tokens and other cookies
 * Works in both client and server environments
 */

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

/**
 * Set a cookie with optional configuration
 */
export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  if (typeof window === "undefined") return;

  const defaultOptions: CookieOptions = {
    expires: 7, // 7 days default
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  };

  cookies.set(name, value, defaultOptions);
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof window === "undefined") return undefined;
  return cookies.get(name);
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string, options?: Pick<CookieOptions, "path" | "domain">): void => {
  if (typeof window === "undefined") return;
  
  cookies.remove(name, {
    path: "/",
    ...options,
  });
};

/**
 * Update a cookie value (same as setCookie but with clearer intent)
 */
export const updateCookie = (
  name: string,
  value: string,
  options?: CookieOptions
): void => {
  setCookie(name, value, options);
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  if (typeof window === "undefined") return false;
  return cookies.get(name) !== undefined;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  return cookies.get();
};

/**
 * Clear all cookies (use with caution)
 */
export const clearAllCookies = (): void => {
  if (typeof window === "undefined") return;
  
  const allCookies = getAllCookies();
  Object.keys(allCookies).forEach(cookieName => {
    deleteCookie(cookieName);
  });
};

/**
 * Set authentication token with standard configuration
 */
export const setAuthToken = (token: string, options?: CookieOptions): void => {
  setCookie("auth_token", token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  });
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | undefined => {
  return getCookie("auth_token");
};

/**
 * Remove authentication token
 */
export const removeAuthToken = (): void => {
  deleteCookie("auth_token");
};

/**
 * Set refresh token with longer expiration
 */
export const setRefreshToken = (token: string, options?: CookieOptions): void => {
  setCookie("refresh_token", token, {
    expires: 30, // 30 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  });
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return getCookie("refresh_token");
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = (): void => {
  deleteCookie("refresh_token");
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  removeAuthToken();
  removeRefreshToken();
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== undefined && token.length > 0;
};

/**
 * Set session storage (alternative to cookies for temporary data)
 */
export const setSessionStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, value);
};

/**
 * Get session storage
 */
export const getSessionStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(key);
};

/**
 * Remove session storage
 */
export const removeSessionStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
};

/**
 * Set local storage
 */
export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
};

/**
 * Get local storage
 */
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

/**
 * Remove local storage
 */
export const removeLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

/**
 * Clear all storage (cookies, session, local)
 */
export const clearAllStorage = (): void => {
  if (typeof window === "undefined") return;
  
  clearAllCookies();
  sessionStorage.clear();
  localStorage.clear();
};

