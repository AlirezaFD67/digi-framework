"use client"

import { AdminLoginForm } from "./admin-login-form"

/**
 * Example usage of AdminLoginForm component
 * This is a ready-to-use example for admin authentication
 */
export function AdminLoginFormExample() {
  const handleSuccess = () => {
    console.log("✅ Admin login successful!")
    // Redirect to admin dashboard or perform other actions
    if (typeof window !== "undefined") {
      window.location.href = "/admin/dashboard"
    }
  }

  const handleError = (error: any) => {
    console.error("❌ Admin login failed:", error)
  }

  return (
    <AdminLoginForm
      onSuccess={handleSuccess}
      onError={handleError}
      title="ورود به پنل ادمین"
      description="برای دسترسی به پنل مدیریت، نام کاربری و رمز عبور خود را وارد کنید"
      submitButtonText="ورود به پنل"
      heroImageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop"
      testimonials={[
        {
          avatarSrc: "https://i.pravatar.cc/150?img=1",
          name: "علی احمدی",
          handle: "@aliahmadi",
          text: "پنل مدیریت قدرتمند و کاربرپسند!"
        },
        {
          avatarSrc: "https://i.pravatar.cc/150?img=2",
          name: "سارا محمدی",
          handle: "@saramohammadi",
          text: "بهترین سیستم مدیریت که استفاده کرده‌ام."
        }
      ]}
    />
  )
}

export default AdminLoginFormExample

