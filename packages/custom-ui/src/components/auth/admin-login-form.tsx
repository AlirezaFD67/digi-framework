"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import { FormProvider, RHFInput, RHFButton } from "../form"
import { useAuthContext } from "../../hooks/use-auth"
import { cn } from "@workspace/ui/lib/utils"
import { Lock, User } from "lucide-react"

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

type AdminLoginFormData = {
  username: string
  password: string
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface AdminLoginFormProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: any) => void
  title?: string
  description?: string
  submitButtonText?: string
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

export function AdminLoginForm({
  className,
  onSuccess,
  onError,
  title = "ورود به پنل ادمین",
  description = "نام کاربری و رمز عبور خود را وارد کنید",
  submitButtonText = "ورود",
  heroImageSrc,
  testimonials = [],
}: AdminLoginFormProps) {
  const { loginAsAdmin } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Admin login form
  const form = useForm<AdminLoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Handle admin login submission
  const handleSubmit = async (data: AdminLoginFormData) => {
    console.log("🔑 AdminLoginForm: handleSubmit called with data:", data);
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔑 AdminLoginForm: Calling loginAsAdmin...");
      const result = await loginAsAdmin({
        username: data.username,
        password: data.password,
      })
      
      console.log("🔑 AdminLoginForm: loginAsAdmin result:", result);
      console.log("🔑 AdminLoginForm: Calling onSuccess...");
      onSuccess?.()
    } catch (error: any) {
      console.error("💥 AdminLoginForm: loginAsAdmin failed:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "نام کاربری یا رمز عبور نادرست است"
      setError(errorMessage)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]", className)}>
      {/* Left column: Admin login form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg -mt-20">
          <div className="flex flex-col gap-6">
            {/* Icon */}
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-lg shadow-cyan-500/25">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-foreground">
                {title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {description}
              </p>
            </div>

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

            {/* Login Form */}
            <FormProvider 
              methods={form}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Username Field */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">نام کاربری</label>
                <GlassInputWrapper>
                  <div className="flex items-center px-6 py-4">
                    <User className="w-5 h-5 text-muted-foreground ml-3" />
                    <RHFInput
                      name="username"
                      placeholder="username"
                      required
                      minLength={{
                        value: 3,
                        message: "نام کاربری باید حداقل 3 کاراکتر باشد"
                      }}
                      className="w-full bg-transparent text-sm rounded-2xl focus:outline-none border-0 p-0"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">رمز عبور</label>
                <GlassInputWrapper>
                  <div className="flex items-center px-6 py-4">
                    <Lock className="w-5 h-5 text-muted-foreground ml-3" />
                    <RHFInput
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={{
                        value: 4,
                        message: "رمز عبور باید حداقل 4 کاراکتر باشد"
                      }}
                      className="w-full bg-transparent text-sm rounded-2xl focus:outline-none border-0 p-0"
                    />
                  </div>
                </GlassInputWrapper>
              </div>
              
              {/* Submit Button */}
              <RHFButton
                type="submit"
                loading={isLoading}
                loadingText="در حال ورود..."
                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-medium py-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 rounded-2xl"
              >
                {submitButtonText}
              </RHFButton>
            </FormProvider>
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

export default AdminLoginForm

