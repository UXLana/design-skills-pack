---
name: visual-qa
description: Verify UI changes by actually rendering them. Opens the page in a browser tool or Playwright, checks desktop and mobile widths (including 320px reflow), and drives the primary interaction with mouse and keyboard. Looks at loading, empty and error states and the console, takes screenshots, and gives a PASS / WARN / BLOCK verdict that is never based on reading code alone. Use when the user asks for visual QA, /visual-qa, "check it in the browser", "screenshot check", "does this look right?", "check mobile and desktop", or after frontend changes to layout, interaction, responsive behavior or visual state. Not for a code scan of layout patterns (responsive-audit), finding missing states (ui-edge-case-audit) or a WCAG audit (design-accessibility).
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
3. Open the UI with a browser tool (a built-in browser, a Chrome extension, or a Playwright MCP server). If none is connected, use the Playwright fallback below.
4. Check at least:
   - desktop width
   - mobile width around 390px
   - 320px width with no sideways page scroll (WCAG 2.2 SC 1.4.10 Reflow)
   - the primary interaction, with the mouse and then with the keyboard only
   - loading/empty/error state if available
5. Capture screenshots when the tool supports it.
6. Report visible defects and whether they were fixed.

## Checks

- Text does not overflow or overlap, including at 200% browser zoom (WCAG 1.4.4).
- Buttons and controls have stable dimensions.
- Keyboard: Tab order follows the visual order, focus is always visible, Esc closes dialogs and menus, and focus returns to the control that opened them.
- Important content is not hidden below folds, clipped, or covered.
- Responsive layout stacks intentionally.
- Images/canvas/media render, are not blank, and are framed correctly.
- Error and empty states are usable.
- The browser console shows no errors and no failed requests for the changed surface.
- If the UI supports them, reduced motion (`prefers-reduced-motion`) and dark mode still look right.
- UI copy is real and domain-appropriate, not placeholder filler.

## Playwright fallback (no browser tool connected)

Install a browser once with `npx playwright install chromium`, then run a short script from the project (save it as `visual-qa.mjs` and run `node visual-qa.mjs`; requires `playwright` in the project or installed with `npm i -D playwright`):

```js
import { chromium } from 'playwright';
const url = process.argv[2] ?? 'http://localhost:5173/';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', m => m.type() === 'error' && console.log('console error:', m.text()));
for (const [w, h] of [[1440, 900], [390, 844], [320, 640]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `qa-${w}.png`, fullPage: true });
}
await browser.close();
```

Then view the screenshots. If nothing can render the page, report that; the verdict cannot be PASS.

## Output format

```markdown
## Visual QA

Verdict: PASS | WARN | BLOCK

### Surfaces checked
| Surface | Viewport | Result |
|---|---|---|

### Interactions checked
- <interaction> (mouse / keyboard): PASS/WARN/BLOCK

### Findings
- <file/route, issue, recommendation>

### Evidence
- Screenshot(s): <paths or note if unavailable>
- Console: <clean, or the errors seen>

### Unverified
- <anything not checked>
```

## Verdict rules

- **BLOCK:** blank screen, broken primary interaction, unreadable/overlapping text, inaccessible modal/focus trap, a keyboard dead end, or severe mobile breakage (including sideways page scroll at 320px).
- **WARN:** cosmetic issue, console errors that don't break the surface, untested secondary state, minor responsive concern.
- **PASS:** key surfaces and interactions were checked and no material issues were found.

## Rules

- Do not claim visual verification from code inspection alone.
- Do not use the operating system's "open in browser" command as a substitute for a browser tool or Playwright; you can't see or drive what it opens.
- If a dev server cannot start, report that clearly and do not emit PASS.
- If you track work through a pipeline or status board, record the verdict and screenshot paths there; never record PASS from code inspection alone.
