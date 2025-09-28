"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  clearAuthTokens,
  isAuthenticated,
  useCreateAuthTokenMutation,
  useUserProfileQuery,
  useVerifyOTPMutation,
  HookOptions
} from "@workspace/framework";

import { AuthContext } from "./auth-context";


// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Props = {
  children: React.ReactNode;
  loginRoute?:string
  appRoute?:string
};

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export type JWTContextType = {
  user: null;
  method: string;
  loading: boolean;
  isAuthenticated: boolean;
  loginRoute?: string;
  appRoute?: string;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (data: { username: string; password: string }) => Promise<any>;
  verifyOTP: (data: { userPhone: string; userOTP: string }) => Promise<any>;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const initialState = {
  user: null,
  loading: true,
};

// ============================================================================
// REDUCER
// ============================================================================

const reducer = (state: any, action: any) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AuthProvider({ children, loginRoute, appRoute }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isClient, setIsClient] = useState(false);
  const createTokenMutation = useCreateAuthTokenMutation();
  const verifyOTPMutation = useVerifyOTPMutation();
  const { data: profileData, isLoading: profileLoading } = useUserProfileQuery({ enabled: isAuthenticated() });
  
  const initialize = useCallback(async () => {
    const handleError = (error: any) => {
      dispatch({ type: Types.INITIAL, payload: { user: null } });
    };

    try {
      const token = getAuthToken();

      if (!token || !isAuthenticated()) {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
        return;
      }

      if (profileData && !profileLoading) {
        const user = profileData.data;
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: user,
          },
        });
      }
    } catch (error) {
      handleError(error);
    }
  }, [profileData, profileLoading]);

  useEffect(() => {
    setIsClient(true);

    const timer = setTimeout(() => {
      initialize();
    }, 100);

    return () => clearTimeout(timer);
  }, [initialize]);

  const loginWithToken = useCallback(
    async (data: { username: string; password: string }) => {
      console.log("Login data received:", data);
      try {
        const res = await createTokenMutation.mutateAsync(data);
        const success = res.status === 200;

        if (success) {
          console.log("Login successful:", res.data);
          // When login is successful (status 200), OTP code is sent
          // The user should now enter the OTP code they received
          // No token is set yet - that happens after OTP verification
        }

        return res.data;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [createTokenMutation]
  );

  const verifyOTP = useCallback(
    async (data: { userPhone: string; userOTP: string }) => {
      console.log("OTP verification data received:", data);
      try {
        const res = await verifyOTPMutation.mutateAsync(data);
        const success = res.status === 201;

        if (success) {
          console.log("OTP verified successfully:", res.data);
          // After successful OTP verification, complete the authentication
          // You can set a session token or user data here
          // For now, we'll just log success - you can add more logic as needed
        }

        return res.data;
      } catch (error) {
        console.error("OTP verification failed:", error);
        throw error;
      }
    },
    [verifyOTPMutation]
  );

  const logout = useCallback(async () => {
    clearAuthTokens();
    dispatch({
      type: Types.LOGOUT,
    });
    window?.location.reload();
  }, []);

  const status = state.loading ? "loading" : state.user;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading" || !isClient,
      isAuthenticated: state.user,
      loginRoute,
      appRoute,
      loginWithToken,
      verifyOTP,
      logout,
      initialize,
    }),
    [initialize, loginWithToken, verifyOTP, logout, state.user, status, isClient, loginRoute, appRoute]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
