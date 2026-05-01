# Loan Cliff — Pre-Launch + GTM Design Spec

**Date:** 2026-05-01  
**Status:** Approved  
**Author:** Ilai + Claude

---

## Context

Loan Cliff is live at loancliff.com. The core MVP (calculator + 6,208 programmatic pages + email funnel) is implemented and deployed. Sitemap submitted to Google Search Console. The July 1, 2026 Grad PLUS elimination creates a hard demand peak — search volume and media coverage will spike May–July 2026. This spec defines what must be completed before any public distribution push, and the four-wave GTM strategy that follows.

**Constraints:**
- 30–60 min/day available for distribution work
- Maximize automation and AI agents
- $0 budget to start; can stretch to $100–500 for a proven move
- Preference for passive/compounding channels over manual community work

---

## Part 1 — Pre-Launch Checklist

All items must be resolved before any public distribution. Ordered by dependency.

### Technical Verification

**1. Build and typecheck**
- Run `npm run typecheck` — zero errors required
- Run `npm run build` — all 6,208 pages must generate without errors
- Run `npm test` — all unit tests pass (especially `lib/calc.test.ts`)

**2. Gap number spot-check**
- Manually verify the gap calculation on 5 specific pages against the school's published COA:
  - Harvard Medical School
  - Stanford Law School
  - NYU College of Dentistry
  - UPenn Wharton MBA
  - University of Chicago PhD
- Method: take the school's published annual COA, subtract the new statutory cap for that program type from `data/caps.json`, multiply by program length. Must match the page output exactly.

**3. Resolve Next.js version**
- Repo currently has `next@16.2.4`; stack spec locks to Next.js 15
- Decision required: keep `16.2.4` (accept the version drift) or intentionally downgrade
- Do not leave this ambiguous before launch

### SEO / Discoverability

**4. Bing Webmaster Tools — sitemap submission**
- Go to bing.com/webmasters
- Submit `https://loancliff.com/sitemap.xml`
- Verify no crawl errors returned

**5. Schema.org validation — 10 random pages**
- Use validator.schema.org
- Sample 10 programmatic pages (mix of med, law, MBA, dental, PhD schools)
- Confirm all four schema types render correctly per page:
  - `EducationalOccupationalProgram`
  - `MonetaryAmount`
  - `BreadcrumbList`
  - `FAQPage`
- Fix any errors before launch

**6. Google Search Console — confirm indexing in progress**
- Check GSC for crawl errors on the sitemap
- Confirm at least some pages show "Discovered" or "Indexed" status
- Set up a GSC email alert for manual actions

### Email Funnel

**7. Brevo end-to-end test**
- Confirm transactional email template exists in Brevo dashboard
- Submit a real email address on the live site
- Confirm: PDF generates, email arrives, PDF is attached, Brevo contact is created with correct attributes (`school`, `program`, `start_year`, `gap_total`)

**8. Brevo automation sequence**
- Confirm the 7-email automation workflow is live in Brevo dashboard
- Verify it fires on new contact addition to the main list
- Fast-forward a test contact through the sequence and confirm all 7 emails render correctly

### Monetization

**9. Stripe webhook route — decision**
- `app/api/stripe-webhook/route.ts` is not built
- Decision: build it now (buyer → Brevo segment + PDF delivery) or explicitly defer the $19 upsell to post-launch v2
- If deferred: remove or disable the Stripe payment link from the UI so users don't hit a dead end

**10. Affiliate links audit**
- Click every link in `lib/affiliates.ts` on the live site
- Confirm UTM parameters appear correctly in the destination URL
- Confirm no dead links or redirect errors
- Note: these are still placeholder/direct URLs until network approval — that's acceptable for launch, but every link must at least resolve

### Engineering Review

**11. Run `/review`**
- Full code review pass before treating as production-ready
- Focus areas: `lib/calc.ts` correctness, `app/api/email-report/route.ts` error handling, any exposed secrets or env var leaks

---

## Part 2 — GTM Strategy

### Wave 1: Earned Media Outreach
**Timeline:** Week 1 (start immediately after pre-launch checklist complete)  
**Effort:** ~30 min to set up, ~10 min/week to maintain  
**Goal:** One journalist, newsletter, or finance blogger cites or features the tool before June

**Target list (30 contacts):**

Journalists:
- CNBC student loans beat reporter
- Bloomberg Education
- WSJ personal finance / student debt beat
- MarketWatch education
- Forbes Advisor student loans editor
- Business Insider personal finance

Newsletters:
- Morning Brew
- Money With Katie
- The Hustle / Trends
- NerdWallet newsletter
- Bankrate newsletter
- Student Loan Planner (Travis Hornsby)
- The College Investor

Grad school blogs / publications:
- Poets & Quants (MBA focus)
- GradCafe
- The Princeton Review blog
- TUN.com
- Student Doctor Network

**Email templates (3 variants):**

*Journalist pitch:* Lead with the July 1 date, the gap number for a recognizable school, and the angle that no one has built the calculator yet. Offer an exclusive data pull (e.g. "the 10 schools with the largest gaps").

*Newsletter pitch:* Lead with reader value — "your readers can check their personal number in 30 seconds." Include one specific example gap number as the hook.

*Blogger/affiliate pitch:* Frame as a free tool they can recommend to their audience. Offer a co-branded landing page or exclusive affiliate code if it makes sense later.

**Cadence:** 5 outreach emails/week (AI-drafted, human-reviewed for personalization). Track in a simple spreadsheet: contact, date sent, response.

**Budget trigger:** If a post/article drives 5k+ sessions in 48h, allocate $200 to boost that specific piece of content on the same platform.

---

### Wave 2: SEO Content Build
**Timeline:** Weeks 1–2 (parallel with Wave 1)  
**Effort:** ~2–3 hrs total to draft + review all 8 articles (AI-assisted), then 1 publish per week  
**Goal:** 8 long-form MDX articles ranking for high-intent grad school funding queries

**Article list (priority order):**
1. `what-grad-plus-elimination-means-for-med-students.mdx`
2. `what-grad-plus-elimination-means-for-law-students.mdx`
3. `what-grad-plus-elimination-means-for-mba-students.mdx`
4. `what-grad-plus-elimination-means-for-dental-students.mdx`
5. `what-grad-plus-elimination-means-for-phd-students.mdx`
6. `what-grad-plus-elimination-means-for-pharmacy-students.mdx`
7. `private-vs-federal-student-loans-2026-new-math.mdx`
8. `should-you-defer-your-grad-school-start-year.mdx`

**Each article must include:**
- 1,800–2,500 words
- Embedded calculator widget (link to homepage or inline)
- 2–4 affiliate placements with UTMs
- FAQ block with `FAQPage` schema
- Internal links to 3–5 relevant programmatic pages
- Target keyword in H1, first paragraph, and at least 2 H2s

**Additional SEO tasks in this wave:**
- Add `llms.txt` to `/public` — signals to AI crawlers (Perplexity, ChatGPT) what to cite
- Verify GSC is showing programmatic pages being discovered (not just submitted)
- Set up GSC performance email digest (weekly)

---

### Wave 3: Shock Number Social Content
**Timeline:** Weeks 2–3  
**Effort:** 1–2 hr batch session to produce 30 pieces of content; then fully scheduled  
**Goal:** Viral share content built around the gap number; 1 post/day across 3 channels for 6 weeks

**Channels:** X (Twitter), Instagram Reels, TikTok

**Content format:**
- Screen recording of the calculator for a recognizable school
- AI voiceover (ElevenLabs free tier): *"I just plugged in [School] [Program], Class of 2029. Here's the gap no one is talking about."*
- The giant red number holds on screen for 3+ seconds
- CTA: "Check yours at loancliff.com" (link in bio for Instagram/TikTok)

**School mix for 30 posts:**
- 10 Ivy League / brand-name schools (Harvard, Stanford, Yale, Columbia, Penn, NYU, Duke, Georgetown, Michigan, UCLA) — high shareability
- 10 mid-tier state schools (Ohio State, Florida, Texas, Arizona State, etc.) — high volume, relatable
- 10 program-specific (Top dental schools, top pharmacy programs, top PhD programs) — niche community targeting

**Production tools:**
- ElevenLabs free tier — AI voiceover
- CapCut or equivalent — screen recording + voiceover assembly
- Buffer free tier — schedule 1 post/day across all 3 channels

**Budget trigger:** If any post exceeds 50k views → put $100–200 into boosting it on that platform only.

---

### Wave 4: Reddit (Conditional)
**Timeline:** Week 3+ — only if Waves 1–3 show slow traction  
**Effort:** ~15 min/post  
**Goal:** Direct community traffic from grad student subreddits

**Subreddit rotation:**
r/premed, r/medicalschool, r/lawschooladmissions, r/whitecoatinvestor, r/MBA, r/PhD, r/lawschool, r/dentistry, r/pharmacy

**Format:** Genuine, specific post — share the gap number for a school relevant to that sub, frame as useful information, tool as a resource not a pitch. Never post the same link twice in one sub within 30 days.

**Risk:** Getting flagged as spam is costly — only use this wave if organic traction is behind target.

---

### Ongoing Maintenance (automated, <10 min/week)

- **PostHog + GA:** Weekly review of top pages, traffic sources, email capture rate, affiliate click rate
- **Brevo:** Monitor email 1 open rate. If < 30%, rewrite subject line. Monitor unsubscribe rate.
- **GSC:** Weekly crawl error check, monitor for manual actions
- **Affiliate dashboard:** Weekly check that UTM tracking is firing and click data is visible in each network's dashboard

---

## Timeline Summary

| Phase | When | Owner |
|-------|------|-------|
| Pre-launch checklist (items 1–11) | This week | Ilai + Claude |
| Wave 1: Earned media outreach | Week 1, ongoing | Ilai (AI-drafted emails) |
| Wave 2: SEO articles (draft all) | Week 1 | Claude |
| Wave 2: SEO articles (publish) | Weeks 1–3, 1–2/week | Ilai |
| Wave 2: llms.txt + GSC setup | Week 1 | Claude |
| Wave 3: Social content batch | Week 2 | Ilai (AI tools) |
| Wave 3: Social drip live | Weeks 2–8 | Buffer (automated) |
| Wave 4: Reddit | Week 3+ if needed | Ilai |
| Ongoing monitoring | Weekly | Ilai |

---

## Success Metrics (30 days post-launch)

| Metric | Target |
|--------|--------|
| GSC indexed pages | 500+ programmatic pages indexed |
| Organic sessions/week | 1,000+ by week 4 |
| Email captures | 100+ subscribers |
| Affiliate clicks | 50+ tracked clicks |
| Earned media placements | 1+ citation or feature |
| Social reach | 1+ post > 10k views |
