# Internal docs — index for agent threads

This directory is the **single source of truth** for the business model,
product roadmap, and internal plans. Any agent thread (Claude Code, opencode,
other) that needs to know *where this project is going* should read this index
first.

> **Public-facing docs** (what users/customers see) live elsewhere:
> `README.md`, `testing/README.md`, `RESULTS.md`. This folder is for internal
> planning, strategy, and marketing material. Keep `docs/` accurate before
> making claims about the product in public docs.

## Read in this order

| Doc | What it answers | Freshness |
|---|---|---|
| [`business/PRD.md`](business/PRD.md) | What is the product, who is it for, what are we building? | 2026-08-18 |
| [`business/business-model.md`](business/business-model.md) | How does it make money? Free tier, paid plan, placeholders | 2026-08-18 |
| [`business/roadmap.md`](business/roadmap.md) | What's next, in priority order | 2026-08-18 |
| [`marketing/research-dump.txt`](marketing/research-dump.txt) | Raw data for landing-page/copy decisions | 2026-08-18 |
| [`marketing/landing-copy.md`](marketing/landing-copy.md) | The landing page copy + rationale | 2026-08-18 |
| [`marketing/design-notes.md`](marketing/design-notes.md) | Design system + trust conventions | 2026-08-18 |
| [`marketing/naming-options.md`](marketing/naming-options.md) | Why "Undercut" (decision record) | 2026-08-18 |

## House rules (so multiple threads don't collide)

1. **Read before you act.** If your task touches strategy, pricing, or
   roadmap, check the relevant doc first — another thread may have moved it.
2. **One source of truth.** Don't keep a second copy of a plan on your
   Desktop or in a scratch file. Update the doc in this folder.
3. **Branch → PR → squash-merge.** Commit doc changes to a branch and PR it,
   like code. Never force-push.
4. **Re-fetch before acting.** `git fetch` + check `origin/main` before
   editing — the shared repo moves.
5. **Trust backlog** is separate: `testing/trust-backlog.md` (what trust
   signals we've *earned* vs *plan to earn*). Don't mix "we plan to" with
   "we have."

## Link from the main README?

A small internal-only note is fine, but `docs/` is not linked from the public
README footer on purpose — it's internal planning material.