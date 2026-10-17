# Typography & Readability

## Minimum Requirements

| Property | Value | Source | Status |
|----------|-------|--------|--------|
| Body text size | 16px (1rem) | Best practice (supports 1.4.4 scaling) | **DS requirement** — flag violations as `[DS Requirement]`, not WCAG |
| Secondary text | 14px minimum | Best practice | **DS requirement** |
| Line height (body) | 1.5 | 1.4.12 (AA) — **override survival**, not author default | Required that content **survives** this override; authors should set it as a DS default |
| Paragraph spacing | 2× font size | 1.4.12 (AA) — override survival | Required to survive; best practice to ship as default |
| Letter spacing | 0.12× font size | 1.4.12 (AA) — override survival | Required to survive |
| Word spacing | 0.16× font size | 1.4.12 (AA) — override survival | Required to survive |

> **Important WCAG 1.4.12 clarification:** This criterion requires content to **remain functional when users apply these overrides** in their own stylesheet. It does **not** mandate that authors ship these values as defaults. For audit findings, cite 1.4.12 only when content *breaks under user override* — not when a DS happens to ship a tighter default.
>
> If your design system enforces these values as **DS defaults**, that exceeds the WCAG baseline — label findings `[DS Requirement]`, not `[WCAG 1.4.12 Violation]`.

## Status Label Legend

Every typography audit finding must carry one of these labels:

- **`[WCAG AA]`** — Fails an AA success criterion. Required for conformance. Must fix.
- **`[WCAG AAA]`** — Fails AAA. Not required for AA conformance — include in findings but mark as optional in Standard mode, mandatory only if contract specifies AAA.
- **`[DS Requirement]`** — Exceeds WCAG baseline; mandated by your design system (e.g. for government-contract consistency). Treat as blocking for DS compliance, but never claim it as a WCAG failure.
- **`[Best Practice]`** — Not mandated anywhere; recommended guidance. Include only in Report mode or when asked.

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
- Text must scale to 200% without loss of content or functionality
- No horizontal scrolling at standard viewport widths when scaled
- All text must use relative units (`rem`, `em`, `%`)

### Audit Patterns
```typescript
// ❌ Fixed pixel sizes don't scale with user preferences
font-size: 14px;

// ✓ Relative units scale with root font size
font-size: 0.875rem; // 14px at default root
font-size: 0.875em;  // 14px relative to parent

// ❌ Fixed viewport heights can clip scaled text
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

### Line Height Too Tight
```markdown
### [MODERATE] Insufficient line height

**WCAG Criterion:** 1.4.12 — Text Spacing (Level AA)
**Location:** `src/styles/tokens.css:42`
**Category:** Typography & Readability

**Current State:**
Body text line-height is 1.2

**Required State:**
Line height at least 1.5 times the font size

**Code Fix:**
\`\`\`css
/* Before */
--line-height-body: 1.2;

/* After */
--line-height-body: 1.5;
\`\`\`
```

### Fixed Pixel Font Size
```markdown
### [MODERATE] Non-scalable text

**WCAG Criterion:** 1.4.4 — Resize Text (Level AA)
**Location:** `src/components/Label.tsx:8`
**Category:** Typography & Readability

**Current State:**
Font size uses fixed pixels: `fontSize: '12px'`

**Required State:**
Use relative units (rem, em) for user-scalable text

**Code Fix:**
\`\`\`tsx
// Before
fontSize: '12px'

// After
fontSize: '0.75rem'
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
