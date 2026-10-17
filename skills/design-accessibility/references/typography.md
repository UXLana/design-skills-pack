# Typography & Readability

## Minimum Requirements

| Property | Value | Source | Status |
|----------|-------|--------|--------|
| Body text size | 16px (1rem) | Design-system default (no WCAG minimum size) | **DS requirement** — flag violations as `[DS Requirement]`, not WCAG |
| Secondary text | 14px minimum | Best practice | **DS requirement** |
| Line height (body) | 1.5 | 1.4.12 (AA) — **override survival**, not author default | Required that content **survives** this override; authors should set it as a DS default |
| Paragraph spacing | 2× font size | 1.4.12 (AA) — override survival | Required to survive; best practice to ship as default |
| Letter spacing | 0.12× font size | 1.4.12 (AA) — override survival | Required to survive |
| Word spacing | 0.16× font size | 1.4.12 (AA) — override survival | Required to survive |

> **Important WCAG 1.4.12 clarification:** This criterion requires content to **remain functional when users apply these overrides** in their own stylesheet. It does **not** mandate that authors ship these values as defaults. For audit findings, cite 1.4.12 only when content *breaks under user override* — not when a DS happens to ship a tighter default.
>
> If your design system enforces these values as **DS defaults**, that exceeds the WCAG baseline — label findings `[DS Requirement]`, not as 1.4.12 failures.

## Source Labels

Use the source labels defined in SKILL.md ("Source Labels"). For typography that usually means:

- **`[WCAG 2.0 AA]` / `[WCAG 2.1 AA]`** (or the compliance target's label) — text clips, overlaps or loses function at 200% (1.4.4), or under the spacing override (1.4.12).
- **`[DS Requirement]`** — a size or line-height default your design system mandates (16px body, 14px minimum, 1.5 line height). Blocking for DS compliance, never claimed as a WCAG failure.
- **`[Best Practice]`** — relative font units, reading-level guidance. Report mode, or when asked.

## Text Spacing Requirements (1.4.12)

Content must remain functional when users apply:
```css
/* Users may apply these overrides */
line-height: 1.5;
letter-spacing: 0.12em;
word-spacing: 0.16em;
margin-bottom: 2em; /* paragraph spacing */
```

### Token Audit Checklist
```typescript
// Design-system minimums — label shortfalls [DS Requirement]
const typographyAudit = {
  'text.body.sm': {
    minSize: 14,
    minLineHeight: 1.5,
    warn: 'Below 16px may cause readability issues'
  },
  'text.body.md': {
    minSize: 16,
    minLineHeight: 1.5
  },
  'text.body.lg': {
    minSize: 18,
    minLineHeight: 1.5
  },
  'text.heading.sm': {
    minSize: 18,
    minLineHeight: 1.3 // Headings can have tighter line height
  },
  'text.label.sm': {
    minSize: 12,
    minLineHeight: 1.4,
    critical: true,
    note: 'Very small text—ensure high contrast and limited use'
  }
};
```

## Text Scalability (1.4.4)

### Requirements
- Text can be resized to 200% (browser zoom counts) without loss of content or functionality
- Pixel font sizes are **not** a 1.4.4 failure on their own — browsers zoom px text. The failures W3C documents are clipped, truncated or overlapping text at 200% (F69), text-based form controls that don't grow with the text (F80), and font sizes set only in viewport units, which zoom can't enlarge (F94)
- Horizontal scrolling at 320 CSS px is a separate criterion (1.4.10 Reflow)
- Relative units (`rem`, `em`) also honor the user's browser default font size, so prefer them — a `[Best Practice]`, or a `[DS Requirement]` if your system mandates it

### Audit Patterns
```typescript
// ✓ Fine for 1.4.4 — zoom scales px text
font-size: 14px;

// ✓ Better practice — also follows the user's default font-size setting
font-size: 0.875rem; // 14px at default root

// ❌ F94 — viewport-only sizing doesn't grow with zoom
font-size: 2vw;
// ✓ Fix — mix in a relative unit
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);

// ❌ F69 — fixed height clips scaled text
height: 50px;

// ✓ Allow content to grow
min-height: 50px;
height: auto;
```

### Container Requirements
```css
/* Containers must accommodate scaled text */
.text-container {
  /* ❌ Fixed height clips scaled text */
  height: 200px;
  overflow: hidden;
  
  /* ✓ Allow growth */
  min-height: 200px;
  overflow: visible; /* or auto for scrollable */
}
```

## Large Text Definition

Large text has reduced contrast requirements (3:1 vs 4.5:1):

| Definition | Size |
|------------|------|
| Large | ≥18pt (24px) regular weight |
| Large | ≥14pt (18.66px) bold weight |

```typescript
function isLargeText(fontSize: number, fontWeight: number): boolean {
  const isPx = true; // Assuming pixels
  if (isPx) {
    if (fontWeight >= 700) return fontSize >= 18.66;
    return fontSize >= 24;
  }
}
```

## Responsive Typography

### Fluid Scaling
```css
/* Minimum 16px, scales with viewport, maximum 20px */
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
```

### Breakpoint Considerations
```typescript
const responsiveType = {
  mobile: {
    body: '16px',
    heading: '24px',
    lineHeight: 1.5
  },
  tablet: {
    body: '16px',
    heading: '28px',
    lineHeight: 1.5
  },
  desktop: {
    body: '18px',
    heading: '32px',
    lineHeight: 1.6
  }
};
```

## Issue Templates

### Text Clipped Under Spacing Override
```markdown
### [MODERATE] Card text clipped when users increase text spacing

**WCAG Criterion:** 1.4.12 — Text Spacing (Level AA)
**Source label:** [WCAG 2.1 AA]
**Location:** `src/components/Card.tsx:18`
**Category:** Typography & Readability

**Current State:**
With the text-spacing override applied, the card description is cut off by
`height: 96px; overflow: hidden`

**Required State:**
No loss of content when users set line height 1.5×, paragraph spacing 2×,
letter spacing 0.12em and word spacing 0.16em

**Code Fix:**
\`\`\`css
/* Before */
.card-description { height: 96px; overflow: hidden; }

/* After */
.card-description { min-height: 96px; }
\`\`\`
```

### Tight Default Line Height (design-system default, not WCAG)
```markdown
### [MINOR] Body line height below the design-system default

**Source label:** [DS Requirement] — 1.4.12 only requires that content survive a user's
override, not that you ship 1.5
**Location:** `src/styles/tokens.css:42`
**Category:** Typography & Readability

**Current State:**
Body text line-height is 1.2; the design system specifies 1.5

**Code Fix:**
\`\`\`css
/* Before */
--line-height-body: 1.2;

/* After */
--line-height-body: 1.5;
\`\`\`
```

### Text Clipped at 200% Zoom
```markdown
### [SERIOUS] Button label truncated at 200% zoom

**WCAG Criterion:** 1.4.4 — Resize Text (Level AA)
**Source label:** [WCAG 2.0 AA]
**Location:** `src/components/Button.tsx:8`
**Category:** Typography & Readability

**Current State:**
`height: 32px; white-space: nowrap; overflow: hidden` truncates the label at 200% zoom

**Required State:**
Text can be resized to 200% without loss of content or functionality

**Code Fix:**
\`\`\`tsx
// Before
className="h-8 overflow-hidden whitespace-nowrap"

// After
className="min-h-8 py-1"
\`\`\`
```

## Reading Level Considerations

While not a WCAG requirement at AA level, consider:
- Short sentences and paragraphs for complex forms
- Clear labels using familiar terms
- Avoiding jargon in error messages
- Providing definitions for technical terms

## Testing

### Browser Zoom Test
1. Set browser zoom to 200%
2. Verify all text remains visible
3. Check no horizontal scrolling required
4. Confirm no overlapping text

### Text Spacing Override Test
```javascript
// Bookmarklet to test text spacing
javascript:(function(){
  var style = document.createElement('style');
  style.innerHTML = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
  document.head.appendChild(style);
})();
```
