# Pointer Input & Target Size

Pointer criteria from WCAG 2.1 and 2.2 (guideline 2.5, Input Modalities). They used to be filed under "cognitive"; they are about motor access — people with tremors, limited dexterity, or using a head pointer, mouth stick or switch.

## Core Requirements

| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.5.1 Pointer Gestures | A | 2.1 | Path-based or multipoint gestures (swipe, pinch) have a single-pointer alternative |
| 2.5.2 Pointer Cancellation | A | 2.1 | Actions fire on the up-event, or can be aborted or undone |
| 2.5.4 Motion Actuation | A | 2.1 | Shake/tilt actions have a UI alternative and can be disabled |
| 2.5.7 Dragging Movements | AA | 2.2 | Dragging has a single-pointer alternative, unless dragging is essential |
| 2.5.8 Target Size (Minimum) | AA | 2.2 | Targets at least 24×24 CSS px, or an exception applies |
| 2.5.5 Target Size (Enhanced) | AAA | 2.1 | 44×44 CSS px — report only |

React's `onClick` fires on the up-event, so it satisfies 2.5.2. Watch for actions wired to `onMouseDown` or `onPointerDown`.

## Target Size (2.5.8)

A target for pointer input must be at least 24×24 CSS pixels, **except** when:

| Exception | What it means |
|---|---|
| **Spacing** | The undersized target is spaced so that a 24px-diameter circle centred on its bounding box doesn't intersect another target or another undersized target's circle |
| **Equivalent** | The same function is available through another control on the page that meets 24×24 |
| **Inline** | The target sits in a sentence, or its size is constrained by the line height of surrounding text (links in a paragraph) |
| **User agent control** | The browser sets the size and the author hasn't changed it (an unstyled native checkbox) |
| **Essential** | A particular presentation is essential or legally required (e.g., pins on a map at true positions) |

Sliders, color pickers and other targets where position within the target selects a value count as one target.

### Audit Pattern
```typescript
const targetSizeAudit = {
  minSize: 24,      // 2.5.8 AA
  enhancedSize: 44, // 2.5.5 AAA — report only; many design systems adopt it as a [DS Requirement] for touch

  targets: [
    'button',
    'a[href]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
  ],

  // Check these before flagging an undersized target
  exceptions: ['Spacing', 'Equivalent', 'Inline', 'User agent control', 'Essential'],
};
```

Measure the **outermost** clickable element (the `<label>` wrapping a small checkbox, a padded button around an icon), not the visual glyph.

### Implementation

```tsx
// ✓ AA — 24×24 target around a 16px icon
<button aria-label="Close" className="min-h-6 min-w-6 p-1">
  <XIcon className="w-4 h-4" aria-hidden="true" />
</button>

// ✓ Small visual, larger hit area — the label is the target
<label className="inline-flex items-center gap-2 min-h-6 cursor-pointer">
  <input type="checkbox" className="w-4 h-4" />
  Email me updates
</label>

// ✓ [DS Requirement] — 44×44 touch target, if your system mandates it
<IconButton aria-label="Settings" className="min-h-11 min-w-11 p-3">
  <GearIcon className="w-5 h-5" aria-hidden="true" />
</IconButton>
```

## Dragging Movements (2.5.7)

Any operation done by dragging must also be possible with single clicks or taps, unless dragging is essential. Keyboard support alone does not satisfy 2.5.7 — the alternative has to work with a pointer.

### Alternatives
```tsx
// Drag-to-reorder list with single-pointer alternatives
function ReorderableList({ items, onReorder }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id} draggable>
          <span>{item.name}</span>
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

// Drag-to-resize panel with a single-pointer alternative
function ResizablePanel({ children }) {
  const [width, setWidth] = useState(300);

  return (
    <div style={{ width }}>
      {children}
      <div className="resize-handle" onPointerDown={handleDragStart} />
      <div className="resize-buttons">
        <button onClick={() => setWidth((w) => w - 50)}>Narrower</button>
        <button onClick={() => setWidth((w) => w + 50)}>Wider</button>
      </div>
    </div>
  );
}
```

## Issue Templates

### Target Size Too Small
```markdown
### [MODERATE] Target size below minimum

**WCAG Criterion:** 2.5.8 — Target Size (Minimum) (Level AA)
**Source label:** [WCAG 2.2 AA]
**Location:** `src/components/Pagination.tsx:28`
**Category:** Pointer & Target Size

**Current State:**
Page number buttons are 20×20 pixels with 2px gaps, so the 24px circles overlap
(the Spacing exception doesn't apply) and there is no equivalent larger control

**Required State:**
Interactive targets must be at least 24×24 CSS pixels, or meet an exception

**Code Fix:**
\`\`\`tsx
// Before
<button className="w-5 h-5">1</button>

// After
<button className="min-w-6 min-h-6 p-1">1</button>
\`\`\`
```

### Drag Without Alternative
```markdown
### [SERIOUS] Drag operation without single-pointer alternative

**WCAG Criterion:** 2.5.7 — Dragging Movements (Level AA)
**Source label:** [WCAG 2.2 AA]
**Location:** `src/components/SortableList.tsx:15`
**Category:** Pointer & Target Size

**Current State:**
List items can only be reordered via drag-and-drop

**Required State:**
Provide a single-pointer alternative for reordering

**Code Fix:**
Add move up/down buttons (or a "Move to position" menu) alongside the drag handle
```

## Testing Checklist

- [ ] Every interactive target is at least 24×24, or one of the five exceptions applies
- [ ] Undersized targets checked with the 24px-circle spacing test
- [ ] Drag operations have click/tap alternatives
- [ ] Swipe and pinch gestures have button alternatives
- [ ] No action fires on pointer-down alone
