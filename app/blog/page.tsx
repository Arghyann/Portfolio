import Link from "next/link"
import { getAllPosts, formatPostDate } from "@/lib/blog"
import { TopNav } from "@/components/top-nav"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Writing — Aryan Mane",
  description: "Notes, writeups, and thoughts on distributed systems, AI fine-tuning, and software engineering.",
}

export const revalidate = 60

export default async function BlogIndexPage() {
  const posts = await getAllPosts()

  return (
    <div className="mx-auto max-w-[820px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      {/* Top Bar */}
      <TopNav />

      {/* Top Header */}
      <header className="mb-14 sm:mb-20 flex items-start justify-between">
        <div className="flex flex-col">
          <Link
            href="/"
            className="font-medium text-base sm:text-[17px] text-foreground hover:text-accent transition-colors no-underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Aryan Mane</span>
          </Link>
          <span className="text-muted text-sm sm:text-[15px] font-normal mt-0.5">
            Full Stack Developer
          </span>
        </div>
      </header>

      <main className="space-y-12">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
            Writing
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 leading-[1.6]">
            Notes, writeups, and experiences building distributed systems, training LLMs, and systems engineering.
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5 pt-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="-mx-3 flex flex-col rounded-lg px-3 py-3 transition-colors hover:bg-surface-hover group no-underline"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </span>
                <span className="text-xs text-muted/70 font-mono group-hover:text-foreground transition-colors">
                  {formatPostDate(post.published_at)}
                </span>
              </div>
              <span className="text-muted text-sm mt-0.5 leading-[1.6]">
                {post.description}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
