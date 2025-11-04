"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  setAuthToken,
  clearAuthTokens,
  isAuthenticated,
  useCreateAuthTokenMutation,
  useUserProfileQuery,
  useDoctorProfileQuery,
  useVerifyOTPMutation,
  useAdminLoginMutation,
  IUserProfile,
  IDoctorProfile,
} from "@workspace/framework";

import { AuthContext } from "./auth-context";
import { useModalContext } from "../modal-context";
import { OTPLoginForm, AdminLoginForm } from "../../components/auth";


// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Props = {
  children: React.ReactNode;
  loginRoute?: string;
  appRoute?: string;
  userType?: "admin" | "user" | "doctor";
};

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

type AuthState = {
  user: IUserProfile | null;
  doctor: IDoctorProfile | null;
  loading: boolean;
};

export type WithAuthDisplayMode = "modal" | "page";

export type WithAuthOptions = {
  display?: WithAuthDisplayMode;
  modalId?: string;
  modalTitle?: string;
  modalDescription?: string;
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";
  redirectTo?: string;
  onAuthenticated?: () => void;
};

export type JWTContextType = {
  user: IUserProfile | null;
  doctor: IDoctorProfile | null;
  method: string;
  loading: boolean;
  isAuthenticated: boolean;
  loginRoute?: string;
  appRoute?: string;
  userType?: "admin" | "user" | "doctor";
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (data: { username: string; password: string }) => Promise<any>;
  verifyOTP: (data: { userPhone: string; userOTP: string }) => Promise<any>;
  loginAsAdmin: (data: { username: string; password: string }) => Promise<any>;
  withAuth: <T extends (...args: any[]) => any>(
    handler: T,
    options?: WithAuthOptions
  ) => (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | void>;
};


// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_LOGIN_MODAL_ID = "auth-login-modal";

const initialState: AuthState = {
  user: null,
  doctor: null,
  loading: true,
};

type LoginModalContentProps = {
  userType?: "admin" | "user" | "doctor";
  onSuccess: () => void;
};

function LoginModalContent({ userType, onSuccess }: LoginModalContentProps) {
  if (userType === "admin") {
    return <AdminLoginForm onSuccess={onSuccess} />;
  }

  return <OTPLoginForm onSuccess={onSuccess} />;
}


// ============================================================================
// REDUCER
// ============================================================================

const reducer = (
  state: AuthState,
  action: { type: Types; payload?: { user?: IUserProfile | null; doctor?: IDoctorProfile | null } }
): AuthState => {
  if (action.type === Types.INITIAL) {
    return {
      ...state,
      loading: false,
      user: action.payload?.user || null,
      doctor: action.payload?.doctor || null,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload?.user || null,
      doctor: action.payload?.doctor || null,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
      doctor: null,
    };
  }
  return state;
};


// ============================================================================
// COMPONENT
// ============================================================================

export function AuthProvider({ children, loginRoute, appRoute, userType }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isClient, setIsClient] = useState(false);
  const createTokenMutation = useCreateAuthTokenMutation();
  const verifyOTPMutation = useVerifyOTPMutation();
  const adminLoginMutation = useAdminLoginMutation();
  const router = useRouter();
  const { openModal, closeModal, isModalOpen } = useModalContext();

  // Conditional profile queries based on userType
  const { data: userProfileData, isLoading: userProfileLoading } = useUserProfileQuery({
    enabled: isAuthenticated() && userType !== "doctor",
  });
  const { data: doctorProfileData, isLoading: doctorProfileLoading } = useDoctorProfileQuery({
    enabled: isAuthenticated() && userType === "doctor",
  });

  // Determine which profile data to use
  const profileData = userType === "doctor" ? doctorProfileData : userProfileData;
  const profileLoading = userType === "doctor" ? doctorProfileLoading : userProfileLoading;

  const initialize = useCallback(async () => {
    const handleError = (error: any) => {
      console.error("💥 AuthProvider: initialize failed with error:", error);
      dispatch({ type: Types.INITIAL, payload: { user: null, doctor: null } });
    };

    try {
      const token = getAuthToken();
      console.log("🔐 AuthProvider: token:", token);

      if (!token || !isAuthenticated()) {
        dispatch({ type: Types.INITIAL, payload: { user: null, doctor: null } });
        return;
      }

      // If we have a valid token, we can stop the initial loading
      // Profile data can load in the background
      dispatch({ type: Types.INITIAL, payload: { user: null, doctor: null } });
      console.log("🔐 AuthProvider: profileLoading:", profileLoading);

      if (profileData && !profileLoading) {
        let userProfile: IUserProfile | null = null;
        let doctorProfile: IDoctorProfile | null = null;

        if (userType === "doctor") {
          const doctorData = profileData.data.entries[0] as IDoctorProfile;
          console.log("🔐 AuthProvider: doctor profile:", doctorData);
          doctorProfile = Array.isArray(doctorData) ? doctorData[0] || null : doctorData || null;
        } else {
          const userData = profileData.data.entries[0] as IUserProfile;
          console.log("🔐 AuthProvider: user profile:", userData);
          userProfile = Array.isArray(userData) ? userData[0] || null : userData || null;
        }

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: userProfile,
            doctor: doctorProfile,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
  }, [profileData, profileLoading, userType]);

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      initialize();
    }, 100);

    return () => clearTimeout(timer);
  }, [initialize]);

  const loginWithToken = useCallback(
    async (data: { username: string; password: string }) => {
      try {
        const res = await createTokenMutation.mutateAsync(data);

        // The response is directly the data from the mutation
        console.log("✅ AuthProvider: Login successful:", res);
        // When login is successful, OTP code is sent
        // The user should now enter the OTP code they received
        // No token is set yet - that happens after OTP verification

        return res;
      } catch (error: any) {
        console.error("💥 AuthProvider: Login failed with error:", error);
        console.error("💥 AuthProvider: Error details:", {
          message: error?.message,
          response: error?.response,
          status: error?.status,
          code: error?.code,
        });
        throw error;
      }
    },
    [createTokenMutation]
  );

  const verifyOTP = useCallback(
    async (data: { userPhone: string; userOTP: string }) => {
      try {
        console.log("📱 AuthProvider: Calling verifyOTPMutation.mutateAsync...");
        const res = await verifyOTPMutation.mutateAsync(data);
        console.log("🔐 AuthProvider: OTP verification response received:", res);

        if ((res as any).token) {
          setAuthToken((res as any).token);
        }

        return res;
      } catch (error: any) {
        console.error("💥 AuthProvider: OTP verification failed with error:", error);
        console.error("💥 AuthProvider: Error details:", {
          message: error?.message,
          response: error?.response,
          status: error?.status,
          code: error?.code,
        });
        throw error;
      }
    },
    [verifyOTPMutation]
  );

  const loginAsAdmin = useCallback(
    async (data: { username: string; password: string }) => {
      try {
        console.log("🔑 AuthProvider: Calling adminLoginMutation.mutateAsync...");
        const res = await adminLoginMutation.mutateAsync(data);
        console.log("🔐 AuthProvider: Admin login response received:", res);

        if ((res as any).token) {
          setAuthToken((res as any).token);
          console.log("✅ AuthProvider: Admin token set successfully");
        }

        return res;
      } catch (error: any) {
        console.error("💥 AuthProvider: Admin login failed with error:", error);
        console.error("💥 AuthProvider: Error details:", {
          message: error?.message,
          response: error?.response,
          status: error?.status,
          code: error?.code,
        });
        throw error;
      }
    },
    [adminLoginMutation]
  );

  const logout = useCallback(async () => {
    clearAuthTokens();
    dispatch({
      type: Types.LOGOUT,
    });
    window?.location.reload();
  }, []);

  const handleLoginSuccess = useCallback(
    async (modalId: string, options?: WithAuthOptions) => {
      closeModal(modalId);

      try {
        await initialize();
      } catch (error) {
        console.error("💥 AuthProvider: initialize after login failed:", error);
      }

      if (options?.onAuthenticated) {
        try {
          options.onAuthenticated();
        } catch (error) {
          console.error("💥 AuthProvider: onAuthenticated callback failed:", error);
        }
      }

      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
    },
    [closeModal, initialize, router]
  );

  const openLoginPrompt = useCallback(
    (modalId: string, options: WithAuthOptions = {}) => {
      if (isModalOpen(modalId)) return;

      const modalTitle = options.modalTitle || (userType === "admin" ? "ورود به حساب ادمین" : "ورود به حساب کاربری");
      const modalDescription =
        options.modalDescription ||
        (userType === "admin"
          ? "برای ادامه نام کاربری و رمز عبور خود را وارد کنید"
          : "برای ادامه وارد حساب کاربری خود شوید");
      const modalSize = options.modalSize || "lg";

      openModal({
        id: modalId,
        type: "responsive",
        // title: modalTitle,
        // description: modalDescription,
        size: modalSize,
        closable: true,
        view: (
          <LoginModalContent
            userType={userType}
            onSuccess={() => {
              handleLoginSuccess(modalId, options);
            }}
          />
        ),
      });
    },
    [handleLoginSuccess, isModalOpen, openModal, userType]
  );

  const withAuth = useCallback(
    <T extends (...args: any[]) => any>(handler: T, options: WithAuthOptions = {}) => {
      return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | void> => {
        const hasSession = isAuthenticated() || !!state.user || !!state.doctor;

        if (hasSession) {
          return Promise.resolve(handler(...args));
        }

        const firstArg = args[0] as { preventDefault?: () => void; stopPropagation?: () => void } | undefined;
        firstArg?.preventDefault?.();
        firstArg?.stopPropagation?.();

        const displayMode = options.display || "modal";

        if (displayMode === "page") {
          if (loginRoute) {
            router.push(loginRoute);
          } else {
            console.warn("⚠️ AuthProvider: loginRoute is not defined. Cannot redirect to login page.");
          }
        } else {
          const modalId = options.modalId || DEFAULT_LOGIN_MODAL_ID;
          openLoginPrompt(modalId, options);
        }

        return undefined;
      };
    },
    [loginRoute, openLoginPrompt, router, state.doctor, state.user]
  );

  // Determine loading state more precisely
  const isLoading = useMemo(() => {
    // If not on client side yet, show loading
    if (!isClient) return true;

    // If the reducer state is still loading, show loading
    if (state.loading) return true;

    // If we have a token but profile is still loading, don't show loading
    // because we can proceed with authentication
    if (isAuthenticated() && profileLoading) return false;

    // If we have a token and profile is loaded, we're done loading
    if (isAuthenticated() && !profileLoading) return false;

    // If no token, we're done loading (user is not authenticated)
    if (!isAuthenticated()) return false;

    return false;
  }, [isClient, state.loading, profileLoading]);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      doctor: state.doctor,
      method: "jwt",
      loading: isLoading,
      isAuthenticated: Boolean(state.user || state.doctor || isAuthenticated()),
      loginRoute,
      appRoute,
      userType,
      loginWithToken,
      verifyOTP,
      loginAsAdmin,
      logout,
      initialize,
      withAuth,
    }),
    [initialize, loginWithToken, verifyOTP, loginAsAdmin, logout, withAuth, state.user, state.doctor, isLoading, loginRoute, appRoute, userType]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
