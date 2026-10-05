"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function TopNav() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return
      }

      const key = e.key.toLowerCase()
      if (key === "h") {
        router.push("/")
      } else if (key === "b") {
        router.push("/blog")
      } else if (key === "w") {
        if (pathname === "/") {
          const el = document.getElementById("work")
          el?.scrollIntoView({ behavior: "smooth" })
        } else {
          router.push("/#work")
        }
      } else if (key === "p") {
        if (pathname === "/") {
          const el = document.getElementById("projects")
          el?.scrollIntoView({ behavior: "smooth" })
        } else {
          router.push("/#projects")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, pathname])

  return (
    <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-[13px] font-mono text-muted mb-12 sm:mb-16 select-none">
      <Link
        href="/"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[h]</span>
        <span>home</span>
      </Link>
      <Link
        href="/blog"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[b]</span>
        <span>blog</span>
      </Link>
      <Link
        href="/#work"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[w]</span>
        <span>work</span>
      </Link>
      <Link
        href="/#projects"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[p]</span>
        <span>projects</span>
      </Link>
    </nav>
  )
}
