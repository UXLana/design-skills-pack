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

Use brand-specified sizes where available. Defaults above are fallbacks at Needs-design-decision level: label them `❓ Needs design decision` unless the brand specifies values.

### Line Height

| Token | Value | Use |
|-------|-------|-----|
| `line-height.tight` | 1.2 | Headlines, display |
| `line-height.snug` | 1.3 | Subheadings |
| `line-height.normal` | 1.5 | Body (readability recommendation) |
| `line-height.relaxed` | 1.75 | Long-form reading |

### Letter Spacing

| Token | Value | Use |
|-------|-------|-----|
| `letter-spacing.tight` | -0.025em | Large headlines |
| `letter-spacing.normal` | 0 | Body text |
| `letter-spacing.wide` | 0.025em | All caps, labels |

Em values are fine in tables and CSS. In the `.tokens.json`, DTCG dimensions allow only px and rem, so convert em to px at the style's font size (see SKILL.md).

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

## Accessibility and Readability

Keep WCAG requirements and readability recommendations apart, so a brand value is never reported as a WCAG failure when it isn't one.

### WCAG requirements that touch type tokens

- **SC 1.4.3 Contrast (Minimum), AA:** 4.5:1 for text, 3:1 for large text (at least 18pt / 24px, or 14pt / about 18.66px bold). Checked on color pairs; see `color-architecture.md`.
- **SC 1.4.4 Resize Text, AA:** text must resize to 200% without loss of content or function. WCAG sets no minimum font size; rem-based sizes make resizing easier.
- **SC 1.4.12 Text Spacing, AA:** nothing may break when a user overrides line height to 1.5× the font size, paragraph spacing to 2×, letter spacing to 0.12em and word spacing to 0.16em. It doesn't require you to ship those values as defaults; it is a test the components must pass.

### Readability recommendations (not WCAG requirements)

- Body text around 16px; use 12px sparingly (meta/captions only)
- Body line height around 1.5. Only SC 1.4.8 Visual Presentation (AAA) asks for space-and-a-half line spacing
- Line length around 50–75 characters. SC 1.4.8 (AAA) caps width at 80 characters
- Avoid tight letter spacing on all-caps text

### Values Below a Recommendation

When brand guidelines specify values below a readability recommendation (e.g., body text below 16px, body line height below 1.5, all caps with tight spacing):
1. **Extract faithfully** — tokenize the value as specified, labeled `Extract`
2. **Flag the risk** — add a gap block that names it as a readability recommendation, not a WCAG failure. Contrast failures are WCAG failures; see `color-architecture.md`
3. **Suggest an alternative** — offer an adjusted value as `❓ Needs design decision`

Don't silently normalize these values. The brand owner decides whether to accept the risk or adopt the alternative.
