---
name: ui-edge-case-audit
description: Audit a built prototype or app screen for the states it forgot, then build the approved ones. Covers empty and zero states, no-results search, long or special-character content, loading and in-progress, save/submit/export failures, validation, permission and status rules, bulk selection, not-found, session expiry and slow or offline network. Use when the user asks "what states are we missing", "review edge cases", "find what's missing", "what happens when the list is empty", "unhappy paths", "QA the prototype for edge cases", or after a new screen is built. Output is a prioritized P1/P2/P3 list; it asks before building. Not for spec-time edge cases before anything is built (intent-spec), layout at screen sizes (responsive-audit), screenshot checks (visual-qa), or a WCAG audit (design-accessibility).
---

# UI Edge Case Audit

Systematically review every screen and component in a prototype, surface missing edge cases, and build them after user approval.

## Workflow

1. **Discover screens**: Read all page and component files in the prototype. If it runs locally, open it too, so findings can be observed rather than inferred.
2. **Audit each screen** against the categories below
3. **Output findings** in the format specified, marking how each "Current" was established
4. **Prioritize**: Group by P1/P2/P3 using the rule below
5. **Build**: Ask the user which to tackle, then implement one by one, working down the checklist
6. **Verify**: Check each built state in the running UI with visual-qa

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

### 8. System & Environment
- Permission denied: the user opens a page or action their role can't use (direct link, stale tab)
- Not found: the record was deleted, moved, or the link is wrong
- Session expired mid-task: is typed input kept after signing back in?
- Offline, timeout, or very slow network: what shows, and can the user retry?
- Concurrent edits: someone else changed or deleted the record while this user had it open
- Partial data: some fields missing, or one section's request failed while the rest loaded

### 9. Localization
- Translated strings that run longer than the English source in buttons, tabs, and table headers
- Right-to-left languages: does the layout mirror, and do icons that imply direction flip?
- Dates, times, numbers, and currency in the user's locale
- Plurals: "0 items", "1 item", "2 items" (and languages with more plural forms)
- Names and addresses in non-Latin scripts, or without a first/last split

### 10. State Announcements & Focus
Only the accessibility of the states above; leave full WCAG review to design-accessibility.
- Status changes (saved, failed, loaded, items removed) are announced to screen readers, not only shown
- Where focus goes after a state change: after deleting a row, when an error appears, when a dialog closes
- Error messages are linked to their inputs (`aria-describedby`)
- Loading and in-progress states are announced and don't trap or drop focus

Layout at different screen sizes (narrow tables, modal sizing, menus or popovers clipping the viewport) belongs to responsive-audit; route those there rather than listing them here.

## Priority Rule

- **P1 critical**: the user can lose data, get stuck with no way forward, or be misled about what happened (a failed save that looks successful, a deleted record still shown as active)
- **P2 important**: confusing but recoverable; the user can work it out or retry
- **P3 nice-to-have**: polish; the state works but could be clearer or calmer

When a finding could sit in two levels, choose the higher one if it can happen on the main path, the lower one if it needs an unusual sequence of steps.

## Output Format

For each finding:

```
Screen: [screen name]
Category: [from above]
Edge Case: [brief description]
Current: [what happens now, or "not handled"] (observed | from code)
Recommendation: [what to build]
Priority: P1 critical | P2 important | P3 nice-to-have
```

Mark "Current" as **observed** when you saw it in the running UI, or **from code** when you inferred it from reading the source. Code often hides a fallback (a global error boundary, a default empty state in a shared table), so a from-code "not handled" is a lead to confirm, not a fact.

## The Checklist

After listing all findings, turn the ones the user approves into a checklist, ordered P1 first:

```
- [ ] P1 · Orders list · Save fails silently when offline
- [ ] P2 · Orders list · No-results search shows a blank table
```

Keep it in the conversation, or in a file if the user wants one (for example `edge-cases.md` next to the prototype). Tick each item as it is built and verified, so anyone picking up the work can see what's done.

## Build and Verify

Ask which to build first, then implement them one at a time. For each built state:

1. Make it reachable on demand: a mock or dev toggle such as a query parameter, a fixture, or the prototype's scenario switcher if it has one. A state that only appears when the network actually fails can't be checked or demoed.
2. Verify it with visual-qa in the running UI: screenshot the state, check its interaction, and check the next action (retry, go back, sign in again) works.
3. Tick it on the checklist only after it is verified.
