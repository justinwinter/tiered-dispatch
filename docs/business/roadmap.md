# Product roadmap — Undercut

> Working plan for agent threads. Re-read before starting work; priorities
> move. Last updated: 2026-08-18. Legend: [x] done · [→] in progress · [ ]
> next.

## Shipped (v0.2.0, 2026-08-18)

- [x] Skill (SKILL.md + models.md, MIT, skills.sh)
- [x] Eval harness (evals/) — vendor-constant, deterministic, seeded
- [x] probe policy (model-agnostic routing)
- [x] Public benchmark validation (GSM8K, HumanEval) + raw results
- [x] Landing page (getundercut.sh) + canonical domain
- [x] CI, CONTRIBUTING, issue/PR templates, trust backlog
- [x] GitHub org (undercutsh), repo rename (firstpass), v0.2.0 release

## Next (priority order)

### Launch-blocking (Teams ships at launch)

- [ ] **Build the Teams tier** — the launch product: org-wide routing policy
      enforcement, per-account savings metering, verifiable escalation
      ledger, SSO/directory sync. Self-serve pricing.
- [ ] **Enterprise = contact-only** — on-prem/self-hosted option, SOC 2 path,
      data residency, dedicated support. No public pricing; sales-led.
- [ ] **Teams landing section** — finalize the "For teams" section as the
      launch offering (currently the product backlog; see
      `site/index.html` + `docs/marketing/landing-copy.md`).
- [ ] **Pricing page / contact flow** — self-serve Teams pricing + Enterprise
      contact form at launch.

### Trust & rigor (foundation for the paid ask)

- [ ] **Independent replication** — invite a third party (well-known dev /
      agent builder / eval firm) to re-run `evals/` and publish results.
      Highest-value trust unlock; precondition for enterprise deals.
- [ ] **Confidence intervals** — bump seeds (5 → 10–20) on the headline
      benchmark cells so claims carry CIs ("−71% ± 5%").
- [ ] **Public-task swap** — run a subset of the suites on widely-recognized
      task sets (MBPP or a standard code set) so reviewers don't depend only
      on our synthetic graders.
- [ ] **Real-world case study** — one production workload with before/after
      token cost + pass trace, published with receipts.

### Growth

- [ ] **Companion pages** — integration pages (per-agent) first; comparison
      and use-case pages after there's search/referral data. See
      `docs/marketing/landing-copy.md` §14.

## Stretch / evaluate later

- [ ] Status page (when there's a hosted service to status).
- [ ] GitHub-stars chip in footer (when stars are meaningful).
- [ ] Accessibility statement (after a real WCAG 2.1 AA audit).
- [ ] New eval categories (refactor, debug suites) after the mechanism is
      proven on real work — not before.

## Explicitly not on the roadmap

- Custom flagging/classification model (measured unnecessary — stock
  dispatchers hit 100% tier-match under probe).
- Proxy / network-layer enforcement (composes with gateways instead).
- Industry-specific pages (no vertical segmentation in this ICP).

## Where the roadmap lives

- This file is the working plan.
- `testing/trust-backlog.md` = trust signals (earn-then-add).
- `docs/business/PRD.md` = what/why/who.
- `docs/business/business-model.md` = how it makes money (free wedge + paid Teams/Enterprise at launch).