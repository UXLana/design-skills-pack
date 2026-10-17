# Component Inventory — format template

This file is a format, not an inventory. The skill folder is shared by every repo the skill runs in, so it never holds one project's component list and the skill never writes to it.

Each run, build the inventory from the repo itself: list the exports of the barrel file (`/components/index.ts`) and read each component's folder for its level, features, and what it composes. If the repo keeps its own inventory doc (for example `docs/component-inventory.md`), read it as well, treat the barrel as the authority where they disagree, and update the doc after you add a component. Create that doc in the user's repo only if they ask for one.

Use this shape. The rows are illustrative.

| Component | Path | Level | Key features | Composes |
|-----------|------|-------|--------------|----------|
| **Button** | `/components/Button` | Atom | primary / secondary / ghost; sm–lg; loading; icon-only with required `aria-label` | Spinner, Icon |
| **FormField** | `/components/FormField` | Molecule | label, helper and error text; merged `aria-describedby`; controlled or uncontrolled | Label, Input |
| **Modal** | `/components/Modal` | Organism | native `<dialog>`; title wired with `useId`; Escape and backdrop close; focus returns to opener | Button, Icon |

## Planned

List components that a higher-level component needs but that don't exist yet, so they are built as atoms or molecules first:

- **Tooltip** (Atom), needed by an icon-only Button
