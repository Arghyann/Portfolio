import Link from "next/link"
import { ProjectItem, type ProjectData } from "@/components/project-drawer"
import { CopyEmail } from "@/components/copy-email"
import { TopNav } from "@/components/top-nav"
import { ArrowUpRight } from "lucide-react"

const projects: ProjectData[] = [
  {
    title: "Loan Approval Microservices Platform",
    subtitle: "Event-driven system in Go on Amazon EKS with RabbitMQ and PostgreSQL sustaining 1M+ req/sec.",
    period: "2026",
    githubUrl: "https://github.com/Arghyann/Loan-approval-microservice",
    description: "Designed a high-throughput, event-driven loan approval backend in Go partitioned into IAM, Loan Evaluation, and Notification microservices running on Amazon EKS. Architected private VPC subnets, RSA-signed JWT verification, and resilient message queuing with RabbitMQ.",
    highlights: [
      "Decoupled microservice architecture orchestrating async message dispatch through RabbitMQ.",
      "Strict network isolation with AWS VPC private subnets for RDS PostgreSQL and worker nodes.",
      "Benchmarked with k6 and Vegeta to sustain over 1,000,000 requests/sec under load.",
      "Centralized IAM authentication using RSA public/private key-signed JWT tokens.",
    ],
    tech: ["Go", "Kubernetes (EKS)", "RabbitMQ", "PostgreSQL", "AWS VPC", "Docker"],
  },
  {
    title: "Personalized LLM Fine-Tuning Pipeline",
    subtitle: "Serverless fine-tuning pipeline on Modal Cloud adapting Llama 3.1 8B for personal conversational style.",
    period: "2026",
    articleUrl: "/blog/fine-tuning",
    interactiveDemo: "llm",
    description: "Built an end-to-end serverless fine-tuning pipeline to adapt Meta Llama 3.1 8B Instruct for hyper-personalized conversational nuance and Hinglish humor. Built sanitization harvesters across 10,000+ Signal and Instagram message logs, formatting them into dynamic 12-turn dialogue windows.",
    highlights: [
      "Extracted, sanitized, and tokenized 10,000+ multi-platform messages into sliding multi-turn windows.",
      "Trained a 4-bit QLoRA adapter using Unsloth and Hugging Face SFTTrainer on serverless NVIDIA A100 GPUs via Modal Cloud.",
      "Eliminated hallucination and turn-speaking collisions by enforcing strict prompt template boundary markers.",
      "Implemented a serverless inference endpoint with cold-start optimization under 2 seconds.",
    ],
    tech: ["Llama 3.1 8B", "Unsloth", "QLoRA", "Modal Cloud", "Python", "Hugging Face"],
  },
  {
    title: "NimbusCache",
    subtitle: "Redis-inspired concurrent in-memory cache in Java 17 with LRU eviction and zero deadlocks.",
    period: "2026",
    githubUrl: "https://github.com/Arghyann/SpringBoot-Cache-Service",
    description: "Engineered a thread-safe, high-performance in-memory cache in Java 17 from scratch. Leveraged ConcurrentHashMap alongside fine-grained ReentrantLocks for striping to minimize lock contention under heavy write loads.",
    highlights: [
      "O(1) LRU eviction algorithm combined with segmented lock striping for high concurrency.",
      "Lazy TTL expiration paired with a background daemon thread for proactive cleanup of stale entries.",
      "JSON snapshot persistence to disk with atomic write-and-rename guarantees.",
      "Stress-tested with 200 concurrent writer threads with zero deadlocks or race conditions.",
    ],
    tech: ["Java 17", "Spring Boot", "Concurrency", "ReentrantLock", "Maven"],
  },
  {
    title: "Distributed Blockchain",
    subtitle: "P2P blockchain in Java 17 with secp256k1 elliptic curve cryptography and TCP socket mining.",
    period: "2026",
    githubUrl: "https://github.com/Arghyann/Blockchain",
    articleUrl: "/blog/blockchain",
    description: "Implemented a decentralized cryptocurrency blockchain from scratch in Java 17. Handcrafted secp256k1 elliptic curve point arithmetic for key generation and ECDSA signatures without relying on high-level cryptography packages.",
    highlights: [
      "Custom point doubling and point addition algorithms on the secp256k1 curve for ECDSA signatures.",
      "P2P networking layer built using raw TCP sockets running across isolated Docker containers.",
      "Proof-of-work mining with dynamic difficulty targeting and longest-chain rule consensus resolution.",
      "Comprehensive test suite simulating double-spend attacks and network partition scenarios.",
    ],
    tech: ["Java 17", "secp256k1 ECC", "TCP Sockets", "Docker", "Cryptography"],
  },
]

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
        {/* Today / About */}
        <section id="today">
          <h2 className="mb-4 block font-medium text-foreground text-xl sm:text-2xl tracking-tight">
            Today
          </h2>
          <div className="space-y-4 text-muted text-sm sm:text-[15px] leading-[1.6]">
            <p>
              I work on distributed systems, backend infrastructure, and cloud-native services across{" "}
              <span className="text-foreground font-medium">Go</span>,{" "}
              <span className="text-foreground font-medium">Kubernetes</span>, and{" "}
              <span className="text-foreground font-medium">AWS</span>. I care about high-throughput pipelines, deterministic state, and low-latency architectures.
            </p>
            <p>
              Currently engineering backend services and scalable ad analysis worker pools at{" "}
              <span className="text-foreground font-medium">Valnee Solutions</span> in Mumbai. Previously studied Artificial Intelligence &amp; Data Science at VESIT.
            </p>
            <p>
              I like building things from first principles—from handcrafting elliptic curve cryptography and P2P consensus for a toy blockchain to building concurrent LRU cache engines and fine-tuning LLMs on personal conversational datasets.
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
            <span className="text-xs sm:text-[13px] text-muted/70 font-mono">
              Click for architecture &amp; details
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            {projects.map((project) => (
              <ProjectItem key={project.title} project={project} />
            ))}
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
