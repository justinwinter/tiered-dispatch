// Public benchmark loaders — pull recognized, MIT-licensed tasks from
// HuggingFace into the harness's task format so results use uncontested,
// third-party test cases (not our own graders).

// GSM8K: grade-school math reasoning. Each answer is a sentence ending in a
// number; we exact-match on that final number. MIT licensed, ungated.
// https://huggingface.co/datasets/openai/gsm8k

import { makeTask, gradeExact } from './tasks.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileP = promisify(execFile);
const PY_TIMEOUT_MS = 8000;

const HF_ROWS = (ds, config, split, offset, length) =>
  `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(ds)}&config=${config}&split=${split}&offset=${offset}&length=${length}`;

/** Extract the final integer answer from a GSM8K answer sentence. */
export function gsm8kFinalNumber(answer) {
  const m = String(answer ?? '').match(/(-?\d+(?:\.\d+)?)\s*$/);
  return m ? m[1] : null;
}

/** Fetch `n` GSM8K test tasks, returning our harness task format. */
export async function loadGsm8k(n = 50) {
  const res = await fetch(HF_ROWS('openai/gsm8k', 'main', 'test', 0, n));
  if (!res.ok) throw new Error(`GSM8K fetch HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`GSM8K: ${data.error}`);
  const tasks = [];
  for (let i = 0; i < data.rows.length; i++) {
    const { question, answer } = data.rows[i].row;
    const final = gsm8kFinalNumber(answer);
    if (final === null) continue; // skip unparseable
    tasks.push(
      makeTask({
        id: `gsm8k:${i}`,
        category: 'reasoning',
        prompt: `Solve this math word problem and answer with only the final number. ${question}`,
        flags: { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
        answerKey: final,
        grader: (a) => gradeExact(a, final),
      })
    );
  }
  return tasks;
}

/**
 * Grade a Python solution against HumanEval's OFFICIAL test cases.
 * The solution is the model's generated function; we append the benchmark's
 * `test` code and run it under python3 with a strict timeout. Pass = the
 * official assertions all hold.
 *
 * SECURITY: this executes arbitrary Python in a subprocess. HumanEval problems
 * are trusted benchmark code with no network access; acceptable for eval, but
 * never point this at untrusted input.
 */
export async function gradePython(solution, testCode, entryPoint) {
  if (typeof solution !== 'string' || !solution.trim()) {
    return { pass: false, reason: 'no code returned' };
  }
  const script = `${solution}\n\n# --- official test cases ---\n${testCode}\n`;
  try {
    const { stdout } = await execFileP('python3', ['-c', script], {
      timeout: PY_TIMEOUT_MS,
      maxBuffer: 4 * 1024 * 1024,
    });
    return { pass: true, reason: 'official tests passed', stdout };
  } catch (e) {
    const reason = e.code === 'ETIMEDOUT' || e.killed
      ? 'timeout'
      : String(e.stderr || e.message).slice(0, 160).replace(/\n/g, ' ');
    return { pass: false, reason };
  }
}

/** Fetch `n` HumanEval test tasks (Python). */
export async function loadHumanEval(n = 20) {
  const res = await fetch(HF_ROWS('openai/openai_humaneval', 'openai_humaneval', 'test', 0, n));
  if (!res.ok) throw new Error(`HumanEval fetch HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`HumanEval: ${data.error}`);
  const tasks = [];
  for (let i = 0; i < data.rows.length; i++) {
    const { task_id, prompt, test, entry_point } = data.rows[i].row;
    tasks.push(
      makeTask({
        id: `humaneval:${i}`,
        category: 'code',
        prompt: `Complete the following Python function. Return the raw Python source code for the function only, no explanation, no markdown fences. The function will be tested with the official hidden test cases.\n\n${prompt}`,
        flags: { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false },
        answerKey: entry_point,
        grader: async (answer) => gradePython(answer, test, entry_point),
      })
    );
  }
  return tasks;
}
