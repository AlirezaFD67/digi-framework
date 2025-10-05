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
// CONTAINER COMPONENT
// ============================================================================

function Container({ children }: Props) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [contextReady, setContextReady] = useState(false);
  
  // Wait for context to be ready
  useEffect(() => {
    setContextReady(true);
  }, []);
  
  // Don't access context until we're sure it's ready
  if (!contextReady) {
    return <SplashScreen />;
  }
  
  return <AuthChecker checked={checked} setChecked={setChecked}>{children}</AuthChecker>;
}

function AuthChecker({ children, checked, setChecked }: Props & { checked: boolean; setChecked: (value: boolean) => void }) {
  const router = useRouter();
  const { isAuthenticated, loading, loginRoute } = useAuthContext();

  const check = useCallback(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      const returnTo = window.location.pathname;
      const searchParams = new URLSearchParams({ returnTo }).toString();
      const loginPath = loginRoute || "/auth/login";
      const href = `${loginPath}?${searchParams}`;
      console.log("auth-guard", href);
      // router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, loading, loginRoute, router, setChecked]);

  useEffect(() => {
    const timer = setTimeout(() => {
      check();
    }, 500);

    return () => clearTimeout(timer);
  }, [check]);

  if (!checked) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}






// ============================================================================
// COMPONENT
// ============================================================================

export default function AuthGuard({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Add a small delay to ensure context is ready
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // During SSR or before mount, show loading screen
  if (!mounted || !ready) {
    return <SplashScreen />;
  }

  return <Container>{children}</Container>;
}
