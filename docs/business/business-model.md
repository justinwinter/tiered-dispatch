# Business model — Undercut

> Model: **free MIT skill (wedge) + paid Teams/Enterprise tiers shipping at
> launch.** Enterprise is contact-only. Last updated: 2026-08-18.

## The model

Three tiers, deliberately layered:

| Tier | What it is | How you buy it |
|---|---|---|
| **Free / OSS** | The MIT skill (`npx skills add undercutsh/firstpass`) — the wedge. Sells itself on published, reproducible benchmark data. | Self-serve, free forever |
| **Teams** | Org-wide routing policy enforcement, per-account savings metering, verifiable escalation ledger, SSO/directory sync. Ships **at launch**. | Self-serve — **$29 / user / mo**, 14-day trial at launch |
| **Enterprise** | Everything in Teams + on-prem/self-hosted option, compliance (SOC 2 path, data residency), dedicated support, custom integrations. | **Contact-only** (no public pricing) |

**Teams pricing — $29/user/mo, 14-day trial at launch.** Set by the product
owner (Justin) in conversation 2026-08-18; recorded here so site copy and
docs agree. This is the decision of record. See the Decisions log below for
the entry. Numbers flow **human → docs → site**; if site copy shows a number
docs lacks, backfill docs — don't assume the site is wrong.

**The wedge is free and stays free.** The MIT skill's credibility is its
measured benchmark data; charging for the skill itself would fight that. The
paid tiers sit *above* the skill — they govern and operationalize it for
teams, which is where the finance/ops pain lives.

## Why Teams ships at launch

- The landing page's "For teams" section is the **product backlog** — the
  launch offering, not a distant idea. Build it as a first-class launch
  tier.
- A team can't rely on every dev opting into the free skill; enforcement,
  metering, and an audit ledger are the actual enterprise need and the
  natural paid layer.
- Contact-only Enterprise keeps launch simple (no pricing page to maintain,
  sales-led for the biggest deals) while Teams carries the self-serve revenue.

## Pre-launch status (we are building)

- Nothing is live/shipping revenue yet. The site and docs describe the
  **launch target**.
- The "For teams" section and this model are the backlog we're building
  toward. Treat them as committed direction, not aspirational marketing.

## What creates leverage (in order)

1. **Adoption + stars** on the free skill — credibility spreads it.
2. **Independent replication** — a third party re-running the harness is the
   single biggest trust unlock and the precondition for enterprise deals.
3. **Enterprise validation** — a real team in production with published
   before/after token cost.

## Explicitly not the model

- No per-seat tax on the MIT skill itself.
- No "freemium" that gates core routing features.
- No data resale, no telemetry phone-home (the site sets no cookies).

## Decisions log

| Date | Decision | Source |
|---|---|---|
| 2026-08-18 | Teams = **$29/user/mo**, 14-day trial at launch | Owner (Justin) in conversation; recorded here as decision of record |

## Reference

- PRD: `docs/business/PRD.md`
- Roadmap (Teams is a launch-blocking item): `docs/business/roadmap.md`
- Trust backlog (earn-then-add): `testing/trust-backlog.md`
- Landing copy (has the finance/ops positioning):
  `docs/marketing/landing-copy.md`