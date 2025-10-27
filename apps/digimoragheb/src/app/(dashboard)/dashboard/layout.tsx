"use client"

import * as React from "react"
import AppSidebar from "@workspace/custom-ui/components/layout/dashboard/sidebar"
import DashboardHeader from "@workspace/custom-ui/components/layout/dashboard/header"
import { navItems } from "@/constants/data"
import { CustomUIProvider, AuthGuard } from "@workspace/custom-ui"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}


