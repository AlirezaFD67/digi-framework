"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { AuthContext } from "./auth-context";
import { SplashScreen } from "../../components/loading-screen";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Props = {
  children: React.ReactNode;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(auth) => (auth.loading ? <SplashScreen /> : children)}
    </AuthContext.Consumer>
  );
}
