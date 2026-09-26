import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getAllPosts, formatPostDate } from "@/lib/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Aryan Mane",
  description: "Things I've learned, built, and found interesting enough to write about.",
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="pt-12 pb-16 sm:pb-24">
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <div className="text-sm text-muted-foreground font-mono tracking-wider">
              BLOG
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
              Writing
            </h1>
            <p className="text-muted-foreground text-lg font-light max-w-md leading-relaxed">
              Things I&apos;ve learned, built, and found interesting enough to write about.
            </p>
          </div>
        </header>

        {/* Posts */}
        <section className="pb-24">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono mb-8 pb-3 border-b border-border">
            All Posts ({posts.length})
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-mono text-sm border border-dashed border-border/60 rounded-lg">
              No posts found. Publish your first post via the blog API!
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => {
                const formattedDate = formatPostDate(post.published_at)

                return (
                  <Link
                    key={post.id || post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-8 py-6 border-b border-border/50 hover:border-theme-accent/30 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <h2 className="text-xl font-light text-foreground group-hover:text-theme-fg-bright transition-colors duration-300">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-lg">
                          {post.description}
                        </p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full border border-theme-accent/30 text-theme-accent font-mono text-[10px] uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground/60 font-mono">
                        {formattedDate}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-border group-hover:text-theme-accent transition-colors duration-300" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
