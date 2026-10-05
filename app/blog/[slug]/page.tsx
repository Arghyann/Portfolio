import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/blog"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TopNav } from "@/components/top-nav"
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
      title: "Post Not Found - Aryan Mane",
    }
  }

  return {
    title: `${post.title} — Aryan Mane`,
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
    <div className="mx-auto max-w-[820px] px-6 py-12 sm:py-20 md:py-24 text-foreground antialiased selection:bg-accent selection:text-background">
      {/* Top Bar */}
      <TopNav />

      {/* Top Header */}
      <header className="mb-12 sm:mb-16 flex items-start justify-between">
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

      {/* Article */}
      <article className="space-y-10 leading-[1.85]">
        <div className="space-y-4 pb-8 border-b border-border">
          <div className="flex items-center gap-3 text-xs font-mono text-muted/70">
            <span>{formattedDate}</span>
            <span>&middot;</span>
            <span>{post.read_time}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-muted text-sm sm:text-base leading-[1.6]">
              {post.description}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-surface text-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <MarkdownRenderer content={post.body} />
        </div>

        {/* Back Link */}
        <div className="pt-12 mt-12 border-t border-border flex items-center text-xs text-muted/70 font-mono">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All posts</span>
          </Link>
        </div>
      </article>
    </div>
  )
}
