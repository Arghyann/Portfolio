"use client"

import * as React from "react"
import { Drawer } from "vaul"
import Link from "next/link"
import { ExternalLink, Github, Sparkles, X } from "lucide-react"

export interface ProjectData {
  title: string
  subtitle: string
  period: string
  description: string
  highlights: string[]
  tech: string[]
  githubUrl?: string
  demoUrl?: string
  articleUrl?: string
  interactiveDemo?: "llm" | "cache" | "blockchain" | null
}

interface ProjectItemProps {
  project: ProjectData
}

export function ProjectItem({ project }: ProjectItemProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          className="w-full text-left -mx-3 flex flex-col rounded-lg px-3 py-2.5 sm:py-3 transition-colors hover:bg-surface-hover group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-foreground group-hover:text-accent transition-colors">
              {project.title}
            </span>
            <span className="text-xs text-muted/80 font-mono group-hover:text-foreground transition-colors">
              {project.period}
            </span>
          </div>
          <span className="text-muted text-sm mt-0.5 leading-relaxed">
            {project.subtitle}
          </span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity" />
        <Drawer.Content className="bg-background border-t border-border fixed bottom-0 left-0 right-0 max-h-[88vh] z-50 rounded-t-[20px] flex flex-col focus:outline-none">
          {/* Drag Handle */}
          <div className="pt-3 pb-2 flex justify-center">
            <Drawer.Handle className="w-12 h-1 rounded-full bg-border" />
          </div>

          <div className="overflow-y-auto px-6 pb-8 pt-2 max-w-[692px] mx-auto w-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="text-xs font-mono text-accent mb-1">
                  {project.period}
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-foreground tracking-tight">
                  {project.title}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {project.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="py-5 space-y-4">
              <p className="text-foreground/90 text-[15px] leading-relaxed">
                {project.description}
              </p>

              {/* Technical Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted">
                    Architecture &amp; Engineering Highlights
                  </span>
                  <ul className="space-y-2 text-sm text-muted">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span className="text-foreground/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive preview for LLM if applicable */}
              {project.interactiveDemo === "llm" && <InteractiveLlmPreview />}

              {/* Tech Stack Chips */}
              <div className="pt-4">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-2">
                  Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs font-mono rounded bg-surface text-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-border">
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium bg-accent text-background hover:opacity-90 transition-opacity"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View on GitHub</span>
                </Link>
              )}

              {project.articleUrl && (
                <Link
                  href={project.articleUrl}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium bg-surface text-foreground hover:bg-surface-hover border border-border transition-colors"
                >
                  <span>Read Writeup</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function InteractiveLlmPreview() {
  const samples = [
    {
      prompt: "what does love look like to you?",
      response: "Well... You put your phone aside for a while. That's love to me.",
    },
    {
      prompt: "are you free tonight?",
      response: "depends, is there food or are we pretending to be productive?",
    },
    {
      prompt: "how do you survive distributed systems?",
      response: "pessimism, retries with exponential backoff, and idempotency keys everywhere.",
    },
  ]

  const [activeIdx, setActiveIdx] = React.useState(0)

  return (
    <div className="my-3 p-4 rounded-lg bg-surface border border-border space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between text-muted">
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-accent">
          <Sparkles className="w-3 h-3 text-accent-yellow" />
          Interactive Model Output
        </span>
        <span className="text-[11px]">Llama 3.1 8B (QLoRA)</span>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {samples.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
              activeIdx === idx
                ? "bg-accent text-background font-semibold"
                : "bg-surface-hover text-muted hover:text-foreground"
            }`}
          >
            Example {idx + 1}
          </button>
        ))}
      </div>

      <div className="p-3 rounded bg-background border border-border space-y-2">
        <div className="text-muted">
          <span className="text-accent font-semibold">User:</span>{" "}
          &quot;{samples[activeIdx].prompt}&quot;
        </div>
        <div className="text-foreground">
          <span className="text-accent-green font-semibold">Aryan (Tuned):</span>{" "}
          &quot;{samples[activeIdx].response}&quot;
        </div>
      </div>
    </div>
  )
}
