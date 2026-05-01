# Loan Cliff

A free web tool that shows graduate and professional students their personal funding gap created by the **July 1, 2026 elimination of Grad PLUS loans**.

Three inputs (program type, school, start year) → one giant red number → next-step paths (private refi, scholarships, income-share). Faceless distribution via grad-student subreddits and screen-recorded TikToks. Monetized via student-loan refi affiliate programs (Credible, SoFi, Earnest, ELFI, Juno, LendKey).

## Status

MVP implementation in progress. The calculator, static programmatic result pages, gap calculation tests, SEO plumbing, affiliate-link map, analytics wiring, Brevo PDF email route, legal pages, and Brevo email-sequence docs are present.

Current generated corpus: **1,789 schools/institutions**, **12 program types**, **6,208 program pages** from committed JSON data.

Open before launch: verify `npm run typecheck`, `npm test`, and `npm run build`; audit the data/import provenance; configure Brevo env/dashboard; replace placeholder affiliate URLs with approved network links; build Stripe webhook; add the planned MDX SEO articles; validate Schema.org output; spot-check sampled gap numbers manually; deploy and connect/search-submit `loancliff.com`.

See [AGENTS.md](./AGENTS.md) for the current agent handoff and [PLAN.md](./PLAN.md) for the full 30-day execution plan.

## For AI agents

If you are an AI coding agent picking up this project, **read [AGENTS.md](./AGENTS.md) first** for conventions, constraints, and commands. Claude Code agents should also read [CLAUDE.md](./CLAUDE.md).

## Why this exists

The reconciliation bill eliminates Grad PLUS on July 1, 2026 and imposes new caps ($20,500/yr / $100k aggregate for grad, $50k/yr / $200k aggregate for professional). Med, law, dental, and MBA students face five- to six-figure annual gaps with no federal solution. Search demand is rising and will peak May–August 2026. No competitor has shipped the focused personal-gap calculator with the new caps surfaced as the headline number — the slot is empty.

## License

Private. Not open source.
