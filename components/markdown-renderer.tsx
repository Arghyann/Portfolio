"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react"

function SingleChatCard({
  title,
  value,
  className,
}: {
  title?: string
  value: string
  className?: string
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

  const lines = value.split("\n")

  return (
    <div
      className={`rounded-lg border border-border/50 bg-theme-bg-darker/70 overflow-hidden font-mono text-sm shadow-md transition-colors hover:border-theme-accent/40 flex flex-col ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-theme-bg-darker px-4 py-2.5 select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-theme-accent uppercase font-medium truncate max-w-[220px]">
            {title || "chat transcript"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40 transition-all cursor-pointer"
          title="Copy conversation"
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

      <div className="p-4 sm:p-5 space-y-2.5 overflow-x-auto leading-relaxed text-sm flex-1">
        {lines.map((line, idx) => {
          const trimmed = line.trim()
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />
          }

          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            return (
              <div
                key={idx}
                className="py-1.5 text-center text-xs text-muted-foreground/75 italic border-y border-border/40 my-2 select-none"
              >
                {trimmed}
              </div>
            )
          }

          const isUser =
            /^> ?you:/i.test(trimmed) ||
            /^you:/i.test(trimmed) ||
            trimmed.startsWith(">")
          if (isUser) {
            const cleanText = trimmed
              .replace(/^> ?/i, "")
              .replace(/^you:\s*/i, "")
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-foreground pt-1 min-w-max"
              >
                <span className="text-theme-accent font-semibold select-none shrink-0">
                  &gt; you:
                </span>
                <span className="text-theme-fg-bright font-medium">{cleanText}</span>
              </div>
            )
          }

          const botMatch = /^(Aryan(?:\s*\([^)]+\))?|qwen(?:\s*\([^)]+\))?|bot):\s*(.*)/i.exec(
            trimmed
          )
          if (botMatch) {
            const botName = botMatch[1]
            const botText = botMatch[2]
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 pl-4 sm:pl-5 text-foreground min-w-max"
              >
                <span className="text-theme-yellow font-medium select-none shrink-0">
                  {botName.toLowerCase()}:
                </span>
                <span className="text-foreground/90">{botText}</span>
              </div>
            )
          }

          return (
            <div key={idx} className="pl-6 sm:pl-7 text-foreground/80 min-w-max">
              {trimmed}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CliChatRenderer({
  title,
  value,
}: {
  title?: string
  value: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Check if multiple conversations are separated by "===" or "---"
  const hasMultiple = /(?:^|\n)(?:={3,}|-{3,})/.test(value)

  if (!hasMultiple) {
    return (
      <div className="my-8">
        <SingleChatCard title={title || "qwen-14b"} value={value} />
      </div>
    )
  }

  // Parse multiple sections
  const rawSections = value
    .split(/(?:^|\n)(?:={3,}|-{3,})\s*(?:.*?\n)?/)
    .map((s) => s.trim())
    .filter(Boolean)

  const cards = rawSections.map((content, idx) => {
    const num = String(idx + 1).padStart(2, "0")
    return {
      title: `session ${num}`,
      content,
    }
  })

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const offset = direction === "left" ? -360 : 360
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
  }

  return (
    <div className="my-8 space-y-3">
      {/* Generic clean header */}
      <div className="flex items-center justify-between text-xs font-mono select-none px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
          <span className="text-theme-accent font-medium uppercase tracking-wider text-[11px]">
            {title || "qwen-14b"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded border border-border/60 hover:border-theme-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Previous session"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded border border-border/60 hover:border-theme-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Next session"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="w-[85vw] max-w-[420px] sm:w-[380px] shrink-0 snap-start flex flex-col"
          >
            <SingleChatCard
              title={card.title}
              value={card.content}
              className="h-full"
            />
          </div>
        ))}
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
