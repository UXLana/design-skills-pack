# Icon Accessibility Guide

## WCAG 2.1 AA Requirements for Icons

### 1. Non-Text Contrast (WCAG 1.4.11)

Icons must have sufficient contrast against their background.

| Context | Minimum Ratio | Notes |
|---------|---------------|-------|
| Informative icons | 3:1 | Icons that convey meaning |
| Interactive icons | 3:1 | Buttons, links with icons |
| Decorative icons | N/A | No contrast requirement |
| Text-equivalent icons | 4.5:1 | Icons replacing text |

### 2. Focus Visible (WCAG 2.4.7)

Interactive icons must have a visible focus indicator.

```css
/* Recommended focus styles */
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Alternative with box-shadow */
button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background),
              0 0 0 4px var(--color-focus);
}
```

### 3. Target Size (WCAG 2.5.5 - AAA, 2.5.8 - AA)

| Level | Minimum Size | Notes |
|-------|--------------|-------|
| AA | 24x24px | Minimum for pointer targets |
| AAA | 44x44px | Recommended for touch |

```tsx
// Ensure adequate touch target
<button style={{
  minWidth: '44px',
  minHeight: '44px',
  padding: '10px' // Icon + padding = 44px
}}>
  <IconClose size="md" /> {/* 24px icon */}
</button>
```

## ARIA Patterns

### Decorative Icons

Icons that don't convey meaning should be hidden from assistive technology.

```tsx
// Pattern 1: aria-hidden
<svg aria-hidden="true" focusable="false">
  {/* paths */}
</svg>

// Pattern 2: role="presentation"
<svg role="presentation" focusable="false">
  {/* paths */}
</svg>

// Pattern 3: Both (maximum compatibility)
<svg aria-hidden="true" role="presentation" focusable="false">
  {/* paths */}
</svg>
```

### Informative Icons

Icons that convey meaning need accessible names.

```tsx
// Pattern 1: aria-label on SVG
<svg aria-label="Settings" role="img">
  {/* paths */}
</svg>

// Pattern 2: aria-labelledby with hidden text
<svg aria-labelledby="icon-title">
  <title id="icon-title">Settings</title>
  {/* paths */}
</svg>

// Pattern 3: Visible text association
<span id="settings-label">Settings</span>
<svg aria-labelledby="settings-label" role="img">
  {/* paths */}
</svg>
```

### Interactive Icons

Icons used as buttons or links.

```tsx
// Icon-only button
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">
    {/* paths */}
  </svg>
</button>

// Icon with visible label (icon is decorative)
<button>
  <svg aria-hidden="true" focusable="false">
    {/* paths */}
  </svg>
  <span>Save</span>
</button>

// Icon link
<a href="/settings" aria-label="Settings">
  <svg aria-hidden="true" focusable="false">
    {/* paths */}
  </svg>
</a>
```

### Status Icons

Icons indicating state or status.

```tsx
// Error state
<div role="alert">
  <svg aria-hidden="true" focusable="false">
    {/* error icon */}
  </svg>
  <span>Error: Please fix the highlighted fields</span>
</div>

// Status with icon only (needs label)
<svg aria-label="Error" role="img" style={{ color: 'var(--color-error)' }}>
  {/* error icon */}
</svg>

// Loading state
<svg aria-label="Loading" role="status">
  {/* spinner icon */}
</svg>
```

### Toggle Icons

Icons that change based on state.

```tsx
// Favorite toggle
<button
  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
  aria-pressed={isFavorite}
>
  <svg aria-hidden="true" focusable="false">
    {isFavorite ? <FilledHeartPath /> : <OutlineHeartPath />}
  </svg>
</button>

// Visibility toggle
<button
  aria-label={isVisible ? "Hide password" : "Show password"}
  aria-pressed={isVisible}
>
  <svg aria-hidden="true" focusable="false">
    {isVisible ? <EyeOffPath /> : <EyePath />}
  </svg>
</button>
```

## Screen Reader Behavior

### Expected Announcements

| Icon Type | Expected Announcement |
|-----------|----------------------|
| Decorative | Nothing (skipped) |
| Informative | aria-label value |
| Button with icon | Button label + role |
| Link with icon | Link label + role |
| Status icon | Status + aria-label |

### Testing Checklist

```markdown
- [ ] VoiceOver (macOS): VO + Right Arrow navigates correctly
- [ ] VoiceOver (iOS): Swipe navigates correctly
- [ ] NVDA (Windows): Arrow keys navigate correctly
- [ ] JAWS (Windows): Arrow keys navigate correctly
- [ ] Decorative icons are skipped
- [ ] Interactive icons announce their action
- [ ] Status icons announce their meaning
```

## Color Independence

Icons should not rely solely on color to convey meaning.

### Bad Example
```tsx
// DON'T: Color-only status indication
<IconCircle style={{ color: isOnline ? 'green' : 'red' }} />
```

### Good Examples
```tsx
// DO: Different icons for different states
{isOnline ? <IconCheckCircle /> : <IconXCircle />}

// DO: Icon + text
<div>
  <IconCheckCircle style={{ color: 'green' }} />
  <span>Online</span>
</div>

// DO: Icon with aria-label
<IconCheckCircle
  aria-label="Status: Online"
  style={{ color: 'green' }}
/>
```

## High Contrast Mode

Icons should remain visible in Windows High Contrast Mode.

```css
/* Ensure icons use currentColor */
svg {
  fill: currentColor;
  stroke: currentColor;
}

/* Or use forced-colors media query */
@media (forced-colors: active) {
  svg {
    fill: CanvasText;
    stroke: CanvasText;
  }
}
```

## Motion and Animation

### Reduced Motion

Respect user preferences for reduced motion.

```css
/* Pause animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .icon-spinner {
    animation: none;
  }

  .icon-pulse {
    animation: none;
  }
}
```

### Loading Indicators

```tsx
// Accessible loading spinner
<svg
  aria-label="Loading"
  role="status"
  className="icon-spinner"
>
  {/* spinner paths */}
</svg>

// With live region for updates
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading && <IconLoader aria-label="Loading content" />}
</div>
```

## Implementation Checklist

### For Each Icon Component

```markdown
□ aria-hidden="true" OR meaningful aria-label
□ role="presentation" OR role="img"
□ focusable="false" on SVG element
□ currentColor for stroke/fill
□ No hardcoded colors
□ Works at 200% zoom
□ Visible in high contrast mode
```

### For Interactive Icons

```markdown
□ Wrapped in button/link element
□ Parent has aria-label
□ Minimum 44x44px touch target
□ Visible focus indicator
□ Keyboard accessible
□ Works with screen readers
```

### For Status Icons

```markdown
□ Meaningful aria-label
□ Don't rely solely on color
□ Associated with status text
□ Announced by screen readers
□ Works in high contrast mode
```
