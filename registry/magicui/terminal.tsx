"use client"

import React, { useEffect, useState } from "react"
import { motion, MotionProps } from "framer-motion"
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  title?: string
}

export function Terminal({ children, className, title = "zsh" }: TerminalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("ssh guest@aryanssh.duckdns.org")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border/50 bg-theme-bg-darker/60 font-mono text-sm overflow-hidden transition-colors hover:border-theme-accent/30",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-theme-bg-darker px-4 py-2.5 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-theme-accent" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-theme-accent font-medium">
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40 transition-all duration-200 cursor-pointer"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-theme-accent" />
              <span className="text-theme-accent">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 overflow-x-auto text-foreground leading-relaxed">
        {children}
      </div>
    </div>
  )
}

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedSpan({ children, className, delay = 0, ...props }: AnimatedSpanProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={cn("block", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps {
  children: string
  className?: string
  delay?: number
  duration?: number
}

export function TypingAnimation({
  children,
  className,
  delay = 0,
  duration = 40,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < children.length) {
        setDisplayedText(children.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, duration)

    return () => clearInterval(interval)
  }, [started, children, duration])

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span>{displayedText}</span>
      {started && displayedText.length < children.length && (
        <span className="h-4 w-2 bg-theme-accent inline-block animate-pulse" />
      )}
    </div>
  )
}
