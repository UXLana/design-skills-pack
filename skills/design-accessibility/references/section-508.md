# Section 508 Compliance

**Contents:** Overview · Structure of the Revised 508 Standards · What Applies to a Web App or Design System · WCAG 2.0 Criteria Incorporated · 4.1.1 Parsing · Chapter 5 in Practice · Legacy 1194.22 Crosswalk · VPAT and ACR · Testing for 508 · Report Mode Output

## Overview

Section 508 of the Rehabilitation Act requires federal agencies to make the information and communication technology (ICT) they develop, procure, maintain or use accessible to people with disabilities. Vendors meet it through procurement: agencies ask for an Accessibility Conformance Report (ACR).

The **Revised 508 Standards** (36 CFR Part 1194, published 2017-01-18, compliance required from 2018-01-18) incorporate **WCAG 2.0 Level A and AA** by reference (702.10.1). WCAG 2.1 and 2.2 criteria are not part of 508; report them in a separate "Beyond the 508 baseline" section with their WCAG labels.

## Structure of the Revised 508 Standards

| Part | Chapter | Sections | Covers |
|---|---|---|---|
| Appendix A — 508 scoping | 1 Application and Administration | E101 General (incl. E101.2 equivalent facilitation), E102 Referenced Standards, E103 Definitions | Purpose, definitions |
| | 2 Scoping Requirements | E201 Application, E202 General Exceptions, E203 Access to Functionality, E204 Functional Performance Criteria, E205 Electronic Content, E206 Hardware, E207 Software, E208 Support Documentation and Services | What must comply, and with which chapters |
| Appendix B | — | Section 255 (telecommunications) scoping | Not 508 |
| Appendix C — technical requirements | 3 Functional Performance Criteria | 301, 302.1–302.9 | Outcomes by disability type |
| | 4 Hardware | 401–415 | Physical devices, kiosks |
| | 5 Software | 501 General, 502 Interoperability with Assistive Technology, 503 Applications, 504 Authoring Tools | Platform, app and authoring-tool requirements |
| | 6 Support Documentation and Services | 601, 602, 603 | Docs, help desks, training |
| | 7 Referenced Standards | 701, 702 (702.10.1 = WCAG 2.0) | Incorporated standards |
| Appendix D | — | Original 2000 standards (1194.21–1194.26) | Kept for the legacy-ICT safe harbor (E202.2) |

Section numbers with an "E" prefix are 508 scoping (Appendix A); unprefixed numbers (302, 502, 602…) are the technical requirements in Appendix C.

## What Applies to a Web App or Design System

| Provision | Applies? | What to check |
|---|---|---|
| **E205.4 / E207.2 — WCAG 2.0 A + AA** | Always | The core of the audit. Non-web documents and non-web software are exempt from 2.4.1, 2.4.5, 3.2.3 and 3.2.4 (and read "page" as "document" or "software") |
| **501.1 exception** | Web apps | A web app without access to platform accessibility services doesn't have to meet 502 or 503 if it conforms to WCAG 2.0. Native and desktop software must meet them |
| **503.2 User Preferences** | Native apps only | Web applications are exempt; honoring `prefers-contrast`, `prefers-reduced-motion` or `forced-colors` in a web app is `[Best Practice]` or `[DS Requirement]` |
| **503.4 Caption and audio-description controls** | Video players | Caption controls at the same menu level as volume or program selection; audio-description controls at the same level as program selection |
| **504 Authoring Tools** | Products that let users create content (rich-text editors, page or form builders, document generators) | 504.2 output can conform to WCAG 2.0; 504.2.1 accessibility information survives format conversion; 504.2.2 PDF export can produce PDF/UA-1; 504.3 a mode that prompts authors toward accessible content; 504.4 accessible templates where templates exist |
| **Chapter 3 — Functional Performance Criteria** | Where Chapters 4 and 5 don't address a function (E204.1), and to judge equivalent facilitation (E101.2) | 302.1 Without Vision · 302.2 With Limited Vision · 302.3 Without Perception of Color · 302.4 Without Hearing · 302.5 With Limited Hearing · 302.6 Without Speech · 302.7 With Limited Manipulation · 302.8 With Limited Reach and Strength · 302.9 With Limited Language, Cognitive, and Learning Abilities |
| **Chapter 6 — Support Documentation and Services** | When you ship docs or support | 602.2 docs list and explain the accessibility and compatibility features; 602.3 electronic docs (including web self-service support) conform to WCAG 2.0; 602.4 alternate formats on request for non-electronic docs; 603.2 support services can explain those features; 603.3 support accommodates users' communication needs |

Label failures of any of these `[Section 508]`; use the provision number as the `criterion` ("503.4", "602.3").

## WCAG 2.0 Criteria Incorporated

All WCAG 2.0 Level A and AA success criteria (rows tagged 2.0 in `wcag-criteria.md`):

**Perceivable** — 1.1.1 · 1.2.1–1.2.5 (time-based media) · 1.3.1–1.3.3 · 1.4.1–1.4.5
**Operable** — 2.1.1–2.1.2 · 2.2.1–2.2.2 · 2.3.1 · 2.4.1–2.4.7
**Understandable** — 3.1.1–3.1.2 · 3.2.1–3.2.4 · 3.3.1–3.3.4
**Robust** — 4.1.1 Parsing · 4.1.2 Name, Role, Value

Not included: anything added in WCAG 2.1 (e.g., 1.4.10 Reflow, 1.4.11 Non-text Contrast, 2.5.x, 4.1.3) or 2.2 (2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8).

## 4.1.1 Parsing

WCAG 2.2 removed 4.1.1, but 508 incorporates WCAG 2.0, which still contains it. W3C's note says it should be considered always satisfied for content using HTML or XML, and the Access Board's ICT Testing Baseline for Web records it as a pass with no testing needed. In a 508 report, mark 4.1.1 **Supports** with a remark citing that note, and report duplicate-ID or nesting problems that affect users under 1.3.1 or 4.1.2.

## Chapter 5 in Practice

For a web app, Chapter 5 is mostly met through WCAG 2.0 (the 501.1 exception). These still matter:

### Name, role, state, value
WCAG 4.1.2 for web; 502.3.1 Object Information is the native-software equivalent.

```tsx
// Native elements expose name, role and value to assistive technology
<label htmlFor="shipping-method">Shipping method</label>
<select id="shipping-method" value={method} onChange={handleChange}>
  {methods.map((m) => (
    <option key={m.id} value={m.id}>{m.name}</option>
  ))}
</select>
```

### Don't disrupt accessibility features (502.2.2)
```tsx
// ❌ Don't capture keys that screen readers and the OS rely on
document.addEventListener('keydown', (e) => {
  if (e.key === 'Insert' || e.key === 'CapsLock') e.preventDefault();
});

// ❌ Don't disable selection of text content (users copy it, AT reads it)
// user-select: none;  → avoid on content
```

### Platform preferences
503.2 (color, contrast, font type, font size, focus cursor from platform settings) binds native apps. In a web app it is `[Best Practice]`:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches;
const forcedColors = window.matchMedia('(forced-colors: active)').matches;
```

## Legacy 1194.22 Crosswalk (Pre-2018, Historical Reference Only)

The original 2000 standards are obsolete for new audits but still appear in old RFPs and contracts, and E202.2 protects unaltered ICT that met them. Use this table only to translate legacy references — never cite 1194.22 paragraphs in new findings.

| Legacy 1194.22 | Requirement | Closest WCAG 2.0 |
|---|---|---|
| (a) | Text equivalent for non-text elements | 1.1.1 |
| (b) | Synchronized alternatives for multimedia | 1.2.1–1.2.5 |
| (c) | Information conveyed with color also available without it | 1.4.1 |
| (d) | Readable without an associated style sheet | 1.3.1, 1.3.2 |
| (e) | Redundant text links for server-side image maps | 1.1.1, 2.4.4 |
| (f) | Client-side image maps instead of server-side | 1.1.1, 2.1.1 |
| (g) | Row and column headers identified for data tables | 1.3.1 |
| (h) | Markup associates data and header cells in complex tables | 1.3.1 |
| (i) | Frames titled | 4.1.2, 2.4.1 |
| (j) | No flicker between 2 and 55 Hz | 2.3.1 |
| (k) | Text-only page when compliance is otherwise impossible | Conformance requirement 1 (conforming alternate version) |
| (l) | Script-generated content readable by AT | 4.1.2, 2.1.1 |
| (m) | Link to an accessible plug-in when one is required | No direct equivalent — the plug-in content must itself conform |
| (n) | Electronic forms usable with AT | 1.3.1, 3.3.1, 3.3.2, 4.1.2 |
| (o) | Method to skip repetitive navigation links | 2.4.1 |
| (p) | Alert and extra time for timed responses | 2.2.1 |

## VPAT and ACR

A **VPAT** is the Information Technology Industry Council's (ITI) template; a completed VPAT is an **Accessibility Conformance Report (ACR)**. Use the official template from itic.org rather than a homemade structure — agencies and procurement reviewers expect ITI's layout. The current version is **VPAT 2.5Rev (April 2025)**; check for a newer one before starting.

| Edition | Covers | Use for |
|---|---|---|
| 508 | Revised 508 Standards (WCAG 2.0 plus Chapters 3, 5, 6) | US federal sales |
| EU | EN 301 549 (WCAG 2.1 in the current edition) | EU public sector, European Accessibility Act |
| WCAG | WCAG 2.0, 2.1 and 2.2 | ADA Title II (report 2.1 AA), general WCAG claims |
| INT | All three | Selling into several markets |

### Conformance levels (ITI terms)

| Level | Meaning |
|-------|---------|
| Supports | At least one method meets the criterion without known defects, or meets it with equivalent facilitation |
| Partially Supports | Some functionality does not meet the criterion |
| Does Not Support | The majority of functionality does not meet the criterion |
| Not Applicable | The criterion is not relevant to the product |
| Not Evaluated | Not evaluated — allowed only for WCAG Level AAA criteria |

Every Partially Supports or Does Not Support row needs remarks that name the affected components and the planned fix. Roll up this skill's JSON findings per criterion to fill the table.

## Testing for 508 Compliance

1. **Automated testing** — axe DevTools, Lighthouse, WAVE. Automated tools catch only a minority of issues (estimates vary by study), so they never support a conformance claim on their own.
2. **Manual testing** — keyboard-only navigation, screen readers (NVDA, JAWS, VoiceOver), forced colors / high contrast, 200% zoom and 320px reflow.
3. **Assistive technology** — NVDA (Windows, free), JAWS (Windows, commercial), VoiceOver (macOS/iOS, built-in), TalkBack (Android, built-in).
4. **Federal method** — the Access Board's ICT Testing Baseline for Web sets out a common minimum test method for federal 508 testing; aligning with it makes your results easier for an agency reviewer to compare.

### Testing Matrix

| Component | Keyboard | Screen Reader | High Contrast | Zoom |
|-----------|----------|---------------|---------------|------|
| Forms | ✓ | ✓ | ✓ | ✓ |
| Tables | ✓ | ✓ | ✓ | ✓ |
| Modals | ✓ | ✓ | ✓ | ✓ |
| Navigation | ✓ | ✓ | ✓ | ✓ |
| Data entry | ✓ | ✓ | ✓ | ✓ |

## Report Mode Output

For `--report` with a 508 target. Use the same shape for other targets, swapping the standard.

```markdown
# Accessibility Conformance Report — [Product] [Version]

**Report based on:** ITI VPAT 2.5Rev, 508 edition
**Evaluation date:** [Date]
**Evaluator:** [Name/Organization]
**Evaluation methods:** axe DevTools 4.x; keyboard-only; NVDA and VoiceOver; forced colors; 200% zoom

### Summary
| Standard | Conformance |
|----------|-------------|
| WCAG 2.0 Level A | Supports / Partially Supports / Does Not Support |
| WCAG 2.0 Level AA | Supports / Partially Supports / Does Not Support |
| 508 Chapter 3 (FPC) | … |
| 508 Chapter 5 (Software) | … |
| 508 Chapter 6 (Support Documentation) | … |

### Issue Summary
| Severity | Count |
|----------|-------|
| Critical | X |
| Serious | X |
| Moderate | X |
| Minor | X |

## Detailed Findings

### 1.1.1 Non-text Content (Level A)
**Conformance:** Supports
**Remarks:** All images have appropriate alternative text…

### 1.4.3 Contrast (Minimum) (Level AA)
**Conformance:** Partially Supports
**Remarks:** Two text tokens fall below 4.5:1 on elevated surfaces (Badge, Tag); fix planned for [release]

### 4.1.1 Parsing (Level A)
**Conformance:** Supports
**Remarks:** Per the W3C note in WCAG 2.0/2.1, considered always satisfied for HTML content

[Continue for each criterion]

## Beyond the 508 Baseline (WCAG 2.1 / 2.2)
[Findings labelled [WCAG 2.1 AA] or [WCAG 2.2 AA]]

## Remediation Plan
1. [Critical issue] — Target: [Date]
2. [Serious issue] — Target: [Date]
```
