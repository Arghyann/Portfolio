"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[692px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      <div className="mb-10 sm:mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-mono text-muted hover:text-foreground transition-colors group no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>home</span>
        </Link>
      </div>

      <div className="space-y-4 pt-4">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
          404 — Not Found
        </h1>
        <p className="text-muted text-sm sm:text-base leading-[1.6]">
          The page or article you are looking for does not exist or has been moved.
        </p>
      </div>
    </div>
  )
}
