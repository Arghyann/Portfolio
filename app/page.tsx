"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { MacTerminal } from "../components/mac-terminal"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {["intro", "terminal", "work", "projects", "connect"].map((section) => (
            <button
              key={section}
              onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                activeSection === section ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Navigate to ${section}`}
            />
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => { sectionsRef.current[0] = el }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-12 sm:gap-16 w-full">
            <div className="lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2026</div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
                  Aryan
                  <br />
                  <span className="text-muted-foreground">Mane</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Full Stack Developer working across{" "}
                  <span className="text-foreground">Kubernetes</span>,{" "}
                  <span className="text-foreground">Go</span>,{" "}
                  <span className="text-foreground">AWS</span>, and{" "}
                  <span className="text-foreground">distributed systems</span>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work
                  </div>
                  <div>Mumbai, India</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-6 sm:space-y-8 mt-8 lg:mt-0">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {["Go", "Kubernetes", "AWS", "DevOps", "Java", "Docker", "PostgreSQL"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section
          id="terminal"
          ref={(el) => { sectionsRef.current[1] = el }}
          className="min-h-screen flex flex-col justify-center py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Interactive Terminal</h2>
              <div className="text-sm text-muted-foreground font-mono">SSH / CLI</div>
            </div>

            <MacTerminal />
          </div>
        </section>

        <section
          id="work"
          ref={(el) => { sectionsRef.current[2] = el }}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Selected Work</h2>
              <div className="text-sm text-muted-foreground font-mono">2025 — 2026</div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025 — 2026",
                  role: "Full Stack Developer",
                  company: "Valnee Solutions",
                  location: "Mumbai, India",
                  description:
                    "Restructured Go and FastAPI backend services, cutting cloud infrastructure costs. Built scalable cloud services on AWS, integrated Redis caching, and automated CI/CD deployment workflows. Engineered a scalable backend for an ad analysis platform using Redis as a message queue with Python worker servers to concurrently process ad payloads from the main server.",
                  tech: ["Go", "FastAPI", "AWS", "Redis", "Python"],
                },
                {
                  year: "Education",
                  role: "B.E. AI & Data Science",
                  company: "VESIT",
                  location: "Mumbai, India",
                  description:
                    "Bachelor of Engineering in Artificial Intelligence & Data Science at Vivekananda Education Society's Institute of Technology (VESIT).",
                  tech: ["AI & Data Science", "VESIT"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="lg:col-span-3">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company} · {job.location}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">{job.description}</p>
                  </div>

                  <div className="lg:col-span-3 flex flex-wrap gap-2 lg:justify-end items-start content-start mt-2 lg:mt-0">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="projects"
          ref={(el) => { sectionsRef.current[3] = el }}
          className="min-h-screen py-20 sm:py-32 opacity-0"
        >
          <div className="space-y-12 sm:space-y-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl font-light">Featured Projects</h2>
              <div className="text-sm text-muted-foreground font-mono">2026</div>
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-1">
              {[
                {
                  title: "Loan Approval Microservices Platform",
                  tech: "Go, Amazon EKS, RabbitMQ, AWS VPC, RDS PostgreSQL",
                  date: "2026",
                  url: "https://github.com/Arghyann/Loan-approval-microservice",
                  description:
                    "Designed an event-driven loan approval system in Go with IAM, Loan, and Notification microservices on Amazon EKS. Implemented RSA-signed JWT authentication, isolated AWS VPC subnets, and load-tested sustaining 1M+ requests/sec.",
                },
                {
                  title: "Personalized LLM Fine-Tuning & Ingestion Pipeline (Llama 3.1 8B)",
                  tech: "Llama 3.1, Unsloth, QLoRA, Modal Cloud, Python, Hugging Face",
                  date: "2026",
                  description:
                    "Developed an end-to-end serverless fine-tuning pipeline to adapt Meta Llama 3.1 8B Instruct for hyper-personalized conversational style and Hinglish tone replication. Architected multi-platform data harvesters to extract, sanitize, and format 10,000+ Signal and Instagram message logs into dynamic 12-turn dialogue windows. Trained a 4-bit QLoRA adapter using Unsloth and Hugging Face SFTTrainer on serverless NVIDIA A100 GPUs via Modal Cloud.",
                  prompt: "what does love look like to you?",
                  response: "Well... You put your phone aside for a while. That's love to me.",
                },
                {
                  title: "NimbusCache",
                  tech: "Java 17, Spring Boot, Maven, Concurrency",
                  date: "May 2026",
                  url: "https://github.com/Arghyann/SpringBoot-Cache-Service",
                  description:
                    "Built a Redis-inspired in-memory cache in Java using ConcurrentHashMap and ReentrantLocks. Implemented LRU eviction, lazy TTL expiration, background cleanup, and JSON snapshots. Verified zero deadlocks under 200 concurrent writer threads.",
                },
                {
                  title: "Distributed Blockchain",
                  tech: "Java 17, ECC, TCP Sockets, Cryptography",
                  date: "June 2026",
                  url: "https://github.com/Arghyann/Blockchain",
                  description:
                    "Implemented secp256k1 elliptic curve cryptography from scratch for key generation and ECDSA digital signatures. Built a P2P network using raw TCP sockets with proof-of-work mining and longest chain rule conflict resolution.",
                },
              ].map((project, index) => (
                <article
                  key={index}
                  className="group p-6 sm:p-8 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-500 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground font-mono">
                      <span>{project.date}</span>
                      <span>{project.tech}</span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl sm:text-2xl font-medium group-hover:text-muted-foreground transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.url && (
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-muted-foreground hover:text-foreground underline underline-offset-4 shrink-0 transition-colors"
                        >
                          GitHub ↗
                        </Link>
                      )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>

                    {project.prompt && project.response && (
                      <div className="mt-4 p-4 bg-zinc-950 border border-border/60 rounded-lg font-mono text-xs sm:text-sm space-y-2">
                        <div className="text-muted-foreground">
                          <span className="text-foreground font-medium">Prompt:</span> &quot;{project.prompt}&quot;
                        </div>
                        <div className="text-foreground">
                          <span className="text-muted-foreground font-medium">Response:</span> &quot;{project.response}&quot;
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="connect" ref={(el) => { sectionsRef.current[4] = el }} className="py-20 sm:py-32 opacity-0">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Always interested in new opportunities, distributed systems, cloud infrastructure, and software engineering.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:aryan.dev.careers@gmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-base sm:text-lg">aryan.dev.careers@gmail.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "GitHub", handle: "@Arghyann", url: "https://github.com/Arghyann" },
                  { name: "LinkedIn", handle: "in/aryan-mane-00a6082b5", url: "https://www.linkedin.com/in/aryan-mane-00a6082b5/" },
                  { name: "Education", handle: "B.E. AI & Data Science (VESIT)", url: "#" },
                  { name: "Location", handle: "Mumbai, India", url: "#" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate" title={social.handle}>
                        {social.handle}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 sm:py-16 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">© 2026 Aryan Mane. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
