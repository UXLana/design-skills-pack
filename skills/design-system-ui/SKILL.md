---
name: design-system-ui
description: >
  Run a deliberate visual-design and UX pass on an existing design-system
  documentation surface: hierarchy, spacing, interaction and focus states,
  responsive behavior, motion, density, and empty/loading/error states. Use when
  the user wants to polish, tighten, clean up, or redesign a docs page, sidebar,
  playground shell, or header. The skill is repo-aware and brand-neutral. Make a
  direct edit for a one-line mechanical change. Route new components, routes,
  patterns, or token values to their builder skills; fix shipped component
  behavior in its source; use design-accessibility for a formal accessibility
  audit or report.
---

# Design System UI

Make an existing design-system documentation app *look and feel* better — without
inventing new surfaces or tokens. This skill is for the **craft pass**: you have a page
(or the sidebar, or the playground shell) that works but feels flat, cramped, noisy, or
inconsistent, and you want to raise it to the quality bar the design system itself is
supposed to demonstrate. The docs app is the showroom; it should be the best-looking
consumer of the system.

## When to use this (and when NOT to)

The honest test for whether this skill earns its keep over a plain edit:

- **Direct edit** (skip this skill): a surgical, mechanical change with one obvious answer —
  remove a label, swap one token, fix a typo, change a single value. No design judgment
  needed. Just do it.
- **This skill**: a *deliberate UX pass* on a surface where "how should this look and feel"
  is the actual question — hierarchy, spacing rhythm, state design, responsive behavior,
  polish across several interacting elements. Anything you'd describe as "make this nicer /
  cleaner / tighter," "improve the UX," or "redesign this page."

If the request needs a *new* component, route, pattern, or token value, stop and redirect —
this skill only refines what already exists:

| Request | Route to |
|---|---|
| New UI component (button, card, modal) | `/component-generator` |
| New page, route, nav entry, or pattern | your design system's build/scaffolding workflow |
| New or changed token *values* | `/brand-tokens-translator` |
| New or changed icons | `/icon-generator` |
| Fixing a *shipped component's* own behavior/bug (its focus ring, its props) | the component's source — this skill only touches the **docs app**, not the system's components |
| A formal accessibility **audit + compliance report** | `/design-accessibility` (this skill checks contrast/a11y as part of a UX pass, but doesn't produce the audit) |

The reason for the boundary isn't bureaucracy — it's that creating surfaces and tokens is
where architecture decisions live (naming, firewall, theme retargeting), and fixing a shipped
component or producing a compliance report are different jobs with their own tools. This skill
refines how the **docs app** looks and feels; that's it. Refinement is safe to do quickly.

## Step 1 — Orient (never hardcode paths or tokens)

This skill runs against *whatever* design system's docs app is active, so the first move is
always to learn the repo, not assume it. Hardcoded paths and token names are how a docs-UX
skill rots — they were true for one repo and silently wrong for the next.

1. **Read the project `CLAUDE.md`** (and any `client.config.json` / `*.config.*`) to learn
   the active system: where the docs app lives, the layer/firewall rules, and the token story.
2. **Find the docs app** — typically a Next.js/Vite app under `apps/docs`, `apps/web`,
   `docs/`, or similar. Confirm by locating its global stylesheet and a page/route.
3. **Learn the token interface before styling.** Find how tokens are exposed and *use that
   exact surface*:
   - CSS custom properties (e.g. `var(--ds-*)` / `var(--prefix-*)`) — read the generated
     token CSS to get real names. This is the common case.
   - or a TS/JS token export (e.g. `import { spacing } from "…/tokens"`) — read the file,
     use only names that exist.
   Never invent a token name. If a value you need has no token, that's a *missing token* —
   flag it for `/brand-tokens-translator`, don't hardcode a hex/px.
4. **Note the verification tooling** the repo already has: a token-discipline linter
   (e.g. a `lint-token-discipline` script, sometimes with a docs-only scope), a
   browser-QA protocol, a dev server port. Use what's there.

## Step 2 — Audit the surface against the craft rubric

Before changing anything, look at the target surface and name what's actually wrong. Good
docs-app UX is mostly the same handful of things done consistently:

- **Visual hierarchy** — is the most important thing the most prominent? Type scale, weight,
  and color-emphasis should rank content; nothing competes with the page's primary object.
- **Spacing rhythm** — consistent, token-based spacing (a real scale, not ad-hoc px).
  Related things sit closer; sections breathe. Vertical rhythm reads as intentional.
- **Alignment & grid** — shared left edges, predictable gutters, no off-by-a-few drift.
- **Interaction states** — every interactive element has visible hover, focus-visible,
  active, and disabled states, all token-driven. Focus rings are never suppressed.
- **Motion** — transitions are quick and purposeful, built from motion tokens; everything
  honors `prefers-reduced-motion`.
- **Density & restraint** — enough whitespace; borders/shadows used sparingly and
  consistently (one elevation language, not five).
- **The full state matrix** — empty, loading, and error states are designed, not afterthoughts.
  A list has an empty state; an async surface has a loading state.
- **Responsive behavior** — the surface holds up across the real breakpoints; nothing
  overflows, clips, or collapses to zero width. (See `responsive-audit` for a deep pass.)
- **Contrast & a11y** — text ≥ 4.5:1 (≥ 3:1 large), in light *and* dark, verified at the
  token *pair* level. Accessible names on icon-only controls.
- **Consistency with the system** — the docs app should use the system's own primitives and
  token language, not bespoke one-offs. If you're reaching for a raw value, ask why a token
  doesn't cover it.

Write down the 3–8 specific issues you found. Vague "make it nicer" becomes a concrete list.

## Step 3 — Propose, then apply narrowly

- **Propose with rationale.** For a non-trivial pass, briefly say what you'll change and *why*
  (which rubric item it fixes). This lets the user redirect before you spend edits, and keeps
  the change explainable.
- **Use the narrowest CSS scope.** Prefer the surface's own/colocated styles or its existing
  stylesheet. Do **not** dump page-specific styles into the app-wide `globals.css` — that file
  is for genuine app-wide resets and primitives only. A page's quirks belong with the page.
- **Stay in your layer.** Refine the target surface. Touch shared components, foundations, or
  config only if the user explicitly asked — those have blast radius beyond the docs app.
- **Tokens only.** Every color, space, radius, shadow, type, z-index value comes from a token.
  The docs app is the system's showroom; hardcoded values there are doubly embarrassing.

## Step 4 — Verify in the browser (required), then lint

UX defects are mostly *rendered* defects — zero-width collapse, overflow, clipping, a focus
ring you can't see, a dark-mode contrast failure. Static checks can't see any of those, so a
real browser pass is non-negotiable for this skill.

1. Start/confirm the dev server (use the repo's configured port).
2. Open every affected surface with a browser tool (Playwright / chrome-devtools MCP). Capture
   **before/after screenshots**. Confirm zero console errors.
3. Walk the **state matrix and breakpoints**: default/hover/focus/active/disabled; empty/
   loading/error; and 320 / 640 / 768 / 1024 / 1280px. Confirm nothing overflows or collapses.
4. Check **light and dark**, and every client/theme the repo ships, for the surfaces you touched.
5. Run the repo's **token-discipline lint** (docs scope if it has one) — confirm you introduced
   no raw values.
6. If the repo keeps a browser-QA log, record the pass there in its format.

Report what you changed, the rubric items each change addressed, what you verified
(with screenshots), and any issue you couldn't resolve (e.g. a missing token to escalate).

## Firewall / brand-neutrality

If the repo declares a layer firewall (a brand-neutral core + client themes, e.g. an ADR), the
docs app must carry **no** other client's or employer's brand strings, and the core must stay
neutral. Use the system's own neutral token language. When in doubt, run the repo's firewall
audit before finishing.

$ARGUMENTS
