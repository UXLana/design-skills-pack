---
name: theme-generator
description: Generate a complete product theme from one brand color (brand, accent, surfaces, text, borders, icons, status, data-viz, plus type, radius, spacing, elevation and icon style by brand personality), register it in the theme system, and audit existing themes for missing tokens and WCAG 2.2 AA contrast failures. Use when the user says "new theme", "create a theme from this color", "generate a palette from a hex code", "add a dark theme", "white-label theme", "check our themes' contrast", or "which themes are missing tokens". Works against the repo's own theme contract, or starts from the bundled ProductTheme interface. Not for turning brand-guideline documents into primitive tokens (brand-tokens-translator), finding hard-coded values in code (token-audit), or a full component accessibility audit (design-accessibility).
---

# Theme Generator

## When to Use

- Creating a new product theme from a brand color
- Generating a complete color palette from one hex value
- Auditing existing themes for token coverage gaps or contrast failures
- Adding a new theme (including a dark or white-label variant) to the design system
- Exploring color harmony options for a product identity
- Validating that all themes pass WCAG 2.2 AA contrast requirements

## Bundled Files

| File | Read it when |
|------|--------------|
| `scripts/contrast.mjs` | Every time you state a contrast ratio or step a color lighter/darker. Run it with `node`; it has no dependencies. `node scripts/contrast.mjs --help` prints usage. |
| `references/theme-interface.ts` | Step 0 finds no theme contract in the repo, or you need the full key list behind the color rules below. It is a starter, not a standard. |

Compute ratios with the script rather than estimating them: contrast is easy to misjudge by eye or by mental arithmetic, and translucent tokens only have a contrast once they are blended over the surface they sit on.

## Step 0: Find the Theme Contract

Before generating or auditing anything, find out how this repo already defines themes, so the output drops into the existing system instead of inventing a parallel one. Look for, in roughly this order:

| Contract | Where it usually shows up |
|----------|---------------------------|
| TypeScript theme object | A `themes/` or `theme/` folder with an interface or type (`Theme`, `ProductTheme`, `createTheme(...)`), per-theme files, and a provider or registry that lists them |
| CSS custom properties | `:root { --color-... }` plus overrides under a selector such as `[data-theme="dark"]` or `.theme-name` |
| Tailwind v4 `@theme` | A CSS file with `@import "tailwindcss";` and an `@theme { --color-... }` block. `@theme` must be top-level, so per-theme values usually live as plain custom properties under a selector and `@theme inline` points utilities at them |
| DTCG token files | `*.tokens` or `*.tokens.json` files using `$value` / `$type` (Design Tokens Format Module 2025.10), often built by a token pipeline |

Record what you find: the contract (its keys and naming), where theme files live, the registry that lists themes, the barrel or build step that exports them, and the typecheck or build command. Read the registry to learn which themes exist and what each one is for; that list is the reference for "existing themes", not anything in this file.

If the repo has no contract, offer to start from `references/theme-interface.ts`: copy it into the repo (a `styles/themes/` folder is a reasonable default), adjust keys to the product, and confirm with the user before generating against it.

The color rules below use the starter's key names (`brand.default`, `surface.light`, `text.lowEmphasis.onLight`). Map each to the repo's own equivalent, and say which mappings you made.

## Modes

### Mode 1: Generate (default)
Create a new theme from a brand color. Produces a complete theme in the repo's contract format (TS object, CSS custom properties, `@theme` block or DTCG file) covering every color group plus typography, radius, elevation, spacing and icon style.

### Mode 2: Audit
Scan all existing themes for:
- Missing token properties (compared against the contract from Step 0)
- WCAG 2.2 AA contrast failures for text and for non-text UI (focus, control borders, meaningful icons, chart marks)
- Inconsistent token patterns between themes
- Dark mode coverage gaps

### Mode 3: Document
Generate visual documentation for one or all themes showing:
- Color swatches for every token group
- Typography samples with actual font stacks
- Radius/elevation/spacing visual references
- Side-by-side theme comparison matrix

## Inputs

### Generate Mode
The user provides:
- **Brand color** (required): A single hex color (e.g. `#2563EB`, `#8B2252`)
- **Theme name** (optional): kebab-case identifier (e.g. `healthcare`, `fintech`)
- **Personality** (optional): Guides typography, spacing, radius, icons. One of:
  - `modern` — Clean sans-serif, moderate radius, standard spacing
  - `institutional` — Serif headings, sharp radius, compact spacing, filled icons
  - `organic` — Serif headings, soft radius, airy spacing, thin icon strokes
  - `technical` — Monospace-leaning, minimal radius, tight spacing
  - `playful` — Rounded sans-serif, large radius, generous spacing

If personality is not specified, infer from the brand color's character (warm/cool, saturated/muted, light/dark).

For a dark theme, follow the contract: if it pairs `onLight`/`onDark` values inside one theme, fill the `onDark` side; if themes are separate, generate a second theme and register it next to the light one.

### Audit Mode
No inputs required. Audits every theme in the registry found in Step 0.

### Document Mode
- **Theme name** (optional): Document a specific theme, or omit for all themes.

## Color Generation Algorithm

From the single brand color, generate every color the contract defines using these rules.

Do lightness changes in OKLCH, not HSL or "darken by N%". OKLCH lightness is perceptually uniform, so the same step reads as the same amount of change on a yellow and on a blue; HSL percentages shift some hues far more than others. `node scripts/contrast.mjs step <color> <deltaL> [--chroma <factor>]` applies a step, pulls chroma back into the sRGB gamut if needed, and prints the hex. Steps below are starting points; adjust them until the contrast checks pass.

### Step 1: Brand Family
```
brand.default  = INPUT_COLOR
brand.darker   = OKLCH lightness -0.08 to -0.12, same hue and chroma
brand.lighter  = OKLCH lightness +0.10 to +0.15, chroma x 0.85 (slightly desaturated)
```

### Step 2: Accent Color
Choose ONE strategy and explain the choice to the user:
- **Complementary**: Hue rotated ~180 degrees — high contrast, bold
- **Analogous**: Hue rotated ~30-40 degrees — harmonious, subtle
- **Split-complementary**: Hue rotated ~150 degrees — balanced contrast
- **Triadic**: Hue rotated ~120 degrees — vibrant, dynamic

Rotate the hue in OKLCH so the accent keeps the brand's perceived lightness. Generate accent.default, accent.darker, accent.lighter with the same steps as Step 1.

### Step 3: Surface Colors
```
surface.light       = Near-white tinted slightly toward brand hue (e.g. #F5F2F0 for warm, #F4F6FF for cool)
surface.lightDarker = OKLCH lightness -0.02 to -0.03 from surface.light
surface.dark        = Brand-tinted dark gray (e.g. mix brand at 15-20% into #4A4A4A)
surface.darkDarker  = OKLCH lightness -0.04 to -0.06 from surface.dark
surface.disabled    = { onLight: brand-tinted at 3% opacity, onDark: white at 20% }
surface.info/success/warning/important = Pastel tints of semantic colors
```

### Step 4: Text Colors
```
text.highEmphasis.onLight = Near-black tinted toward brand (or pure rgba(0,0,0,0.95))
text.highEmphasis.onDark  = #FFFFFF
text.lowEmphasis          = Brand-tinted at 60% opacity or explicit hex
text.disabled             = Brand-tinted at 30% opacity
text.action               = Use brand.default or accent.default for enabled/hover/active
text.success/warning/important = Standard semantic text colors (high contrast)
```

Opacity-based text tokens are the ones most likely to fail: check each one blended over every surface it appears on (`--over` handles translucent backgrounds).

### Step 5: Border, Icon, Action Colors
Use the same opacity pattern as the repo's default theme:
- Borders: `rgba(brand_rgb, 0.10/0.15/0.42)` for low/mid/high emphasis. Low-emphasis borders can stay faint when they are decorative dividers. A border that is the only thing showing where a control is (a text input's outline, an unfilled checkbox) needs 3:1 against the surface around it, so point those controls at a border that passes.
- Icons: `rgba(brand_rgb, 0.55/0.65/0.75/0.85)` for enabled/hover/active/selected. Icons that carry meaning without a text label need 3:1 once blended.
- Actions: Can use brand.default or accent.default depending on desired contrast
- Monochrome actions: Follow the default theme's black/white opacity pattern exactly

### Step 6: Status Colors (Mostly Universal)
Status colors (info, success, warning, important) should maintain semantic meaning:
- **Info**: Blue-ish (can tint toward brand if brand is cool)
- **Success**: Green (tint toward brand if brand is green-ish)
- **Warning**: Amber/orange (keep universal)
- **Important**: Red (keep universal)

For themes where brand IS one of these semantic colors, shift info to use the accent instead.

### Step 7: Badge, Avatar, DataViz, CVD
- **Badge**: Generate 9 hue-spaced colors + light variants, harmonized with brand
- **Avatar**: 8 soft pastel backgrounds
- **DataViz**: 15-stop gradient anchored to brand → accent with warm/cool spread
- **CVD**: Keep the default theme's colorblind-safe palette unless brand conflicts, then adjust

### Step 8: Utility Tokens
Derive from brand:
- `hover/selected/selectedHighlight` — brand-tinted at low opacity
- `focusBorder` — use accent.default (or brand.lighter), then confirm 3:1 against every surface a focused control can sit on, light and dark
- `scrim` — brand-tinted at 32-36% opacity
- `scrollbar/navItemText/buttonToggleBg/chipBg` — brand-tinted opacity variants
- `tableCellHighlight` — brand-tinted highlight

## Non-Color Token Recommendations

Based on personality, recommend:

### Typography
| Personality | Display Font | Body Font | Line Height | Letter Spacing |
|-------------|-------------|-----------|-------------|----------------|
| modern | DM Sans, Inter, or Outfit | Same as display | tight: 1.2, normal: 1.5 | heading: -0.5px, body: 0px |
| institutional | Playfair Display, Lora, or Libre Baskerville | Source Sans 3, Noto Sans | tight: 1.15, normal: 1.5 | heading: -0.3px, body: 0.1px |
| organic | Merriweather, Bitter, or Vollkorn | Nunito Sans, Lato | tight: 1.25, normal: 1.6 | heading: -0.3px, body: 0.15px |
| technical | JetBrains Mono, Space Mono | Inter, IBM Plex Sans | tight: 1.2, normal: 1.5 | heading: -0.5px, body: 0px |
| playful | Fredoka, Quicksand, or Nunito | Same as display | tight: 1.25, normal: 1.6 | heading: 0px, body: 0px |

### Border Radius
| Personality | xs | sm | md | lg | xl |
|-------------|----|----|----|----|-----|
| modern | 2px | 4px | 8px | 12px | 16px |
| institutional | 1px | 2px | 4px | 6px | 8px |
| organic | 3px | 6px | 12px | 16px | 20px |
| technical | 0px | 2px | 4px | 6px | 8px |
| playful | 4px | 8px | 16px | 24px | 32px |

### Spacing
| Personality | unit | input | button | card | section | component |
|-------------|------|-------|--------|------|---------|-----------|
| modern | 4px | 12px | 16px | 24px | 48px | 16px |
| institutional | 4px | 10px | 14px | 20px | 40px | 12px |
| organic | 4px | 14px | 18px | 28px | 56px | 20px |
| technical | 4px | 8px | 12px | 16px | 32px | 12px |
| playful | 4px | 14px | 20px | 28px | 56px | 20px |

### Icon Style
| Personality | Set | Stroke Width | Corner Style |
|-------------|-----|-------------|-------------|
| modern | outlined | 1.5 | round |
| institutional | filled | 1.5 | round |
| organic | outlined | 1.25 | round |
| technical | outlined | 1.75 | square |
| playful | duotone | 1.5 | round |

### Elevation (Shadows)
Tint all shadows with brand color RGB values. Pattern:
```
xs:  0px 1px 2px rgba(R, G, B, 0.06)
sm:  0px 1px 3px rgba(R, G, B, 0.10), 0px 1px 2px rgba(R, G, B, 0.08)
md:  0px 4px 6px -1px rgba(R, G, B, 0.10), 0px 2px 4px -1px rgba(R, G, B, 0.08)
lg:  0px 10px 15px -3px rgba(R, G, B, 0.10), 0px 4px 6px -2px rgba(R, G, B, 0.06)
xl:  0px 20px 25px -5px rgba(R, G, B, 0.12), 0px 10px 10px -5px rgba(R, G, B, 0.06)
2xl: 0px 25px 50px -12px rgba(R, G, B, 0.28)
inner: inset 0px 2px 4px rgba(R, G, B, 0.08)
brand: 0px 4px 14px rgba(R, G, B, 0.25)
brandLg: 0px 10px 25px rgba(R, G, B, 0.30)
```

## Output Workflow

### Generate Mode

#### Step 1: Present Recommendations
Before generating any files, show the user:
1. The brand color analysis (OKLCH lightness, chroma and hue; warm/cool)
2. The accent color recommendation with rationale (which strategy and why)
3. The personality recommendation (if not specified)
4. A summary of the key generated colors (brand, accent, surface, action) with their contrast results from the script

Ask for confirmation before proceeding.

#### Step 2: Generate Theme File
Create the theme where Step 0 says themes live, in the contract's format.
- Include a header comment with brand color, accent strategy, and personality
- Mirror the structure of an existing theme in the registry, so reviewers can diff it against a known-good theme
- Populate every property the contract defines; a missing key usually falls back silently to the default theme and looks like a bug later
- If the contract has helpers, use them (the starter has `buildBorderRadius(base)` and `buildComponentRadius(base)`)

#### Step 3: Register Theme
Add the theme everywhere the existing themes are listed. For the starter layout that is:
1. **The theme registry** (e.g. `styles/themes/theme-provider.tsx`): import the theme and add it to `availableThemes`
2. **The themes barrel** (e.g. `styles/themes/index.ts`): export it

For CSS or DTCG contracts, add the new selector block or token file wherever the build picks up the others.

#### Step 4: Verify
- Run the repo's typecheck: its `typecheck` script if there is one, otherwise `npx tsc --noEmit -p .`. Checking a single file (`npx tsc --noEmit path/to/theme.ts`) ignores `tsconfig.json`, so path aliases and strictness settings don't apply and the result can't be trusted. For CSS or DTCG contracts, run the build that consumes them.
- Run the contrast checks from Audit Step 3 on the new theme
- Check that the theme appears in the theme switcher

### Audit Mode

#### Step 1: Load All Themes
Read every theme listed in the registry found in Step 0. Resolve each value to a final color first: follow `var()` chains and aliases (`{group.token}` in DTCG). For a DTCG color, pass its `hex`, or build `rgb()` from its sRGB `components`. If a value is `color-mix()` or a relative color the script can't parse, read the computed color from the running app (`getComputedStyle`) or flag it as unverified.

#### Step 2: Check Token Coverage
For each theme, verify every property in the contract is defined and non-empty. Report any missing or undefined tokens.

#### Step 3: Check Contrast Ratios
Write the pairs for each theme to a JSON file and run `node scripts/contrast.mjs --json pairs.json`. Each entry is `{ "label", "fg", "bg", "over"?, "min" }`; add `over` when the background is translucent.

Text (WCAG 1.4.3, 4.5:1; 3:1 only where the text is large):
- `text.highEmphasis.onLight` on `surface.light` and `surface.lightDarker`
- `text.lowEmphasis.onLight` on `surface.light` and `surface.lightDarker`
- `text.highEmphasis.onDark` on `surface.dark` and `surface.darkDarker`
- `text.lowEmphasis.onDark` on `surface.dark` and `surface.darkDarker`
- `brand.default` and `action.enabled` as text on `surface.light`
- White (or the theme's on-brand text) on `brand.default`. This is the primary button label, so below 4.5:1 is a **fail**, not a warning. Fix it by filling buttons with `brand.darker`, or by switching the label to dark text, and show the user both options.
- Each status text color on its matching status surface

Non-text (WCAG 1.4.11, 3:1 against adjacent colors):
- `focusBorder.onLight` on `surface.light` and `surface.lightDarker`; `focusBorder.onDark` on `surface.dark` and `surface.darkDarker`
- The border used to outline inputs and other controls with no other visible boundary, on the surface around it, light and dark
- `icon.enabled` and `icon.selected` (blended) on the surfaces they sit on, for icons that carry meaning without a text label
- Data-viz colors used as lines or small marks, on the chart background

Skip disabled tokens (`text.disabled`, `icon.disabled`, `surface.disabled`): WCAG exempts inactive components from both criteria. Mention them in the report as exempt so nobody reads the omission as an oversight.

#### Step 4: Report
Output a structured report:
- Per-theme coverage percentage
- Failed contrast pairs with actual ratios (as the script prints them) and required minimums
- Recommendations for fixing each failure, with a candidate replacement color that you have run through the script

### Document Mode
Generate a visual HTML document or Markdown showing:
- Full color swatches for every token group
- Typography samples rendered in the theme's font stacks
- Radius/elevation/spacing visual comparisons
- If documenting all themes: side-by-side comparison matrix

## Accessibility Constraints

Generated color combinations must meet WCAG 2.2 AA:
- **Normal text**: 4.5:1 against its background (1.4.3)
- **Large text**: 3:1. Large means at least 24px regular or about 18.66px bold (18pt, or 14pt bold, at 1pt = 1.333px)
- **Non-text UI**: 3:1 against adjacent colors for focus indicators, control boundaries that identify a control, state indicators, meaningful icons and chart marks (1.4.11)
- **No rounding**: 4.499:1 does not meet 4.5:1. The script truncates for display and compares the unrounded value.
- **Translucent colors**: blend over the actual surface before measuring. The script does this.

If any check fails during generation, adjust the generated color with an OKLCH step until it passes. During audit, flag but do not auto-fix; the user may have reasons for the current value that the audit can't see.

## Integration Points

| Skill | Relationship |
|-------|-------------|
| **Brand Tokens Translator** | Upstream — provides atomic tokens that feed into theme generation |
| **Token Audit** | Parallel — validates token usage in code; Theme Generator validates theme definitions |
| **Your prototyping workflow** | Downstream — consumes themes for prototype rendering |
| **Design System UI** | Downstream — displays themes in the docs app |
| **Your QA gate** | Downstream — validates theme compliance as part of QA |
| **Design Accessibility** | Parallel — Theme Generator checks contrast internally; your QA gate invokes Design Accessibility for full audits |
| **Component Generator** | Downstream — components consume theme tokens via CSS custom properties |
