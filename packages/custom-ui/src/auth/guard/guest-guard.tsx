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
  const { isAuthenticated, loginRoute } = useAuthContext();

  const returnTo = searchParams.get("returnTo") || `/${loginRoute}`;

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
