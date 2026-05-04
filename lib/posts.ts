import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/learn");

export interface FAQ {
  q: string;
  a: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  order: number;
  faqs: FAQ[];
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostMeta(slug))
    .sort((a, b) => a.order - b.order);
}

export function getPostMeta(slug: string): PostMeta {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: (data.category as string) ?? "general",
    readTime: (data.readTime as string) ?? "6 min read",
    order: (data.order as number) ?? 99,
    faqs: (data.faqs as FAQ[]) ?? [],
  };
}

export function getPost(slug: string): Post {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    category: (data.category as string) ?? "general",
    readTime: (data.readTime as string) ?? "6 min read",
    order: (data.order as number) ?? 99,
    faqs: (data.faqs as FAQ[]) ?? [],
    content,
  };
}
