---
name: intent-spec
description: Interview the user to capture a feature's intent, then turn it into a build-ready spec. Use when they want to spec a feature before coding, hand a rough draft to formalize, or say "spec this up", "help me spec X", "let's write a spec", "flesh out my spec", "turn this into a real spec", "make this build-ready", "I wrote a rough spec". Runs a GUIDED INTERVIEW — one question at a time, waiting for each answer before the next — covering goal, locked decisions, flow, scenarios, acceptance criteria. The user owns the opinionated layer; the skill adds the mechanical layers (scope, edge cases, states, a11y, test plan) WITHOUT relitigating their decisions or demanding reproduction-level detail. Forward-only — for specs before a build. To reverse-engineer a spec FROM existing code, use spec-pack's Reverse mode instead.
---

# intent-spec

The user writes the **intent layer** — the opinionated design calls only a human can
make. This skill turns that one-page draft into a **build-ready spec**, adding the
mechanical layers an agent can derive, without rewriting their decisions or asking
them for detail that only exists after the build.

This is the design → engineering handoff: intent in, build-ready spec out. It
sits upstream of `spec-pack` (the quality-pipeline gate) and the builder (an
agent or build/review loop). It is forward-only.

```text
The user's intent (1 page)  ─►  intent-spec improve pass  ─►  build-ready spec  ─►  build
```

## When to use

- The user wants to spec a feature before a build and would rather be *asked* than
  face a blank page.
- They hand over a rough spec, draft, bullet list, or paragraph and want it made
  build-ready (parse it, then interview only the gaps).
- They say "help me spec X", "let's write a spec", "spec this up", "improve my
  spec", "flesh this out", "make this build-ready".
- Before a non-trivial build, when the design calls are settled (or nearly) but
  the spec isn't formalized.

**Do NOT use** to reverse-engineer a spec from existing code — that's a
reproduction spec, and `spec-pack` Reverse mode owns it. The detail levels are
opposite: reproduction specs quote every string; intent specs deliberately don't.

## The division of labor (the core idea)

A spec has two layers. They have different authors and must not be confused.

| Layer | Who writes it | What it is |
|---|---|---|
| **Intent** | **The user** | The opinionated calls: what we're building and why, the locked design decisions, what "done" looks like. ~1 page. The part only a human can make. |
| **Mechanical** | **This skill** | The derivable elaboration: scope/files, formalized rules, edge cases, states, accessibility, test plan, handoff prompt. |

The intent layer is small on purpose. Verbatim copy strings, exhaustive fixture
tables, every edge case — those are *outputs of building and iterating*, not
inputs. Never ask the user to write them. (If a finished feature ever needs that
level of detail captured, that's a reproduction spec — different tool.)

## How it works — guided interview (the default)

**Do not hand the user a blank template to fill in. Interview them — one question at a
time.** Ask a question, WAIT for their answer, acknowledge it in a sentence, then
ask the next. Never batch questions; never paste the whole list. Capturing intent
is a conversation, not a form.

Walk the questions below in order. Each maps to one section of the intent layer.

1. **Goal** — "In a sentence or two: what are we building, and why?"
2. **Locked decisions** — "What design calls are already settled — the things you
   do *not* want relitigated? Give me one, and the reason behind it if there is
   one." Then **loop**: "Any others?" — keep asking until they say that's all.
   One decision per turn.
3. **Flow / shape** — "Walk me through the rough flow — the screens or steps, in
   order. A sketch in words is fine."
4. **Scenarios** — "What cases are worth covering? (e.g. 'one clean, two blocked
   for different reasons.') Or say skip if it's not that kind of feature."
5. **Acceptance criteria** — "What would you click through to believe it works?
   Give me the observable checks, in your own words — one at a time is fine."

Rules for the interview:
- **One question per turn. Always wait for the answer.** If they answer two at
  once, great — acknowledge both and skip ahead; don't re-ask.
- **Acknowledge, then advance.** A short reflect-back ("Got it — exception-first,
  no side-by-side.") before the next question, so they can correct you live.
- **Adapt.** Skip a question their earlier answer already covered; branch into a
  sub-question when an answer is ambiguous in a way that changes the build. Don't
  interrogate past what's needed — when the intent is clear, stop and move on.
- **Don't lead.** Ask for their calls; don't propose the feature for them. Offer a
  default only if they're stuck, and mark it as yours.
- **Let them short-circuit.** If they say "that's enough, go," stop interviewing
  and run the improve pass with what you have, listing what's still open.

**If they paste a draft instead of starting cold**, parse it against the five
sections, then interview ONLY the gaps — still one question at a time.

After the interview, restate the captured intent compactly for a yes/no
confirm, then run the improve pass.

### The intent layer being captured

```markdown
# <feature name>
## Goal            — one or two sentences: what changes and why
## Locked decisions — the calls not to relitigate, each with its "because…"
## Flow / shape    — the rough sequence of screens or steps
## Scenarios       — the cases worth covering (optional)
## Acceptance      — observable checks, in their words
```

## The improve pass — what this skill adds

Read the repo enough to ground it (existing patterns, likely files, the design
system in play), then produce a build-ready spec by **keeping the user's intent
verbatim** and adding around it:

- **Scope** — likely files/modules in and out, mapped to real paths.
- **Existing patterns to preserve** — conventions, primitives, commands the
  build must follow (pull from the repo, not from memory).
- **Formalized rules** — turn each locked decision and acceptance criterion into
  precise, testable statements (thresholds, order of operations, conditions).
- **Edge cases & states** — empty / loading / error / overflow / null / the
  unhappy paths the user's happy-path list implies but doesn't enumerate.
- **Accessibility, privacy, compliance** — keyboard, screen reader,
  contrast/focus, data/privacy, regulated-domain risk (non-negotiable for regulated compliance workflows).
- **Test & verification plan** — unit / integration / visual / manual / repo
  health command.
- **Open questions** — anything their draft left genuinely ambiguous, as a small
  numbered list. Ask only what changes the build; assume sensible defaults for
  the rest and say so.
- **Agent handoff prompt** — a concise builder prompt.

Output format is the `spec-pack` template (so it flows straight into the gate),
populated from their intent.

## Sovereignty rule (do not violate)

- **The user's locked decisions and acceptance criteria are theirs.** Formalize, scope,
  and stress-test them — never quietly rewrite, "improve," or relitigate them. If
  one looks risky, *flag it as an open question*; don't change it.
- **Never demand reproduction-level detail from the human.** No request for
  verbatim copy, full fixture tables, or per-pixel styling. If the build needs a
  string they didn't specify, draft a sensible one and mark it as proposed.
- **The intent stays readable in the output.** Their words survive as the spec's
  spine; the mechanical layer wraps them, it doesn't replace them.

## Stop conditions

- A locked decision and an acceptance criterion contradict each other → surface
  it, ask which wins.
- The intent implies an architecture decision bigger than the feature → name it
  before speccing.
- The repo hasn't been read, so "likely files" would be a guess → read first.

## Handoff

Once the user approves the improved spec, it is a normal spec-pack artifact:
update the `spec_pack` gate (see `spec-pack`), then hand to the builder.

Builder prompt must say:

```text
Implement only the approved spec. Keep the diff small. Follow existing local patterns. Add or update tests for changed behavior. Do not refactor unrelated code.
```
