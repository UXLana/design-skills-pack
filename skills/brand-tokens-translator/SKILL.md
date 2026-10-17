---
name: brand-tokens-translator
description: 'Translate brand guidelines (PDF, style-guide text or screenshots) into foundational design tokens: atomic primitives plus semantic composites for color, typography, spacing, radius, elevation, opacity, z-index, motion, icon and focus, each labelled Extract, Inferred, Estimated or Needs design decision, with WCAG contrast checks and explicit gap blocks. Outputs a review table plus a Design Tokens Community Group (DTCG) 2025.10 .tokens.json that maps to CSS custom properties, and whose color, dimension, font-family, duration and number tokens Figma''s native variable import accepts. Use when the user says "turn this brand guide into tokens", "extract tokens from this style guide", "make a tokens.json from our brand", "set up Figma variables from the brand book", or shares brand guidelines and wants a token foundation. Not for generating a full product theme from one brand color (theme-generator), scanning code for hardcoded values (token-audit), or a formal accessibility audit (design-accessibility).'
---

# Brand → Design Tokens Translator

Extract foundational design tokens from brand guidelines using atomic + composite architecture.

## Core Principles

1. **Atomic + Composite** — Primitives hold raw values; composites alias primitives with DTCG `{group.token}` references
2. **Token-only output** — No component definitions, layouts, or code
3. **No brand prefixes** — Use `color.green.forest` not `acme.green.forest`
4. **Naming by layer** — Atomics describe appearance (`color.green.forest`); composites describe purpose (`color.primary.default`)
5. **Themes are modes, not names** — Light/dark and sub-brands are modes of the same composite names: `color.surface.default` has a light value and a dark value. Use `on-light` / `on-dark` only for a section whose background stays the same in every mode, such as an always-dark brand band. A component bound to `color.text.high` switches theme for free; one bound to `color.text.on-light.high` has to be rewired.
6. **Explicit gaps** — Flag missing values as `❓ Needs design decision`
7. **Conditional categories** — Include a category only if it has at least one Extract, Inferred or Estimated token. Omit categories that would hold only Needs-design-decision tokens, and list them in a closing "Gaps" section

## Confidence Ladder

Apply in this order. Label every token with its level, using exactly these four names everywhere: tables, gap blocks and JSON.

| Level | Meaning | Source column | JSON `confidence` | Example |
|-------|---------|---------------|-------------------|---------|
| **Extract** | Value stated in guidelines | `Extract` | `extract` | Hex from style guide page |
| **Inferred** | Clearly implied by guidelines | `⚑ Inferred` | `inferred` | Hover = next darker swatch in palette |
| **Estimated** | Reasonable derivation, not stated | `⚑ Estimated` | `estimated` | Screenshot color-picked value |
| **Needs design decision** | No basis in guidelines | `❓ Needs design decision` | (not in JSON) | Feedback/error colors not defined |

Never present a Needs-design-decision value as fact. Always include options and rationale.

## Token Naming

### Pattern

`category.role.variant.state` — use only segments needed.

### Allowed categories

`color` `font` `line-height` `letter-spacing` `space` `radius` `elevation` `opacity` `z` `duration` `easing` `icon` `focus`

### Rules

- Dot notation in tables; each dot is one nesting level in the JSON (`color.primary.default` is `"color" → "primary" → "default"`). DTCG names can't contain `.`, `{` or `}` or start with `$`, so each segment is lowercase with hyphens for multi-word (`on-dark`, `high-emphasis`)
- Atomics: descriptive of the value — `color.green.forest`, `font.size.md`, `space.md`
- Composites: semantic intent — `color.primary.default`, `font.body.md.high`, `color.text.high`
- One spacing scheme: `space.{t-shirt}` (`space.2xs` … `space.2xl`). Don't mix in numeric (`space.400`) or component/layout scales
- Platform names derive from the same path; see Targets

## Token Categories

Include only those relevant to the input. Prioritize in this order:

1. **Color** — Atomic primitives + semantic composites with states
2. **Typography** — Font family, weight, size, line-height + composite text styles
3. **Spacing** — One t-shirt scale on the brand's base unit (often 4px)
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
| Spacing | Brand's base unit (often 4px) | `space.{scale}`: 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) | Padding/margin specs, grid definitions |
| Radius | px | `radius.{scale}`: none(0) sm(4) md(8) lg(16) full(9999) | Button/card specs, component corners |
| Elevation | CSS shadow | `elevation.{level}`: none, sm, md, lg, xl | Card/modal/dropdown examples |
| Opacity | 0–1 | `opacity.disabled`(0.38) `opacity.hover`(0.08) `opacity.overlay`(0.5) | Disabled states, overlays |
| Z-Index | integer | `z.{layer}`: dropdown(1000) sticky(1100) modal(1300) toast(1500) | Modal/overlay stacking |
| Motion | ms / easing | `duration.fast`(150ms) `duration.normal`(250ms) `duration.slow`(400ms) + `easing.default` | Transition specs |
| Icon | px | `icon.size.{scale}`: sm(16) md(20) lg(24) + `icon.stroke`(1.5–2) | Icon usage specs |
| Focus | px + color | `focus.ring.width`(2) `focus.ring.offset`(2) `focus.ring.color`({color.primary.default}) | Focus state examples |

Use brand values where specified. The defaults above are Needs-design-decision level; flag them as `❓ Needs design decision`. Don't output full default scales; include only tokens that correspond to values found in or derived from the guidelines.

## Interactive States

Apply states to composite color tokens by semantic group:

| Group | Applicable States |
|-------|-------------------|
| Interactive (buttons, controls) | default, hover, active, focus, focus-visible, disabled, loading |
| Links | default, hover, visited, focus |
| Selection (checkboxes, radios) | default, selected, disabled, error, focus |
| Text, surface, border | No interactive states — use emphasis variants instead |

Don't generate state tokens for groups that don't need them.

## Gap Handling Format

Use this single format everywhere:

```
❓ Needs design decision — {what's missing}
   Source: {what the guidelines show or omit}
   Suggested default: {value}
   Options: {alternatives}
   Notes: {a11y or other considerations}
```

## Workflow

1. Receive brand input (PDF, text, or screenshot). If the project already has a tokens file, read it and update it in place rather than writing a second one
2. Extract raw values → assign atomic tokens (appearance-based names)
3. Build composite tokens → alias atomics (semantic names); give each composite one value per mode if the brand defines light/dark or sub-brands
4. Apply state variants to interactive composites
5. Flag gaps per format above; apply Confidence Ladder labels; run the contrast checks in `references/color-architecture.md`
6. Output the review table, then the `.tokens.json` (Output Format below)

## Source Precedence

When inputs conflict, use this priority order:
1. Style guide / specification page (highest authority)
2. Design system documentation or component specs
3. Marketing collateral or application screenshots (lowest authority)

If two sources at the same level disagree, flag the conflict and present both values as options in a gap block.

For multi-brand or sub-brand documents, treat each brand as a mode of one token set when the brands share token names, or as separate token sets when their structures differ. Don't merge palettes across brands unless the guidelines explicitly define a shared foundation.

Flag screenshot-derived values as `⚑ Estimated`. Convert Pantone/CMYK values to the closest hex equivalent and flag them as `⚑ Estimated`.

## Output Format

Always produce both: the review table (for people) and the `.tokens.json` (for tools).

### 1. Review table

#### Atomic Tokens

| Token | Value | Source | Description |
|-------|-------|--------|-------------|
| `color.green.forest` | #1E4D40 | Extract | Primary brand green |

#### Composite Tokens

One value column per mode; use a single References column when there are no modes.

| Token | Light | Dark | Source | Description |
|-------|-------|------|--------|-------------|
| `color.surface.default` | `{color.neutral.white}` | `{color.green.forest}` | ⚑ Inferred | Page background |

#### Composite Text Styles

| Token | Family | Weight | Size | Line Height | Source |
|-------|--------|--------|------|-------------|--------|
| `font.body.md.low` | `{font.family.primary}` | `{font.weight.regular}` | `{font.size.md}` | `{line-height.normal}` | ⚑ Inferred |

### 2. DTCG `.tokens.json`

Write the file in the Design Tokens Community Group format, version 2025.10 (designtokens.org; a stable Final Community Group Report, October 2025).

- **File name:** `brand.tokens.json` (`.tokens.json` is the spec's recommended extension). With modes, write one file per mode, such as `brand.light.tokens.json` and `brand.dark.tokens.json`, with identical token names and types and only the values differing. Figma's import creates one mode per file and keeps only tokens present in every file with the same `$type`. Tools that support the DTCG Resolver module can take a `.resolver.json` instead.
- **Every token** has `$value` and an explicit `$type`. A group-level `$type` is valid DTCG, but explicit types are the safest for importers.
- **Color:** `{"colorSpace": "srgb", "components": [r, g, b], "hex": "#rrggbb"}` with components from 0 to 1; add `alpha` only when it isn't 1. A bare hex string isn't a valid DTCG color value.
- **Dimension:** `{"value": 16, "unit": "px"}`. DTCG allows `px` and `rem`; Figma's import accepts only `px`, so write px and convert to rem in the CSS build if you want rem.
- **Duration:** `{"value": 0.15, "unit": "s"}`. DTCG allows `ms` or `s`; Figma's import accepts only `s`, so convert (150ms → 0.15s).
- **Alias:** `"$value": "{color.green.forest}"` resolves to that token's `$value`.
- **Letter spacing:** DTCG dimensions have no `em`, so convert at the style's font size (−0.025em at 48px = −1.2px) and keep the em value in `$description` for CSS.
- **Font family:** a single font name. Figma's import skips arrays; keep the fallback stack as its own token for CSS.
- **Other types:** line height → `number` (a multiplier of font size); font weight → `fontWeight` (1–1000); elevation → `shadow` (`color`, `offsetX`, `offsetY`, `blur`, `spread`, optional `inset`); easing → `cubicBezier` (`[x1, y1, x2, y2]`); text styles → `typography` (`fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight`).
- **Confidence and source** go in `$extensions` under a reverse-domain key, e.g. `"org.example.brand-tokens"`; replace `org.example` with your own domain. Tools ignore extension keys they don't know.
- **Leave Needs-design-decision tokens out**, along with any composite that aliases one. They stay in the review table's gap blocks. Once a value is in Figma or CSS it looks decided.

Worked example (an excerpt of `brand.light.tokens.json`; the font tokens the text style references are defined elsewhere in the file):

```json
{
  "color": {
    "green": {
      "forest": {
        "$type": "color",
        "$value": { "colorSpace": "srgb", "components": [0.118, 0.302, 0.251], "hex": "#1e4d40" },
        "$description": "Primary brand green",
        "$extensions": { "org.example.brand-tokens": { "confidence": "extract", "source": "Style guide p. 4" } }
      },
      "pine": {
        "$type": "color",
        "$value": { "colorSpace": "srgb", "components": [0.09, 0.231, 0.192], "hex": "#173b31" },
        "$extensions": { "org.example.brand-tokens": { "confidence": "inferred", "source": "Next darker swatch, p. 4" } }
      }
    },
    "primary": {
      "default": { "$type": "color", "$value": "{color.green.forest}" },
      "hover": {
        "$type": "color",
        "$value": "{color.green.pine}",
        "$extensions": { "org.example.brand-tokens": { "confidence": "inferred" } }
      }
    }
  },
  "space": {
    "md": { "$type": "dimension", "$value": { "value": 16, "unit": "px" } }
  },
  "duration": {
    "fast": { "$type": "duration", "$value": { "value": 0.15, "unit": "s" }, "$description": "150ms" }
  },
  "font": {
    "heading": {
      "h1": {
        "$type": "typography",
        "$value": {
          "fontFamily": "{font.family.primary}",
          "fontSize": "{font.size.5xl}",
          "fontWeight": "{font.weight.bold}",
          "letterSpacing": { "value": -1.2, "unit": "px" },
          "lineHeight": "{line-height.tight}"
        },
        "$description": "Letter spacing -0.025em at 48px"
      }
    }
  }
}
```

### Targets

Where each category lands. The Figma column follows Figma's documented native import (Help Center, "Modes for variables" → Import modes), which lists color (sRGB and HSL), dimension (px), font family (single string), duration (s) and number. Other types are skipped and need a Figma Style or manual setup. Import support changes between Figma versions, and modes aren't available on every plan, so check the current article in your Figma version before promising a result.

| Category | DTCG `$type` | Figma | CSS custom property |
|----------|--------------|-------|---------------------|
| Color | `color` | Color variable | `--color-primary-default: #1e4d40` |
| Spacing, radius, icon size, focus width/offset, font size | `dimension` | Number variable (px) | `--space-md: 16px` (or rem) |
| Font family | `fontFamily` | String variable (single name) | `--font-family-primary: "Inter", system-ui, sans-serif` |
| Font weight | `fontWeight` | Not imported; set in text styles | `--font-weight-bold: 700` |
| Line height, opacity | `number` | Number variable | `--line-height-normal: 1.5` |
| Letter spacing | `dimension` (px) | Number variable (px) | `--letter-spacing-wide: 0.025em` (CSS can keep em) |
| Text style | `typography` | Text style (not imported) | No single property; emit the parts or a class |
| Elevation | `shadow` | Effect style (not imported) | `--elevation-md: 0 2px 4px rgb(0 0 0 / 0.12)` |
| Z-index | `number` | Imports as a number, but Figma has no stacking property to bind; CSS-only in practice | `--z-modal: 1300` |
| Duration | `duration` (s) | Number variable (seconds) | `--duration-fast: 150ms` |
| Easing | `cubicBezier` | Not imported; CSS-only | `--easing-default: cubic-bezier(0.2, 0, 0, 1)` |

**Name transform:** the token path `color.primary.default` becomes `color/primary/default` in Figma (its import turns nested groups into slashes) and `--color-primary-default` in CSS (dots to hyphens). Aliases become `var()`: `--color-primary-default: var(--color-green-forest)`.

## Reference Files

Consult when working on the specific category:

- `references/color-architecture.md` — Color extraction patterns, modes, state derivation, contrast checks
- `references/typography-architecture.md` — Type extraction patterns, composite scales, WCAG requirements vs. readability recommendations
