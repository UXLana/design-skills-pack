# Worked Examples

The geometry below was drawn for this guide on the 24px grid; it is not copied from an icon library. If you adapt paths from Lucide (ISC) or Feather (MIT) instead, keep a source-and-license comment at the top of the file.

## Example 1: Archive Icon (Both Variants)

**Input:** "Add an archive icon, outline and filled"

**Step 0 result:** no archive, box, or storage icon in the repo's set; the user wants a custom one to match the set rather than importing a library.

### Components

```tsx
// components/Icons/IconArchive.tsx
import { BaseIcon, type IconProps } from './BaseIcon'

export function IconArchive(props: IconProps) {
  return (
    <BaseIcon {...props}>
      {/* lid: shorter than 8px, so a 1px corner radius */}
      <rect x="3" y="4" width="18" height="5" rx="1" />
      {/* box: open at the top, tucked under the lid; 2px corners */}
      <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      {/* handle slot */}
      <path d="M10 13h4" />
    </BaseIcon>
  )
}

export function IconArchiveFilled(props: IconProps) {
  return (
    <BaseIcon {...props} variant="filled">
      {/* lid: the outline lid's outer edge, closed and filled */}
      <rect x="2" y="3" width="20" height="6" rx="2" />
      {/* box: redrawn as a closed shape; the handle slot is a knockout subpath */}
      <path
        fillRule="evenodd"
        d="M4 11h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8Zm6 2a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-4Z"
      />
    </BaseIcon>
  )
}
```

### How the filled variant was built (closed-shapes rule)

- The outline box is an **open** path (no `Z`): filling it as-is would draw a solid box with no lid gap. It was redrawn as a closed shape that follows the outline's outer edge (the stroke adds 1px on each side, so the 2px corner becomes 3px).
- The handle slot is an open line in the outline. In the filled variant it becomes a **knockout**: a pill-shaped second subpath, cut out with `fillRule="evenodd"`.
- The lid and box keep a 2px gap, the minimum spacing between distinct elements, so the two parts still read as separate at 16px.
- Both variants span the same area (x 2–22, y 3–22), so swapping them doesn't shift the layout.

### SVG files

```svg
<!-- archive.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="5" rx="1"/>
  <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/>
  <path d="M10 13h4"/>
</svg>

<!-- archive-filled.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="currentColor" stroke="none">
  <rect x="2" y="3" width="20" height="6" rx="2"/>
  <path fill-rule="evenodd" d="M4 11h16v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8Zm6 2a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-4Z"/>
</svg>
```

### Usage

Decorative next to a visible label (the default; nothing to add):

```tsx
<button type="button">
  <IconArchive size="sm" />
  Archive
</button>
```

As a toggle, with a fixed label and the state in `aria-pressed` (see Toggle buttons in `accessibility.md`):

```tsx
function ArchiveToggle({ archived, onToggle }: { archived: boolean; onToggle: () => void }) {
  return (
    <button type="button" aria-label="Archived" aria-pressed={archived} onClick={onToggle}>
      {archived ? <IconArchiveFilled /> : <IconArchive />}
    </button>
  )
}
```
