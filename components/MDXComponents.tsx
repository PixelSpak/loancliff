import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#eef2ff] border-l-4 border-[#001229] rounded-r-lg p-5 my-6 text-[#1b1c1e]">
      {children}
    </div>
  );
}

export function KeyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 py-2 border-b border-[#e2e8f0] last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d] sm:w-48 shrink-0">
        {label}
      </span>
      <span className="font-semibold text-[#001229]">{value}</span>
    </div>
  );
}

export function FactBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#e2e8f0] rounded-xl p-5 my-6 bg-white shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44474d] mb-3">
        Key Facts
      </p>
      {children}
    </div>
  );
}

export function AffiliateCTA({
  name,
  href,
  description,
  cta,
}: {
  name: string;
  href: string;
  description: string;
  cta: string;
}) {
  return (
    <div className="border border-[#e2e8f0] rounded-xl p-4 my-3 flex items-center justify-between gap-4 bg-white">
      <div>
        <p className="font-semibold text-[#001229] text-sm">{name}</p>
        <p className="text-[#44474d] text-xs mt-0.5">{description}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="aff-cta shrink-0 min-w-[130px] text-center bg-[#001229] !text-white no-underline text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#0f2744] transition-colors whitespace-nowrap"
      >
        {cta}
      </a>
    </div>
  );
}

export const mdxComponents = {
  Callout,
  KeyFact,
  FactBox,
  AffiliateCTA,
  a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  table: ({ children, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d] border-b border-[#e2e8f0] px-3 py-2 bg-[#f8fafc]"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-b border-[#e2e8f0] px-3 py-2.5 text-[#1b1c1e]" {...props}>
      {children}
    </td>
  ),
};
