# PRD Template

Use this template to generate the final PRD output. Format optimized for vibe-coding and AI coding assistants.

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

### Compliance & Regulatory
[Specific compliance requirements, or "None identified"]

### Jurisdictions
[Which states/markets this affects]

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
[Specific, testable criteria for "finished"]

### Metrics
| Metric | Baseline | Target |
|--------|----------|--------|
| [Metric 1] | [Current value] | [Target value] |
| [Metric 2] | [Current value] | [Target value] |

---

## Acceptance Criteria

Use these for implementation and QA:

**[Feature/Flow 1]**
- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]

**[Feature/Flow 2]**
- [ ] Given [context], when [action], then [expected result]

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
```

---

## Notes for AI Coding Assistants

When using this PRD for vibe-coding:

1. **Start with Must Haves** — These are non-negotiable
2. **Use Acceptance Criteria** — These define "correct" behavior
3. **Check Edge Cases** — Handle these explicitly
4. **Respect Out of Scope** — Don't over-build
5. **Reference Existing Patterns** — Maintain consistency with linked examples
6. **Validate Against Hypothesis** — The solution should test the stated hypothesis
7. **Check Riskiest Assumption** — Consider how the implementation addresses or tests this
