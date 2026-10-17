# Component Templates

## Template A — Interactive Atom (Button / Toggle)

Full-featured atom with size, variant, emphasis, loading, disabled, icon-only a11y, and forwardRef.

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { colors, spacing, borderRadius, typography, transitionPresets } from '@/styles/design-tokens'

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

type WithChildren = BaseProps & { children: React.ReactNode; 'aria-label'?: string }
type IconOnly = BaseProps & { children?: never; 'aria-label': string }

type ButtonProps = (WithChildren | IconOnly) & Omit<ComponentPropsWithoutRef<'button'>, 'type'>

// --- Configs ---
const sizeConfig: Record<Size, { height: string; px: string; fontSize: string; iconSize: number }> = {
  sm: { height: '32px', px: spacing[3], fontSize: typography.size.sm, iconSize: 16 },
  md: { height: '40px', px: spacing[4], fontSize: typography.size.md, iconSize: 20 },
  lg: { height: '48px', px: spacing[5], fontSize: typography.size.lg, iconSize: 24 },
}

const variantConfig: Record<Variant, { bg: string; color: string; border: string }> = {
  primary:   { bg: colors.brand.primary, color: colors.text.inverse, border: 'none' },
  secondary: { bg: 'transparent', color: colors.brand.primary, border: `1px solid ${colors.brand.primary}` },
  ghost:     { bg: 'transparent', color: colors.brand.primary, border: 'none' },
}

// --- Component ---
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'md', variant = 'primary', emphasis = 'high', loading, fullWidth, disabled, onDark, children, style, ...rest }, ref) => {
    const s = sizeConfig[size]
    const v = variantConfig[variant]

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2],
          height: s.height, padding: `0 ${s.px}`, fontSize: s.fontSize,
          backgroundColor: v.bg, color: v.color, border: v.border,
          borderRadius: borderRadius.md,
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          transition: transitionPresets.colorShift,
          ...style,
        }}
        {...rest}
      >
        {loading ? (
          <>
            <span aria-hidden="true">⏳</span>
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              {typeof children === 'string' ? children : rest['aria-label'] || 'Loading'}
            </span>
          </>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
export type { ButtonProps }
```

## Template B — Form Field Molecule

Composed molecule with label, helper text, error state, and `aria-describedby` merging.

```tsx
'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { colors, spacing, typography } from '@/styles/design-tokens'

interface FormFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, helperText, error, size = 'md', id: idProp, 'aria-describedby': externalDescribedBy, ...rest }, ref) => {
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
            border: `1px solid ${error ? colors.feedback.error : colors.border.default}`,
            borderRadius: '6px',
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
)
FormField.displayName = 'FormField'
export { FormField }
export type { FormFieldProps }
```

## Template C — Modal / Dialog Organism

Organism with portal, focus trap, scroll lock, Escape dismiss, and ARIA dialog semantics.

```tsx
'use client'

import { forwardRef, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { colors, spacing, borderRadius } from '@/styles/design-tokens'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, title, children }, ref) => {
  const internalRef = useRef<HTMLDivElement>(null)
  const dialogRef = (ref as React.RefObject<HTMLDivElement>) || internalRef

  // Escape dismiss
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return
    const el = dialogRef.current
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
  }, [isOpen, dialogRef])

  if (!isOpen) return null

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          backgroundColor: colors.surface.primary, borderRadius: borderRadius.lg,
          padding: spacing[6], minWidth: '400px', maxWidth: '90vw',
        }}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  )
})
Modal.displayName = 'Modal'
export { Modal }
export type { ModalProps }
```

## Template D — Controlled / Uncontrolled Molecule

Demonstrates the `useControllable` hook for components that support both modes.

```tsx
'use client'

import { forwardRef, useState, useCallback, type ComponentPropsWithoutRef } from 'react'
import { colors, spacing, borderRadius, transitionPresets } from '@/styles/design-tokens'

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
interface ToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  value?: boolean
  defaultValue?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

// --- Component ---
const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ value, defaultValue = false, onChange, size = 'md', disabled, ...rest }, ref) => {
    const [checked, setChecked] = useControllable(value, defaultValue, onChange)

    const sizes = { sm: { w: 36, h: 20 }, md: { w: 44, h: 24 }, lg: { w: 52, h: 28 } }
    const s = sizes[size]
    const thumbSize = s.h - 4
    const offset = checked ? s.w - thumbSize - 2 : 2

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && setChecked(!checked)}
        style={{
          position: 'relative', width: s.w, height: s.h, borderRadius: s.h / 2,
          backgroundColor: checked ? colors.brand.primary : colors.border.default,
          border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: transitionPresets.colorShift,
        }}
        {...rest}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute', top: 2, left: offset,
            width: thumbSize, height: thumbSize, borderRadius: '50%',
            backgroundColor: colors.surface.primary,
            transition: transitionPresets.slideIn,
          }}
        />
      </button>
    )
  }
)
Toggle.displayName = 'Toggle'
export { Toggle }
export type { ToggleProps }
```

## Template E — Composite Organism (Multi-File / Multi-State)

Organism composed of multiple sub-components, managing async status, size/variant configs, and status-driven rendering. Use for Upload, DataTable, Wizard, etc.

```tsx
'use client'

import { useState, useCallback, useRef, type ReactNode } from 'react'
import { colors, spacing, borderRadius, typography, transitionPresets } from '@/styles/design-tokens'

// --- Status Enum ---
type UploadStatus = 'idle' | 'uploading' | 'complete' | 'error'

// --- Size & Variant Configs ---
type Size = 'sm' | 'md' | 'lg'
type Variant = 'dropzone' | 'button' | 'inline'

const sizeConfig: Record<Size, { padding: string; fontSize: string; iconSize: number; gap: string }> = {
  sm: { padding: spacing[3], fontSize: typography.size.sm, iconSize: 16, gap: spacing[2] },
  md: { padding: spacing[4], fontSize: typography.size.md, iconSize: 20, gap: spacing[3] },
  lg: { padding: spacing[6], fontSize: typography.size.lg, iconSize: 24, gap: spacing[4] },
}

const variantConfig: Record<Variant, { border: string; bg: string; hoverBg: string }> = {
  dropzone: { border: `2px dashed ${colors.border.default}`, bg: colors.surface.secondary, hoverBg: colors.surface.tertiary },
  button:   { border: 'none', bg: 'transparent', hoverBg: 'transparent' },
  inline:   { border: `1px solid ${colors.border.default}`, bg: colors.surface.primary, hoverBg: colors.surface.secondary },
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
          ✕
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
  const isDone = status === 'complete' || status === 'error'

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
        tabIndex={-1} aria-hidden
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
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
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

      {/* Status announcement for screen readers */}
      <div aria-live="polite" aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {status === 'complete' && 'Upload complete'}
        {status === 'error' && 'Upload failed'}
      </div>
    </div>
  )
}

export { Upload }
export type { UploadProps }
```

### Key patterns demonstrated in Template E:
- **Status enum** with derived booleans (`isActive`, `isDone`)
- **Size + variant configs** as typed `Record` objects
- **Status-to-prop mapping** (`statusColorMap`) for declarative rendering
- **Prop gating** (`onRemove={isActive ? undefined : handler}`) to signal interactivity
- **Hidden native input** with visible trigger for file selection
- **`aria-live` region** for async status announcements
- **Internal sub-component** (`FileItem`) not exported publicly
- **Collection rendering** with stable keys

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
  return (
    <div style={{ borderRadius: borderRadius.lg, border: `1px solid ${colors.border.default}` }}>
      {header && <div style={{ padding: spacing[4], borderBottom: `1px solid ${colors.border.default}` }}>{header}</div>}
      <div style={{ padding: spacing[4] }}>{children}</div>
      {footer && <div style={{ padding: spacing[4], borderTop: `1px solid ${colors.border.default}` }}>{footer}</div>}
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
