# tiered-dispatch

Confidence-gated model routing for coding agents. Run every unit of work at
the cheapest model that can pass verification. Escalate on evidence, not
vibes.

## The problem

Coding agents route almost everything to the most expensive model available,
by default and by habit. In an open Claude Code feature request
([anthropics/claude-code#27665](https://github.com/anthropics/claude-code/issues/27665)),
one Max subscriber posted self-reported `ccusage` data showing 93.8% of their
tokens went to the top-tier model, with no automatic optimization pulling
cheap, mechanical work down to a cheaper one. That's a single user's local
usage stats, not a measured audit — but the issue has stayed open with real
engagement (20+ reactions, 30+ related issues), which suggests the pattern
isn't unique to one account. That's not a Claude Code problem specifically —
it's what happens by default in any agent that lets you pick a model once per
session instead of once per unit of work.

The obvious fix — "ask the model how confident it is, route on that" —
doesn't work. Self-reported model confidence is poorly calibrated. A model
that's wrong is frequently just as "confident" as a model that's right, so
thresholding a confidence score buys you the feeling of a safety check
without the substance of one.

## The core idea — the generator–verifier gap

If a task's output is cheap to verify mechanically — tests, schema
validation, a diff, a spot-check — it is safe to *attempt* at the cheapest
tier regardless of how hard the task looks. Escalation should happen on
verification failure, not on predicted difficulty. Only unverifiable
judgment work — the kind with no mechanical check, where "correct" is a
matter of taste or context — needs to start on an expensive model. This gap
between how hard something is to generate and how hard it is to verify is
the single biggest lever in this system.

## How it works

**Base tier: a 5-flag rubric.** Score each unit of work on whether it's
unverifiable, ambiguous, high blast radius (irreversible, money, auth, user
data), cross-cutting, or novel. 0 flags → cheap. 1–2 → standard. 3+, or any
ownership/judgment call → frontier.

**3 objective escalation triggers**, one tier at a time:

1. Verification fails twice at the current tier.
2. Two low-tier runs on ambiguous work disagree (dual-run only ambiguous
   work — never mechanical work, where a second run buys no information).
3. The worker tags an item `uncertain`.

**Residue-only escalation.** A higher tier sees only the items that failed
or were flagged — never the whole batch. It resolves the residue.

**Hysteresis.** Never de-escalate mid-task. One retry per tier, max.
Everything still unresolved after the frontier tier goes to a single batched
apex-tier tie-break call — never per-item apex calls.

```
cheap ──fail x2──▶ standard ──fail x2──▶ frontier ──unresolved──▶ apex
  │                    │                     │                 (batched,
  │  agree, done       │  agree, done        │  ownership /       residue
  ▼                    ▼                     ▼   judgment calls    only)
 done                 done                  done      start here
```

## Install

Via [skills.sh](https://skills.sh):

```
npx skills add justinwinter/tiered-dispatch
```

Manual: copy `skills/tiered-dispatch/` into `.claude/skills/` (Claude Code) or
your agent's skills directory. Works with Claude Code, Codex, Cursor,
Copilot, OpenCode — anything that reads a `SKILL.md`.

## What this is and isn't

This is policy the orchestrating agent follows at dispatch time. It is not a
proxy, and it does not enforce anything at the network layer.

It composes with gateway tools — compression proxies, budget gateways like
Edgee. They compress what goes over the wire for a given call. This decides
which model handles each unit of work in the first place. They stack: route
first, compress second.

## Prior art

Tier-based subagent routing isn't a new idea. peragwin's
[subagent-model-routing](https://gist.github.com/peragwin) gist and
[soumabali/token-router](https://github.com/soumabali/token-router) both
explored assigning cheaper models to subagent work. This skill's contribution
is the objective escalation loop on top of that idea: measured disagreement
instead of self-reported confidence, hysteresis so a run can't thrash between
tiers, residue-only escalation with a structured handoff payload so a higher
tier never re-reads a batch it didn't need to see, and a calibration feedback
loop that turns each run's misses back into rubric edits.

## Roadmap — benchmark-triggered mapping updates

`models.md` is the versioned tier→model mapping, kept separate from the
routing logic so it can update on its own cadence. The plan is to anchor it
to a neutral, public reference benchmark pair — SWE-bench Verified for the
execution tiers (cheap/standard/frontier), and a general reasoning index for
the judgment tiers (frontier/apex). When a new model beats a tier's
incumbent on the relevant benchmark, an updated mapping ships as a release.

Watch releases to get routing-table updates when the model landscape shifts.

---

MIT · by [Justin Winter](https://iamjustinwinter.com)
