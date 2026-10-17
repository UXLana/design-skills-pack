---
name: brand-tokens-translator
description: Analyze brand guidelines (PDF, text, or screenshots) and translate them into foundational design tokens. Produces atomic (primitive) and composite (semantic) tokens for color, typography, spacing, radius, elevation, opacity, z-index, motion, icons, and focus states. Outputs structured markdown compatible with Figma Variables and CSS custom properties.
---

# Brand → Design Tokens Translator

Extract foundational design tokens from brand guidelines using atomic + composite architecture.

## Core Principles

1. **Atomic + Composite** — Primitives hold raw values; composites alias primitives via `{token.reference}` syntax
2. **Token-only output** — No component definitions, layouts, or code
3. **No brand prefixes** — Use `color.green.forest` not `acme.green.forest`
4. **Naming by layer** — Atomics describe appearance (`color.green.forest`); composites describe purpose (`color.primary.default`)
5. **Explicit gaps** — Flag missing values as `❓ Needs design decision`
6. **Conditional categories** — Include a category only if it has at least one Extract, Infer, or Estimate token. Omit categories with only Suggest-level gaps. Append a "Gaps" section at the end listing omitted categories that may need design decisions

## Confidence Ladder

Apply in this order. Label every token with its source level.

| Level | Meaning | Label | Example |
|-------|---------|-------|---------|
| **Extract** | Value stated in guidelines | *(none)* | Hex from style guide page |
| **Infer** | Clearly implied by guidelines | `⚑ Inferred` | Hover = next darker swatch in palette |
| **Estimate** | Reasonable derivation, not stated | `⚑ Estimated` | Screenshot color-picked value |
| **Suggest** | No basis in guidelines | `❓ Needs design decision` | Feedback/error colors not defined |

Never present Suggest-level values as facts. Always include options and rationale.

The Source column in output tables uses: `Extract`, `⚑ Inferred`, `⚑ Estimated`, or `❓ Needs design decision`. Extract-level tokens carry no inline annotation.

## Token Naming

### Pattern

`category.role.variant.state` — use only segments needed.

### Allowed categories

`color` `font` `line-height` `letter-spacing` `space` `radius` `elevation` `opacity` `z` `duration` `easing` `icon` `focus`

### Rules

- Dot notation, lowercase, hyphens for multi-word (`on-light`, `high-emphasis`)
- Atomics: descriptive of the value — `color.green.forest`, `font.size.md`, `space.component.lg`
- Composites: semantic intent — `color.primary.default`, `font.body.md.high`, `color.text.on-light.high`

## Token Categories

Include only those relevant to the input. Prioritize in this order:

1. **Color** — Atomic primitives + semantic composites with states
2. **Typography** — Font family, weight, size, line-height + composite text styles
3. **Spacing** — Component scale (4px base) + pattern scale (8px base)
4. **Radius** — Border radius scale
5. **Elevation** — Shadow/depth scale
6. **Opacity** — Transparency values
7. **Z-Index** — Layer management
8. **Motion** — Duration and easing
9. **Icon** — Size and stroke
10. **Focus** — Ring width, offset, color

### Extraction Patterns (categories 3–10)

| Category | Base Unit | Common Tokens | Where to Find |
|----------|-----------|---------------|---------------|
| Spacing | 4px (component), 8px (layout) | `space.{scale}`: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) | Padding/margin specs, grid definitions |
| Radius | px | `radius.{scale}`: none(0) sm(4) md(8) lg(16) full(9999) | Button/card specs, component corners |
| Elevation | CSS shadow | `elevation.{level}`: none, sm, md, lg, xl | Card/modal/dropdown examples |
| Opacity | 0–1 | `opacity.disabled`(0.38) `opacity.hover`(0.08) `opacity.overlay`(0.5) | Disabled states, overlays |
| Z-Index | integer | `z.{layer}`: dropdown(1000) sticky(1100) modal(1300) toast(1500) | Modal/overlay stacking |
| Motion | ms / easing | `duration.fast`(150) `duration.normal`(250) `duration.slow`(400) + `easing.default` | Transition specs |
| Icon | px | `icon.size.{scale}`: sm(16) md(20) lg(24) + `icon.stroke`(1.5–2) | Icon usage specs |
| Focus | px + color | `focus.ring.width`(2) `focus.ring.offset`(2) `focus.ring.color`({color.primary.default}) | Focus state examples |

Use brand values where specified. Defaults above are Suggest-level — flag as `❓ Needs design decision`. Do not output full default scales; only include tokens that correspond to values found in or derived from the guidelines.

## Interactive States

Apply states to composite color tokens by semantic group:

| Group | Applicable States |
|-------|-------------------|
| Interactive (buttons, controls) | default, hover, active, focus, focus-visible, disabled, loading |
| Links | default, hover, visited, focus |
| Selection (checkboxes, radios) | default, selected, disabled, error, focus |
| Text, surface, border | No interactive states — use emphasis variants instead |

Do not generate state tokens for groups that don't need them.

## Gap Handling Format

Use this single format everywhere:

```
❓ Needs design decision — {what's missing}
   Source: {what the guidelines show or omit}
   Suggested default: {value} (confidence: Suggest)
   Options: {alternatives}
   Notes: {a11y or other considerations}
```

## Workflow

1. Receive brand input (PDF, text, or screenshot)
2. Extract raw values → assign atomic tokens (appearance-based names)
3. Build composite tokens → alias atomics (semantic names)
4. Apply state variants to interactive composites
5. Flag gaps per format above; apply Confidence Ladder labels
6. Output structured markdown per output format below

## Source Precedence

When inputs conflict, use this priority order:
1. Style guide / specification page (highest authority)
2. Design system documentation or component specs
3. Marketing collateral or application screenshots (lowest authority)

If two sources at the same level disagree, flag the conflict and present both values as options in a gap block.

For multi-brand or sub-brand documents, produce one token set per brand. Do not merge palettes across brands unless the guidelines explicitly define a shared foundation.

Flag screenshot-derived values as `⚑ Estimated`. Pantone/CMYK values should be converted to closest hex equivalent and flagged as `⚑ Estimated`.

## Output Format

### Atomic Tokens

| Token | Value | Source | Description |
|-------|-------|--------|-------------|
| `color.green.forest` | #XXXXXX | Extract | Primary brand green |

### Composite Tokens

| Token | References | Source | Description |
|-------|------------|--------|-------------|
| `color.primary.default` | `{color.green.forest}` | Extract | Primary interactive color |

### Composite Text Styles

| Token | Family | Weight | Size | Line Height | Source |
|-------|--------|--------|------|-------------|--------|
| `font.body.md.low` | `{font.family.primary}` | `{font.weight.regular}` | `{font.size.md}` | `{line-height.normal}` | Infer |

## Reference Files

Consult when working on the specific category:

- `references/color-architecture.md` — Color extraction patterns, state derivation, a11y contrast
- `references/typography-architecture.md` — Type extraction patterns, composite scales, a11y requirements
