# Color Architecture

Patterns for translating brand colors into a layered token system. Consult alongside SKILL.md when extracting color tokens.

## Layer Structure

```
Atomic (raw values)          →  color.green.forest → #XXXXXX
Composite (semantic aliases) →  color.primary.default → {color.green.forest}
Composite + State            →  color.primary.hover → derived from palette
```

## Atomic Extraction

Look for these in brand guidelines:

| Category | Where to Find | Token Pattern |
|----------|---------------|---------------|
| Primary brand colors | Logo, hero backgrounds | `color.{hue}.{variant}` |
| Secondary / accent | CTAs, highlights | `color.accent.{variant}` |
| Neutrals | Backgrounds, text | `color.neutral.{variant}` |
| Tints / shades | Color palette pages | `color.{hue}.{variant}-light` |

Atomic names describe the color: `color.green.forest`, `color.accent.highlighter`, `color.neutral.cream`.

Do not use brand names (`color.acme-green`), hex values (`color.213F39`), or vague terms (`color.dark`).

## Composite Patterns

### Brand Identity

```
color.brand.primary    → {color.green.forest}
color.brand.secondary  → {color.green.sage}
```

Brand identity tokens are optional aliases for documentation/reference. Usage-level composites (interactive, surface, text, etc.) should alias atomics directly — not chain through `color.brand.*`. Omit brand identity tokens if the brand has only one or two primary colors and the mapping is obvious.

### Interactive

```
color.primary.default   → {color.green.forest}
color.primary.hover     → derived or specified
color.primary.active    → derived or specified
color.primary.focus     → {color.accent.highlighter}
color.primary.disabled  → {color.green.sage-mid}
```

### Surface

```
color.surface.light.default   → {color.neutral.white}
color.surface.light.subtle    → lighter brand tint
color.surface.light.emphasis  → brand tint
color.surface.dark.default    → {color.green.forest}
color.surface.dark.subtle     → mid brand shade
color.surface.dark.emphasis   → brand secondary
```

### Text

```
color.text.on-light.high      → {color.green.forest}
color.text.on-light.mid       → mid shade
color.text.on-light.low       → lighter shade
color.text.on-light.disabled  → opacity-modified

color.text.on-dark.high       → {color.neutral.white}
color.text.on-dark.mid        → light shade
color.text.on-dark.low        → mid shade
color.text.on-dark.disabled   → opacity-modified
```

### Border

```
color.border.default   → mid brand shade
color.border.subtle    → light brand shade
color.border.emphasis  → primary brand color
color.border.focus     → high-contrast accent
```

### Feedback

These are rarely in brand guidelines. Flag as `❓ Needs design decision`:

```
color.feedback.{success|warning|error|info}.default
color.feedback.{success|warning|error|info}.subtle
```

### Link / Overlay

```
color.link.default / .hover / .visited
color.overlay.light / .dark
```

## State Derivation

When guidelines don't specify states, use the Confidence Ladder (see SKILL.md):

| State | Derivation Strategy | Label |
|-------|---------------------|-------|
| hover | Next darker swatch in palette, or darken 10% | `⚑ Inferred` or `⚑ Estimated` |
| active | Darken 15–20%, or darker palette swatch | `⚑ Estimated` |
| focus | High-contrast accent from brand palette | `⚑ Inferred` |
| disabled | Apply `{opacity.disabled}`, or use muted swatch | `⚑ Estimated` |

Always flag derived states. Never present as Extract-level.

## Accessibility

### Minimum Contrast Ratios

| Usage | Ratio | WCAG |
|-------|-------|------|
| Body text | 4.5:1 | AA |
| Large text (18px+ / 14px bold) | 3:1 | AA |
| UI components & borders | 3:1 | AA |
| Enhanced body text | 7:1 | AAA |

### Required Checks

Verify these pairs and flag failures:

- `color.text.on-light.high` / `color.surface.light.default`
- `color.text.on-dark.high` / `color.surface.dark.default`
- `color.primary.default` / `color.surface.light.default`
- `color.border.focus` / any background

When brand colors fail contrast, flag:

```
❓ Needs design decision — {pair} fails WCAG AA ({actual ratio})
   Options: Darken text to {value} ({passing ratio}) | Use alternative swatch
```
