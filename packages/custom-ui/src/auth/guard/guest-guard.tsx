"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

function Container({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, appRoute } = useAuthContext();

  // Get returnTo from URL params or fallback to appRoute
  const returnToParam = searchParams.get("returnTo");
  const defaultPath = appRoute?.startsWith("/") ? appRoute : `/${appRoute || ""}`;
  const returnTo = returnToParam || defaultPath;

  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isAuthenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
