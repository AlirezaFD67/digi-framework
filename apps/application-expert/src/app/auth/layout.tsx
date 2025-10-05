"use client"

import * as React from "react"
import { CustomUIProvider } from "@workspace/custom-ui"
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CustomUIProvider loginRoute="/auth/login" appRoute="/dashboard" mode="dashboard" themeConfig={{ attribute: "class" }} sidebarConfig={{ defaultOpen: true }}>
            {children}
        </CustomUIProvider>
    )
}


