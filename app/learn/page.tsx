export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Learn — Grad School Funding Guides for 2026",
  description:
    "Guides and analysis on the 2026 Grad PLUS loan elimination, funding gaps by program, and how to pay for graduate and professional school.",
  openGraph: {
    title: "Learn — Grad School Funding Guides for 2026",
    description:
      "Guides and analysis on the 2026 Grad PLUS loan elimination, funding gaps by program, and how to pay for graduate and professional school.",
    url: "https://loancliff.com/learn",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  policy: "Policy",
  funding: "Funding",
  "program-type": "By Program",
  comparison: "Comparison",
  general: "Guide",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function LearnPage() {
  const posts = getAllPosts();

  return (
    <main className="pt-24 pb-20 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#44474d] mb-3">
            Learn
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#001229] leading-tight mb-4">
            Grad School Funding Guides
          </h1>
          <p className="text-[#44474d] text-base leading-relaxed max-w-xl">
            Guides, data, and analysis on the July 2026 Grad PLUS elimination and what it means
            for medical, law, MBA, and other graduate students.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-[#44474d]">No articles yet.</p>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {posts.map((post) => (
              <article key={post.slug} className="py-8 group">
                <Link href={`/learn/${post.slug}`} className="block">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#44474d] bg-[#f0f4ff] px-2 py-0.5 rounded">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span className="text-[11px] text-[#9ca3af]">{post.readTime}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#001229] group-hover:text-[#0f2744] transition-colors leading-snug mb-2">
                    {post.title}
                  </h2>
                  <p className="text-[#44474d] text-sm leading-relaxed mb-3 max-w-2xl">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <time
                      dateTime={post.date}
                      className="text-[11px] text-[#9ca3af] font-medium"
                    >
                      {formatDate(post.date)}
                    </time>
                    <span className="text-[11px] font-semibold text-[#001229] group-hover:underline">
                      Read article &rarr;
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
