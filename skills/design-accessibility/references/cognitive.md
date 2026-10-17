# Cognitive Accessibility (WCAG 2.2)

WCAG 2.2 added new criteria specifically addressing cognitive accessibility. These are particularly important for compliance software where users may be under stress, fatigued, or have cognitive disabilities.

## New WCAG 2.2 Criteria

| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused element not entirely hidden |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Focused element fully visible |
| 2.4.13 Focus Appearance | AAA | Focus indicator meets size/contrast |
| 2.5.7 Dragging Movements | AA | Drag has single-pointer alternative |
| 2.5.8 Target Size (Minimum) | AA | 24×24 CSS pixels minimum |
| 3.2.6 Consistent Help | A | Help in consistent location |
| 3.3.7 Redundant Entry | A | No re-entering previous info |
| 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive function tests |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | No object/image recognition |

## Focus Not Obscured (2.4.11)

When an element receives focus, it must not be entirely hidden by other content.

### Common Violations
```tsx
// ❌ Sticky header covers focused content
<header className="fixed top-0 h-16 z-50">
  Navigation
</header>
<main>
  {/* Focused elements may scroll under header */}
  <button>This might be hidden</button>
</main>

// ✓ Account for fixed elements with scroll-padding
<style>
  html {
    scroll-padding-top: 80px; /* Header height + buffer */
  }
</style>

// ✓ Or scroll element into view with offset
function focusWithOffset(element: HTMLElement) {
  element.focus();
  const headerHeight = 80;
  const rect = element.getBoundingClientRect();
  if (rect.top < headerHeight) {
    window.scrollBy(0, rect.top - headerHeight - 16);
  }
}
```

### Modal/Dialog Focus

```tsx
// ✓ Focus visible first interactive element, not obscured
function Modal({ children }) {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    // Ensure modal is fully rendered before focusing
    requestAnimationFrame(() => {
      firstFocusableRef.current?.focus();
    });
  }, []);
  
  return (
    <div role="dialog" aria-modal="true">
      {/* Focus target is visible, not covered by overlay */}
      <button ref={firstFocusableRef}>Close</button>
      {children}
    </div>
  );
}
```

## Target Size (2.5.8)

Interactive targets must be at least 24×24 CSS pixels.

### Requirements
- Minimum 24×24 CSS pixels (AA)
- Enhanced 44×44 CSS pixels (AAA)
- Exceptions: inline links in text, native controls unchanged

### Audit Pattern
```typescript
const targetSizeAudit = {
  minSize: 24, // AA requirement
  enhancedSize: 44, // AAA / best practice for touch
  
  // Components to audit
  targets: [
    'button',
    'a[href]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
  ],
  
  // Exclusions
  exceptions: [
    'Inline links within sentences',
    'Size determined by user agent',
    'Essential presentation requires specific size',
  ]
};
```

### Implementation

```tsx
// ✓ Minimum touch target with spacing
<button className="min-h-[44px] min-w-[44px] p-2">
  <Icon size={24} />
</button>

// ✓ Small visual, large touch target
<Checkbox className="relative">
  <input 
    type="checkbox"
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    /* Invisible input covers full 44×44 area */
  />
  <div className="w-4 h-4">
    {/* 16×16 visual checkbox */}
  </div>
</Checkbox>

// ✓ Icon button with adequate size
<IconButton aria-label="Settings" className="p-3">
  {/* Padding creates 44×44 total */}
  <GearIcon className="w-5 h-5" />
</IconButton>
```

## Dragging Movements (2.5.7)

Any drag operation must have a single-pointer alternative.

### Alternatives Required
```tsx
// Drag-to-reorder list needs alternative
function ReorderableList({ items, onReorder }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id} draggable>
          <span>{item.name}</span>
          
          {/* Single-pointer alternatives */}
          <button 
            onClick={() => onReorder(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move ${item.name} up`}
          >
            ↑
          </button>
          <button 
            onClick={() => onReorder(index, index + 1)}
            disabled={index === items.length - 1}
            aria-label={`Move ${item.name} down`}
          >
            ↓
          </button>
        </li>
      ))}
    </ul>
  );
}

// Drag-to-resize needs alternative
function ResizablePanel({ children }) {
  const [width, setWidth] = useState(300);
  
  return (
    <div style={{ width }}>
      {children}
      
      {/* Drag handle */}
      <div 
        className="resize-handle"
        onMouseDown={handleDragStart}
      />
      
      {/* Single-pointer alternative */}
      <div className="resize-buttons">
        <button onClick={() => setWidth(w => w - 50)}>
          Narrow
        </button>
        <button onClick={() => setWidth(w => w + 50)}>
          Wider
        </button>
      </div>
    </div>
  );
}
```

## Consistent Help (3.2.6)

Help mechanisms must appear in the same relative location across pages.

### Implementation
```tsx
// ✓ Help always in same location
function PageLayout({ children }) {
  return (
    <div>
      <header>
        <nav>{/* Primary navigation */}</nav>
        {/* Help always in header, same position */}
        <HelpButton />
      </header>
      
      <main>{children}</main>
      
      <footer>
        {/* Or consistently in footer */}
        <a href="/help">Help Center</a>
        <a href="/contact">Contact Support</a>
      </footer>
    </div>
  );
}

// Help mechanisms include:
// - Human contact (phone, email, chat)
// - Human contact mechanism (contact form)
// - Self-help option (FAQ, help center)
// - Fully automated contact (chatbot)
```

## Redundant Entry (3.3.7)

Don't require users to re-enter information they've already provided.

### Patterns
```tsx
// ✓ Auto-populate from session
function CheckoutForm({ userData }) {
  return (
    <form>
      <input 
        name="email" 
        defaultValue={userData.email}
        /* Pre-filled from account */
      />
      
      {/* Offer to copy from previous step */}
      <label>
        <input 
          type="checkbox" 
          onChange={copyShippingToBilling}
        />
        Billing address same as shipping
      </label>
    </form>
  );
}

// ✓ Auto-complete previous entries
function SearchInput({ recentSearches }) {
  return (
    <Combobox>
      <ComboboxInput placeholder="Search..." />
      <ComboboxOptions>
        {recentSearches.map(search => (
          <ComboboxOption key={search} value={search}>
            {search}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

// Exceptions:
// - Re-entering for security (confirm email)
// - Information is no longer valid
// - Re-entering is essential (confirming legal agreement)
```

## Accessible Authentication (3.3.8)

No cognitive function tests for authentication.

### Prohibited
- CAPTCHAs requiring recognition of objects/images
- Puzzles (drag pieces, identify images)
- Transcribing text from images
- Remembering passwords without assistance

### Allowed
```tsx
// ✓ Copy-paste allowed for passwords
<input 
  type="password"
  autoComplete="current-password"
  /* Don't block paste */
/>

// ✓ Password managers supported
<input 
  type="password"
  name="password"
  autoComplete="current-password"
/>

// ✓ Passkeys / WebAuthn
<button onClick={authenticateWithPasskey}>
  Sign in with Passkey
</button>

// ✓ Magic links
<form>
  <input type="email" name="email" />
  <button>Send login link</button>
</form>

// ✓ Personal content recognition (not object recognition)
// "Click the photo you uploaded"
// Not "Click all photos with traffic lights"
```

## Issue Templates

### Target Size Too Small
```markdown
### [MODERATE] Target size below minimum

**WCAG Criterion:** 2.5.8 — Target Size (Minimum) (Level AA)
**Location:** `src/components/Pagination.tsx:28`
**Category:** Cognitive Accessibility

**Current State:**
Page number buttons are 20×20 pixels

**Required State:**
Interactive targets must be at least 24×24 CSS pixels

**Code Fix:**
\`\`\`tsx
// Before
<button className="w-5 h-5">1</button>

// After
<button className="min-w-[24px] min-h-[24px] p-1">1</button>
\`\`\`
```

### Drag Without Alternative
```markdown
### [SERIOUS] Drag operation without single-pointer alternative

**WCAG Criterion:** 2.5.7 — Dragging Movements (Level AA)
**Location:** `src/components/SortableList.tsx:15`
**Category:** Cognitive Accessibility

**Current State:**
List items can only be reordered via drag-and-drop

**Required State:**
Provide button-based alternative for reordering

**Code Fix:**
Add move up/down buttons alongside drag handle
```

### Focus Obscured
```markdown
### [SERIOUS] Focused element obscured by sticky header

**WCAG Criterion:** 2.4.11 — Focus Not Obscured (Level AA)
**Location:** `src/layouts/MainLayout.tsx`
**Category:** Cognitive Accessibility

**Current State:**
When tabbing through page, focused elements scroll under 64px sticky header

**Required State:**
Focused elements must not be entirely hidden

**Code Fix:**
\`\`\`css
/* Add scroll padding to account for fixed header */
html {
  scroll-padding-top: 80px;
}

/* Or use scroll-margin on focusable elements */
button, a, input, select, textarea {
  scroll-margin-top: 80px;
}
\`\`\`
```

## Testing Checklist

- [ ] All interactive elements ≥24×24 pixels
- [ ] Drag operations have button alternatives
- [ ] Help is in consistent location across pages
- [ ] Form data pre-populated where possible
- [ ] No cognitive tests for authentication
- [ ] Focus not hidden by sticky/fixed elements
- [ ] Tab through page with sticky header visible
