# Component Templates

## Contents

- React version note (read first)
- Template A — Interactive Atom (Button)
- Template B — Form Field Molecule
- Template C — Modal / Dialog Organism (native `<dialog>`)
- Template D — Controlled / Uncontrolled Molecule (Switch)
- Template E — Composite Organism (Upload)
- Composition Patterns

## React version note

These templates target **React 19**: `ref` is a regular prop, already included in `ComponentProps<'button'>`, so components are plain functions.

If the repo's `react` peer dependency is **18**, change each template the same way: wrap the function in `forwardRef<HTMLButtonElement, Props>((props, ref) => …)`, switch `ComponentProps<'x'>` to `ComponentPropsWithoutRef<'x'>`, take `ref` from `forwardRef`'s second argument instead of props, and set `Component.displayName`. Template C's `useImperativeHandle(ref, …)` stays as it is. See "Ref Pattern" in `component-rules.md`.

Token names (`sizing.control.md`, `borderWidth.thin`, `opacity.disabled`, …) are illustrative. Use the real names from the repo's token file, and the repo's own `Spinner`, `VisuallyHidden`, and icon components. If one is missing, build it first (step 2 of the workflow); get missing icons from the icon-generator skill.

## Template A — Interactive Atom (Button)

Full-featured atom with size, variant, emphasis, loading, disabled, icon-only a11y, and a ref.

```tsx
'use client'

import type { ComponentProps, ReactNode } from 'react'
import { colors, spacing, borderRadius, borderWidth, typography, transitionPresets, sizing, opacity } from '@/styles/design-tokens'
import { Spinner } from '@/components/Spinner'
import { VisuallyHidden } from '@/components/VisuallyHidden'

// --- Types ---
type Size = 'sm' | 'md' | 'lg'
type Variant = 'primary' | 'secondary' | 'ghost'
type Emphasis = 'high' | 'mid' | 'low'

type BaseProps = {
  size?: Size
  variant?: Variant
  emphasis?: Emphasis
  loading?: boolean
  fullWidth?: boolean
  onDark?: boolean
}

type WithChildren = BaseProps & { children: ReactNode; 'aria-label'?: string }
type IconOnly = BaseProps & { children?: never; 'aria-label': string }

// `type` stays in the props so consumers can render a submit button.
type ButtonProps = (WithChildren | IconOnly) & ComponentProps<'button'>

// --- Configs ---
const sizeConfig: Record<Size, { height: string; px: string; fontSize: string; iconSize: number }> = {
  sm: { height: sizing.control.sm, px: spacing[3], fontSize: typography.size.sm, iconSize: sizing.icon.sm },
  md: { height: sizing.control.md, px: spacing[4], fontSize: typography.size.md, iconSize: sizing.icon.md },
  lg: { height: sizing.control.lg, px: spacing[5], fontSize: typography.size.lg, iconSize: sizing.icon.lg },
}

const variantConfig: Record<Variant, { bg: string; color: string; border: string }> = {
  primary:   { bg: colors.brand.primary, color: colors.text.inverse, border: 'none' },
  secondary: { bg: 'transparent', color: colors.brand.primary, border: `${borderWidth.thin} solid ${colors.brand.primary}` },
  ghost:     { bg: 'transparent', color: colors.brand.primary, border: 'none' },
}

// --- Component ---
function Button({
  size = 'md', variant = 'primary', emphasis = 'high', loading, fullWidth, disabled, onDark,
  type = 'button', ref, children, style, ...rest
}: ButtonProps) {
  const s = sizeConfig[size]
  const v = variantConfig[variant]

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2],
        height: s.height, padding: `0 ${s.px}`, fontSize: s.fontSize,
        backgroundColor: v.bg, color: v.color, border: v.border,
        borderRadius: borderRadius.md,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? opacity.disabled : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: transitionPresets.colorShift,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size={s.iconSize} />
          {/* Keep the visible label as the accessible name while the spinner shows.
              Icon-only buttons keep their aria-label. */}
          <VisuallyHidden>{children}</VisuallyHidden>
        </>
      ) : children}
    </button>
  )
}

export { Button }
export type { ButtonProps }
```

`Spinner` is decorative (`aria-hidden`) by default; `aria-busy` tells assistive technology the button is working.

## Template B — Form Field Molecule

Composed molecule with label, helper text, error state, and `aria-describedby` merging.

```tsx
'use client'

import { useId, type ComponentProps } from 'react'
import { colors, spacing, borderRadius, borderWidth, typography } from '@/styles/design-tokens'

interface FormFieldProps extends Omit<ComponentProps<'input'>, 'size'> {
  label: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

function FormField({
  label, helperText, error, size = 'md', id: idProp, ref,
  'aria-describedby': externalDescribedBy, ...rest
}: FormFieldProps) {
  const reactId = useId()
  const id = idProp ?? reactId
  const helperId = helperText ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined

  const describedByParts = [
    externalDescribedBy,
    error ? errorId : helperId,
  ].filter(Boolean).join(' ') || undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
      <label htmlFor={id} style={{ fontSize: typography.size.sm, fontWeight: typography.weight.medium }}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={describedByParts}
        aria-errormessage={error ? errorId : undefined}
        style={{
          padding: spacing[2],
          border: `${borderWidth.thin} solid ${error ? colors.feedback.error : colors.border.default}`,
          borderRadius: borderRadius.md,
          fontSize: typography.size[size],
        }}
        {...rest}
      />
      {helperText && !error && (
        <span id={helperId} style={{ fontSize: typography.size.xs, color: colors.text.secondary }}>
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" style={{ fontSize: typography.size.xs, color: colors.feedback.error }}>
          {error}
        </span>
      )}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
```

## Template C — Modal / Dialog Organism (native `<dialog>`)

Organism built on `<dialog>` + `showModal()`: the browser makes the page behind inert, handles Escape, and renders the dialog in the top layer (no portal, no z-index). The component adds a `useId` title, focus return to the opener, state sync on close, a close button, scroll lock, and backdrop-click close.

```tsx
'use client'

import { useEffect, useId, useImperativeHandle, useRef, type ComponentProps, type ReactNode } from 'react'
import { colors, spacing, borderRadius, sizing } from '@/styles/design-tokens'
import { IconClose } from '@/components/Icons'
import styles from './Modal.module.css'

interface ModalProps extends Omit<ComponentProps<'dialog'>, 'open' | 'title' | 'onClose' | 'children'> {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function Modal({ isOpen, onClose, title, children, ref, className, style, ...rest }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // Give the consumer the real <dialog> node; works with object and callback refs.
  useImperativeHandle(ref, () => dialogRef.current!, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()

    // showModal() doesn't stop the page behind from scrolling.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
      // Return focus to whatever opened the dialog, if it is still on the page.
      if (opener?.isConnected) opener.focus()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Fires after Escape, close(), and backdrop clicks, so isOpen stays in sync.
      // The open check skips a stale close event (e.g. from Strict Mode's re-run of the effect).
      onClose={() => { if (!dialogRef.current?.open) onClose() }}
      // A click whose target is the <dialog> itself landed on the backdrop,
      // because the inner div fills the dialog.
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      style={{
        padding: 0, border: 'none',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface.primary,
        width: sizing.dialog.md,
        maxWidth: `calc(100vw - 2 * ${spacing[4]})`,
        ...style,
      }}
      {...rest}
    >
      <div style={{ padding: spacing[6], display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] }}>
          <h2 id={titleId} style={{ margin: 0 }}>{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

export { Modal }
export type { ModalProps }
```

```css
/* Modal.module.css — ::backdrop can't be set with inline styles */
.dialog::backdrop {
  background: var(--color-overlay-scrim); /* the scrim token, exposed as a CSS variable */
}
```

Put `autoFocus` on the field or button the user should reach first; without it the browser focuses the first focusable element (here, the close button).

## Template D — Controlled / Uncontrolled Molecule (Switch)

Demonstrates the `useControllable` hook for components that support both modes.

```tsx
'use client'

import { useState, useCallback, type ComponentProps } from 'react'
import { colors, opacity, transitionPresets, sizing } from '@/styles/design-tokens'

// --- useControllable hook ---
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

// --- Types ---
interface ToggleProps extends Omit<ComponentProps<'button'>, 'onChange' | 'value' | 'defaultValue'> {
  value?: boolean
  defaultValue?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

// --- Component ---
function Toggle({ value, defaultValue = false, onChange, size = 'md', disabled, ref, ...rest }: ToggleProps) {
  const [checked, setChecked] = useControllable(value, defaultValue, onChange)

  // Track and thumb dimensions come from tokens: { width, height, inset } in px.
  const s = sizing.switch[size]
  const thumbSize = s.height - s.inset * 2
  const offset = checked ? s.width - thumbSize - s.inset : s.inset

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && setChecked(!checked)}
      style={{
        position: 'relative', width: s.width, height: s.height, borderRadius: s.height / 2,
        backgroundColor: checked ? colors.brand.primary : colors.border.default,
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? opacity.disabled : 1,
        transition: transitionPresets.colorShift,
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', top: s.inset, left: offset,
          width: thumbSize, height: thumbSize, borderRadius: '50%',
          backgroundColor: colors.surface.primary,
          transition: transitionPresets.slideIn,
        }}
      />
    </button>
  )
}

export { Toggle }
export type { ToggleProps }
```

## Template E — Composite Organism (Multi-File / Multi-State)

Organism composed of multiple sub-components, managing async status, size/variant configs, and status-driven rendering. Use for Upload, DataTable, Wizard, etc.

```tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import { colors, spacing, borderRadius, borderWidth, typography, transitionPresets, opacity } from '@/styles/design-tokens'
import { Button } from '@/components/Button'
import { IconClose } from '@/components/Icons'
import { VisuallyHidden } from '@/components/VisuallyHidden'

// --- Status Enum ---
type UploadStatus = 'idle' | 'uploading' | 'complete' | 'error'

// --- Size & Variant Configs ---
type Size = 'sm' | 'md' | 'lg'
type Variant = 'dropzone' | 'button' | 'inline'

const sizeConfig: Record<Size, { padding: string; fontSize: string; gap: string }> = {
  sm: { padding: spacing[3], fontSize: typography.size.sm, gap: spacing[2] },
  md: { padding: spacing[4], fontSize: typography.size.md, gap: spacing[3] },
  lg: { padding: spacing[6], fontSize: typography.size.lg, gap: spacing[4] },
}

const variantConfig: Record<Variant, { border: string; bg: string; hoverBg: string }> = {
  dropzone: { border: `${borderWidth.thick} dashed ${colors.border.default}`, bg: colors.surface.secondary, hoverBg: colors.surface.tertiary },
  button:   { border: 'none', bg: 'transparent', hoverBg: 'transparent' },
  inline:   { border: `${borderWidth.thin} solid ${colors.border.default}`, bg: colors.surface.primary, hoverBg: colors.surface.secondary },
}

// --- Status-to-prop mappings ---
const statusColorMap: Record<UploadStatus, string> = {
  idle: colors.text.secondary,
  uploading: colors.brand.primary,
  complete: colors.feedback.success,
  error: colors.feedback.error,
}

// --- File item sub-component (internal) ---
interface FileItemProps {
  name: string
  status: UploadStatus
  progress?: number
  onRemove?: () => void
  size: Size
}

function FileItem({ name, status, progress, onRemove, size }: FileItemProps) {
  const s = sizeConfig[size]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, padding: s.padding, fontSize: s.fontSize }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      {status === 'uploading' && progress != null && (
        <span style={{ color: statusColorMap[status], fontSize: typography.size.xs }}>{Math.round(progress)}%</span>
      )}
      <span style={{ color: statusColorMap[status], fontSize: typography.size.xs }}>{status}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${name}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, padding: spacing[1] }}>
          <IconClose size="sm" />
        </button>
      )}
    </div>
  )
}

// --- Main component ---
interface UploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  size?: Size
  variant?: Variant
  onUpload?: (files: File[]) => Promise<void>
  disabled?: boolean
}

function Upload({ accept, multiple = true, maxFiles = 10, size = 'md', variant = 'dropzone', onUpload, disabled }: UploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isActive = status === 'uploading'

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const selected = Array.from(incoming).slice(0, maxFiles)
    setFiles(selected)
    setStatus('idle')
  }, [maxFiles])

  const handleUpload = useCallback(async () => {
    if (!files.length || !onUpload) return
    setStatus('uploading')
    setProgress(0)
    try {
      await onUpload(files)
      setStatus('complete')
    } catch {
      setStatus('error')
    }
  }, [files, onUpload])

  const s = sizeConfig[size]
  const v = variantConfig[variant]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: s.gap }}>
      {/* Hidden native input */}
      <input
        ref={inputRef} type="file" accept={accept} multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
        tabIndex={-1} aria-hidden="true"
      />

      {/* Drop zone / trigger */}
      <div
        role="button" tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && !isActive && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: s.padding, fontSize: s.fontSize, gap: s.gap,
          border: v.border, backgroundColor: v.bg, borderRadius: borderRadius.md,
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? opacity.disabled : 1,
          transition: transitionPresets.colorShift,
        }}
      >
        <span>Drop files here or click to browse</span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {files.map((file, i) => (
            <li key={`${file.name}-${file.size}`}>
              <FileItem
                name={file.name}
                status={status}
                progress={isActive ? progress : undefined}
                onRemove={isActive ? undefined : () => setFiles(fs => fs.filter((_, idx) => idx !== i))}
                size={size}
              />
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && status !== 'complete' && (
        <Button onClick={handleUpload} loading={isActive} disabled={disabled}>
          Upload {files.length === 1 ? 'file' : `${files.length} files`}
        </Button>
      )}

      {/* Status announcement for screen readers: mounted once, only its text changes */}
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {status === 'complete' && 'Upload complete'}
        {status === 'error' && 'Upload failed'}
      </VisuallyHidden>
    </div>
  )
}

export { Upload }
export type { UploadProps }
```

### Key patterns demonstrated in Template E:
- **Status enum** with derived booleans (`isActive`)
- **Size + variant configs** as typed `Record` objects, every value from a token
- **Status-to-prop mapping** (`statusColorMap`) for declarative rendering
- **Prop gating** (`onRemove={isActive ? undefined : handler}`) to signal interactivity
- **Hidden native input** with visible trigger for file selection
- **`aria-live` region** for async status announcements
- **Internal sub-component** (`FileItem`) not exported publicly
- **Collection rendering** with stable keys
- **Icons from the icon set**, never text glyphs or emoji

## Composition Patterns

### Namespace Exports (Compound Components)

```tsx
// Tabs/index.ts
import { Tabs as TabsRoot } from './Tabs'
import { TabList } from './TabList'
import { Tab } from './Tab'
import { TabPanel } from './TabPanel'

const Tabs = Object.assign(TabsRoot, { TabList, Tab, TabPanel })
export { Tabs }
```

### Slot-Based Composition

```tsx
interface CardProps {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

function Card({ header, footer, children }: CardProps) {
  const divider = `${borderWidth.thin} solid ${colors.border.default}`
  return (
    <div style={{ borderRadius: borderRadius.lg, border: divider }}>
      {header && <div style={{ padding: spacing[4], borderBottom: divider }}>{header}</div>}
      <div style={{ padding: spacing[4] }}>{children}</div>
      {footer && <div style={{ padding: spacing[4], borderTop: divider }}>{footer}</div>}
    </div>
  )
}
```

### Render Prop for Custom Rendering

```tsx
interface SelectProps<T> {
  items: T[]
  renderItem: (item: T, isSelected: boolean) => ReactNode
  value: T
  onChange: (item: T) => void
}
```
