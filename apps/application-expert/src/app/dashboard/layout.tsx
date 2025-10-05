"use client"

import * as React from "react"
import AppSidebar from "@workspace/custom-ui/components/layout/dashboard/sidebar"
import DashboardHeader from "@workspace/custom-ui/components/layout/dashboard/header"
import { navItems } from "@/constants/data"
import { AuthGuard } from "@workspace/custom-ui/auth/guard"
import { CustomUIProvider } from "@workspace/custom-ui"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomUIProvider loginRoute="/auth/login" appRoute="/dashboard" mode="dashboard" themeConfig={{ attribute: "class" }} sidebarConfig={{ defaultOpen: true }}>

    <AuthGuard>
      <div className="flex min-h-dvh w-full">
        <AppSidebar navItems={navItems} />
        <div className="flex flex-1 flex-col">
          <DashboardHeader navItems={navItems} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      
    </AuthGuard>
</CustomUIProvider>
  )
}


