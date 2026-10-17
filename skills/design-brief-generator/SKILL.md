---
name: design-brief-generator
description: Generate structured design briefs and PRDs for UX projects. Use when the user needs to gather project requirements, conduct design discovery, synthesize async inputs (form responses, Slack threads, meeting notes) into a brief, or output a markdown PRD optimized for vibe-coding. Supports both guided discovery (interactive Q&A) and synthesis mode (processing existing inputs).
---

# Design Brief Generator

Generate structured design briefs and PRDs for UX work. Two modes: guided discovery (interactive Q&A) or synthesis (process existing inputs).

## Workflow

1. **Determine mode:**
   - **Guided discovery?** → Walk through questions interactively
   - **Synthesis mode?** → User provides existing inputs (form responses, notes, Slack threads) → Extract and organize into brief

2. **Gather information** using the question set below

3. **Generate PRD** using template in `references/prd-template.md`

## Question Set

Work through these sections. Skip questions already answered. Flag gaps.

### Project Basics
- **Project/feature name** — What are we calling this?
- **Trigger** — What initiated this? (Customer pain, compliance change, internal initiative, leadership request, tech debt?)

### Problem Statement
Use the 5 Ws to define the problem clearly:
- **Who** is experiencing this problem?
- **What** is the problem or unmet need?
- **Where** does it occur? (Context, touchpoint, platform)
- **When** does it happen? (Frequency, conditions)
- **Why** does it matter? (Impact on user, impact on business)

Then synthesize into a user need statement:
> "As a [user type], I need [need/goal] so that [reason/outcome]."

### Users & Tasks
- **Primary users** — Who is this for? (Operators, suppliers, field teams, auditors, regulators, internal ops?)
- **User goal** — What are they trying to accomplish?
- **Primary tasks** — What specific workflows or routine tasks does the user perform to achieve this goal? List the key steps.
- **Pain points** — What's broken or frustrating about their current experience?

### Business Value
- **Business goal** — What business outcome does this support? (Revenue, efficiency, compliance, retention?)
- **Why now** — Why is this a priority right now?
- **Value if solved** — What's the impact on the business if we solve this well?

### Stakeholders & Ownership
- **Requestor** — Who asked for this?
- **Decision-maker** — Who has final sign-off?
- **Team** — Who's involved? (PM, eng lead, other designers, compliance?)

### Hypotheses & Assumptions
Frame beliefs using the Lean UX hypothesis format:
> "We believe [this business outcome] will be achieved if [this user] attains [this benefit] with [this feature/solution]."

- **Key assumptions** — What must be true for this to work?
- **Riskiest assumption** — Which assumption, if wrong, would cause the entire idea to fail?

### Scope
- **Must-haves** — What does the solution absolutely need to do?
- **Nice-to-haves** — What would be great but isn't critical?
- **Out of scope** — What are we explicitly *not* solving?
- **Existing patterns** — Any features or flows we should reference or extend?

### Constraints
- **Compliance/regulatory** — Legal or regulatory requirements that apply?
- **State/jurisdiction** — Which states or markets does this affect?
- **Technology** — What's the current tech stack? Any limitations or integration requirements?
- **Platform** — Web, mobile, both? Browser requirements? Offline needs?
- **Timeline** — When does this need to ship? Hard deadlines?
- **Resources** — Budget or staffing constraints?

### Risks
- **Known risks** — What could go wrong? (Design, technical, adoption, compliance?)
- **Dependencies** — What else needs to happen for this to succeed? What's on the critical path?
- **Mitigation** — How might we reduce the biggest risks?

### Success
- **Definition of done** — How do we know this is "finished"?
- **Success metrics** — What will we measure? (Adoption, task completion, error reduction, support tickets?)
- **Baseline** — Current state we're improving from? (Include numbers if available)
- **Target** — What does success look like quantitatively?

### Context & Inputs
- **Existing research** — Data, user feedback, or insights available?
- **Comparables** — Competitors or products that do this well?
- **Previous attempts** — Has this been tried before? What happened?
- **Links** — Relevant docs, Jira tickets, Figma files, Slack threads?

## Google Form Questions

Use these as form fields for async intake:

```
PROJECT BASICS
1. Project/feature name
2. What initiated this request? (Customer pain point / Compliance change / Internal initiative / Leadership request / Tech debt / Other)

PROBLEM STATEMENT
3. Who is experiencing this problem? (Select all: Operators / Suppliers / Field teams / Auditors / Regulators / Internal ops / Other)
4. What is the problem or unmet need?
5. Where/when does this problem occur? (Context, touchpoint, frequency)
6. Why does this matter? (Impact on user and/or business)

USERS & TASKS
7. What is the user trying to accomplish? (Their goal)
8. What specific tasks or workflows does the user perform today to achieve this goal?
9. What's broken or frustrating about their current experience?

BUSINESS VALUE
10. What business outcome does this support? (Revenue / Efficiency / Compliance / Retention / Other)
11. Why is this a priority right now?

STAKEHOLDERS
12. Who is the requestor?
13. Who has final decision-making authority?
14. Who else is involved? (PM, eng lead, designers, compliance?)

HYPOTHESES & ASSUMPTIONS
15. What do you believe will happen if we solve this? (Complete: "We believe [outcome] will be achieved if [user] attains [benefit] with [solution]")
16. What must be true for this to work? (Key assumptions)
17. Which assumption, if wrong, would cause this to fail?

SCOPE
18. What must the solution do? (Must-haves)
19. What would be nice to have but isn't critical?
20. What is explicitly out of scope?
21. Are there existing features or patterns we should reference?

CONSTRAINTS
22. Any compliance or regulatory requirements?
23. Which states or markets does this affect?
24. What's the current technology stack? Any technical constraints?
25. Platform requirements? (Web / Mobile / Both / Offline support needed?)
26. When does this need to ship? Any hard deadlines?
27. Any budget or staffing constraints?

RISKS
28. What could go wrong? (Design, technical, adoption, compliance risks)
29. What dependencies exist? What else needs to happen for this to succeed?

SUCCESS
30. How will we know this is "done"?
31. What metrics will we measure?
32. What's the current baseline? (Numbers if available)
33. What does success look like? (Target numbers)

CONTEXT
34. Any existing research, data, or user feedback available?
35. Competitors or products that do this well?
36. Has this been tried before? What happened?
37. Links to relevant docs, Jira tickets, Figma files, Slack threads
```

## Output

After gathering information, generate the PRD using the template in `references/prd-template.md`. The output is optimized for:

1. **Vibe-coding** — Clear sections an AI coding assistant can work from
2. **Stakeholder alignment** — Shareable artifact for PM/eng/design sync
3. **Gap identification** — Missing information flagged explicitly

## Handling Incomplete Information

If information is missing:
- Generate what you can
- Add `[TBD]` placeholders with specific questions to resolve
- Include a "Gaps to Resolve" section at the end listing open questions
