# ARIA & Semantic HTML

**Contents:** First Rule of ARIA · Semantic HTML Mapping · Required ARIA Attributes · Component Patterns (Button, Dialog, Tabs, Accordion, Combobox, Alert/Toast, Progress) · Live Regions · Hidden Content · Issue Templates · Additional Component Patterns (Tooltip, Menu Button, Popover, Switch, Date Picker, File Upload, DataTable, Toasts, Pagination, Breadcrumbs) · Testing

## First Rule of ARIA

> Don't use ARIA if you can use native HTML

```tsx
// ❌ ARIA role when native element exists
<div role="button" tabIndex={0} onClick={...}>

// ✓ Native element
<button onClick={...}>
```

## Semantic HTML Mapping

| Need | HTML Element | Avoid |
|------|--------------|-------|
| Button | `<button>` | `<div role="button">` |
| Link | `<a href="...">` | `<span onClick>` |
| Heading | `<h1>`-`<h6>` | `<div class="heading">` |
| List | `<ul>`, `<ol>`, `<li>` | `<div>` with bullets |
| Table | `<table>`, `<th>`, `<td>` | Grid of `<div>` |
| Form input | `<input>`, `<select>` | `<div contenteditable>` |
| Navigation | `<nav>` | `<div role="navigation">` |
| Main content | `<main>` | `<div role="main">` |

## Required ARIA Attributes

### Labels (4.1.2)

Every interactive element needs an accessible name:

```tsx
// Text content provides name
<button>Save</button>

// aria-label for icon-only
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>

// aria-labelledby references visible text
<h2 id="dialog-title">Confirm Delete</h2>
<div role="dialog" aria-labelledby="dialog-title">

// Input with label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### States and Properties

| State | Attribute | Use Case |
|-------|-----------|----------|
| Expanded | `aria-expanded` | Accordion, dropdown, menu |
| Selected | `aria-selected` | Tab, listbox option |
| Checked | `aria-checked` | Custom checkbox/radio |
| Pressed | `aria-pressed` | Toggle button |
| Disabled | `aria-disabled` | Disabled but focusable |
| Current | `aria-current` | Current page/step |
| Invalid | `aria-invalid` | Form validation error |
| Busy | `aria-busy` | Loading content |

## Component Patterns (APG)

### Button
```tsx
// Standard button
<button type="button" onClick={handleClick}>
  Action
</button>

// Toggle button: the label stays the same; aria-pressed carries the state
<button
  type="button"
  aria-pressed={isPressed}
  onClick={() => setIsPressed(!isPressed)}
>
  Bold
</button>

// Icon button
<button type="button" aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>
```

### Dialog/Modal
```tsx
// ✓ Preferred: native <dialog>, opened with ref.current.showModal()
// Role and aria-modal are implicit; the page behind becomes inert; Escape closes it.
<dialog ref={dialogRef} aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  <form method="dialog">
    <button>Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>

// Fallback for a custom overlay: explicit role + aria-modal, and set `inert`
// on everything outside the overlay while it is open (see keyboard.md)
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
  {/* … */}
</div>
```

### Tabs
```tsx
<div role="tablist" aria-label="Settings sections">
  <button 
    role="tab" 
    id="tab-1" 
    aria-selected={activeTab === 0}
    aria-controls="panel-1"
    tabIndex={activeTab === 0 ? 0 : -1}
  >
    General
  </button>
  <button 
    role="tab" 
    id="tab-2"
    aria-selected={activeTab === 1}
    aria-controls="panel-2"
    tabIndex={activeTab === 1 ? 0 : -1}
  >
    Security
  </button>
</div>

<div 
  role="tabpanel" 
  id="panel-1" 
  aria-labelledby="tab-1"
  hidden={activeTab !== 0}
>
  {/* Panel content */}
</div>
```

### Accordion
```tsx
<div>
  <h3>
    <button
      aria-expanded={isOpen}
      aria-controls="section-1-content"
      id="section-1-header"
    >
      Section Title
      <ChevronIcon aria-hidden="true" />
    </button>
  </h3>
  <div
    id="section-1-content"
    role="region"
    aria-labelledby="section-1-header"
    hidden={!isOpen}
  >
    {/* Section content */}
  </div>
</div>
```

### Combobox (Autocomplete)
```tsx
<div>
  <label id="combo-label" htmlFor="combo-input">
    Search
  </label>
  <input
    id="combo-input"
    type="text"
    role="combobox"
    aria-expanded={isOpen}
    aria-controls="combo-listbox"
    aria-autocomplete="list"
    aria-activedescendant={activeOptionId}
  />
  <ul
    id="combo-listbox"
    role="listbox"
    aria-labelledby="combo-label"
    hidden={!isOpen}
  >
    <li id="option-1" role="option" aria-selected={selected === 0}>
      Option 1
    </li>
    <li id="option-2" role="option" aria-selected={selected === 1}>
      Option 2
    </li>
  </ul>
</div>
```

### Alert/Toast
```tsx
// Polite announcement (non-urgent)
<div role="status" aria-live="polite">
  Changes saved successfully
</div>

// Assertive announcement (errors, urgent)
<div role="alert" aria-live="assertive">
  Error: Please fix the highlighted fields
</div>

// For dynamically added content
<div aria-live="polite" aria-atomic="true">
  {message && <span>{message}</span>}
</div>
```

### Progress/Loading
```tsx
// Determinate progress
<div 
  role="progressbar" 
  aria-valuenow={75} 
  aria-valuemin={0} 
  aria-valuemax={100}
  aria-label="Upload progress"
>
  75%
</div>

// Indeterminate loading
<div aria-busy="true" aria-live="polite">
  <span className="spinner" aria-hidden="true" />
  <span className="sr-only">Loading...</span>
</div>
```

## Live Regions

### Attributes
| Attribute | Values | Use |
|-----------|--------|-----|
| `aria-live` | `polite`, `assertive`, `off` | Announcement urgency |
| `aria-atomic` | `true`, `false` | Announce all or just changes |
| `aria-relevant` | `additions`, `removals`, `text`, `all` | What triggers announcement |

### Patterns
```tsx
// Counter updates
<span aria-live="polite" aria-atomic="true">
  {count} items in cart
</span>

// Error messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Status updates (non-intrusive)
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

## Hidden Content

### Patterns
| Method | Screen Reader | Visual |
|--------|---------------|--------|
| `aria-hidden="true"` | Hidden | Visible |
| `.sr-only` class | Announced | Hidden |
| `hidden` attribute | Hidden | Hidden |
| `display: none` | Hidden | Hidden |
| `visibility: hidden` | Hidden | Hidden |

### Screen Reader Only Class
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Issue Templates

### Missing Accessible Name
```markdown
### [CRITICAL] Interactive element missing accessible name

**WCAG Criterion:** 4.1.2 — Name, Role, Value (Level A)
**Location:** `src/components/IconButton.tsx:12`
**Category:** ARIA & Semantic HTML

**Current State:**
Icon button has no accessible name for screen readers

**Required State:**
All interactive elements must have an accessible name

**Code Fix:**
\`\`\`tsx
// Before
<button onClick={onClose}>
  <XIcon />
</button>

// After
<button onClick={onClose} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
\`\`\`
```

### Non-Semantic Element
```markdown
### [SERIOUS] Non-semantic element used for interaction

**WCAG Criterion:** 4.1.2 — Name, Role, Value (Level A)
**Location:** `src/components/ClickableCard.tsx:8`
**Category:** ARIA & Semantic HTML

**Current State:**
Clickable element uses `<div>` without proper role/keyboard support

**Required State:**
Use semantic element or add complete ARIA/keyboard support

**Code Fix:**
\`\`\`tsx
// Before
<div onClick={handleClick} className="card">

// After (preferred: use native element)
<button onClick={handleClick} className="card">

// Or with full ARIA support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={handleKeyDown}
  className="card"
>
\`\`\`
```

## Additional Component Patterns

These are the high-frequency patterns an auditor will hit in a real design system that weren't covered above. Each includes the minimum required semantics, keyboard behavior, and common audit failures.

### Tooltip

```tsx
// ✓ Tooltip attached to trigger via aria-describedby
<button aria-describedby="tt-1">More info</button>
<div role="tooltip" id="tt-1">Explains the control</div>
```

- **Keyboard:** Tooltip appears on focus of the trigger, NOT on click. Dismisses on Escape and on blur.
- **1.4.13 Content on Hover or Focus (AA):** tooltip content must be hoverable, persistent, and dismissable without moving pointer focus.
- **Common failures:** tooltips shown only on hover (keyboard users miss them); tooltips with interactive content (should be popovers instead); using `title=""` for critical info (unreliable AT support).

### Menu Button / Dropdown Menu (action menu, not a select)

```tsx
<button
  aria-haspopup="menu"
  aria-expanded={open}
  aria-controls="menu-1"
  onClick={() => setOpen(!open)}
>
  Actions
</button>
<ul role="menu" id="menu-1" hidden={!open}>
  <li role="menuitem" tabIndex={-1}>Edit</li>
  <li role="menuitem" tabIndex={-1}>Duplicate</li>
  <li role="menuitem" tabIndex={-1}>Delete</li>
</ul>
```

- **Keyboard:** Enter/Space/ArrowDown opens and focuses first item. ArrowUp/ArrowDown navigates items. Escape closes and returns focus to trigger. Tab closes the menu.
- **Do not use `role="menu"` for navigation menus** — menu role is for application commands only. Use a `<nav>` with `<ul><li><a>` for site nav.

### Popover (non-modal, dismissable overlay with arbitrary content)

```tsx
<button aria-expanded={open} aria-controls="pop-1">Open popover</button>
<div id="pop-1" role="dialog" aria-labelledby="pop-title" hidden={!open}>
  <h3 id="pop-title">Filters</h3>
  {/* interactive content */}
</div>
```

- **Keyboard:** Escape closes. Clicking outside closes (Light Dismiss, 2.1.2 No Keyboard Trap — and focus must return to trigger).
- **Do NOT trap focus** inside a non-modal popover. Modal dialogs are different: use native `<dialog>` with `showModal()`, or `inert` on the background, rather than a hand-written trap (see `keyboard.md`). The distinction is whether background content is interactive.
- **2.4.11 Focus Not Obscured (WCAG 2.2 AA):** content the user opened, like this popover, doesn't fail 2.4.11 while it is open, as long as it can be dismissed without moving focus (Escape). Keeping the trigger visible is still good practice.

### Switch (on/off toggle, immediate effect)

```tsx
<button
  role="switch"
  aria-checked={on}
  onClick={() => setOn(!on)}
>
  Notifications
</button>
```

- **Use switch role** for settings that take effect immediately (notifications on/off, feature enabled). Use a checkbox for form submissions ("I agree").
- **Keyboard:** Space toggles. Tab moves away.
- **Label:** always visible — never rely on position alone to indicate which setting the switch controls.

### Date Picker / Calendar

- **Prefer native `<input type="date">`** — AT-tested, keyboard-accessible, handles locale.
- If a custom date picker is required (date ranges, disabled dates, business rules):
  - Calendar grid uses `role="grid"` with `role="row"` and `role="gridcell"`
  - Each day button has an `aria-label` in full format ("April 15, 2026")
  - `aria-selected="true"` on the selected day
  - `aria-current="date"` on today's date
  - Arrow keys navigate days; PageUp/PageDown changes months; Home/End go to start/end of row
  - **3.3.1 Error Identification:** invalid date ranges (e.g., "to" before "from") are announced with specific guidance
  - **DS Requirement:** include a text input next to the picker for users who cannot operate a calendar grid — never force visual-only input

### File Upload (including drag and drop)

```tsx
<label htmlFor="upload">Upload invoice (PDF)</label>
<input
  id="upload"
  type="file"
  accept=".pdf"
  aria-describedby="upload-help"
/>
<p id="upload-help">PDF, max 10 MB</p>
```

- **Drag-and-drop MUST have a keyboard-equivalent** (native `<input type="file">` or a button that opens the file picker). Do not require drag to upload.
- **Upload progress:** `role="progressbar"` with `aria-valuenow`, `aria-valuetext` ("3 of 5 files uploaded").
- **Success/failure:** announce via `aria-live="polite"` (success) or `aria-live="assertive"` (errors). Name the failed file specifically.

### Sortable / Filterable DataTable

- **Sort buttons** inside `<th>` use `aria-sort="ascending" | "descending" | "none"` on the header cell (not the button).
- **Column visibility toggle:** changes must announce ("3 columns shown, 2 hidden").
- **Filter input** has a visible label and announces result count on change ("127 rows, filtered to 14").
- **Row selection:** checkbox in each row has an `aria-label` that names the row ("Select order 10482"), not just "Select".
- **Pagination:** "Page 3 of 12" is in a live region; current page button has `aria-current="page"`.
- **Virtualized tables:** must expose total row count via `aria-rowcount` and each rendered row's absolute index via `aria-rowindex`.

### Toast Notifications

- **Non-error toasts:** `role="status"` with `aria-live="polite"` — reported when AT is idle.
- **Error/destructive toasts:** `role="alert"` with `aria-live="assertive"` — interrupts AT immediately.
- **Timing (WCAG 2.2.1 Timing Adjustable):** if a toast carries information or an action the user needs (an Undo, a link), its auto-dismiss is a time limit — let users turn it off, adjust it (to at least 10× the default) or extend it, or keep such toasts until dismissed. Never auto-dismiss an error toast.
- **Queue:** multiple simultaneous toasts announce sequentially, not simultaneously.

### Pagination

```tsx
<nav aria-label="Pagination">
  <button aria-label="Previous page" disabled={page === 1}>‹</button>
  <button aria-label="Page 1">1</button>
  <button aria-current="page" aria-label="Page 2, current page">2</button>
  <button aria-label="Page 3">3</button>
  <button aria-label="Next page">›</button>
</nav>
```

- Page numbers are buttons, not links, unless each page is a distinct URL.
- Current page uses `aria-current="page"` AND a visible indicator.
- "Jump to page" input has a visible label and announces result via live region.

### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/orders">Orders</a></li>
    <li aria-current="page">Order 10482</li>
  </ol>
</nav>
```

- Last item has `aria-current="page"` and is not a link.
- Separators (`/`, `›`) are decorative — add via CSS `::before`, never as live text.

## Testing

### Screen Reader Testing
```
macOS: VoiceOver (Cmd + F5)
Windows: NVDA (free), JAWS
iOS: VoiceOver (Settings > Accessibility)
Android: TalkBack (Settings > Accessibility)
```

### Browser Extensions
- axe DevTools
- WAVE
- Accessibility Insights
