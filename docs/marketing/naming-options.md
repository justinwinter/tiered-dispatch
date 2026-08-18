# tiered-dispatch — Naming Options
**DECISION: Undercut ✓ — selected. Copy doc and design notes updated to match. Kept below as the rationale record.**

**v2 note:** Ran against the Direct Response Canon's Ogilvy test ("could this headline run on a competitor's ad?") as part of the copy doc's full pre-ship audit — passes. "Undercut the top-tier model. Never the quality bar." is load-bearing on the brand name itself; no competitor can run that exact line without it identifying this product. No change to the name itself from the v2 pass.

Note on scope: "tiered-dispatch" can stay as the GitHub repo slug / npx install path even if you pick a different brand name for the page — plenty of tools do this (the install command doesn't have to match the marketing name 1:1). If you want the repo renamed to match, flag it and I'll fold that into the update — worth doing now, before wider distribution, not after.

Quick conflict-check method: ran each finalist through a live search for existing devtool/GitHub/product collisions. This is a sanity check, not a trademark search — do a proper USPTO/domain check on whichever one you pick before committing spend to it.

---

## Selected: Undercut

Chosen for being more benefits-based than the mechanism-first alternatives — it sells in one word on a GitHub trending page or a forwarded link, which matters given the page now has to work for three different readers (engineering, finance/ops, non-technical product) rather than just the technical one. See the copy doc and design notes for the full build-out.

---

## Other finalists (kept for the record)

### 1. Residue
**Tagline:** The residue is the only thing that escalates.
**Alt tagline:** Route cheap. Escalate the residue. Never the batch.

**Why it fits:** "Residue-only escalation" is already the mechanism's own name in your source material — this isn't a metaphor bolted on after the fact, it's the literal term your own docs use for the thing that makes the escalation ladder cheap (§2.2: "the higher tier receives ONLY failed/uncertain items"). Naming the product after its own core mechanic means the brand name teaches the product on first read, and a technical reader who already knows the term "residue" from queueing/systems work will recognize it as precise, not cute.

**Conflict check:** Clean. No existing devtool, routing, or AI-agent product using this name — closest hits were unrelated ("informational residue" in an agent-memory project, "residue detection" in a security scanner, neither a naming collision).

**Register:** Technical, quiet, a little unusual — reads as a term of art, not a marketing word. Good fit for the "lab report" design direction already planned.

---

### 2. Undercut
**Tagline:** Undercut the top tier. Never the quality bar.
**Alt tagline:** Cheapest model that can still pass.

**Why it fits:** Double meaning that does real work: (1) undercut = beat the top-tier price, the entire value prop in one word, (2) undercut = work gets cut down to size at the cheap tier before anything escalates. Punchier and more immediately legible to a buyer skimming a GitHub trending page than "Residue" — trades a little precision for a lot of instant clarity.

**Conflict check:** Clean for this category. "Undercut" shows up generically (pricing discourse, one unrelated F1-timing TUI called undercut-f1) — no direct devtool/routing collision, but it's a common enough word that a distinctive lockup (wordmark treatment, not relying on the word alone) matters more here than for Residue.

**Register:** Punchier, slightly more commercial-sounding than Residue — reads more like a company name, less like a term of art.

---

### 3. Tollgate
**Tagline:** Every unit passes through a gate. Most don't stop.
**Alt tagline:** Verification is the toll. Most work pays cheap.

**Why it fits:** Direct visual metaphor for the six-flag rubric plus the verification-gate mechanism — most traffic (mechanical, cheap-verifiable work) passes through free and fast, a minority gets stopped and pays the higher toll (escalation). Maps cleanly onto the "How It Works" diagram already planned — a tollgate/ladder visual is an easy, non-generic signature element (see design notes update once you pick).

**Conflict check:** Clean. No devtool or AI-routing collision found — generic word, unrelated existing uses (real toll infrastructure, unrelated companies named Escalon/Tollgate in other industries not adjacent to this space).

**Register:** More visual/spatial than Residue or Undercut — easiest of the three to build a strong diagram-led identity around, per your standing preference for box-drawing/diagram-first communication.

---

## Also considered (shortlist, not recommended as strongly)

### Upshift
**Tagline:** Shifts up only when the load demands it.
Gearbox metaphor — stay in a low, cheap gear as long as possible, upshift only under real load, never downshift mid-task (maps to the hysteresis rule). Strong conceptual fit, slightly more consumer/automotive-coded than the audience expects from a dev tool. No direct collision found, but "upshift" gets generic startup/fitness-brand use elsewhere, so the name alone won't carry positioning — would need the tagline doing more work than Residue or Tollgate need.

### Ratchet
**Tagline:** One direction only. Never de-escalates.
The hysteresis rule ("never de-escalate mid-task") is genuinely a ratchet mechanism, and "Ratchet Logic" already appears as a named concept in your own pricing framework doc — strong internal-consistency argument for reusing it here. **Not recommended:** meaningfully overloaded in this exact space already — `ratchetphp/Ratchet` (established PHP WebSocket library), an existing `mcp-ratchet` project, and "ratchet" is already a known term of art for monotonic-lint-improvement tooling (a live Hacker News discussion on exactly that pattern). Picking this risks the product being mistaken for one of those, or being asked "wait, is this related to X" a lot.

### Escalon
**Tagline:** Escalation, engineered.
Invented word, escalate + ladder, reads clean and brandable. **Not recommended:** "Escalon Software" and "Escalon Services, Inc." are real, existing businesses (SEC filings, an active business-services company at escalon.services) — enough of a naming collision in commercial contexts to create confusion and complicate trademark/domain clearance.

---

## Also considered (rejected outright, listed so you know they were weighed)

- **Probe** — this is the literal name of your shipped internal routing policy ("probe tiered vs all-standard" appears throughout the benchmark tables). Reusing it as the public brand name would either read as an odd inside joke to anyone who reads the methodology section closely, or create confusion between "the policy called probe" and "the product called Probe." Better kept as internal/methodology vocabulary, not the marquee name.
- **Ledger** — thematically close (evidence-based, auditable) but this exact word is already claimed as a named principle elsewhere in your own portfolio ("fact ledger with provenance" is Frontage's language) — reusing it here risks cross-project confusion in your own docs and conversations, separate from any external collision.
- **Sift** — good mechanism fit (sorts work into tiers, leaves residue) but "Sift Science" is an established fraud-detection company; different market, still an unnecessary collision to invite when Residue is sitting right there uncontested.
- **Overdrive** — rejected on the metaphor itself, not naming conflict: "overdrive" connotes always running at max, which is the literal opposite of the product's actual behavior (stay cheap as long as possible).

---

## Why not the other two

- **Residue** would have taught the mechanism faster to a technical reader, but it's a quieter, more inside-baseball word — worse odds of landing with finance/ops or a non-technical forward.
- **Tollgate** gave the easiest visual identity to design around, but "undercut" already does double duty as both the value prop and a decent visual metaphor (the price line getting cut down before it reaches the top tier) — no real loss on the design side by going with the more benefits-forward name.
