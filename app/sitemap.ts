import type { MetadataRoute } from "next";
import { schools } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const programPages: MetadataRoute.Sitemap = Object.values(schools).flatMap((school) =>
    Object.keys(school.programs).map((prog) => ({
      url: `https://loancliff.com/cliff/${school.id}/${prog}`,
      lastModified: new Date("2026-04-29"),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }))
  );

  return [
    {
      url: "https://loancliff.com",
      lastModified: new Date("2026-04-29"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...programPages,
  ];
}
