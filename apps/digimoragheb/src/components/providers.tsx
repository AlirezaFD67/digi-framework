"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { FrameworkProvider } from "@workspace/framework"
import { CustomUIProvider } from "@workspace/custom-ui"
import { routes } from "@/constants/routes"
import { UserRole } from "@workspace/framework"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FrameworkProvider>
      <CustomUIProvider 
      loginRoute={routes.auth.login}
       appRoute={routes.dashboard.root}
       userType={UserRole.User}
       mode="dashboard"
       themeConfig={{ attribute: "class" }}
       sidebarConfig={{ defaultOpen: true }}
       >
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </CustomUIProvider>
    </FrameworkProvider>
  )
}
