export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  published_at?: string
  read_time: string
}

export interface BlogPost extends BlogPostSummary {
  body: string
}

const API_BASE_URL =
  process.env.BLOG_API_URL || "https://aryanssh.duckdns.org/blog-api"

export function formatPostDate(raw?: string): string {
  if (!raw || raw.startsWith("0001")) {
    return "June 2026"
  }
  try {
    const cleanStr =
      raw.includes(" ") && !raw.includes("T") ? raw.replace(" ", "T") + "Z" : raw
    const d = new Date(cleanStr)
    if (isNaN(d.getTime()) || d.getFullYear() <= 1) {
      return "June 2026"
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return "June 2026"
  }
}

function parseTags(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean)
  }
  if (typeof raw === "string") {
    const trimmed = raw.trim()
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed.map((t) => String(t).trim()).filter(Boolean)
        }
      } catch {
        // Fallback to comma split if JSON parse fails
      }
    }
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  }
  return []
}

function calculateReadTime(text?: string): string {
  if (!text) return "3 min read"
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} min read`
}

function normalizeSummary(data: any, fallbackSlug?: string): BlogPostSummary {
  const title = data.title || data.Title || "Untitled"
  const slug = data.slug || data.Slug || fallbackSlug || ""
  const description = data.description || data.Description || ""
  const id = data.id || data.ID || slug
  const tags = parseTags(data.tags || data.Tags)
  const published_at = data.published_at || data.PublishedAt || undefined
  const body = data.body || data.Body || ""

  return {
    id: String(id),
    slug: String(slug),
    title: String(title),
    description: String(description),
    tags,
    published_at: published_at ? String(published_at) : undefined,
    read_time: calculateReadTime(body || description),
  }
}

function normalizePost(data: any, fallbackSlug?: string): BlogPost {
  const summary = normalizeSummary(data, fallbackSlug)
  const body = data.body || data.Body || ""
  return {
    ...summary,
    body: String(body),
    read_time: calculateReadTime(String(body)),
  }
}

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      next: { revalidate: 30 },
    })

    if (!res.ok) {
      console.warn(`[blog-api] Failed to fetch posts: ${res.status} ${res.statusText}`)
      return []
    }

    const data = await res.json()
    if (!Array.isArray(data)) {
      return []
    }

    return data.map((item) => normalizeSummary(item))
  } catch (err) {
    console.warn(`[blog-api] Error connecting to ${API_BASE_URL}/posts:`, err)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}`, {
      next: { revalidate: 30 },
    })

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      console.warn(`[blog-api] Failed to fetch post ${slug}: ${res.status} ${res.statusText}`)
      return null
    }

    const data = await res.json()
    if (!data) return null

    return normalizePost(data, slug)
  } catch (err) {
    console.warn(`[blog-api] Error connecting to ${API_BASE_URL}/posts/${slug}:`, err)
    return null
  }
}
