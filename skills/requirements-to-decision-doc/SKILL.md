---
name: requirements-to-decision-doc
description: Turn raw requirements, meeting/sync alignment, or PRD fragments into a structured, status-tagged HTML "decision doc" — a review artifact for engineering and stakeholders. Use whenever the user needs to capture what was decided vs. still open after a sync, draft first-round requirements with roles/permissions/flows, build a shareable design sketch for review, or produce a "launching pad" for the first round of prototypes. Triggers on "turn these notes into a doc", "first-round requirements", "decision doc", "design sketch for review", "write up what we aligned on", "requirements draft", or any time the work is to communicate proposed-but-not-committed requirements for comment. Pairs with flow-diagram-render (for the diagrams) and a Confluence mirror step, if you use one (to mirror it for inline comments).
---

# Requirements → Decision Doc

Author a single self-contained HTML artifact that turns messy inputs (sync notes, requirements lists, PRD fragments, a verbal alignment) into a clear, reviewable design sketch. The artifact's job is **communication and decision-tracking**, not production code — it exists so engineering and stakeholders can react *before* detailed feasibility work, and so the line between "decided," "assumed," and "still open" is never blurry.

This is the inverse of pulling a spec *out* of Confluence: this *authors* the review artifact that can later be mirrored into Confluence (via a Confluence mirror step, if you use one) and feeds the first round of prototypes.

## The core idea: honesty about certainty

The single most valuable thing this artifact does is **separate what's settled from what's a guess**. Reviewers' attention is scarce — point it at the open decisions, not the noise. Every requirement, role, and flow carries a status so a director can skim to the gaps and an engineer can trust what's locked.

Status tags (keep these exact, they map 1:1 to Confluence status-lozenge colors when the doc is mirrored there):

| Tag | Meaning | Color token |
|---|---|---|
| `Decided` | Aligned at the sync / confirmed | green (`--done`) |
| `Assumed` | Reasonable default, not yet confirmed | blue (`--blue`) |
| `Open` | Still needs a decision — this is where the gaps are | amber (`--assess`) |
| `Proposed` | A speculative layer offered for review (e.g. an AI assist layer) | purple (`--action`) |

## Hard rules (do not violate)

1. **Never fabricate requirements, UI, or decisions not grounded in the source.** If something is unknown, make it an `Open` row with a pointed question — do not invent an answer. Precision is the whole point; a confident-looking but invented requirement is worse than a flagged gap.
2. **Neutral, constructive tone.** Frame issues as design opportunities. No commentary on who built something or seniority. This artifact gets shared with directors and engineers.
3. **"Nothing committed" framing.** State plainly in the header that it's a working draft, assumptions are flagged, and nothing is locked. This lowers the stakes for honest feedback.
4. **Convert relative dates to absolute** (e.g. "yesterday's sync" → the actual date).

## Workflow

1. **Gather inputs.** Sync notes, requirement lists, a Jira epic, a verbal summary. Ask only for what shapes the structure (who the roles are, what the lifecycle is). Default unknowns to `Open` rows, don't stall.
2. **Extract and classify.** Pull out roles, actions, states, and requirements. Tag each by certainty (Decided / Assumed / Open / Proposed). Group requirements by lifecycle area (Create, Assign, Reassign, Reject, Complete, etc.) and give each a stable ID: `R-<GROUP>-<n>`.
3. **Pick the format, then build.** Markdown (`references/decision-doc-template.md`) is the better *authoring* source — Mermaid renders live in Obsidian, GitHub, and Confluence-with-Mermaid-app, and it's diffable. HTML (`references/decision-doc-template.html`) is the richer *reading/review* artifact (sticky TOC, as-is/with-layer toggle, view-code component) for hosting on Vercel. Default to markdown unless the doc is headed straight to a hosted review, or produce markdown first and generate the HTML from it. Include only the sections the material supports — don't pad.
4. **Add flows** as Mermaid diagrams, color-coded by status. If a proposed layer exists (e.g. AI), offer both an **as-is** and a **with-<layer>** variant via a toggle (see `references/conventions.md`). To embed diagrams where live Mermaid won't run, hand the sources to `flow-diagram-render`.
5. **Close with open questions by owner** — split the unresolved items by who answers them (product vs. engineering), so the asks are unambiguous.
6. **Publish/share** only when asked — see `references/publish-and-share.md`.

## Section menu (use what the material supports)

- **Header** — kicker, title, one-line description, last-edited date, status legend. No "Purpose:" preamble.
- **Scope** — what this covers + what was decided (a decision list) + the hard constraint to design around.
- **Roles** — the role set as cards; note any base/observer role explicitly.
- **Permission matrix** — role × action table (✓ / ▲ conditional / · no). Flag ▲ cells as open rulings.
- **Lifecycle** — state machine (states + transitions + trigger).
- **Flows** — end-to-end flow(s); as-is and optional with-<layer> variants.
- **[Proposed layer]** — e.g. AI assist: a guardrail panel + touchpoint cards + its own `R-*` rows, all tagged `Proposed`.
- **First-round requirements** — grouped tables, every row tagged.
- **Open questions** — by owner (product / engineering).

## Reference files

- `references/conventions.md` — design-system tokens, status colors, the as-is/with-layer toggle, the diagram "view code" component, and the never-fabricate rationale. Read before building.
- `references/decision-doc-template.md` — markdown skeleton with fenced Mermaid (status-colored), grouped `R-*` tables, and the rules as HTML comments. Best for authoring; renders in Obsidian/GitHub/Confluence.
- `references/decision-doc-template.html` — self-contained HTML skeleton (toolbar/TOC/sections, Mermaid wiring, view-code + as-is/with-layer toggles). Best for hosted review.
- `references/publish-and-share.md` — GitHub→Vercel hosting, deploy-auth gotcha, and Slack share-message patterns. Read only when publishing.

## Handling incomplete information

Generate what the material supports, turn every unknown into an `Open` row with a specific question, and add an "Open questions" section listing them by owner. A doc that honestly says "we don't know X yet, and Y owns that call" is more useful than one that papers over the gap.
