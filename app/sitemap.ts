import type { MetadataRoute } from "next";
import { schools } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const programPages: MetadataRoute.Sitemap = Object.values(schools).flatMap((school) =>
    Object.keys(school.programs).map((prog) => ({
      url: `https://loancliff.com/cliff/${school.id}/${prog}`,
      lastModified: new Date("2026-04-29"),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }))
  );

  const learnPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `https://loancliff.com/learn/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const states = [...new Set(Object.values(schools).map((s) => s.state).filter(Boolean))];
  const statePages: MetadataRoute.Sitemap = states.map((state) => ({
    url: `https://loancliff.com/cliff/state/${state.toLowerCase()}`,
    lastModified: new Date("2026-05-07"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: "https://loancliff.com",
      lastModified: new Date("2026-05-04"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://loancliff.com/cliff",
      lastModified: new Date("2026-05-07"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://loancliff.com/learn",
      lastModified: new Date("2026-05-04"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://loancliff.com/methodology",
      lastModified: new Date("2026-04-29"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...learnPages,
    ...statePages,
    ...programPages,
  ];
}
