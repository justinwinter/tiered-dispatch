// Mechanical task suite — deterministic JSON schema graders.
// This is the skill's sweet spot: cheap-verifiable, batch-able classification /
// extraction with gold labels.

import { makeTask, gradeJsonSubset } from '../tasks.js';

const T = (id, prompt, flags, answerKey) =>
  makeTask({
    id: `mechanical:${id}`,
    category: 'mechanical',
    prompt,
    flags,
    answerKey,
    grader: (answer) => gradeJsonSubset(answer, answerKey),
  });

export const mechanicalSuite = [
  T(
    'classify-files',
    'Classify each of these file paths as "source", "build", or "asset": src/main.ts, dist/app.js, node_modules/lodash/index.js, public/logo.png, src/utils/format.ts, .next/server.js, assets/hero.webp. Return JSON: {"build": [paths], "source": [paths], "asset": [paths]}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    {
      build: ['dist/app.js', 'node_modules/lodash/index.js', '.next/server.js'],
      source: ['src/main.ts', 'src/utils/format.ts'],
      asset: ['public/logo.png', 'assets/hero.webp'],
    },
  ),
  T(
    'extract-emails',
    'From these contact records — "Ada Lovelace <ada@example.com>", "Grace Hopper <grace@hopper.io>", "Alan Turing <alan@turing.tech>" — extract each email to name mapping. Return JSON: {"email": "name"} pairs.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { 'ada@example.com': 'Ada Lovelace', 'grace@hopper.io': 'Grace Hopper', 'alan@turing.tech': 'Alan Turing' },
  ),
  T(
    'semver-sort',
    'Sort these version strings ascending (standard semver order): "10.0.0", "1.0.0", "1.2.0", "2.0.0", "1.0.1". Return JSON: {"sorted": [...]}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { sorted: ['1.0.0', '1.0.1', '1.2.0', '2.0.0', '10.0.0'] },
  ),
  T(
    'sizes',
    'Convert each size to bytes. Return JSON: {"10KB": 10240, "2MB": 2097152, "512B": 512}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { '10KB': 10240, '2MB': 2097152, '512B': 512 },
  ),
  T(
    'zones',
    'Map each port to its zone: 80, 443 → web; 22 → ssh; 5432 → db. Return JSON: {"80": "web", "443": "web", "22": "ssh", "5432": "db"}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { '80': 'web', '443': 'web', '22': 'ssh', '5432': 'db' },
  ),
  T(
    'parse-csv',
    'Parse this CSV (header + two rows) and return JSON: {"headers": [...], "rows": [[...], [...]]}. CSV: "name,age\nAda,36\nGrace,85".',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    {
      headers: ['name', 'age'],
      rows: [['Ada', '36'], ['Grace', '85']],
    },
  ),
  T(
    'route-methods',
    'Classify each HTTP method as "safe" (no state change) or "unsafe". The methods are: GET, HEAD, OPTIONS, TRACE, POST, PUT, DELETE, PATCH. Return JSON: {"safe": [...], "unsafe": [...]}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { safe: ['GET', 'HEAD', 'OPTIONS', 'TRACE'], unsafe: ['POST', 'PUT', 'DELETE', 'PATCH'] },
  ),
  T(
    'json-flatten-keys',
    'Return JSON: {"keys": [every key at every nesting level, in any order]}. Object: {"a": 1, "b": {"c": 2, "d": {"e": 3}}}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { keys: ['a', 'b', 'c', 'd', 'e'] },
  ),
  T(
    'status-map',
    'Map each HTTP status code to its standard reason phrase. Return JSON: {"200": "OK", "404": "Not Found", "500": "Internal Server Error"}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { '200': 'OK', '404': 'Not Found', '500': 'Internal Server Error' },
  ),
  T(
    'config-lines',
    'From this config file — "host: localhost\\nport: 8080\\nenabled: true" — extract the "host" and "port" values. Return JSON: {"host": "...", "port": <number>}.',
    { unverifiable: false, ambiguous: false, blast: false, crossCutting: false, novel: false, formatStrict: true },
    { host: 'localhost', port: 8080 },
  ),
];