# Icon Standards Reference

## Visual Grid

```
┌────────────────────────┐
│  ·  ·  ·  ·  ·  ·  ·  │  2px padding
│  ┌──────────────────┐  │
│  │                  │  │
│  │    ACTIVE AREA   │  │  20x20 active area
│  │      20x20       │  │
│  │                  │  │
│  └──────────────────┘  │
│  ·  ·  ·  ·  ·  ·  ·  │  2px padding
└────────────────────────┘
        24x24 viewBox
```

## Stroke Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Default weight | 1.5px | Standard for all icons |
| Min weight | 1px | For delicate details |
| Max weight | 2.5px | For bold emphasis |
| Line cap | round | `strokeLinecap="round"` |
| Line join | round | `strokeLinejoin="round"` |
| Miter limit | N/A | Not used with round joins |

## Color Usage

```tsx
// Always use currentColor for inheritance
stroke="currentColor"

// For subtle fills (use sparingly)
fill="currentColor"
fillOpacity="0.2"  // Max 30% opacity

// Never use hardcoded colors
// BAD: stroke="#2563EB"
// GOOD: stroke="currentColor"
```

## SVG Structure

### Minimal Template

```svg
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- Paths go here -->
</svg>
```

### Common Elements

#### Lines
```svg
<line x1="5" y1="12" x2="19" y2="12" />
```

#### Circles
```svg
<circle cx="12" cy="12" r="4" />
```

#### Rectangles
```svg
<rect x="3" y="3" width="18" height="18" rx="2" />
```

#### Polylines (connected lines)
```svg
<polyline points="9 18 15 12 9 6" />
```

#### Paths (complex shapes)
```svg
<path d="M12 2v20" />
```

## Optical Alignment

Icons should be optically centered, not mathematically centered.

### Weight Distribution
- Heavier elements should sit slightly lower
- Pointed elements (arrows) can extend slightly beyond grid
- Circular icons should touch all edges of active area

### Example: Chevron
```
Mathematical center: Points at 12,12
Optical center: Shifted slightly toward the point direction
```

## Complexity Guidelines

| Size | Max Elements | Detail Level |
|------|--------------|--------------|
| 12px (xs) | 2-3 | Extremely simple |
| 16px (sm) | 3-4 | Simple |
| 20px (md) | 4-6 | Standard |
| 24px (lg) | 5-8 | Detailed |
| 32px+ | 8+ | Full detail |

## Path Optimization

### Do
- Use simple primitives (line, circle, rect) when possible
- Combine connected paths into single elements
- Round coordinates to whole numbers or .5

### Don't
- Use paths with excessive anchor points
- Include invisible elements
- Add unnecessary precision (3+ decimal places)

## Existing Icon Reference

List the icons already in your design system here so new icons match their style. Example:

### Navigation Icons
- `IconColors` - Half-filled circle representing color system
- `IconTypography` - "T" with horizontal lines
- `IconSpacing` - Grid pattern
- `IconRadius` - Corner brackets
- `IconShadows` - Layered rectangles with offset
- `IconBreakpoints` - Monitor with stand

### Component Icons
- `IconAvatar` - User silhouette
- `IconButton` - Rounded rectangle with horizontal line
- `IconTab` - Horizontal lines with highlighted section
- `IconBanner` - Rectangle with text lines

### Utility Icons
- `IconChevron` - Rotatable arrow
- `IconFoundations` - Stacked layers (3D)
- `IconComponents` - 2x2 grid of squares
