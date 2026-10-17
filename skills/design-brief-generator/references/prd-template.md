# Design Brief Template

Use this template to generate the brief. Keep every heading; fill unknowns with `[TBD]` and list them under Gaps to Resolve.

---

```markdown
# [Project Name] — Design Brief

## Overview

**Problem Statement:** [User type] needs [need/goal] so that [reason/outcome].

**Trigger:** [What initiated this work]

**Primary Users:** [User types]

---

## Problem Definition

### Who
[Specific user types experiencing this problem]

### What
[The problem or unmet need — be specific]

### Where & When
[Context, touchpoint, platform, frequency]

### Why It Matters
**User Impact:** [How this affects users]
**Business Impact:** [How this affects the business]

---

## Users & Tasks

### Primary Users
[User type 1]
- **Goal:** [What they're trying to accomplish]
- **Primary Tasks:**
  1. [Task/workflow step 1]
  2. [Task/workflow step 2]
  3. [Task/workflow step 3]
- **Pain Points:** [What's frustrating about current experience]

[User type 2, if applicable]
- **Goal:** [What they're trying to accomplish]
- **Primary Tasks:** [Key workflow steps]
- **Pain Points:** [Current frustrations]

---

## Business Value

**Business Goal:** [What business outcome this supports]

**Why Now:** [Why this is a priority]

**Value if Solved:** [Impact on the business]

---

## Hypothesis

> We believe [business outcome] will be achieved if [user type] attains [benefit] with [proposed solution/feature].

### Key Assumptions
- [Assumption 1 — what must be true]
- [Assumption 2]
- [Assumption 3]

### Riskiest Assumption
[The assumption that, if wrong, would cause the entire idea to fail]

**How we'll test it:** [Proposed validation approach, if known]

---

## Requirements

### Must Have
- [ ] [Requirement 1 — specific and testable]
- [ ] [Requirement 2 — specific and testable]
- [ ] [Requirement 3 — specific and testable]

### Should Have
- [ ] [Nice-to-have 1]
- [ ] [Nice-to-have 2]

### Out of Scope
- [Explicitly not solving X]
- [Not addressing Y in this iteration]

---

## Constraints

### Accessibility
- **Target:** [WCAG 2.2 AA by default; add Section 508 or ADA Title II if public-sector]
- **Known assistive-technology needs:** [Screen readers, keyboard-only, magnification, or "None identified"]

### Compliance & Regulatory
[Specific compliance requirements, or "None identified"]
- **Jurisdictions:** [Only if rules differ by region: which jurisdictions or markets are in scope]

### Technology
- **Current Stack:** [Relevant tech]
- **Integrations:** [APIs, third-party systems]
- **Limitations:** [Known technical constraints]

### Platform
- **Target:** [Web, mobile, both]
- **Browser Support:** [If applicable]
- **Offline:** [Required / Not required]

### Timeline
- **Target Ship Date:** [Date or sprint]
- **Hard Deadlines:** [Any immovable dates and why]

### Resources
[Any budget or staffing constraints, or "Standard allocation"]

---

## Risks & Dependencies

### Known Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [H/M/L] | [H/M/L] | [How to reduce] |
| [Risk 2] | [H/M/L] | [H/M/L] | [How to reduce] |

### Dependencies
- [Dependency 1 — what else needs to happen]
- [Dependency 2]

### Critical Path
[Sequence of tasks that determines minimum duration]

---

## Success Criteria

### Definition of Done
- [ ] [Specific, testable criterion for "finished"]
- [ ] Accessibility: key flows meet [target], checked with keyboard, a screen reader and a contrast check

### Metrics
| Metric | Baseline | Target |
|--------|----------|--------|
| [Metric 1] | [Current value] | [Target value] |
| [Metric 2] | [Current value] | [Target value] |

---

## Seed Criteria

Three to six plain-language outcomes. The spec stage turns these into full acceptance criteria.

- [User type] can [outcome] [under what condition]
- [User type] can [outcome] [under what condition]

---

## Edge Cases & Error States

- **[Edge case 1]:** [How to handle]
- **[Edge case 2]:** [How to handle]
- **[Error state 1]:** [Expected behavior]

---

## Existing Patterns & References

- [Link to existing feature/flow to reference]
- [Link to design system component]
- [Link to comparable product/competitor]

---

## Team & Ownership

| Role | Person |
|------|--------|
| Requestor | [Name] |
| Decision-maker | [Name] |
| Design | [Name] |
| Engineering | [Name] |
| PM | [Name] |
| Compliance | [Name, if applicable] |

---

## Links & Resources

- Jira: [Link]
- Figma: [Link]
- Research: [Link]
- Slack thread: [Link]

---

## Gaps to Resolve

[List any missing information with specific questions]

- [ ] [Gap 1]: [Question to answer]
- [ ] [Gap 2]: [Question to answer]

---

## For the build agent

This is a discovery brief, not a build spec. Before writing code, turn it into a spec with `intent-spec` or `spec-pack`.
- Must Have and Out of Scope bound the work; don't build past them.
- Seed Criteria are starting points, not acceptance criteria.
- Resolve Gaps to Resolve first, or carry them into the spec as open questions.
- The accessibility target applies to every screen and state.
- The build should test the hypothesis and the riskiest assumption.
```
