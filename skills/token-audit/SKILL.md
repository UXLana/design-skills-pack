---
name: token-audit
description: Scan prototype or product code for hardcoded design values (hex, rgb, hsl or oklch colors, px/rem spacing, font sizes and weights, radii, shadows, z-index, transitions, Tailwind arbitrary values like bg-[#1a1a1a] or p-[13px], raw values inside CSS custom properties) and map each to an existing token or flag it for tokenization, with file:line, a suggested token and a compliance score. Reads tokens from tokens.json, DTCG or Style Dictionary files, Tailwind v4 @theme blocks, or :root custom properties. Lightweight; run often. Use when the user says "what did I hardcode", "token audit", "check token compliance", "find magic numbers", "are we using tokens", "pre-PR token check", or after a prototyping session. Not for creating the token set itself (brand-tokens-translator or theme-generator) or for contrast and WCAG checks (design-accessibility).
---

# Token Audit

Fast, focused scan of code for hardcoded design values. Maps every finding to an existing token or flags it for tokenization.

## When to Use

- During prototyping — quick check before committing
- After a build session — "what did I hardcode?"
- Before a PR — ensure token compliance
- Periodic hygiene — sweep a directory for drift

## Not This Skill

- Creating the token set from brand guidelines → `brand-tokens-translator`
- Generating a theme from a brand color, or auditing theme coverage → `theme-generator`
- Contrast and other WCAG checks → `design-accessibility`

## Input

Provide one of:
- A file path to scan
- A directory path to scan
- A component name (will search for its files)

## Step 1: Load Tokens

Read the project's tokens before scanning code, so every finding can name a real token. Look for:

| Source | How to recognize it |
|--------|---------------------|
| DTCG files | `*.tokens.json`, `*.tokens` or `tokens.json` whose tokens have `$value` / `$type` |
| Style Dictionary sources | `tokens/**/*.json` (or `.js`) with `value` keys, next to a Style Dictionary config (`config.json`, `sd.config.*`, `style-dictionary.config.*`) |
| Tailwind v4 | CSS with an `@theme { … }` block (`--color-*`, `--spacing`, `--radius-*`, `--shadow-*`, `--text-*`, …) |
| Tailwind v3 | `tailwind.config.{js,ts}` → `theme` / `theme.extend` |
| CSS custom properties | `:root { --…: … }` in global or token CSS |
| Theme objects | `theme.ts`, `tokens.ts`, `styles/themes/*` |
| Token docs | `design-tokens.md`, `references/tokens.md` (last resort; may be stale) |

Then resolve before you compare:

- **Aliases:** follow `{color.green.forest}`, `var(--color-green-forest)` and theme-object references to final values. Keep both the primitive and the semantic name. When a hardcoded value matches both, suggest the semantic token, because it survives theme changes.
- **Modes:** read values under `[data-theme="dark"]`, `.dark`, `@media (prefers-color-scheme: dark)`, or one DTCG file per mode. Match against the mode the code renders in. If a value matches a token in only one mode, say in the Action column that replacing it makes the component follow the other mode too (usually the point, but the user should know).

Build an in-memory map of:
```
token name → resolved value per mode → category → how the code consumes it
```

## Step 2: Scan for Hardcoded Values

Search the target files for values that should be tokens, and count token usages as you go (for the score).

| Category | What to find | Pattern hints |
|----------|-------------|---------------|
| Colors | Hex, rgb/rgba, hsl/hsla, hwb, lab/lch, oklab/oklch, `color()`, `color-mix()` with literal colors | `#[0-9a-fA-F]{3,8}\b`, `\b(rgba?\|hsla?\|hwb\|lab\|lch\|oklab\|oklch\|color\|color-mix)\(` |
| Spacing & size | px/rem/em on spacing and sizing properties only: padding, margin, gap, inset, top/right/bottom/left, width/height (incl. min/max) | Property name + number with unit |
| Typography | font-size, font-weight, line-height, letter-spacing, font-family literals | `font-size:`, `fontWeight:`, … |
| Border radius | border-radius values | `borderRadius:`, `border-radius:` |
| Shadows | box-shadow, text-shadow, `drop-shadow()` | `boxShadow:`, `box-shadow:` |
| Z-index | Numeric z-index | `zIndex:`, `z-index:` |
| Transitions | Literal durations and easing in transition/animation | `\d+m?s\b`, `cubic-bezier(` |
| Tailwind arbitrary values | `bg-[#1a1a1a]`, `text-[22px]`, `p-[13px]`, `rounded-[6px]`, `shadow-[…]`, `z-[60]`, and arbitrary properties like `[padding:13px]` | `-\[[^\]]+\]`, `\[[a-z-]+:[^\]]+\]` |
| `var()` fallbacks | `var(--x, #fff)`: the fallback ships whenever the token is missing | `var\(--[\w-]+,\s*[^)]+\)` |
| Raw custom properties | `--card-bg: #f5f5f5;` declared outside the token source: a hardcoded value with a variable name | `--[\w-]+:\s*(#\|\d\|rgb\|hsl\|oklch)` in non-token files |
| Unitless inline numbers | JSX `style={{ padding: 16, zIndex: 10 }}`. React appends `px` to numbers on most properties (react.dev), so `padding: 16` is 16px | Numbers in `style={{ … }}` objects |

Only flag px on the properties listed. A bare `[0-9]+px` search also hits media queries (where `var()` can't be used), SVG attributes and 1px borders, and the real findings get buried.

Not hardcoded: Tailwind v4 `bg-(--brand)` (shorthand for `bg-[var(--brand)]`) when `--brand` is a token, and theme utilities like `p-4` or `bg-surface-subtle`. Count these as token usages.

## Step 3: Cross-Reference Against Tokens

For each hardcoded value found, check against the token map:

| Status | Meaning | Action |
|--------|---------|--------|
| **Has token** | Exact match after alias and mode resolution | Replace, in the syntax the code already uses |
| **Near match** | Colors: ΔEOK ≤ 0.02. Dimensions: within 2px of a token on the same property type | Review — snap to the token or justify the exception |
| **No token** | Nothing close | Decide: create a new token or mark as intentional exception |

**Color distance:** convert both colors to OKLab and take the Euclidean distance (ΔEOK, CSS Color Module Level 4 §20.3). CSS Color 4 treats 0.02 as one just-noticeable difference in OkLCh; with ΔE2000 in CIE Lab the equivalent is 2. Percent rules like "within 10%" don't work for color: the same channel change can be invisible in one hue and obvious in another.

**Snapping can break contrast.** When a color swap touches text, a background, a border or an icon, re-check the pair it sits in (4.5:1 for text, 3:1 for large text and UI components under WCAG 2.2 AA), or hand the pair list to `design-accessibility`. If the swap would drop a pair below its threshold, keep the finding at Review and say why.

**Suggest in the consumed syntax.** Write the replacement the way the file already uses tokens:
- CSS / CSS-in-JS → `var(--space-md)`
- Tailwind → the theme utility: `p-4` on the default 0.25rem spacing multiplier, or `p-md` if `@theme` defines `--spacing-md`
- JS theme object → `theme.space.md`

## Step 4: Output Report

```markdown
# Token Audit Report
**Scanned:** [file/directory]
**Date:** [timestamp]
**Token sources:** [paths, and modes found]

## Summary
- **Token usages found:** [count]
- **Hardcoded values found:** [count]
- **Has token (replace now):** [count]
- **Near match (review):** [count]
- **No token (needs decision):** [count]
- **Compliance score:** [percentage]% (token usages ÷ (token usages + hardcoded values))

## Findings

### Colors
| Line | File | Hardcoded Value | Status | Token | Replace with |
|------|------|----------------|--------|-------|--------------|
| 42 | Button.tsx | #1A1A1A | Has token | color.text.high | `var(--color-text-high)` |
| 67 | Card.tsx | bg-[#F5F5F5] | Near match (ΔEOK 0.003) | color.surface.subtle (#F4F4F4) | `bg-surface-subtle` — review |
| 89 | Modal.tsx | rgba(0,0,0,0.5) | No token | — | Create `color.overlay.dark` |

### Spacing
| Line | File | Hardcoded Value | Status | Token | Replace with |
|------|------|----------------|--------|-------|--------------|
| 15 | Card.tsx | padding: 16px | Has token | space.md | `var(--space-md)` |
| 23 | Modal.tsx | gap: 12px | Has token | space.sm | `var(--space-sm)` |
| 31 | Badge.tsx | p-[13px] | Near match | space.sm (12px) | `p-3` — review |
| 45 | Header.tsx | margin: 20px | No token | — | Review: `space.lg` (24px)? |

### Typography
[Same table format]

### Other (radius, shadow, z-index, transitions)
[Same table format]

## Recommended Token Additions
| Proposed Token | Value | Reason | Occurrences |
|---------------|-------|--------|-------------|
| color.overlay.dark | rgba(0,0,0,0.5) | Used as overlay in Modal, Drawer | 4 |

## Exceptions (Intentionally Not Tokenized)
| Value | File | Reason |
|-------|------|--------|
| 1px | Border.tsx | Single-pixel borders are universal |
```

---

## Rules

1. **Read tokens first** — Never flag a value without checking whether a token exists, after resolving aliases and modes.
2. **Show file and line** — Every finding must include exact location.
3. **Don't over-flag** — `1px` borders, `0` values, `100%`/`auto`, media-query breakpoints and SVG path data are usually fine.
4. **Group by category** — Colors together, spacing together. Don't interleave.
5. **Suggest specific tokens** — Don't just say "use a token." Name it, in the syntax the code consumes.
6. **Calculate the compliance score** — token usages ÷ (token usages + hardcoded values) × 100. Leave exceptions out of both counts. A file with many token usages and one stray hex should score high; one with no tokens at all should score 0.
7. **Consider context** — `color: inherit`, `currentColor` and computed values are not violations.

---

## Memory (optional)

If your setup has a persistent memory tool (an MCP memory server or similar), recall prior token-audit findings on the same scope before scanning, and save the result afterward.

### Recall first

Before scanning, search memory for prior token-audit findings on the same scope (e.g. query: `token-audit hardcoded values <project-or-file-name>`).

If hits come back, surface them — don't re-flag the same hardcoded values that were already triaged. If something flagged previously is still hardcoded, escalate (someone deferred it; reconfirm).

### Remember after

At the end of a meaningful audit (any non-zero violations, or a clean sweep on a previously-dirty area), save the result:

```
{
  content: "Token audit on <scope>: N violations found, mapped M to existing tokens, K need new tokens. Top hot spots: <file:line>.",
  tags: ["token-audit", "<project>", "<scope-slug>"],
  metadata: {
    skill: "token-audit",
    project: "<project>",
    scope: "<file-glob-or-component>",
    violations_count: N,
    mapped_count: M,
    new_token_candidates: K,
    top_violations: [
      { file: "...", line: 42, hardcoded: "#1e4d40", suggested_token: "color.primary.default" }
    ],
    audit_date: "<ISO date>"
  }
}
```

Skip if zero violations and no prior history on this scope. Future runs of token-audit (and related skills such as design-system-perspectives) can recall this when working on the same area.
