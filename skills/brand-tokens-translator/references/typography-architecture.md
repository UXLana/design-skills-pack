# Typography Architecture

Patterns for translating brand typography into a layered token system. Consult alongside SKILL.md when extracting typography tokens.

## Layer Structure

```
Atomic (individual values)   →  font.family.primary, font.weight.bold, font.size.md
Composite (text styles)      →  font.body.md.high → combines family + weight + size + line-height
```

## Atomic Extraction

### Font Family

| Token | Source |
|-------|--------|
| `font.family.primary` | Primary brand typeface |
| `font.family.secondary` | Secondary typeface if defined |
| `font.family.mono` | Code / technical typeface |
| `font.family.fallback` | System fallback stack |

### Font Weight

Map brand terminology to numeric values:

| Brand Terms | Token | Value |
|-------------|-------|-------|
| Regular, Normal, Body | `font.weight.regular` | 400 |
| Medium | `font.weight.medium` | 500 |
| Semibold, Demi | `font.weight.semibold` | 600 |
| Bold, Headlines, Strong | `font.weight.bold` | 700 |

Extract only weights present in the brand guidelines.

### Font Size Scale

| Token | Default | Typical Use |
|-------|---------|-------------|
| `font.size.xs` | 12px | Captions, meta |
| `font.size.sm` | 14px | Small body |
| `font.size.md` | 16px | Default body |
| `font.size.lg` | 18px | Large body |
| `font.size.xl` | 20px | Lead text |
| `font.size.2xl` | 24px | H4 |
| `font.size.3xl` | 30px | H3 |
| `font.size.4xl` | 36px | H2 |
| `font.size.5xl` | 48px | H1 |
| `font.size.6xl` | 60px | Display |
| `font.size.7xl` | 72px | Large display |

Use brand-specified sizes where available. Defaults above are fallbacks (Suggest level — label as `❓ Needs design decision` unless brand specifies values).

### Line Height

| Token | Value | Use |
|-------|-------|-----|
| `line-height.tight` | 1.2 | Headlines, display |
| `line-height.snug` | 1.3 | Subheadings |
| `line-height.normal` | 1.5 | Body (WCAG minimum) |
| `line-height.relaxed` | 1.75 | Long-form reading |

### Letter Spacing

| Token | Value | Use |
|-------|-------|-----|
| `letter-spacing.tight` | -0.025em | Large headlines |
| `letter-spacing.normal` | 0 | Body text |
| `letter-spacing.wide` | 0.025em | All caps, labels |

## Composite Patterns

### Body Text

3 sizes x 3 emphasis levels = up to 9 tokens. Include only those justified by the guidelines.

Pattern: `font.body.{size}.{emphasis}` — size: `sm|md|lg`, emphasis: `low|mid|high`

| Emphasis | Weight | Use |
|----------|--------|-----|
| low | regular (400) | Default body, secondary |
| mid | medium (500) | Labels, subheadings |
| high | bold (700) | Strong emphasis |

Example composite:

| Token | Family | Weight | Size | Line Height |
|-------|--------|--------|------|-------------|
| `font.body.md.low` | `{font.family.primary}` | `{font.weight.regular}` | `{font.size.md}` | `{line-height.normal}` |

### Headings

| Token | Weight | Size | Line Height |
|-------|--------|------|-------------|
| `font.heading.h1` | bold | 5xl (48px) | tight |
| `font.heading.h2` | bold | 4xl (36px) | tight |
| `font.heading.h3` | bold | 3xl (30px) | snug |
| `font.heading.h4` | bold | 2xl (24px) | snug |

### Display (if needed)

Use for hero/marketing. Include only sizes the brand defines or implies.

Pattern: `font.display.{size}` — sizes map to `font.size.*` scale.

### Meta

| Token | Weight | Size | Line Height |
|-------|--------|------|-------------|
| `font.meta.low` | regular | xs (12px) | normal |
| `font.meta.high` | medium | xs (12px) | normal |

## Brand Translation Guide

| Guideline Says | Action |
|----------------|--------|
| "Headlines: Inter Bold" | `font.family.primary` → "Inter", `font.weight.bold` → 700 |
| "Body: 16px regular" | `font.size.md` → 16px, `font.weight.regular` → 400 |
| "36pt headline" | Convert pt → px (×1.333 at 96dpi): 36pt ≈ 48px → `font.size.5xl`. Flag `⚑ Estimated` |
| Values in rem/em | Convert to px using base 16px. Flag `⚑ Estimated` if base is assumed |
| No line-height specified | Default 1.5 body / 1.2 headlines, label `⚑ Estimated` |
| No letter-spacing specified | Default 0 (normal), label `⚑ Estimated` |
| Weight not in guidelines | Do not create the token |

## Accessibility

- Body text minimum: 16px (WCAG recommended)
- Use 12px sparingly (meta/captions only)
- WCAG 1.4.12 text spacing: line-height ≥ 1.5x, paragraph spacing ≥ 2x, letter spacing ≥ 0.12em, word spacing ≥ 0.16em
- Optimal line length: 50–75 characters

### Noncompliant Source Values

When brand guidelines specify values that violate accessibility recommendations (e.g., body text below 16px, line-height below 1.5 for body, all-caps with tight spacing):
1. **Extract faithfully** — tokenize the value as specified, labeled `Extract`
2. **Flag the risk** — add a gap block noting the WCAG concern
3. **Suggest a compliant alternative** — offer an adjusted value as `❓ Needs design decision`

Do not silently normalize noncompliant values. The brand owner decides whether to accept the risk or adopt the alternative.
