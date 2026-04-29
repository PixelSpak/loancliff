# Loan Cliff — 30-Day Execution Plan

## Context

The reconciliation bill eliminates Grad PLUS loans on July 1, 2026 and imposes new statutory caps ($20,500/yr / $100k aggregate for grad, $50k/yr / $200k aggregate for professional). Med, law, dental, MBA, PhD, and other professional-program students face five- to six-figure annual funding gaps with no federal solution. Search demand is rising and will peak May–August 2026. As of late April 2026 ([CNBC, Apr 22 2026](https://www.cnbc.com/2026/04/22/student-loan-cap-grad-plus-rules.html)), financial aid groups are publicly stating that implementation rules remain unclear.

The white space: explainer articles exist (Saving for College, Fastweb, Earnest, school financial aid pages) but no one has shipped the focused interactive personal-gap calculator with the new caps surfaced as the headline number. studentaid.gov has a generic federal loan simulator that does not surface the gap. The slot is empty.

The intended outcome: a fully automated web tool that ranks for and gets cited on grad-school cost queries, captures emails for a Brevo-driven nurture sequence, and converts at meaningful rates against student-loan refi affiliate programs ($150–$400 CPA per funded loan). Target: positive unit economics within 30 days, scalable beyond.

## Build phases

### Phase 1 — Calculator MVP (days 1–3)
- Next.js 15 app scaffold, Tailwind v4, shadcn/ui, TypeScript strict.
- `app/page.tsx`: landing + 3-input form (program type, school select, start year).
- `lib/calc.ts`: pure function, well-tested, returns per-year gap, total gap, monthly equivalent, citation.
- `lib/share-card.tsx`: Satori OG image with the giant red number. The artifact IS the marketing.
- `data/schools.json`: ~6,000 programs from IPEDS public data. One-time scrape/import script in `scripts/import-ipeds.ts`.
- `data/caps.json`: statutory caps as a typed JSON reference (grad vs professional, annual vs aggregate, by year).
- Deploy to Vercel on day 3 with the domain `loancliff.com` connected.

### Phase 2 — Programmatic SEO (days 4–7)
- `app/cliff/[school]/[program]/page.tsx`: dynamic route, `force-static`, `generateStaticParams` produces all ~6,000 paths from the dataset at build time.
- `lib/schema.ts`: `EducationalOccupationalProgram`, `MonetaryAmount`, `BreadcrumbList`, `FAQPage` JSON-LD per page.
- `app/sitemap.ts`: programmatic sitemap (split if > 50k URLs, but we're under).
- `app/robots.ts`: allow all, point to sitemap.
- Submit sitemap to Google Search Console + Bing Webmaster Tools.
- Validate 10 random sampled pages against schema.org validator.

### Phase 3 — Email funnel (days 8–10)
- Brevo account, list created, transactional template for the gap-report email created in their UI.
- `lib/brevo.ts`: typed client wrapper.
- `app/api/email-report/route.ts`: POST handler. Generates PDF via `lib/pdf.tsx`, sends via Brevo transactional API, adds contact to list with attributes (`school`, `program`, `start_year`, `gap_total`).
- `components/EmailCapture.tsx`: single field on results page, framed *"Email me this gap report as a PDF + alert me if refi rates drop below 6%."*
- Brevo automation workflow (configured in dashboard, not code): 7-email sequence over 30 days. Welcome → cliff explainer → refi side-by-side → school-specific scholarships → income-share alternatives → defer-a-year analysis → 30-day check-in.
- Every email body includes affiliate links with UTMs.

### Phase 4 — Monetization plumbing (days 8–10, parallel with Phase 3)
- `lib/affiliates.ts`: typed map of all approved affiliate links with UTM parameters.
- Apply to affiliate programs in this priority order:
  1. **Credible** — public form at credible.com/partners — $240/funded loan
  2. **ELFI** — public form — ~$400/funded refi
  3. **LendKey** — public form — ~$100–200/funded loan
  4. **SoFi** via Impact or CJ network — $150/funded refi
  5. **Earnest** — email partnerships@earnest.com — variable $200–400
  6. **Juno** — partnerships@joinjuno.com — partner program; $300/refi as personal-referral fallback
- Stripe payment link created for the $19 PDF upsell.
- `app/api/stripe-webhook/route.ts`: on `checkout.session.completed`, move the contact to a "buyer" segment in Brevo and trigger the auto-fulfillment email with the personalized PDF attached.

### Phase 5 — SEO content (days 11–14)
- 8 long-form MDX articles in `content/articles/`:
  1. What the July 2026 Grad PLUS elimination means for med students
  2. Same, for law students
  3. Same, for MBA students
  4. Same, for dental students
  5. Same, for PhD students (slightly different angle: stipend + cap math)
  6. Same, for pharmacy students
  7. Private vs federal student loans in 2026: the new math
  8. Should you defer your start date by a year? A decision framework
- Each article: 1,800–2,500 words, internal links to relevant programmatic pages, embedded calculator widget, FAQ block with FAQ schema, 2–4 affiliate placements.

### Phase 6 — Distribution sprint (days 15–30)
- **Reddit (1 post/day, rotated):** r/premed, r/medicalschool, r/lawschooladmissions, r/whitecoatinvestor, r/MBA, r/PhD, r/lawschool, r/dentistry, r/pharmacy, r/Optometry, r/vetschool. Each post is a screenshot of the gap for a specific school + the tool link + a genuinely useful comment. Don't burn any one community.
- **TikTok (1 post/day, faceless):** screen-recording of the calculator with AI voiceover ("Plugging in Stanford Law, Class of 2029…"). Use ElevenLabs or similar for the voice.
- **Newsletter pitches (1 per day):** Morning Brew, Money With Katie, The Hustle's tools section, NerdWallet, Bankrate, the WSJ student-loan beat reporter.
- **ProductHunt launch on day 25** to capture residual SEO juice and hopefully a mid-tier finance newsletter pickup.
- **Mediavine application on day 30** (requires 50k sessions / 30 days for Journey tier — achievable if even one TikTok or Reddit thread breaks out). Until then: AdSense + the affiliate links + the $19 PDF upsell.

## Critical files

- `app/page.tsx` — landing + calculator entry
- `app/cliff/[school]/[program]/page.tsx` — programmatic SEO route
- `lib/calc.ts` — gap computation (the moat — every change gets a unit test)
- `lib/share-card.tsx` — Satori OG image (the share artifact)
- `lib/brevo.ts` — Brevo client + helpers
- `lib/affiliates.ts` — typed affiliate link map with UTMs
- `lib/schema.ts` — JSON-LD generators
- `data/schools.json` — IPEDS-derived COA dataset (~6,000 entries)
- `data/caps.json` — statutory cap reference data
- `content/articles/*.mdx` — 8 long-form SEO articles
- `app/sitemap.ts` — programmatic sitemap

## Verification (end-to-end)

1. **Calculation correctness:** spot-check 20 random `/cliff/[school]/[program]` pages — gap numbers match a manual calculation from the school's published COA.
2. **Performance:** Lighthouse > 95 (mobile) on three sampled pages.
3. **Share cards:** generate OG images for 10 schools — confirm correct rendering when pasted into Twitter, iMessage, Slack, Discord, and LinkedIn previews.
4. **Affiliate tracking:** click every link in `lib/affiliates.ts` with UTM tags → confirm clicks land in each network's dashboard.
5. **Stripe + email automation:** test purchase of the $19 PDF → confirms PDF generates, attaches, and Brevo moves the contact into the buyer segment.
6. **Email sequence:** subscribe a test address, fast-forward through the Brevo automation, confirm all 7 emails render correctly on Gmail mobile, Apple Mail, and Outlook.
7. **Reddit dry-run:** day-15 post from an established account; measure 24h CTR before scaling the distribution sprint.

## Affiliate application checklist

Submit in this exact order on the day the deployed site has the calculator working with a real screenshot:

- [ ] [Credible](https://www.credible.com/partners) — public form
- [ ] [ELFI](https://www.elfi.com/refinance-student-loans/referral-program/) — public form
- [ ] [LendKey](https://www.lendkey.com/affiliates/) — public form
- [ ] Impact Radius account ([impact.com](https://impact.com)) — needed to apply to SoFi
- [ ] CJ account ([cj.com](https://www.cj.com)) — backup network for SoFi
- [ ] [SoFi](https://www.sofi.com/personal-loan-affiliate/) — via Impact or CJ
- [ ] Earnest — email `partnerships@earnest.com`
- [ ] Juno — email `partnerships@joinjuno.com`

Skip Sallie Mae for now — their program is B2B-style (gated by relationship managers) and not suited to a 30-day affiliate-site launch.

## Out of scope (do not build)

- User accounts, login, password reset
- A database for user-submitted data (Brevo holds emails; Stripe holds purchases)
- Live chat, support tickets, manual review of any kind
- A generic blog CMS — articles are MDX in the repo
- Any feature requiring ongoing servicing

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | ISSUES_OPEN | score: 2/10 → 8/10, 6 decisions made |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**UNRESOLVED:** 1 (email capture placement — deferred to Phase 3 planning)
**VERDICT:** Design Review run. Eng review required before shipping.
