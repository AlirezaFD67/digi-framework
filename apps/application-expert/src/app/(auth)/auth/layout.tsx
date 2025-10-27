"use client"

import * as React from "react"
import { GuestGuard } from "@workspace/custom-ui"
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

            <GuestGuard>{children}</GuestGuard>
    )
}


