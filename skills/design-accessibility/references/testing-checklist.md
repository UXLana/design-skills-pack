# Accessibility Testing Checklist

Comprehensive testing procedures for validating accessibility compliance.

## Automated Testing

Run automated tools first to catch low-hanging fruit. They find only a minority of issues (estimates vary by study), so never treat a clean automated run as conformance.

### Recommended Tools

| Tool | Type | Coverage |
|------|------|----------|
| axe DevTools | Browser extension | Comprehensive |
| Lighthouse | Chrome DevTools | Quick overview |
| WAVE | Browser extension | Visual indicators |
| eslint-plugin-jsx-a11y | Linter | Code-time |
| jest-axe | Unit testing | CI/CD |

### Running axe in Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### CI Integration

```yaml
# GitHub Actions example
- name: Run accessibility tests
  run: npm run test:a11y
  
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    configPath: ./lighthouserc.json
```

## Manual Testing

Manual testing finds what automated tools can't judge — focus order, meaningful names, announcements, and whether a task can actually be completed.

### Keyboard Testing

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Tab through all interactive elements | Focus moves in logical order | ☐ |
| Shift+Tab reverse navigation | Focus moves backwards | ☐ |
| Enter/Space activates buttons | Action triggered | ☐ |
| Escape closes modals/menus | Overlay closes, focus returns | ☐ |
| Arrow keys in composite widgets | Navigation within component | ☐ |
| No keyboard traps | Can always Tab away | ☐ |
| Focus visible on all elements | Clear focus indicator | ☐ |
| Skip link functions | Skips to main content | ☐ |

### Visual Testing

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| 200% zoom | No loss of content/function | ☐ |
| 400% zoom | No horizontal scroll (320px) | ☐ |
| Text spacing override | Content still readable | ☐ |
| Forced colors / high contrast mode | All content, borders and focus indicators visible | ☐ |
| Dark mode | Adequate contrast maintained | ☐ |
| Color alone | Info not conveyed by color only | ☐ |

### Content Testing

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Images have alt text | Meaningful alternatives | ☐ |
| Decorative images hidden | `aria-hidden="true"` | ☐ |
| Headings in logical order | h1 → h2 → h3, no skips | ☐ |
| Links describe destination | Not "click here" | ☐ |
| Form fields labeled | Visible, associated label | ☐ |
| Error messages clear | Specific, actionable | ☐ |
| Required fields indicated | Visual + programmatic | ☐ |

## Screen Reader Testing

### Quick VoiceOver (macOS) Test

```
1. Enable: Cmd + F5
2. Navigate: Ctrl + Option + Arrow keys
3. Read all: Ctrl + Option + A
4. Web rotor: Ctrl + Option + U
5. Stop/Start: Ctrl

Key commands:
- Next heading: Ctrl + Option + Cmd + H
- Next link: Ctrl + Option + Cmd + L
- Next form element: Ctrl + Option + Cmd + J
```

### Quick NVDA (Windows) Test

```
1. Enable: Ctrl + Alt + N
2. Navigate: Tab, Arrow keys
3. Read all: NVDA + Down Arrow
4. Elements list: NVDA + F7
5. Stop: Ctrl

Key commands:
- Next heading: H
- Next link: K
- Next form element: F
- Next button: B
```

### Screen Reader Testing Matrix

| Component | Test | VoiceOver | NVDA |
|-----------|------|-----------|------|
| Button | Announces name + role | ☐ | ☐ |
| Link | Announces text + "link" | ☐ | ☐ |
| Form input | Announces label + type | ☐ | ☐ |
| Error message | Announced via live region | ☐ | ☐ |
| Modal | Focus trapped, title announced | ☐ | ☐ |
| Tab panel | Tab role, selected state | ☐ | ☐ |
| Dropdown | Expanded state announced | ☐ | ☐ |
| Table | Headers associated with cells | ☐ | ☐ |
| Loading | Status announced | ☐ | ☐ |

## Component-Specific Checklists

### Button
- [ ] Has accessible name (text or aria-label)
- [ ] Uses `<button>` element (not div)
- [ ] Type attribute set (button, submit, reset)
- [ ] Disabled state follows the `disabled` vs `aria-disabled` decision tree (SKILL.md)
- [ ] Focus indicator visible (3:1 against the surface), also in forced colors
- [ ] Target ≥24×24px, or a 2.5.8 exception applies

### Form Input
- [ ] Associated label (htmlFor/id or wrapping)
- [ ] Help text linked via aria-describedby
- [ ] Error text linked via aria-describedby
- [ ] Required state indicated (visual + native `required`; `aria-required` only on custom widgets)
- [ ] Invalid state indicated (visual + aria-invalid)
- [ ] Autocomplete attribute for user data
- [ ] Focus indicator visible

### Modal/Dialog
- [ ] Native `<dialog>` opened with `showModal()` (or a custom overlay with role="dialog", aria-modal="true" and `inert` on the background)
- [ ] aria-labelledby points to title
- [ ] aria-describedby for description
- [ ] Focus moves into modal on open
- [ ] Background content is inert — can't be reached by Tab or by AT
- [ ] Escape key closes modal
- [ ] Focus returns to trigger on close
- [ ] Visible close or cancel button

### Table
- [ ] Uses `<table>` element (not divs)
- [ ] Column headers use `<th scope="col">`
- [ ] Row headers use `<th scope="row">`
- [ ] Table has caption or aria-label
- [ ] Complex tables use headers/id
- [ ] Sortable columns indicate sort state

### Navigation
- [ ] Uses `<nav>` element
- [ ] Has aria-label if multiple navs
- [ ] Current page indicated (aria-current="page")
- [ ] Skip link to main content
- [ ] Mobile menu keyboard accessible

## Color Contrast Verification

### Manual Contrast Check

1. Open DevTools → Elements
2. Select element with text
3. Check Computed styles → color
4. Check parent background-color
5. Calculate ratio (or use browser tooltip)

### Contrast Requirements

| Content | Ratio | Example |
|---------|-------|---------|
| Normal text | 4.5:1 | Gray #767676 on white = 4.54:1 ✓ (the lightest neutral gray that passes; #777777 = 4.47:1 ✗) |
| Large text (≥24px, or ≥18.66px bold) | 3:1 | Gray #949494 on white = 3.03:1 ✓ for large text only |
| UI components | 3:1 | Border, icons, focus ring — against the adjacent color |

Compare unrounded ratios: 4.499:1 fails 4.5:1.

### Forced Colors (High Contrast) Testing

Turn forced colors on (Windows: Settings → Accessibility → Contrast themes; Chrome DevTools: Rendering → Emulate CSS media feature `forced-colors: active`) and check that every control boundary, icon, selected state and focus indicator is still visible. `box-shadow` is removed in this mode, so ring-only focus styles and shadow-only borders disappear.

```css
/* ✓ Give shadow-based indicators an outline or border fallback */
@media (forced-colors: active) {
  .custom-checkbox { border: 1px solid CanvasText; }
  .btn:focus-visible { outline: 2px solid Highlight; }
}

/* Use forced-color-adjust: none sparingly — it opts the element out of the
   user's chosen colors, which is what they turned the mode on for. */
```

## Zoom & Reflow Testing

### 200% Zoom Test
1. Set browser zoom to 200%
2. Verify all content visible
3. Check no horizontal scrolling (unless necessary)
4. Verify all functionality works
5. Check text doesn't overlap

### 320px Reflow Test
1. Set viewport to 320px wide (or zoom to 400%)
2. Verify content reflows to single column
3. Check no horizontal scrolling
4. Verify all content accessible

### Text Spacing Test

Apply these overrides and verify no content loss:

```css
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p { margin-bottom: 2em !important; }
```

## Motion & Animation Testing

### Reduced Motion Test
1. Enable reduced motion in OS settings
2. Verify animations are minimal or removed
3. Check no flashing content
4. Verify auto-playing content has pause control

### Animation Safety
- [ ] No content flashes >3 times/second
- [ ] Auto-playing content can be paused
- [ ] Respect prefers-reduced-motion (`[DS Requirement]` or `[Best Practice]`, not a WCAG AA failure)
- [ ] Session timeouts warn with at least 20 seconds to extend

## Reporting Issues

### Issue Format

```markdown
### [SEVERITY] Brief description

**WCAG Criterion:** X.X.X — Name (Level A/AA)
**Location:** `path/to/file.tsx:line`
**Category:** [Category]

**Current State:**
[What's wrong]

**Required State:**
[What compliance requires]

**Code Fix:**
[Specific fix with code example]

**Testing:**
- [ ] Specific test to verify fix
```

### Severity Guidelines

| Severity | Definition | SLA |
|----------|------------|-----|
| Critical | Blocks user access | Fix immediately |
| Serious | Major barrier | Fix this sprint |
| Moderate | Workaround exists | Fix soon |
| Minor | Enhancement | Backlog |
