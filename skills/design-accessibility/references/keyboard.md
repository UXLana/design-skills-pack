# Keyboard Navigation

## Core Requirements

| Requirement | WCAG Criterion | Level |
|-------------|----------------|-------|
| All functionality via keyboard | 2.1.1 | A |
| No keyboard traps | 2.1.2 | A |
| Logical focus order | 2.4.3 | A |
| Visible focus indicator | 2.4.7 | AA |
| Focus not obscured | 2.4.11 | AA |

## Focus Visibility

### Minimum Requirements
```css
/* Focus indicator must have 3:1 contrast */
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Remove default outline only when replacing with visible alternative */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus States by Component

| Component | Focus Style | Notes |
|-----------|-------------|-------|
| Button | Outline ring | 2px, 3:1 contrast |
| Link | Outline or underline change | Must be visible |
| Input | Border highlight + outline | Often combined |
| Checkbox/Radio | Outline around control | Not just the input |
| Card (clickable) | Outline entire card | Visible boundary |
| Tab | Underline or background | Part of tab pattern |

### Component Pattern
```tsx
const Button = ({ children, ...props }) => (
  <button
    className={cn(
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-focus-ring',
      'focus:outline-none' // Remove default, show custom
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

### Modal Focus Trapping (Intentional)
```tsx
// Focus trap for modals is required, but must:
// 1. Allow Escape to close
// 2. Return focus to trigger on close

function Modal({ isOpen, onClose, triggerRef }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        triggerRef.current?.focus(); // Return focus
      }
      
      if (e.key === 'Tab') {
        // Trap focus within modal
        trapFocus(modalRef.current, e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);
}

// Helper: trap Tab/Shift+Tab inside a container
// Usage in the handler above; paste-ready for audit fixes.
export function trapFocus(container: HTMLElement | null, event: KeyboardEvent) {
  if (!container) return;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter((el) => !el.hasAttribute('inert') && el.offsetParent !== null);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    last.focus();
    event.preventDefault();
  } else if (!event.shiftKey && active === last) {
    first.focus();
    event.preventDefault();
  }
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

## Focus Management Utilities

### useFocusTrap Hook
```tsx
function useFocusTrap(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef]);
}
```

## Issue Templates

### Missing Keyboard Access
```markdown
### [CRITICAL] Interactive element not keyboard accessible

**WCAG Criterion:** 2.1.1 — Keyboard (Level A)
**Location:** `src/components/Card.tsx:15`
**Category:** Keyboard Navigation

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
**Category:** Keyboard Navigation

**Current State:**
Button removes outline on focus without visible replacement

**Required State:**
Visible focus indicator with 3:1 contrast

**Code Fix:**
\`\`\`tsx
// Before
className="outline-none"

// After
className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
\`\`\`
```

## Testing Checklist

- [ ] Tab through entire page without mouse
- [ ] All interactive elements receive focus
- [ ] Focus order matches visual order
- [ ] Focus indicator visible on all elements
- [ ] Can activate all controls with Enter/Space
- [ ] Escape closes modals/menus
- [ ] No keyboard traps
- [ ] Skip link present and functional
