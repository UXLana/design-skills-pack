# Keyboard & Focus

**Contents:** Core Requirements · Focus Visibility (incl. forced colors, Tailwind) · Tab Order · Keyboard Traps · Modal Dialogs (native `<dialog>`, `inert`) · Focus Not Obscured (2.4.11) · Skip Links · Common Keyboard Patterns · Issue Templates · Testing Checklist

## Core Requirements

| Requirement | WCAG Criterion | Level |
|-------------|----------------|-------|
| All functionality via keyboard | 2.1.1 | A |
| No keyboard traps | 2.1.2 | A |
| Logical focus order | 2.4.3 | A |
| Visible focus indicator | 2.4.7 | AA |
| Focus indicator contrast (3:1 against adjacent colors) | 1.4.11 | AA |
| Focus not entirely obscured | 2.4.11 | AA (WCAG 2.2) |

## Focus Visibility

### Minimum Requirements
```css
/* Visible, 3:1 against the surface it is drawn on (see color-contrast.md) */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
```

Browsers only show their default ring on `:focus-visible`, so there is rarely a reason to strip outlines on plain `:focus`. If you remove the default, replace it with something at least as visible.

### Forced Colors (Windows High Contrast)

In forced-colors mode the browser replaces author colors with system colors and **forces `box-shadow` to none**. A focus ring drawn only with `box-shadow` (including Tailwind `ring-*` utilities) disappears; an `outline` stays, and even a transparent outline becomes visible in a system color.

```css
/* ✓ Ring for normal mode, transparent outline as the forced-colors fallback */
.btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* ✓ Or state it explicitly */
@media (forced-colors: active) {
  .btn:focus-visible { outline: 2px solid Highlight; }
}
```

Check every custom focus style with forced colors on (Windows: Settings → Accessibility → Contrast themes; Chrome DevTools: Rendering → Emulate CSS media feature `forced-colors: active`).

### Tailwind Focus Utilities (v4 vs v3)

| You want | Tailwind v4 | Tailwind v3 |
|---|---|---|
| Hide the outline but keep it for forced colors | `outline-hidden` | `outline-none` |
| Remove the outline entirely (`outline-style: none`) | `outline-none` — avoid on focusable elements | (no direct utility) |
| Visible 2px focus outline | `focus-visible:outline-2` | `focus-visible:outline focus-visible:outline-2` |

In v4, `outline-none` really removes the outline, so a v3 habit of `focus:outline-none` plus a `ring` leaves nothing visible in forced-colors mode. Note too that v4's bare `ring` is 1px (use `ring-3` for v3's 3px).

### Focus States by Component

| Component | Focus Style | Notes |
|-----------|-------------|-------|
| Button | Outline ring | 2px, 3:1 against the surface |
| Link | Outline or underline change | Must be visible |
| Input | Border highlight + outline | Often combined |
| Checkbox/Radio | Outline around control | Not just the input |
| Card (clickable) | Outline entire card | Visible boundary |
| Tab | Underline or background | Part of tab pattern |

### Component Pattern
```tsx
// Tailwind v4 — outline survives forced colors; no `focus:outline-none` needed
const Button = ({ children, ...props }) => (
  <button
    className={cn(
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-focus-ring' // theme color --color-focus-ring
    )}
    {...props}
  >
    {children}
  </button>
);
```

## Tab Order

### Natural Order
```tsx
// ✓ DOM order = visual order = tab order
<form>
  <label htmlFor="name">Name</label>
  <input id="name" />

  <label htmlFor="email">Email</label>
  <input id="email" />

  <button type="submit">Submit</button>
</form>

// ❌ CSS reordering breaks tab order
<div className="flex flex-col-reverse">
  <button>First visually, last in tab order</button>
  <input /> {/* Second visually, first in tab order */}
</div>
```

### Managing Focus Programmatically
```tsx
// Focus management for dynamic content
const [isOpen, setIsOpen] = useState(false);
const closeButtonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isOpen) {
    closeButtonRef.current?.focus();
  }
}, [isOpen]);
```

## Keyboard Traps

### Detection Patterns
```typescript
// ❌ Keyboard trap: focus can't leave
<div onKeyDown={(e) => e.preventDefault()}>
  <input /> {/* Trapped! */}
</div>

// ❌ Keyboard trap: custom handler without Tab support
<div onKeyDown={handleCustomNavigation}>
  {/* If handler doesn't pass Tab through, trapped */}
</div>
```

A modal dialog that keeps focus inside while it is open is not a trap, as long as Escape or a visible close button gets the user out.

## Modal Dialogs

### Default: native `<dialog>` with `showModal()`

The browser does the hard parts: modal semantics (implicit `aria-modal="true"`), the rest of the page made inert, Escape to close (via the `cancel` event), focus moved to the first focusable element inside, and the dialog drawn in the top layer above everything else.

```tsx
function ConfirmDialog({ open, onClose, title, children }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.returnValue = ''; // Escape leaves the previous value in place
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // onClose fires for Escape, form[method=dialog] and dialog.close();
    // returnValue is 'confirm' when the Confirm button closed it, '' otherwise
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onClose={() => onClose(ref.current?.returnValue)}
    >
      <h2 id="confirm-title">{title}</h2>
      {children}
      <form method="dialog">
        {/* showModal() focuses the first focusable element — put the safe choice first */}
        <button>Cancel</button>
        <button value="confirm">Confirm</button>
      </form>
    </dialog>
  );
}
```

- Don't add `role="dialog"`, `aria-modal` or `tabindex` to a native `<dialog>` — they are implicit or wrong.
- Don't layer a hand-written Tab trap on top; `showModal()` already makes the background inert.
- Focus returns to the element that opened the dialog when it closes (HTML spec). Verify it in your target browsers, and restore focus yourself if the opener was re-rendered or removed while the dialog was open.

### Custom overlays: make the background `inert`

If you can't use `<dialog>` (a library overlay, a full-screen sheet), give the container `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, and set the `inert` attribute on everything outside it while it is open. `inert` removes the background from the tab order and the accessibility tree in one step — sturdier than a manual Tab trap, which misses elements added after it ran.

```tsx
// App shell: overlay is rendered as a sibling of the main content.
// React 19 treats `inert` as a boolean; on React 18 pass inert="" instead of true.
<div id="app-content" inert={isOverlayOpen}>{/* page */}</div>
{isOverlayOpen && (
  <div role="dialog" aria-modal="true" aria-labelledby="sheet-title">
    <h2 id="sheet-title">Filters</h2>
    {/* … */}
  </div>
)}
```

Non-modal popovers are different: don't trap or inert anything (see `aria-patterns.md`).

## Focus Not Obscured (2.4.11)

When a component receives keyboard focus, it must not be **entirely** hidden by author-created content — sticky headers and footers, cookie banners, chat launchers, non-modal drawers. Partly covered passes AA; fully visible is 2.4.12 (AAA). Content the user opened (and can dismiss without moving focus) doesn't count against you.

```tsx
// ❌ Sticky header covers focused content
<header className="fixed top-0 h-16 z-50">Navigation</header>
<main>
  <button>This can scroll under the header when tabbed to</button>
</main>
```

```css
/* ✓ Account for fixed elements when the browser scrolls focus into view */
html {
  scroll-padding-top: 80px; /* header height + buffer */
}

/* ✓ Or per element */
button, a, input, select, textarea {
  scroll-margin-top: 80px;
}
```

## Skip Links

### Implementation
```tsx
// First focusable element on page
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// ... navigation ...

<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

### Styling
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--color-bg-surface);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## Common Keyboard Patterns

### Standard Keys
| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate button/link |
| Space | Activate button, toggle checkbox |
| Escape | Close modal/menu/dropdown |
| Arrow keys | Navigate within composite widgets |

### Widget-Specific Patterns

**Tabs**
```
Tab: Enter/exit tab list
Arrow Left/Right: Move between tabs
Home: First tab
End: Last tab
```

**Menu**
```
Enter/Space: Open menu
Arrow Down: Next item
Arrow Up: Previous item
Escape: Close menu
Home: First item
End: Last item
```

**Combobox**
```
Arrow Down: Open list / next option
Arrow Up: Previous option
Enter: Select option
Escape: Close list
```

## Issue Templates

### Missing Keyboard Access
```markdown
### [CRITICAL] Interactive element not keyboard accessible

**WCAG Criterion:** 2.1.1 — Keyboard (Level A)
**Location:** `src/components/Card.tsx:15`
**Category:** Keyboard & Focus

**Current State:**
Clickable card uses `<div onClick={...}>` without keyboard support

**Required State:**
All interactive elements must be operable with keyboard

**Code Fix:**
\`\`\`tsx
// Before
<div onClick={handleClick} className="card">

// After
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="card"
>
\`\`\`
```

### Focus Not Visible
```markdown
### [SERIOUS] Focus indicator not visible

**WCAG Criterion:** 2.4.7 — Focus Visible (Level AA)
**Location:** `src/components/Button.tsx:23`
**Category:** Keyboard & Focus

**Current State:**
Button uses `outline-none` (Tailwind v4: removes the outline) with no visible replacement

**Required State:**
Visible focus indicator at 3:1 against the surface, still visible in forced-colors mode

**Code Fix:**
\`\`\`tsx
// Before
className="outline-none"

// After (Tailwind v4)
className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
\`\`\`
```

### Focus Lost in Forced Colors
```markdown
### [SERIOUS] Focus ring disappears in forced-colors mode

**WCAG Criterion:** 2.4.7 — Focus Visible (Level AA)
**Location:** `src/components/IconButton.tsx:12`
**Category:** Keyboard & Focus

**Current State:**
Focus is drawn only with `focus-visible:ring-2` (box-shadow) after `outline-none`;
forced colors removes box-shadow, leaving no indicator

**Code Fix:**
\`\`\`tsx
// Before (v4)
className="outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"

// After (v4) — keep the ring, add a transparent outline that forced colors can show
className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-focus-ring"
\`\`\`
```

### Focus Obscured
```markdown
### [SERIOUS] Focused element obscured by sticky header

**WCAG Criterion:** 2.4.11 — Focus Not Obscured (Minimum) (Level AA)
**Source label:** [WCAG 2.2 AA]
**Location:** `src/layouts/MainLayout.tsx`
**Category:** Keyboard & Focus

**Current State:**
When tabbing through the page, focused elements scroll fully under the 64px sticky header

**Required State:**
Focused elements must not be entirely hidden by author content

**Code Fix:**
\`\`\`css
html {
  scroll-padding-top: 80px;
}
\`\`\`
```

## Testing Checklist

- [ ] Tab through entire page without mouse
- [ ] All interactive elements receive focus
- [ ] Focus order matches visual order
- [ ] Focus indicator visible on all elements, at 3:1 against the surface
- [ ] Focus indicator still visible with forced colors on
- [ ] Focused elements never fully hidden under sticky headers, banners or drawers
- [ ] Can activate all controls with Enter/Space
- [ ] Escape closes modals/menus, and focus returns to the opener
- [ ] No keyboard traps
- [ ] Skip link present and functional
