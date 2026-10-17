# Token Mappings Reference

Token names and paths below are illustrative; substitute the names from your own token file.

## Size Tokens

Map icon sizes to the design system spacing/size tokens.

```typescript
// Icon size token mapping (the same scale as BaseIcon's iconSizes)
export const iconSizes = {
  xs: 12,   // Extra small - inline badges, compact UI
  sm: 16,   // Small - body text inline, secondary actions
  md: 20,   // Medium - navigation, primary buttons (DEFAULT)
  lg: 24,   // Large - headers, emphasis
  xl: 32,   // Extra large - feature sections
  '2xl': 48 // 2X large - hero, empty states
}

// Corresponds to spacing tokens
// spacing.3 = 12px (xs)
// spacing.4 = 16px (sm)
// spacing.5 = 20px (md)
// spacing.6 = 24px (lg)
// spacing.8 = 32px (xl)
// spacing.12 = 48px (2xl)
```

## Color Token Integration

Icons inherit color from their parent context. When explicit colors are needed, use semantic tokens:

```typescript
// Color usage in icon contexts
export const iconColors = {
  // Default states
  default: 'colors.text.highEmphasis',      // Primary icon color
  muted: 'colors.text.mediumEmphasis',      // Secondary/disabled
  disabled: 'colors.text.disabled',          // Disabled state

  // Interactive states
  hover: 'colors.brand.primary',             // Hover state
  active: 'colors.brand.primaryDark',        // Active/pressed
  focus: 'colors.brand.primary',             // Focus ring

  // Semantic colors
  success: 'colors.semantic.success.main',   // Success indicators
  warning: 'colors.semantic.warning.main',   // Warning indicators
  error: 'colors.semantic.error.main',       // Error indicators
  info: 'colors.semantic.info.main',         // Info indicators

  // On dark backgrounds
  onDark: 'colors.text.onDarkHigh',          // Primary on dark
  onDarkMuted: 'colors.text.onDarkMedium',   // Secondary on dark
}
```

Any color used for a meaningful icon needs 3:1 against its background (see the table in `accessibility.md`); check `muted` and `disabled` in particular.

## Stroke Width Tokens

```typescript
// Stroke weight options; pick one for the whole set
export const iconStrokeWidths = {
  light: 1.5,   // For sets drawn at 1.5px
  default: 2,   // Lucide-style default (RECOMMENDED)
  bold: 2.5     // Heavy emphasis
}
```

## Component Token Integration — format

Record how each component sizes and colors its icons, in the repo's token file. The entries below show the shape; replace them with the repo's own components.

```typescript
// Button: icon size per button size
export const buttonTokens = {
  icon: {
    lg: iconSizes.md,  // 20px in large buttons
    md: iconSizes.sm,  // 16px in medium buttons
  },
  gap: {
    lg: spacing[3],    // 12px gap
    md: spacing[2],    // 8px gap
  },
}

// Navigation: section headers vs. items
export const navTokens = {
  icon: {
    section: iconSizes.lg,  // 24px for section headers
    item: iconSizes.md,     // 20px for nav items
  },
  color: {
    default: 'colors.text.mediumEmphasis',
    active: 'colors.text.highEmphasis',
  },
}
```

Keep each comment in step with the token it describes: `iconSizes.lg` is 24px, so a comment saying anything else is a bug in the docs.

## Target Size and Focus Tokens

```typescript
// Pointer target sizes; the WCAG criteria are in the table in accessibility.md
export const targetSize = {
  min: 24,     // 2.5.8 Target Size (Minimum), AA floor for dense desktop UI
  touch: 44,   // 2.5.5 Target Size (Enhanced), AAA; comfortable touch default
}

export const focusRing = {
  width: 2,    // px
  offset: 2,   // px from the element
  color: 'colors.brand.primary',  // needs 3:1 against adjacent colors
}
```

## Transition Tokens

```typescript
// Icon animation tokens
export const transitionTokens = {
  // Rotation (chevrons, spinners)
  rotate: {
    duration: 'transitions.duration.normal',  // 200ms
    timing: 'transitions.timing.ease',
  },

  // Color change (hover states)
  color: {
    duration: 'transitions.duration.fast',    // 100ms
    timing: 'transitions.timing.ease',
  },

  // Loading spinner
  spin: {
    duration: '1000ms',
    timing: 'linear',
    iteration: 'infinite',
  },
}
```

## Usage Examples

### In React Components

```tsx
import { colors } from '@/styles/design-tokens'
import { IconAlertCircle, IconCheck, IconSettings } from '@/components/Icons'

function UsageExamples() {
  return (
    <>
      {/* Using size tokens: iconSizes.md = 20px */}
      <IconSettings size="md" />

      {/* Using color via CSS inheritance */}
      <div style={{ color: colors.semantic.error.main }}>
        <IconAlertCircle />
      </div>

      {/* Setting color directly */}
      <IconCheck style={{ color: colors.semantic.success.main }} />
    </>
  )
}
```

### In Inline Styles

```tsx
import type { CSSProperties } from 'react'
import { colors, iconSizes, transitions } from '@/styles/design-tokens'

const iconStyle: CSSProperties = {
  width: iconSizes.md,
  height: iconSizes.md,
  color: colors.text.highEmphasis,
  transition: `color ${transitions.duration.fast}ms ${transitions.timing.ease}`,
}
```

## Z-Index for Icon Overlays

```typescript
// When icons need stacking context
export const iconZIndex = {
  iconBadge: 1,        // Badge over icon
  iconOverlay: 2,      // Overlay indicator
  iconTooltip: 700,    // Tooltip z-index
}
```
