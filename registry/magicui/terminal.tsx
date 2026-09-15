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

export function Terminal({ children, className, title = "guest@macbook ~ zsh" }: TerminalProps) {
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
        "z-10 w-full rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-sm shadow-2xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-3 select-none">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
          <div className="h-3 w-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <TerminalIcon className="h-3.5 w-3.5" />
          <span>{title}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-2 overflow-x-auto text-zinc-200 leading-relaxed">
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
        <span className="h-4 w-2 bg-emerald-400 inline-block animate-pulse" />
      )}
    </div>
  )
}
