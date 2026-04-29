# CLAUDE.md

Claude Code specific guidance. **Read [AGENTS.md](./AGENTS.md) first** — it contains the universal conventions every agent must follow. This file only adds Claude-specific notes.

## Tooling preferences

- Use `Read`, `Edit`, `Write`, `Glob`, `Grep` over Bash equivalents.
- Use `npm` for all package and script operations (not pnpm/yarn/bun).
- Run `npm run typecheck` and `npm run build` before claiming a task is done. Both must pass.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool:

- Product strategy / scope changes → `/plan-ceo-review`
- Architecture / implementation planning → `/plan-eng-review`
- Visual / UX review → `/design-review` or `/plan-design-review`
- Bugs and unexpected behavior → `/investigate`
- QA / dogfooding → `/qa` or `/qa-only`
- Pre-merge code review → `/review`
- Ship / deploy / PR → `/ship` or `/land-and-deploy`
- Save / restore session context → `/context-save` / `/context-restore`
- SEO work → `/seo`, `/programmatic-seo`, `/ai-seo`
- Copy / landing page work → `/copywriting`, `/page-cro`

When in doubt, invoke the skill.

## Communication style

Terse. No filler. State the change, name the file, move on. End-of-turn summaries are one or two sentences.

## What I (the human) care about most

1. **The gap number is correct.** A wrong number on a viral share card is a brand-ending event. Every change to `lib/calc.ts` gets a unit test.
2. **Pages build statically.** No runtime DB calls on the programmatic SEO routes — they must be `force-static` and pre-rendered at build time.
3. **The site is fast.** Lighthouse > 95 on mobile for the calculator and any sampled programmatic page. No client-side JS on programmatic pages beyond what shadcn/ui needs.
4. **Affiliate links work and are tracked.** Every link in `lib/affiliates.ts` has UTMs. Test clicks land in the correct network's dashboard before declaring an integration done.

## Don't

- Don't suggest swapping Brevo, Vercel, Next.js, or shadcn for alternatives. Stack is locked.
- Don't add backwards-compatibility shims, feature flags, or "for future use" abstractions. Three lines of duplication beats one premature abstraction.
- Don't write multi-paragraph code comments or docstrings.
- Don't ask permission for trivial edits inside files I've already approved working on. Just edit.
- Don't run `git push` or open PRs without me explicitly asking.
