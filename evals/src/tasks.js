// Task suite framework. Each task carries its own deterministic grader.
// Graders are mechanical (exec, exact-match, schema) — never an LLM judging.

import vm from 'node:vm';

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} category   'code' | 'reasoning' | 'mechanical'
 * @property {string} prompt     the instruction given to the worker
 * @property {Object} flags      rubric flags {unverifiable, ambiguous, blast, crossCutting, novel}
 * @property {string} answerKey  ground-truth answer (for reasoning/mechanical)
 * @property {Function} grader   (answer) => {pass:boolean, reason:string}
 */

export function makeTask({ id, category, prompt, flags, answerKey, grader }) {
  return {
    id,
    category,
    prompt,
    flags: {
      unverifiable: false,
      ambiguous: false,
      blast: false,
      crossCutting: false,
      novel: false,
      formatStrict: false,
      ...flags,
    },
    answerKey,
    grader,
  };
}

/** Parse a worker's JSON answer from an LLM response, tolerating prose. */
export function extractJson(text) {
  if (!text) return null;
  const stripped = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    const firstBrace = stripped.indexOf('{');
    const lastBrace = stripped.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Execute a JS solution body against test cases in a sandboxed vm.
 * solution: `function ... { ... }` body. testCases: [{input, expected}].
 * expected may be a value (deep-equality) or a RegExp for string matches.
 */
export function gradeCode(solution, testCases) {
  if (typeof solution !== 'string' || solution.trim().length === 0) {
    return { pass: false, reason: 'no code returned' };
  }
  const source = `(function(){\n${solution}\nreturn typeof main === 'function' ? main : (typeof run === 'function' ? run : null);})()`;
  let fn;
  try {
    const sandbox = { Math, JSON, Array, Object, String, Number, Boolean, Date, RegExp, parseInt, parseFloat, isNaN, isFinite };
    vm.createContext(sandbox);
    fn = vm.runInContext(source, sandbox, { timeout: 3000 });
  } catch (e) {
    return { pass: false, reason: `parse error: ${e.message}` };
  }
  if (typeof fn !== 'function') return { pass: false, reason: 'no callable main/run exported' };
  let passed = 0;
  for (const tc of testCases) {
    let got;
    try {
      got = fn(...tc.input);
    } catch (e) {
      return { pass: false, reason: `threw on ${JSON.stringify(tc.input)}: ${e.message}` };
    }
    if (tc.expected instanceof RegExp) {
      if (!tc.expected.test(String(got))) return { pass: false, reason: `expected ~${tc.expected} got ${JSON.stringify(got)}` };
    } else if (JSON.stringify(got) !== JSON.stringify(tc.expected)) {
      return { pass: false, reason: `expected ${JSON.stringify(tc.expected)} got ${JSON.stringify(got)}` };
    }
    passed++;
  }
  return { pass: passed === testCases.length, reason: `${passed}/${testCases.length} cases passed` };
}

/** Exact-match grader for reasoning tasks (normalized, case-insensitive). */
export function gradeExact(answer, answerKey) {
  const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  return { pass: norm(answer) === norm(answerKey), reason: `expected "${answerKey}" got "${answer}"` };
}

/** Schema/JSON grader for mechanical tasks — every expected key must match. */
export function gradeJsonSubset(answer, answerKey) {
  let parsed = typeof answer === 'string' ? extractJson(answer) : answer;
  if (!parsed) return { pass: false, reason: 'non-JSON output' };
  for (const [k, v] of Object.entries(answerKey)) {
    if (!(k in parsed)) return { pass: false, reason: `missing key "${k}"` };
    if (JSON.stringify(parsed[k]) !== JSON.stringify(v)) {
      return { pass: false, reason: `key "${k}" expected ${JSON.stringify(v)} got ${JSON.stringify(parsed[k])}` };
    }
  }
  return { pass: true, reason: 'all keys matched' };
}