import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/blog")

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  content: string
}

export function getAllPosts(): BlogPost[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      const source = fs.readFileSync(path.join(postsDirectory, file), "utf8")
      const { data, content } = matter(source)
      return { slug, content, ...data } as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string) {
  return getAllPosts().find((post) => post.slug === slug)
}
