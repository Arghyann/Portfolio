"use client"

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { Check, Copy } from "lucide-react"

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

            const codeString = String(children).replace(/\n$/, "")
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
