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
  const [copied, setCopied] = useState(false)

  // Split multiple conversations by "===" or "---"
  const rawSections = value
    .split(/(?:^|\n)(?:={3,}|-{3,})\s*(?:.*?\n)?/)
    .map((s) => s.trim())
    .filter(Boolean)

  const sections = rawSections.length > 0 ? rawSections : [value.trim()]
  const total = sections.length
  const safeIdx = currentIdx < total ? currentIdx : 0
  const activeContent = sections[safeIdx]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const goNext = () => {
    setCurrentIdx((prev) => (prev + 1) % total)
  }

  const goPrev = () => {
    setCurrentIdx((prev) => (prev - 1 + total) % total)
  }

  const lines = activeContent.split("\n")

  return (
    <div className="my-8 rounded-lg border border-border/50 bg-theme-bg-darker/70 overflow-hidden font-mono text-sm shadow-md transition-colors hover:border-theme-accent/40 flex flex-col">
      {/* Top Terminal Bar */}
      <div className="flex items-center justify-between border-b border-border/50 bg-theme-bg-darker px-4 py-2.5 select-none gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-theme-accent animate-pulse shrink-0" />
          <span className="text-[12px] font-mono tracking-wider text-theme-accent uppercase font-medium">
            {title || "qwen-14b"}
          </span>
          {total > 1 && (
            <span className="text-[11px] font-mono text-muted-foreground/80 bg-theme-bg px-2 py-0.5 rounded border border-border/40">
              {safeIdx + 1} / {total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {total > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={goPrev}
                className="p-1 rounded border border-border/60 hover:border-theme-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Previous chat"
                aria-label="Previous chat"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-theme-accent/50 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-medium transition-colors cursor-pointer"
                title="Next chat"
                aria-label="Next chat"
              >
                <span>next chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40 transition-all cursor-pointer"
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
      </div>

      {/* Terminal Content: Full width, wraps text naturally without horizontal scrolling */}
      <div className="p-4 sm:p-5 space-y-2.5 leading-relaxed text-sm">
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
                className="flex items-start gap-2.5 text-foreground pt-1"
              >
                <span className="text-theme-accent font-semibold select-none shrink-0">
                  &gt; you:
                </span>
                <span className="text-theme-fg-bright font-medium break-words">
                  {cleanText}
                </span>
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
                className="flex items-start gap-2.5 pl-4 sm:pl-5 text-foreground"
              >
                <span className="text-theme-yellow font-medium select-none shrink-0">
                  {botName.toLowerCase()}:
                </span>
                <span className="text-foreground/90 break-words">{botText}</span>
              </div>
            )
          }

          return (
            <div key={idx} className="pl-6 sm:pl-7 text-foreground/80 break-words">
              {trimmed}
            </div>
          )
        })}
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
