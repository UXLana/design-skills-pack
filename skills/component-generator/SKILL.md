---
name: component-generator
description: Build production-ready React and TypeScript components for a design system. It audits what already exists, composes from existing atoms, uses design tokens only, and ships accessible (WCAG 2.2 AA) semantics, keyboard support, ref handling and React 19 / Server Component boundaries, then exports the component and adds its docs page or story. Use whenever someone asks to create, add, scaffold or rebuild a design-system component, for example "make a Tooltip component", "we need a Combobox", "add a Modal to the design system", "build this Figma component in code" or "turn this into a reusable component", even if they never say "design system". Covers atoms through organisms (buttons, inputs, selects, tabs, cards, modals, uploads). Not for icons (icon-generator), visual polish of an existing docs page (design-system-ui), new themes or token values (theme-generator, brand-tokens-translator), auditing hardcoded values (token-audit), or one-off screens in a product app.
---

# Component Generator

Create production-ready React components using atomic design, strict token compliance, and accessibility.

## Source-of-Truth Hierarchy

1. **Filesystem** (`/components/`, `/components/index.ts`) — authoritative for what exists
2. **The component inventory** — rebuilt from the barrel export (`/components/index.ts`) at the start of every run, or read from the repo's own inventory doc if it keeps one. It lives in the user's repo, never in this skill's folder: the skill is shared by every repo it runs in, so anything written here would leak one project's components into the next. `references/component-inventory.md` is only the format to use.
3. **`references/component-rules.md`** — canonical patterns (refs, state, focus, ARIA, keyboard, dark mode, compound state, collections, native dialogs, drag-and-drop)
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

Check `/components/index.ts` and `/components/` for existing primitives. List the barrel's exports to build the inventory for this run (or read the repo's inventory doc if it has one).

- Does this component or a close equivalent already exist?
- Can it be composed from existing components?
- What required atoms are missing? List them for step 2.
- Which React version does the repo target? Read `react` in `package.json` (`peerDependencies` for a component library, `dependencies` for an app). 19 or later: use the templates as written (ref is a regular prop). 18: use the React 18 variant in `references/component-rules.md` (`forwardRef`).
- Does the component need icons? Use the repo's existing icon set or icon library. If an icon is missing, hand that icon to the icon-generator skill instead of drawing an inline SVG here, so the icon set stays the single home for icons.

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

**Documentation (required, in whatever form the repo already uses):**

2. Match the repo's docs setup. Look for what neighboring components have and copy that:
   - **Storybook** (`.storybook/`, `*.stories.tsx`): add `ComponentName.stories.tsx` with one story per variant and state (default, disabled, loading, error, on dark).
   - **MDX docs** (`*.mdx` pages): add an MDX page with usage, props table, and accessibility notes.
   - **A docs app** (e.g. `/app/components/component-name/page.tsx`): add a page with the app's layout, and add it to the nav config (e.g. a `navSections` list) if there is one.
3. If the repo keeps an inventory doc, add the component to it in the format of `references/component-inventory.md`. Don't write the inventory into this skill's folder.

**Verify (required before calling it done):**

4. Run the repo's type-check and existing tests.
5. Add a test in the repo's runner covering render, keyboard interaction, and an automated axe check (`jest-axe` / `vitest-axe` for unit tests, `@axe-core/playwright` for browser tests, or Storybook's a11y addon, whichever the repo already has). Axe catches only part of WCAG, so it supplements the manual checks rather than replacing them.
6. Hand off when those skills are installed: **design-accessibility** for a WCAG 2.2 AA audit of the new component, and **visual-qa** for screenshots of each state at desktop and mobile widths. If they aren't installed, list the manual checks you did (keyboard path, focus visibility, screen reader name and state).

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

Use the correct element: `<button>` for actions, `<a>` for navigation, `<input>` for form fields. Use ARIA roles only when no native element provides the needed semantics — do not add roles/states that duplicate native semantics (e.g., `role="button"` on `<button>`). Extend the element's props type: `ComponentProps<'button'>`, `ComponentProps<'input'>` and so on (on React 19 this includes `ref`; on React 18 use `ComponentPropsWithoutRef<'button'>` with `forwardRef`). When your custom props collide with native HTML attribute names (common: `value`, `defaultValue`, `onChange`, `onSelect`, `size`), omit the conflicting native props: `Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'size'>`. Omit only real collisions; omitting `type` from a button, for example, stops consumers from making a submit button.

Do not introduce polymorphic `as`/`asChild` APIs unless the repository already uses them or the request explicitly requires them. Prefer a single semantic root element by default.

### Link Semantics

- Use `<a>` (or the framework's `Link` component) for navigation. Do not use `<button>` for route changes.
- Do not use the `disabled` attribute on anchors (it is not a valid HTML attribute for `<a>`).
- If a link must appear unavailable: omit `href`, set `aria-disabled="true"`, optionally set `tabIndex={-1}` to remove from tab order, and prevent navigation via `e.preventDefault()` in the click handler. Apply visual disabled styling.
- Extend `ComponentProps<'a'>` for link component props.

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

### Refs

Give public leaf components that render a meaningful DOM node (one consumers may need to focus, measure, or integrate with) a ref to that node. Wrapper/provider/namespace-only components are exempt.

- **React 19+ (default):** `ref` is a regular prop. It is already part of `ComponentProps<'button'>`; destructure it and pass it to the root element. No wrapper is needed, and React's docs say `forwardRef` will be deprecated in a future release.
- **React 18:** wrap the component in `forwardRef` and type props with `ComponentPropsWithoutRef<'button'>`.
- When the component also needs its own ref to the same node (a dialog, a measured popover), keep an internal `useRef` and expose it with `useImperativeHandle(ref, () => internalRef.current!)`. Casting the incoming ref to `RefObject` breaks consumers who pass a callback ref.

Type any hook parameter that receives a ref as `RefObject<HTMLElement | null>`. On React 19, `useRef<T>(null)` returns `RefObject<T | null>`, so a parameter typed `RefObject<HTMLElement>` no longer accepts it. The `| null` form type-checks on 18 and 19. See `references/component-rules.md` for both patterns.

### `displayName`

Set `displayName` on components wrapped in `forwardRef` (React 18), `memo`, or other HOCs, because React DevTools cannot infer the name through the wrapper. Plain named function components, including React 19 components that take `ref` as a prop, do not need it.

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

Always default `type` to `'button'` on `<button>` elements to prevent accidental form submission, and keep `type` in the props so a consumer can pass `type="submit"` when the button is meant to submit a form.

---

## Memory (optional)

If your setup has a persistent memory tool, search it before starting for earlier work on this component (prior API decisions, breaking changes, known issues) and start from what it finds rather than re-deriving the API; check those decisions still match the current code.
After the component ships, save a short summary: component name, props and variants, tokens used, accessibility patterns, files touched, and any breaking change.
Without a memory tool, skip this section; the repo and its git history are the record.

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before generating `.tsx`, list what you know about the component vs. what you're inferring.

For each unknown, classify stakes:

- **high** — a wrong guess would ship a public API that is costly to reverse and that the repo can't settle. Examples: the requested prop name or meaning conflicts with an existing component's API; the design calls for a token that doesn't exist in the token file; it's unclear whether the request extends an existing component or adds a new one.
- **low** — anything the repo already answers by convention (follow the neighboring components), plus internal variable naming, comment style, and ordering of optional props. Decide, note the assumption in your summary, move on.

If any unknown is `high`, stop and ask the user before writing `.tsx`, because a wrong component gets imported and copied before anyone notices. Ask in chat. If the repo has a `_design_task.md` at its root (a shared task log that other design-system skills, such as design-system-perspectives, read and write), also record the question there under `honesty.pending_questions`:

```yaml
honesty:
  agent: component-generator
  assumptions:
    - "Ref passed as a regular prop (react peer dependency is ^19)"
  resolved_questions:
    - q: "Should size='sm' be added or stay md/lg only?"
      asked_at: 2026-05-14T15:50Z
      answered: "md/lg only — sm deprecated."
      answered_at: 2026-05-14T15:51Z
  pending_questions: []
```

Don't create `_design_task.md` just to log a question; asking in chat is enough.
