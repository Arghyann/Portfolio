import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/projects-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects — Aryan Mane",
  description: "Systems architectures, distributed services, and open-source projects built by Aryan Mane.",
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[692px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      {/* Back Button */}
      <div className="mb-10 sm:mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-mono text-muted hover:text-foreground transition-colors group no-underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>home</span>
        </Link>
      </div>

      <main className="space-y-12">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 leading-[1.6]">
            Distributed systems, backend services, and machine learning pipelines built from first principles.
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5 pt-2">
          {projects.map((project) => (
            <Link
              key={project.title}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-3 flex flex-col rounded-lg px-3 py-2.5 sm:py-3 transition-colors hover:bg-surface-hover group cursor-pointer no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-foreground text-base sm:text-[17px] group-hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted/70 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </span>
                <span className="text-xs sm:text-sm text-muted/80 font-mono group-hover:text-foreground transition-colors">
                  {project.period}
                </span>
              </div>
              <p className="text-muted text-sm sm:text-[15px] leading-relaxed pt-1">
                {project.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
