"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import { FormProvider, RHFInput, RHFButton, RHFOTP } from "../form"
import { useAuthContext } from "../../hooks/use-auth"
import { cn } from "@workspace/ui/lib/utils"

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

type PhoneFormData = {
  phone: string
}

type OTPFormData = {
  phone: string
  otp: string
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface OTPLoginFormProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: any) => void
  title?: string
  description?: string
  submitButtonText?: string
  otpButtonText?: string
  resendButtonText?: string
  showResendButton?: boolean
  resendCooldown?: number // in seconds
}



// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OTPLoginForm({
  className,
  onSuccess,
  onError,
  title = "ورود با کد تایید",
  description = "شماره موبایل خود را وارد کنید تا کد تایید دریافت کنید",
  submitButtonText = "ارسال کد تایید",
  otpButtonText = "تایید کد",
  resendButtonText = "ارسال مجدد",
  showResendButton = true,
  resendCooldown = 60,
}: OTPLoginFormProps) {
  const { loginWithToken, verifyOTP } = useAuthContext()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState("")

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    defaultValues: {
      phone: "",
    },
  })

  // OTP form
  const otpForm = useForm<OTPFormData>({
    defaultValues: {
      phone: "",
      otp: "",
    },
  })

  // Handle phone submission
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Convert phone to username format (remove leading 0 and add +98)
      const username = data.phone.startsWith('0') ? data.phone.substring(1) : data.phone
      
      await loginWithToken({
        username: `+98${username}`,
        password: "dummy", // This might need to be adjusted based on your API
      })

      setPhoneNumber(data.phone)
      otpForm.setValue("phone", data.phone)
      setStep("otp")
      setResendTimer(resendCooldown)
      
      // Start resend timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    //   onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "خطا در ارسال کد تایید"
      setError(errorMessage)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP submission
  const handleOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await verifyOTP({
        userPhone: data.phone,
        userOTP: data.otp,
      })

      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "کد تایید نامعتبر است"
      setError(errorMessage)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    setError(null)

    try {
      const username = phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber
      
      await loginWithToken({
        username: `+98${username}`,
        password: "dummy",
      })

      setResendTimer(resendCooldown)
      
      // Start resend timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "خطا در ارسال مجدد کد تایید"
      setError(errorMessage)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back to phone step
  const handleBackToPhone = () => {
    setStep("phone")
    setError(null)
    otpForm.reset()
  }

  return (
    <div className={cn("w-full  mx-auto px-4 sm:px-6 lg:px-8", className)}>
      
      <div>
        {step === "phone" ? (
          // PHONE STEP
          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                لطفا شماره تماس خود را وارد نمایید!
              </h2>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 sm:p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">{error}</span>
                </div>
              </div>
            )}

            {/* Phone Form */}
            <FormProvider 
              methods={phoneForm}
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <RHFInput
                name="phone"
                label="شماره موبایل"
                placeholder="09xxxxxxxxx"
                mode="phone"
                required
                pattern={{
                  value: /^09\d{9}$/,
                  message: "لطفاً شماره موبایل معتبر وارد کنید (09xxxxxxxxx)"
                }}
                className="!text-lg sm:!text-xl text-center"
              />
              
              <RHFButton
                type="submit"
                loading={isLoading}
                loadingText="در حال ارسال..."
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-3 rounded-lg text-sm sm:text-base"
              >
                {submitButtonText}
              </RHFButton>
            </FormProvider>
          </div>
        ) : (
          // OTP STEP
          <div className="space-y-6 sm:space-y-8">
            {/* Title and Phone Number */}
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                کد تایید ارسال شده را وارد نمایید!
              </h2>
              <div className="text-base sm:text-lg font-medium text-cyan-600 break-all">
                {phoneNumber}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 sm:p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">{error}</span>
                </div>
              </div>
            )}

            {/* OTP Form */}
            <FormProvider 
              methods={otpForm}
              onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <RHFOTP
                name="otp"
                label="کد تایید"
                length={6}
                pattern={{
                  value: /^\d{6}$/,
                  message: "کد تایید باید فقط شامل اعداد باشد"
                }}
                required
                // helperText="کد ۶ رقمی ارسال شده به موبایل خود را وارد کنید"
                className="text-center text-xl sm:text-2xl tracking-widest font-mono"
                containerClassName="justify-center"
              />
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToPhone}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-2 sm:py-3 text-sm sm:text-base"
                >
                  بازگشت
                </Button>
                
                <RHFButton
                  type="submit"
                  loading={isLoading}
                  loadingText="در حال تایید..."
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-2 sm:py-3 rounded-lg text-sm sm:text-base"
                >
                  {otpButtonText}
                </RHFButton>
              </div>

              {/* Resend Button */}
              {showResendButton && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isLoading || resendTimer > 0}
                    className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 text-sm sm:text-base py-2"
                  >
                    {resendTimer > 0 ? `ارسال مجدد در ${resendTimer} ثانیه` : resendButtonText}
                  </Button>
                </div>
              )}
            </FormProvider>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default OTPLoginForm