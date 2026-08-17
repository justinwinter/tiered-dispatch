---
name: tiered-dispatch
description: Use BEFORE any multi-agent fan-out, swarm, or Workflow orchestration — and when assigning a model tier to any delegated unit of work. Confidence-gated model routing: rubric-based base-tier assignment (cheap→standard→frontier→apex), objective escalation triggers (verification failure, disagreement, uncertainty flags), hysteresis rules, and the structured handoff payload that lets higher tiers resolve only the residue lower tiers couldn't. Triggers on "fan out", "swarm", "parallel agents", "which model", "assign tiers", "dispatch", "model routing", "token cost".
---

# Tiered Dispatch — confidence-gated model routing

Goal: every unit of work runs at the cheapest tier that can pass verification,
and escalation is driven by **objective signals** (failed checks, disagreement,
explicit uncertainty flags) — never by asking a model how confident it feels.
LLM self-reported confidence is poorly calibrated; this skill treats it as a
routing hint only, never as approval.

This skill defines the ladder logic and is model-agnostic. It uses four
generic tier names — **cheap**, **standard**, **frontier**, and an optional
**apex** — instead of any vendor's specific model names. Resolve tier names to
actual model IDs for your agent (Claude Code, Codex, Cursor, or other) via
`models.md` in this same directory.

## The two routing decisions

1. **Planning tier** — who decomposes the work and makes judgment calls.
   Plan once, carefully, at the tier the ambiguity demands (usually the main
   thread or one frontier-tier pass). Bad planning wastes the whole run.
2. **Execution tier** — who does each planned unit. Defaults LOW. Bad
   execution wastes one retry. These are separate decisions; never let the
   planning tier's cost leak into execution by "keeping it all in one agent."

## Step 1 — Base tier assignment (rubric, not vibes)

Score each unit of work on five flags:

| Flag | Question | Flag it when… |
|---|---|---|
| UNVERIFIABLE | Can output be checked mechanically (tests, schema, diff, grep, spot-check)? | it cannot |
| AMBIGUOUS | One right answer, or multiple defensible ones? | multiple |
| BLAST | Reversible? Touches money / auth / user data / production / deletes? | irreversible or sensitive |
| CROSS-CUTTING | One file/source, or reasoning across many? | many |
| NOVEL | Pattern-following, or genuinely new design? | new design |

Mapping (resolve tier names to actual models via `models.md`):

- **0 flags → cheap** (mechanical sweeps, manifests, format checks, doc reads)
- **1–2 flags → standard** (real implementation, categorization with policy, authoring)
- **3+ flags, or any ownership/judgment call → frontier**
- **apex** — only when you can write one sentence stating why the marginal
  intelligence pays for the cost. If you can't write the sentence, use
  frontier.

**Override — cheap-to-verify ⇒ cheap-to-generate.** If a unit's output can be
verified mechanically, assign the LOWEST tier regardless of how hard it looks,
and let verification catch failure. Only unverifiable work needs to *start*
high. This is the generator–verifier gap and it is the single biggest token
saver in this system.

## Step 2 — Escalation triggers (the "confidence threshold", made objective)

Escalate exactly ONE tier when ANY of these fires:

1. **Verification failure ×2** at the current tier (tests fail, QA re-derivation
   disagrees, schema/spot-check fails). Two strikes — don't loop a model that
   has demonstrated it can't do the unit.
2. **Disagreement**: for AMBIGUOUS-flagged work you want to keep cheap, run it
   TWICE at the low tier. Agree → accept. Disagree → that is your measured
   low-confidence signal; escalate. (Never dual-run mechanical work — the 2×
   cost only pays where a wrong cheap answer is expensive.)
3. **Uncertainty flag**: the worker tagged the item `uncertain`. Only tagged
   items flow up.

**Residue-only escalation.** The higher tier receives ONLY failed/uncertain
items plus the verification notes — it resolves the residue; it never redoes
the batch.

## Step 3 — Hysteresis (prevents burn in both directions)

- Never de-escalate mid-task. standard inherited it → stays standard-or-up.
- Max ONE retry per tier. cheap fails twice → standard gets one shot →
  frontier.
- Ladder cap: everything unresolved after frontier goes to a SINGLE batched
  apex tie-break agent (one call, all residual items), never per-item apex
  calls.
- Escalation is per-unit, not per-batch: one hard file doesn't drag 699 easy
  ones up a tier.

## Worker prompt template (append to every dispatched unit)

```
OUTPUT CONTRACT:
- Return raw structured data per the schema below, no prose wrapper.
- Tag EVERY item: `status: grounded` or
  `status: uncertain, reason: <one line — what fact or rule is missing>`.
- Tag `uncertain` whenever two answers seem defensible, an assumption was
  required, or source data conflicted. Uncertain is cheap; wrong is expensive.
- Do NOT resolve uncertainty by guessing. Flag and move on.
```

## Escalation payload schema (what flows up)

Each escalated item must carry enough context that the higher tier acts
without re-reading everything:

```json
{
  "item": "<id / file path / question>",
  "attempted_tier": "cheap|standard",
  "attempts": [{"answer": "...", "verification": "failed|n/a", "notes": "..."}],
  "uncertainty_reason": "<why the lower tier couldn't decide>",
  "decision_needed": "<the single question to answer>",
  "context_refs": ["<paths/excerpts the decider must see>"]
}
```

## Verification patterns (pick the cheapest that is INDEPENDENT)

Verification must not be the same agent re-reading its own output — that
rubber-stamps. In order of preference:

1. **Mechanical**: tests, schema validation, compile, diff, grep counts.
2. **Execution**: actually run the artifact against synthetic payloads
   (including malformed input), don't read-and-declare-fine.
3. **Re-derivation**: an independent agent re-derives a SAMPLE (e.g. 12 of 700)
   from source, hunting specifically for the dangerous failure class you name
   (e.g. "hand-written file wrongly tagged build-artifact").
4. **Judge**: only for unverifiable judgment output — a different-tier or
   different-lens agent scores it. Weakest; use last.

## Workflow skeleton (Claude Code example)

The pipeline below is written against Claude Code's model names to make it
concrete — swap in your agent's tier→model mapping from `models.md` if you're
running this on Codex, Cursor, or another tool. The ladder logic (assign →
attempt → verify → escalate residue → one batched tie-break) is what matters,
not the literal model strings.

```js
// per-unit: assign → attempt → verify → escalate residue
// tier names below are Claude Code models; resolve via models.md for other agents
const TIERS = ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-5']
const results = await pipeline(
  units,
  u => agent(workPrompt(u), { model: baseTier(u), schema: ITEM_SCHEMA }),
  (r, u) => r.status === 'grounded'
    ? agent(verifyPrompt(r, u), { model: 'claude-haiku-4-5', schema: VERDICT }).then(v => ({...r, v}))
    : ({...r, v: { pass: false, reason: r.uncertainty_reason }}),
)
const residue = results.filter(r => !r.v.pass)
// one batched tie-break call, everything else is done
const resolved = residue.length
  ? await agent(tieBreakPrompt(residue), { model: 'claude-opus-5', effort: 'high' })
  : []
```

## End-of-run calibration (self-improving rubric)

After each dispatched run, write one line per miss:

- `over-tiered: <unit> — standard assigned, cheap-verifiable` (wasted spend)
- `escalated late: <unit> — burned 2 retries, flags missed AMBIGUOUS` (wasted retries)

If the same miss class appears across runs, edit the rubric table in this file.
The rubric is the product; the runs are its training data.

## Anti-patterns

- Asking a worker "how confident are you (0–1)?" and thresholding the number.
  Calibration is poor; use the three objective triggers instead.
- Escalating the whole batch because some items failed.
- Verification by the generating agent ("looks correct to me").
- Dual-running mechanical work (2× cost, no information gained).
- Starting frontier/apex "to be safe" on work with a mechanical check — the
  check IS the safety.
- Per-item calls to the top tier. Batch the residue.
