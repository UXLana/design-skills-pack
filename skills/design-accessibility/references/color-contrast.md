# Color & Contrast

## Contrast Ratios

| Content Type | Minimum Ratio | WCAG Criterion |
|--------------|---------------|----------------|
| Normal text | 4.5:1 | 1.4.3 AA |
| Large text (≥18pt / 24px, or ≥14pt / ≈18.66px bold) | 3:1 | 1.4.3 AA |
| UI components (boundaries, icons, state indicators) | 3:1 against adjacent colors | 1.4.11 AA |
| Focus indicators | 3:1 against the colors next to the indicator | 1.4.11 AA (with 2.4.7) |
| Graphical objects | 3:1 | 1.4.11 AA |

**Exempt:** text and boundaries of inactive (disabled) components, pure decoration, logotypes, and browser-default focus rings the author hasn't restyled (they must still be visible).

## What Counts as a Pass

- **The WCAG 2 contrast ratio is the only conformance test.** Compute it with the formula below from the colors the browser actually renders.
- **Don't round.** The thresholds are hard: 4.499:1 fails 4.5:1. Report ratios truncated to two decimals.
- **APCA is not part of WCAG 2.** It can help pick colors that read better (especially for dark themes and thin type), but report APCA results as `[Best Practice]`, never as a pass or fail.
- **Test every theme and mode.** A pair that passes in light mode can fail in dark or high-contrast mode.

## Calculating Contrast

### Relative Luminance Formula
```typescript
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    // WCAG 2.2 uses 0.04045 (older texts say 0.03928; the difference has no practical effect)
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

### Audit Token Combinations
```typescript
interface TokenPair {
  foreground: string;
  background: string;
  minRatio: number;
  context: string;
}

const auditPairs: TokenPair[] = [
  // Text combinations
  { fg: 'color.text.primary', bg: 'color.bg.surface', minRatio: 4.5, context: 'body text' },
  { fg: 'color.text.secondary', bg: 'color.bg.surface', minRatio: 4.5, context: 'secondary text' },
  { fg: 'color.text.muted', bg: 'color.bg.surface', minRatio: 4.5, context: 'muted text' },
  { fg: 'color.text.inverse', bg: 'color.bg.brand', minRatio: 4.5, context: 'inverse text' },
  
  // UI component combinations
  { fg: 'color.border.default', bg: 'color.bg.surface', minRatio: 3.0, context: 'borders' },
  { fg: 'color.border.input', bg: 'color.bg.surface', minRatio: 3.0, context: 'input borders' },
  { fg: 'color.icon.default', bg: 'color.bg.surface', minRatio: 3.0, context: 'icons' },
  { fg: 'color.focus.ring', bg: 'color.bg.surface', minRatio: 3.0, context: 'focus ring' },
  
  // State colors
  { fg: 'color.text.error', bg: 'color.bg.surface', minRatio: 4.5, context: 'error text' },
  { fg: 'color.text.success', bg: 'color.bg.surface', minRatio: 4.5, context: 'success text' },
  { fg: 'color.text.warning', bg: 'color.bg.surface', minRatio: 4.5, context: 'warning text' },
];
```

## Color Blindness Patterns

### Common Types
| Type | Prevalence | Colors Affected |
|------|------------|-----------------|
| Protanopia | 1% male | Red-green (red appears dark) |
| Deuteranopia | 1% male | Red-green (green appears tan) |
| Tritanopia | 0.001% | Blue-yellow |
| Achromatopsia | 0.003% | All colors (sees grayscale) |

### Safe Color Combinations
```
✓ Blue + Orange (distinct for all types)
✓ Blue + Yellow (distinct for protanopia/deuteranopia)
✓ Purple + Yellow (high contrast, distinct)
✓ Dark blue + Light blue (luminance difference)

✗ Red + Green (problematic for most color blindness)
✗ Green + Brown (often confused)
✗ Blue + Purple (problematic for tritanopia)
✗ Pink + Gray (low distinction for deuteranopia)
```

### Don't Rely on Color Alone
```tsx
// ❌ Color-only status
<span className="text-red-500">Error</span>
<span className="text-green-500">Success</span>

// ✓ Color + icon + text
<span className="text-red-500">
  <ErrorIcon aria-hidden="true" /> Error: Field is required
</span>
<span className="text-green-500">
  <CheckIcon aria-hidden="true" /> Success: Changes saved
</span>
```

## Focus Indicator Requirements

### Minimum Requirements (1.4.11 with 2.4.7)
```css
/* Draw focus with outline: it survives forced-colors mode, box-shadow does not */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

### Calculating Focus Contrast
Measure the indicator against the colors it actually touches, which depends on where it is drawn:

| Indicator drawn… | Needs 3:1 against |
|---|---|
| Outside the component (outline with offset — the common case) | The surface the component sits on |
| Inside the component | The component's own background |
| On the component's border | Both the component background and the surface outside |
| Partly inside, partly outside | Either part may provide the contrast |

```
Surface the button sits on: #F5F5F5
Button background:          #FFFFFF
Focus ring (2px, offset 2px, drawn outside): #005FCC

Ring vs surface #F5F5F5 = 5.48:1 ✓  (the pair that counts for an outside ring)
Ring vs button  #FFFFFF = 5.98:1 ✓  (only matters if the ring touches the button)
```

1.4.11 does not require contrast between the focused and unfocused states; that is 2.4.13 Focus Appearance (AAA). A focus style that only changes a background color is out of scope for 1.4.11 but can fail 1.4.1 Use of Color.

## Issue Templates

### Insufficient Text Contrast
```markdown
### [SERIOUS] Insufficient text contrast

**WCAG Criterion:** 1.4.3 — Contrast (Minimum) (Level AA)
**Location:** `src/components/Badge.tsx:15`
**Category:** Color & Contrast

**Current State:**
Text color `#808080` on background `#FFFFFF` has a contrast ratio of 3.94:1

**Required State:**
Minimum 4.5:1 for normal text

**Code Fix:**
\`\`\`tsx
// Before
color: '#808080', // 3.94:1 — fails

// After
color: '#767676', // 4.54:1 — passes; the lightest neutral gray that does (#777777 is 4.47:1)
\`\`\`
```

### Color-Only Information
```markdown
### [SERIOUS] Information conveyed by color alone

**WCAG Criterion:** 1.4.1 — Use of Color (Level A)
**Location:** `src/components/StatusBadge.tsx:22`
**Category:** Color & Contrast

**Current State:**
Status indicator uses only color to differentiate states (red/yellow/green dots)

**Required State:**
Provide additional visual indicators (icons, patterns, or text labels)

**Code Fix:**
\`\`\`tsx
// Before
<span className={`dot ${status}`} />

// After
<span className={`status-badge ${status}`}>
  <StatusIcon status={status} aria-hidden="true" />
  <span className="sr-only">{statusLabels[status]}</span>
</span>
\`\`\`
```

## Testing Tools

### Automated
- axe DevTools browser extension
- Lighthouse accessibility audit
- WAVE browser extension

### Manual Verification
```bash
# macOS: Enable grayscale
System Preferences > Accessibility > Display > Color Filters > Grayscale

# Chrome DevTools
DevTools > Rendering > Emulate vision deficiencies
```

### Contrast Checkers
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Stark (Figma plugin)
- Color contrast analyzers in browser DevTools
