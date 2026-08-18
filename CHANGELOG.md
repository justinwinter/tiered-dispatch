# Changelog

All notable changes to tiered-dispatch are documented here. Follows
[Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Controlled A/B eval harness (`evals/`) — vendor-constant, deterministic
  graders, seeded, persistable results, policy versioning, flagging-reliability
  test.
- `RESULTS.md` — methodology + full 4-vendor evaluation write-up.
- **probe policy**: FORMAT-STRICT work starts cheap (model-agnostic) and caps
  at standard. Replaces the vendor-specific "format → standard" rule.

### Changed

- SKILL.md: FORMAT-STRICT added as 6th rubric flag; ladder cap for
  format-strict work at standard; documented "flags steer, verification +
  escalation decide" property.

## [0.1.0] - 2026-08-15

Initial public release.

### Added

- Tiered Dispatch skill (`skills/tiered-dispatch/SKILL.md`): rubric-based base
  tier assignment (cheap → standard → frontier → apex), objective escalation
  triggers (verification failure ×2, low-tier disagreement, uncertainty flags),
  hysteresis rules, residue-only escalation with a structured handoff payload,
  verification patterns, and an end-of-run calibration loop.
- Model-agnostic tier naming with `models.md` mapping tiers to concrete model
  IDs per agent (Claude Code, Codex, Cursor/other).
- README documenting the generator–verifier gap, install via skills.sh, prior
  art, and the benchmark-triggered mapping roadmap.

[unreleased]: https://github.com/justinwinter/tiered-dispatch/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/justinwinter/tiered-dispatch/releases/tag/v0.1.0
