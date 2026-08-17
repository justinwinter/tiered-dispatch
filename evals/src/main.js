// Eval harness entrypoint.
//   node src/main.js                          full run (all vendors, all arms, 5 seeds)
//   node src/main.js --smoke                  small: 1 seed, cheap tiers only
//   node src/main.js --verify-only            check model slugs resolve
//   node src/main.js --mock                   run with the mock LLM (no key, plumbing check)

import { VENDORS, ARMS, DEFAULT_SEEDS, TIER_ORDER } from './config.js';
import { hasKey, verifyModels, chat } from './llm.js';
import { runSuite, makeAttempter, mockAttempter, mockApex } from './runner.js';
import { codeSuite } from './suites/code.js';
import { reasoningSuite } from './suites/reasoning.js';
import { mechanicalSuite } from './suites/mechanical.js';

const SUITES = { code: codeSuite, reasoning: reasoningSuite, mechanical: mechanicalSuite };

function parseArgs(argv) {
  const a = { smoke: false, verifyOnly: false, mock: false, seeds: null, vendors: null, arms: null, suites: null };
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
    }
  }
  return a;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

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
  console.log(`  vendors:   ${smokeVendors.join(', ')}`);
  console.log(`  arms:      ${smokeArmsFinal.join(', ')}`);
  console.log(`  suites:    ${smokeSuites.join(', ')}`);
  console.log(`  seeds:     ${seeds}`);

  const results = {};
  for (const vendor of smokeVendors) {
    results[vendor] = {};
    for (const arm of smokeArmsFinal) {
      results[vendor][arm] = {};
      for (const suite of smokeSuites) {
        const attempt = args.mock
          ? mockAttempter()
          : makeAttempter({ model: VENDORS[vendor], runMeta: { temperature: 0.2 } });
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
        });
        results[vendor][arm][suite] = units;
      }
    }
  }

  printReport(results, { vendors: smokeVendors, arms: smokeArmsFinal, suites: smokeSuites, seeds, mock: args.mock });
}

function printReport(results, { vendors, arms, suites, seeds, mock }) {
  console.log('\n' + '='.repeat(72));
  console.log('RESULTS');
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

  console.log(`\n${mock ? 'MOCK' : 'LIVE'} · ${seeds} seed(s) · ${new Date().toISOString()}`);
}

main().catch((e) => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});