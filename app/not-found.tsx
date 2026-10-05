import Link from "next/link"
import { TopNav } from "@/components/top-nav"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[692px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      <TopNav />
      <div className="space-y-4 pt-10">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
          404 — Not Found
        </h1>
        <p className="text-muted text-sm sm:text-base leading-[1.6]">
          The page or article you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors no-underline text-sm font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
