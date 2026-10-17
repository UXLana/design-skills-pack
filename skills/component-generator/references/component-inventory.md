# Component Inventory

Quick-reference index of design system components. The filesystem (`/components/`, `/components/index.ts`) is authoritative — this file is a convenience index. The rows below are an example inventory; replace them with your design system's own components.

**Check before creating any component. Update after creating one.**

## Atoms

| Component | Path | Level | Key Features | Compose With |
|-----------|------|-------|-------------|--------------|
| **Button** | `/components/Button` | Atom | Primary, secondary, ghost variants; emphasis levels (high/mid/low); icon support | Icons |
| **Avatar** | `/components/Avatar` | Atom | User/entity representation; sizes xs–xl; initials fallback | — |
| **Tab** | `/components/Tab` | Atom | Individual tab; active/inactive states; icon positions | Icons |
| **Banner** | `/components/Banner` | Atom | Info, success, warning, error variants; dismissable | Icons |
| **Badge** | `/components/Badge` | Atom | Status labels; filled/outlined/subtle variants; semantic colors | — |
| **Icons** | `/components/Icons` | Atom | Shared icon set in `Icons.tsx` | — |
| **SegmentedControl** | `/components/SegmentedControl` | Atom | Tab-style selection control | — |
| **ProgressBar** | `/components/ProgressBar` | Atom | Determinate/indeterminate; sm/md/lg sizes; default/success/error variants | — |
| **UploadIcon** | `/components/Upload/UploadIcon` | Atom | File type indicators (file/pdf/image/thumbnail); default/lowEmphasis/disabled states | — |

## Molecules

| Component | Path | Level | Key Features | Compose With |
|-----------|------|-------|-------------|--------------|
| **TabGroup** | `/components/TabGroup` | Molecule | Container for Tab components | Tab |
| **DropZone** | `/components/Upload/DropZone` | Molecule | Drag-and-drop surface; upload/attach/import icons; mobile/desktop; hidden file input | Icons, Button |
| **UploadFile** | `/components/Upload/UploadFile` | Molecule | File item with progress, error recovery, retry; 7 states | UploadIcon, ProgressBar, Icons |
| **Combobox** | `/components/Combobox` | Molecule | Autocomplete/typeahead select; label/error/helper; controlled/uncontrolled; keyboard navigation; aria-live | Icons, Input |

## Organisms

| Component | Path | Level | Key Features | Compose With |
|-----------|------|-------|-------------|--------------|
| **Upload** | `/components/Upload` | Organism | File upload with DropZone + file list; enabled/error/readOnly/disabled; large-height variant; useUpload hook | DropZone, UploadFile, UploadIcon, ProgressBar |

## To Be Created

Create these as atoms/molecules first when needed by a higher-level component:

**Form Primitives:** Label, FormField

**Layout & Overlay:** Card, Modal, Dropdown, Tooltip, Popover

**Data Display:** —

**Feedback:** Spinner
