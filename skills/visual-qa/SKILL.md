---
name: visual-qa
description: Verify local UI changes with Browser or Playwright screenshots and interaction checks. Use when the user asks for /visual-qa, visual QA, screenshot check, browser verify, inspect the UI, check mobile/desktop, or after frontend changes that affect layout, interaction, responsive behavior, or visual state.
---

# visual-qa

Verify that UI changes actually render and behave correctly. Static code review is not enough for user-facing UI.

## When to use

Use after frontend changes involving:

- layout, spacing, responsive behavior, or overflow
- interactive controls, dialogs, menus, forms, tables, tabs, or drawers
- charts, images, generated assets, canvas, or 3D scenes
- loading, empty, error, permission, or disabled states

## Workflow

1. Identify the changed route or component surface.
2. Start or reuse the local dev server when needed.
3. Open the UI with Browser or Playwright.
4. Check at least:
   - desktop width
   - mobile width around 360-390px
   - the primary interaction
   - loading/empty/error state if available
5. Capture screenshots when the tool supports it.
6. Report visible defects and whether they were fixed.

## Checks

- Text does not overflow or overlap.
- Buttons and controls have stable dimensions.
- Keyboard focus is visible and logical.
- Important content is not hidden below folds, clipped, or covered.
- Responsive layout stacks intentionally.
- Images/canvas/media render, are not blank, and are framed correctly.
- Error and empty states are usable.
- UI copy is real and domain-appropriate, not placeholder filler.

## Output format

```markdown
## Visual QA

Verdict: PASS | WARN | BLOCK

### Surfaces checked
| Surface | Viewport | Result |
|---|---|---|

### Interactions checked
- <interaction>: PASS/WARN/BLOCK

### Findings
- <file/route, issue, recommendation>

### Evidence
- Screenshot(s): <paths or note if unavailable>

### Unverified
- <anything not checked>
```

## Verdict rules

- **BLOCK:** blank screen, broken primary interaction, unreadable/overlapping text, inaccessible modal/focus trap, or severe mobile breakage.
- **WARN:** cosmetic issue, untested secondary state, minor responsive concern.
- **PASS:** key surfaces and interactions were checked and no material issues were found.

## Rules

- Do not claim visual verification from code inspection alone.
- Do not use macOS `open` as a substitute for Browser/Playwright when the Browser plugin is available.
- If a dev server cannot start, report that clearly and do not emit PASS.

## Pipeline status

This skill contributes to the **`verify`** gate. If you keep a pipeline status artifact (for example `.ai-pipeline/status.json` and its regenerated `.md` mirror), update it after visual QA, following your pipeline's status contract.

Gate mapping:

- Set `verify` → `in_progress` with `owner: "Visual QA"` if it is still `todo`.
- Add evidence under the `verify` gate: one `type: "screenshot"` entry per captured screenshot with `ref` = the file path, plus a `type: "note"` entry naming the route/viewport when no screenshot tool is available.
- Verdict → status: `PASS` keeps `verify` on track to `done` (the verifier closes it once all verify-stage checks pass); `WARN` adds residual risk to `summary`; `BLOCK` sets `verify` → `blocked` with a `blockers[]` entry.
- Never record screenshot evidence or PASS from code inspection alone — only from an actual Browser/Playwright run.

If you keep a status board, update it through the board's own workflow; otherwise write the artifact directly.
