"use client"

import React from "react"
import { OTPLoginForm } from "./otp-login-form"

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

export function OTPLoginFormExample() {
  const handleSuccess = () => {
    console.log("Login successful!")
    // Redirect to dashboard or handle success
  }

  const handleError = (error: any) => {
    console.error("Login failed:", error)
    // Handle error (show toast, etc.)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <OTPLoginForm
          title="Welcome Back"
          description="Enter your phone number to receive a verification code"
          submitButtonText="Send Code"
          otpButtonText="Verify Code"
          resendButtonText="Resend Code"
          showResendButton={true}
          resendCooldown={60}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  )
}

export default OTPLoginFormExample


