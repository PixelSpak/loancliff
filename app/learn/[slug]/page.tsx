export const dynamic = "force-static";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPostSlugs, getPost } from "@/lib/posts";
import { mdxComponents } from "@/components/MDXComponents";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) return {};

  const post = getPost(slug);
  const url = `https://loancliff.com/learn/${slug}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
    alternates: { canonical: url },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  policy: "Policy",
  funding: "Funding",
  "program-type": "By Program",
  comparison: "Comparison",
  general: "Guide",
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) notFound();

  const post = getPost(slug);

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Loan Cliff",
      url: "https://loancliff.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Loan Cliff",
      url: "https://loancliff.com",
      logo: {
        "@type": "ImageObject",
        url: "https://loancliff.com/og-default.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://loancliff.com/learn/${slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://loancliff.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://loancliff.com/learn" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://loancliff.com/learn/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-24 pb-20 px-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-[#9ca3af] mb-8">
            <Link href="/" className="hover:text-[#1b1c1e] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-[#1b1c1e] transition-colors">
              Learn
            </Link>
            <span>/</span>
            <span className="text-[#44474d] truncate">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#44474d] bg-[#f0f4ff] px-2 py-0.5 rounded">
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
              <span className="text-[11px] text-[#9ca3af]">{post.readTime}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#001229] leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-[#44474d] text-base leading-relaxed mb-4">{post.description}</p>
            <time dateTime={post.date} className="text-[11px] text-[#9ca3af] font-medium">
              {formatDate(post.date)}
            </time>
          </header>

          {/* Article body */}
          <article className="prose-article">{content}</article>

          {/* Footer CTA */}
          <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44474d] mb-2">
              Calculate Your Gap
            </p>
            <p className="text-[#1b1c1e] font-semibold mb-4">
              See your exact funding gap in three inputs.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#001229] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0f2744] transition-colors"
            >
              Use the Calculator &rarr;
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
