# Loan Cliff — 30-Day Execution Plan

## Context

The reconciliation bill eliminates Grad PLUS loans on July 1, 2026 and imposes new statutory caps ($20,500/yr / $100k aggregate for grad, $50k/yr / $200k aggregate for professional). Med, law, dental, MBA, PhD, and other professional-program students face five- to six-figure annual funding gaps with no federal solution. Search demand is rising and will peak May–August 2026. As of late April 2026 ([CNBC, Apr 22 2026](https://www.cnbc.com/2026/04/22/student-loan-cap-grad-plus-rules.html)), financial aid groups are publicly stating that implementation rules remain unclear.

The white space: explainer articles exist (Saving for College, Fastweb, Earnest, school financial aid pages) but no one has shipped the focused interactive personal-gap calculator with the new caps surfaced as the headline number. studentaid.gov has a generic federal loan simulator that does not surface the gap. The slot is empty.

The intended outcome: a fully automated web tool that ranks for and gets cited on grad-school cost queries, captures emails for a Brevo-driven nurture sequence, and converts at meaningful rates against student-loan refi affiliate programs ($150–$400 CPA per funded loan). Target: positive unit economics within 30 days, scalable beyond.

## Current execution plan

The MVP is live at loancliff.com. Phases 1–4 are complete. The plan below covers what remains: pre-launch verification, then the four-wave GTM strategy. Full spec: `docs/superpowers/specs/2026-05-01-prelaunch-gtm-design.md`.

---

### Pre-Launch Checklist (complete before any public distribution)

#### Technical
- [x] `npm run typecheck` + `npm run build` + `npm test` — all pass, zero errors. Build generates 6,227 static pages.
- [ ] Gap number spot-check — verify 5 pages manually: Harvard Med, Stanford Law, NYU Dental, UPenn Wharton MBA, UChicago PhD
- [x] Resolve Next.js version — locked at `next@16.2.4` (the version the project is built on).

#### SEO / Discoverability
- [ ] Bing Webmaster Tools — submit `https://loancliff.com/sitemap.xml`
- [ ] Schema.org validation — validate 10 random programmatic pages at validator.schema.org; confirm `EducationalOccupationalProgram`, `MonetaryAmount`, `BreadcrumbList`, `FAQPage` all present
- [ ] Google Search Console — confirm pages are being discovered/indexed, set up weekly email digest

#### Email Funnel
- [ ] Brevo end-to-end test — submit real email on live site, confirm PDF generates, email arrives, contact created with correct attributes
- [ ] Brevo automation — confirm 7-email sequence is live in dashboard and fires on new contact

#### Monetization
- [ ] Stripe webhook decision — build `app/api/stripe-webhook/route.ts` now, or explicitly defer $19 upsell and remove the payment link from UI
- [ ] Affiliate links audit — URLs are placeholder direct links; Ilai will replace with network-approved deep links. UTM structure in `lib/affiliates.ts` is correct.

#### Engineering
- [ ] Run `/review` — full code review pass before treating as production-ready

---

### Wave 1 — Earned Media Outreach (Week 1, ongoing)

Goal: one journalist, newsletter, or finance blogger cites or features the tool before June.

- Draft 3 outreach templates (journalist / newsletter / blogger) — AI-written, personalized per send
- Target list of 30 contacts: CNBC, Bloomberg, WSJ, Forbes Advisor, MarketWatch, Morning Brew, Money With Katie, The Hustle, NerdWallet, Bankrate, Student Loan Planner, Poets & Quants, GradCafe, Student Doctor Network, TUN.com
- Send 5 emails/week, track in spreadsheet
- Hook: specific gap number for a recognizable school + July 1 deadline as urgency
- Budget trigger: if a pickup drives 5k+ sessions in 48h → $200 boost on that platform

---

### Wave 2 — SEO Content Build (Weeks 1–2)

Goal: 8 MDX articles live in `content/articles/`, ranking for high-intent grad funding queries.

Articles (priority order):
1. `what-grad-plus-elimination-means-for-med-students.mdx`
2. `what-grad-plus-elimination-means-for-law-students.mdx`
3. `what-grad-plus-elimination-means-for-mba-students.mdx`
4. `what-grad-plus-elimination-means-for-dental-students.mdx`
5. `what-grad-plus-elimination-means-for-phd-students.mdx`
6. `what-grad-plus-elimination-means-for-pharmacy-students.mdx`
7. `private-vs-federal-student-loans-2026-new-math.mdx`
8. `should-you-defer-your-grad-school-start-year.mdx`

Each article: 1,800–2,500 words, embedded calculator, 2–4 affiliate placements with UTMs, FAQ schema block, 3–5 internal links to programmatic pages.

Additional tasks:
- [ ] Add `llms.txt` to `/public` — signals AI crawlers (Perplexity, ChatGPT) what to cite

---

### Wave 3 — Shock Number Social Content (Weeks 2–3)

Goal: 30 pieces of content batch-produced, scheduled 1/day across X, Instagram Reels, TikTok for 6 weeks.

Format: screen recording of calculator for a recognizable school + ElevenLabs AI voiceover + the red gap number on screen 3+ seconds + CTA to loancliff.com.

School mix: 10 Ivy/brand-name, 10 mid-tier state schools, 10 program-specific (dental/pharmacy/PhD).

Tools: ElevenLabs free tier (voice) + CapCut (assembly) + Buffer free tier (scheduling).

Budget trigger: if any post exceeds 50k views → $100–200 boost on that platform.

---

### Wave 4 — Reddit (Week 3+, conditional)

Only activate if Waves 1–3 show slow traction.

Subreddits: r/premed, r/medicalschool, r/lawschooladmissions, r/whitecoatinvestor, r/MBA, r/PhD, r/lawschool, r/dentistry, r/pharmacy.

Format: genuine, specific post with school-relevant gap number. Tool as a resource, not a pitch. Never same link twice in one sub within 30 days.

---

### Ongoing (weekly, <10 min)

- PostHog + GA: top pages, traffic sources, email capture rate, affiliate click rate
- Brevo: email 1 open rate (target >30%), unsubscribe rate
- GSC: crawl errors, manual actions
- Affiliate dashboards: UTM tracking firing, click data visible

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
