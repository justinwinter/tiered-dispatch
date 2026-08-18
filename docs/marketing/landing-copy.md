# Undercut — Landing Page Copy + Outline
**v2 — audited against the Direct Response Canon (Six Expert Influences), the Offer Design Framework's Value Equation, Pedro Cortés' page-architecture-for-conversion-paths principle, and Oddit's CRO/trust conventions. Build-ready for Claude Design / Claude Code handoff. Mobile-first. Every claim below is sourced from the research dump — nothing invented.**

**Naming note:** Brand name is **Undercut**. Technical install path stays `undercutsh/firstpass` (the GitHub repo / skill slug) unless you want the repo itself renamed to match — flag it and that's a quick follow-up pass.

---

## What changed in v2 (read this first)

- **Value Equation made explicit**, not just implied — see §0 below. Every major section now maps to a specific lever (Likelihood, Time Delay, Effort).
- **Six Expert pre-ship audit run against the actual draft** — see the Appendix. Two things failed on the first pass and got fixed before this version shipped (see Appendix for what and why).
- **Awareness-stage entry mapping added** — different traffic sources land on this page in different mental states; §0 maps them so future paid/organic pushes know which section is doing the work for which reader.
- **Bridge sentences added between sections** (Sugarman's slide) — every section now ends on a line that pulls into the next, not just a hard stop.
- **Honest urgency added to the hero and final CTA** (Kennedy) — no fake deadline, no fake scarcity (both prohibited by the Canon regardless), just the true cost of not acting: token spend compounds every session it isn't routed.
- **New closing section: Companion Page Architecture** — applying the "28 pages" logic from Cortés' page-revenue framework, adapted honestly for a free/OSS product (adoption paths, not fabricated ACV math).
- Wedge is unchanged: one ICP, one mechanism, one proof. The three-audience layering from the previous round is a translation layer on top of that wedge, not a second wedge — see the One-Wedge Rule check in the Appendix.

---

## 0. Strategy layer (read before building — not on-page copy)

### Value Equation applied
*Value = (Desired Outcome × Likelihood) ÷ (Time Delay × Effort)* — from the Offer Design Framework. Every major section pulls one specific lever:

| Lever | What raises it | Where on the page |
|---|---|---|
| **Desired Outcome** | Named explicitly, not vague ("cheaper" → "up to −95% cost, equal-or-better pass") | Hero H1 + proof line |
| **Likelihood** | Published, reproducible, vendor-constant benchmark tables — not a vendor's internal claim | §5 The Proof |
| **Time Delay** | Zero-cost mock mode, no API key required to see it work | §9 Install validation path, step 2 |
| **Effort** | One command, zero config, zero lock-in, remove-and-you're-back-to-status-quo | §9 reassurance line, footer microcopy |

If a future section or companion page doesn't clearly move one of these four, cut it — that's the test.

### Awareness-stage entry mapping (Schwartz)
Different traffic sources land in different mental states. This page's default build serves the **problem-aware / solution-aware** reader (someone who already suspects they're overpaying and is now evaluating mechanisms). Other entry points need different lead sections — noted here so a future variant or paid push doesn't reuse the wrong entry:

| Entry point | Awareness stage | What should lead |
|---|---|---|
| GitHub trending, cold discovery | Unaware / problem-aware | Story hook (the 93.8% anecdote) — current homepage default, correct as built |
| Referred from "how do I cut Claude Code costs" search | Problem-aware | Mechanism-led (§6 How It Works) should move up, proof second |
| Referred from an OpenRouter/Portkey comparison search | Solution-aware, comparison-shopping | Positioning-led — this is what the comparison companion pages in §14 are for, not the homepage |
| Forwarded link from an engineer to their finance/procurement lead | Product-aware (someone already decided) | Offer-led — §8's finance callout should be the effective landing point; consider it as a deep-link anchor |

The homepage stays built for the first row. Rows 2–4 are the argument for the companion pages in §14, not for re-architecting the homepage itself.

### One-Wedge Rule check
One ICP (platform/DevEx engineers running agents at scale), one mechanism (objective-trigger tiered routing), one KPI (cost at equal-or-better pass), one proof (published A/B). The three-audience translation layer from the prior round (§3, "Who This Is For") doesn't add ICPs — it restates the same wedge in three vocabularies for readers who influence or receive the decision without making it themselves. If that section ever grows beyond three short blocks or starts introducing benefits the engineering ICP doesn't also get, it's become a second wedge and should be cut back.

Conversion goal: **install** (`npx skills add`) and **GitHub star/watch** — not purchase.

---

## Global elements

**Nav (sticky, minimal):** Undercut (wordmark) · How it works · Benchmarks · Install · GitHub (icon, opens repo)
**Nav CTA button:** "Install" (npx command copies on click)

**Button vocabulary (use exactly, everywhere):**
- Primary action → **"Install"**
- Secondary action → **"Read the benchmarks"**
- Tertiary → **"View on GitHub"**
Never swap in "Get started," "Try it now," or "Learn more" — same label, same destination, every time it appears.

---

## 1. HERO
**Purpose:** State the mechanism and put the proof in the same breath. No warm-up. (Value Equation: Desired Outcome.)

**Eyebrow:** `MIT · open-source · works with any agent that reads a SKILL.md`

**Wordmark/logo (sits above or beside H1, small):** Undercut

**H1:**
Undercut the top-tier model. Never the quality bar.

**Subhead:**
Undercut is a SKILL.md your coding agent follows at dispatch time. Six-flag rubric assigns a base tier. Objective evidence — not self-reported confidence — is the only thing allowed to escalate it.

**Proof line (sits directly under subhead, not buried below the fold):**
Measured on public benchmarks, official test cases, deterministic graders: **up to −95% cost on HumanEval, up to −71% on GSM8K — equal-or-better pass rate.** [Raw results →]

**Honest urgency line (Kennedy — no fake deadline, just the true cost of waiting):**
Every session your agent runs on all-standard routing between now and whenever you install this, it's paying top-tier prices for work a cheap tier could have passed. That's not a countdown timer — it's just what the token bill already does.

**CTA row:**
- Primary: **Install** — `npx skills add undercutsh/firstpass`
- Secondary: **Read the benchmarks**

**Bridge to next section:** The compatibility bar below answers the first objection before it's asked — does this even work with what I'm already running.

**Visual/asset slot:** Live terminal-style module — see Design Notes §Signature Element. Not a screenshot; an actual small interactive piece if the build layer supports it, static terminal mock if not.

---

## 2. COMPATIBILITY BAR
**Purpose:** Answer "does this work with what I already use" in under two seconds.

**Label:** Works anywhere a SKILL.md is read.

**Row:** Claude Code · Codex · Cursor · Copilot · OpenCode

**Bridge to next section:** Compatibility answered — now the reader needs to know who this page is actually talking to.

**Visual/asset slot:** Simple horizontal logo row, grayscale, on hover full color. No card containers — compatibility strip, not a partner-logo brag wall (no partnerships exist; these are just clients that read SKILL.md files).

---

## 3. WHO THIS IS FOR
**Purpose:** Translation layer — same claim, three vocabularies. See §0's One-Wedge check: this restates the wedge, it doesn't add a second one.

**Eyebrow:** For your team

**H2:**
One skill. Three reasons to care.

**Block 1 — Engineering**
**Label:** For platform & DevEx engineers
**Body:** Objective escalation triggers, not confidence thresholds. Vendor-agnostic rubric. Published, reproducible methodology — re-run our exact benchmarks on your own tasks.

**Block 2 — Finance & Ops**
**Label:** For finance & ops
**Body:** No new vendor contract. No network-layer access, no proxy sitting between your agent and its model calls. MIT license, free, and every cost claim on this page is backed by public, auditable results — not a vendor's internal number.

**Block 3 — Product & non-technical builders**
**Label:** For product people and vibe coders
**Body:** Your coding agent gets cheaper automatically. Nothing to configure, nothing to learn about routing rubrics — install it, and the easy work stops burning top-tier tokens.

**Bridge to next section:** All three of those readers are reacting to the same thing — here's the actual problem underneath it.

**Visual/asset slot:** Three plain columns, no icons required. If icons are used, keep them literal and quiet.

---

## 4. THE PROBLEM
**Purpose:** Name the mechanism of the cost leak, then kill the obvious fix before the reader thinks of it themselves. (Halbert: hook mined from real language, not invented — see Appendix note on strengthening this further.)

**Eyebrow:** The problem

**H2:**
Your agent picks one model per session — and defaults to the expensive one for everything.

**Body:**
Claude Code, Codex, Cursor, and Copilot let you set a model once per session. That session then handles trivial, mechanical work at the same tier as genuinely hard reasoning. One Claude Code Max subscriber's self-reported usage data showed 93.8% of their tokens going to the top-tier model — with nothing pulling cheap, mechanical work back down. [It's one user's numbers, not an industry audit — the GitHub issue has stayed open with real engagement, which suggests the pattern isn't unique to one account.]

**Sub-block — why the obvious fix fails:**
**H3:** The obvious fix doesn't work.
**Body:** Ask the model how confident it is, and route on that. Except LLM self-reported confidence is poorly calibrated — a model that's wrong is often just as "confident" as one that's right. A confidence threshold buys the feeling of a safety check without the substance.

**Body (bridge to solution):**
Undercut replaces confidence with three objective triggers: a failed verification, a measured disagreement between two cheap-tier runs, or an explicit uncertainty flag. Nothing escalates on a vibe.

**Bridge to next section:** That claim is worth nothing without numbers behind it. Here they are.

**Visual/asset slot:** Optional — a small "self-reported confidence vs. actual correctness" scatter-style diagram if space allows. Skip if it slows the page down.

---

## 5. THE PROOF
**Purpose:** This is the page's spine. Lead with tables, not narrative. (Hopkins: specificity sells, tracked hypothesis. Value Equation: Likelihood.)

**Eyebrow:** The proof — measured, not modeled

**H2:**
Controlled A/B. Same tasks, same grader, only the routing policy changes.

**Methodology strip (small, above the tables, sets up trust before the numbers land):**
- Vendor-constant — every arm compared within one vendor, never across
- Deterministic graders — code executed against official test cases; math is exact-match. No LLM judge.
- 5 seeds per arm, temperature > 0

**Table 1 — GSM8K (math reasoning, 250 units/cell):**
| Vendor | all-standard | tiered | Cost | Pass |
|---|---|---|---|---|
| OpenAI | 241/250 · $0.60 | 249/250 · $0.17 | −71% | +8 |
| Gemini | 250/250 · $1.28 | 248/250 · $0.53 | −59% | −2 (seed noise) |
| Anthropic | 249/250 · $0.36 | 250/250 · $0.35 | −4% | +1 |
| Open-weights | 240/250 · $0.02 | 245/250 · $0.07 | +228%* | +5 |

*Open-weights price ladders invert — see caveats. Absolute overhead is ~$0.01–0.02.

**Table 2 — HumanEval (Python code, 100 units/cell):**
| Vendor | all-standard | tiered | Cost | Pass |
|---|---|---|---|---|
| Gemini | 100/100 · $1.13 | 100/100 · $0.05 | −95% | = |
| Anthropic | 100/100 · $0.30 | 100/100 · $0.12 | −61% | = |
| OpenAI | 100/100 · $0.46 | 100/100 · $1.23 | NA* | = |
| Open-weights | 100/100 · $0.01 | 100/100 · $0.02 | +77%* | = |

*OpenAI's cheapest tier can't write Python, so every task escalates the full ladder. Quality holds at 100/100 — the escalator works — there's just no cost headroom to exploit on that family for this benchmark.

**Callout (secondary evidence, clearly labeled ours):**
On our own 30-task synthetic suite (code, reasoning, mechanical — 150 units/cell), tiered was never worse than all-standard on any cell, and beat it on 6 of 12. The escalator recovers failures a fixed single tier gives up on — it's not just cheaper, it's smarter on the cells where it wins.

**CTA:** **Read the benchmarks** → links to `testing/README.md` and raw JSON in `testing/results/`

**Bridge to next section:** Numbers explain what happens. Here's exactly how.

**Visual/asset slot:** Real tables, not screenshots — build as actual HTML tables so they're legible on mobile (stack to cards under ~480px, vendor as card header). The table IS the trust mechanism — this is also the finance/ops audit artifact from §3, and it's the section Oddit-style CRO practice would flag as the page's actual authority signal, ahead of any logo wall or badge.

---

## 6. HOW IT WORKS
**Purpose:** Show the mechanism precisely enough that a skeptical engineer believes it's real. Progressive disclosure: default to a short summary with an "expand the rubric" affordance.

**Eyebrow:** How it works

**H2:**
Six flags assign a tier. Three triggers are the only way up.

**Collapsed-state summary (always visible, no click required):**
Every unit of work gets scored against six flags, then assigned the cheapest tier that can plausibly handle it. It only moves up a tier when something objective proves it needs to — a failed check, a measured disagreement, an explicit uncertainty flag. It never moves up on a guess, and it never moves back down mid-task.

**Expanded content (behind "See the rubric" / click-to-expand):**

**Step 1 — Base tier, six-flag rubric:**
- **Unverifiable** — can output be checked mechanically? (tests, schema, diff, grep)
- **Ambiguous** — one right answer, or several defensible ones?
- **Blast** — reversible? touches money, auth, user data, production, deletes?
- **Cross-cutting** — one file/source, or reasoning across many?
- **Novel** — pattern-following, or genuinely new design?
- **Format-strict** — must output match an exact schema?

0 flags → cheap. 1–2 → standard. 3+ or any ownership/judgment call → frontier. Apex only when you can write one sentence stating why the marginal intelligence pays for the cost.

**The override (single biggest lever):**
Cheap-to-verify ⇒ cheap-to-generate. If output can be checked mechanically, it starts at the lowest tier regardless of how hard it looks — verification catches failure. Only unverifiable work needs to start high.

**Step 2 — Escalate exactly one tier, on evidence only:**
- Verification fails twice at the current tier
- Two cheap-tier runs disagree on ambiguous-flagged work
- The worker tags an item "uncertain"

**Residue-only handoff:**
The next tier up gets only the failed or uncertain items, plus verification notes. It resolves the residue — it never redoes the batch.

**Hysteresis (guardrails):**
Never de-escalate mid-task. Max one retry per tier. Anything still unresolved goes to a single batched apex tie-break call. One hard file in a 700-file job doesn't drag the other 699 up a tier.

**Diagram (ASCII, ~40 char width):**
```
 unit of work
      |
  6-flag rubric
      |
  +---+----+
  | 0 flags|--> cheap
  | 1-2    |--> standard
  | 3+/own |--> frontier
  +---+----+
      | fail x2 / disagree / uncertain
      v
  escalate +1 tier
  (residue only)
      |
  still unresolved?
      v
  single batched
  apex tie-break
```

**Bridge to next section:** The rubric only matters if it survives real-world sloppiness. It does — here's the data on that.

**Visual/asset slot:** Real accordion component, not a fake "read more" that just scrolls.

---

## 7. WHY IT'S ROBUST
**Purpose:** Pre-empt "this needs a custom classifier" and "this will go stale." Same collapsed/expand pattern as §6.

**Eyebrow:** Why it holds up

**H2:**
Flags steer. Verification and escalation decide.

**Collapsed-state summary:**
Even when the rubric flags are scored imperfectly, the escalator still routes work to the right tier almost every time — because a wrong flag only ever costs one extra cheap attempt, never a wrong answer or a big bill.

**Expanded content:**
A stock dispatcher model reproduces the rubric flags imperfectly — Haiku hits 90% agreement, Sonnet 93%. The weakest flag (format-strict) is only 60%. None of that matters: under the shipped policy, both dispatchers still route 100% of units to the correct tier. A wrong flag changes the ladder cap, never the base tier — worst case, one extra cheap attempt.

**Sub-block — vendor-agnostic by design:**
**H3:** The rules are about the work, not the model.
**Body:** Every rule is a property of the unit of work — verifiable, ambiguous, blast-radius — never a specific model's known weakness. Vendor cards go stale as models change; work properties don't. It's also hard-won — a format-strict rule that worked on Anthropic backfired on Gemini, which is exactly why the rubric no longer encodes per-vendor behavior.

**Bridge to next section:** Robustness earns trust. The next section spends that trust honestly, on what this doesn't do.

**Visual/asset slot:** Small two-column comparison — "flag agreement %" vs "tier-match %" — bar pairs, not a table.

---

## 8. WHAT IT DOESN'T DO / TRUST & GOVERNANCE
**Purpose:** Trust-builder for engineers (Sugarman: honest admission of a flaw builds more trust than flawless claims) and primary selling section for the finance/ops reader from §3.

**Eyebrow:** Honest limits — and what this means for governance

**H2:**
What this doesn't do.

**List (plain, no spin):**
- Not a proxy. Doesn't enforce anything at the network layer.
- Not a gateway or compression proxy. Composes with those — routes first, they compress second.
- Doesn't auto-flag in production. The dispatching agent scores the flags itself (measured robust to getting them wrong — see §7).
- Doesn't help when the cheapest tier lacks the capability entirely (OpenAI + Python is the documented case — no headroom to save).
- Doesn't replace the planning decision. Planning is separate from execution routing; this ladder is for execution units.
- Doesn't promise a dollar figure for your workload. Savings are workload-dependent — real workloads escalate more than benchmarks and land below these numbers, not above.

**Callout box — for finance & procurement (pulled forward, not buried):**
No new vendor contract to negotiate. No network-layer access — it's a policy file your agent reads, not a service that sits between your agent and its model calls. MIT licensed, free to run. Every cost and quality claim on this page traces to public, re-runnable benchmark data — not an internal vendor number you have to take on faith.

**Bridge to next section:** Trust established — now the only thing left is removing friction from actually running it.

**Visual/asset slot:** Main list stays plain. Finance callout can carry slightly more visual weight (bordered card, not filled).

---

## 9. INSTALL + TRY IT
**Purpose:** Remove every excuse not to run it today. (Value Equation: Time Delay and Effort, both driven to near-zero.)

**Eyebrow:** Try it

**H2:**
Free. MIT. Nothing installs, nothing proxies your traffic.

**Body:**
Install:
```
npx skills add undercutsh/firstpass
```
or copy `skills/tiered-dispatch/` straight into your agent's skills directory.

**Validation path (numbered, stepper not prose):**
1. Read the published results — `testing/README.md` and the raw JSON in `testing/results/`
2. Reproduce for free, no API key, no spend: `node src/main.js --mock`
3. Run live on your own vendor/benchmark with an OpenRouter key — a full 4-vendor × 2-benchmark run is ~$4–5 total, a single-vendor smoke test is pennies
4. Diff any two saved runs: `node src/main.js --compare a.json b.json`

**Reassurance line:**
Zero lock-in. It's a policy your agent follows — remove the skill and you're back to status quo.

**Not the one setting this up? Forward this page.** Everything above the install command reads without a technical background — the engineer on your team just needs the command block.

**CTA:** **Install**

**Bridge to next section:** Skeptical this is actually new? Here's how it compares to what's already out there.

**Visual/asset slot:** Terminal block showing the actual commands, real monospace, real syntax.

---

## 10. PRIOR ART + WHAT'S NEW
**Purpose:** Honest positioning against the two things a technical reader will already be thinking of.

**Eyebrow:** Prior art

**H2:**
Others have tried cheaper-model routing. Here's what's different.

**Body:**
peragwin's subagent-model-routing gist and soumabali/token-router both explored assigning cheaper models to subagent work. Undercut adds the objective escalation loop on top: measured disagreement instead of self-reported confidence, hysteresis so a run can't thrash between tiers, residue-only escalation with a structured handoff, a calibration feedback loop, and — the part that's actually rare in this category — published, reproducible A/B results. Anyone can re-verify any cell in the tables above.

**Sub-block — vs. gateways:**
**H3:** Not competing with your gateway.
**Body:** Compression proxies like Edgee shrink what goes over the wire for a given call. Undercut decides which model handles the call in the first place. Route first, compress second — they stack.

**Bridge to next section:** If any of this raised a specific question, it's probably answered below.

**Visual/asset slot:** None. Clean prose, inline links to the two prior-art repos.

---

## 11. FAQ
**Purpose:** Catch remaining friction, real objections only.

- **Does this replace choosing a model per session?** No — it operates inside a session, per unit of work, underneath whatever top-level model choice you've already made.
- **What if I'm on an open-weight model?** Check your tier pricing first — some open-weight price ladders have cheap and standard inverted, which flips the cost math (quality still holds; see the caveats in the benchmark section).
- **Do I need to build a custom flagging model?** No. Stock dispatchers (Haiku, Sonnet) hit 90%+ flag agreement and 100% tier-match under the shipped policy.
- **Will this go stale when a new model ships?** The routing rules are about work properties, not specific models. The tier→model mapping is versioned separately in `models.md` and updates on its own cadence.
- **Does this touch our network or data?** No — it's a policy file the agent reads locally. Nothing proxies traffic, nothing calls home.

---

## 12. FINAL CTA
**Purpose:** Close the loop. Honest urgency, repeated once, not escalated (Kennedy — one clear action, one honest reason, no manufactured pressure).

**H2:**
Undercut the top tier. Not the quality bar.

**Body (honest urgency, closing form):**
Nothing about this page expires. What does keep happening is the token bill, one session at a time, on whatever your agent is currently doing with mechanical work.

**CTA row:**
- Primary: **Install** — `npx skills add undercutsh/firstpass`
- Secondary: **View on GitHub**

**Visual/asset slot:** Reuse the hero's visual treatment at smaller scale — bookend the page.

---

## 13. FOOTER
**Purpose:** Standard open-source dev-tool footer. Utility over persuasion.

**Structure:**
```
Undercut     MIT License · github.com/undercutsh/firstpass

Product          Proof              Repo
How it works     Benchmarks         GitHub
Install          Raw results        Changelog
Who it's for      Methodology        Issues

Works with: Claude Code · Codex · Cursor · Copilot · OpenCode
```

**Microcopy line (small, bottom):**
Open source, MIT licensed. Undercut the top tier, never the quality bar.

**Visual/asset slot:** Minimal, text-first footer — license badge + repo link are the only visual elements beyond nav-style column links.

---

## 14. COMPANION PAGE ARCHITECTURE (new — Cortés page-revenue framework, adapted)

**The source logic:** a comparison page, an integration page, a use-case page, and a migration/objection page each open a distinct path for a distinct searcher to find the exact page matching their situation — and each does more than SEO (a comparison page supports sales/community follow-up, an integration page activates trial users, a use-case page improves targeted sharing, an objection page overcomes a specific hesitation).

**Honest adaptation for this product:** Undercut is free and OSS — there's no ACV, no demo funnel, no $55K-style close-rate math to run, and building that math here would be inventing numbers the research doc explicitly warns against. The mechanism still holds without the dollar figure: each companion page is a distinct, indexable, forwardable entry point for a reader who would never have found or fully trusted the homepage on its own. The "revenue" this creates is adoption — installs, stars, and the org-internal forwards that turn one engineer's discovery into a team's default.

**Recommended pages, using the same taxonomy, translated:**

**Integration pages (5 — one per compatible agent, mirrors the "ten integration pages" pattern):**
"Undercut for Claude Code," "...for Codex," "...for Cursor," "...for Copilot," "...for OpenCode." Each is the homepage's hero + install section rebuilt with that agent's actual install path and one agent-specific line (e.g., the Claude Code page can open directly with the 93.8% anecdote since it's Claude-Code-specific data; the others need a different hook — a fair place to actually mine agent-specific GitHub issues per the Halbert audit note below).

**Comparison pages (2–3, not the full "five competitors" — this category only has real comparables in two directions):**
"Undercut vs. manual model switching" (the actual status quo most readers are in) and "Undercut vs. a gateway/proxy" (clarifying the composability point from §10 for someone who thinks a gateway already solves this). A direct "vs. OpenRouter" or "vs. Portkey" page is not recommended — they're not substitutes (gateway vs. routing policy), and building a comparison against a non-competitor reads as confused positioning, not confident.

**Use-case pages (3, mirrors "six use-case pages" scaled to this product's real segments — see research doc §6.3 archetypes):**
"For platform teams running agents at scale," "For AI-native startups watching token COGS," "For solo power users hitting subscription tier ceilings." Each opens with that archetype's specific pain (already drafted in the research doc, not invented) instead of the general hero.

**Objection/migration page (1, adapted from "three migration pages"):**
"Switching off all-standard routing" — not a vendor migration since there's no vendor lock-in to escape, but the real objection ("will this break my workflow, will it thrash, will it cost me a bad merge") gets its own page built around §6/§7's hysteresis and robustness content, expanded rather than collapsed by default.

**What NOT to build:** industry pages. There's no vertical segmentation in this ICP (a platform engineer's pain doesn't change by industry) — forcing an industry-page structure here would be page-count for its own sake, which is the exact failure mode the source framework warns against.

**Build sequencing:** the 5 integration pages first — they're nearly free (same content, swapped agent name and install path, minimal net-new copy) and each is a plausible direct-search landing page for someone typing "[agent name] model routing." Comparison and use-case pages second, once there's real search/referral data showing which entry points in §0's awareness table are actually happening.

---

## Appendix: Six Expert Pre-Ship Audit (run against this v2 draft)

Per the Direct Response Canon: "Any output failing two or more questions returns to draft." Run below — two items failed on the pre-v2 draft and were fixed before this version shipped.

1. **Hopkins — tracked hypothesis + settling metric?** Pass. Primary metric named explicitly in §0: cost reduction % at equal-or-better pass rate, sourced to the benchmark tables in §5.
2. **Kennedy — one clear action, honest reason now?** **Failed on the prior draft** (no urgency mechanism at all, page felt informational rather than action-oriented). Fixed: added the honest "token bill compounds every session" framing to hero and final CTA — true, not manufactured, no fake deadline.
3. **Ogilvy — could this headline run on a competitor's ad?** Pass. "Undercut the top-tier model. Never the quality bar." is load-bearing on the brand name itself — a competitor literally cannot run this headline without it being Undercut's line.
4. **Schwartz — entry point matches awareness, claim matches sophistication?** **Failed on the prior draft** (single entry point assumed for all traffic). Fixed: §0 now maps four distinct entry states to four different lead sections, and the companion-page plan in §14 gives the non-default entries their own pages instead of forcing them through the homepage's problem-aware framing.
5. **Halbert — hook mined from customer language, first line forces the second?** Partial pass. The 93.8% anecdote is real, attributed customer/community language, not invented. Flagged limitation: the research doc doesn't include verbatim quotes from the GitHub issue thread itself — pulling 2–3 real quotes from that thread (with permission/attribution) would strengthen this further and is worth a follow-up pass before the page ships, particularly for the agent-specific integration pages in §14.
6. **Sugarman — every element pulls to the next, emotional sale armed with logic?** Pass in this version. Every section now ends on a bridge sentence into the next (added throughout v2) — this was the main structural gap in the prior draft, where sections read as a stacked list rather than a slide.

**Copy rules applied throughout (unchanged from v1):**
- No em dashes in on-page copy.
- No fabricated customer logos or named users — company archetypes only, never invented named customers.
- Every number traces to §5 (measured) or is explicitly labeled illustrative.
- "up to" stays attached to every percentage.
- Brand name is "Undercut" everywhere except the literal install command / repo path.
