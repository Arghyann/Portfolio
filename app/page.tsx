import Link from "next/link"
import { CopyEmail } from "@/components/copy-email"
import { TopNav } from "@/components/top-nav"
import { ArrowUpRight } from "lucide-react"
import { featuredProjects } from "@/lib/projects-data"

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[692px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      {/* Top Bar */}
      <TopNav />

      {/* Top Header */}
      <header className="mb-14 sm:mb-20 flex flex-col items-start">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
          <Link
            href="/"
            className="text-foreground hover:text-accent transition-colors no-underline"
          >
            Aryan Mane
          </Link>
        </h1>
        <span className="text-muted text-sm sm:text-base font-normal mt-1">
          Full Stack Developer
        </span>
      </header>

      <main className="space-y-12 sm:space-y-16">
        {/* About */}
        <section>
          <div className="space-y-4 text-muted text-sm sm:text-[15px] leading-[1.7]">
            <p>
              I like to learn how systems work and then solve problems with them. I&apos;ve built full-stack applications across{" "}
              <span className="text-foreground font-medium">Go</span>,{" "}
              <span className="text-foreground font-medium">Python</span>,{" "}
              <span className="text-foreground font-medium">Next.js</span>, and{" "}
              <span className="text-foreground font-medium">Kubernetes</span>. I particularly enjoy learning about Operating Systems and Math. When I&apos;m done exploring things, sometimes I{" "}
              <Link
                href="/blog"
                className="underline underline-offset-4 decoration-border hover:decoration-accent hover:text-accent transition-colors"
              >
                write about it
              </Link>
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Work */}
        <section id="work">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-medium text-foreground text-xl sm:text-2xl tracking-tight">
              Work
            </h2>
            <span className="text-xs sm:text-[13px] text-muted/70 font-mono">
              Experience &amp; Roles
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            {/* Signalmint */}
            <Link
              href="https://signalmint.in"
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-3 flex flex-col rounded-lg px-3 py-2.5 sm:py-3 transition-colors hover:bg-surface-hover group cursor-pointer no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-foreground text-base sm:text-[17px] group-hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span>Signalmint</span>
                  <ArrowUpRight className="w-4 h-4 text-muted/70 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </span>
                <span className="text-xs sm:text-sm text-muted/80 font-mono group-hover:text-foreground transition-colors">
                  Nov 2025 - Apr 2026
                </span>
              </div>
              <div className="text-xs sm:text-sm text-muted font-mono mt-0.5">
                Full Stack Developer · Valnee Solutions
              </div>
              <p className="text-muted text-sm sm:text-[15px] leading-relaxed pt-1">
                Built and maintained an ad analysis pipeline that would scrape ads from the Meta Ad Library, rank them and compare competitor ads using Redis as a messaging queue and asynchronous Celery workers.
              </p>
            </Link>

            {/* Thyne Jewels / Valnee Case Study */}
            <Link
              href="https://www.valnee.com/case-studies/thyne-ai-case-study"
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-3 flex flex-col rounded-lg px-3 py-2.5 sm:py-3 transition-colors hover:bg-surface-hover group cursor-pointer no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-foreground text-base sm:text-[17px] group-hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span>Thyne Jewels</span>
                  <ArrowUpRight className="w-4 h-4 text-muted/70 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </span>
                <span className="text-xs sm:text-sm text-muted/80 font-mono group-hover:text-foreground transition-colors">
                  Feb 2026 - July 2026
                </span>
              </div>
              <div className="text-xs sm:text-sm text-muted font-mono mt-0.5">
                Full Stack Developer · Valnee Solutions
              </div>
              <p className="text-muted text-sm sm:text-[15px] leading-relaxed pt-1">
                Built a Full stack Flutter Application with a Go backend for an E-commerce Jewellery Application. Handled deployment across the Play Store, App Store and AWS. Restructured infrastructure to cut client's cloud costs by 30%.
              </p>
            </Link>

            {/* Reach Saga */}
            <Link
              href="https://reachsaga.com"
              target="_blank"
              rel="noopener noreferrer"
              className="-mx-3 flex flex-col rounded-lg px-3 py-2.5 sm:py-3 transition-colors hover:bg-surface-hover group cursor-pointer no-underline focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-foreground text-base sm:text-[17px] group-hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span>Reach Saga</span>
                  <ArrowUpRight className="w-4 h-4 text-muted/70 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </span>
                <span className="text-xs sm:text-sm text-muted/80 font-mono group-hover:text-foreground transition-colors">
                  June 2026 - August 2026
                </span>
              </div>
              <div className="text-xs sm:text-sm text-muted font-mono mt-0.5">
                Full Stack Developer · Valnee Solutions
              </div>
              <p className="text-muted text-sm sm:text-[15px] leading-relaxed pt-1">
                Built an AI Video Generation and Editing Pipeline to for SEO optimised Articles. Designed AI pipelines to analyse Keywords for SEO first content.
              </p>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Projects */}
        <section id="projects">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-medium text-foreground text-xl sm:text-2xl tracking-tight">
              Projects
            </h2>
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            {featuredProjects.map((project) => (
              <Link
                key={project.title}
                href={project.liveUrl || project.githubUrl}
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

          <div className="mt-3 pt-1">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono text-muted hover:text-foreground transition-colors group no-underline"
            >
              <span className="group-hover:text-accent transition-colors">view all work</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted/70 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* More / Connect */}
        <section id="connect">
          <h2 className="mb-4 block font-medium text-foreground text-xl sm:text-2xl tracking-tight">
            More
          </h2>
          <p className="text-muted text-sm sm:text-[15px] leading-[1.6]">
            You can see more of my code on{" "}
            <Link
              href="https://github.com/Arghyann"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent hover:text-accent transition-colors"
            >
              GitHub
            </Link>
            , connect on{" "}
            <Link
              href="https://www.linkedin.com/in/aryan-mane-00a6082b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent hover:text-accent transition-colors"
            >
              LinkedIn
            </Link>
            , or reach out directly at{" "}
            <CopyEmail
              email="aryan.dev.careers@gmail.com"
              className="text-foreground underline underline-offset-4 decoration-border hover:decoration-accent hover:text-accent transition-colors cursor-pointer"
            >
              aryan.dev.careers@gmail.com
            </CopyEmail>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
