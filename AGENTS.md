# AGENTS.md

Conventions for any AI coding agent (Claude Code, Codex, Cursor, Aider, etc.) working on this project. Read this file first every session.

## Project in one paragraph

Loan Cliff is a Next.js (App Router) web tool that calculates a graduate or professional student's personal funding gap created by the July 1, 2026 elimination of Grad PLUS loans. Users enter three inputs and see a personalized number, with next-step affiliate links to private student-loan refinancers. Programmatic SEO is a primary distribution channel: one URL per accredited US grad/professional program (~6,000 pages) generated at build time from public IPEDS data. Email capture funnels users into a 7-email automated nurture sequence via Brevo. No user accounts, no DB writes from users, fully automated. Monetization: refi affiliate links ($150–$400 CPA), display ads (after Mediavine threshold), $19 PDF upsell.

## Stack (locked)

- **Framework:** Next.js 15 (App Router, RSC, Server Actions)
- **Language:** TypeScript, strict mode
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Data:** static JSON committed to repo (`data/schools.json` from IPEDS). No runtime database.
- **Email:** Brevo (transactional + automation in one). API key in env.
- **Payments:** Stripe Checkout (payment links for the $19 PDF upsell, no custom checkout UI).
- **PDF generation:** `@react-pdf/renderer` server-side, on demand.
- **OG images:** `next/og` (Satori) for share cards.
- **Analytics:** Plausible (privacy-friendly, no consent banner needed).
- **Hosting:** Vercel.
- **Domain:** loancliff.com.

Do not introduce additional libraries without explicit approval. Do not swap any of the above without explicit approval.

## Repo layout (target)

```
app/
  page.tsx                        # landing + calculator
  cliff/[school]/[program]/       # programmatic SEO route, ~6,000 pages
    page.tsx
  api/
    email-report/route.ts         # POST: send PDF via Brevo
    stripe-webhook/route.ts       # Stripe → Brevo subscriber move
  sitemap.ts                      # programmatic sitemap
  robots.ts
content/
  articles/                       # 8 long-form MDX SEO articles
data/
  schools.json                    # IPEDS-derived COA dataset
  caps.json                       # statutory cap reference data
lib/
  calc.ts                         # core gap calculation (the moat)
  share-card.tsx                  # Satori OG image component
  brevo.ts                        # Brevo client + helpers
  pdf.tsx                         # react-pdf report component
  schema.ts                       # Schema.org JSON-LD generators
components/
  Calculator.tsx
  GapNumber.tsx                   # the giant red number
  EmailCapture.tsx
  Results.tsx
public/
  og-default.png
```

## Commands

Once scaffolded:

```bash
npm install
npm run dev              # local dev on :3000
npm run build            # production build (will generate ~6k static pages)
npm run typecheck        # tsc --noEmit
npm run lint             # next lint
```

Use `npm` (not pnpm/yarn/bun) unless explicitly told otherwise.

## Environment variables

All secrets live in `.env.local` (gitignored). Required:

```
BREVO_API_KEY=
BREVO_LIST_ID=                    # main subscriber list
BREVO_TEMPLATE_REPORT=            # transactional template ID for gap-report email
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PAYMENT_LINK_PDF=          # the $19 PDF upsell payment link URL
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=loancliff.com
NEXT_PUBLIC_SITE_URL=https://loancliff.com
```

Never commit secrets. Never log them. Never hard-code them.

## Coding conventions

- Server components by default. Add `"use client"` only when interactivity demands it (form state, animations).
- Server Actions over API routes for form posts where possible.
- No `any`. Use `unknown` + narrowing, or define the type.
- No comments explaining what code does. Only comments explaining non-obvious why (a regulatory citation, an IPEDS quirk, etc.).
- File names: `kebab-case.ts` for utilities, `PascalCase.tsx` for components.
- Imports: absolute paths via `@/` alias.
- Tailwind: prefer composition over `@apply`. Use `cn()` from `lib/utils.ts` for conditional classes.
- Errors: throw at boundaries, catch at the route handler / server action and return typed result objects to the client.

## The calculation (the moat — get this right)

`lib/calc.ts` exports `computeGap(input: CalcInput): CalcResult`. It must:

1. Look up the school's published Cost of Attendance for the program from `data/schools.json`.
2. Subtract the new statutory federal aid cap for that program type and year (`data/caps.json`).
3. Multiply the annual gap by the program's standard length (3 yrs MBA, 4 yrs MD, 3 yrs JD, etc.).
4. Return the per-year gap, total gap, monthly equivalent, and a citation reference (school + IPEDS year + statute).

If a school is missing from the dataset, return a typed `MissingSchoolResult` and surface a "request your school" form. Never fabricate a number.

Every change to `lib/calc.ts` requires a unit test. The numbers go on share cards; an off-by-10% error becomes a viral correction post.

## Distribution model

The product is the calculator. The growth engine is:

1. **Programmatic SEO** — 6,000 static pages (`/cliff/[school]/[program]`) with Schema.org markup, each surfacing a unique computed gap number. AI search engines (ChatGPT, Perplexity) cite us because the data is computed, not crawlable.
2. **Faceless TikTok** — screen-recordings of the calculator with AI voiceover. The shock number is the content.
3. **Reddit** — high-quality, free-tool posts in r/premed, r/medicalschool, r/lawschooladmissions, r/whitecoatinvestor, r/MBA, r/PhD. One sub per day on rotation. The community shares.
4. **Newsletter pitches** — Morning Brew, Money With Katie, The Hustle's tools section.

When making product decisions, optimize for the share moment (the screenshot of the gap number) and for the SEO page corpus (uniqueness of computed data per page).

## Email funnel (Brevo)

Capture is one optional field on the results page: *"Email me this gap report as a PDF + alert me if refi rates drop below 6%."* Single field. No password, no account.

On submit:
1. Generate the PDF report with `lib/pdf.tsx`.
2. Send via Brevo transactional API with the report attached.
3. Add the contact to the main list with attributes: `school`, `program`, `start_year`, `gap_total`.
4. Brevo automation workflow (configured in their dashboard, not code) fires the 7-email sequence over 30 days.

Affiliate links in emails use UTMs: `?utm_source=brevo&utm_medium=email&utm_campaign=cliff-seq&utm_content=email-N`.

## Affiliate links

Stored in `lib/affiliates.ts` as a typed map. Every link includes UTMs. Never hard-code a single lender across multiple files — always import from this map so we can swap one if a program's CPA changes or it gets paused.

## Schema.org (AEO defense)

Every programmatic page emits JSON-LD with at minimum:
- `EducationalOccupationalProgram` (program metadata)
- `MonetaryAmount` (the gap number)
- `BreadcrumbList`
- `FAQPage` (for the "what is the Grad PLUS cliff" Q&A block)

Helper in `lib/schema.ts`. Validate output against schema.org/validator before merging changes that touch it.

## What NOT to do

- Do not add user accounts, login, or authentication. Anonymous use is a feature, not a limitation.
- Do not add a database for user data. Brevo is the source of truth for emails. Stripe is the source of truth for purchases.
- Do not add features that require human servicing (live chat, support tickets, manual review).
- Do not add a generic blog CMS. Articles live in `content/articles/*.mdx` and are committed.
- Do not refactor the calculation logic without writing a unit test first.
- Do not change the stack (see "Stack (locked)" above).
- Do not commit `.env.local`, `node_modules/`, `.next/`, or `data/schools-raw-ipeds.csv` (the unprocessed source).

## When uncertain

If a decision touches: the calculation logic, the affiliate link structure, the email sequence content, or any change that would affect the gap number a user sees — stop and ask. Everything else, decide and proceed.

## Verification before claiming done

Before saying any task is complete:
1. `bun run typecheck` passes with zero errors.
2. `bun run build` completes (this catches programmatic-page generation issues).
3. If you touched `lib/calc.ts`: unit tests pass.
4. If you touched a programmatic route: spot-check 3 generated pages locally and confirm the gap number matches a manual calculation.

## Plan reference

The 30-day execution plan is in [PLAN.md](./PLAN.md). Read it once per session to keep priorities aligned.
