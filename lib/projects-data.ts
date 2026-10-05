export interface ProjectData {
  title: string
  subtitle: string
  period: string
  githubUrl: string
  liveUrl?: string
  description?: string
  highlights?: string[]
  tech?: string[]
}

export const projects: ProjectData[] = [
  {
    title: "Personalized LLM Fine-Tuning Pipeline",
    subtitle: "Trained Llama 8B and Qwen 14B on a bunch of personal conversations and made a chat app with it. If you're one of the lucky few with invite codes, you could check it out here!",
    period: "2026",
    liveUrl: "https://chat.aryanmane.xyz",
    githubUrl: "https://github.com/Arghyann/inference",
  },
  {
    title: "Distributed Blockchain",
    subtitle: "Built a blockchain for browsers that can talk over webRTC with a matchmaker Go server. You can mine some coin that hold no value right now!", 
    period: "2026",
    liveUrl: "https://crypto.aryanmane.xyz",
    githubUrl: "https://github.com/Arghyann/Blockchain",
  },
  {
    title: "Loan Approval Microservices Platform",
    subtitle: "Event-driven system in Go on Amazon EKS with RabbitMQ and PostgreSQL sustaining 1M+ req/sec.",
    period: "2026",
    githubUrl: "https://github.com/Arghyann/Loan-approval-microservice",
  },
  {
    title: "NimbusCache",
    subtitle: "Redis-inspired concurrent in-memory cache in Java 17 with LRU eviction and zero deadlocks.",
    period: "2026",
    githubUrl: "https://github.com/Arghyann/SpringBoot-Cache-Service",
  },
]

export const featuredProjects: ProjectData[] = [
  projects[0], // chat.aryanmane.xyz
  projects[1], // crypto.aryanmane.xyz
]
