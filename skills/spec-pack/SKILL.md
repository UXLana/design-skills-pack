---
name: spec-pack
description: 'Write a lightweight spec contract before non-trivial AI-assisted coding. It covers goal, non-goals, files in scope, observable acceptance criteria, states and edge cases, accessibility and privacy, a test plan, open questions and a builder prompt, and stops while a high-stakes unknown remains. Use when the user asks for a dev spec, spec pack, implementation plan before coding, or acceptance criteria. Reverse mode reverse-engineers a reproduction-grade spec from an existing feature or prototype ("spec what we built", "reverse spec", "spec the end-result", "spec for regenerating X", "document this as a contract") and verifies it against the code. For an interview-led spec from a rough idea or draft, use intent-spec.'
---

# spec-pack

Create a concise spec contract before implementation, so the builder (you, another agent,
or a person) works from agreed, checkable criteria instead of reinterpreting the task.

## When to use

Use this before non-trivial code work, especially:

- New or changed behavior
- Public UI changes
- Data model, parsing, scraping, storage, or automation changes
- Design-system components, tokens, themes, or docs
- Accessibility, privacy, security, or regulated-domain work
- Work that will be handed to another agent (a builder or build/review loop)

Skip for tiny edits such as typo fixes, one-line copy changes, or read-only code explanation.

**When the user hands a rough draft to formalize**, that's the `intent-spec` handoff
— their locked decisions and acceptance criteria are the sovereign intent layer
and don't get relitigated; the improve pass adds scope, edge cases, a11y, and the
test plan, and must never demand reproduction-level detail (verbatim copy,
fixture tables, per-pixel styling) from the human. Route there; its output uses the
template below.

## Workflow

1. If your setup has a persistent memory tool, recall relevant prior decisions for the topic if the work is non-trivial.
2. Read the repo enough to identify existing patterns and likely files in scope.
3. Draft the spec using the template below.
4. Mark unknowns in **Assumptions & open questions** as either low-stakes assumptions or high-stakes blockers.
5. Stop before implementation if high-stakes blockers remain.
6. If the user approves the spec, hand it to the builder agent or build/review loop.

## Required output

```markdown
# Spec Pack: <short name>

## Goal
<What should change and why.>

## Users & context
<Who uses this, what they are trying to do, and where it sits in the product.>

## Locked decisions
- <Decision the build must not relitigate> — because <reason>. (Omit the section if there are none.)

## Non-goals
- <What this work should not touch.>

## Existing patterns to preserve
- <Files, functions, components, conventions, commands, or workflows to follow.>

## Scope
Likely in scope:
- <file/module/workflow>

Out of scope:
- <file/module/workflow>

## Rules
- <Each behavior rule as a precise, testable statement: thresholds, order of operations, conditions.>

## States & edge cases
- Empty / loading / error / overflow / null / permission: <what each looks like or does>
- <Unhappy paths the happy path implies but doesn't name>

## Acceptance criteria
- [ ] <observable behavior>
- [ ] <observable behavior>
- [ ] <observable behavior>

## Accessibility, privacy, and compliance
- Target: WCAG 2.2 AA, unless the contract names another standard (Section 508 = WCAG 2.0 AA, ADA Title II = WCAG 2.1 AA, EN 301 549 / European Accessibility Act).
- Keyboard:
- Screen reader:
- Contrast/focus:
- Data/privacy:
- Regulated-domain risk:

## Test and verification plan
- Unit:
- Integration:
- Visual/browser:
- Manual:
- Repo health command:

## Assumptions & open questions
- Assumption (low-stakes): <default taken, so the build can proceed>
- Blocker (high-stakes): <question that must be answered before building>

## Review rubric
- What would make this unsafe to ship?
- What would count as over-engineering?
- What assumptions must be verified?

## Agent handoff prompt
<A concise prompt a builder agent can execute without reinterpreting the task.>
```

## Reverse mode — reproduction specs for existing features

Forward mode (above) writes the contract *before* the build. Reverse mode writes
it *after*: a spec extracted from an existing feature or prototype, precise
enough that an agent given only the spec would rebuild what exists today.
Use when the user says "spec what we built", "reverse-engineer a spec",
"spec the end-result", "document this prototype as a contract", or wants a
regeneration-grade record before a port, rewrite, or handoff.

Reference exemplar: an audit-hardened `SPEC.md` kept beside the feature it describes
(e.g. `frontend/src/prototypes/<feature>/SPEC.md`).

### Process

1. **Recall first.** Persistent memory or project notes, if you have them: confirm which feature is the target and
   collect locked design decisions and their rationale before reading code.
2. **Read every file** in the feature — including uncommitted working-tree
   state — plus its registration/entry point (route, registry, nav) and any
   shared components it depends on.
3. **Draft** using the forward template PLUS the reproduction sections below.
4. **Test the spec** with two parallel adversarial subagents:
   - *Spec → code*: verify every claim — numerics (re-derive arithmetic from the
     spec's own data), quoted copy, behavioral conditions, component/prop usage.
     Report only contradictions.
   - *Code → spec*: sweep the implementation for anything the spec omits that
     would make a blind rebuild observably diverge — copy, conditional
     rendering, edge semantics, data identity, shared-component behavior.

   If subagents aren't available (for example in Claude.ai), run the two passes
   yourself, one after the other, and say so in the header's verification stamp.
5. **Patch all findings** into the spec; stamp the header with the verification
   date and method.
6. **Gold standard (optional, expensive):** blind rebuild from the spec alone in
   an isolated worktree (delete the feature there first), then behavioral diff
   against the real implementation.

### Extra sections for a reproduction spec

- **Header note** — extraction date, source state (commit or working tree),
  verification stamp.
- **Locked design decisions ("do not relitigate")** — each with its why, so a
  rebuilder can't wander into rejected alternatives.
- **Domain model + pure-logic contract** — types, every rule/threshold/priority
  order, formulas with explicit order of operations.
- **Data/fixtures, complete** — a table of every record and seed value that
  affects what renders or which states are reachable; flag load-bearing fields.
- **Per-surface behavior contracts** — component by component, screen by screen.

### Reproduction rules (the failure modes audits actually catch)

1. **Quote ALL user-visible copy verbatim** — headlines AND subordinate text,
   empty states, snackbars, placeholders, tooltips, aria-labels, gallery/registry
   descriptions. Ellipses are not reproducible: give full template strings,
   including the singular/plural matrix.
2. **Pin identity data** — names, units, dates, identifiers in fixtures surface
   in UI strings (exception titles, document lines); unspecified = divergent.
3. **State what exists but does NOT render** — dead maps, unused props, defined-
   but-unconsumed metadata. Silence makes a rebuilder over-build.
4. **Null-handling exactly** — "segment omitted when null" is a different render
   from "shows an em dash". Spell out each conditional.
5. **Edge semantics** — idempotency guards, silent no-ops, what clears state and
   what deliberately doesn't, filter-before-count behavior.
6. **Shared dependencies get an observable contract** — or a pinned canonical
   source path. Never assume the rebuilder can see the dependency.
7. **Quirks reproduce as-is** — describe asymmetries and oddities with
   "reproduce exactly, don't fix" so the rebuilder doesn't helpfully upgrade them.
8. **Don't enumerate inline styles** — but DO pin styling that carries design
   identity: accent/color derivations, layout collapse rules, mono-vs-body font
   assignments, breakpoints.
9. **Derived numbers double as acceptance checks** — any count or total the spec
   claims (e.g. "9 of 11 pre-filled") must be re-derivable from the spec's own
   data tables.

## Stop conditions

Do not proceed to implementation when:

- Acceptance criteria are missing or not observable.
- The requested behavior is ambiguous in a way that changes implementation.
- Accessibility, privacy, or compliance requirements are unknown and material.
- The likely files in scope are unknown because the repo has not been read.
- The change appears to require a larger architecture decision.

If a stop condition is hit, ask the smallest clarifying question that unlocks the work.

## Handoff

Builder prompt must say:

```text
Implement only the approved spec. Keep the diff small. Follow existing local patterns. Add or update tests for changed behavior. Do not refactor unrelated code.
```

### If you run a build/review loop (optional)

If a second agent reviews the build, or you track work through gates
(spec → build → review → verify), use these prompts and record the spec there:

- Breaker prompt: "Review this as if you are trying to prevent a brittle codebase. Prioritize bugs, missing tests, accessibility, hidden coupling, stale docs/API assumptions, and places where the implementation merely works by accident."
- Verifier prompt: "Re-run the quality gate. Verify the acceptance criteria one by one. Separate verified facts from assumptions."
- Status: mark the spec step done only when the acceptance criteria are observable and every blocker is resolved; otherwise mark it blocked with the open question. A reverse-mode spec documents shipped work, so it closes the spec step without opening a build step unless a rebuild or port is planned.
