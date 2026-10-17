# Token Mappings Reference

Token names and paths below are illustrative; substitute the names from your own token file.

## Size Tokens

Map icon sizes to the design system spacing/size tokens.

```typescript
// Icon size token mapping
export const iconSizes = {
  xs: 12,   // Extra small - inline badges, compact UI
  sm: 16,   // Small - body text inline, secondary actions
  md: 20,   // Medium - navigation, primary buttons (DEFAULT)
  lg: 24,   // Large - headers, emphasis, touch targets
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

## Stroke Width Tokens

```typescript
// Stroke weight options
export const iconStrokeWidths = {
  thin: 1,      // Delicate, refined
  default: 1.5, // Standard weight (RECOMMENDED)
  medium: 2,    // Slightly bold
  bold: 2.5     // Heavy emphasis
}
```

## Component Token Integration

### Button Icons
```typescript
// Button component icon sizing
buttonTokens: {
  icon: {
    lg: iconSizes.md,  // 20px in large buttons
    md: iconSizes.sm,  // 16px in medium buttons
  },
  gap: {
    lg: spacing.3,     // 12px gap
    md: spacing.2,     // 8px gap
  }
}
```

### Navigation Icons
```typescript
// Sidebar navigation icons
navTokens: {
  icon: {
    section: iconSizes.lg,  // 18px for section headers
    item: iconSizes.md,     // 20px for nav items
  },
  color: {
    default: 'colors.text.mediumEmphasis',
    active: 'colors.text.highEmphasis',
    hover: 'colors.text.highEmphasis',
  }
}
```

### Banner Icons
```typescript
// Banner component icons
bannerTokens: {
  icon: {
    md: iconSizes.md,   // 20px
    lg: iconSizes.lg,   // 24px
  },
  colors: {
    info: 'colors.semantic.info.main',
    success: 'colors.semantic.success.main',
    warning: 'colors.semantic.warning.main',
    error: 'colors.semantic.error.main',
  }
}
```

### Tab Icons
```typescript
// Tab component icons
tabTokens: {
  icon: {
    default: iconSizes.md,  // 20px
  },
  positions: ['none', 'top', 'leading', 'only']
}
```

## Accessibility Tokens

```typescript
// Minimum touch target sizes
accessibilityTokens: {
  minTouchTarget: 44,      // 44px minimum for touch
  minClickTarget: 24,      // 24px minimum for pointer
  focusRingWidth: 2,       // 2px focus ring
  focusRingOffset: 2,      // 2px offset from element
  focusRingColor: 'colors.brand.primary',
}
```

## Transition Tokens

```typescript
// Icon animation tokens
transitionTokens: {
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
  }
}
```

## Usage Examples

### In React Components

```tsx
import { iconSizes, iconColors } from '@/styles/design-tokens'

// Using size tokens
<IconSettings size="md" /> // Uses iconSizes.md = 20px

// Using color via CSS inheritance
<div style={{ color: colors.semantic.error.main }}>
  <IconAlert /> // Inherits red color
</div>

// Using custom color prop
<IconCheck style={{ color: colors.semantic.success.main }} />
```

### In Inline Styles

```tsx
const iconStyle: React.CSSProperties = {
  width: iconSizes.md,
  height: iconSizes.md,
  color: colors.text.highEmphasis,
  transition: `color ${transitions.duration.fast}ms ${transitions.timing.ease}`,
}
```

## Z-Index for Icon Overlays

```typescript
// When icons need stacking context
zIndex: {
  iconBadge: 1,        // Badge over icon
  iconOverlay: 2,      // Overlay indicator
  iconTooltip: 700,    // Tooltip z-index
}
```
