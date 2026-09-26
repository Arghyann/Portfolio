import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/blog"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} - Aryan Mane`,
    description: post.description || post.title,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = formatPostDate(post.published_at)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="blog-article max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Nav */}
        <nav className="pt-12 pb-16">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="pb-12 border-b border-border/50">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground/70 uppercase tracking-wider">
              <span>{formattedDate}</span>
              <span className="w-1 h-[1px] bg-border" />
              <span>{post.read_time}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight text-theme-fg-bright">
              {post.title}
            </h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full border border-theme-accent/30 text-theme-accent font-mono text-[11px] uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.description && (
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed pt-2">
                {post.description}
              </p>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="py-12">
          <MarkdownRenderer content={post.body} />
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  )
}
