"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Check, Copy } from "lucide-react"

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

  React.useEffect(() => {
    setCursorLine(0)
  }, [safeIdx])

  React.useEffect(() => {
    if (activePane === "messages" && messageAreaRef.current) {
      const activeEl = messageAreaRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" })
      }
    }
  }, [cursorLine, activePane])

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

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="my-8 rounded-lg border border-border bg-surface overflow-hidden font-mono text-xs shadow-xs focus:outline-none transition-all select-text"
    >
      {/* Top Header Bar */}
      <div className="bg-border text-foreground px-3.5 py-1.5 font-mono text-[11px] font-medium flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="tracking-wide uppercase text-accent font-semibold">{title || "dialogue session"}</span>
          <span className="text-[10px] opacity-75 font-normal">
            [{activePane === "sidebar" ? "sessions" : "dialogue"}]
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-muted hover:text-foreground transition-colors cursor-pointer text-[10px]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row h-[320px]">
        {total > 1 && (
          <div
            onClick={() => setActivePane("sidebar")}
            className="sm:w-36 border-b sm:border-b-0 sm:border-r border-border bg-background/50 p-2 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto shrink-0 select-none"
          >
            {sections.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIdx(idx)
                  setActivePane("sidebar")
                }}
                className={`whitespace-nowrap sm:w-full text-left px-2 py-1 text-[11px] font-mono transition-colors cursor-pointer flex items-center justify-between shrink-0 rounded ${
                  idx === safeIdx && activePane === "sidebar"
                    ? "bg-accent text-background font-semibold"
                    : idx === safeIdx
                    ? "text-foreground font-medium"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span>chat {idx + 1}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-transparent">
          <div
            ref={messageAreaRef}
            onClick={() => setActivePane("messages")}
            className="flex-1 p-3.5 overflow-y-auto leading-relaxed cursor-text break-words whitespace-pre-wrap min-h-0 touch-pan-y"
          >
            {lines.map((line, idx) => {
              const isCursor = activePane === "messages" && idx === cursorLine

              let content: React.ReactNode = null
              const userMatch = /^(?:> ?)?you:\s*(.*)/i.exec(line)
              const botMatch = /^(Aryan(?:\s*\([^)]+\))?|qwen(?:\s*\([^)]+\))?|bot|assistant):\s*(.*)/i.exec(line)

              if (userMatch) {
                content = (
                  <span>
                    <span className="text-accent font-semibold">You: </span>
                    <span className="text-foreground/90">{userMatch[1]}</span>
                  </span>
                )
              } else if (botMatch) {
                content = (
                  <span>
                    <span className="text-accent-green font-semibold">{botMatch[1]}: </span>
                    <span className="text-foreground/90">{botMatch[2]}</span>
                  </span>
                )
              } else {
                content = <span className="text-muted">{line}</span>
              }

              return (
                <div
                  key={idx}
                  data-active={isCursor}
                  className={`py-0.5 px-1 rounded transition-colors ${
                    isCursor ? "bg-surface-hover" : ""
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
    <div className="my-6 rounded-lg border border-border bg-surface overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-2 select-none">
        <span className="text-[11px] uppercase tracking-wider text-accent font-medium">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-muted hover:text-foreground transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent-green" />
              <span className="text-accent-green font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed text-foreground">
        <code>{value}</code>
      </pre>
    </div>
  )
}

function preprocessMath(raw: string): string {
  if (!raw) return ""
  const parts = raw.split(/(```[\s\S]*?```)/g)
  return parts
    .map((part) => {
      if (part.startsWith("```")) {
        return part
      }
      return part.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
        return `\n\n$$\n${formula.trim()}\n$$\n\n`
      })
    })
    .join("")
}

export function MarkdownRenderer({ content }: { content: string }) {
  const formattedContent = preprocessMath(content)

  return (
    <div className="blog-content space-y-7 sm:space-y-9 text-foreground/90 text-[15px] sm:text-[16.5px] leading-[1.85] font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground pt-10 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground pt-10 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-medium tracking-tight text-foreground pt-8 pb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium uppercase tracking-wider text-accent pt-6 pb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-7 sm:mb-9 leading-[1.85] text-foreground/90">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className="font-semibold text-foreground">{children}</b>
          ),
          em: ({ children }) => (
            <em className="text-foreground italic">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent hover:text-accent transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-4 py-1 italic text-muted my-4">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-4 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-4 pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          hr: () => <hr className="border-border my-8" />,
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match && !String(children).includes("\n")

            if (isInline) {
              return (
                <code
                  className="font-mono text-[0.88em] px-1.5 py-0.5 rounded bg-surface border border-border text-accent-green"
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
