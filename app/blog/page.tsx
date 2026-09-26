import Link from "next/link"
import { ArrowUpRight, ChevronLeft } from "lucide-react"
import { getAllPosts } from "../../lib/blog"

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-border/70 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="size-4" aria-hidden="true" /> Back to portfolio
          </Link>
          <span className="font-mono text-xs tracking-widest text-muted-foreground">WRITING / 2026</span>
        </header>

        <section className="py-20 sm:py-28">
          <p className="mb-5 font-mono text-xs tracking-[0.25em] text-muted-foreground">NOTES FROM THE TERMINAL</p>
          <h1 className="max-w-2xl text-5xl font-light tracking-tight sm:text-7xl">Things I&apos;m learning.</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Technical notes on systems, cryptography, and the rabbit holes that make building software interesting.</p>
        </section>

        <section aria-labelledby="latest-posts" className="border-t border-border/70">
          <h2 id="latest-posts" className="sr-only">Latest posts</h2>
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group grid gap-5 border-b border-border/70 py-8 transition-colors hover:border-foreground/50 sm:grid-cols-[120px_1fr_auto] sm:items-start sm:gap-8">
              <div className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")} / {post.date}</div>
              <div>
                <h3 className="text-2xl font-light transition-transform group-hover:translate-x-1 sm:text-3xl">{post.title}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{post.description}</p>
                <p className="mt-5 font-mono text-xs text-muted-foreground">{post.readingTime}</p>
              </div>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
