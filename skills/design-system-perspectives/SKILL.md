---
name: design-system-perspectives
description: 'Pre-build advisory for a concrete design system change: runs three fixed perspectives (Positive, Negative, Neutral) on a proposed component API, breaking change, token architecture change or pattern decision, writes them to _design_task.md (or shows them inline), and waits for the user''s go-ahead before any code or docs change. Use when the user asks "should we...", "pros and cons of this API", "is this a breaking change", "what are the risks before we build X", "sanity-check this token change", "should Button be polymorphic", or gives an ambiguous request like "make the Card more flexible". Skip for routine prop additions, styling within existing tokens, bug fixes and docs-only edits. For open-ended product or design brainstorming not tied to a specific design system change, use design-lead-thought-partner.'
---

# Design System Perspectives

> **Role:** Pre-build advisor: three perspectives on a design system change before anything is built¹
> **Purpose:** Surface tradeoffs and risks before committing to work
> **Output:** Advisory only; does not modify code or documentation

¹ In a multi-skill design-system workflow this is the advisory seat, and the three perspectives are sometimes nicknamed Angel (Positive), Devil (Negative) and Arbiter (Neutral). It works the same standalone.

---

## Overview

This skill provides three distinct viewpoints on design system decisions that involve ambiguity, architectural risk, or significant tradeoffs. Each perspective evaluates the same problem independently, and disagreement is preserved, not resolved.

The goal is **clarity about tradeoffs**, not consensus.

---

## The Advisory File

The advisory lives in `_design_task.md`, a scratch file for the current design-system task. If it doesn't exist, create it at the repository root containing only the Perspectives section. If you can't write files, or the user would rather not have one, show the section inline in chat instead; everything else works the same. Some workflows keep other sections in this file (a docs audit, a build checklist). Put Perspectives first as section 0 and leave the others alone. If there are none, ignore any mention of them below.

---

## The Three Perspectives

### Positive
**Mindset:** Optimistic advocate. Focuses on opportunity.

Evaluates:
- Potential benefits and upside
- Developer experience improvements
- Long-term leverage and reusability
- Velocity gains
- How this enables future work

**Prompt frame:** "What's the best case scenario if we do this well?"

---

### Negative
**Mindset:** Skeptical critic. Focuses on risk.

Evaluates:
- Failure modes and edge cases
- Maintenance burden over time
- Breaking change implications
- Scalability concerns
- Unintended consequences
- What could go wrong in 6 months

**Prompt frame:** "What will we regret if we're not careful?"

---

### Neutral
**Mindset:** Balanced analyst. Focuses on evidence.

Evaluates:
- Precedent (how have we/others solved this?)
- Constraints (time, tokens, API surface)
- Dependencies and coupling
- Alternatives considered
- The actual tradeoff being made

**Prompt frame:** "What are we actually choosing between?"

---

## When to Run

Run this skill directly, or from your orchestrating skill if you run a multi-skill design-system workflow, when the request is a specific design system change with real tradeoffs:

| Trigger | What the user might say |
|---------|-------------------------|
| **New component API design** | "Create a Modal component", "what should the Tabs API look like?" |
| **Breaking changes** | "Rename `isDisabled` to `disabled`", "is this a breaking change?" |
| **Token architecture changes** | "Add a new color scale", "sanity-check this token change" |
| **Pattern decisions** | "Should Button be polymorphic?", "pros and cons of this API" |
| **Ambiguous requirements** | "Make the Card more flexible" |
| **Risk check before a build** | "What are the risks before we build X?", "should we..." |

### Skip for
- Adding a prop to an existing component (routine)
- Styling tweaks within existing tokens
- Bug fixes
- Documentation-only updates

### Not this skill
Open-ended product or design brainstorming, stress-testing a strategy, or devil's advocate on an idea that isn't a specific design system change: use `design-lead-thought-partner`.

---

## Verdicts

Use one set of four verdicts everywhere: the advisory file, the summary to the user, and memory.

| Verdict | Slug | Use when |
|---------|------|----------|
| Proceed | `proceed` | The upside is clear and the risks are known and small |
| Proceed with caution | `proceed-with-caution` | Worth doing with a named scope limit or safeguard |
| Needs discussion | `needs-discussion` | The call depends on a decision only the user can make |
| Defer | `defer` | Not worth doing now; say what would change that |

---

## Output Format

Write the Perspectives as section 0 of `_design_task.md`, ahead of any other sections (or show it inline):

```markdown
## 0. Perspectives (Pre-Build Analysis)
**Request:** [Original user request]
**Decision:** [Awaiting Confirmation | Confirmed | Skipped]

### Positive
[2-4 bullet points on benefits and opportunities]

### Negative
[2-4 bullet points on risks and concerns]

### Neutral
[2-3 bullet points synthesizing the tradeoff]
**Recommendation:** [Proceed | Proceed with caution | Needs discussion | Defer] — [one line on why]

---
```

---

## Execution Flow

```
User Request
     │
     ▼
[ Orchestrator / you ]
     │
     ├─── Routine request? ──────────► Proceed to the build step
     │
     └─── Risky/ambiguous? ──────────► Invoke /design-system-perspectives
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                        [Positive]      [Negative]      [Neutral]
                              │               │               │
                              └───────────────┼───────────────┘
                                              ▼
                              Write to _design_task.md (or inline)
                                              │
                                              ▼
                              Present to user for confirmation
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                      [User confirms]                [User adjusts]
                              │                               │
                              ▼                               ▼
                      Proceed to the build step       Re-evaluate
```

---

## Steps

1. **Read** the user's original request from context or `_design_task.md`

2. **Run all three perspectives** sequentially:
   - Positive first (what's the upside?)
   - Negative second (what's the risk?)
   - Neutral last (what's the actual tradeoff?)

3. **Check for unknowns that would flip the call** (see below) and ask about them, if any, before finalizing

4. **Write** the Perspectives section to `_design_task.md`, or show it inline
   - Set `Decision: Awaiting Confirmation`

5. **Present** a summary to the user:
   ```
   Three perspectives before I build:

   Upside: [1-line summary]
   Risk: [1-line summary]
   Tradeoff: [1-line summary]

   Recommendation: [Proceed | Proceed with caution | Needs discussion | Defer]

   Should I continue with the build?
   ```

6. **Wait** for the user's go-ahead before handing off to the build step

7. **On confirmation:** Update `Decision: Confirmed` and return control to the build step (or your orchestrator)

---

## Constraints

- **Advisory only:** This skill doesn't modify `.tsx` or `.mdx` files; the advisory is the whole output
- **No blocking:** If the user says "skip perspectives," respect that, set `Decision: Skipped`, and proceed
- **Brevity:** Each perspective is 2-4 bullet points (Neutral 2-3), not essays; a long advisory doesn't get read
- **Disagreement is valid:** Don't force consensus between perspectives
- **No invented risks or numbers:** Only flag concerns grounded in the actual request, and cite a source for any browser-support or usage claim

## Unknowns That Would Flip the Call

Generic tradeoffs without the user's context are noise, but stopping to ask about every unknown turns the advisory into a questionnaire. Ask only about the unknowns that would change the recommendation:

- For each unknown, ask yourself: if the answer went the other way, would the recommendation change? If yes, it's **blocking**. If not, make a reasonable assumption, state it in the advisory, and move on.
- Ask at most three blocking unknowns, together in one message, before finalizing. If more seem blocking, ask the three with the biggest effect and state assumptions for the rest.
- If none are blocking, finalize without asking.

Typical blocking unknowns: "Will you maintain this alone or hand it to a team?" when the maintenance risk decides between Proceed and Defer. "Are you already using a positioning library elsewhere?" when the Neutral tradeoff hinges on adding a dependency.

Record them in `_design_task.md` (skip this block when showing the advisory inline):

```yaml
honesty:
  agent: perspectives
  assumptions:
    - "Treated 'maintain for the foreseeable future' as a 1+ year horizon"
  resolved_questions:
    - q: "Are you using a positioning library elsewhere, or would this be the first dependency?"
      asked_at: 2026-05-14T15:10Z
      answered: "First dependency, but I'm considering it for Popover too."
      answered_at: 2026-05-14T15:11Z
  pending_questions: []                  # non-empty: wait for answers before finalizing
```

---

## Example Output

**Request:** "Create a new Tooltip component with arrow positioning"

```markdown
## 0. Perspectives (Pre-Build Analysis)
**Request:** Create a new Tooltip component with arrow positioning
**Decision:** Awaiting Confirmation

### Positive
- Fills a gap: contextual help for form fields, table headers and icon-only buttons
- The native Popover API (Baseline since January 2025) puts the tooltip in the top layer, so it no longer fights Modal and Dropdown over z-index
- One shared component keeps hover delay, Escape-to-dismiss and focus behavior consistent everywhere

### Negative
- Tooltips fall under WCAG 2.2 SC 1.4.13 Content on Hover or Focus (AA): dismissible, hoverable and persistent, which needs testing at every placement
- CSS anchor positioning only became Baseline in January 2026; anyone you support on an older browser needs a fallback placement
- Scope creep: "add a click mode" or "allow links inside" turns a tooltip into a popover or toggletip with different semantics

### Neutral
- The choice is three-way: native (Popover API plus anchor positioning: least code, newest support), library (Floating UI: mature collision handling, adds a dependency), or custom positioning (full control, most maintenance)
- The deciding constraint is your oldest supported browser: if it predates anchor positioning, use the library or native with a fallback
**Recommendation:** Proceed with caution — ship top/right/bottom/left placements with the 1.4.13 behaviors first, and pick native vs. library once browser support is confirmed
```

Browser-support dates come from MDN (Popover API) and web.dev (anchor positioning). Recheck them before reusing this example; Baseline status changes, and some anchor-positioning properties reached Baseline later than the core feature.

---

## Memory (optional)

If your setup has a persistent memory tool (an MCP memory server or similar), recall prior advisories on the same decision topic before running the three perspectives, and save the verdict afterward.

### Recall first

Before running the three perspectives, search memory for prior advisories on the same decision topic (e.g. query: `perspectives <decision-topic> <component-or-system>`).

If a prior advisory exists, **lead with it.** State the prior recommendation, ask whether the constraints have changed, and only re-run the three perspectives if there's new information. A prior advisory with unchanged constraints beats re-deriving one.

### Remember after

At the end of every advisory run (regardless of recommendation), save the verdict:

```
{
  content: "Perspectives on <decision-topic>: <one-line recommendation>. Key tradeoff: <X vs Y>. Confidence: <high/medium/low>.",
  tags: ["perspectives", "<topic-slug>", "<project>"],
  metadata: {
    skill: "design-system-perspectives",
    project: "<project>",
    decision_topic: "<topic>",
    recommendation: "proceed" | "proceed-with-caution" | "needs-discussion" | "defer",
    positive: "<one line>",
    negative: "<one line>",
    neutral: "<one line>",
    key_tradeoffs: ["<...>"],
    confidence: "high" | "medium" | "low",
    advisory_date: "<ISO date>"
  }
}
```

Save "defer" and "needs-discussion" verdicts too; they are valuable for future decisions. Especially save when an advisory is overturned later, and capture *why* the constraints changed.
