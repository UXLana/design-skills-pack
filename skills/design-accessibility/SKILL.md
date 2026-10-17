---
name: design-accessibility
description: Audit and fix accessibility in React design-system components, design tokens, themes and prototype screens against WCAG 2.2 AA, and write conformance reports for Section 508 (WCAG 2.0 AA), ADA Title II (WCAG 2.1 AA) and EN 301 549 / the European Accessibility Act. Use whenever someone asks "is this accessible?", wants an a11y or WCAG audit, a contrast check on tokens or a theme, a keyboard or screen-reader review, focus, target-size or ARIA-pattern fixes, or a VPAT / ACR / compliance report, even if they only say "a11y" or name a component. Three modes — standard (WCAG 2.2 AA findings with code fixes), compliance (adds the legal standard the contract names), report (formal ACR-style write-up plus JSON findings). Not for visual polish (design-system-ui), breakpoint layout checks (responsive-audit), screenshot verification (visual-qa), hardcoded-value drift (token-audit) or generating new theme palettes (theme-generator).
---

# Design Accessibility

Audit and remediate accessibility issues in React design-system components, tokens, themes and screens against WCAG 2.2 AA, and report conformance against the legal standard a contract names (Section 508, ADA Title II, EN 301 549 / European Accessibility Act).

## Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/design-accessibility [target]` | Standard | WCAG 2.2 AA audit with code fixes |
| `/design-accessibility [target] --compliance [508 \| title-ii \| en301549]` | Compliance | Adds the target legal standard (see "Choose the target standard"); ask if none is named |
| `/design-accessibility --report` | Report | Formal ACR-style documentation plus JSON findings |

## Targets

| Target | Scope |
|--------|-------|
| `Button` | Single component by name |
| `components` | All components in the design system |
| `tokens` | Design tokens and themes (color contrast, typography) |
| `all` | Full system audit |
| `src/components/Form.tsx` | Specific file path (component or screen) |

## Audit Categories

### 1. Color & Contrast
- Text contrast: 4.5:1 minimum; 3:1 for large text — at least 18pt (24px), or 14pt (about 18.66px) bold (1.4.3)
- Non-text contrast: 3:1 against adjacent colors for component boundaries, icons, state indicators and focus indicators (1.4.11). Inactive (disabled) components and unmodified browser-default focus rings are exempt.
- Color-blind safety: no information conveyed by color alone (1.4.1)
- The WCAG 2 contrast ratio is the only conformance test. Compare unrounded values (4.499:1 fails 4.5:1). APCA scores can inform design choices, but report them as `[Best Practice]`, never as pass/fail.
- Reference: `references/color-contrast.md`

### 2. Typography & Readability
- Text resizes to 200% without clipping, overlap or lost function (1.4.4). Pixel font sizes are not a failure on their own — browser zoom scales them. Flag clipped text, fixed-height containers and viewport-unit font sizes instead.
- Content survives user text-spacing overrides (line height 1.5×, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em) (1.4.12). The criterion is about surviving the override, not about the defaults you ship.
- A 16px body size, 14px secondary minimum and 1.5 default line height are common design-system defaults — label shortfalls `[DS Requirement]`, not WCAG failures.
- Reference: `references/typography.md`

### 3. Keyboard & Focus
- All functionality by keyboard, no traps (2.1.1, 2.1.2); focus order preserves meaning (2.4.3)
- Focus visible (2.4.7) and not entirely hidden by sticky headers, banners or drawers (2.4.11)
- Focus indicators survive Windows forced-colors mode: draw them with `outline` (a transparent outline becomes visible there), not with a `box-shadow` ring alone (forced colors removes box-shadow). In Tailwind v4, `outline-none` really removes the outline — use `outline-hidden`.
- Escape closes overlays; skip link for repeated navigation (2.4.1)
- Modals: native `<dialog>` first (see Component Audit Patterns)
- Reference: `references/keyboard.md`

### 4. ARIA & Semantic HTML
- Correct roles: use native HTML elements where possible
- Required labels: all interactive elements have an accessible name
- State communication: aria-expanded, aria-selected, aria-checked, etc.
- Live regions: dynamic content updates announced (4.1.3)
- APG patterns: follow the ARIA Authoring Practices Guide
- Reference: `references/aria-patterns.md`

### 5. Forms & Data Entry
- Every input has a visible, programmatically associated label (1.3.1, 3.3.2, 4.1.2)
- Errors identified in text, not just color (3.3.1), with a suggested fix where one is known (3.3.3)
- Legal, financial or data-deleting submissions are reversible, checked or confirmed (3.3.4)
- Input purpose: `autoComplete` on fields that collect the user's own data (1.3.5)
- Native `required` on native controls; `aria-required` only on custom widgets
- Reference: `references/forms.md`

### 6. Timing & Motion
- Moving, blinking or auto-updating content can be paused (2.2.2); nothing flashes more than 3 times a second (2.3.1)
- Time limits: users can turn them off or adjust them, or are warned and get at least 20 seconds to extend with a simple action (2.2.1)
- `prefers-reduced-motion` support is not an AA criterion — label it `[DS Requirement]` if your system mandates it, otherwise `[Best Practice]`
- Reference: `references/motion.md`

### 7. Pointer & Target Size
- Targets at least 24×24 CSS pixels unless an exception applies: Spacing (a 24px circle centred on each undersized target touches no other target or circle), Equivalent control on the page, Inline in text, User-agent default, Essential (2.5.8)
- Dragging has a single-pointer alternative (2.5.7); path and multipoint gestures have single-pointer alternatives (2.5.1); actions fire on the up-event (2.5.2)
- Reference: `references/pointer.md`

### 8. Cognitive & Input Assistance (WCAG 2.2)
- Help mechanisms appear in the same relative order across pages (3.2.6)
- Don't make users re-enter information in the same process (3.3.7)
- No cognitive function test to sign in unless there is an alternative or a mechanism such as paste and password-manager support. Object recognition and recognising the user's own content are allowed at AA (3.3.8) and only disallowed at AAA (3.3.9).
- Reference: `references/cognitive.md`

## Severity Levels

| Level | Definition | Response |
|-------|------------|----------|
| **Critical** | Blocks access for users with disabilities | Must fix immediately |
| **Serious** | Significantly impairs usage | Fix in current sprint |
| **Moderate** | Creates difficulty but workarounds exist | Fix soon |
| **Minor** | Enhancement opportunity | Add to backlog |

## Source Labels (attach to every finding)

Every finding carries exactly one source label. This keeps a design-system preference from being passed off as a WCAG failure, and keeps an AAA nicety from blocking an AA audit.

| Label | Meaning | Use in |
|-------|---------|--------|
| `[WCAG 2.0 AA]` | Fails a WCAG 2.0 A/AA criterion | Standard, Report |
| `[WCAG 2.1 AA]` | Fails an A/AA criterion added in 2.1 (1.3.4, 1.3.5, 1.4.10–1.4.13, 2.1.4, 2.5.1–2.5.4, 4.1.3) | Standard, Report; Compliance when the target predates 2.1 |
| `[WCAG 2.2 AA]` | Fails an A/AA criterion added in 2.2 (2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8) | Standard, Report; Compliance when the target predates 2.2 |
| `[WCAG AAA]` | Fails an AAA criterion (e.g., 2.3.3, 2.4.13) | Report only; never blocks |
| `[Section 508]` | Fails the Revised 508 Standards — WCAG 2.0 A/AA via E205.4 / E207.2, or a 508-only provision (Chapters 3, 5, 6) | Compliance, Report |
| `[ADA Title II]` | Fails WCAG 2.1 A/AA as required of US state and local governments by 28 CFR 35.200 | Compliance, Report |
| `[EN 301 549]` | Fails a clause of EN 301 549 (v3.2.1 — WCAG 2.1 A/AA in clauses 9–11, plus its non-WCAG clauses) | Compliance, Report |
| `[DS Requirement]` | Exceeds WCAG; your design system mandates it (e.g., 16px body default, reduced-motion support) | All modes — never a conformance failure |
| `[Best Practice]` | Recommended; nothing mandates it (e.g., APCA scores, relative font units) | Report, or when asked |

In Compliance mode, label a finding with the target standard when it breaks that standard. A finding that only breaks a newer WCAG version keeps its WCAG label and goes in a separate "Beyond the [target] baseline" section. Under a 508 target, a 2.5.8 failure is `[WCAG 2.2 AA]`, not `[Section 508]`; under a Title II target, a 1.4.11 failure is `[ADA Title II]`.

If you cannot confidently assign a label, do not emit the finding — ask the user to clarify scope instead.

## Trace before emit (false-positive guardrail)

Code-inspection audits have a high false-positive rate when you stop reading too early. Before emitting any finding with `confidence: "medium"` or lower, trace the code path end-to-end:

| If the finding is about… | Trace to… |
|---|---|
| A broken ARIA reference (`aria-describedby`, `aria-labelledby`, `aria-controls` pointing at an id) | The `id` generator. Grep for `useId()`, template-literal id construction, or the prop source. Confirm the referenced element is actually rendered. |
| A touch-target size issue | The **click-target wrapper**, not the inner element. A 16×16 `<input>` inside a 24×24 `<label>` still passes 2.5.8. Measure the outermost focusable/clickable element, then check the Spacing and Equivalent exceptions before flagging. |
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

### Reference-loading order (do this first, every run)

The skill ships with 12 reference files (about 120KB). Loading all of them plus target code would eat a large share of the context on a single audit, so load selectively:

1. **Always load first:** `references/wcag-criteria.md` (canonical criterion list with version tags — prevents drift)
2. **Load by target type:**
   - Single component (e.g. `Button`, `Modal`) → the 2–3 most relevant references only (`keyboard.md` for interactive, `forms.md` for inputs, `aria-patterns.md` for custom widgets, `pointer.md` for small or draggable targets)
   - `components` (all) → process in batches, loading `aria-patterns.md` + `keyboard.md` once and reusing them
   - `tokens` → only `color-contrast.md` + `typography.md`
   - `all` → `wcag-criteria.md`, then one category reference at a time
3. **Mode-specific:** `--compliance` with a 508 target also loads `section-508.md`; any compliance run loads the critical sections of `forms.md`. Load `regulated-workflows.md` only when the product is regulated record-keeping, attestation or reporting software, or the user asks for those checks.
4. **Cap:** no more than 4 reference files in a single prompt. If you need more, split the audit into multiple invocations.

Prefer the bundled references over memory — they encode distinctions that are easy to get wrong. When a reference conflicts with a primary source (the W3C Understanding documents, the Access Board's text, the Federal Register), the primary source wins: cite it, and note which reference section disagrees so it can be fixed.

### Standard Mode

1. **Identify target** — Parse command for component, file, or scope
2. **Load references** — Follow the reference-loading order above
3. **Scan codebase** — Analyze TSX, CSS, token files
4. **Audit each category** — Check against WCAG 2.2 AA criteria
5. **Generate findings** — Every finding carries a source label and populates every field of the JSON schema
6. **Output report** — Structured findings with code patches + machine-readable JSON block

### Compliance Mode (--compliance)

All standard checks plus:
1. **Choose the target standard** — from the contract, RFP or the user (table below). If none is named, ask; don't assume Section 508 alone is enough.
2. **Map findings to the target** — apply the Compliance labelling rule above and the 4.1.1 rule below.
3. **Check the target's non-WCAG provisions** — 508 Chapters 3, 5 and 6; EN 301 549's non-WCAG clauses.
4. **Form/data-entry deep scan** — the critical sections of `forms.md`.
5. **Regulated workflows (opt-in)** — scanner entry, long identifiers, attestation, e-signature, bulk actions: `references/regulated-workflows.md`.

### Report Mode (--report)

Generate formal documentation:
1. **Executive summary** — Pass/fail status, issue counts by severity
2. **Detailed findings** — Full audit results
3. **Remediation plan** — Prioritized fix recommendations
4. **Conformance statement** — target standard and level. For a formal Accessibility Conformance Report (ACR), fill in the ITI VPAT edition that matches the target (see `references/section-508.md`).

## Output Format

Every audit emits **two artifacts side by side**: a human-readable markdown report (for PRs and review) and a machine-readable JSON block (for issue trackers, ACRs and downstream automation). Emit both, every time.

### Machine-Readable JSON Schema

Append this JSON block (fenced as ```json) at the end of every audit response. Every field is required — if a value is unknown, use `null` and set `confidence` accordingly.

```json
{
  "schemaVersion": "1.1",
  "audit": {
    "target": "src/components/Button/Button.tsx",
    "mode": "standard | compliance | report",
    "standard": "WCAG 2.2 AA | Section 508 | ADA Title II | EN 301 549 v3.2.1",
    "date": "2026-04-15",
    "auditor": "design-accessibility skill",
    "themes_tested": ["default-light", "default-dark", "forced-colors"]
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
      "source_label": "WCAG 2.2 AA | WCAG 2.1 AA | WCAG 2.0 AA | WCAG AAA | Section 508 | ADA Title II | EN 301 549 | DS Requirement | Best Practice",
      "criterion": "1.4.11",
      "criterion_name": "Non-text Contrast",
      "category": "contrast | typography | keyboard | aria | forms | motion | pointer | cognitive | structure",
      "component": "Button",
      "file": "src/components/Button/Button.tsx",
      "line_start": 42,
      "line_end": 58,
      "title": "Focus ring fails 3:1 against the elevated surface it sits on",
      "evidence": "Token focus.ring-color (#C9CED6) against surface.lightDarker (#EFF1F4) = 1.39:1",
      "user_impact": "Keyboard users cannot visually locate focus on elevated surfaces",
      "test_method": "automated-contrast | manual-keyboard | manual-screen-reader | code-inspection",
      "confidence": "high | medium | low",
      "fix": {
        "description": "Darken focus.ring-color to meet 3:1 against every surface the ring is drawn on",
        "before": "--focus-ring: #C9CED6;",
        "after": "--focus-ring: #4A5058; /* 7.19:1 on #EFF1F4, 8.14:1 on #FFFFFF */",
        "files_touched": ["tokens/semantic.json"]
      },
      "verification": [
        "Tab through Button on light, dark and forced-colors themes; focus visible on all surfaces",
        "Recompute ring vs. each surface with the WCAG formula; every pair at least 3:1"
      ],
      "remediation_owner": "design-system-team",
      "jira": {
        "summary": "[A11y] Focus ring fails 3:1 contrast on elevated surfaces",
        "priority": "High",
        "labels": ["accessibility", "wcag-1.4.11", "design-tokens"]
      }
    }
  ]
}
```

**Rules:**
- `findings[]` must be sorted by severity (critical → minor).
- `criterion` uses dotted notation ("2.4.7"), never "WCAG 2.4.7". For a non-WCAG provision use its own id ("503.4", "EN 7.1.1").
- `file` uses paths relative to repo root.
- `test_method` distinguishes automated vs manual evidence — for compliance claims, manual verification is required.
- `confidence` = `low` whenever the finding depends on behavior the agent could not directly observe (e.g. screen reader announcements without live AT output).
- Schema 1.1 adds the `ADA Title II` and `EN 301 549` labels and the `pointer` category; everything else is unchanged from 1.0.

### Issue Template

```markdown
### [SEVERITY] Issue Title

**WCAG Criterion:** [Number] — [Name] (Level [A/AA/AAA])
**Source label:** [WCAG 2.2 AA]
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
**Standard:** WCAG 2.2 AA [+ target standard: Section 508 | ADA Title II | EN 301 549]
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
| Keyboard & Focus | X | ✓/✗ |
| ARIA & Semantic HTML | X | ✓/✗ |
| Forms & Data Entry | X | ✓/✗ |
| Timing & Motion | X | ✓/✗ |
| Pointer & Target Size | X | ✓/✗ |
| Cognitive & Input Assistance | X | ✓/✗ |

### Critical Issues Requiring Immediate Action
1. [Issue summary with location]
2. [Issue summary with location]
```

## Token Audit Patterns

When auditing tokens (`/design-accessibility tokens`):

### Color Token Checks
```typescript
// Check all background/foreground combinations, in every theme and mode
const combinations = [
  { bg: 'color.bg.surface', fg: 'color.text.primary', minRatio: 4.5 },
  { bg: 'color.bg.surface', fg: 'color.text.secondary', minRatio: 4.5 },
  { bg: 'color.bg.elevated', fg: 'color.text.primary', minRatio: 4.5 },
  { bg: 'color.bg.brand', fg: 'color.text.inverse', minRatio: 4.5 },
  // UI components and focus indicators need 3:1 against what they sit on
  { bg: 'color.bg.surface', fg: 'color.border.default', minRatio: 3.0 },
  { bg: 'color.bg.surface', fg: 'color.icon.default', minRatio: 3.0 },
  { bg: 'color.bg.surface', fg: 'color.focus.ring', minRatio: 3.0 },
  { bg: 'color.bg.elevated', fg: 'color.focus.ring', minRatio: 3.0 },
];
```

### Typography Token Checks
```typescript
// Design-system minimums — label shortfalls [DS Requirement], not WCAG failures
const typographyMins = {
  'text.body.sm': { minSize: 14, minLineHeight: 1.5 },
  'text.body.md': { minSize: 16, minLineHeight: 1.5 },
  'text.body.lg': { minSize: 18, minLineHeight: 1.5 },
  'text.label.sm': { minSize: 12, minLineHeight: 1.4 }, // ⚠️ Below 14px — limit its use
};
```

## Component Audit Patterns

### Button
- Has accessible name (text content or aria-label)
- Correct role (button, not div)
- Focus visible, with an indicator at 3:1 against the surface it is drawn on
- Disabled state follows the decision tree below
- Loading state announced via `aria-live` or `aria-busy`

#### `disabled` vs `aria-disabled` — decision tree

| User should… | Use |
|---|---|
| Skip past the control — it is obviously unavailable and there is nothing to learn (e.g., "Copy" with nothing selected) | Native `disabled` |
| Find the control and learn **why** it is unavailable (waiting on required fields, a permission, a prior workflow step) | `aria-disabled="true"` + `aria-describedby` pointing at the reason — it stays focusable, so screen-reader users hear why |

Where a disabled state carries meaning, prefer `aria-disabled` + `aria-describedby`, and don't flag the pattern as a violation. `aria-disabled` doesn't block activation, so guard the handler.

```tsx
// ✓ Native disabled — "Copy" when nothing is selected; the user has no reason to reach it
<button disabled={selection.length === 0}>Copy</button>

// ✓ aria-disabled — "Place order" waits on required fields; the user needs to know why
<button
  aria-disabled={!formComplete}
  aria-describedby="submit-help"
  onClick={formComplete ? handleSubmit : undefined}
>
  Place order
</button>
<p id="submit-help" className="help-text">
  Place order becomes available once every required field is filled in.
</p>
```

### Form Inputs
- Label associated via `htmlFor`/`id` or wrapping `<label>`
- Error messages linked via `aria-describedby`
- Required state via native `required` plus a visual indicator (`aria-required` only on custom widgets)
- Invalid state via `aria-invalid`
- Help text linked via `aria-describedby`

### Modal/Dialog
- Prefer native `<dialog>` opened with `showModal()`. The browser gives it modal semantics (implicit `aria-modal`), makes the rest of the page inert, closes it on Escape and moves focus inside — don't hand-roll a Tab trap on top.
- Title via `aria-labelledby`; a visible close button
- Focus returns to the opener on close — browsers do this per the HTML spec; restore it yourself if the opener was re-rendered or removed
- Custom overlay that isn't a `<dialog>`: `role="dialog"` + `aria-modal="true"`, and set `inert` on everything outside it rather than trapping Tab manually

### Data Tables
- Proper `<table>` structure (not div grid)
- Column headers with `scope="col"`
- Row headers with `scope="row"` where applicable
- Caption or aria-label for table purpose
- Sortable columns indicate sort state

## Compliance Mode Details

### Choose the target standard

| Contract or law names… | Conformance target | Label | Notes |
|---|---|---|---|
| Section 508 (US federal agencies and their vendors) | WCAG 2.0 A + AA, plus 508 Chapters 3, 5, 6 | `[Section 508]` | Revised 508 Standards, 36 CFR Part 1194 — required since 2018-01-18 |
| ADA Title II (US state and local government web content and mobile apps) | WCAG 2.1 A + AA (28 CFR 35.200) | `[ADA Title II]` | DOJ interim final rule of 2026-04-20 (91 FR 20902) moved compliance to 2027-04-26 for entities with a population of 50,000 or more, and 2028-04-26 for smaller entities and special district governments. Interim rule — re-check before relying on them. |
| EN 301 549 (EU public sector, Web Accessibility Directive; procurement) | v3.2.1 — WCAG 2.1 A + AA via clauses 9 (web), 10 (documents), 11 (software), plus non-WCAG clauses (e.g., 7 video and captions, 12 documentation and support) | `[EN 301 549]` | v3.2.1 is the version in force. v4.1.1 (published 2026-09-02) moves to WCAG 2.2 A + AA and takes effect once cited in the EU Official Journal — check its status before choosing |
| European Accessibility Act (EU consumer products and services; applies since 2025-06-28) | EN 301 549 as the technical reference | `[EN 301 549]` | Check scope first: the Act lists specific product and service types, and exempts micro-enterprises that provide services |
| WCAG 2.2 AA, or nothing specific | WCAG 2.2 A + AA | WCAG labels | Same as Standard mode |

Some US states and other countries cite WCAG 2.1 or 2.2 directly in law or procurement language. Read the contract; never assume one standard covers another.

### Section 508 in brief

- The Revised 508 Standards cover information and communication technology (ICT). E205.4 (electronic content) and E207.2 (software) incorporate WCAG 2.0 Level A and AA by reference (702.10.1). Non-web documents and non-web software are exempt from 2.4.1, 2.4.5, 3.2.3 and 3.2.4.
- For a web app that doesn't use platform accessibility services, WCAG 2.0 conformance satisfies Chapter 5's 502 and 503 (501.1 exception). 504 still applies if the product lets users author content (rich-text editors, form builders, CMS).
- Chapter 3's functional performance criteria apply where the technical requirements don't address a function (E204.1). Chapter 6 covers support documentation and services.
- Full chapter map, the legacy 1194.22 crosswalk and the VPAT/ACR guide: `references/section-508.md`.

### 4.1.1 Parsing across targets

WCAG 2.2 removed 4.1.1 — omit it from 2.2 audits. WCAG 2.0 and 2.1 still contain it (so 508, Title II and EN 301 549 v3.2.1 reports list it), but W3C's note says to treat it as always satisfied for HTML and XML, and the Access Board's ICT Testing Baseline records it as a pass. Report it as **Supports** with that remark, and file duplicate-ID or nesting problems under 1.3.1 or 4.1.2 where they affect users.

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

- **Your QA gate** (if you run one) reads the JSON findings block. Any `severity: "critical"` or `severity: "serious"` with a source label of `[WCAG 2.x AA]`, `[Section 508]`, `[ADA Title II]` or `[EN 301 549]` auto-escalates to a BLOCK verdict.
- **`design-system-storyteller`** reads findings to surface accessibility notes in component documentation examples.
- **A compliance dashboard** (if you keep one) ingests the JSON and maps findings to tickets via the `jira.*` fields.
- **ACR / VPAT generation** uses the `conformance` rollup per criterion.

### Shared schema references

- **Tokens:** this skill audits values in your token source file and your per-theme files. When auditing contrast, resolve colors through your theme's semantic color accessor — do not hardcode hex lookups. If the project documents its tokens (e.g. a token reference in its CLAUDE.md), read that first.
- **Component inventory:** your component barrel file (e.g. `components/index.ts`) is the source of truth for the component list when target is `components` or `all`. Audit every barrel-exported component.
- **Themes to test:** run every audit against your default theme in light, dark and high-contrast modes, and check focus and borders under forced colors. The JSON output's `audit.themes_tested` array lists each theme actually evaluated. If a theme cannot be evaluated (source not available), note it with `confidence: "low"` rather than skipping silently.
- **Token-audit coordination:** if `token-audit` has already scanned the target, prefer its findings for hardcoded-value issues; this skill focuses on WCAG conformance, not token drift.

### Context-window management

Follow the "Reference-loading order" in the Workflow section above. For `all` or `components` targets, split into multiple invocations rather than trying to audit everything in a single context window.

## Reference Files

| File | Contents | Read when |
|------|----------|-----------|
| `references/wcag-criteria.md` | WCAG 2.2 A/AA criteria with the version each was added in | Every run, first |
| `references/color-contrast.md` | Contrast formula, focus-indicator measurement, APCA status | Contrast, tokens, themes |
| `references/typography.md` | Resize, text spacing, large-text definition | Tokens, text components |
| `references/keyboard.md` | Focus visibility, forced colors, native dialog, focus not obscured | Any interactive component |
| `references/aria-patterns.md` | APG patterns for common components | Custom widgets |
| `references/forms.md` | Labels, errors, error prevention, autocomplete | Inputs and forms; compliance runs |
| `references/motion.md` | Animation, auto-play, carousels, session timeouts | Animated or timed UI |
| `references/pointer.md` | Target size with exceptions, dragging alternatives | Small, dense or draggable targets |
| `references/cognitive.md` | Consistent help, redundant entry, accessible authentication | Multi-step flows, sign-in |
| `references/section-508.md` | 508 chapter map, legacy crosswalk, VPAT/ACR guide | Compliance with a 508 target; ACRs |
| `references/regulated-workflows.md` | Opt-in checks for regulated record-keeping and attestation UIs | Only when the product is in a regulated workflow, or the user asks |
| `references/testing-checklist.md` | Manual testing procedures | Verification steps, Report mode |
