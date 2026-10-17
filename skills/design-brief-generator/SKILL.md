---
name: design-brief-generator
description: 'Run upstream design discovery and produce a design brief: problem (5 Ws), users and tasks, business value, Lean UX hypothesis and riskiest assumption, scope, constraints (including accessibility target), risks, and success metrics, with every gap marked TBD. Two modes: guided discovery (asks one section at a time) or synthesis (turns intake-form answers, Slack threads or kickoff notes into a brief). Also produces an async intake form. Use when the user says "write a design brief", "project kickoff", "discovery questions", "intake form for this request", "what problem are we solving", "brief from these notes", or is starting a UX project before a solution is chosen. Not for a build-ready feature spec or acceptance criteria (use intent-spec or spec-pack), and not for capturing what a sync decided vs. left open (use requirements-to-decision-doc).'
---

# Design Brief Generator

Run upstream design discovery and produce a structured design brief before anyone commits to a solution. Two modes: guided discovery (interactive Q&A) or synthesis (process existing inputs).

## Where this fits

The brief captures *why*, *for whom* and *what success looks like*, and marks every gap TBD. It is deliberately not a build spec. When the team is ready to build, hand off:

- Build-ready feature spec and acceptance criteria → `intent-spec` or `spec-pack`
- What a meeting decided vs. left open → `requirements-to-decision-doc`

## Workflow

1. **Determine mode:**
   - **Guided discovery?** → Walk through the question set, one section per turn (see Pacing)
   - **Synthesis mode?** → User provides existing inputs (form responses, notes, Slack threads) → Extract and organize into the brief, then ask only about required sections that are still empty
   - **Async intake form requested?** → Read `references/intake-form.md` and produce the form

2. **Gather information** using the question set below

3. **Generate the brief** using the template in `references/prd-template.md`

4. **Offer the hand-off** — name the spec skill that comes next

## Pacing (guided mode)

The full set is about 40 questions. Asked all at once, people skim and answer only the easy ones, so:

- Ask one section per turn, at most four questions. Split a longer section (Constraints) across two turns.
- **Required:** Problem Statement, Users & Tasks, Scope, Success. Everything else is optional: offer it in one line ("Want to cover stakeholders and risks now, or mark them TBD?") and move on if declined.
- Skip questions already answered. When you can infer an answer, state it and let the user correct it rather than asking again.
- If Constraints is skipped, still record the accessibility target as WCAG 2.2 AA (assumed), so it reaches the brief.

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
- **Primary users** — Who is this for? (Customers, admins, internal staff, partners, support agents?)
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
- **Accessibility target** — WCAG 2.2 AA unless the user names another. Public-sector work can add a legal standard: Section 508 for US federal agencies (it incorporates WCAG 2.0 AA) or ADA Title II for US state and local governments (WCAG 2.1 AA). Ask which applies, and whether any known users rely on assistive technology.
- **Compliance/regulatory** — Legal or regulatory requirements that apply?
  - *Only if rules differ by region:* which jurisdictions or markets are in scope?
- **Technology** — What's the current tech stack? Any limitations or integration requirements?
- **Platform** — Web, mobile, both? Browser requirements? Offline needs?
- **Timeline** — When does this need to ship? Hard deadlines?
- **Resources** — Budget or staffing constraints?

### Risks
- **Known risks** — What could go wrong? (Design, technical, adoption, compliance?)
- **Dependencies** — What else needs to happen for this to succeed? What's on the critical path?
- **Mitigation** — How might we reduce the biggest risks?

### Success
- **Definition of done** — How do we know this is "finished"? (Include the accessibility target.)
- **Success metrics** — What will we measure? (Adoption, task completion, error reduction, support tickets?)
- **Baseline** — Current state we're improving from? (Include numbers if available)
- **Target** — What does success look like quantitatively?

### Context & Inputs
- **Existing research** — Data, user feedback, or insights available?
- **Comparables** — Competitors or products that do this well?
- **Previous attempts** — Has this been tried before? What happened?
- **Links** — Relevant docs, Jira tickets, Figma files, Slack threads?

## Output

After gathering information, generate the brief using the template in `references/prd-template.md`. The brief serves:

1. **Stakeholder alignment** — A shareable artifact for a PM/eng/design sync
2. **Gap identification** — Missing information flagged explicitly
3. **Hand-off** — Seed criteria and a short "For the build agent" note, so the spec stage starts from the brief instead of re-asking

## Handling Incomplete Information

If information is missing:
- Generate what you can
- Add `[TBD]` placeholders with specific questions to resolve
- Include a "Gaps to Resolve" section at the end listing open questions

## Reference Files

- `references/prd-template.md` — The brief template. Read it when generating the brief.
- `references/intake-form.md` — Async intake form fields. Read it only when the user asks for a form to send out.
