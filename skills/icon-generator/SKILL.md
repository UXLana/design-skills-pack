---
name: icon-generator
description: Design custom SVG icons for a design system and ship them as React components plus .svg files, in outline (24px grid, round 2px stroke, Lucide-style) and filled variants, accessible to WCAG 2.2 AA (decorative vs. meaningful icons, 3:1 non-text contrast, labeled icon buttons). Use whenever someone asks to make, draw, add or redraw an icon, needs a filled or outline version of an existing icon, or wants a Figma icon exported, cleaned up and turned into a component, for example "we need a calendar icon", "add an icon for archive", "make an SVG icon", "filled version of this icon" or "convert this Figma icon". Checks the repo's icon set and open-source libraries such as Lucide first so it never duplicates an icon that already exists. Not for picking an icon from a library the repo already imports (just import it), logos, illustrations, or full UI components that contain icons (component-generator).
---

# Icon Generator

Generate production-ready, scalable SVG icons in outline and filled variants. Every icon is a thin React component on one shared `BaseIcon` (which owns sizing, styling, and the accessibility logic), plus a standalone `.svg` file.

## Reference Files

| File | Read it when |
|------|--------------|
| `references/icon-standards.md` | Before drawing any paths: grid, stroke, corner radius, spacing, filled-variant construction, path hygiene |
| `references/accessibility.md` | Before writing a component or a usage example: the WCAG 2.2 AA table (contrast, target size, naming) and the ARIA patterns for decorative, meaningful, button, toggle, and status icons |
| `references/token-mappings.md` | When wiring icon sizes, colors, stroke widths, or target sizes to the repo's tokens |
| `references/existing-icons.md` | When building the repo's icon inventory in step 0, or updating the repo's inventory doc |
| `references/examples.md` | For a worked example of one icon in both variants, with the construction notes |

## Step 0 — Check Before Drawing

A near-duplicate icon is cheap to add and slow to remove, so look before you draw:

1. **The repo's icon set.** List the icons barrel (e.g. `components/Icons/index.ts`), any `.svg` folder, and inline `<svg>` elements inside components. Search by meaning, not just name: "archive" may already exist as `IconBox` or `IconStorage`. Build the inventory in the format of `references/existing-icons.md`.
2. **A library the repo already imports.** If `package.json` has an icon library (for example `lucide-react`) and it has the icon, import it and stop; that isn't this skill's job.
3. **Open-source sets.** Search [lucide.dev/icons](https://lucide.dev/icons) first; its style is this skill's default. If a suitable icon exists, offer to adapt it rather than drawing a new one. Lucide is ISC-licensed, and the icons it derived from Feather are MIT-licensed; both require keeping the copyright and license notice. When you adapt library path data, put a comment naming the source and license at the top of the file, and say in your reply that the path is adapted, not generated.
4. **The repo's style.** If the existing icons use a different stroke width (1.5px is common) or grid, match the repo instead of the default below. Consistency within the set beats any external standard.

## Accepted Input Types

| Input | What it provides | Output |
|-------|------------------|--------|
| Text description | Icon concept, use case | New SVG icon |
| Figma SVG export, Dev Mode, or Figma MCP | Real vector data | Cleaned, optimized icon on the grid |
| Screenshot (last resort) | Visual reference only | A redraw on the grid, labeled as a redraw |
| Icon name | Semantic naming | Icon with proper naming conventions |
| Variant preference | Outline or filled | Appropriate icon style |

## Core Principles

1. **Dual-style support**: outline (default) and filled variants, sharing one silhouette.
2. **Token compliance**: sizes map to the token scale, color is `currentColor` (inherited from the parent), no raw color values.
3. **Scalability**: a 24×24 `viewBox`, simple geometry that stays legible at 16px.
4. **Accessibility first (WCAG 2.2 AA)**: icons are decorative unless given a name, meaningful icons meet 3:1 contrast, and icon buttons carry the label on the button. Full rules in `references/accessibility.md`.

## Icon Variants

### Outline (default): Lucide-style

```
ViewBox:      0 0 24 24
Stroke:       2px, round caps, round joins (match the repo's set if it differs)
Fill:         none
Padding:      stroke edges at least 1px inside the canvas (path coordinates within 2–22)
Corners:      2px radius on shapes 8px or larger, 1px on smaller shapes
Spacing:      at least 2px between distinct elements
Best for:     navigation, actions, subtle indicators
```

### Filled / solid

Filled icons mark emphasis, active or selected states, and toggles. Build them with the **closed-shapes rule**:

- Every filled shape is a closed path (ending in `Z`) or a closed primitive (`rect`, `circle`). An open stroke such as a line or an arc can't be filled; redraw it as a closed shape with the stroke's thickness.
- Interior details become knockouts: a second subpath inside the shape with `fill-rule="evenodd"`, not a second color.
- Match the outline variant's outer silhouette, so switching variants doesn't make the icon jump.
- Don't reuse the outline path under `fill="currentColor"` unless every subpath is already closed and the icon has no interior detail.

Details and a worked example: `references/icon-standards.md` and `references/examples.md`.

### Don'ts

- Thin details that disappear at 16px
- Mixing filled and stroked styles inside one icon
- Paths with many anchor points
- Decorative elements that don't aid recognition
- Raw color values (use `currentColor`)

## Size Token Mapping

| Token | Pixel Size | Use Case |
|-------|------------|----------|
| `xs` | 12px | Inline with small text, badges |
| `sm` | 16px | Inline with body text, compact UI |
| `md` | 20px | Navigation, buttons, default |
| `lg` | 24px | Headers, emphasis |
| `xl` | 32px | Hero sections, large buttons |
| `2xl` | 48px | Feature highlights, empty states |

The icon's size is not its target size. An icon in a button can be 16px; the button around it must meet the target size in `references/accessibility.md`.

## Output Formats

### 1. `BaseIcon` (ship once per repo)

If the repo has no shared base, create this file once. Every icon component builds on it, so the size map and the decorative-vs-meaningful logic live in one place.

```tsx
// components/Icons/BaseIcon.tsx
import type { ComponentProps, ReactNode } from 'react'

export const iconSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, '2xl': 48 } as const
export type IconSize = keyof typeof iconSizes

/** Props every icon component accepts. On React 19 this includes `ref`. */
export type IconProps = Omit<ComponentProps<'svg'>, 'children'> & {
  /** A size token or a pixel number. Default `md`. */
  size?: IconSize | number
}

type BaseIconProps = IconProps & {
  variant?: 'outline' | 'filled'
  children: ReactNode
}

export function BaseIcon({ size = 'md', variant = 'outline', strokeWidth = 2, children, ...props }: BaseIconProps) {
  const px = typeof size === 'number' ? size : iconSizes[size]
  const outline = variant === 'outline'
  // Decorative unless named: with no aria-label or aria-labelledby the icon is hidden
  // from assistive technology; with one it is exposed as a single image with that name.
  const named = Boolean(props['aria-label'] || props['aria-labelledby'])

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill={outline ? 'none' : 'currentColor'}
      stroke={outline ? 'currentColor' : 'none'}
      strokeWidth={outline ? strokeWidth : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={named ? 'img' : undefined}
      aria-hidden={named ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  )
}
```

On **React 18**, wrap `BaseIcon` in `forwardRef<SVGSVGElement, BaseIconProps>`, type the props with `ComponentPropsWithoutRef<'svg'>`, and pass the ref to the `<svg>`; per-icon components that should accept a ref need the same wrapper. On React 19 `ref` is a regular prop and flows through `{...props}`.

### 2. Per-icon components (paths only)

Each icon is just its geometry. The filled variant is a separate component that sets `variant="filled"`.

```tsx
// components/Icons/IconClose.tsx
import { BaseIcon, type IconProps } from './BaseIcon'

export function IconClose(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M17 7 7 17M7 7l10 10" />
    </BaseIcon>
  )
}
```

### 3. SVG files

A standalone file per variant, for design tools, CSS backgrounds, and non-React consumers. Keep `currentColor` so the file still inherits color when inlined.

```svg
<!-- close.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 7 7 17M7 7l10 10"/>
</svg>
```

## Icon Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Navigation** | Wayfinding, menus | home, menu, arrow-left, chevron-down |
| **Actions** | User interactions | edit, delete, save, download, share, archive |
| **Status** | State indicators | check, x, alert, info, loading |
| **Objects** | Things, entities | file, folder, image, user, calendar |
| **Communication** | Messaging, social | mail, message, bell, phone |
| **Media** | Audio, video, images | play, pause, volume, camera |
| **Formatting** | Text, layout | bold, align-left, list, grid |
| **Toggle** | On/off pairs | star / star-filled, bookmark / bookmark-filled |

## Workflow

### Text-Based Generation

1. **Check before drawing**: run step 0.
2. **Clarify variant**: outline, filled, or both.
3. **Analyze concept**: identify the one or two shapes that make it recognizable.
4. **Draw on the grid**: follow `references/icon-standards.md`.
5. **Create components**: per-icon component(s) on `BaseIcon`, plus `.svg` files.
6. **Validate accessibility**: run the checklist in `references/accessibility.md`.
7. **Integrate and document**: see Integration below.

### Figma-Based Generation

1. **Get real vector data, not a screenshot.** Select the 24×24 icon frame and export it as SVG (Export panel, or right-click → Copy/Paste as → Copy as SVG); in Dev Mode, export the SVG asset from the layer; or, if the Figma MCP server is connected, pull the node's SVG through it. Use a screenshot only as a last resort, and say the result is a redraw.
2. **Check the source**: a 24×24 frame, the icon on the grid, boolean groups flattened.
3. **Outline strokes only for a fill-based set.** If the repo's icons are fills, convert strokes to fills in Figma (right-click → Outline stroke). The stroke settings are gone afterwards, so duplicate the layer first. For a stroke-based set, the default here, keep the strokes so `strokeWidth` stays adjustable and matches the rest of the set.
4. **Optimize with SVGO** (config below).
5. **Use `currentColor`**: SVGO's `convertColors` with `currentColor: true` replaces every color. Use it on single-color icons only.
6. **Wrap the cleaned paths in `BaseIcon`**, make the other variant if needed, then validate and integrate as above.

### SVGO

```js
// svgo.config.mjs (from SVGO 4, preset-default no longer strips viewBox or <title>)
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertColors: { currentColor: true }, // every color becomes currentColor
        },
      },
    },
    'removeDimensions', // drop width/height; BaseIcon sets the size and the viewBox stays
  ],
}
```

Run it with `npx svgo icon.svg -o icon.min.svg`, or a folder with `npx svgo -rf ./icons-raw -o ./icons`. Before running it on a multi-color icon, remove the `convertColors` override.

## Integration with the Design System

Follow the repo's conventions; the paths here are examples.

1. **Add the files**: `components/Icons/IconArchive.tsx` (or the repo's single icons file), the `.svg` files in the repo's SVG folder, and a named export from the icons barrel.
2. **Document it** where the repo documents icons: the icon gallery page, a Storybook story, or an MDX page. Show both variants, the decorative default, and one labeled usage.
3. **Update the repo's icon inventory doc** if it keeps one, in the format of `references/existing-icons.md`. Don't write the inventory into this skill's folder; the skill is shared across repos.

### Integration Checklist

- [ ] Icon builds on `BaseIcon` and contains only geometry
- [ ] Filled variant (if any) follows the closed-shapes rule
- [ ] Exported from the icons barrel; `.svg` files added
- [ ] Added to the docs or gallery the repo uses
- [ ] Accessibility checklist in `references/accessibility.md` passes
- [ ] Source and license comment present if any path was adapted from a library
- [ ] `displayName` set only if the icon is wrapped in `forwardRef` or `memo` (plain named functions don't need it)

## Example: Accessible Close Button

**Input:** "Create an accessible close button icon"

**Output:** the `IconClose` component above, and this usage:

```tsx
import { IconClose } from '@/components/Icons'
import { spacing, targetSize } from '@/styles/design-tokens'

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close dialog" // the name goes on the button; the icon stays decorative
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        // Target size tokens: see the table in references/accessibility.md.
        minWidth: targetSize.touch, minHeight: targetSize.touch,
        padding: spacing[2],
      }}
    >
      <IconClose size="md" />
    </button>
  )
}
```

A worked example of one icon in both variants is in `references/examples.md`.

## Naming Conventions

| Pattern | Format | Example |
|---------|--------|---------|
| Outline component | PascalCase with Icon prefix | `IconArchive`, `IconStar` |
| Filled component | PascalCase with Filled suffix | `IconArchiveFilled`, `IconStarFilled` |
| SVG file (outline) | kebab-case | `archive.svg`, `star.svg` |
| SVG file (filled) | kebab-case with -filled suffix | `archive-filled.svg`, `star-filled.svg` |
| Export name | Same as component | `export { IconArchive, IconArchiveFilled }` |

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before generating any SVG, enumerate your assumptions about the icon's intent.

For each unknown, classify stakes:

- **high** — guessing wrong produces a misleading metaphor, accessibility failure, or a name that collides with an existing icon. Examples: "is this 'archive' or 'storage' semantically?", "should the filled variant be auto-generated or do you want a hand-tuned version?", "does this icon already exist under a different name?"
- **low** — minor stroke-width variations, exact pixel snapping. Decide, log, move on.

If any unknown is `high`, **stop** and ask the user in chat before producing SVG. If the repo has a `_design_task.md` at its root (a shared task log that other design-system skills, such as design-system-perspectives, read and write), also record the question there under `honesty.pending_questions`; if it has none, asking in chat is enough, so don't create the file:

```yaml
honesty:
  agent: icon-generator
  assumptions:
    - "Stroke width 2 to match the repo's existing icons"
  resolved_questions: []
  pending_questions: []
```

Special rule for icon-generator: any unknown about **semantic naming or whether the icon duplicates an existing one** is automatically `high`. Icon library bloat from near-duplicates is one of the slowest, most painful DS debts to pay back.
