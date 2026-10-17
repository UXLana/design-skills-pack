---
name: icon-generator
description: Generate scalable, token-compliant SVG icons for design systems. Creates both outline (Feather-style) and filled/solid variants. Includes React components and SVG files with full accessibility support (WCAG 2.1 AA compliant). Supports Figma import and text-based generation.
---

# Icon Generator

Generate production-ready, scalable SVG icons with both outline and filled variants. All icons include comprehensive accessibility features and integrate seamlessly with design tokens.

## Accepted Input Types

| Input | What it provides | Output |
|-------|------------------|--------|
| Text description | Icon concept, use case | Generated SVG icon |
| Figma export/screenshot | Visual reference | Matched/recreated icon |
| Icon name | Semantic naming | Icon with proper naming conventions |
| Category | Organization | Properly categorized icon |
| Variant preference | Outline or filled | Appropriate icon style |

## Core Principles

1. **Dual-style support** — Generate both outline and filled variants:
   - **Outline (default)**: Feather-style stroke-based icons
   - **Filled/Solid**: Solid fill icons for emphasis or filled UI patterns

2. **Token compliance** — Icons integrate with design tokens:
   - Sizes map to token scale (xs, sm, md, lg, xl)
   - Colors inherit from parent or use semantic tokens
   - No hardcoded pixel values in components

3. **Scalability** — Icons work at any size:
   - SVG viewBox ensures proper scaling
   - Stroke width scales proportionally (outline)
   - No pixel-perfect details that break at small sizes

4. **Accessibility-first** — WCAG 2.1 AA compliant:
   - Proper ARIA attributes for all icon types
   - Sufficient color contrast (4.5:1 minimum)
   - Focus management for interactive icons
   - Screen reader support with meaningful labels

## Icon Variants

### Outline Icons (Default)
Feather-style stroke-based icons for general UI use.

```
Style: Stroke-based
Stroke Weight: 1.5px (default), configurable 1-2.5px
Corner Radius: Rounded (strokeLinecap="round", strokeLinejoin="round")
Fill: none (transparent)
Best for: Navigation, actions, subtle indicators
```

### Filled/Solid Icons
Solid fill icons for emphasis, active states, or filled UI patterns.

```
Style: Fill-based
Fill: currentColor (solid)
Stroke: none
Best for: Active states, emphasis, toggle states, status indicators
```

## Icon Style Guide

### Visual Characteristics

```
ViewBox: 0 0 24 24
Grid: 24x24 with 2px padding (20x20 active area)
Optical Balance: Center-weighted, visually balanced
Complexity: Simple, recognizable at 16px
```

### Outline Icons
- Use simple geometric shapes (circles, rectangles, lines)
- Maintain consistent stroke weight throughout
- Use `strokeLinecap="round"` and `strokeLinejoin="round"`
- Subtle fills allowed sparingly (fillOpacity="0.2" max)

### Filled Icons
- Use solid fills with `fill="currentColor"`
- Maintain visual weight similar to outline counterpart
- Ensure shapes are slightly smaller to match optical weight
- Use consistent corner radius for cohesion

### Don'ts
- Don't use thin details that disappear at small sizes
- Don't mix filled and stroked styles inconsistently within one icon
- Don't use complex paths with many anchor points
- Don't add decorative elements that don't aid recognition
- Don't use raw color values (always use currentColor or tokens)

## Size Token Mapping

| Token | Pixel Size | Use Case |
|-------|------------|----------|
| `xs` | 12px | Inline with small text, badges |
| `sm` | 16px | Inline with body text, compact UI |
| `md` | 20px | Navigation, buttons, default |
| `lg` | 24px | Headers, emphasis, touch targets |
| `xl` | 32px | Hero sections, large buttons |
| `2xl` | 48px | Feature highlights, empty states |

## Accessibility Requirements

### WCAG 2.1 AA Compliance

All icons MUST meet these accessibility standards:

#### 1. Perceivable
- **Color contrast**: Icons must have 4.5:1 contrast ratio against background
- **Non-color indicators**: Don't rely solely on color to convey meaning
- **Scalable**: Icons must remain clear when zoomed to 200%

#### 2. Operable
- **Keyboard accessible**: Interactive icons must be focusable
- **Focus visible**: Clear focus indicator (2px ring, high contrast)
- **Touch targets**: Minimum 44x44px touch target for interactive icons

#### 3. Understandable
- **Meaningful labels**: Descriptive aria-label for meaningful icons
- **Consistent**: Same icon = same meaning throughout the application

#### 4. Robust
- **Semantic HTML**: Use appropriate roles and ARIA attributes
- **Screen reader support**: Test with VoiceOver, NVDA, JAWS

### ARIA Implementation

```tsx
// Decorative icon (no meaning, hidden from AT)
<svg aria-hidden="true" role="presentation" focusable="false">

// Informative icon (conveys meaning)
<svg aria-label="Settings" role="img">

// Interactive icon (button/link)
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">
</button>

// Icon with visible text (redundant, hide icon)
<button>
  <svg aria-hidden="true" focusable="false">
  <span>Save</span>
</button>

// Status icon (conveys state)
<svg aria-label="Error: Form has validation errors" role="img">
```

### Focus States

Interactive icons require visible focus states:

```tsx
// Focus ring styles
const focusStyles = {
  outline: '2px solid currentColor',
  outlineOffset: '2px',
  borderRadius: '2px',
}

// Or using box-shadow for more control
const focusStylesAlt = {
  boxShadow: '0 0 0 2px var(--color-focus-ring)',
  borderRadius: '2px',
}
```

## Output Formats

### 1. React Component with Variants

Generate TypeScript React components supporting both outline and filled:

```tsx
import React from 'react'

export type IconVariant = 'outline' | 'filled'

export interface IconProps extends React.SVGAttributes<SVGElement> {
  /** Icon size - maps to design tokens */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number
  /** Icon variant - outline (default) or filled */
  variant?: IconVariant
  /** Stroke width for outline variant - default 1.5 */
  strokeWidth?: number
  /** Accessible label - required if icon conveys meaning */
  label?: string
}

const sizeMap: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

export const IconName: React.FC<IconProps> = ({
  size = 'md',
  variant = 'outline',
  strokeWidth = 1.5,
  label,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]
  const isOutline = variant === 'outline'

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill={isOutline ? 'none' : 'currentColor'}
      stroke={isOutline ? 'currentColor' : 'none'}
      strokeWidth={isOutline ? strokeWidth : undefined}
      strokeLinecap={isOutline ? 'round' : undefined}
      strokeLinejoin={isOutline ? 'round' : undefined}
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      focusable="false"
      {...props}
    >
      {isOutline ? (
        {/* Outline paths */}
      ) : (
        {/* Filled paths */}
      )}
    </svg>
  )
}

IconName.displayName = 'IconName'
```

### 2. Separate Outline/Filled Components

For cleaner imports, generate separate components:

```tsx
// IconHeart.tsx (outline)
export const IconHeart: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </BaseIcon>
)

// IconHeartFilled.tsx (filled)
export const IconHeartFilled: React.FC<IconProps> = (props) => (
  <BaseIconFilled {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </BaseIconFilled>
)
```

### 3. SVG Files

Generate standalone SVG files for both variants:

```svg
<!-- heart-outline.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>

<!-- heart-filled.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="currentColor" stroke="none">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>
```

## Icon Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Navigation** | Wayfinding, menus | home, menu, arrow-left, chevron-down |
| **Actions** | User interactions | edit, delete, save, download, share |
| **Status** | State indicators | check, x, alert, info, loading |
| **Objects** | Things, entities | file, folder, image, user, calendar |
| **Communication** | Messaging, social | mail, message, bell, phone |
| **Media** | Audio, video, images | play, pause, volume, camera |
| **Formatting** | Text, layout | bold, align-left, list, grid |
| **Toggle** | On/off states | heart/heart-filled, star/star-filled |

## Workflow

### Text-Based Generation

1. **Receive request** — User describes needed icon(s)
2. **Clarify variant** — Determine if outline, filled, or both needed
3. **Analyze concept** — Identify key visual elements
4. **Check existing** — Verify icon doesn't already exist in library
5. **Generate SVG** — Create paths for requested variant(s)
6. **Create component** — Wrap in React component with accessibility
7. **Validate accessibility** — Check contrast, ARIA, focus states
8. **Integrate with design system** — Follow integration steps below
9. **Document** — Add to documentation page with usage examples

### Figma-Based Generation

1. **Receive Figma input** — Screenshot or code export
2. **Extract visual details** — Stroke weight, shapes, proportions
3. **Determine variant** — Identify if source is outline or filled
4. **Map to style guide** — Adjust to match icon system style
5. **Generate both variants** — Create outline and filled versions
6. **Validate accessibility** — Ensure contrast and ARIA compliance
7. **Generate outputs** — React components and SVG files
8. **Integrate with design system** — Follow integration steps below

## Integration with Design System

After creating icons, integrate them following your design system's conventions (the paths below are examples; use your repo's own):

### 1. Add to Icon Library

Add new icons to `/components/Icons/Icons.tsx`:

```tsx
export const IconNewIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    {/* SVG paths */}
  </BaseIcon>
)
IconNewIcon.displayName = 'IconNewIcon'
```

### 2. Update Icon Gallery

Add icons to the documentation page `/app/design-system/icons/page.tsx`:

```tsx
// Add to appropriate category in iconCategories
const iconCategories = {
  // ... existing categories
  ui: {
    title: 'UI Elements',
    icons: [
      // ... existing icons
      { name: 'NewIcon', component: IconNewIcon },
    ],
  },
}
```

### 3. Update Code Imports

In the Code tab section, add to the imports list:

```tsx
IconNewIcon,
```

### Integration Checklist

- [ ] Icon added to `/components/Icons/Icons.tsx`
- [ ] Icon has `displayName` set
- [ ] Icon added to `iconCategories` in icons documentation page
- [ ] Icon added to code imports list in documentation
- [ ] Icon follows BaseIcon pattern (outline) or BaseIconFilled pattern (filled)

## Accessibility Testing Checklist

Before finalizing any icon, verify:

### Visual
- [ ] 4.5:1 contrast ratio against intended backgrounds
- [ ] Recognizable at 16px size
- [ ] Clear at 200% zoom
- [ ] Works in high contrast mode
- [ ] Visible in both light and dark themes

### Semantic
- [ ] Appropriate `role` attribute (img, presentation)
- [ ] Meaningful `aria-label` for informative icons
- [ ] `aria-hidden="true"` for decorative icons
- [ ] `focusable="false"` to prevent tab stops on SVG

### Interactive (if applicable)
- [ ] Wrapped in focusable element (button, link)
- [ ] Visible focus indicator
- [ ] 44x44px minimum touch target
- [ ] Keyboard accessible
- [ ] Screen reader announces action

### Screen Reader Testing
- [ ] VoiceOver (macOS/iOS): Icon label announced correctly
- [ ] NVDA (Windows): Icon label announced correctly
- [ ] Descriptive labels (not just "icon" or "image")

## Example Generations

### Example 1: Heart Icon (Both Variants)

**Input:** "Create a heart/favorite icon with both outline and filled variants"

**Output:**

```tsx
// Outline variant
export const IconHeart: React.FC<IconProps> = ({
  size = 'md',
  strokeWidth = 1.5,
  label,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      focusable="false"
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

// Filled variant
export const IconHeartFilled: React.FC<IconProps> = ({
  size = 'md',
  label,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label={label}
      aria-hidden={!label}
      role={label ? 'img' : 'presentation'}
      focusable="false"
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
```

### Example 2: Accessible Interactive Icon

**Input:** "Create an accessible close button icon"

**Output:**

```tsx
// The icon itself
export const IconX: React.FC<IconProps> = ({
  size = 'md',
  strokeWidth = 1.5,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size]

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// Usage in an accessible button
const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    onClick={onClose}
    aria-label="Close dialog"
    style={{
      padding: '8px',
      minWidth: '44px',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <IconX size="md" />
  </button>
)
```

## Naming Conventions

| Pattern | Format | Example |
|---------|--------|---------|
| Outline component | PascalCase with Icon prefix | `IconHeart`, `IconStar` |
| Filled component | PascalCase with IconFilled suffix | `IconHeartFilled`, `IconStarFilled` |
| SVG file (outline) | kebab-case | `heart.svg`, `star.svg` |
| SVG file (filled) | kebab-case with -filled suffix | `heart-filled.svg`, `star-filled.svg` |
| Export name | Same as component | `export { IconHeart, IconHeartFilled }` |

## Reference Files

- **Icon standards:** See `references/icon-standards.md` for complete visual specifications
- **Token mappings:** See `references/token-mappings.md` for size/color token integration
- **Existing icons:** See `references/existing-icons.md` for current icon inventory
- **Accessibility guide:** See `references/accessibility.md` for WCAG compliance details

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before generating any SVG, enumerate your assumptions about the icon's intent.

For each unknown, classify stakes:

- **high** — guessing wrong produces a misleading metaphor, accessibility failure, or a name that collides with an existing icon. Examples: "is this 'archive' or 'storage' semantically?", "should the filled variant be auto-generated or do you want a hand-tuned version?", "does this icon already exist under a different name?"
- **low** — minor stroke-width variations, exact pixel snapping. Decide, log, move on.

If any unknown is `high`, **stop**. Append to `_design_task.md` under `honesty.pending_questions`, ask the user before producing SVG.

Schema appended to `_design_task.md`:

```yaml
honesty:
  agent: icon-generator
  assumptions:
    - "Matched stroke-width 1.5 per Feather convention"
  resolved_questions: []
  pending_questions: []
```

Special rule for icon-generator: any unknown about **semantic naming or whether the icon duplicates an existing one** is automatically `high`. Icon library bloat from near-duplicates is one of the slowest, most painful DS debts to pay back.
