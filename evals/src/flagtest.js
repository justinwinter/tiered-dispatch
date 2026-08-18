// Flagging-reliability test.
//
// The eval harness hand-assigns rubric flags to every task. In production the
// SKILL.md says the DISPATCHING agent scores those flags itself before
// routing. This test measures how reliably a dispatcher model reproduces the
// ground-truth flags:
//
//   - If agreement is high, the skill works in the wild with no custom
//     flagging system — the dispatcher's own flags are trustworthy.
//   - If agreement is low, routing inherits noisy input and the cost savings
//     are what the escalator can salvage, not what the eval shows.
//
// The flags don't need to be perfect (the escalator is the safety net) — but
// the question is how much a wrong flag costs. We report both raw flag
// agreement AND, more importantly, the resulting BASE TIER each flag set
// would produce, because that's what actually determines cost/quality.

import { chat } from './llm.js';
import { createPolicy } from './policy.js';
import { extractJson } from './tasks.js';

// Rubric definitions exactly as SKILL.md describes them. Dispatchers are told
// this is the scoring rubric and asked to apply it to each task.
const RUBRIC = {
  unverifiable: 'There is no mechanical/objective way to check the answer is correct (no test, no ground truth).',
  ambiguous: 'More than one answer is defensible, or the request is under-specified enough that an assumption is required.',
  blast: 'Getting it wrong has high blast radius: irreversible, costly, safety/security-sensitive, money or user data involved.',
  crossCutting: 'The change touches multiple files/components or requires context beyond the single unit of work.',
  novel: 'The task is not a well-known pattern; it requires new design/thinking rather than applying a standard solution.',
  formatStrict: 'The output must match an exact schema/format (structured JSON, specific keys) — free-form output will fail.',
};

const FLAG_DEFS = `FLAG RUBRIC — mark each flag true or false for the task:
${Object.entries(RUBRIC).map(([k, v]) => `- ${k}: ${v}`).join('\n')}`;

const DISPATCH_CONTRACT = `Return ONLY JSON: {"flags": {"unverifiable": <bool>, "ambiguous": <bool>, "blast": <bool>, "crossCutting": <bool>, "novel": <bool>, "formatStrict": <bool>}}.`;

function dispatcherPrompt(task) {
  return `You are the DISPATCHER in a tiered-dispatch pipeline. Decide which flags apply to the following unit of work, then the router assigns a model tier.

TASK: ${task.prompt}

${FLAG_DEFS}

${DISPATCH_CONTRACT}`;
}

/** Ground-truth flags for a task (what the eval harness uses). */
export function groundTruth(task) {
  return task.flags;
}

/** Ask a dispatcher model for flags; parse + booleanize. */
export async function flagTask(model, task) {
  const res = await chat(model, 'You are a precise dispatcher. Follow the output contract exactly.', dispatcherPrompt(task));
  const parsed = extractJson(res.content);
  const raw = parsed?.flags ?? {};
  const flags = {};
  for (const k of Object.keys(RUBRIC)) flags[k] = raw[k] === true;
  return { flags, cost: res.usage.costUsd ?? 0 };
}

/** Compare dispatcher flags to ground truth. Returns agreement + derived tiers. */
export function evaluateFlagging(task, predicted) {
  const truth = groundTruth(task);
  const correct = {};
  let hits = 0;
  for (const k of Object.keys(RUBRIC)) {
    correct[k] = truth[k] === predicted[k];
    if (correct[k]) hits++;
  }
  const flags = Object.keys(RUBRIC).length;
  const policy = createPolicy('probe');
  return {
    agreement: hits / flags,
    perFlag: correct,
    truthTier: policy.baseTier({ ...task, flags: truth }),
    predictedTier: policy.baseTier({ ...task, flags: predicted }),
    tierMatch: policy.baseTier({ ...task, flags: truth }) === policy.baseTier({ ...task, flags: predicted }),
  };
}

/** Run the flagging test across suites with one dispatcher model. */
export async function runFlagTest({ dispatcher, suites, policyVersion = 'probe' }) {
  const policy = createPolicy(policyVersion);
  const tasks = suites.flat();
  const rows = [];
  let totalAgreement = 0;
  let tierMatches = 0;
  let cost = 0;

  for (const task of tasks) {
    const { flags, cost: c } = await flagTask(dispatcher, task);
    const ev = evaluateFlagging(task, flags);
    // Re-derive tier using the requested policy version (evaluateFlagging uses
    // probe by default; recompute for the requested version).
    const truthTier = policy.baseTier(task);
    const predictedTier = policy.baseTier({ ...task, flags });
    ev.tierMatch = truthTier === predictedTier;
    ev.truthTier = truthTier;
    ev.predictedTier = predictedTier;
    rows.push({ id: task.id, category: task.category, ...ev, predicted: flags, cost: c });
    totalAgreement += ev.agreement;
    tierMatches += ev.tierMatch ? 1 : 0;
    cost += c;
  }

  return {
    dispatcher,
    policyVersion,
    n: tasks.length,
    flagAgreement: totalAgreement / tasks.length,
    tierMatchRate: tierMatches / tasks.length,
    cost,
    rows,
  };
}

/** Print a human-readable flagging report. */
export function printFlagReport(result) {
  console.log(`\nFLAGGING RELIABILITY — dispatcher: ${result.dispatcher} (policy ${result.policyVersion})`);
  console.log(`  ${result.n} tasks · flag agreement ${(result.flagAgreement * 100).toFixed(0)}% · tier-match ${(result.tierMatchRate * 100).toFixed(0)}% · dispatcher cost $${result.cost.toFixed(4)}`);
  console.log(`\n  ${'task'.padEnd(26)}${'agree'.padEnd(6)}${'truth→pred'.padEnd(14)}${'tier'}`);
  const flagLabels = Object.keys(RUBRIC);
  for (const r of result.rows) {
    const wrong = flagLabels.filter((k) => !r.perFlag[k]);
    const agree = `${Math.round(r.agreement * 100)}%`;
    const tier = r.tierMatch ? '✓' : `✗ ${r.truthTier}→${r.predictedTier}`;
    const w = wrong.length ? ` [${wrong.join(',')}]` : '';
    console.log(`  ${r.id.padEnd(26)}${agree.padEnd(6)}${tier.padEnd(6)}${w}`);
  }
  // Per-flag breakdown
  console.log(`\n  per-flag agreement:`);
  for (const k of flagLabels) {
    const hits = result.rows.filter((r) => r.perFlag[k]).length;
    console.log(`    ${k.padEnd(14)} ${Math.round((hits / result.n) * 100)}% (${hits}/${result.n})`);
  }
  console.log('');
}
