---
name: ui-edge-case-audit
description: Audit prototype UIs to surface missing edge cases, then build them. Use when asked to "review edge cases", "audit the UI", "find what's missing", "QA the prototype", or "what states are we missing".
---

# UI Edge Case Audit

Systematically review every screen and component in a prototype, surface missing edge cases, and build them after user approval.

## Workflow

1. **Discover screens**: Read all page and component files in the prototype
2. **Audit each screen** against the categories below
3. **Output findings** in the format specified
4. **Prioritize**: Group by P1/P2/P3
5. **Build**: Ask user which to tackle, then implement one by one

## Audit Categories

### 1. Empty & Zero States
- Table with no rows (first use, all filtered out, all archived)
- Search with no matching results
- Zero count / zero quantity values
- No thumbnail or image available

### 2. Content Boundaries
- Very long text (names, IDs, descriptions) — truncation, wrapping, tooltips
- Single row in a table
- Maximum rows / pagination threshold
- Single-character or blank values
- Special characters (ampersands, quotes, slashes, unicode)

### 3. Loading & Transitions
- Initial page load / skeleton states
- Save, submit, or async action in progress (spinners, disabled buttons)
- Download or export generation delay
- Tab switching with different data volumes

### 4. Error & Failure States
- Save / submit failed (network, validation)
- Download / export failed
- Image failed to load (broken thumbnail)
- Required fields left empty
- Invalid input (negative numbers, past dates, too-long strings)

### 5. Status & Permission Logic
- Which actions are available per status or tab?
- Read-only vs editable: which fields are truly locked?
- Can a user perform an invalid status transition?
- What happens if status changes while the user is viewing?

### 6. Selection & Bulk Actions
- Select all → bulk action: confirmation needed?
- Mixed selection across pages (if paginated)
- Selection persistence across tab switches
- Bulk action on one item vs many

### 7. Form & Input Validation
- Zero, negative, or extremely large numeric input
- Missing required selections
- Duplicate names or identifiers
- Date validation (past dates, impossible ranges)

### 8. Responsive & Overflow
- Narrow viewport: table scroll, column stacking
- Modal at small screen sizes
- Long dropdown menus exceeding viewport
- Tooltip / popover clipping near edges

### 9. Accessibility
- Keyboard navigation through all interactive elements
- Screen reader announcements for status changes
- Focus management on modal open/close
- Color contrast in light and dark mode
- Error messages linked to inputs (aria-describedby)

## Output Format

For each finding:

```
Screen: [screen name]
Category: [from above]
Edge Case: [brief description]
Current: [what happens now, or "not handled"]
Recommendation: [what to build]
Priority: P1 critical | P2 important | P3 nice-to-have
```

After listing all findings, ask which to build first, then implement them sequentially — updating the checklist as each is completed.
