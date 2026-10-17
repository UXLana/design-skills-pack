---
name: design-accessibility
description: Audit and fix accessibility issues in React design system components and tokens against WCAG 2.2 AA and Section 508 standards. Use when performing accessibility audits, fixing a11y issues, generating compliance reports, or validating components meet accessibility requirements. Triggers on /design-accessibility command, requests for accessibility audits, WCAG compliance checks, Section 508 validation, or a11y fixes. Supports standard mode (WCAG 2.2 AA), compliance mode (adds Section 508 + regulatory checks for government contracts), and report mode (formal documentation for audits).
---

# Design Accessibility

Audit and remediate accessibility issues in React design system components against WCAG 2.2 AA and Section 508 standards.

## Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/design-accessibility [target]` | Standard | WCAG 2.2 AA audit with code fixes |
| `/design-accessibility [target] --compliance` | Compliance | Adds Section 508 + regulatory form/data-entry checks |
| `/design-accessibility --report` | Report | Generates formal compliance documentation |

## Targets

| Target | Scope |
|--------|-------|
| `Button` | Single component by name |
| `components` | All components in design system |
| `tokens` | Design tokens only (color contrast, typography) |
| `all` | Full system audit |
| `src/components/Form.tsx` | Specific file path |

## Audit Categories

### 1. Color & Contrast
- Text contrast: 4.5:1 minimum (3:1 for large text ≥18pt/14pt bold)
- UI component contrast: 3:1 minimum for borders, icons, focus indicators
- Color-blind safety: No information conveyed by color alone
- Reference: `references/color-contrast.md`

### 2. Typography & Readability
- Minimum font sizes: 16px base, 14px minimum for secondary text
- Line height: 1.5 minimum for body text
- Paragraph spacing: At least 2× font size
- Text scalability: Must support 200% zoom without loss of functionality
- Reference: `references/typography.md`

### 3. Keyboard Navigation
- Focus visible: All interactive elements must show visible focus
- Tab order: Logical navigation sequence
- No keyboard traps: Users can navigate away from all components
- Escape closes: Modal/overlay components close on Escape
- Skip links: For repeated navigation blocks
- Reference: `references/keyboard.md`

### 4. ARIA & Semantic HTML
- Correct roles: Use native HTML elements where possible
- Required labels: All interactive elements labeled
- State communication: aria-expanded, aria-selected, aria-checked, etc.
- Live regions: Dynamic content updates announced
- APG patterns: Follow ARIA Authoring Practices Guide
- Reference: `references/aria-patterns.md`

### 5. Forms & Data Entry ⚠️ Critical for Compliance
- Associated labels: Every input has a visible label
- Error identification: Errors described in text (not just color)
- Error suggestions: Guidance on how to fix errors
- Confirmation for critical actions: Destructive/irreversible actions require confirmation
- Input purpose: autocomplete attributes for user data
- Reference: `references/forms.md`

### 6. Timing & Motion
- `prefers-reduced-motion`: Respect user preference
- No flashing: Content does not flash >3 times/second
- Auto-play controls: Moving/auto-updating content can be paused
- Timeout warnings: Users warned before session timeouts
- Reference: `references/motion.md`

### 7. Cognitive Accessibility (WCAG 2.2)
- Consistent help: Help mechanisms in same location across pages
- Redundant entry: Don't require re-entering information
- Accessible authentication: No cognitive function tests for login
- Target size: Minimum 24×24 CSS pixels for touch targets
- Focus not obscured: Focused element not fully hidden
- Reference: `references/cognitive.md`

## Severity Levels

| Level | Definition | Response |
|-------|------------|----------|
| **Critical** | Blocks access for users with disabilities | Must fix immediately |
| **Serious** | Significantly impairs usage | Fix in current sprint |
| **Moderate** | Creates difficulty but workarounds exist | Fix soon |
| **Minor** | Enhancement opportunity | Add to backlog |

## Source Labels (attach to every finding)

Every emitted finding MUST carry exactly one source label. This prevents conformance drift — an agent should never claim a design-system preference is a WCAG failure, or emit an AAA finding when standard mode only asks for AA.

| Label | Meaning | Applies in mode |
|-------|---------|-----------------|
| `[WCAG 2.0 AA]` | Fails a criterion in WCAG 2.0 AA (the standard 508 incorporates) | Standard, Compliance, Report |
| `[WCAG 2.1 AA]` | Fails a WCAG 2.1 AA criterion added over 2.0 | Standard, Report |
| `[WCAG 2.2 AA]` | Fails a WCAG 2.2 AA criterion (2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8) | Standard, Report |
| `[WCAG AAA]` | Fails an AAA criterion (e.g., 2.3.3, 2.4.13) | Report only; never block in Standard |
| `[Section 508]` | Fails a criterion incorporated by the 2017 Section 508 Refresh (i.e., WCAG 2.0 AA) | Compliance, Report |
| `[DS Requirement]` | Exceeds WCAG baseline; your design system mandates it (e.g., 16px body default, `prefers-reduced-motion` support) | All modes — but never claim as WCAG failure |
| `[Best Practice]` | Recommended guidance; no conformance mandate | Report only |

**Rule:** If you cannot confidently assign a label, do not emit the finding — ask the user to clarify scope instead.

## Trace before emit (false-positive guardrail)

Code-inspection audits have a high false-positive rate when you stop reading too early. Before emitting any finding with `confidence: "medium"` or lower, trace the code path end-to-end:

| If the finding is about… | Trace to… |
|---|---|
| A broken ARIA reference (`aria-describedby`, `aria-labelledby`, `aria-controls` pointing at an id) | The `id` generator. Grep for `useId()`, template-literal id construction, or the prop source. Confirm the referenced element is actually rendered. |
| A touch-target size issue | The **click-target wrapper**, not the inner element. A 16×16 `<input>` inside a 24×24 `<label>` still passes 2.5.8. Measure the outermost focusable/clickable element. |
| A missing keyboard handler | The whole event chain. A row `onKeyDown` guarded with `if (e.target !== e.currentTarget) return` is correct — nested controls handle their own keys. |
| A missing live region / announcement | The parent component hierarchy. Live regions mounted at the page or layout level cover descendant announcements. |
| A missing accessible name | `aria-label`, `aria-labelledby`, associated `<label htmlFor>`, wrapping `<label>`, **and** visible text content. Any one of these provides an accessible name. |
| Color-only meaning | The full visual state, not one line. Selected state often carries checkbox + border + background + color — not color alone. |

**Procedure:**

1. Form the hypothesis (e.g. "aria-describedby references an unmounted id").
2. Grep the component AND its parents for counter-evidence (e.g. `useId`, matching `id=`).
3. If counter-evidence exists → withdraw the finding.
4. If you cannot verify within 2 greps → emit with `confidence: "medium"` and note explicitly what you could not check.

This guardrail was added after the DataTable smoke test (2026-04-15) produced **2 false positives out of 6 findings** (33% FP rate): a "broken aria-describedby" that was generated internally via `useId()`, and a "target size violation" where the 24×24 `<label>` wrapper was the actual hit target. Both were catchable with one additional grep.

## Workflow

### Reference-loading order (required — do this FIRST, every run)

The skill ships with 10 reference files totaling ~90KB. Loading all of them plus target code will consume ~40-60% of context on a single audit. Load selectively in this order:

1. **Always load first:** `references/wcag-criteria.md` (canonical criterion list — prevents drift)
2. **Load by target type:**
   - Target = single component (e.g. `Button`, `Modal`) → load the 2–3 most relevant references only (`keyboard.md` for interactive, `forms.md` for inputs, `aria-patterns.md` for custom widgets)
   - Target = `components` (all) → process components in batches, loading `aria-patterns.md` + `keyboard.md` once and reusing
   - Target = `tokens` → load only `color-contrast.md` + `typography.md`
   - Target = `all` → load `wcag-criteria.md`, then process by category, loading one reference at a time
3. **Mode-specific:** `--compliance` additionally loads `section-508.md` and the critical sections of `forms.md`
4. **Cap:** never load more than 4 reference files in a single prompt. If you need more, split the audit into multiple invocations.

When bundled references and your model prior disagree, **the bundled reference wins**. Cite its section header in the finding.

### Standard Mode

1. **Identify target** — Parse command for component, file, or scope
2. **Load references** — Follow the reference-loading order above (never load all 10)
3. **Scan codebase** — Analyze TSX, CSS, token files
4. **Audit each category** — Check against WCAG 2.2 AA criteria
5. **Generate findings** — Every finding must carry a source label (see "Source Labels" below) and populate every field of the JSON schema
6. **Output report** — Structured findings with code patches + machine-readable JSON block

### Compliance Mode (--compliance)

All standard checks plus:
1. **Section 508 validation** — Federal accessibility requirements
2. **Form/data-entry deep scan** — Critical for regulatory software
3. **Documentation requirements** — VPAT-style findings
4. **Regulatory context** — Error handling and confirmation requirements

### Report Mode (--report)

Generate formal documentation:
1. **Executive summary** — Pass/fail status, issue counts by severity
2. **Detailed findings** — Full audit results
3. **Remediation plan** — Prioritized fix recommendations
4. **Compliance statement** — WCAG/508 conformance level

## Output Format

Every audit emits **two artifacts side by side**: a human-readable markdown report (for PRs and review) and a machine-readable JSON block (for Jira/VPAT/downstream automation). Never emit one without the other.

### Machine-Readable JSON Schema

Append this JSON block (fenced as ```json) at the end of every audit response. Every field is required — if a value is unknown, use `null` and set `confidence` accordingly.

```json
{
  "schemaVersion": "1.0",
  "audit": {
    "target": "src/components/Button/Button.tsx",
    "mode": "standard | compliance | report",
    "standard": "WCAG 2.2 AA",
    "date": "2026-04-15",
    "auditor": "design-accessibility skill",
    "themes_tested": ["default-light", "default-dark"]
  },
  "summary": {
    "critical": 0,
    "serious": 0,
    "moderate": 0,
    "minor": 0,
    "total": 0,
    "conformance": "Supports | Partially Supports | Does Not Support | Not Applicable"
  },
  "findings": [
    {
      "id": "a11y-2026-04-15-001",
      "severity": "critical | serious | moderate | minor",
      "source_label": "WCAG 2.2 AA | WCAG 2.1 AA | WCAG 2.0 AA | WCAG AAA | Section 508 | DS Requirement | Best Practice",
      "criterion": "2.4.7",
      "criterion_name": "Focus Visible",
      "category": "keyboard | contrast | typography | aria | forms | motion | cognitive | structure",
      "component": "Button",
      "file": "src/components/Button/Button.tsx",
      "line_start": 42,
      "line_end": 58,
      "title": "Custom focus ring fails 3:1 contrast against surface.lightDarker",
      "evidence": "Token focus.ring-color (#C9CED6) measured against bg surface.lightDarker (#EFF1F4) = 1.42:1",
      "user_impact": "Keyboard users cannot visually locate focus on elevated surfaces",
      "test_method": "automated-contrast | manual-keyboard | manual-screen-reader | code-inspection",
      "confidence": "high | medium | low",
      "fix": {
        "description": "Darken focus.ring-color to meet 3:1 minimum against all DS surfaces",
        "before": "--focus-ring: #C9CED6;",
        "after": "--focus-ring: #4A5058;",
        "files_touched": ["tokens/semantic.json"]
      },
      "verification": [
        "Tab through Button on light + dark themes; focus visible on all surfaces",
        "axe-core confirms no 1.4.11 violations"
      ],
      "remediation_owner": "design-system-team",
      "jira": {
        "summary": "[A11y] Focus ring fails 3:1 contrast on elevated surfaces",
        "priority": "High",
        "labels": ["accessibility", "wcag-2.4.7", "design-tokens"]
      }
    }
  ]
}
```

**Rules:**
- `findings[]` must be sorted by severity (critical → minor).
- `criterion` uses dotted notation ("2.4.7"), never "WCAG 2.4.7".
- `file` uses paths relative to repo root.
- `test_method` distinguishes automated vs manual evidence — for compliance claims, manual verification is required.
- `confidence` = `low` whenever the finding depends on behavior the agent could not directly observe (e.g. screen reader announcements without live AT output).

### Issue Template

```markdown
### [SEVERITY] Issue Title

**WCAG Criterion:** [Number] — [Name] (Level [A/AA/AAA])
**Location:** `src/components/Button.tsx:42`
**Category:** [Category Name]

**Current State:**
[Description of the accessibility barrier]

**Required State:**
[What compliance requires]

**Code Fix:**
\`\`\`tsx
// Before
<div onClick={handleClick}>Submit</div>

// After
<button type="button" onClick={handleClick}>Submit</button>
\`\`\`

**Testing:**
- [ ] Screen reader announces correctly
- [ ] Keyboard accessible
- [ ] Visible focus state
```

### Summary Template

```markdown
## Accessibility Audit Summary

**Target:** [Component/Scope]
**Standard:** WCAG 2.2 AA [+ Section 508]
**Date:** [Audit date]

### Issue Counts
| Severity | Count |
|----------|-------|
| Critical | X |
| Serious | X |
| Moderate | X |
| Minor | X |

### By Category
| Category | Issues | Status |
|----------|--------|--------|
| Color & Contrast | X | ✓/✗ |
| Typography | X | ✓/✗ |
| Keyboard | X | ✓/✗ |
| ARIA & Semantic HTML | X | ✓/✗ |
| Forms & Data Entry | X | ✓/✗ |
| Timing & Motion | X | ✓/✗ |
| Cognitive | X | ✓/✗ |

### Critical Issues Requiring Immediate Action
1. [Issue summary with location]
2. [Issue summary with location]
```

## Token Audit Patterns

When auditing tokens (`/design-accessibility tokens`):

### Color Token Checks
```typescript
// Check all background/foreground combinations
const combinations = [
  { bg: 'color.bg.surface', fg: 'color.text.primary', minRatio: 4.5 },
  { bg: 'color.bg.surface', fg: 'color.text.secondary', minRatio: 4.5 },
  { bg: 'color.bg.elevated', fg: 'color.text.primary', minRatio: 4.5 },
  { bg: 'color.bg.brand', fg: 'color.text.inverse', minRatio: 4.5 },
  // UI components need 3:1
  { bg: 'color.bg.surface', fg: 'color.border.default', minRatio: 3.0 },
  { bg: 'color.bg.surface', fg: 'color.icon.default', minRatio: 3.0 },
];
```

### Typography Token Checks
```typescript
// Minimum values for accessibility
const typographyMins = {
  'text.body.sm': { minSize: 14, minLineHeight: 1.5 },
  'text.body.md': { minSize: 16, minLineHeight: 1.5 },
  'text.body.lg': { minSize: 18, minLineHeight: 1.5 },
  'text.label.sm': { minSize: 12, minLineHeight: 1.4 }, // ⚠️ Below 14px
};
```

## Component Audit Patterns

### Button
- Has accessible name (text content or aria-label)
- Correct role (button, not div)
- Focus visible with 3:1 contrast ring
- Disabled state follows the decision tree below
- Loading state announced via `aria-live` or `aria-busy`

#### `disabled` vs `aria-disabled` — decision tree

| User should… | Use |
|---|---|
| Not see or reach the control (truly irrelevant to current context) | Native `disabled` |
| Discover the control and understand **why** it's disabled (context-dependent, e.g. "Submit Transfer" pending manifest completion) | `aria-disabled="true"` + explanatory `aria-describedby` |
| Know the control *exists* but can't activate it yet (regulatory gating, workflow prerequisites) | `aria-disabled="true"` — keeps it focusable so AT users can hear the reason |

**Rule for this skill:** In regulated / compliance forms where a disabled state carries business meaning (waiting on data, permissions, workflow step), **prefer `aria-disabled` + `aria-describedby`**. Do not flag this pattern as a violation. Native `disabled` is still correct for controls that should be invisible in context.

```tsx
// ✓ Native disabled — "Copy" button when nothing is selected; user has no reason to reach it
<button disabled={selection.length === 0}>Copy</button>

// ✓ aria-disabled — "Submit Transfer" gated on manifest completion; user needs to know why
<button
  aria-disabled={!manifestComplete}
  aria-describedby="submit-help"
  onClick={manifestComplete ? handleSubmit : undefined}
>
  Submit Transfer
</button>
<p id="submit-help" className="help-text">
  Submit is enabled after all required manifest fields are completed.
</p>
```

### Form Inputs
- Label associated via `htmlFor`/`id` or wrapping `<label>`
- Error messages linked via `aria-describedby`
- Required state via `aria-required` and visual indicator
- Invalid state via `aria-invalid`
- Help text linked via `aria-describedby`

### Modal/Dialog
- `role="dialog"` and `aria-modal="true"`
- Focus trapped inside when open
- Focus returns to trigger on close
- Escape key closes
- Title via `aria-labelledby`

### Data Tables
- Proper `<table>` structure (not div grid)
- Column headers with `scope="col"`
- Row headers with `scope="row"` where applicable
- Caption or aria-label for table purpose
- Sortable columns indicate sort state

## Compliance Mode Details

### Section 508 — Current Standard (2017 Refresh, effective 2018)

The 2017 Section 508 Refresh (36 CFR Part 1194, Appendix C / Chapter 5) **incorporates WCAG 2.0 Level A and AA by reference**. Modern federal audits cite WCAG criteria directly, not the pre-2018 paragraph numbering.

**Conformance-claim rules for this skill:**
1. For federal 508 claims, map findings to **WCAG 2.0 AA** criteria only (the standard 508 incorporates).
2. **WCAG 2.1 and 2.2 findings** (e.g., 2.4.11, 2.5.8, 3.3.7, 3.3.8) go in a **separate "Beyond 508 baseline"** section of the report — do not claim they are 508 violations.
3. Some state and local regulators reference **WCAG 2.1 AA** or **WCAG 2.2 AA** in their procurement language. Check the specific contract; never assume 508 alone is sufficient.

### Legacy 1194.22 → WCAG Crosswalk (Pre-2018, Historical Reference Only)

> ⚠️ These pre-2018 paragraph numbers are **obsolete for federal audits** but may still appear in older state RFPs, procurement docs, and legacy contract language. Use this table only to translate legacy references — never cite 1194.22 paragraphs in new audit findings.

| Legacy 508 | Closest WCAG 2.0 AA | Modern framing |
|------------|---------------------|----------------|
| 1194.22(a) | 1.1.1 Non-text Content | Alt text for all non-text content |
| 1194.22(b) | 1.2.1, 1.2.2, 1.2.3 | Multimedia alternatives (captions, transcripts, audio description) |
| 1194.22(c) | 1.4.1 Use of Color | Color not sole means of conveying information |
| 1194.22(d) | 1.3.1, 1.3.2 | Information and relationships preserved without styling |
| 1194.22(f) | 2.4.1 Bypass Blocks | Skip links / bypass mechanisms |
| 1194.22(j) | 2.3.1 Three Flashes or Below Threshold | No content flashes >3×/sec (fixes legacy's "2–55 Hz") |
| 1194.22(l) | 4.1.2 Name, Role, Value | Scripted widgets expose name/role/value to AT |
| 1194.22(n) | 3.3.1, 3.3.2, 3.3.3 | Forms have labels, error ID, and error suggestions |
| 1194.22(o) | 2.4.1 | Skip navigation |

### Regulatory Form Requirements

For regulated compliance software:

1. **Data validation** — Errors prevent submission; clear messaging
2. **Confirmation dialogs** — Irreversible actions require explicit confirmation
3. **Audit trail** — Actions are logged and reviewable
4. **Session handling** — Timeout warnings with option to extend
5. **Error recovery** — Users can undo or correct submissions

## Integration with Other Skills

If you run a multi-skill design-system workflow, this skill is one node in it. Its outputs feed, and its triggers are fed by, other skills and steps.

### Upstream triggers (who invokes this skill)

| Trigger | Source | Expected mode |
|---------|--------|---------------|
| New component generated | `component-generator` → auto-invoke on finish | Standard, scoped to new component |
| Token change affecting color/typography | `brand-tokens-translator` or `theme-generator` | Standard with `tokens` target |
| Pre-publish check | Your release check | Compliance on `components` target |
| Component migration or refactor | Your component build workflow (handover step) | Standard, then gate to your QA gate |
| Final QA before a component is marked "done" | Your QA gate | Compliance (blocks on critical) |

### Downstream consumers (who uses this skill's output)

- **Your QA gate** (if you run one) reads the JSON findings block. Any `severity: "critical"` or `severity: "serious"` with source label `[WCAG 2.x AA]` or `[Section 508]` auto-escalates to a BLOCK verdict.
- **`design-system-storyteller`** reads findings to surface accessibility notes in component documentation examples.
- **A compliance dashboard** (if you keep one) ingests the JSON and maps findings to Jira tickets via the `jira.*` fields.
- **VPAT generation** uses the `conformance` rollup per criterion.

### Shared schema references

- **Tokens:** this skill audits values in your token source file and your per-theme files. When auditing contrast, resolve colors through your theme's semantic color accessor — do not hardcode hex lookups. If the project documents its tokens (e.g. a token reference in its CLAUDE.md), read that first.
- **Component inventory:** your component barrel file (e.g. `components/index.ts`) is the source of truth for the component list when target is `components` or `all`. Audit every barrel-exported component.
- **Themes to test:** every audit must run against your default theme in light + dark + high-contrast modes. The JSON output's `audit.themes_tested` array must list each theme actually evaluated. If a theme cannot be evaluated (source not available), note it in `confidence: "low"` rather than skipping silently.
- **Token-audit coordination:** if `token-audit` has already scanned the target, prefer its findings for hardcoded-value issues; this skill focuses on WCAG conformance, not token drift.

### Context-window management

This skill has 10 reference files totaling ~90KB. Follow the "Reference-loading order" in the Workflow section above. For `all` or `components` targets, split into multiple invocations rather than trying to audit everything in a single context window.

## Reference Files

| File | Contents |
|------|----------|
| `references/wcag-criteria.md` | Full WCAG 2.2 AA criterion list |
| `references/color-contrast.md` | Contrast calculation, tool usage |
| `references/typography.md` | Font size, line height, scaling |
| `references/keyboard.md` | Focus management, tab order |
| `references/aria-patterns.md` | APG patterns for common components |
| `references/forms.md` | Form accessibility patterns |
| `references/motion.md` | Animation, timing, reduced motion |
| `references/cognitive.md` | WCAG 2.2 cognitive additions |
| `references/section-508.md` | Federal 508 requirements |
| `references/testing-checklist.md` | Manual testing procedures |
