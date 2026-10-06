import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { KeyboardNav } from "@/components/keyboard-nav"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aryan Mane",
  description: "Full Stack Developer working across Go, Kubernetes, AWS, and distributed systems.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-[var(--selection-bg)] selection:text-[var(--selection-fg)]">
        <KeyboardNav />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
            },
          }}
        />
      </body>
    </html>
  )
}
