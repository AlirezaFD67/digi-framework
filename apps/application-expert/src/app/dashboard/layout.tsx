"use client"

import * as React from "react"
import { CustomUIProvider } from "@workspace/custom-ui/providers/custom-ui-provider"
import AppSidebar from "@workspace/custom-ui/components/layout/dashboard/sidebar"
import DashboardHeader from "@workspace/custom-ui/components/layout/dashboard/header"
import { navItems } from "@/constants/data"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomUIProvider mode="dashboard" themeConfig={{ attribute: "class" }} sidebarConfig={{ defaultOpen: true }}>
      <div className="flex min-h-dvh w-full">
        <AppSidebar navItems={navItems} />
        <div className="flex flex-1 flex-col">
          <DashboardHeader navItems={navItems} />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </CustomUIProvider>
  )
}


