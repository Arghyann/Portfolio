export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground animate-pulse">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-12 pb-16">
          <div className="h-4 w-16 bg-muted rounded" />
        </div>

        <div className="pb-12 border-b border-border/50 space-y-4">
          <div className="h-3 w-48 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-5 w-full bg-muted/60 rounded" />
        </div>

        <div className="py-12 space-y-4">
          <div className="h-4 w-full bg-muted/40 rounded" />
          <div className="h-4 w-5/6 bg-muted/40 rounded" />
          <div className="h-4 w-4/6 bg-muted/40 rounded" />
          <div className="h-28 w-full bg-muted/20 rounded my-8" />
          <div className="h-4 w-full bg-muted/40 rounded" />
          <div className="h-4 w-3/4 bg-muted/40 rounded" />
        </div>
      </div>
    </div>
  )
}
