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
      console.log("🔐 AuthProvider: token:", token);
      
      if (!token || !isAuthenticated()) {
        dispatch({ type: Types.INITIAL, payload: { user: null } });
        return;
      }

      // If we have a valid token, we can stop the initial loading
      // Profile data can load in the background
      dispatch({ type: Types.INITIAL, payload: { user: null } });
      // console.log("🔐 AuthProvider: profileData:", profileData);
      // If profile data is available, use it
      // console.log("🔐 AuthProvider: profileData.data.entries:", profileData?.data.entries[0]);
      console.log("🔐 AuthProvider: profileLoading:", profileLoading);
      
      if (profileData && !profileLoading) {
        const user = profileData.data.entries[0];
        console.log("🔐 AuthProvider: user:", user);
        
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
          code: error?.code
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
        console.log("🔐 AuthProvider: OTP verification response received: on Provider ", res);
        // After successful OTP verification, complete the authentication
        // You can set a session token or user data here
        // For now, we'll just log success - you can add more logic as needed
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
          code: error?.code
        });
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
      method: "jwt",
      loading: isLoading,
      isAuthenticated: !!state.user,
      loginRoute,
      appRoute,
      loginWithToken,
      verifyOTP,
      logout,
      initialize,
    }),
    [initialize, loginWithToken, verifyOTP, logout, state.user, isLoading, loginRoute, appRoute]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
