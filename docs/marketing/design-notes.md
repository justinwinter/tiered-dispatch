# Undercut — Design Notes
**v2 — adds Oddit-informed trust/authority conventions and design implications of the companion-page architecture from the copy doc. Companion to the copy doc. For Claude Design handoff. Read both together.**

**Naming note:** Brand is **Undercut**. Repo/install slug stays `tiered-dispatch` unless the repo gets renamed too.

---

## What changed in v2

- New §3.5: Oddit-informed trust and authority conventions — real audit artifacts over generic trust badges.
- New §6: design system implications of the companion-page architecture (§14 of the copy doc) — how to build once and reuse across 9–10 pages instead of designing each from scratch.
- Everything else carries forward from v1 unchanged; no rework needed there.

---

## 1. Who this is actually competing with, visually

Not a consumer SaaS. Not a Series-B dashboard product. The closest visual comps are:

- **OpenRouter** — unified LLM API gateway, dev-tool-plain, docs-forward
- **Portkey** — AI gateway, governance-layer positioning, denser enterprise feel
- **skills.sh / vercel-labs/agent-skills** — the actual distribution channel this product ships through
- **GitHub itself, functionally** — the repo IS the trust artifact

The pattern across all of them: monospace for anything executable, restrained color, benchmark tables treated as first-class content rather than buried proof, no lifestyle photography, no abstract 3D blob renders.

**2026 SaaS/AI landing trend scan (calibration, not copying):** editorial-beige-with-serif and dark-mode-with-single-neon-accent are both showing up constantly right now — flagged directly in the frontend-design skill as AI-generated defaults. Broadsheet/hairline-rule newspaper layouts are the third cluster. The temptation here is dark-mode-with-terminal-green because "dev tool" pattern-matches to "terminal aesthetic" — actively resisted below in favor of a more restrained, desaturated version of that instinct.

---

## 2. Design plan

### Color
- `--ink` `#15171C` — near-black, warm not cold
- `--paper` `#F5F3EE` — light-mode background, warm off-white
- `--signal` `#2E9E5B` — desaturated green, "pass" states only
- `--escalate` `#C77D2E` — warm amber/ochre, escalation events only
- `--rule` `#2A2D35` (dark) / `#DFDAD0` (light) — hairline dividers only
- `--ink-muted` `#8A8F98` — captions, metadata, attribution lines

No single "brand color" carrying the whole page. Signal and escalate only ever mean pass/escalate.

### Type
- **Display:** Monospace/semi-monospace at large size for H1/H2 (Berkeley Mono, JetBrains Mono, IBM Plex Mono, 72px+). Used with restraint — never for body copy.
- **Body:** Plain, high-legibility humanist sans (Inter or IBM Plex Sans).
- **Data/utility:** Same mono family as display, small size, for tables/code/terminal mockups/rubric lists.

### Layout
"The page reads like a lab report that happens to have a hero." Hairline-rule dividers, generous whitespace, benchmark tables as real HTML (not screenshots).

```
+----------------------+
| nav (sticky, minimal) |
+----------------------+
|   HERO (dark, mono H1)|
+----------------------+
| compat bar (logos)    |
+----------------------+
| who this is for       |
+----------------------+
| problem (light)       |
+----------------------+
| PROOF -- tables (light)|
+----------------------+
| how it works (dark)   |
+----------------------+
| robustness (light)    |
+----------------------+
| limits + finance      |
+----------------------+
| install (dark, term.) |
+----------------------+
| prior art (light)     |
+----------------------+
| final CTA (dark)      |
+----------------------+
| footer (light, plain) |
+----------------------+
```
Dark/light alternation trains the reader's eye: dark = executable/terminal content, light = tabular/documentary content.

### Signature element
A small live routing-ladder visual in the hero, echoed in How It Works — units flowing through the six-flag gate, most dropping straight to "cheap" and passing (green tick), one occasionally escalating exactly one tier (amber), residue-only. Static three-frame fallback if the build layer can't animate. Rejected the "big number, small label, gradient accent" template in favor of this because it teaches the mechanism instead of just asserting the outcome.

---

## 3. Audience layering — component-level guidance

**"Who This Is For" section:** Three equal-weight plain columns. No checkmarks, no "recommended" badge, no differentiated card heights.

**Collapsed/expanded pattern (How It Works, Why It's Robust):** Real accordion, default-collapsed, summary always visible above the click. Label the affordance concretely ("See the rubric," not a bare chevron).

**Finance/ops callout box:** Slightly more visual weight than the plain caveats list around it — bordered card, positioned after the list so the technical reader's trust is earned first, then translated.

**Do not build:** a persona switcher, a "choose your role" gate, or role-specific URLs. All three readers forward the same link.

---

## 3.5 Trust and authority conventions (Oddit-informed)

Oddit's own public material is worth noting for what it consistently leads with, even where their site content itself wasn't fully scrapable: **case-study-specific numbers over generic trust badges** (their own marketing cites a named client's measured lift, not a "trusted by 10,000 brands" logo wall alone), and **every design change shipped with the strategic rationale attached**, not just the visual — the "why" is part of the deliverable, not an afternote.

Two direct implications for this page, given it has zero named customers yet (no logos to show honestly):

1. **The benchmark tables in §5 of the copy doc ARE this page's case-study section.** Design them with the same weight a testimonial-driven SaaS page would give a client logo wall — full-width, unmissable, not one collapsible module among many. This is the authority signal available to a pre-adoption OSS tool, and it should look like the page's actual centerpiece, not a supporting exhibit.
2. **Every section that makes a claim should visibly carry its "why."** The copy doc's per-section "Purpose:" framing already does this in the build spec — the equivalent needs to survive into the live page as visible rationale, not just internal documentation. Concretely: the methodology strip above the benchmark tables (vendor-constant, deterministic graders, 5 seeds) is doing exactly this job and should be styled as a first-class trust element, not a fine-print disclaimer.

**What to avoid:** don't manufacture trust signals this product doesn't have yet — no fake "as seen in," no placeholder logo wall, no review-star widget with nothing behind it. The Oddit pattern earns trust through specificity and rationale, not through borrowed-authority decoration, and this product's version of that specificity is the raw data it already has.

---

## 4. Section-by-section visual notes (maps 1:1 to the copy doc's numbered sections)

1. **Hero** — dark. Mono H1 at large scale. Signature ladder visual as the hero graphic.
2. **Compatibility bar** — light/transitional. Wordmarks only, grayscale→color on hover.
3. **Who this is for** — light, three plain columns.
4. **Problem** — light. "Obvious fix fails" sub-block gets a hairline-bordered indent.
5. **Proof** — light, full-width, widest section on the page. Real HTML tables; mobile stacks to cards, vendor as card header. Per §3.5, give this section the visual weight a case-study/logo section would get elsewhere.
6. **How it works** — dark. Collapsed summary always visible; ladder visual as the expanded centerpiece.
7. **Robustness** — light. Same collapse pattern. Two-bar comparison, small and inline.
8. **Limits + finance callout** — light, plainest section apart from the bordered callout card.
9. **Install** — dark, terminal-styled. Copy-to-clipboard on the primary command.
10. **Prior art** — light, plain prose, inline underlined links (not buttons).
11. **FAQ** — light, simple accordion.
12. **Final CTA** — dark, echoes hero at reduced scale.
13. **Footer** — light, plain, four-column links, MIT badge as the only non-text visual element.

---

## 5. What to explicitly avoid

- Cream + serif + terracotta (the #F4F1EA/Claude-orange cluster) — AI-generated default, doubly risky given the Claude Code audience overlap.
- Acid-green-on-near-black — the second AI-default cluster; `--signal` is deliberately desaturated to avoid this read.
- Numbered-marker sections (01/02/03) as pure decoration — only the how-it-works ladder and the install steps are genuinely sequential.
- Any illustration style outside the mono/hairline/signal-color vocabulary — one signature element, everything else quiet.
- Gradient buttons, glassmorphism, heavy card-shadow blur — wrong register for a "lab report."
- Fabricated trust signals — see §3.5. No placeholder logos, no invented review widgets, no "as seen in" with nothing behind it.
- A persona picker or role-gated routes — see §3.

---

## 6. Design-system implications of the companion-page architecture (new)

The copy doc's §14 proposes ~9–10 companion pages (5 integration pages, 2–3 comparison pages, 3 use-case pages, 1 objection page). Build implication: **this needs to be a component system, not 10 separate page designs.**

**What's shared across every companion page (build once, reuse everywhere):**
- The full token system (§2), nav, footer, and the "Who This Is For" and "What It Doesn't Do / Trust & Governance" blocks verbatim — these don't change per audience or comparison target.
- The benchmark tables (§5-equivalent) — identical data, identical component, every time. Never re-derive or restyle per page.
- The install section (§9-equivalent) — identical except the install path string on integration pages (see below).

**What's swapped per page type:**
- **Integration pages:** hero headline references the specific agent by name, install command uses that agent's actual install path, and the compatibility bar becomes a single-agent confirmation strip instead of the five-agent row. Everything below the fold is the shared component set, unmodified.
- **Comparison pages:** hero and §10-equivalent (Prior Art) get rewritten for the specific comparison; everything else — proof, how it works, robustness, limits — is shared and unmodified, since the mechanism doesn't change based on who's reading.
- **Use-case pages:** only the hero and problem section (§4-equivalent) get archetype-specific framing pulled from the research doc's own archetype language; everything from §5 onward is shared.
- **Objection/migration page:** this is the one page that inverts the default section order — How It Works and Why It's Robust move above the fold, Proof moves down, per the awareness-stage mapping in the copy doc's §0.

**Practical build note for Claude Design:** design the shared component set first as its own library (proof table, trust/governance block, install terminal, footer), then design only the 3–4 variant hero/problem patterns on top of it. Don't treat each companion page as a fresh design pass — the whole point of this architecture, per the copy doc's own build-sequencing note, is that the integration pages in particular should be nearly free to produce.

---

## 7. Handoff notes for Claude Design

- Bring both files. This one has zero copy in it on purpose — pull all text from the copy doc verbatim.
- Build tables as real markup from the start; don't design them as images.
- The routing-ladder signature element is the one piece worth spending real iteration time on.
- Confirm dark/light section alternation survives real content; merge sparse sections into neighbors rather than forcing the alternation.
- The accordion pattern in §6/§7 needs real expand/collapse state — load-bearing for the non-technical/finance reading path.
- If the companion pages in copy-doc §14 get greenlit, build the shared component library (§6 above) before designing any individual companion page.
