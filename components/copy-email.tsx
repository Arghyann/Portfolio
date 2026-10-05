"use client"

import * as React from "react"
import { toast } from "sonner"

interface CopyEmailProps {
  email: string
  className?: string
  children?: React.ReactNode
}

export function CopyEmail({ email, className, children }: CopyEmailProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success("Email copied to clipboard", {
        description: email,
        duration: 2500,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={className}
      title="Click to copy email address"
    >
      {children || email}
    </button>
  )
}
