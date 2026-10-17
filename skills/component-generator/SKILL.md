---
name: component-generator
description: Create production-ready React components for the active design system using atomic design principles. Use this skill when building new UI components like buttons, inputs, cards, modals, etc. Generates TypeScript components that build on existing primitives. After creating a component, integrates it with your design system's conventions (exports, docs, inventory).
---

# Component Generator

Create production-ready React components using atomic design, strict token compliance, and accessibility.

## Source-of-Truth Hierarchy

1. **Filesystem** (`/components/`, `/components/index.ts`) — authoritative for what exists
2. **`references/component-inventory.md`** — quick-reference index; update after every creation
3. **`references/component-rules.md`** — canonical patterns (forwardRef, state, focus, ARIA, keyboard, dark mode, compound state, collections, drag-and-drop)
4. **`references/component-templates.md`** — starter templates and composition examples

When conflicts arise, higher-numbered sources defer to lower-numbered sources.

## Atomic Design Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **Atoms** | Single-purpose primitives, broadly reusable | Button, Icon, Input, Label, Badge, ProgressBar |
| **Molecules** | Small compositions of atoms solving one task | SearchField, FormField |
| **Organisms** | Higher-order compositions coordinating multiple parts/states | Header, Sidebar, Card, Modal, Upload |
| **Templates** | Page-level layouts | StyleguideLayout, DashboardLayout |

Classify by **reuse boundary**, not visual size. Compose upward: atoms → molecules → organisms → templates. Never duplicate — audit first.

Internal sub-parts of a component do not each need their own public atomic classification.

## Workflow

### 1. Audit

Check `/components/index.ts` and `/components/` for existing primitives.

- Does this component or a close equivalent already exist?
- Can it be composed from existing components?
- What required atoms are missing? List them for step 2.
- Is there an existing shared icon component or icon library? Prefer it over inline SVGs. If none exists and the component needs icons, create a minimal `Icon` atom or co-locate SVGs as named components.

### 2. Create Missing Atoms

For each missing primitive identified in step 1:

1. Build the atom (see `references/component-templates.md` for starter templates)
2. Follow steps in [Integration Checklist](#integration-checklist)

### 3. Build the Component

1. Import existing primitives — compose, don't rebuild
2. Use design tokens exclusively (see [Token Compliance](#token-compliance))
3. Choose the correct semantic HTML element and extend its attributes (see `references/component-rules.md`)
4. Implement accessibility (see [Accessibility](#accessibility))
5. Handle interactive states — prefer CSS pseudo-classes for simple visual states (see `references/component-rules.md`)
6. Consult `references/component-rules.md` for state management, focus ring, dark mode, keyboard, compound state, collection rendering, and drag-and-drop patterns
7. Consult `references/component-templates.md` for the appropriate template category, compound components, and controlled/uncontrolled patterns

### 4. Integrate

Follow the [Integration Checklist](#integration-checklist), then follow your design system's integration conventions.

## Integration Checklist

**Code integration (required):**

1. Export from `/components/index.ts` (named exports only):
   ```tsx
   export { ComponentName } from './ComponentName'
   export type { ComponentNameProps } from './ComponentName'
   ```
2. Add to your docs site's navigation config (e.g. a `navSections` list), if it has one

**Documentation (required after code integration):**

3. Create a documentation page using your docs app's page layout (e.g. `/app/components/component-name/page.tsx`)
4. Update `references/component-inventory.md`

## File Structure

```
/components/
  ComponentName/
    ComponentName.tsx      # Main component
    useComponentName.ts    # Custom hook (optional — see Hook Extraction)
    helpers.ts             # Pure utility functions (optional — formatters, validators, mappers)
    ComponentNameItem.tsx  # Internal sub-component (optional)
    index.ts               # Re-exports (named only, no default export)
```

Internal sub-components live inside the component folder and are **not** exported from `/components/index.ts`. Promote to `/components/index.ts` only when a second component imports it.

## Token Compliance

Import all visual values from your token source file (examples here use `@/styles/design-tokens`). Token paths shown in this skill and its references are illustrative — use the actual export names and nesting from your project's token file. Never hardcode colors, spacing, typography, shadows, radii, or font weights. Use `transitionPresets` for animation durations and easings.

Follow the styling mechanism already used by neighboring components in the repository (inline styles, CSS modules, styled components, utility classes, etc.); token compliance applies regardless of styling approach. When using CSS modules or utility classes, merge consumer-provided `className` with internal classes (e.g., via `clsx` or template literals).

```tsx
import { colors, spacing, borderRadius, typography, transitionPresets } from '@/styles/design-tokens'

backgroundColor: colors.brand.primary     // ✅
backgroundColor: '#2563EB'                // ❌
```

**Allowed exceptions:** Token-derived computed values in size configs (where the token system doesn't provide a direct mapping) must be commented with the source token or rationale. Dark mode overlay values (e.g., `rgba(255,255,255,0.1)`) are permitted when no semantic token exists — comment them for future token migration. Focus ring fallback values (`2px` width/offset) are also permitted — see [Focus Ring](#focus-ring).

## Common Optional Props

These are conventions, not mandates. Use only what applies. Component-specific types in `references/component-rules.md` take precedence.

| Prop | Type | Default | Typical use |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Interactive components (extend to `'xs'`/`'xl'` per need) |
| `variant` | string union | varies | Components with visual variants |
| `emphasis` | `'high' \| 'mid' \| 'low'` | `'high'` | Buttons |
| `onDark` | `boolean` | `false` | Components used on dark backgrounds |
| `disabled` | `boolean` | `false` | Native interactive components (button, input, etc.) |
| `loading` | `boolean` | `false` | Components with async actions |
| `fullWidth` | `boolean` | `false` | Components that can fill containers |

> **Links:** For link-like components, do not use native `disabled`. Use `isDisabled` or `aria-disabled` semantics instead — see [Link Semantics](#link-semantics).

## Responsive Variants

- Prefer the repository's existing responsive mechanism (media queries, container queries, utility classes).
- Keep one semantic structure; vary layout/styling before duplicating markup.
- Do not infer "mobile" from user agent. Prefer viewport or container queries.

## Custom Hook Extraction

Extract a custom hook (`useComponentName`) when:
- State transitions are non-trivial (multi-step, dependent states)
- Browser API integration is involved (drag-and-drop, resize, intersection)
- The same logic would repeat across sub-components
- Logic dominates rendering and the component file becomes hard to scan

Keep hooks private to the component folder unless intentionally reusable across components.

## Accessibility

### Semantic HTML

Use the correct element: `<button>` for actions, `<a>` for navigation, `<input>` for form fields. Use ARIA roles only when no native element provides the needed semantics — do not add roles/states that duplicate native semantics (e.g., `role="button"` on `<button>`). Extend the matching HTML attributes interface (e.g., `ButtonHTMLAttributes`, `InputHTMLAttributes`). When your custom props collide with native HTML attribute names (common: `value`, `defaultValue`, `onChange`, `onSelect`, `size`), omit the conflicting native props: `Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'>`.

Do not introduce polymorphic `as`/`asChild` APIs unless the repository already uses them or the request explicitly requires them. Prefer a single semantic root element by default.

### Link Semantics

- Use `<a>` (or the framework's `Link` component) for navigation. Do not use `<button>` for route changes.
- Do not use the `disabled` attribute on anchors (it is not a valid HTML attribute for `<a>`).
- If a link must appear unavailable: omit `href`, set `aria-disabled="true"`, optionally set `tabIndex={-1}` to remove from tab order, and prevent navigation via `e.preventDefault()` in the click handler. Apply visual disabled styling.
- Extend `AnchorHTMLAttributes<HTMLAnchorElement>` for link component props.

### Disabled State

- **Native interactive elements** (`<button>`, `<input>`, `<select>`, `<textarea>`): use the native `disabled` attribute. Do NOT add redundant `aria-disabled`.
- **Custom interactive elements** (div/span with `role="button"`, etc.): set `aria-disabled={true}` and manually prevent interaction.

### Loading State

- Use `aria-busy={true}` when the element or region is meaningfully in a loading state for assistive technology. Set `aria-busy={undefined}` (not `false`) when not loading to keep the DOM clean.
- For **buttons/icon buttons**: prefer `disabled` or blocked pointer events during loading. When replacing visible content with a spinner, **preserve the accessible name** via visually hidden text or `aria-label`. See Template A in `references/component-templates.md`.
- For **form fields and containers**: prefer component-specific loading treatments (skeleton placeholders, inline spinners, disabled input with indicator). Use `aria-busy` on the containing region when appropriate.
- When `loading && disabled`, `disabled` takes visual precedence; `aria-busy` remains for AT.

### Icon-Only Components

When no visible text label is rendered — whether via `children`, an `icon` prop, or slotted content — require `aria-label`. Enforce via TypeScript (adapt the exact prop shape to match the component API):

```tsx
type IconButtonProps =
  | { children: React.ReactNode; 'aria-label'?: string }
  | { children?: never; 'aria-label': string }
```

### Form Association

For form components, support `id`, `name`, `aria-describedby`, and `aria-errormessage`. Pair labels using `htmlFor`. Use `React.useId()` for SSR-safe ID generation when the consumer doesn't provide an `id`.

- Use `aria-describedby` for helper/supporting text.
- Use `aria-errormessage` to reference visible error text only when `aria-invalid={true}`.
- Merge consumer-provided `aria-describedby` with generated IDs — see `references/component-templates.md` for the pattern.

### Ref Forwarding

Default to `forwardRef` for public leaf components that render a meaningful DOM node consumers may need to focus, measure, or integrate with. Wrapper/provider/namespace-only components are exempt. See `references/component-rules.md` for the pattern.

### `displayName`

Set `displayName` on components that use `forwardRef` or are wrapped in HOCs (React DevTools cannot infer the name). Plain named function components do not need it.

### Keyboard Navigation

Scope by component type — see `references/component-rules.md` for implementation patterns.

Do not manually implement Enter/Space activation on native `<button>` or `<a>` — the browser already handles it. Use custom key handling only for non-native interactive roles or composite widgets.

| Component type | Enter/Space | Escape | Arrow keys |
|----------------|-------------|--------|------------|
| Buttons, toggles | Activate (native) | — | — |
| Modals, dropdowns, popovers | — | Dismiss/close | — |
| Tabs, menus, selects | Select item | Close | Navigate items |
| Inputs | — | Clear/cancel (if applicable) | — |

### Focus Ring

Use focus tokens scoped to the component type:
- **Buttons:** `button.focus.color`, `button.focus.width`, `button.focus.offset`
- **Other components:** Use `colors.brand.primary` with `2px` width and `2px` offset as defaults until component-specific focus tokens exist. These fallback values are permitted under the token exception policy and must be commented for future migration.

Prefer CSS `:focus-visible` with `outline` or `box-shadow` for focus rings. Use a focus-ring overlay element only when the styling mechanism cannot express the ring otherwise (e.g., inset ring with border-radius mismatch). If using an overlay, ensure the focusable root has `position: relative` and the ring is not clipped by `overflow: hidden` on an ancestor.

See `references/component-rules.md` for the implementation pattern.

### `'use client'` Directive

Add `'use client'` if the **file itself**:
- Uses React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Binds React event handlers in rendered JSX (`onClick`, `onChange`, `onDrag`, etc.)
- Accesses browser-only APIs (`window`, `document`, `navigator`, `FileReader`, etc.)

Apply per file, not per component tree. A server component may render client children. Prefer the **highest file that owns the interactive logic** as the client boundary. Merely typing handler props in an interface is not sufficient — binding them in rendered JSX requires a client component. Purely presentational components with no interactivity, hooks, or browser API usage do not need it.

### Button `type` Attribute

Always default `type` to `'button'` on `<button>` elements to prevent accidental form submission. Only use `type="submit"` when the button is explicitly intended to submit a form.

---

## Memory (optional)

If your setup has a persistent memory tool (an MCP memory server or similar), recall prior generations of the same or similar component before starting, and save a structured record of the work afterward.

### Recall first

Before generating, search memory for prior generations of the same or similar component (e.g. query: `component-generator <ComponentName> design system`).

Pull any prior API decisions, breaking changes, advisor perspectives, or known issues. If a prior generation exists for the same component, **start from it** — don't re-derive a fresh API. Validate that the prior mappings still hold against the current design system; only regenerate what changed.

### Remember after

At the end of every component generation, save a structured entry so future runs and related skills (such as design-system-perspectives) can recall the work:

```
{
  content: "Generated <ComponentName>: <one-line summary of API + variants>. Used tokens: <list>. Advisor verdicts: <if applicable>.",
  tags: ["component-generator", "<component-name>", "<project>"],
  metadata: {
    skill: "component-generator",
    project: "<project>",
    component: "<ComponentName>",
    action: "generated" | "regenerated" | "updated",
    api_summary: "<props/variants summary>",
    tokens_used: ["color.brand.primary", "spacing.md", "..."],
    variants: ["primary", "secondary", "ghost"],
    a11y_notes: "<aria patterns, focus management, keyboard interaction>",
    files_created: ["..."],
    files_modified: ["..."],
    breaking_change_notes: "<if applicable>",
    generated_date: "<ISO date>",
    verdict: "pending"
  }
}
```

`verdict: 'pending'` is the default — after review, label the entry `correct`, `partial`, or `wrong`, plus an `error_category` from the locked taxonomy below.

### Error taxonomy

When labeling a wrong generation, pick from this fixed taxonomy so failure modes can be counted:

- `api-conflict` — proposed API conflicts with existing component
- `wrong-tokens` — references nonexistent or wrong design tokens
- `missing-variant` — variant model incomplete
- `accessibility-gap` — generated component fails WCAG
- `over-engineered` — too many props for the actual need
- `under-specced` — missing critical functionality

Add new categories only by editing this SKILL.md, so the list stays stable for counting and error analysis.

### Correctness metric

The single objective metric this skill is evaluated against:

> **% of generated components that ship without major revision in week 1.**

Ground truth: a manual review label plus an automatic git-diff check 7 days post-generation. Once 30–50 labels exist, use them to tune this SKILL.md against the metric.

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before generating `.tsx`, enumerate what you know about the component vs. what you're inferring.

For each unknown, classify stakes:

- **high** — guessing wrong produces incorrect API, wrong token usage, broken composition with existing components, or missing a11y. Examples: "is this an atom or molecule given the existing inventory?", "does the requested prop conflict with a similar one elsewhere?", "should this use forwardRef or not given the parent patterns?", "is this token name current in the active DS or stale?"
- **low** — internal variable naming, comment style, ordering of optional props. Decide, log, move on.

If any unknown is `high`, **stop**. Append to `_design_task.md` under `honesty.pending_questions`, ask the user, wait. Do not emit `.tsx` until resolved — a wrong component goes into the codebase and propagates.

Schema appended to `_design_task.md`:

```yaml
honesty:
  agent: component-generator
  assumptions:
    - "Used forwardRef per components/button/Button.tsx convention"
  resolved_questions:
    - q: "Should size='sm' be added or stay md/lg only?"
      asked_at: 2026-05-14T15:50Z
      answered: "md/lg only — sm deprecated."
      answered_at: 2026-05-14T15:51Z
  pending_questions: []
```

Special rule for component-generator: any unknown about **prop signatures, token mappings, accessibility patterns, or atomic classification** is automatically `high`. These choices are hard to reverse once shipped.
