# Changelog

All notable changes to tiered-dispatch are documented here. Follows
[Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## [Unreleased]

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
