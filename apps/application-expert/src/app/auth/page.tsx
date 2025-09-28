"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useAuthTokenMutation } from "@workspace/framework"
export default function AuthPage() {
  const [mode, setMode] = React.useState<"login" | "register">("login")
  const { mutate: login } = useAuthTokenMutation()
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "ورود به حساب" : "ثبت‌نام"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login" ? "لطفاً وارد حساب کاربری خود شوید" : "لطفاً اطلاعات خود را وارد کنید"}
          </p>
        </div>

        <form className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" placeholder="مثال: علی رضایی" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <Input id="password" type="password" placeholder="******" />
          </div>

          <Button type="submit" className="w-full">
            {mode === "login" ? "ورود" : "ثبت‌نام"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <span>
              حساب ندارید؟{" "}
              <button className="text-primary underline" onClick={() => setMode("register")}>ثبت‌نام</button>
            </span>
          ) : (
            <span>
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <button className="text-primary underline" onClick={() => setMode("login")}>ورود</button>
            </span>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/dashboard">ورود به داشبورد</Link>
        </div>
      </div>
    </div>
  )
}


