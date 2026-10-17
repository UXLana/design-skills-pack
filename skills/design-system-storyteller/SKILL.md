---
name: design-system-storyteller
description: Write realistic usage examples for design-system component docs, covering basic use, key variants, long-content and empty/error edge cases, and When to use / When not to use guidance, with real product copy instead of lorem ipsum or "Click me". Use when the user says "write examples", "add usage examples", "add stories", "fill in the docs examples", "component examples", "this component's docs need examples", or when .mdx or Storybook docs contain [MISSING EXAMPLE] markers or a component has props or variants with no example. Reads the component source first to learn its real props and variants, then writes MDX or Storybook CSF stories to match the repo. Not for polishing the docs site layout (design-system-ui), building the component (component-generator), or a formal accessibility audit (design-accessibility).
---

# Design System Storyteller

Writes usage examples that show components in realistic, production contexts.

## What It Does

- Reads the component source to learn its real props, variants and states
- Finds what's missing: props, variants and states with no example
- Writes examples using realistic data (not "Lorem ipsum" or "Click me")
- Writes the WHY, not just the HOW
- Covers all key variants: default, edge cases, error states, empty states
- Adds Accessibility notes when an accessibility audit exists for the component
- Matches the repo: MDX using the site's own example wrapper, or Storybook CSF stories

## Workflow

### Step 1: Read the component and its docs

Read the source before anything else; it answers what the component can do, so the user only has to answer what it should say.

- **Source:** the props type, defaults, the variant map (a `cva` call, a variants object, union types), and the states it renders (loading, disabled, error, empty).
- **Existing docs:** the `.mdx` page, any `*.stories.*` files, the README. Note how existing pages render live examples (a wrapper such as `<Canvas>`, `<Preview>` or a custom playground, or plain code fences) and reuse that wrapper so the new examples look like the rest of the site.
- **Storybook:** present if there is a `.storybook/` folder or `storybook` in `package.json`. Note the `framework` named in `.storybook/main.*` and the story format the repo already uses.

### Step 2: Find what's missing

List each prop value, variant and state, and whether the docs show it. Add the edge cases the component can actually hit: long content, empty, error, loading. If a docs audit left `[MISSING EXAMPLE]` markers, start with those, but don't depend on them; most repos won't have them.

If the list is longer than a handful of items, show it to the user and confirm the scope before writing.

### Step 3: Resolve unknowns

See "Honesty Output Protocol" below. Settle everything the code can answer yourself; ask only for copy and domain truth.

### Step 4: Write the examples

Write them in the format from Step 1: MDX with the site's wrapper, or CSF stories when Storybook is present (both when the MDX page renders stories). Use the repo's real component names and props from Step 1. Remove any `[MISSING EXAMPLE]` markers you resolved.

### Step 5: Accessibility notes

Add them when an audit exists (see "Accessibility Notes" below).

## Realistic Data Principles

- Copy comes from the product: its real action names, statuses and error messages. When you don't know them, ask (Step 3) rather than inventing domain terms.
- Real names, real statuses, real error messages
- Edge cases: long names, empty states, loading states, failures
- Error messages say what happened and how to fix it
- Accessibility context: labels that make sense to screen readers

## Example Output Format (MDX)

The copy below is illustrative, written for a generic project-management product; replace it with the product's own words. `<Preview>` stands in for whatever wrapper the site's docs already use, and `TextField` for the repo's real input component.

```mdx
## Usage

### Basic Usage
<Preview>
  <Button variant="primary">Save changes</Button>
</Preview>

### With Long Label (edge case)
<Preview>
  <Button variant="primary">Send invoice to all 14 contacts on this account</Button>
</Preview>

### Destructive Action
<Preview>
  <Button variant="destructive">Delete project</Button>
</Preview>

### With a Form Error
The error belongs to the field, not the button. The button stays enabled so people can
submit, see what is wrong, and fix it; a disabled button never says why it can't be pressed.

<Preview>
  <form>
    <TextField
      label="Work email"
      defaultValue="jordan@"
      error="Enter a full email address, like jordan@company.com"
    />
    <Button variant="primary" type="submit">Send invite</Button>
  </form>
</Preview>

### When to Use
Use the primary button for the single most important action on a page, such as saving
a form or confirming a step.

### When NOT to Use
Don't use multiple primary buttons in the same view. Use `secondary` for supporting
actions, and a link when the action navigates rather than does something.
```

## Example Output Format (Storybook CSF)

When Storybook is present, write `ComponentName.stories.tsx` next to the component. Mirror the repo's existing stories; if there are none, use CSF 3 as below, importing the types from the framework package named in `.storybook/main.*` (for example `@storybook/react-vite` or `@storybook/nextjs-vite`).

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
};

export const LongLabel: Story = {
  args: { variant: 'primary', children: 'Send invoice to all 14 contacts on this account' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete project' },
};
```

Put When to use / When not to use in the component's MDX docs page (or the story's `parameters.docs.description` if the repo does that), so the guidance sits next to the examples.

## Accessibility Notes

If an accessibility audit exists for the component (a design-accessibility report or its JSON findings block, in the repo, a PR, or pasted by the user), add an "Accessibility notes" subsection to the component's docs:

- What consumers must do to use it accessibly, e.g. "Icon-only buttons need an `aria-label`; the example below shows one."
- What the component already handles for them, e.g. focus returns to the trigger when the dialog closes.
- Open findings that affect how people should use it, stated plainly with the finding id, so a known gap isn't hidden behind a clean example.

Write usage guidance, not conformance claims; whether the component meets WCAG is the audit's call, not an example page's. With no audit, skip the subsection rather than writing notes from code inspection alone. Either way, keep the examples themselves accessible: labelled controls and link text that makes sense out of context.

## Integration

The coverage list from Step 2 (or a docs audit's `[MISSING EXAMPLE]` flags) → **this skill fills them** → your QA/review step validates

Storyteller writes back to:
1. The component's `.mdx` documentation file, and/or its `*.stories.tsx` file when Storybook is present
2. `_design_task.md`, only if the workflow already uses one (marks examples as complete)

Then hands off to your QA/review step for final checks.

## Honesty Output Protocol — Interrupt on High-Stakes Unknowns

Before writing any example, list your assumptions and unknowns about the component, then sort each one:

- **Answer from code**: anything the source settles, such as whether a prop exists, which variants and sizes there are, default values, the ARIA roles the component sets, which tokens it uses. Read the code and decide. Asking the user something the code already says costs them time and risks a wrong answer from memory.
- **high**: not in the code, and guessing wrong puts false claims in the docs. Examples: "what's the product's real label for this action?", "is deleting a project recoverable, so the example says 'Delete' rather than 'Move to trash'?", "is this the term customers use?", usage guidance the team hasn't written down.
- **low**: stylistic choices, formatting decisions, minor copy variants. Decide, log as an assumption, move on.

If any unknown is `high`, pause and ask before writing the examples that depend on it; docs copy gets pasted into product, so a wrong guess spreads. Ask in the conversation as a numbered list. Examples that don't depend on the answer can go ahead.

Some multi-skill design-system workflows keep a shared task file, `_design_task.md`, to pass context and open questions between steps. If the repo has one, also log the questions there using the schema below: move each to `resolved_questions` with the answer and timestamp once answered, and leave it there as the audit trail. If there is no such file, the conversation is the record; don't create one.

```yaml
honesty:
  agent: storyteller
  assumptions:                       # low-stakes decisions you made on your own
    - "Used 'Save changes' as the default primary button label"
  resolved_questions:                # answered in this or prior runs (append-only log)
    - q: "Does the product say 'Archive' or 'Close' for finished projects?"
      asked_at: 2026-05-14T15:32Z
      answered: "Archive; Close is only for support tickets"
      answered_at: 2026-05-14T15:33Z
  pending_questions:                 # currently blocking; non-empty = halt
    - q: "Can a deleted project be restored?"
      stakes: high
      why: "Decides whether the destructive example says 'Delete project' or 'Move to trash', and whether it needs a confirmation step."
```

Pending questions block the examples they affect. Resolved questions stay in the file as the audit trail.

Be sharp with the rubric. Classify as `high` anything that represents a real product action, a claim about what happens when someone clicks, or an accessibility claim the code doesn't confirm. Classify as `low` only genuinely cosmetic choices (which adjective to use, exact character count of an edge-case example).
