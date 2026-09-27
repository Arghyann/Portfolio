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
  const [cursorLine, setCursorLine] = useState(0)
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

  const lines = activeContent
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const totalLines = lines.length

  // Ensure cursorLine is clamped when sections change
  React.useEffect(() => {
    setCursorLine(0)
  }, [safeIdx])

  // Scroll into view when cursor changes
  React.useEffect(() => {
    if (activePane === "messages" && messageAreaRef.current) {
      const activeEl = messageAreaRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [cursorLine, activePane])

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
          setCursorLine((prev) => Math.min(prev + 1, Math.max(0, totalLines - 1)))
        }
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault()
        if (activePane === "sidebar") {
          setCurrentIdx((prev) => (prev - 1 + total) % total)
        } else {
          setCursorLine((prev) => Math.max(prev - 1, 0))
        }
      } else if (e.key >= "1" && e.key <= String(Math.min(total, 9))) {
        e.preventDefault()
        setCurrentIdx(Number(e.key) - 1)
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [total, activePane, totalLines])

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
      </div>

      {/* Main TUI Body: Constant Fixed Height with Hidden Scrollbars */}
      <div className="flex flex-col sm:flex-row h-[360px] sm:h-[400px]">
        {/* Sidebar - No Cursor */}
        {total > 1 && (
          <div
            onClick={() => setActivePane("sidebar")}
            className="sm:w-44 border-b sm:border-b-0 sm:border-r border-border/60 bg-theme-bg-darker/90 p-2 flex sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-y-auto shrink-0 select-none no-scrollbar"
          >
            {sections.map((_, idx) => {
              const label = `chat ${idx + 1}`

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIdx(idx)
                    setActivePane("sidebar")
                  }}
                  className={`whitespace-nowrap sm:w-full text-left px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer flex items-center justify-between shrink-0 rounded-sm ${
                    idx === safeIdx && activePane === "sidebar"
                      ? "bg-foreground text-background font-bold shadow-sm"
                      : idx === safeIdx
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40"
                  }`}
                >
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Right Area: Messages */}
        <div className="flex-1 flex flex-col bg-theme-bg-darker/40 min-w-0 min-h-0">
          <div
            ref={messageAreaRef}
            onClick={() => setActivePane("messages")}
            className="flex-1 py-4 sm:py-5 px-2 sm:px-3 overflow-y-auto leading-relaxed no-scrollbar cursor-text break-words whitespace-pre-wrap min-h-0 touch-pan-y"
          >
            {lines.map((line, idx) => {
              const isCursor = activePane === "messages" && idx === cursorLine

              let content: React.ReactNode = null

              if (line.startsWith("[") && line.endsWith("]")) {
                const text = line
                content = (
                  <span className="text-xs text-muted-foreground/75 italic select-none">
                    {isCursor && text.length > 0 ? (
                      <>{text.slice(0, -1)}<span className="bg-muted-foreground text-background animate-pulse">{text.slice(-1)}</span></>
                    ) : isCursor && text.length === 0 ? (
                      <span className="inline-block w-2 h-3.5 bg-muted-foreground animate-pulse align-middle -mt-0.5" />
                    ) : (
                      text
                    )}
                  </span>
                )
              } else {
                const userMatch = /^(?:> ?)?you:\s*(.*)/i.exec(line)
                if (userMatch) {
                  const msg = userMatch[1]
                  content = (
                    <>
                      <span className="text-theme-accent font-semibold">You: </span>
                      <span className="text-theme-fg-bright font-medium">
                        {isCursor && msg.length > 0 ? (
                          <>{msg.slice(0, -1)}<span className="bg-theme-fg-bright text-background animate-pulse">{msg.slice(-1)}</span></>
                        ) : isCursor && msg.length === 0 ? (
                          <span className="inline-block w-2 h-3.5 bg-theme-fg-bright animate-pulse align-middle -mt-0.5" />
                        ) : (
                          msg
                        )}
                      </span>
                    </>
                  )
                } else {
                  const botMatch = /^(Aryan(?:\s*\([^)]+\))?|qwen(?:\s*\([^)]+\))?|bot|assistant):\s*(.*)/i.exec(line)
                  if (botMatch) {
                    const msg = botMatch[2]
                    content = (
                      <>
                        <span className="text-theme-yellow font-semibold">{botMatch[1]}: </span>
                        <span className="text-foreground/90">
                          {isCursor && msg.length > 0 ? (
                            <>{msg.slice(0, -1)}<span className="bg-foreground text-background animate-pulse">{msg.slice(-1)}</span></>
                          ) : isCursor && msg.length === 0 ? (
                            <span className="inline-block w-2 h-3.5 bg-foreground animate-pulse align-middle -mt-0.5" />
                          ) : (
                            msg
                          )}
                        </span>
                      </>
                    )
                  } else {
                    const msg = line
                    content = (
                      <span className="text-foreground/90">
                        {isCursor && msg.length > 0 ? (
                          <>{msg.slice(0, -1)}<span className="bg-foreground text-background animate-pulse">{msg.slice(-1)}</span></>
                        ) : isCursor && msg.length === 0 ? (
                          <span className="inline-block w-2 h-3.5 bg-foreground animate-pulse align-middle -mt-0.5" />
                        ) : (
                          msg
                        )}
                      </span>
                    )
                  }
                }
              }

              return (
                <div
                  key={idx}
                  data-active={isCursor}
                  className={`px-2 py-0.5 rounded-sm transition-colors ${
                    isCursor ? "bg-theme-bg-lighter/30" : ""
                  }`}
                >
                  {content}
                </div>
              )
            })}
          </div>
        </div>
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
