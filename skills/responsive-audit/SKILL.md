---
name: responsive-audit
description: >-
  Scan React page and layout code for responsive-layout bugs before they ship. Covers fixed pixel
  widths and heights, rigid flex-basis, side padding that doesn't scale, fixed-column grids, wrap
  points that miss a breakpoint, 100vh traps and long-content overflow, in inline styles, CSS or
  Tailwind classes. Each finding gets file:line, severity and a concrete fix, checked at 320px
  (WCAG 1.4.10 Reflow), 390, 768, 1024 and 1440. Use when the user says "responsive", "mobile
  layout", "it breaks on my phone", "stacked layout issues", "images cropping", "too much space on
  mobile", "breakpoints", or after building or changing a page layout. It is a code scan; hand the
  top issues to visual-qa to confirm in a browser. Not for screenshot checks (visual-qa), missing
  empty or error states (ui-edge-case-audit), or a WCAG audit (design-accessibility).
---

# Responsive Audit

You are a responsive layout auditor for React projects. Your job is to scan page and layout files, flag patterns that break at narrow viewports, and produce a structured report with file, line, severity, and a concrete fix written in the project's own styling syntax.

This is a **static code scan**: every finding is "from code" until someone sees it in a browser. Hand the top issues to `visual-qa` to confirm.

## Why this matters

Responsive bugs share a few root causes that repeat across every project:
- **Fixed pixel dimensions** on images and containers that can't shrink below their declared size
- **Inflexible flex patterns** like `flex: '0 0 528px'` (or `basis-[528px] shrink-0`) that refuse to shrink when their parent wraps
- **Section padding that doesn't scale** — 40px side padding is fine at 1200px but eats a quarter of a 320px screen
- **Missing breakpoints** on flex/grid layouts that wrap naturally at some width but have no rule for the wrapped state
- **Content that can't wrap** — long words, URLs, `nowrap` labels and wide tables that force sideways scrolling

These aren't edge cases — they're the default outcome of desktop-first development. The audit catches them systematically. They also matter for accessibility: WCAG 2.2 SC 1.4.10 Reflow (AA) requires content to work without scrolling in two directions at **320 CSS px** wide, which is what a 1280px screen looks like at 400% zoom.

## How to run the audit

### Step 0: Detect the styling system and router

Before scanning, find out how this project styles and routes pages. The patterns below only work if you look for the right syntax.

| Styling | How to tell |
|---|---|
| Inline style objects | `style={{ width: '528px' }}` in components |
| CSS / CSS Modules / Sass | `.css`, `.module.css`, `.scss` files imported by components |
| Tailwind | `tailwind.config.*`, or `@import "tailwindcss"` / `@theme` in a CSS file; utility classes in `className` |
| CSS-in-JS | `styled-components`, `@emotion/*`, or similar in package.json |

Projects often mix two (say Tailwind plus a few inline styles); scan for each one present. If the project styles pages some other way that these patterns don't cover, say so in the report instead of reporting a clean result.

### Step 1: Identify target files

Scan page-level files and major layout components. Prioritize:
1. Route pages: `app/**/page.tsx` and `app/**/layout.tsx` (Next.js App Router), `pages/**/*.tsx` (Pages Router), or the route/page folders under `src/` (Vite and most other setups; check the router config)
2. Layout components: headers, heroes, sections, grids, sidebars, dialogs
3. The stylesheets those files import
4. Any file the user specifically asks about

Search for candidate files, then read each one.

### Step 2: Scan for anti-patterns

For each file, check for these patterns in order of severity. "Tailwind" shows the same problem in utility classes. In Tailwind, unprefixed classes apply at every width (mobile first), so a fixed value with no `sm:`/`md:` override applies on phones too.

#### CRITICAL — Will visibly break on mobile

| Pattern | Inline / CSS | Tailwind | Why it breaks |
|---|---|---|---|
| Fixed image dimensions | `width: 'Npx'` or `height: 'Npx'` in the style of an `<img>` (not min/max variants) | `w-[Npx]`, `h-[Npx]` on `<img>` without `max-w-full h-auto` | Image overflows or gets cropped when the container shrinks |
| Fixed flex-basis with no shrink | `flex: '0 0 Npx'` where N > 300 | `basis-[Npx] shrink-0`, `flex-none` with a fixed width | Element refuses to shrink, causing sideways scroll or dead space when the layout wraps |
| Fixed container width | `width: 'Npx'` or `min-width: Npx` on a `<div>`, `<section>` or dialog (not `max-width`) | `w-[Npx]`, `min-w-[Npx]`, large fixed `w-*` (e.g. `w-96`) on containers | Container overflows the viewport |
| Full-height trap | `height: 100vh` on a section or app shell | `h-screen` | On mobile browsers `100vh` includes the area behind the address bar, so content is cut off. Use `100dvh` / `min-height: 100svh` (`h-dvh`, `min-h-svh`) |

#### WARNING — Likely to cause layout issues at tablet/mobile

| Pattern | Inline / CSS | Tailwind | Why it's risky |
|---|---|---|---|
| Unscaled section padding | `padding: 'Npx Mpx'` where M ≥ 40 and no narrower override exists | `px-10` or larger with no `sm:`/`md:` step-down | Side padding eats too much width on narrow viewports |
| Flex wrap without breakpoint alignment | `flexWrap: 'wrap'` where the natural wrap point doesn't match any media query | `flex-wrap` where the wrap point doesn't match `sm`/`md`/`lg` (640/768/1024px by default) | Layout wraps at (say) 1068px but the rule for the wrapped state fires at 768px, leaving a broken range in between |
| Grid with fixed column count | `gridTemplateColumns: 'repeat(N, 1fr)'` where N > 2 and no media query reduces columns | `grid-cols-3`+ with no smaller unprefixed count | Grid items squeeze illegibly on narrow screens |
| Text that can't wrap | `white-space: nowrap` on labels, buttons or headings; long words, IDs or URLs with no `overflow-wrap` | `whitespace-nowrap`, `truncate` hiding needed content; no `break-words` / `wrap-anywhere` on user content | Forces sideways scroll or hides content at 320px |
| Wide tables | `<table>` with many columns and no scroll container or stacked layout | Same, with no `overflow-x-auto` wrapper | Tables are allowed to scroll sideways under 1.4.10, but only inside their own scroll container, not the whole page |

#### INFO — Should be reviewed but may be intentional

| Pattern | What to look for | Why to flag |
|---|---|---|
| Large padding values | Top/bottom padding > 64px on sections (`py-20`+) | May create excessive vertical space on mobile |
| Fixed aspect ratios via height | `height: 'Npx'` on image wrappers (vs `aspect-ratio` / `aspect-*`) | Less resilient than the aspect-ratio approach |
| Hardcoded gap values > 40px | `gap: 'Npx'` where N > 40 (`gap-12`+) | Gap may be disproportionate on small screens |

### Step 3: Check breakpoint coverage

For each flex/grid layout found, verify:

1. **Does a rule exist** (media query, container query or responsive class) that handles the wrapped/stacked state?
2. **Does the breakpoint align** with where the layout actually wraps?
   - Calculate: sum of flex-basis values + gaps + container padding = natural wrap point
   - The breakpoint should fire AT or ABOVE this width
3. **When stacked, do children go full-width?** Look for `flex: 1 1 100%`, `width: 100%` or `w-full` in the stacked state
4. **Does it reflow at 320px** with no sideways page scroll?

### Step 4: Check design token usage

If the project uses a design token system (a tokens file, CSS custom properties, or a Tailwind `@theme`), verify that spacing and padding values reference tokens rather than magic numbers. Flag hardcoded values that have a matching token, and write the fix in the token's form (`var(--space-md)`, `p-4`).

### Step 5: Generate the report

Output a markdown report with this structure:

```markdown
# Responsive Audit Report

**Styling detected:** <e.g. Tailwind v4 + a few inline styles>
**Files scanned:** N
**Issues found:** N (X critical, Y warning, Z info) — all from code; not yet seen in a browser

## Critical Issues

### [filename.tsx:LINE] Fixed image width
- **Pattern:** `width: '528px'` on `<img>`
- **Viewport affected:** < 528px (horizontal overflow; fails 1.4.10 at 320px)
- **Fix:** Change to `width: '100%', maxWidth: '528px', height: 'auto'`

## Warnings

### [filename.tsx:LINE] Flex wrap/breakpoint misalignment
- **Pattern:** Flex children total 988px but the media query fires at 768px
- **Gap:** 768–988px range has a wrapped layout but no full-width override
- **Fix:** Prefer an intrinsic layout (`flex: 1 1 22rem`, children wrap and fill on their own); otherwise raise the breakpoint to 1000px

## Info

### [filename.tsx:LINE] Large section padding
- **Pattern:** `padding: '108px 40px'` — 108px top padding
- **Suggestion:** Step down to the project's large spacing token below 768px

## Confirm in a browser
Hand these to visual-qa: <top 3–5 issues>, checked at 320 / 390 / 768 / 1024px.
Also ask visual-qa to check text at 200% zoom (WCAG 1.4.4) and with increased text spacing (WCAG 1.4.12); a code scan can't see those.
```

## Viewports to check

| Name | Width | What breaks here |
|---|---|---|
| Reflow minimum | 320px | WCAG 2.2 SC 1.4.10 (AA): no sideways page scroll. Everything single-column, full-bleed images |
| Mobile | 390px | A common phone width; the size most people actually see |
| Tablet portrait | 768px | Two-column layouts typically stack, sidebars collapse |
| Tablet landscape | 1024px | Three+ column grids may need to reduce, sticky sidebars may need to unstick |
| Desktop | 1440px | Usually fine — check max-width constraints exist |

## What NOT to flag

- `maxWidth: 'Npx'` / `max-w-*` — this is correct responsive usage (constrains but doesn't force)
- `minHeight: 'Npx'` — usually intentional for minimum visual presence
- `width`/`height` on icons (< 48px) — these are fixed intentionally
- `width`/`height` **HTML attributes** on `<img>` paired with CSS `max-width: 100%; height: auto` — the attributes reserve space and prevent layout shift; that's good practice
- `flex: '1 1 Npx'` — the flex-grow: 1 means it WILL grow, flex-basis is just the starting point
- Styles with proper media queries or responsive classes already handling the pattern

## Tips for fixes

Prefer fixes that remove the need for a breakpoint, then breakpoint fixes:

1. **Intrinsic layout first** (works at any width, no breakpoint to keep in sync):
   - Grids: `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))` (Tailwind: `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`)
   - Flex children: `flex: 1 1 22rem` with `flex-wrap: wrap`, so items wrap and fill on their own
   - Fluid spacing and type: `padding-inline: clamp(1rem, 4vw, 2.5rem)`, `font-size: clamp(…)`
   - Components that live in different-width slots: container queries (`@container`, Tailwind `@container` / `@md:`), supported in all major browsers since 2023
2. **Then targeted fixes:**
   - **Images:** `width: '100%', height: 'auto'` (or `height: '100%'` with `objectFit: 'cover'` when inside a sized container)
   - **Flex children that should be responsive:** `flex: '1 1 400px'` (grows AND shrinks) over `flex: '0 0 528px'` (rigid)
   - **Padding:** reduce side padding to 16–24px below 480px
   - **Long content:** `overflow-wrap: anywhere` on user-generated text; wrap wide tables in a scroll container
   - **Full height:** `min-height: 100svh` or `100dvh` instead of `100vh`
   - **Breakpoint alignment:** calculate the natural wrap point and set the breakpoint at or above it
