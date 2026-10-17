# Component Rules — Canonical Patterns

## forwardRef Pattern

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...rest }, ref) => (
    <button ref={ref} type="button" {...rest}>
      {children}
    </button>
  )
)
Button.displayName = 'Button'
export { Button }
export type { ButtonProps }
```

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
  if (activeIndex < 0 || !listRef.current) return
  const el = listRef.current.querySelector(`#${getOptionId(activeIndex)}`)
  el?.scrollIntoView({ block: 'nearest' })
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

## Focus Trap (Modals & Dialogs)

```tsx
function useFocusTrap(ref: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0], last = focusable[focusable.length - 1]
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus() } }
    }
    el.addEventListener('keydown', trap)
    first?.focus()
    return () => el.removeEventListener('keydown', trap)
  }, [active, ref])
}
```

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
  sm: { height: '32px', padding: spacing[2], fontSize: typography.size.sm },
  md: { height: '40px', padding: spacing[3], fontSize: typography.size.md },
  lg: { height: '48px', padding: spacing[4], fontSize: typography.size.lg },
}

const variantConfig: Record<Variant, { bg: string; color: string; border: string }> = {
  primary: { bg: colors.brand.primary, color: colors.text.inverse, border: 'none' },
  secondary: { bg: 'transparent', color: colors.brand.primary, border: `1px solid ${colors.brand.primary}` },
}
```

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
const inputRef = useRef<HTMLInputElement>(null)

<input
  ref={inputRef}
  type="file"
  accept={accept}
  multiple={multiple}
  onChange={handleChange}
  style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
  tabIndex={-1}
  aria-hidden
/>
<Button onClick={() => inputRef.current?.click()}>
  Choose file
</Button>
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

Provide `aria-grabbed`, `aria-dropeffect` (or the newer `aria-roledescription` approach), and keyboard reorder support (e.g., Alt+Arrow) for accessible reordering.
