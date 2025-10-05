"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SplashScreen } from "../../components/loading-screen";
import { useAuthContext } from "../../hooks/use-auth";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Props = {
  children: React.ReactNode;
};


// ============================================================================
// COMPONENT
// ============================================================================

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();
  console.log("🔐 AuthGuard: loading:", loading);
  
  if (loading) {
    return <SplashScreen />;
  }

  return <Container>{children}</Container>;
}

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

function Container({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, method, loading,loginRoute } = useAuthContext();
  const [checked, setChecked] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const check = useCallback(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      const returnTo = typeof window !== "undefined" ? window.location.pathname : "";
      const searchParams = new URLSearchParams({ returnTo }).toString();
      const loginPath = loginRoute || `/${loginRoute}`;
      const href = `${loginPath}?${searchParams}`;
        console.log("auth-guard",href);
      // router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, loading, method, router]);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        check();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [check]);

  if (!checked || !isClient) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

