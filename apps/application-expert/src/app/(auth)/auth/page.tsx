"use client"

import { OTPLoginForm } from "@workspace/custom-ui"
import * as React from "react"
import { useRouter } from "next/navigation"
import { routes } from "@/constants/routes"
export default function AuthPage() {
  const router = useRouter()

  const sampleTestimonials: {   avatarSrc: string;
    name: string;
    handle: string;
    text: string; }[] = [
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
      name: "سارا احمدی",
      handle: "@sara_ahmadi",
      text: "پلتفرم فوق‌العاده‌ای است! تجربه کاربری بی‌نظیر و امکانات دقیقاً همان چیزی است که نیاز داشتم."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
      name: "محمد رضایی",
      handle: "@mohammad_rezaei",
      text: "این سرویس نحوه کار من را متحول کرده است. طراحی تمیز، امکانات قدرتمند و پشتیبانی عالی."
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "علی مرادی",
      handle: "@ali_moradi",
      text: "پلتفرم‌های زیادی را امتحان کرده‌ام، اما این یکی برجسته است. کاربردی، قابل اعتماد و واقعاً برای بهره‌وری مفید."
    },
  ];

  return (
    <div className="w-screen h-screen">

      <OTPLoginForm
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={sampleTestimonials}
      onSuccess={() => router.push(routes.home)}
      onError={(error: any) => console.log(error)}
      />
      </div>
  )
}


