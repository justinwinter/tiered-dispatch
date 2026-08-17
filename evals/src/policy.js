// The tiered-dispatch POLICY ENGINE — mirrors skills/tiered-dispatch/SKILL.md.
//
// Pure logic: rubric → base tier, cheap-to-verify override, escalation
// triggers (verify fail x2, disagreement, uncertainty flag), hysteresis
// (max 1 retry per tier, never de-escalate), residue-only payload schema,
// single batched apex tie-break. No I/O — the runner injects `attempt()`.

import { TIER_ORDER, MAX_TIER_RETRIES } from './config.js';
import { WORKER_CONTRACT } from './types.js';

/** Count rubric flags on a task. */
export function countFlags(task) {
  return Object.entries(task.flags).filter(([k, v]) => v === true).length;
}

/**
 * Step 1 — base tier assignment (rubric, not vibes).
 * Includes the cheap-to-verify ⇒ cheap-to-generate override.
 */
export function baseTier(task) {
  // Override: cheap-to-verify ⇒ cheap-to-generate. If output is mechanically
  // verifiable, assign the LOWEST tier regardless of apparent difficulty.
  if (!task.flags.unverifiable) return 'cheap';

  const flags = countFlags(task);
  if (flags >= 3 || task.flags.blast) return 'frontier'; // ownership/judgment
  if (flags >= 1) return 'standard';
  return 'cheap';
}

/** Step 2 — the single escalation trigger: one tier up, never down. */
export function escalate(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.min(idx + 1, TIER_ORDER.length - 1)];
}

/** Build the worker prompt for a unit: task prompt + OUTPUT CONTRACT. */
export function workerPrompt(task, payload) {
  const extras = payload?.context_refs?.length
    ? `\nContext for decision: ${payload.context_refs.join('; ')}`
    : '';
  return `${task.prompt}\n\n${extras}\n\n${WORKER_CONTRACT}`;
}

/** Escalation payload schema (what flows up to a higher tier). */
export function buildPayload(task, attempts) {
  const last = attempts[attempts.length - 1];
  return {
    item: task.id,
    attempted_tier: last?.tier ?? null,
    attempts: attempts.map((a) => ({
      answer: a.answer,
      verification: a.verdict.pass ? 'pass' : 'failed',
      notes: a.verdict.reason,
    })),
    uncertainty_reason: last?.uncertaintyReason ?? null,
    decision_needed: 'resolve the item correctly',
    context_refs: [],
  };
}

/**
 * Run one unit through the ladder: cheap → standard → frontier.
 * If frontier fails, the unit is marked `needsApex` — the RUNNER batches all
 * such units into ONE apex tie-break call (the skill's ladder cap). This
 * function never makes per-item apex calls.
 * `attempt(modelTier, task, payload)` is injected by the harness and returns
 *   { answer, status, uncertaintyReason, verdict, cost, usage }.
 * Returns the full trace: attempts, finalTier, needsApex.
 */
export async function runUnitLadder(task, attempt) {
  const trace = { attempts: [], finalTier: null, escalated: false, needsApex: false };
  const frontier = TIER_ORDER[TIER_ORDER.length - 2];

  let tier = baseTier(task);
  let payload = null;
  let retriesAtTier = 0;

  while (true) {
    const r = await attempt(tier, task, payload);
    trace.attempts.push({ ...r, tier });

    // Uncertainty flag is an immediate escalation trigger.
    if (r.status === 'uncertain') {
      trace.escalated = true;
      if (tier === frontier) {
        trace.finalTier = tier;
        trace.needsApex = true;
        return trace;
      }
      payload = buildPayload(task, trace.attempts);
      tier = escalate(tier);
      retriesAtTier = 0;
      continue;
    }

    // Pass → done at this tier.
    if (r.verdict.pass) {
      trace.finalTier = tier;
      return trace;
    }

    // Fail: hysteresis — max ONE retry per tier, then escalate.
    retriesAtTier++;
    if (retriesAtTier > MAX_TIER_RETRIES) {
      trace.escalated = true;
      if (tier === frontier) {
        // Ladder cap: mark for the single batched apex tie-break.
        trace.finalTier = tier;
        trace.needsApex = true;
        return trace;
      }
      payload = buildPayload(task, trace.attempts);
      tier = escalate(tier);
      retriesAtTier = 0;
      continue;
    }
  }
}

/**
 * Dual-run disagreement for ambiguous cheap work:
 * run the unit TWICE at the low tier; disagree → escalate.
 */
export async function runUnitDual(task, attempt, lowTier = 'cheap') {
  const [r1, r2] = [await attempt(lowTier, task, null), await attempt(lowTier, task, null)];
  const agree =
    r1.verdict.pass === r2.verdict.pass &&
    JSON.stringify(r1.answer) === JSON.stringify(r2.answer);
  if (agree && r1.verdict.pass) {
    return {
      attempts: [{ ...r1, tier: lowTier }, { ...r2, tier: lowTier }],
      finalTier: lowTier,
      escalated: false,
      apexBatched: false,
    };
  }
  return {
    attempts: [{ ...r1, tier: lowTier }, { ...r2, tier: lowTier }],
    finalTier: null,
    escalated: true,
    apexBatched: false,
    disagreement: true,
  };
}