# Tier → model mapping

Updated when a model beats the incumbent on the reference benchmarks (see
README roadmap). Last updated: 2026-08-15.

| Tier | Claude Code | Codex | Cursor / other |
|---|---|---|---|
| cheap | claude-haiku-4-5 | gpt-5-mini-class | cheapest available |
| standard | claude-sonnet-5 | gpt-5-class mid tier | mid-tier default model |
| frontier | claude-opus-5 | gpt-5.6-class high tier | highest-reasoning production tier |
| apex | claude-fable-5 | provider max-reasoning tier | provider max-reasoning tier |

## Notes

- These mappings are the maintainer's judgment, anchored to public benchmarks:
  **SWE-bench Verified** for coding-execution tiers (cheap/standard/frontier),
  and a general reasoning index for judgment tiers (frontier/apex).
- Exact non-Claude model IDs change fast. If a listed ID is stale by the time
  you read this, use your agent's closest current equivalent at that tier
  rather than waiting for an update here.
- A tier's model changes when a new release beats the current incumbent on
  the reference benchmarks for that tier — see the README roadmap for how
  updates ship.
