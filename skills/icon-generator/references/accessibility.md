# Icon Accessibility Guide (WCAG 2.2 AA)

## Contents

1. WCAG 2.2 AA requirements for icons (the one table)
2. Decorative or meaningful: the first decision
3. ARIA patterns: decorative, meaningful, buttons and links, toggles, status and loading
4. Focus indicators
5. Target size
6. Color independence
7. Forced colors (Windows high contrast)
8. Reduced motion
9. Screen reader behavior and testing
10. Checklist

The examples import icon components from the repo's icon barrel and assume they are built on `BaseIcon` (see SKILL.md), which hides an icon from assistive technology unless it is given a name.

## 1. WCAG 2.2 AA Requirements for Icons

This table is the single home for the numbers; SKILL.md and the examples point here.

| Requirement | WCAG 2.2 success criterion | Level | What it means for an icon |
|-------------|----------------------------|-------|---------------------------|
| Text alternative | 1.1.1 Non-text Content | A | A meaningful icon has an accessible name; a decorative icon is hidden from assistive technology. |
| Not color alone | 1.4.1 Use of Color | A | A state shown only by icon color (a red vs. green dot) also needs a shape change or text. |
| Icon contrast | 1.4.11 Non-text Contrast | AA | **3:1** against adjacent colors for any icon a user needs to understand the content or identify a control: stand-alone icons, icon-only buttons, status icons without text, a dropdown arrow. Decorative icons are exempt. |
| Text contrast | 1.4.3 Contrast (Minimum) | AA | Text inside or beside an icon (a label, a "PDF" badge drawn in the icon) needs 4.5:1, or 3:1 for large text (18pt, or 14pt bold, and up). The icon's shapes use the 3:1 above. |
| Focus visible | 2.4.7 Focus Visible | AA | The button or link around an interactive icon shows a visible focus indicator. The indicator is a state, so it also needs 3:1 against adjacent colors under 1.4.11. |
| Label in name | 2.5.3 Label in Name | A | When an icon button also shows text, its accessible name contains that text: a button showing "Save" can't be named "Store document". |
| Target size | 2.5.8 Target Size (Minimum) | AA | The clickable target is at least **24×24 CSS px**, unless it is spaced so that a 24px-diameter circle centered on it doesn't intersect another target or another undersized target's circle (other exceptions: an equivalent control elsewhere on the page, inline in a sentence, browser-controlled, essential). |
| Target size, enhanced | 2.5.5 Target Size (Enhanced) | AAA | **44×44 CSS px**. Not required for AA; use it as the comfortable size for touch. |
| Consistent identification | 3.2.4 Consistent Identification | AA | The same icon used for the same function is named the same way everywhere ("Delete" on every page, not "Trash" on one). |

Sources: the W3C "Understanding WCAG 2.2" pages for each criterion.

## 2. Decorative or Meaningful: The First Decision

Most icons are decorative: they sit next to text that already says the same thing, or inside a button whose label already says it. Hide those. An icon is meaningful only when it carries information nothing else on screen does, such as a status icon with no text or a stand-alone icon.

If visible text next to the icon already says what it means, make the icon decorative rather than pointing `aria-labelledby` at that text; otherwise a screen reader reads the text twice.

## 3. ARIA Patterns

### Decorative icons

`aria-hidden="true"` alone is enough, and it is what `BaseIcon` renders when the icon has no name:

```tsx
<IconArchive /> // renders <svg aria-hidden="true" …>
```

Adding `role="presentation"` as well changes nothing. Older guidance also adds `focusable="false"`, because Internet Explorer and the pre-Chromium Edge put inline SVGs in the tab order. Current browsers don't, so it is optional; keep it only if the repo already does.

### Meaningful stand-alone icons

Give the icon a name; `BaseIcon` then renders `role="img"` with that name and drops `aria-hidden`:

```tsx
<IconAlertCircle aria-label="Error" />
```

A raw inline SVG (no `BaseIcon`) can carry its name in a `<title>`. Generate the id with `useId()`: a hardcoded id such as `icon-title` collides as soon as the icon appears twice on a page.

```tsx
function InfoGraphic() {
  const titleId = useId()
  return (
    <svg role="img" aria-labelledby={titleId} viewBox="0 0 24 24" width={24} height={24}
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <title id={titleId}>Information</title>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  )
}
```

### Icon buttons and links

Put the name on the button or link, not on the icon, and leave the icon decorative. Naming both makes some screen readers announce the name twice.

```tsx
function IconActions() {
  return (
    <>
      {/* Icon-only button */}
      <button type="button" aria-label="Close dialog">
        <IconClose />
      </button>

      {/* Icon with visible text: the text is the name, the icon stays hidden */}
      <button type="button">
        <IconSave />
        Save
      </button>

      {/* Icon-only link */}
      <a href="/settings" aria-label="Settings">
        <IconSettings />
      </a>
    </>
  )
}
```

### Toggle buttons

Pick one of two patterns, never both at once. The WAI-ARIA Authoring Practices button pattern says the label of a toggle must not change when its state changes; a label like "Remove from favorites" combined with "pressed" contradicts itself.

```tsx
// Pattern A, a toggle button: fixed label, state in aria-pressed.
// Announced as "Favorite, toggle button, pressed".
function FavoriteToggle({ isFavorite, onToggle }: { isFavorite: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label="Favorite" aria-pressed={isFavorite} onClick={onToggle}>
      {isFavorite ? <IconStarFilled /> : <IconStar />}
    </button>
  )
}

// Pattern B, an action button: the label names the next action; no aria-pressed.
function PasswordVisibilityButton({ isVisible, onToggle }: { isVisible: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label={isVisible ? 'Hide password' : 'Show password'} onClick={onToggle}>
      {isVisible ? <IconEyeOff /> : <IconEye />}
    </button>
  )
}
```

### Status icons and loading indicators

When status text is present, the icon is decorative. When the icon is the only indicator, name it. For loading, the spinner is decorative and a live region carries the message. `role="status"` on the `<svg>` itself doesn't work: a status region announces changes to the text inside it, and an icon has no text.

```tsx
function FormErrorSummary({ count }: { count: number }) {
  return (
    <p role="alert">
      <IconAlertCircle />
      Fix the {count} highlighted fields
    </p>
  )
}

function SyncBadge() {
  return <IconCheckCircle aria-label="Synced" />
}

function ResultsLoading({ isLoading }: { isLoading: boolean }) {
  // The status region stays mounted; only its content changes, which is what gets announced.
  return (
    <div role="status">
      {isLoading && (
        <>
          <IconSpinner className="icon-spinner" />
          <VisuallyHidden>Loading results</VisuallyHidden>
        </>
      )}
    </div>
  )
}
```

## 4. Focus Indicators

Interactive icons are always inside a `<button>` or `<a>`; the focus ring goes on that element.

```css
.icon-button:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: var(--focus-ring-offset);
}
```

Check the ring color against the colors next to it (3:1, per the table).

## 5. Target Size

The icon can stay small; the button around it is the target. Pad the button to the target-size token rather than enlarging the icon:

```tsx
function IconButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: targetSize.touch, minHeight: targetSize.touch, // 44px, see the table
      }}
    >
      <IconClose size="md" /> {/* 20px icon inside a 44px target */}
    </button>
  )
}
```

`targetSize.min` (24px) is the AA floor for dense desktop UI such as table row actions; `targetSize.touch` (44px) is the comfortable default for anything used on touch screens.

## 6. Color Independence

Don't rely on icon color alone to convey meaning (1.4.1).

```tsx
function StatusExamples({ isOnline }: { isOnline: boolean }) {
  return (
    <>
      {/* Don't: same shape, only the color changes */}
      <IconCircle style={{ color: isOnline ? colors.feedback.success : colors.feedback.error }} />

      {/* Do: a different shape per state, and a name when there is no text */}
      {isOnline
        ? <IconCheckCircle aria-label="Online" />
        : <IconXCircle aria-label="Offline" />}

      {/* Do: icon plus text, icon decorative */}
      <span>
        <IconCheckCircle style={{ color: colors.feedback.success }} />
        Online
      </span>
    </>
  )
}
```

## 7. Forced Colors (Windows High Contrast)

Icons drawn with `currentColor` need no extra CSS: browsers' default style for SVG in forced-colors mode lets `currentColor` follow the forced text color of the parent, so the icon recolors with the text around it. Icons with hardcoded colors keep those colors and can vanish against the user's chosen background. Convert them to `currentColor`, or target only those elements:

```css
@media (forced-colors: active) {
  .icon-multicolor [fill]:not([fill='none']) { fill: CanvasText; }
  .icon-multicolor [stroke]:not([stroke='none']) { stroke: CanvasText; }
}
```

Don't set `fill: currentColor` on every `svg`: outline icons have `fill="none"` and would turn solid.

## 8. Reduced Motion

Respect the user's reduced-motion preference.

```css
@media (prefers-reduced-motion: reduce) {
  .icon-spinner,
  .icon-pulse {
    animation: none;
  }
}
```

A stopped spinner still needs its "Loading" text in the live region, so the state stays clear without motion.

## 9. Screen Reader Behavior and Testing

### Expected announcements

| Icon type | Expected announcement |
|-----------|----------------------|
| Decorative | Nothing (skipped) |
| Meaningful stand-alone | Its name, as an image ("Error, image") |
| Icon-only button | Button name + role ("Close dialog, button") |
| Toggle button | Name + role + state ("Favorite, toggle button, pressed") |
| Icon-only link | Link name + role ("Settings, link") |
| Loading | The live-region text ("Loading results") |

### Testing checklist

- [ ] VoiceOver (macOS): VO + Right Arrow reaches each named icon and control
- [ ] VoiceOver (iOS): swipe navigation announces the same
- [ ] NVDA (Windows): browse mode and Tab announce the same
- [ ] JAWS (Windows): browse mode and Tab announce the same
- [ ] Decorative icons are skipped
- [ ] Names are descriptive, not "icon", "image", or a file name

## 10. Checklist

### Every icon component

- [ ] Builds on `BaseIcon`: hidden by default, `role="img"` plus name when meaningful
- [ ] No hardcoded `aria-hidden="false"` and no hardcoded ids
- [ ] `currentColor` for stroke and fill; no raw colors
- [ ] Recognizable at 16px and clear at 200% zoom
- [ ] Visible in light, dark, and forced-colors modes
- [ ] 3:1 against its intended backgrounds when it is meaningful

### Interactive icons

- [ ] Wrapped in a `<button>` or `<a>`; the name is on that element
- [ ] Visible focus indicator with 3:1 contrast
- [ ] Target at least 24×24 CSS px (44×44 for touch)
- [ ] Toggles use a fixed label with `aria-pressed`, or a changing label without it
- [ ] Reachable and operable by keyboard

### Status icons

- [ ] Named, or paired with visible text (then decorative)
- [ ] State not shown by color alone
- [ ] Loading and progress announced through a live region, not the icon
