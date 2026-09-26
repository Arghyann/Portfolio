"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { ChevronLeft, ChevronRight, Check, Copy } from "lucide-react"

interface ParsedChatMessage {
  sender: "user" | "bot" | "system"
  senderName: string
  text: string
}

function parseConversation(raw: string): ParsedChatMessage[] {
  const lines = raw.split("\n")
  const messages: ParsedChatMessage[] = []
  let currentMsg: ParsedChatMessage | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    if (line.startsWith("[") && line.endsWith("]")) {
      if (currentMsg) {
        messages.push(currentMsg)
        currentMsg = null
      }
      messages.push({
        sender: "system",
        senderName: "system",
        text: line.slice(1, -1).trim() || line,
      })
      continue
    }

    const isUser = /^> ?you:\s*/i.test(line) || /^you:\s*/i.test(line)
    if (isUser) {
      if (currentMsg) messages.push(currentMsg)
      const clean = line.replace(/^> ?you:\s*/i, "").replace(/^you:\s*/i, "")
      currentMsg = { sender: "user", senderName: "You", text: clean }
      continue
    }

    const botMatch = /^(Aryan(?:\s*\([^)]+\))?|qwen(?:\s*\([^)]+\))?|bot|assistant):\s*(.*)/i.exec(
      line
    )
    if (botMatch) {
      if (currentMsg) messages.push(currentMsg)
      currentMsg = {
        sender: "bot",
        senderName: botMatch[1],
        text: botMatch[2],
      }
      continue
    }

    if (currentMsg) {
      currentMsg.text += "\n" + line
    } else {
      currentMsg = { sender: "bot", senderName: "bot", text: line }
    }
  }

  if (currentMsg) messages.push(currentMsg)
  return messages
}

function CliChatRenderer({
  title,
  value,
}: {
  title?: string
  value: string
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [copied, setCopied] = useState(false)

  // Split multiple conversations by === or --- without consuming subsequent text
  const rawSections = value
    .split(/(?:^|\n)\s*(?:={3,}|-{3,})\s*(?:\n|$)/)
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

  const messages = parseConversation(activeContent)

  return (
    <div className="my-8 rounded-xl border border-border/70 bg-theme-bg-darker/90 overflow-hidden shadow-lg flex flex-col">
      {/* Chat App Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-theme-bg-darker px-4 py-3 select-none gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-theme-accent/15 border border-theme-accent/30 text-theme-accent font-mono text-xs font-semibold">
            {title ? title.slice(0, 2).toUpperCase() : "AI"}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-theme-green border-2 border-theme-bg-darker" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-medium tracking-wide text-theme-fg-bright uppercase">
              {title || "qwen-14b"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/75">
              direct message
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {total > 1 && (
            <div className="flex items-center gap-1.5 bg-theme-bg/60 border border-border/60 rounded-lg p-1">
              <button
                onClick={goPrev}
                className="p-1 rounded hover:bg-theme-bg-lighter/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Previous chat"
                aria-label="Previous chat"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-muted-foreground px-1 select-none">
                {safeIdx + 1} / {total}
              </span>
              <button
                onClick={goNext}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-theme-accent/15 hover:bg-theme-accent/25 text-theme-accent text-xs font-mono font-medium transition-colors cursor-pointer"
                title="Next chat"
                aria-label="Next chat"
              >
                <span>next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:bg-theme-bg-lighter/40 transition-all cursor-pointer"
            title="Copy conversation"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-theme-accent" />
                <span className="text-theme-accent font-mono text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Messages Stream - Left and Right Chat Bubbles */}
      <div className="p-4 sm:p-6 space-y-3.5 bg-theme-bg/30">
        {messages.map((msg, idx) => {
          if (msg.sender === "system") {
            return (
              <div key={idx} className="flex justify-center my-2">
                <span className="px-3 py-1 rounded-full bg-theme-bg-lighter/50 border border-border/50 text-[11px] font-mono text-muted-foreground/80 italic select-none">
                  {msg.text}
                </span>
              </div>
            )
          }

          if (msg.sender === "user") {
            return (
              <div key={idx} className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-muted-foreground/70 mr-1 mb-1 select-none">
                  you
                </span>
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs px-4 py-2.5 bg-theme-accent/20 border border-theme-accent/35 text-theme-fg-bright font-mono text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm">
                  {msg.text}
                </div>
              </div>
            )
          }

          return (
            <div key={idx} className="flex flex-col items-start">
              <span className="text-[10px] font-mono text-theme-yellow/85 ml-1 mb-1 select-none">
                {msg.senderName}
              </span>
              <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tl-xs px-4 py-2.5 bg-theme-bg-lighter/80 border border-border/70 text-foreground font-mono text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm">
                {msg.text}
              </div>
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
