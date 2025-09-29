"use client"

import { OTPLoginForm } from "@workspace/custom-ui"
import * as React from "react"
import { useRouter } from "next/navigation"
export default function AuthPage() {
  const router = useRouter()


  return (
    <OTPLoginForm
    className="w-full max-w-md"
    onSuccess={() => router.push('/dashboard')}
    onError={(error) => console.log(error)}
  />
  )
}


