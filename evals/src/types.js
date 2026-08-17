// Shared types for the tiered-dispatch eval harness.

/** A single unit of work handed to a model. */
export const UNIT_SCHEMA = {
  item: 'string',
  attempted_tier: 'string',
  attempts: 'array',
  uncertainty_reason: 'string|null',
  decision_needed: 'string',
  context_refs: 'array',
};

/** Worker output contract — mirrors SKILL.md worker prompt template. */
export const WORKER_CONTRACT = `
OUTPUT CONTRACT:
- Return raw structured data per the schema below, no prose wrapper.
- Tag EVERY item: "status": "grounded" or "status": "uncertain", reason: <one line — what fact or rule is missing>.
- Tag "uncertain" whenever two answers seem defensible, an assumption was required, or source data conflicted.
- Do NOT resolve uncertainty by guessing. Flag and move on.
- Return ONLY valid JSON matching: {"status": "grounded"|"uncertain", "reason": "<string|null>", "answer": <your answer>}
`;

/** One deterministic check a task output must pass. */
export const VERDICT = {
  pass: 'boolean',
  reason: 'string',
};