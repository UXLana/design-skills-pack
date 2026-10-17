# Component Rules — Canonical Patterns

## Contents

- Ref Pattern (React 19 default, React 18 variant)
- State Management (CSS-first, status enum, prop gating, controlled/uncontrolled)
- Focus Ring Pattern
- Dark Mode
- Keyboard Interaction Patterns
- Modal Dialogs (native `<dialog>`)
- Compound Component Pattern
- Collection Rendering Pattern
- Variant & Size Config Pattern
- Hidden Native Input Pattern
- Async Status Announcements
- Drag-and-Drop Pattern (drop zone, sortable list with keyboard reorder)

## Ref Pattern

Check the `react` version in `package.json` first (`peerDependencies` for a library). The default below is React 19.

### React 19+ (default): ref is a prop

`ComponentProps<'button'>` already includes `ref`, so destructure it and pass it to the root element. No wrapper and no `displayName` are needed.

```tsx
import type { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', type = 'button', ref, children, ...rest }: ButtonProps) {
  return (
    <button ref={ref} type={type} data-variant={variant} {...rest}>
      {children}
    </button>
  )
}
export { Button }
export type { ButtonProps }
```

### React 18: forwardRef

When the repo's `react` peer dependency is 18, change three things: wrap the component in `forwardRef`, type props with `ComponentPropsWithoutRef<'button'>` (the ref arrives as `forwardRef`'s second argument, not in props), and set `displayName`.

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', type = 'button', children, ...rest }, ref) => (
    <button ref={ref} type={type} data-variant={variant} {...rest}>
      {children}
    </button>
  )
)
Button.displayName = 'Button'
```

A library that supports both 18 and 19 should keep the `forwardRef` form until it drops 18; it still works on 19.

### Internal ref plus consumer ref

When the component needs its own handle on the node (to call `showModal()`, measure, or focus), keep an internal `useRef` and expose the node to the consumer with `useImperativeHandle`. This works for object refs and callback refs on both versions:

```tsx
const dialogRef = useRef<HTMLDialogElement>(null)
useImperativeHandle(ref, () => dialogRef.current!, [])
```

Don't cast the incoming ref to `RefObject` and use it directly; a consumer who passes a callback ref will break.

### Typing refs passed to hooks

Type hook parameters that receive a ref as `RefObject<HTMLElement | null>`. On React 19, `useRef<T>(null)` returns `RefObject<T | null>`, which a `RefObject<HTMLElement>` parameter rejects; the `| null` form works on 18 and 19.

## State Management

### CSS-First States

Prefer CSS pseudo-classes for visual-only state changes:

```tsx
// ✅ CSS handles hover/active/focus — no JS state needed
const buttonStyle = {
  backgroundColor: colors.brand.primary,
  transition: transitionPresets.colorShift,
}
// Use :hover, :active, :focus-visible in CSS modules or styled-components
```

Reserve `useState` for states that affect **rendered output, ARIA attributes, or control flow**.

### Status Enum Pattern

For components with multiple mutually exclusive states, use a string union type with derived booleans:

```tsx
type UploadStatus = 'idle' | 'selecting' | 'uploading' | 'complete' | 'error'

const [status, setStatus] = useState<UploadStatus>('idle')
const isActive = status === 'uploading'
const isDone = status === 'complete' || status === 'error'
```

Prefer a single `status` state over multiple independent booleans (`isUploading`, `isComplete`, etc.) — it prevents impossible state combinations.

### Status-to-Prop Mapping

When a parent's status must drive a child component's props (e.g., status → ProgressBar variant), use an explicit mapping object:

```tsx
const statusToVariant: Record<UploadStatus, ProgressBarProps['variant']> = {
  idle: 'default',
  selecting: 'default',
  uploading: 'active',
  complete: 'success',
  error: 'error',
}

const statusToIcon: Record<UploadStatus, React.ComponentType> = {
  idle: UploadIcon,
  uploading: SpinnerIcon,
  complete: CheckIcon,
  error: AlertIcon,
}
```

This pattern also works for mapping status → icon component, status → color token, or any status-driven prop.

### Prop Gating by State

Conditionally omit callbacks to signal non-interactivity to child components:

```tsx
<FileItem
  onRemove={status === 'uploading' ? undefined : handleRemove}
/>
```

Children can derive their interactive state from callback presence (`const canRemove = !!onRemove`), avoiding redundant boolean props.

### Controlled / Uncontrolled

```tsx
interface ToggleProps {
  value?: boolean
  defaultValue?: boolean
  onChange?: (next: boolean) => void
}

function useControllable<T>(controlled: T | undefined, defaultVal: T, onChange?: (v: T) => void) {
  const [internal, setInternal] = useState(defaultVal)
  const isControlled = controlled !== undefined
  const current = isControlled ? controlled : internal
  const update = useCallback((v: T) => {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }, [isControlled, onChange])
  return [current, update] as const
}
```

## Focus Ring Pattern

```tsx
// In CSS module or styled approach:
// .component:focus-visible {
//   outline: ${button.focus.width ?? '2px'} solid ${button.focus.color ?? colors.brand.primary};
//   outline-offset: ${button.focus.offset ?? '2px'};
// }

// Inline style fallback (for non-CSS-module repos):
const focusRingStyle = {
  outline: `2px solid ${colors.brand.primary}`,  // fallback — migrate to focus token
  outlineOffset: '2px',                          // fallback — migrate to focus token
}
```

## Dark Mode

### `onDark` Prop Pattern

```tsx
interface BadgeProps {
  onDark?: boolean
}

const bgColor = onDark ? colors.dark.surface : colors.light.surface
```

### System Preference Detection

```tsx
function useDarkMode() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDark
}
```

## Keyboard Interaction Patterns

### Escape to Dismiss

```tsx
useEffect(() => {
  if (!isOpen) return
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}, [isOpen, onClose])
```

### Arrow Key Navigation (roving tabindex)

```tsx
function useRovingIndex(itemCount: number) {
  const [active, setActive] = useState(0)
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': case 'ArrowRight':
        e.preventDefault(); setActive(i => (i + 1) % itemCount); break
      case 'ArrowUp': case 'ArrowLeft':
        e.preventDefault(); setActive(i => (i - 1 + itemCount) % itemCount); break
      case 'Home':
        e.preventDefault(); setActive(0); break
      case 'End':
        e.preventDefault(); setActive(itemCount - 1); break
    }
  }, [itemCount])
  return { active, onKeyDown }
}
```

### Scroll Active Option Into View

When arrow-key navigation highlights an option in a scrollable list, scroll it into view:

```tsx
useEffect(() => {
  if (activeIndex < 0) return
  // getElementById, not querySelector(`#${id}`): ids from useId can contain characters
  // that are not valid in a CSS selector, and querySelector throws on them.
  document.getElementById(getOptionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
}, [activeIndex])
```

### Blur-Based Close (Non-Modal Overlays)

For dropdowns, comboboxes, and popovers that are **not** modal (no focus trap), close when focus leaves the container:

```tsx
const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
  if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu()
}, [closeMenu])
```

Set `autoComplete="off"` on combobox/autocomplete inputs to suppress browser autocomplete interference.

## Modal Dialogs (native `<dialog>`)

Build modals on the native `<dialog>` element opened with `showModal()` rather than a hand-rolled focus trap. The browser then provides what a hand-rolled version usually gets wrong:

- the rest of the page becomes inert (not focusable, not clickable, hidden from assistive technology), so focus can't escape;
- Escape closes the dialog (it fires `cancel`, then `close`);
- the dialog renders in the top layer, so it needs no portal and no z-index;
- the dialog role and `aria-modal="true"` are implicit.

You still add four things:

1. **A label.** Generate the title id with `useId()` and point `aria-labelledby` at it. A hardcoded id collides as soon as two dialogs exist on a page.
2. **Focus return.** Remember `document.activeElement` before `showModal()` and focus it again after closing, if it is still on the page.
3. **State sync.** Listen for the dialog's `close` event (React `onClose`) and call the consumer's `onClose`, so Escape and backdrop clicks keep the `isOpen` prop in step.
4. **A visible close button**, and a sensible first focus (`autoFocus` on the primary field or the close button).

Optional: background scroll lock (`showModal()` doesn't stop the page behind from scrolling) and backdrop-click close. Style the backdrop with the `::backdrop` pseudo-element, which needs a stylesheet, not an inline style. See Template C in `component-templates.md` for the full component.

Reserve a hand-written focus trap for non-dialog surfaces that truly must hold focus, and type its ref parameter as `RefObject<HTMLElement | null>`.

## Compound Component Pattern (Shared State)

```tsx
interface TabsContext { activeIndex: number; setActive: (i: number) => void }
const TabsCtx = createContext<TabsContext | null>(null)
function useTabsCtx() {
  const ctx = useContext(TabsCtx)
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>')
  return ctx
}

function Tabs({ children, defaultIndex = 0 }: { children: React.ReactNode; defaultIndex?: number }) {
  const [activeIndex, setActive] = useState(defaultIndex)
  return <TabsCtx.Provider value={{ activeIndex, setActive }}>{children}</TabsCtx.Provider>
}
function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>
}
function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeIndex, setActive } = useTabsCtx()
  return (
    <button role="tab" type="button" aria-selected={activeIndex === index} onClick={() => setActive(index)}>
      {children}
    </button>
  )
}
function TabPanel({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeIndex } = useTabsCtx()
  if (activeIndex !== index) return null
  return <div role="tabpanel">{children}</div>
}

Tabs.TabList = TabList; Tabs.Tab = Tab; Tabs.TabPanel = TabPanel
```

## Collection Rendering Pattern

For components rendering dynamic lists (menus, selects, file lists, tag groups):

```tsx
interface CollectionItem {
  id: string
  [key: string]: unknown
}

interface ListProps<T extends CollectionItem> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor?: (item: T) => string
}

function List<T extends CollectionItem>({ items, renderItem, keyExtractor = (i) => i.id }: ListProps<T>) {
  return (
    <ul role="list">
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

Always use stable, unique keys (prefer `id`). Avoid index keys for reorderable or removable lists.

## Variant & Size Config Pattern

Centralize variant/size styles in typed config objects instead of inline ternaries:

```tsx
const sizeConfig: Record<Size, { height: string; padding: string; fontSize: string }> = {
  sm: { height: sizing.control.sm, padding: spacing[2], fontSize: typography.size.sm },
  md: { height: sizing.control.md, padding: spacing[3], fontSize: typography.size.md },
  lg: { height: sizing.control.lg, padding: spacing[4], fontSize: typography.size.lg },
}

const variantConfig: Record<Variant, { bg: string; color: string; border: string }> = {
  primary: { bg: colors.brand.primary, color: colors.text.inverse, border: 'none' },
  secondary: { bg: 'transparent', color: colors.brand.primary, border: `${borderWidth.thin} solid ${colors.brand.primary}` },
}
```

Every size, border width, opacity, and z-index comes from a token, including the ones that look too small to matter (a `1px` border, a `0.5` disabled opacity). If the token file has no match, use the closest token and flag the gap, or comment the value as a temporary exception (see Token Compliance in SKILL.md).

### Component & Icon Mapping

When a variant or status determines which component or icon to render, use a typed map:

```tsx
const statusIconMap: Record<Status, React.ComponentType<IconProps>> = {
  idle: UploadIcon,
  uploading: SpinnerIcon,
  complete: CheckIcon,
  error: AlertIcon,
}

const StatusIcon = statusIconMap[status]
return <StatusIcon size={sizeConfig[size].iconSize} />
```

This replaces chains of `if`/`switch` in JSX and keeps rendering declarative.

## Hidden Native Input Pattern

For custom-styled file inputs, color pickers, or other native inputs that need non-native UI:

```tsx
function FilePicker({ accept, multiple, onChange }: Pick<ComponentProps<'input'>, 'accept' | 'multiple' | 'onChange'>) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
        tabIndex={-1}
        aria-hidden="true"
      />
      <Button onClick={() => inputRef.current?.click()}>
        Choose file
      </Button>
    </>
  )
}
```

The visible trigger must be keyboard-accessible. The hidden input handles native behavior (file picker dialog, validation). Associate a visible label with the trigger button, not the hidden input.

## Async Status Announcements

For components with async state transitions (upload progress, form submission, data fetching), announce status changes to assistive technology:

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {status === 'complete' && 'Upload complete'}
  {status === 'error' && `Upload failed: ${errorMessage}`}
</div>
```

- Use `aria-live="polite"` for non-urgent updates, `"assertive"` for errors requiring immediate attention.
- Place the live region in the DOM on mount (not conditionally rendered) — only change its text content.
- Use `sr-only` / visually-hidden styles so the region doesn't affect layout.

## Drag-and-Drop Pattern

### Drop Zone

```tsx
function useDropZone(onDrop: (files: FileList) => void) {
  const [isDragOver, setDragOver] = useState(false)
  const handlers = useMemo(() => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOver(true) },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault(); setDragOver(false)
      if (e.dataTransfer.files.length) onDrop(e.dataTransfer.files)
    },
  }), [onDrop])
  return { isDragOver, handlers }
}
```

Always provide a non-drag alternative (e.g., a file input button within the drop zone) for keyboard and assistive technology users who cannot perform drag operations.

### Sortable List (Drag Reorder)

Pointer drag is the enhancement; the keyboard path is the requirement. Every reorderable item gets "Move up" and "Move down" buttons (or Alt+Arrow shortcuts on the item, documented in its description), and each move is announced in a polite live region. Don't use `aria-grabbed` or `aria-dropeffect`: both were deprecated in WAI-ARIA 1.1, so the buttons and the announcement have to carry the meaning.

```tsx
function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

interface SortableItem { id: string; label: string }

function SortableList({ items, onReorder }: { items: SortableItem[]; onReorder: (next: SortableItem[]) => void }) {
  const [announcement, setAnnouncement] = useState('')

  const move = (from: number, to: number) => {
    const next = moveItem(items, from, to)
    if (next === items) return
    onReorder(next)
    setAnnouncement(`${items[from].label} moved to position ${to + 1} of ${items.length}`)
  }

  return (
    <>
      <ul>
        {items.map((item, i) => (
          <li key={item.id}>
            {item.label}
            {/* aria-disabled, not disabled: a disabled button drops focus when the item reaches the end */}
            <button type="button" aria-label={`Move ${item.label} up`} aria-disabled={i === 0} onClick={() => move(i, i - 1)}>
              <IconChevronUp />
            </button>
            <button type="button" aria-label={`Move ${item.label} down`} aria-disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
              <IconChevronDown />
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>
    </>
  )
}
```

Stable `key`s keep the focused button attached to its item as the list re-renders, so focus travels with the moved item. Add pointer drag on top with a hook like the one below, and let both paths call the same `moveItem`.

```tsx
function useSortable<T>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const onDragStart = (index: number) => setDragIndex(index)
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    setItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(index, 0, moved)
      return next
    })
    setDragIndex(index)
  }
  const onDragEnd = () => setDragIndex(null)

  return { items, onDragStart, onDragOver, onDragEnd, dragIndex }
}
```
