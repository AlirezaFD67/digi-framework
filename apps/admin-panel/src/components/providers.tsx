"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { FrameworkProvider } from "@workspace/framework"
import { CustomUIProvider } from "@workspace/custom-ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <FrameworkProvider>
      <CustomUIProvider loginRoute="/auth" appRoute="/" mode="dashboard" themeConfig={{ attribute: "class" }} sidebarConfig={{ defaultOpen: true }}>

        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
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
