"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {
  ModalProvider,
  ErrorProvider,
  ToastProvider,
} from "../contexts"
import { ModalManager } from "../components/modal"
import { ToastContainer } from "../components/error"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { AuthProvider } from "../contexts/auth/auth-provider"
import type { UserType } from "@workspace/framework"
export type AppMode = "dashboard" | "web-app"

export interface CustomUIProviderProps {
  children: React.ReactNode
  mode?: AppMode
  themeConfig?: {
    attribute?: "class" | "data-theme" | "data-mode"
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
    enableColorScheme?: boolean
  }
  toastConfig?: {
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  }
  sidebarConfig?: {
    defaultOpen?: boolean
    defaultCollapsed?: boolean
  }
  loginRoute?: string
  appRoute?: string
  userType?: UserType
}

export function CustomUIProvider({
  children,
  mode = "web-app",
  themeConfig = {},
  toastConfig = {},
  sidebarConfig = {},
  loginRoute,
  appRoute,
  userType
}: CustomUIProviderProps) {
  const {
    attribute = "class",
    defaultTheme = "system",
    enableSystem = true,
    disableTransitionOnChange = true,
    enableColorScheme = true
  } = themeConfig

  const {
    position = "top-right"
  } = toastConfig

  const {
    defaultOpen = true,
    defaultCollapsed = false
  } = sidebarConfig

  // Create the base providers wrapper
  const BaseProviders = ({ children }: { children: React.ReactNode }) => (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={enableColorScheme}
    >
      <ModalProvider>
        <AuthProvider loginRoute={loginRoute} appRoute={appRoute} userType={userType}>
          <ErrorProvider>
            <ToastProvider>
              {children}
              <ModalManager />
              <ToastContainer position={position} />
            </ToastProvider>
          </ErrorProvider>
        </AuthProvider>
      </ModalProvider>
    </NextThemesProvider>
  )

  // Create dashboard providers wrapper (includes SidebarProvider)
  const DashboardProviders = ({ children }: { children: React.ReactNode }) => (
    <BaseProviders>
      <SidebarProvider defaultOpen={defaultOpen}>
        {children}
      </SidebarProvider>
    </BaseProviders>
  )

  // Return the appropriate provider based on mode
  return mode === "dashboard" ? (
    <DashboardProviders>
      {children}
    </DashboardProviders>
  ) : (
    <BaseProviders>
      {children}
    </BaseProviders>
  )
}
