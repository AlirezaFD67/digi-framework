"use client";

// ============================================================================
// IMPORTS
// ============================================================================

import { useContext } from "react";
import { AuthContext } from "../contexts/auth/auth-context";

// ============================================================================
// HOOKS
// ============================================================================

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("لطفا در authprovider استفاده کنید");

  return context;
};
