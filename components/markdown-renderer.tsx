"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { ChevronLeft, ChevronRight, Check, Copy } from "lucide-react"

function CliChatRenderer({
  title,
  value,
}: {
  title?: string
  value: string
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [activePane, setActivePane] = useState<"sidebar" | "messages">("sidebar")
  const [copied, setCopied] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const messageAreaRef = React.useRef<HTMLDivElement>(null)

  // Split multiple conversations by === or --- without consuming subsequent text
  const rawSections = value
    .split(/(?:^|\n)\s*(?:={3,}|-{3,})\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean)

  const sections = rawSections.length > 0 ? rawSections : [value.trim()]
  const total = sections.length
  const safeIdx = currentIdx < total ? currentIdx : 0
  const activeContent = sections[safeIdx]

  // Reset scroll to top when changing sessions
  React.useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = 0
    }
  }, [safeIdx])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  // Global key listener so j/k/h/l work immediately without needing to click first
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return
      }

      // Only respond if this terminal is in view
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === "l" || e.key === "ArrowRight") {
        e.preventDefault()
        setActivePane("messages")
      } else if (e.key === "h" || e.key === "ArrowLeft") {
        e.preventDefault()
        setActivePane("sidebar")
      } else if (e.key === "Tab") {
        e.preventDefault()
        setActivePane((prev) => (prev === "sidebar" ? "messages" : "sidebar"))
      } else if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault()
        if (activePane === "sidebar") {
          setCurrentIdx((prev) => (prev + 1) % total)
        } else {
          messageAreaRef.current?.scrollBy({ top: 50, behavior: "smooth" })
        }
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault()
        if (activePane === "sidebar") {
          setCurrentIdx((prev) => (prev - 1 + total) % total)
        } else {
          messageAreaRef.current?.scrollBy({ top: -50, behavior: "smooth" })
        }
      } else if (e.key >= "1" && e.key <= String(Math.min(total, 9))) {
        e.preventDefault()
        setCurrentIdx(Number(e.key) - 1)
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [total, activePane])

  const lines = activeContent.split("\n")

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="my-8 rounded border border-border bg-theme-bg-darker overflow-hidden font-mono text-sm shadow-xl focus:outline-none focus:ring-1 focus:ring-theme-accent/60 transition-all select-text"
      title="Vim navigation: 'h'/'l' switch pane, 'j'/'k' navigate/scroll"
    >
      {/* Top Header Bar - Inverted nchat style */}
      <div className="bg-foreground text-background px-3 py-1 font-mono text-xs font-semibold flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="tracking-wide uppercase">{title || "nchat"}</span>
          <span className="text-[10px] opacity-75 font-normal">
            [{activePane === "sidebar" ? "sidebar" : "messages"}]
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-normal">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Online</span>
        </div>
      </div>

      {/* Main TUI Body: Constant Fixed Height with Hidden Scrollbars */}
      <div className="flex flex-col sm:flex-row h-[360px] sm:h-[400px]">
        {/* Sidebar - No Cursor */}
        {total > 1 && (
          <div
            onClick={() => setActivePane("sidebar")}
            className="sm:w-44 border-b sm:border-b-0 sm:border-r border-border/60 bg-theme-bg-darker/90 p-2 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto shrink-0 select-none no-scrollbar"
          >
            {sections.map((_, idx) => {
              const isActive = idx === safeIdx
              const label = `session ${String(idx + 1).padStart(2, "0")}`

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIdx(idx)
                    setActivePane("sidebar")
                  }}
                  className={`w-full text-left px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer flex items-center justify-between shrink-0 ${
                    isActive
                      ? "bg-foreground text-background font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-[10px] opacity-60">[{idx + 1}]</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Right Area: Messages + Bottom Input Prompt with Vim Cursor */}
        <div className="flex-1 flex flex-col bg-theme-bg-darker/40 min-w-0">
          <div
            ref={messageAreaRef}
            onClick={() => setActivePane("messages")}
            className="flex-1 p-4 sm:p-5 space-y-2.5 overflow-y-auto leading-relaxed no-scrollbar cursor-text"
          >
            {lines.map((line, idx) => {
              const trimmed = line.trim()
              if (!trimmed) {
                return <div key={idx} className="h-2" />
              }

              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                return (
                  <div
                    key={idx}
                    className="py-1 text-xs text-muted-foreground/75 italic select-none"
                  >
                    {trimmed}
                  </div>
                )
              }

              const userMatch = /^(?:> ?)?you:\s*(.*)/i.exec(trimmed)
              if (userMatch) {
                return (
                  <div key={idx} className="text-foreground">
                    <span className="text-theme-accent font-semibold">You: </span>
                    <span className="text-theme-fg-bright font-medium">{userMatch[1]}</span>
                  </div>
                )
              }

              const botMatch = /^(Aryan(?:\s*\([^)]+\))?|qwen(?:\s*\([^)]+\))?|bot|assistant):\s*(.*)/i.exec(
                trimmed
              )
              if (botMatch) {
                return (
                  <div key={idx} className="text-foreground">
                    <span className="text-theme-yellow font-semibold">{botMatch[1]}: </span>
                    <span className="text-foreground/90">{botMatch[2]}</span>
                  </div>
                )
              }

              return (
                <div key={idx} className="text-foreground/90">
                  {trimmed}
                </div>
              )
            })}
          </div>

          {/* Prompt line with Vim Cursor in message pane */}
          <div
            onClick={() => setActivePane("messages")}
            className="border-t border-border/50 bg-theme-bg-darker/80 px-3 py-1.5 font-mono text-xs flex items-center select-none gap-2"
          >
            <span className="text-theme-accent font-bold">&gt;</span>
            {activePane === "messages" ? (
              <span className="flex items-center text-foreground font-mono text-xs">
                <span>chat buffer</span>
                <span className="inline-block w-2 h-3.5 bg-foreground animate-pulse ml-1.5 align-middle" />
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/70">
                press &apos;l&apos; to enter chat buffer
              </span>
            )}
            <span className="text-[10px] text-muted-foreground/50 ml-auto">
              {safeIdx + 1}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status / Keybind Bar */}
      <div className="border-t border-border/60 bg-theme-bg-darker px-3 py-1.5 font-mono text-[11px] text-muted-foreground flex items-center justify-between select-none gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-theme-accent font-bold tracking-wider">
            [VIM: {activePane.toUpperCase()}]
          </span>
          <span>
            <kbd className="text-foreground font-semibold">h</kbd>/
            <kbd className="text-foreground font-semibold">l</kbd> switch pane
          </span>
          <span className="hidden sm:inline text-muted-foreground/40">|</span>
          <span className="hidden sm:inline">
            <kbd className="text-foreground font-semibold">j</kbd>/
            <kbd className="text-foreground font-semibold">k</kbd>{" "}
            {activePane === "sidebar" ? "navigate" : "scroll"}
          </span>
          <span className="hidden md:inline text-muted-foreground/40">|</span>
          <span className="hidden md:inline">
            <kbd className="text-foreground font-semibold">Tab</kbd> toggle
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer ml-auto"
          title="Copy conversation"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-theme-accent" />
              <span className="text-theme-accent">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function CodeBlockRenderer({
  language,
  value,
}: {
  language?: string
  value: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="my-6 rounded-lg border border-border/50 bg-theme-bg-darker/60 overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between border-b border-border/50 bg-theme-bg-darker px-4 py-2 select-none">
        <span className="text-[10px] uppercase tracking-wider text-theme-accent font-medium">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40 transition-all cursor-pointer"
          title="Copy code"
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
      <pre className="p-4 overflow-x-auto leading-relaxed">
        <code className="text-sm font-mono text-foreground">{value}</code>
      </pre>
    </div>
  )
}

function preprocessMath(raw: string): string {
  if (!raw) return ""
  // Separate code fences so we never alter math inside pre/code blocks
  const parts = raw.split(/(```[\s\S]*?```)/g)
  return parts
    .map((part) => {
      if (part.startsWith("```")) {
        return part
      }
      // Ensure all $$...$$ formulas are separated from surrounding paragraphs by blank lines
      // and formatted cleanly as display blocks
      return part.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
        return `\n\n$$\n${formula.trim()}\n$$\n\n`
      })
    })
    .join("")
}

export function MarkdownRenderer({ content }: { content: string }) {
  const formattedContent = preprocessMath(content)

  return (
    <div className="blog-content space-y-6 text-[15px] sm:text-base font-light leading-[1.85]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-theme-fg-bright pt-10 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-theme-fg-bright pt-8 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-light tracking-tight text-theme-fg-bright pt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-mono uppercase tracking-wider text-theme-accent pt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="leading-[1.85]">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-theme-fg-bright">
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className="font-semibold text-theme-fg-bright">{children}</b>
          ),
          em: ({ children }) => (
            <em className="text-theme-fg-bright italic">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-theme-accent hover:text-theme-fg-bright underline underline-offset-4 transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-theme-accent/60 pl-4 py-1 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-4 pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-4 pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          hr: () => <hr className="border-border/50 my-10" />,
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match && !String(children).includes("\n")

            if (isInline) {
              return (
                <code
                  className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-theme-bg-lighter/60 border border-border/50 text-theme-yellow"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            const lang = match ? match[1].toLowerCase() : ""
            const codeString = String(children).replace(/\n$/, "")

            if (lang === "cli" || lang === "chat" || lang === "terminal") {
              const metaTitle = (node?.data as any)?.meta as string | undefined
              return (
                <CliChatRenderer
                  title={metaTitle || undefined}
                  value={codeString}
                />
              )
            }

            return (
              <CodeBlockRenderer
                language={match ? match[1] : undefined}
                value={codeString}
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
