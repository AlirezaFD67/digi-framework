"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import { FormProvider, RHFInput, RHFButton, RHFOTP } from "../form"
import { useAuthContext } from "../../hooks/use-auth"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, Smartphone, Shield } from "lucide-react"

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
  heroImageSrc?: string
  testimonials?: Array<{
    avatarSrc: string
    name: string
    handle: string
    text: string
  }>
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const GlassInputWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-cyan-400/70 focus-within:bg-cyan-500/10", className)}>
    {children}
  </div>
)

const StepIcon = ({ step, currentStep }: { step: "phone" | "otp", currentStep: "phone" | "otp" }) => {
  const isActive = step === currentStep
  const isCompleted = (step === "phone" && currentStep === "otp")
  
  return (
    <div className={cn(
      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
      isActive && "border-cyan-500 bg-cyan-500/10",
      isCompleted && "border-cyan-500 bg-cyan-500 text-white",
      !isActive && !isCompleted && "border-gray-300 bg-gray-100"
    )}>
      {step === "phone" ? (
        <Smartphone className={cn("w-5 h-5", isCompleted && "text-white")} />
      ) : (
        <Shield className={cn("w-5 h-5", isCompleted && "text-white")} />
      )}
    </div>
  )
}

const TestimonialCard = ({ testimonial, delay }: { testimonial: { avatarSrc: string, name: string, handle: string, text: string }, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
)



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
  heroImageSrc,
  testimonials = [],
}: OTPLoginFormProps) {
  const { loginWithToken, verifyOTP } = useAuthContext();
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
    console.log("📞 OTPLoginForm: handlePhoneSubmit called with data:", data);
    setIsLoading(true)
    setError(null)

    try {
      console.log("📞 OTPLoginForm: Calling loginWithToken...");
      // Convert phone to username format (remove leading 0 and add +98)
      
      const result = await loginWithToken({
        username: data.phone,
        password: "0", // This might need to be adjusted based on your API
      })
      
      console.log("📞 OTPLoginForm: loginWithToken result:", result);

      setPhoneNumber(data.phone)
      otpForm.setValue("phone", data.phone)
      setStep("otp")
      setResendTimer(resendCooldown)
      console.log("📞 OTPLoginForm: Moved to OTP step");
      
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
    console.log("🔢 OTPLoginForm: handleOTPSubmit called with data:", data);
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔢 OTPLoginForm: Calling verifyOTP...");
      const result = await verifyOTP({
        userPhone: data.phone,
        userOTP: data.otp,
      })
      
      console.log("🔢 OTPLoginForm: verifyOTP result:", result);
      console.log("🔢 OTPLoginForm: Calling onSuccess...");
      onSuccess?.()
    } catch (error: any) {
      console.error("💥 OTPLoginForm: verifyOTP failed:", error);
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
    <div className={cn(" flex flex-col md:flex-row", className)}>
      {/* Left column: OTP form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg -mt-20">
          <div className="flex flex-col gap-6">
          {/* Step Progress */}
          {/* <div className="flex items-center justify-center gap-4 mb-2">
            <StepIcon step="phone" currentStep={step} />
            <div className="w-8 h-0.5 bg-gray-200 rounded-full">
              <div className={cn(
                "h-full bg-cyan-500 rounded-full transition-all duration-500",
                step === "otp" ? "w-full" : "w-0"
              )} />
            </div>
            <StepIcon step="otp" currentStep={step} />
          </div> */}

          {/* Title */}
          <div className="text-center">
            <h1 className=" font-semibold leading-tight text-foreground">
              {step === "phone" ? "ورود با شماره موبایل" : "تایید کد"}
            </h1>
          
            {/* <p className="text-muted-foreground mt-2">
              {step === "phone" ? "شماره موبایل خود را وارد کنید" : "کد تایید ارسال شده را وارد کنید"}
            </p> */}
          </div>-

          {/* Error Display */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50/50 backdrop-blur-sm border border-red-200/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="break-words">{error}</span>
              </div>
            </div>
          )}

          {step === "phone" ? (
            // PHONE STEP
            <FormProvider 
              methods={phoneForm}
              onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">شماره موبایل</label>
                <GlassInputWrapper>
                  <RHFInput
                    name="phone"
                    placeholder="09xxxxxxxxx"
                    mode="phone"
                    required
                    pattern={{
                      value: /^09\d{9}$/,
                      message: "لطفاً شماره موبایل معتبر وارد کنید (09xxxxxxxxx)"
                    }}
                    className="w-full bg-transparent text-sm p-6 rounded-2xl focus:outline-none border-0"
                  />
                </GlassInputWrapper>
              </div>
              
              <RHFButton
                type="submit"
                loading={isLoading}
                loadingText="در حال ارسال..."
                className="w-full   hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                {submitButtonText}
              </RHFButton>
            </FormProvider>
          ) : (
            // OTP STEP
            <div className="space-y-5">
              {/* Phone Number Display */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-50/50 backdrop-blur-sm border border-cyan-200/50">
                  <Smartphone className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-700">{phoneNumber}</span>
                </div>
              </div>

              <FormProvider 
                methods={otpForm}
                onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
                className="space-y-5"
              >
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">کد تایید</label>
                  <GlassInputWrapper>
                    <RHFOTP
                      name="otp"
                      length={6}
                      pattern={{
                        value: /^\d{6}$/,
                        message: "کد تایید باید فقط شامل اعداد باشد"
                      }}
                      required
                      className="text-center text-xl tracking-widest font-mono bg-transparent"
                      containerClassName="justify-center p-4"
                    />
                  </GlassInputWrapper>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToPhone}
                    disabled={isLoading}
                    className="flex-1 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50 py-4 transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 ml-2" />
                    بازگشت
                  </Button>
                  
                  <RHFButton
                    type="submit"
                    loading={isLoading}
                    loadingText="در حال تایید..."
                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
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
                      className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50/50 rounded-2xl py-3 px-6 transition-all duration-300"
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
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              {testimonials[0] && <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />}
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

// ============================================================================
// EXPORTS
// ============================================================================

export default OTPLoginForm