# Icon Standards Reference

The defaults follow Lucide's published icon design guide (lucide.dev): a 24×24 canvas, 2px strokes, round caps and joins. If the repo's existing icons use different values, match the repo.

## Visual Grid

```
┌────────────────────────┐
│  1px minimum padding   │  stroke edges stay at least 1px inside the canvas
│  ┌──────────────────┐  │
│  │                  │  │
│  │   LIVE AREA      │  │  with a 2px stroke, path coordinates stay within 2–22
│  │   (20×20 for     │  │  (1px padding + 1px half-stroke on each side)
│  │    coordinates)  │  │
│  └──────────────────┘  │
│                        │
└────────────────────────┘
        24×24 viewBox
```

## Stroke Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Default weight | 2px | Lucide default; match the repo if its set uses 1.5px |
| Allowed range | 1.5–2.5px | Use one weight across the whole set |
| Line cap | round | `strokeLinecap="round"` (open paths) |
| Line join | round | `strokeLinejoin="round"` |
| Miter limit | N/A | Not used with round joins |

## Corners and Spacing

| Rule | Value |
|------|-------|
| Corner radius, shapes 8px or larger | 2px |
| Corner radius, shapes smaller than 8px | 1px |
| Minimum gap between distinct elements | 2px |

## Color Usage

```tsx
<>
  {/* Always currentColor, so the icon inherits the surrounding text color */}
  <path stroke="currentColor" d="M5 12h14" />

  {/* Subtle fills only, used sparingly, at most 0.3 opacity */}
  <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fillOpacity={0.2} />

  {/* Never a raw color such as stroke="#2563EB": it ignores themes, dark mode, and forced colors */}
</>
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
  stroke-width="2"
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

## Filled Variant Construction

The closed-shapes rule in SKILL.md, step by step:

1. **Start from the outline's outer edge.** The stroke adds half its width on each side, so a 2px stroke around a shape with a 2px corner radius gives a filled shape 1px larger on every side with a 3px corner.
2. **Close every shape.** Each filled subpath ends in `Z` or is a `rect`/`circle`. Open strokes (lines, arcs, the open top of a box) are redrawn as closed shapes or dropped.
3. **Cut details out.** Interior lines (a slot, a fold, a check mark inside a circle) become knockout subpaths in the same `<path>` with `fill-rule="evenodd"` (`fillRule="evenodd"` in JSX). Keep knockouts at least 2px wide so they survive at 16px.
4. **Keep the 2px gap** between parts that are separate in the outline.
5. **Compare at 16px and 24px** side by side with the outline: same footprint, similar visual weight.

See `examples.md` for a worked archive icon.

## Optical Alignment

Icons should be optically centered, not mathematically centered.

### Weight Distribution
- Heavier elements should sit slightly lower
- Pointed elements (arrows) can extend slightly beyond grid
- Circular icons should touch all edges of the live area

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
- Run SVGO on anything exported from a design tool (config in SKILL.md)

### Don't
- Use paths with excessive anchor points
- Include invisible elements
- Add unnecessary precision (3+ decimal places)

## Matching the Existing Set

Before drawing, collect the repo's existing icons (format in `existing-icons.md`) and compare a few of them for stroke width, corner radius, and how much of the live area they fill. Match those, even where they differ from the defaults above.
