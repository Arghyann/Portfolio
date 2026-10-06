"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function KeyboardNav() {
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

  return null
}
