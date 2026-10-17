---
name: token-audit
description: Scan prototype or product code for hardcoded design values (colors, spacing, typography, radii, shadows, z-index) and map each to an existing design token or flag it for tokenization. Use this skill during or after prototyping to catch values that should be using tokens. Lightweight and fast — run frequently. For deeper analysis including component extraction and interaction patterns, run a fuller pattern-extraction pass instead.
---

# Token Audit

Fast, focused scan of code for hardcoded design values. Maps every finding to an existing token or flags it for tokenization.

## When to Use

- During prototyping — quick check before committing
- After a build session — "what did I hardcode?"
- Before a PR — ensure token compliance
- Periodic hygiene — sweep a directory for drift

## Input

Provide one of:
- A file path to scan
- A directory path to scan
- A component name (will search for its files)

## Step 1: Load Token File

Before scanning code, read the project's design token file to know what tokens exist. Check for:
- `tokens.json`
- `design-tokens.md`
- `styles/themes/*.ts`
- `references/tokens.md`

Build an in-memory map of:
```
token name → value → category
```

## Step 2: Scan for Hardcoded Values

Search the target files for values that should be tokens:

| Category | What to grep | Pattern |
|----------|-------------|---------|
| Colors | Hex, rgb, rgba, hsl, named colors | `#[0-9a-fA-F]{3,8}`, `rgb(`, `rgba(`, `hsl(` |
| Spacing | padding, margin, gap with px/rem values | `[0-9]+px`, `[0-9]+rem` |
| Typography | fontSize, fontWeight, lineHeight, fontFamily | Numeric or string values |
| Border radius | borderRadius with px/rem/%  | `borderRadius:`, `border-radius:` |
| Shadows | boxShadow values | `boxShadow:`, `box-shadow:` |
| Z-index | zIndex with numeric values | `zIndex:`, `z-index:` |
| Transitions | transition/animation values | `transition:`, `animation:` |

## Step 3: Cross-Reference Against Tokens

For each hardcoded value found, check against the token map:

| Status | Meaning | Action |
|--------|---------|--------|
| **Has token** | Exact match exists in token file | Replace hardcoded value with token reference |
| **Near match** | Similar token exists (within 10% or 2px) | Review — round to token or justify exception |
| **No token** | No matching token exists | Decide: create new token or mark as intentional exception |

## Step 4: Output Report

```markdown
# Token Audit Report
**Scanned:** [file/directory]
**Date:** [timestamp]
**Token file:** [path to tokens]

## Summary
- **Total hardcoded values found:** [count]
- **Has token (replace now):** [count]
- **Near match (review):** [count]
- **No token (needs decision):** [count]
- **Compliance score:** [percentage]%

## Findings

### Colors
| Line | File | Hardcoded Value | Status | Token | Action |
|------|------|----------------|--------|-------|--------|
| 42 | Button.tsx | #1A1A1A | Has token | color.text.primary | Replace |
| 67 | Card.tsx | #F5F5F5 | Near match | color.surface.secondary (#F4F4F4) | Review |
| 89 | Modal.tsx | rgba(0,0,0,0.5) | No token | — | Create `color.overlay.default` |

### Spacing
| Line | File | Hardcoded Value | Status | Token | Action |
|------|------|----------------|--------|-------|--------|
| 15 | Card.tsx | padding: 16px | Has token | spacing.400 | Replace |
| 23 | Modal.tsx | gap: 12px | Has token | spacing.300 | Replace |
| 45 | Header.tsx | margin: 20px | No token | — | Review: use spacing.500 (24px)? |

### Typography
[Same table format]

### Other (radius, shadow, z-index, transitions)
[Same table format]

## Recommended Token Additions
| Proposed Token | Value | Reason | Occurrences |
|---------------|-------|--------|-------------|
| color.overlay.default | rgba(0,0,0,0.5) | Used as overlay in Modal, Drawer | 4 |

## Exceptions (Intentionally Not Tokenized)
| Value | File | Reason |
|-------|------|--------|
| 1px | Border.tsx | Single-pixel borders are universal |
```

---

## Rules

1. **Read tokens first** — Never flag a value without checking if a token exists.
2. **Show file and line** — Every finding must include exact location.
3. **Don't over-flag** — `1px` borders, `0` values, and `100%`/`auto` are usually fine.
4. **Group by category** — Colors together, spacing together. Don't interleave.
5. **Suggest specific tokens** — Don't just say "use a token." Say which one.
6. **Calculate compliance score** — (values with tokens / total values) × 100.
7. **Consider context** — `color: inherit` or computed values are not violations.

---

## Difference from a deeper pattern-extraction pass

| | token-audit | Pattern-extraction pass |
|--|-------------|---------------|
| **Scope** | Tokens only | Tokens + components + interactions + inconsistencies |
| **Speed** | Fast, single-purpose | Slower, comprehensive |
| **When** | Frequently: mid-session, pre-PR | Occasionally: pre-planning, audits |
| **Output** | Token mapping table | Full audit report |

Run **token-audit** for quick sweeps. Run a fuller pattern-extraction pass for the full picture.

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
      { file: "...", line: 42, hardcoded: "#0066ff", suggested_token: "color.brand.primary" }
    ],
    audit_date: "<ISO date>"
  }
}
```

Skip if zero violations and no prior history on this scope. Future runs of token-audit (and related skills such as design-system-perspectives) can recall this when working on the same area.
