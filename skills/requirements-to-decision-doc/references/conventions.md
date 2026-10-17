# Decision-Doc Conventions

Shared conventions for the HTML review artifact. These exist so a series of decision docs feel like one product line and so a Confluence mirror step, if you use one, can map them cleanly.

## Why honesty-about-certainty is the core feature

A review artifact competes for scarce reviewer attention. If everything looks equally settled, reviewers either rubber-stamp it or re-litigate things that were already decided. Tagging every claim by certainty does two jobs at once: it earns trust on the `Decided` items (so engineering can estimate against them) and it concentrates feedback on the `Open` items (where you actually need it). Never blur this line to make the doc look more "finished" — the gaps *are* the value.

## Status tokens

Define these CSS variables and reuse them everywhere (pills, diagram node fills, lozenges):

```css
--done:#137a40;     --done-bg:#e6f5ec;   /* Decided  → green  (4.80:1 on its bg, 5.40:1 on white) */
--blue-ink:#1a56c4; --blue-soft:#e8f0fe; /* Assumed  → blue   (5.78:1 on its bg) */
--assess:#9a5b06;   --assess-bg:#fff3e0; /* Open     → amber  (4.94:1 on its bg, 5.42:1 on white) */
--action:#7c3aed;   --action-bg:#f1e9fe; /* Proposed → purple (4.84:1 on its bg) */
```

Text in these colors must stay at 4.5:1 or more against its background (WCAG 2.2 AA, 1.4.3; the pills are small text). If you change a color, re-check every pair with a contrast checker. Use `--blue-ink` for blue *text*; the brighter `#1f6fe5` is only 4.11:1 on `--blue-soft`.

Pill markup: `<span class="pill p-ok">Decided</span>` (ok=green, info=blue, med=amber; use the purple `--action` for Proposed). For a secondary qualifier (e.g. "Confirm w/ eng"), use a `.chip` with `white-space:nowrap` so it never wraps onto two lines next to a pill.

## Accessibility

- **Status is never color alone.** Pills print the status word; diagrams print it in node labels or a legend under the diagram.
- **Permission matrix:** the ✓ / ▲ / · glyphs are `aria-hidden="true"`, each followed by visually-hidden text ("Yes", "Conditional", "No"). Screen readers otherwise read "check mark", "black up-pointing triangle", "middle dot". The "no" glyph uses `#6b7280` (4.83:1), not a pale grey.
- **Diagrams:** every Mermaid source starts with `accTitle:` and `accDescr:` lines. Mermaid turns them into the SVG's accessible name and description.
- **Controls:** the As-is / With-layer toggle buttons carry `aria-pressed`; **View code** carries `aria-expanded`; "Copied" is announced through a polite live region.
- **Landmarks:** one `<main>`, and a labelled `<nav>` for the table of contents.

## Requirement IDs

`R-<GROUP>-<n>` — e.g. `R-ROLE-1`, `R-CREATE-2`, `R-AI-5`. Stable IDs let reviewers reference a row in a comment and let you trace it into Confluence/Jira later.

## Flows

- Mermaid, color-coded **by lifecycle status**, not by role. Reuse the status tokens for node fills.
- When a `Proposed` layer exists, provide two variants behind a segmented toggle: **As-is** (active by default) and **With <layer> assist**. Render both, then hide the inactive one — never `display:none` before Mermaid runs or the hidden diagram renders at 0 width.
- Draw proposed-layer nodes as **dashed** connectors pointing *into* the workflow (advisory), never *on* the main path. This visually reinforces that the layer assists a step but cannot advance state on its own — important when the layer is AI and the audit story matters.
- Number proposed-layer touchpoints (① ② ③ …) consistently across every diagram and the explanatory cards, so a reader can trace the same touchpoint everywhere.
- Keep diagram note/annotation colors consistent with the layer's node color (e.g. for a state diagram, set `themeVariables.noteBkgColor/noteBorderColor/noteTextColor` to the purple ramp).

## Diagram "view code" component

Each diagram gets a single **View code** button that toggles to **Hide**. Revealing shows the read-only Mermaid source with an **icon-only** copy button (top-right) that swaps to a green checkmark on success. One button, not four — keep the toolbar quiet so the diagram is the focus.

## Header

Kicker · title · one-line description · `Last edited <absolute date>` · status legend (each pill paired with its meaning). No "Purpose:" sentence — it reads as filler. Don't tell readers how to think about the doc; state what it is and let them react.

## Em-dashes in shared copy

Default: for Slack/share text, prefer periods and colons over em-dashes; adjust to the user's style. Inside the HTML body, em-dashes are fine.
