import { Geist, Geist_Mono } from "next/font/google"
import "../assets/styles/fonts.css"

import "@workspace/ui/styles/globals.css"
import { Providers } from "../components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-[Ravi] antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
