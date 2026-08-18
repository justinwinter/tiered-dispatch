# PRD — Undercut (firstpass)

> Status: **shipped v0.2.0**. This PRD reflects current reality, not an
> aspiration. Last updated: 2026-08-18.

## Problem

Coding agents (Claude Code, Codex, Cursor, Copilot) let you pick a model once
per session, so they route almost everything — including trivial, mechanical
work — to the most expensive model available. The obvious fix (ask the model
how confident it is, route on that) fails: LLM self-reported confidence is
poorly calibrated.

Evidence this is real: one Claude Code Max subscriber's self-reported usage
showed 93.8% of tokens going to the top-tier model (anthropics/claude-code
#27665) — a single-user anecdote, but the issue's sustained engagement
suggests the pattern generalizes.

## Solution

**Undercut** is a SKILL.md that coding agents follow at dispatch time:

- Six-flag rubric assigns each unit of work a base tier (cheap/standard/
  frontier/apex).
- Three **objective** escalation triggers: verification failure ×2, measured
  low-tier disagreement, explicit uncertainty flag.
- Hysteresis (max one retry/tier, never de-escalate), residue-only
  escalation, single batched apex tie-break.
- **probe policy (shipped):** format-strict work starts cheap and caps at
  standard — model-agnostic, proven across 4 model families.

## Users

1. **Platform/DevEx engineers** running agents at scale (owns the token bill).
2. **Finance/ops** (approves spend; needs auditability, no vendor lock-in).
3. **Product people / vibe coders** (wants it to "just be cheaper").

Wedge: one ICP (engineers), one mechanism (objective-trigger routing), one
proof (published A/B results).

## Evidence (measured, not aspirational)

Public benchmarks, official test cases, deterministic graders, 5 seeds:

| Benchmark | Vendor | Cost | Pass |
|---|---|---|---|
| GSM8K | OpenAI | −71% | +8 |
| GSM8K | Gemini | −59% | −2 (noise) |
| HumanEval | Gemini | −95% | = |
| HumanEval | Anthropic | −61% | = |

Tiered never worse than all-standard on any synthetic-suite cell; better on
6 of 12. Full data: `testing/README.md`, raw results in `testing/results/`.

## Scope

### In (shipped / committed)
- The skill (SKILL.md + models.md), MIT, installs via skills.sh.
- The eval harness (evals/) — vendor-constant, deterministic, seeded.
- Landing page (getundercut.sh), canonical domain, privacy/terms, discovery
  files, CI, CONTRIBUTING, issue/PR templates.
- Public benchmark validation + published raw results.

### In (next, from roadmap)
- See `docs/business/roadmap.md`.

### Launch scope — Teams + Enterprise (shipping at launch)
- **Teams tier:** org-wide routing policy enforcement, per-account savings
  metering, verifiable escalation ledger, SSO/directory sync. Self-serve.
- **Enterprise tier:** everything in Teams + on-prem/self-hosted option,
  SOC 2 path, data residency, dedicated support. **Contact-only.**
- See `docs/business/business-model.md` for the tier definitions and
  `docs/business/roadmap.md` for launch-blocking tasks.

### Out (explicitly not building)
- No proxy / no network-layer enforcement in the free skill. Composes with
  gateways. (Note: the Teams/Enterprise governance tier is an *orchestration*
  layer on top, not a proxy — this stays true.)
- No custom flagging/classification model (measured unnecessary).
- No fake trust signals (SOC 2, G2, logos) until earned.

## Success metrics

- **Primary:** cost reduction % at equal-or-better pass rate (measured in
  evals/).
- **Adoption:** installs, GitHub stars, org-internal forwards.
- **Trust:** independent replication of the benchmark harness by a third
  party (top backlog item).

## Non-goals / guardrails

- No unearned claims in public docs. Every number traces to published data.
- The "93.8%" anecdote stays attributed as single-user self-report.
- Savings are workload-dependent; never promise a dollar figure.

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-08-15 | Name: **Undercut** | Benefits-first, passes Ogilvy test, survives forwarding |
| 2026-08-18 | Repo → **undercutsh/firstpass** | Org hosting for credibility; brand separate from slug |
| 2026-08-18 | Domain → **getundercut.sh** | `undercut.sh` was an active competitor |
| 2026-08-18 | Ship **probe** policy | formatStrict→standard was vendor-specific; probe is model-agnostic |