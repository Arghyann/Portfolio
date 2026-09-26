import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { getAllPosts, getPost } from "../../../lib/blog"
import "katex/dist/katex.min.css"

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10 lg:px-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border/70 pb-12">
          <Link href="/blog" className="mb-16 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ChevronLeft className="size-4" aria-hidden="true" /> All writing
          </Link>
          <div className="font-mono text-xs tracking-widest text-muted-foreground">{post.date} · {post.readingTime}</div>
          <h1 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{post.description}</p>
        </header>
        <div className="prose prose-invert prose-lg max-w-none py-12 prose-headings:font-light prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:border prose-pre:border-border prose-pre:bg-muted/40 prose-blockquote:border-muted-foreground/40 prose-blockquote:text-muted-foreground">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
