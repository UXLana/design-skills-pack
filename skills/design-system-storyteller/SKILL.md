---
name: design-system-storyteller
description: Write realistic, production-quality usage examples for the active design system components. Triggered when a docs audit finds [MISSING EXAMPLE] flags in .mdx docs, or directly when a component needs examples. Use when components need usage stories, copy, or realistic data rather than "Lorem ipsum". Triggers on "write examples", "add stories", "component examples", "usage examples", "missing example", or any request to populate component documentation with real-world scenarios.
---

# Design System Storyteller

Writes usage examples that show components in realistic, production contexts.

## What It Does

- Reads `_design_task.md` to understand the component
- Finds all `[MISSING EXAMPLE]` flags left by a docs audit
- Writes examples using realistic data (not "Lorem ipsum" or "Click me")
- Writes the WHY, not just the HOW
- Covers all key variants: default, edge cases, error states, empty states

## Realistic Data Principles

- Use domain-specific copy appropriate to the active design system's context
- Real names, real statuses, real error messages
- Edge cases: long names, empty states, loading states
- Accessibility context: labels that make sense to screen readers

## Example Output Format (written to .mdx)

```mdx
## Usage

### Basic Usage
<ComponentPlayground>
  <Button variant="primary">Submit Transfer</Button>
</ComponentPlayground>

### With Long Label (edge case)
<ComponentPlayground>
  <Button variant="primary">Submit Manifest for Interstate Transfer Review</Button>
</ComponentPlayground>

### Error State
<ComponentPlayground>
  <Button variant="destructive" disabled>Void License (Irreversible)</Button>
</ComponentPlayground>

### When to Use
Use the primary button for the single most important action on a page — 
typically the compliance submission or confirmation action.

### When NOT to Use
Don't use multiple primary buttons on the same page. Use `secondary` for 
supporting actions.
```

## Integration

A docs audit flags missing examples → **this skill fills them** → your QA/review step validates

Storyteller writes back to:
1. `.mdx` documentation file
2. `_design_task.md` (marks examples as complete)

Then hands off to your QA/review step for final checks.

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before writing any example, enumerate your assumptions and unknowns about the component.

For each unknown, classify stakes:

- **high** — guessing wrong produces broken code, wrong tokens, false a11y claims, or off-brand copy. Examples: "does prop X exist?", "what's the actual production label for this action?", "is this destructive copy accurate to the real domain?", "is this ARIA role correct for the variant?"
- **low** — stylistic choices, formatting decisions, minor copy variants. Decide, log as an assumption, move on.

If any unknown is `high`, **stop**. Append it to `_design_task.md` under `honesty.pending_questions`, then surface the questions to the user in the conversation as a numbered list. Do **not** write examples until the user answers.

When the user answers, move the resolved question to `honesty.resolved_questions` with the answer + timestamp, then continue.

Schema appended to `_design_task.md`:

```yaml
honesty:
  agent: storyteller
  assumptions:                       # low-stakes decisions you made on your own
    - "Used 'Submit' as the default primary button label"
  resolved_questions:                # answered in this or prior runs (append-only log)
    - q: "Does Button have size='sm'?"
      asked_at: 2026-05-14T15:32Z
      answered: "md and lg only — sm deprecated in 1.1"
      answered_at: 2026-05-14T15:33Z
  pending_questions:                 # currently blocking; non-empty = halt
    - q: "When destructive=true, should focus ring color also change?"
      stakes: high
      why: "If wrong, the destructive example misrepresents focus state — affects a11y + brand consistency."
```

Pending questions block output. Resolved questions stay in the file as the audit trail.

The rubric is load-bearing: be sharp. Classify generously as `high` for anything touching props, tokens, accessibility, or copy that represents a real product action. Classify as `low` only for genuinely cosmetic choices (which adjective to use, exact character count of an edge-case example).
