# Color Architecture

Patterns for translating brand colors into a layered token system. Consult alongside SKILL.md when extracting color tokens.

## Layer Structure

```
Atomic (raw values)          →  color.green.forest → #XXXXXX
Composite (semantic aliases) →  color.primary.default → {color.green.forest}
Composite + State            →  color.primary.hover → derived from palette
Composite per mode           →  color.surface.default → light: {color.neutral.white} · dark: {color.green.forest}
```

## Modes

Light/dark and sub-brands are **modes**: the same composite name carries one value per mode, and each mode becomes its own `.tokens.json` file (see SKILL.md). For light/dark, atomics stay the same and only the composites' aliases change; sub-brand modes may also swap the atomics. Keep the theme out of the name, so components never need rewiring when the theme switches.

Use `on-light` / `on-dark` only for a section whose background is the same in every mode, such as an always-dark brand band (see Fixed sections below).

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
                         light mode               dark mode
color.surface.default  → {color.neutral.white}    {color.green.forest}
color.surface.subtle   → lighter brand tint       mid brand shade
color.surface.emphasis → brand tint               brand secondary
```

### Text

```
                         light mode               dark mode
color.text.high        → {color.green.forest}     {color.neutral.white}
color.text.mid         → mid shade                light shade
color.text.low         → lighter shade            mid shade
color.text.disabled    → opacity-modified         opacity-modified
```

### Fixed sections (only when needed)

For a band whose background doesn't change with the mode, name the pairing explicitly. Its values are the same in every mode file.

```
color.surface.fixed-dark  → {color.green.forest}
color.text.on-dark.high   → {color.neutral.white}
color.text.on-dark.mid    → light shade
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
| Body text | 4.5:1 | AA (SC 1.4.3) |
| Large text (at least 18pt / 24px, or 14pt / about 18.66px bold) | 3:1 | AA (SC 1.4.3) |
| UI components, graphical objects & focus indicators | 3:1 | AA (SC 1.4.11) |
| Enhanced body text | 7:1 | AAA (SC 1.4.6) |
| Enhanced large text | 4.5:1 | AAA (SC 1.4.6) |

Don't round the computed ratio: 4.499:1 doesn't meet 4.5:1 (W3C Understanding SC 1.4.3).

### Required Checks

Verify these pairs in **every mode** and flag failures:

- `color.text.high` / `color.surface.default`
- `color.text.mid` and `color.text.low` / `color.surface.default`, if they carry readable text
- `color.primary.default` / `color.surface.default`
- `color.text.on-dark.high` / `color.surface.fixed-dark`, if fixed sections exist
- `color.border.focus` / every surface it appears on

When brand colors fail contrast, flag:

```
❓ Needs design decision — {pair} fails WCAG AA in {mode} mode ({actual ratio})
   Options: Darken text to {value} ({passing ratio}) | Use alternative swatch
```
