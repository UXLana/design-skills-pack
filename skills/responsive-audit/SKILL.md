---
name: responsive-audit
description: >
  Audit React/TSX pages for responsive layout issues — fixed pixel dimensions, inflexible flex patterns,
  unscaled padding, missing breakpoints, and images that crop or overflow at narrow viewports.
  Use this skill whenever the user mentions "responsive", "mobile layout", "stacked layout issues",
  "images cropping", "too much space on mobile", "fix responsive", "breakpoints", "viewport", or
  when reviewing any page that renders differently across screen sizes. Also use proactively after
  building or modifying page layouts, flex/grid sections, or image containers — responsive bugs are
  cheap to catch early and expensive to debug after deployment.
---

# Responsive Audit

You are a responsive layout auditor for React projects that use **inline styles + CSS media queries** (not Tailwind). Your job is to scan page files, flag layout patterns that break at narrow viewports, and produce a structured report with file, line, severity, and a concrete fix.

## Why this matters

Responsive bugs share a few root causes that repeat across every project:
- **Fixed pixel dimensions** on images and containers that can't shrink below their declared size
- **Inflexible flex patterns** like `flex: '0 0 528px'` that refuse to shrink when their parent wraps
- **Section padding that doesn't scale** — 40px side padding is fine at 1200px but eats 25% of a 360px screen
- **Missing breakpoints** on flex/grid layouts that wrap naturally at some width but have no media query to handle the wrapped state gracefully
- **Image height/width locks** that cause cropping or overflow when the container resizes

These aren't edge cases — they're the default outcome of desktop-first development. The audit catches them systematically.

## How to run the audit

### Step 1: Identify target files

Scan for page-level files and major layout components. Prioritize:
1. `app/**/page.tsx` — route pages
2. `app/components/**/*.tsx` — layout components (heroes, sections, grids)
3. Any file the user specifically asks about

Use `Glob` to find candidates, then `Read` each file.

### Step 2: Scan for anti-patterns

For each file, check for these patterns in order of severity:

#### CRITICAL — Will visibly break on mobile

| Pattern | What to look for | Why it breaks |
|---|---|---|
| Fixed image dimensions | `width: 'Npx'` or `height: 'Npx'` on `<img>` elements (not min/max variants) | Image overflows or gets cropped when container shrinks |
| Fixed flex-basis with no shrink | `flex: '0 0 Npx'` where N > 300 | Element refuses to shrink, causes horizontal scroll or dead space when layout wraps |
| Fixed container width | `width: 'Npx'` on a `<div>` or `<section>` (not maxWidth) | Container overflows viewport |

#### WARNING — Likely to cause layout issues at tablet/mobile

| Pattern | What to look for | Why it's risky |
|---|---|---|
| Unscaled section padding | `padding: 'Npx Mpx'` where M >= 40 and no responsive override exists | Side padding eats too much horizontal space on narrow viewports |
| Flex wrap without breakpoint alignment | A flex container with `flexWrap: 'wrap'` where the natural wrap point doesn't align with any media query | Layout wraps at (say) 1068px but the media query to handle the wrapped state fires at 768px, leaving a broken range in between |
| Grid with fixed column count | `gridTemplateColumns: 'repeat(N, 1fr)'` where N > 2 and no media query reduces columns | Grid items squeeze illegibly on narrow screens |

#### INFO — Should be reviewed but may be intentional

| Pattern | What to look for | Why to flag |
|---|---|---|
| Large padding values | Top/bottom padding > 64px on sections | May create excessive vertical space on mobile |
| Fixed aspect ratios via height | `height: 'Npx'` on image wrappers (vs using `aspectRatio`) | Less resilient than aspect-ratio approach |
| Hardcoded gap values > 40px | `gap: 'Npx'` where N > 40 | Gap may be disproportionate on small screens |

### Step 3: Check breakpoint coverage

For each flex/grid layout found, verify:

1. **Does a media query exist** that handles the wrapped/stacked state?
2. **Does the breakpoint align** with where the layout actually wraps?
   - Calculate: sum of flex-basis values + gaps + container padding = natural wrap point
   - The media query should fire AT or ABOVE this width
3. **When stacked, do children go full-width?** Look for `flex: 1 1 100%` or `width: 100%` in the stacked breakpoint

### Step 4: Check design token usage

If the project uses a design token system (e.g., `app/theme/tokens.ts`), verify that spacing and padding values reference tokens rather than magic numbers. Flag hardcoded values that have a matching token.

### Step 5: Generate the report

Output a markdown report with this structure:

```markdown
# Responsive Audit Report

**Files scanned:** N
**Issues found:** N (X critical, Y warning, Z info)

## Critical Issues

### [filename.tsx:LINE] Fixed image width
- **Pattern:** `width: '528px'` on `<img>`
- **Viewport affected:** < 528px (horizontal overflow)
- **Fix:** Change to `width: '100%', maxWidth: '528px', height: 'auto'`

## Warnings

### [filename.tsx:LINE] Flex wrap/breakpoint misalignment
- **Pattern:** Flex children total 988px but media query fires at 768px
- **Gap:** 768–988px range has wrapped layout but no full-width override
- **Fix:** Either raise media query to 1000px or lower flex-basis to align with 768px

## Info

### [filename.tsx:LINE] Large section padding
- **Pattern:** `padding: '108px 40px'` — 108px top padding
- **Suggestion:** Consider reducing to 3xl (40px) or 4xl (48px) token value on mobile
```

## Conceptual breakpoints

Reference these viewport widths when analyzing:

| Name | Width | What breaks here |
|---|---|---|
| Mobile | 360px | Everything must be single-column, full-bleed images |
| Tablet portrait | 768px | Two-column layouts typically stack, sidebars collapse |
| Tablet landscape | 1024px | Three+ column grids may need to reduce, sticky sidebars may need to unstick |
| Desktop | 1440px | Usually fine — check max-width constraints exist |

## What NOT to flag

- `maxWidth: 'Npx'` — this is correct responsive usage (constrains but doesn't force)
- `minHeight: 'Npx'` — usually intentional for minimum visual presence
- `width`/`height` on icons (< 48px) — these are fixed intentionally
- `flex: '1 1 Npx'` — the flex-grow: 1 means it WILL grow, flex-basis is just the starting point
- Inline `<style>` blocks with proper media queries already handling the pattern

## Tips for fixes

When suggesting fixes, prefer these patterns:
- **Images:** `width: '100%', height: 'auto'` (or `height: '100%'` with `objectFit: 'cover'` when inside a sized container)
- **Flex children that should be responsive:** `flex: '1 1 400px'` (grows AND shrinks) over `flex: '0 0 528px'` (rigid)
- **Padding:** Use a responsive class or media query to reduce side padding to 20–24px below 480px
- **Breakpoint alignment:** Calculate the natural wrap point and set the media query at or above it
