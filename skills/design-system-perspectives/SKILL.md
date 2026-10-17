---
name: design-system-perspectives
description: Surface tradeoffs and risks BEFORE committing to design system work. Runs three perspectives (Positive, Negative, Neutral) on ambiguous or risky requests, writes advisory output to _design_task.md, and waits for user confirmation before proceeding. Run it directly, or have your design-system workflow's orchestrator call it, for new component APIs, breaking changes, token architecture changes, or ambiguous requirements.
---

# Design System Perspectives

> **Role:** The Council's Advisors (Angel, Devil, Arbiter) — the advisory seat if you run a multi-skill design-system workflow; works standalone too
> **Purpose:** Surface tradeoffs and risks BEFORE committing to work
> **Output:** Advisory only — does not modify code or documentation

---

## Overview

This skill provides three distinct viewpoints on design system decisions that involve ambiguity, architectural risk, or significant tradeoffs. Each perspective evaluates the same problem independently, and disagreement is preserved — not resolved.

The goal is **clarity about tradeoffs**, not consensus.

---

## The Three Perspectives

### Positive (The Angel)
**Mindset:** Optimistic advocate. Focuses on opportunity.

Evaluates:
- Potential benefits and upside
- Developer experience improvements
- Long-term leverage and reusability
- Velocity gains
- How this enables future work

**Prompt frame:** "What's the best case scenario if we do this well?"

---

### Negative (The Devil)
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

### Neutral (The Arbiter)
**Mindset:** Balanced analyst. Focuses on evidence.

Evaluates:
- Precedent (how have we/others solved this?)
- Constraints (time, tokens, API surface)
- Dependencies and coupling
- Alternatives considered
- The actual tradeoff being made

**Prompt frame:** "What are we actually choosing between?"

---

## Trigger Conditions

Run this skill (directly, or from your orchestrating skill if you run a multi-skill design-system workflow) when the request involves:

| Trigger | Example |
|---------|---------|
| **New component API design** | "Create a Modal component" |
| **Breaking changes** | "Rename `isDisabled` to `disabled`" |
| **Token architecture changes** | "Add a new color scale" |
| **Pattern decisions** | "Should Button support polymorphism?" |
| **Ambiguous requirements** | "Make the Card more flexible" |

### NOT triggered for:
- Adding a prop to existing component (routine)
- Styling tweaks within existing tokens
- Bug fixes
- Documentation-only updates

---

## Output Format

All perspectives write to `_design_task.md` in a new section that appears BEFORE any docs or code audit section:

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
**Recommendation:** [Proceed | Proceed with caution | Needs discussion]

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
     ├─── Routine request? ──────────► Proceed to Workers
     │
     └─── Risky/ambiguous? ──────────► Invoke /design-system-perspectives
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                        [Positive]      [Negative]      [Neutral]
                              │               │               │
                              └───────────────┼───────────────┘
                                              ▼
                              Write to _design_task.md
                                              │
                                              ▼
                              Present to user for confirmation
                                              │
                              ┌───────────────┴───────────────┐
                              ▼                               ▼
                      [User confirms]                [User adjusts]
                              │                               │
                              ▼                               ▼
                      Proceed to Workers              Re-evaluate
```

---

## System Instructions

### When invoked:

1. **Read** the user's original request from context or `_design_task.md`

2. **Run all three perspectives** sequentially:
   - Positive first (what's the upside?)
   - Negative second (what's the risk?)
   - Neutral last (what's the actual tradeoff?)

3. **Write** the Perspectives section to `_design_task.md`
   - Set `Decision: Awaiting Confirmation`

4. **Present** a summary to the user:
   ```
   Before I proceed, here's what the Council sees:

   Upside: [1-line summary]
   Risk: [1-line summary]
   Tradeoff: [1-line summary]

   Recommendation: [Proceed / Proceed with caution / Needs discussion]

   Should I continue with the build?
   ```

5. **Wait** for user confirmation before handing off to Workers

6. **On confirmation:** Update `Decision: Confirmed` and return control to the build step (or your orchestrator)

---

## Constraints

- **Advisory only:** This skill NEVER modifies `.tsx` or `.mdx` files
- **No blocking:** If user says "skip perspectives," respect that and proceed
- **Brevity:** Each perspective should be 2-4 bullet points, not essays
- **Disagreement is valid:** Do not force consensus between perspectives
- **No hallucinated risks:** Only flag concerns grounded in the actual request

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

The whole point of Perspectives is to surface tradeoffs honestly. The protocol formalizes the cases where a perspective *itself* is uncertain.

For each unknown, classify stakes:

- **high** — a perspective is making a claim that depends on context you don't have. Examples: "The Negative perspective flags maintenance burden, but I don't know if you're maintaining this yourself or handing off to a team." "The Neutral perspective recommends wrapping Floating UI, but I don't know if you're already committed to a different positioning library elsewhere." If wrong, the advisory misdirects the decision.
- **low** — minor framing choices (which bullet to lead with, exact wording of the recommendation). Decide, log, move on.

If any unknown is `high`, append it to `_design_task.md` under `honesty.pending_questions` and ask the user before finalizing the advisory. A misdirected advisory is worse than no advisory — it gives the user false confidence in a wrong direction.

Schema appended to `_design_task.md`:

```yaml
honesty:
  agent: perspectives
  assumptions:
    - "Treated 'maintain for the foreseeable future' as a 1+ year horizon"
  resolved_questions:
    - q: "Are you wrapping Floating UI elsewhere, or would this be the first dependency?"
      asked_at: 2026-05-14T15:10Z
      answered: "First dependency — but I'm already considering it for Popover."
      answered_at: 2026-05-14T15:11Z
  pending_questions: []                  # non-empty halts the advisory
```

Special rule for Perspectives: any unknown about **product context, team capacity, or existing commitments** is automatically `high`. The whole value of three-perspective analysis is contextual — generic tradeoffs without your context are noise.

---

## Example Output

**Request:** "Create a new Tooltip component with arrow positioning"

```markdown
## 0. Perspectives (Pre-Build Analysis)
**Request:** Create a new Tooltip component with arrow positioning
**Decision:** Awaiting Confirmation

### Positive
- Fills a documented gap in the component library
- Enables onboarding flows and contextual help patterns
- Arrow positioning provides visual anchoring that improves comprehension
- Reusable across multiple product areas (forms, tables, navigation)

### Negative
- Arrow positioning has 12+ edge cases (viewport boundaries, scroll containers, nested overflow)
- Z-index management will conflict with existing Modal and Dropdown layers
- Maintenance burden: positioning logic is notoriously fragile across browsers
- Risk of scope creep — "just add hover delay" → "just add click mode" → complex state machine

### Neutral
- The core tradeoff: Build custom (full control, matches token system) vs. wrap Radix/Floating UI (faster, battle-tested positioning)
- Precedent: Most mature design systems (Chakra, Radix, MUI) use Floating UI for positioning math
- Constraint: Must work within existing z-index token scale
- Recommendation: Proceed with caution — scope to 4 positions (top/right/bottom/left) for MVP, defer edge cases
```

---

## Memory (optional)

If your setup has a persistent memory tool (an MCP memory server or similar), recall prior advisories on the same decision topic before running the three perspectives, and save the verdict afterward.

### Recall first

Before running the three perspectives, search memory for prior advisories on the same decision topic (e.g. query: `perspectives <decision-topic> <component-or-system>`).

If a prior advisory exists, **lead with it.** State the prior recommendation, ask whether the constraints have changed, and only re-run the three perspectives if there's new information. Council memory > re-derivation.

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
    recommendation: "proceed" | "proceed-with-caution" | "block" | "defer",
    positive: "<one line>",
    negative: "<one line>",
    neutral: "<one line>",
    key_tradeoffs: ["<...>"],
    confidence: "high" | "medium" | "low",
    advisory_date: "<ISO date>"
  }
}
```

Always remember — even "block" and "defer" verdicts are valuable for future decisions. Especially remember when an advisory is overturned later (capture *why* the constraints changed).
