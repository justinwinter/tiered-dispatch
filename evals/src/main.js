// Eval harness entrypoint.
//   node src/main.js                          full run (all vendors, all arms, 5 seeds)
//   node src/main.js --smoke                  small: 1 seed, cheap tiers only
//   node src/main.js --verify-only            check model slugs resolve
//   node src/main.js --mock                   run with the mock LLM (no key, plumbing check)

import { VENDORS, ARMS, DEFAULT_SEEDS, TIER_ORDER } from './config.js';
import { hasKey, verifyModels, chat } from './llm.js';
import { runSuite, makeAttempter, mockAttempter, mockApex } from './runner.js';
import { createPolicy } from './policy.js';
import { codeSuite } from './suites/code.js';
import { reasoningSuite } from './suites/reasoning.js';
import { mechanicalSuite } from './suites/mechanical.js';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const SUITES = { code: codeSuite, reasoning: reasoningSuite, mechanical: mechanicalSuite };
const RESULTS_DIR = path.join(import.meta.dirname, '..', 'results');

function parseArgs(argv) {
  const a = { smoke: false, verifyOnly: false, mock: false, seeds: null, vendors: null, arms: null, suites: null, policy: 'latest', compare: null, baseline: null };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--smoke': a.smoke = true; break;
      case '--verify-only': a.verifyOnly = true; break;
      case '--mock': a.mock = true; break;
      case '--seeds': a.seeds = Number(argv[++i]); break;
      case '--vendors': a.vendors = argv[++i].split(','); break;
      case '--arms': a.arms = argv[++i].split(','); break;
      case '--suites': a.suites = argv[++i].split(','); break;
      case '--concurrency': a.concurrency = Number(argv[++i]); break;
      case '--policy': a.policy = argv[++i]; break;
      case '--compare': a.compare = argv[++i]; break;
      case '--baseline': a.baseline = argv[++i]; break;
    }
  }
  return a;
}

function loadResults(file) {
  const p = file.includes(path.sep) ? file : path.join(RESULTS_DIR, file);
  if (!existsSync(p)) throw new Error(`results file not found: ${p}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

function saveResults(results, meta) {
  mkdirSync(RESULTS_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(RESULTS_DIR, `run-${meta.policy}-${meta.vendors.join('-')}-${meta.arms.join('-')}-${ts}.json`);
  writeFileSync(file, JSON.stringify({ meta, results }, null, 2));
  console.log(`\n💾 saved: ${file}`);
  return file;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // --compare: load two saved runs and print a side-by-side summary.
  if (args.compare) {
    const [a, b] = args.compare.split(',').map((f) => loadResults(f.trim()));
    printComparison(a, b);
    return;
  }

  if (args.verifyOnly) {
    const { report, missing } = await verifyModels();
    console.log('\nModel slug verification:');
    for (const [key, v] of Object.entries(report)) {
      console.log(`  ${v.available ? '✓' : '✗'} ${key.padEnd(18)} ${v.slug}`);
    }
    if (missing.length) {
      console.log('\nMISSING — fix these in src/config.js:');
      for (const m of missing) console.log(`  ${m}`);
      process.exitCode = 1;
    } else {
      console.log('\nAll slugs resolve.');
    }
    return;
  }

  if (!args.mock && !hasKey()) {
    console.error('Set OPENROUTER_API_KEY first, or use --mock to validate plumbing.');
    process.exit(1);
  }

  if (!args.mock) {
    const { missing } = await verifyModels();
    if (missing.length) {
      console.warn(`⚠ ${missing.length} model slugs may not resolve on OpenRouter. Run --verify-only.`);
    }
  }

  const vendors = args.vendors ? args.vendors : Object.keys(VENDORS);
  const arms = args.arms ? args.arms : Object.keys(ARMS);
  const suites = args.suites ? args.suites : Object.keys(SUITES);
  const seeds = args.smoke ? 1 : args.seeds ?? DEFAULT_SEEDS;

  // Smoke test = plumbing proof, not results. 1 seed, 1 vendor, 1 suite,
  // no frontier arm (frontier reasoning models are minutes-per-call).
  const smokeVendor = 'anthropic';
  const smokeArms = ['all-standard', 'tiered'];
  const smokeSuite = 'code';
  const smokeVendors = args.smoke && !args.vendors ? [smokeVendor] : vendors;
  const smokeArmsFinal = args.smoke && !args.arms ? smokeArms : arms;
  const smokeSuites = args.smoke && !args.suites ? [smokeSuite] : suites;

  console.log(`\nTiered-dispatch eval run`);
  console.log(`  mode:      ${args.mock ? 'MOCK (no spend)' : 'LIVE (OpenRouter)'}`);
  console.log(`  policy:    ${args.policy}`);
  console.log(`  vendors:   ${smokeVendors.join(', ')}`);
  console.log(`  arms:      ${smokeArmsFinal.join(', ')}`);
  console.log(`  suites:    ${smokeSuites.join(', ')}`);
  console.log(`  seeds:     ${seeds}`);

  const policy = createPolicy(args.policy);

  // --baseline: reuse a previously saved all-standard run instead of
  // re-running it (it never changes between policy versions).
  let savedStandard = null;
  if (args.baseline) savedStandard = loadResults(args.baseline);

  const results = {};
  for (const vendor of smokeVendors) {
    results[vendor] = {};
    for (const arm of smokeArmsFinal) {
      if (arm === 'all-standard' && savedStandard) {
        // Reuse the baseline: copy the saved units for matching vendor/suites.
        results[vendor][arm] = {};
        for (const suite of smokeSuites) {
          results[vendor][arm][suite] = savedStandard.results?.[vendor]?.[arm]?.[suite] ?? [];
        }
        console.log(`  ♻ reused all-standard baseline for ${vendor} (${smokeSuites.join(', ')})`);
        continue;
      }
      results[vendor][arm] = {};
      for (const suite of smokeSuites) {
        const attempt = args.mock
          ? mockAttempter()
          : makeAttempter({ model: VENDORS[vendor], runMeta: { temperature: 0.2 }, policy });
        const apexChat = args.mock
          ? mockApex((id) => {
              const t = SUITES[suite].find((x) => x.id === id);
              return t ? t.answerKey : null;
            })
          : chat;
        const units = await runSuite({
          arm, vendor, suite: SUITES[suite], attempt,
          apexChat,
          apexModel: VENDORS[vendor].tiers.apex,
          seeds,
          concurrency: args.concurrency ?? 8,
          policy,
        });
        results[vendor][arm][suite] = units;
      }
    }
  }

  printReport(results, { vendors: smokeVendors, arms: smokeArmsFinal, suites: smokeSuites, seeds, mock: args.mock, policyVersion: args.policy });

  if (!args.mock) {
    saveResults(results, {
      policy: args.policy,
      vendors: smokeVendors,
      arms: smokeArmsFinal,
      suites: smokeSuites,
      seeds,
      mode: 'live',
      generated: new Date().toISOString(),
    });
  }
}

function printReport(results, { vendors, arms, suites, seeds, mock, policyVersion = 'latest' }) {
  console.log('\n' + '='.repeat(72));
  console.log(`RESULTS (policy ${policyVersion})`);
  console.log('='.repeat(72));

  for (const vendor of vendors) {
    for (const suite of suites) {
      console.log(`\n── ${vendor} / ${suite} ──`);
      console.log(`${'arm'.padEnd(14)}${'pass'.padEnd(8)}${'cost$'.padEnd(10)}${'$/pass'.padEnd(10)}${'tokens'.padEnd(10)}${'esc%'.padEnd(6)}apex`);
      for (const arm of arms) {
        const units = results[vendor][arm][suite];
        const n = units.length;
        const passes = units.filter((u) => u.passed).length;
        const cost = units.reduce((s, u) => s + u.cost, 0);
        const tok = units.reduce((s, u) => s + u.tokensIn + u.tokensOut, 0);
        const esc = units.filter((u) => u.escalated).length;
        const apex = units.filter((u) => u.apexResolved).length;
        const perPass = passes ? (cost / passes).toFixed(4) : '∞';
        console.log(
          `${arm.padEnd(14)}${`${passes}/${n}`.padEnd(8)}${cost.toFixed(4).padEnd(10)}${perPass.padEnd(10)}${String(tok).padEnd(10)}${`${((esc / n) * 100).toFixed(0)}%`.padEnd(6)}${apex}`
        );
      }
    }
  }

  // Fail-set overlap: which unit/task FAILED per arm, so we can see whether
  // tiered fails the SAME units as the frontier baseline (quality parity) or
  // different ones (quality divergence). Across multiple seeds, report the
  // set of tasks that ever failed in any seed.
  if (arms.includes('all-frontier')) {
    for (const vendor of vendors) {
      for (const suite of suites) {
        const failByArm = {};
        for (const arm of arms) {
          const units = results[vendor][arm][suite];
          const failed = new Set();
          for (const u of units) if (!u.passed) failed.add(u.id);
          failByArm[arm] = failed;
        }
        const any = new Set(Object.values(failByArm).flatMap((s) => [...s]));
        if (!any.size) continue;
        console.log(`\n${vendor} / ${suite} — FAILED TASKS (any seed)`);
        for (const id of [...any].sort()) {
          const who = arms.map((arm) => `${arm}:${failByArm[arm].has(id) ? '✗' : '✓'}`).join('  ');
          console.log(`  ${id.padEnd(30)} ${who}`);
        }
        if (failByArm['all-frontier'] && failByArm['tiered']) {
          const f = failByArm['all-frontier'];
          const t = failByArm['tiered'];
          const missing = [...t].filter((id) => !f.has(id));
          if (missing.length) {
            console.log(`  ⚠ tiered failed ${missing.length} task(s) the frontier baseline PASSED in every seed: ${missing.join(', ')}`);
          }
        }
      }
    }
  }

  console.log(`\n${mock ? 'MOCK' : 'LIVE'} · ${seeds} seed(s) · ${new Date().toISOString()}`);
}

/**
 * Side-by-side summary of two saved runs (e.g. --compare v1run.json,latestrun.json).
 * Shows pass, cost, and $/pass deltas per vendor/arm/suite so policy versions
 * can be compared without re-running.
 */
function printComparison(a, b) {
  console.log(`\nCOMPARING: ${a.meta.policy}  (${a.meta.generated})`);
  console.log(`        vs: ${b.meta.policy}  (${b.meta.generated})`);
  const vendors = [...new Set([...Object.keys(a.results), ...Object.keys(b.results)])];
  const arms = [...new Set([...Object.keys(ARMS), ...Object.keys(a.results[vendors[0]] ?? {}), ...Object.keys(b.results[vendors[0]] ?? {})])];
  for (const vendor of vendors) {
    for (const suite of Object.keys(SUITES)) {
      const rows = [];
      for (const arm of arms) {
        const ua = a.results?.[vendor]?.[arm]?.[suite];
        const ub = b.results?.[vendor]?.[arm]?.[suite];
        if (!ua && !ub) continue;
        const sum = (units) => {
          if (!units?.length) return { n: 0, pass: 0, cost: 0, tok: 0 };
          return {
            n: units.length,
            pass: units.filter((u) => u.passed).length,
            cost: units.reduce((s, u) => s + u.cost, 0),
            tok: units.reduce((s, u) => s + u.tokensIn + u.tokensOut, 0),
          };
        };
        const sa = sum(ua);
        const sb = sum(ub);
        const dPass = sb.pass - sa.pass;
        const dCost = sb.cost - sa.cost;
        const pct = sa.cost > 0 ? ((sb.cost - sa.cost) / sa.cost) * 100 : 0;
        rows.push({
          arm,
          a: sa,
          b: sb,
          dPass,
          dCost,
          delta: `${dPass > 0 ? '+' : ''}${dPass} pass, cost ${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`,
        });
      }
      if (!rows.length) continue;
      console.log(`\n${vendor} / ${suite}`);
      console.log(`${'arm'.padEnd(14)}${'A: pass/cost$'.padEnd(20)}${'B: pass/cost$'.padEnd(20)}delta`);
      for (const r of rows) {
        console.log(
          `${r.arm.padEnd(14)}${`${r.a.pass}/${r.a.n} ${r.a.cost.toFixed(4)}`.padEnd(20)}${`${r.b.pass}/${r.b.n} ${r.b.cost.toFixed(4)}`.padEnd(20)}${r.delta}`
        );
      }
    }
  }
}

main().catch((e) => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});