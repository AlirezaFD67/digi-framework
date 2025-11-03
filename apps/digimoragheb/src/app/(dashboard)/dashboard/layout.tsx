"use client"

import * as React from "react"
import AppSidebar from "@/components/layout/dashboard/sidebar"
import DashboardHeader from "@/components/layout/dashboard/header"
import { getNavItems } from "@/constants/navs-items"
import {  AuthGuard, useAuthContext } from "@workspace/custom-ui"
import { UserRole } from "@workspace/framework"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userType } = useAuthContext();
  return (
      <AuthGuard>
        <div className="flex min-h-dvh w-full p-3">
          <AppSidebar navItems={getNavItems(userType as UserRole)} />
          <div className="flex flex-1 flex-col">
          <DashboardHeader navItems={getNavItems(userType as UserRole)} />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
  )
}


