import Link from "next/link"

export function TopNav() {
  return (
    <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-[13px] font-mono text-muted mb-12 sm:mb-16 select-none">
      <Link
        href="/"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[h]</span>
        <span>home</span>
      </Link>
      <Link
        href="/blog"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[b]</span>
        <span>blog</span>
      </Link>
      <Link
        href="/#work"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[w]</span>
        <span>work</span>
      </Link>
      <Link
        href="/#projects"
        className="hover:text-foreground transition-colors group flex items-center gap-1.5 no-underline"
      >
        <span className="text-muted/60 group-hover:text-accent transition-colors">[p]</span>
        <span>projects</span>
      </Link>
    </nav>
  )
}
