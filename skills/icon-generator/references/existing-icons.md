# Existing Icons — format template

This file is a format, not an inventory. The skill folder is shared by every repo the skill runs in, so it never holds one project's icon list and the skill never writes to it.

Each run, build the inventory from the repo (step 0 in SKILL.md):

- the exports of the icons barrel (for example `components/Icons/index.ts`) and any `.svg` folder;
- inline `<svg>` elements inside other components (search the components folder for `<svg`), which are candidates to move into the icon set;
- any icon library in `package.json`.

If the repo keeps its own inventory doc, read it, treat the code as the authority where they disagree, and update the doc after adding an icon. Create that doc in the user's repo only if they ask for one.

## Format

The rows are illustrative.

| Name | File | Category | Variants | Meaning / used for | Notes |
|------|------|----------|----------|--------------------|-------|
| `IconArchive` | `components/Icons/IconArchive.tsx` | Actions | outline, filled | Move to archive | Toggle pair |
| `IconClose` | `components/Icons/IconClose.tsx` | Actions | outline | Close or dismiss | Used by Modal and Banner |
| `CheckIcon` (inline) | `components/Banner/Banner.tsx` | Status | outline | Success | Inline SVG; move into the icon set |

Also record the set's style so new icons match it: stroke width, corner radius, `viewBox`, and the default rendered size.

## Gaps

List icons that have been requested but not built, with who needs them:

- **Calendar** (Objects), needed by a date field
