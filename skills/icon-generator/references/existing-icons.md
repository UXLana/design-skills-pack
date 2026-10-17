# Existing Icons Reference

## Current Icon Inventory

This is an example inventory showing the format; replace the names, file paths and counts with your design system's own icons.

### Shared Layout Icons (`/app/design-system/shared.tsx`)

These icons are used in the navigation sidebar:

#### Foundation Icons

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ![colors](colors) | `IconColors` | Half-filled circle | circle, path (vertical line), half-fill |
| ![typography](typography) | `IconTypography` | Text "T" shape | polyline (top), lines (stem, bottom) |
| ![spacing](spacing) | `IconSpacing` | Grid pattern | rect, 4 lines (grid) |
| ![radius](radius) | `IconRadius` | Corner brackets | 4 corner paths |
| ![shadows](shadows) | `IconShadows` | Layered rectangles | rect, offset path |
| ![breakpoints](breakpoints) | `IconBreakpoints` | Monitor display | rect, 2 lines (stand) |

#### Component Icons

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ![avatar](avatar) | `IconAvatar` | User silhouette | circle (head), path (shoulders) |
| ![button](button) | `IconButton` | Pill button | rect with rx, horizontal line |
| ![tab](tab) | `IconTab` | Tab interface | 2 lines, filled rect |
| ![banner](banner) | `IconBanner` | Message banner | rect, 2 lines (text) |

#### Section Icons

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ![foundations](foundations) | `IconFoundations` | 3D layers | polygon, 2 polylines |
| ![components](components) | `IconComponents` | 2x2 grid | 4 rects |
| ![chevron](chevron) | `IconChevron` | Directional arrow | polyline, rotatable |

---

### Banner Component Icons (`/components/Banner/Banner.tsx`)

Status indicator icons:

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ℹ️ | `InfoIcon` | Information circle | circle, center dot |
| ✓ | `SuccessIcon` | Checkmark circle | circle, polyline (check) |
| ⚠ | `WarningIcon` | Warning triangle | polygon, line, circle |
| ✕ | `ErrorIcon` | Error circle | circle, 2 diagonal lines |
| × | `CloseIcon` | Dismiss X | 2 diagonal lines |

---

### Button Component Icons (`/components/Button/Button.tsx`)

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ▼ | `DropdownIcon` | Dropdown chevron | path (arrow down) |
| ⟳ | `LoadingSpinner` | Animated spinner | circle (track + spinner) |

---

### Tab Component Icons (`/components/Tab/Tab.tsx`)

| Icon | Name | Description | SVG Elements |
|------|------|-------------|--------------|
| ‹ | `ChevronLeftIcon` | Scroll left | polyline |
| › | `ChevronRightIcon` | Scroll right | polyline |
| ▭ | `TabIcon` | Generic tab | rect, line |

---

### Demo/Example Icons (`/app/components/button/page.tsx`)

| Icon | Name | Description | Used In |
|------|------|-------------|---------|
| + | `IconPlus` | Add action | Button demos |
| 🏠 | `IconHome` | Home/dashboard | Button demos |
| ⚙ | `IconSettings` | Settings | Button demos |
| 🗑 | `IconTrash` | Delete action | Button demos |
| ✎ | `IconEdit` | Edit action | Button demos |

---

## SVG Code Reference

### IconColors
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="12" r="10" />
  <path d="M12 2v20" />
  <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.3" stroke="none" />
</svg>
```

### IconTypography
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <polyline points="4 7 4 4 20 4 20 7" />
  <line x1="9" y1="20" x2="15" y2="20" />
  <line x1="12" y1="4" x2="12" y2="20" />
</svg>
```

### IconSpacing
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <line x1="3" y1="9" x2="21" y2="9" />
  <line x1="3" y1="15" x2="21" y2="15" />
  <line x1="9" y1="3" x2="9" y2="21" />
  <line x1="15" y1="3" x2="15" y2="21" />
</svg>
```

### IconRadius
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 9V6a3 3 0 0 1 3-3h3" />
  <path d="M21 9V6a3 3 0 0 0-3-3h-3" />
  <path d="M21 15v3a3 3 0 0 1-3 3h-3" />
  <path d="M3 15v3a3 3 0 0 0 3 3h3" />
</svg>
```

### IconShadows
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="3" y="3" width="14" height="14" rx="2" />
  <path d="M7 21h12a2 2 0 0 0 2-2V7" opacity="0.4" />
</svg>
```

### IconBreakpoints
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="2" y="3" width="20" height="14" rx="2" />
  <line x1="8" y1="21" x2="16" y2="21" />
  <line x1="12" y1="17" x2="12" y2="21" />
</svg>
```

### IconAvatar
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="8" r="4" />
  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
</svg>
```

### IconButton
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="3" y="8" width="18" height="8" rx="4" />
  <line x1="8" y1="12" x2="16" y2="12" />
</svg>
```

### IconTab
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 6h18" />
  <path d="M3 12h18" />
  <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
</svg>
```

### IconBanner
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="2" y="4" width="20" height="16" rx="2" />
  <line x1="6" y1="8" x2="18" y2="8" />
  <line x1="6" y1="12" x2="14" y2="12" />
</svg>
```

### IconFoundations
```svg
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <polygon points="12 2 2 7 12 12 22 7 12 2" />
  <polyline points="2 17 12 22 22 17" />
  <polyline points="2 12 12 17 22 12" />
</svg>
```

### IconComponents
```svg
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="3" y="3" width="7" height="7" rx="1" />
  <rect x="14" y="3" width="7" height="7" rx="1" />
  <rect x="3" y="14" width="7" height="7" rx="1" />
  <rect x="14" y="14" width="7" height="7" rx="1" />
</svg>
```

### IconChevron
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <polyline points="9 18 15 12 9 6" />
</svg>
```

---

## Icon Categories Summary

| Category | Count | Location |
|----------|-------|----------|
| Navigation/Foundations | 6 | shared.tsx |
| Component indicators | 4 | shared.tsx |
| Section headers | 2 | shared.tsx |
| Utility | 1 | shared.tsx |
| Status indicators | 5 | Banner.tsx |
| Interactive | 2 | Button.tsx |
| Scroll controls | 3 | Tab.tsx |
| Demo icons | 5 | button/page.tsx |

**Total unique icons: ~28**

---

## Icons Needed

Based on common design system requirements, these icons are NOT yet in the library:

### High Priority
- [ ] Search / Magnifying glass
- [ ] Menu / Hamburger
- [ ] Close / X (standalone)
- [ ] Check / Checkmark (standalone)
- [ ] Arrow directions (up, down, left, right)
- [ ] External link
- [ ] Copy / Clipboard
- [ ] Download / Upload
- [ ] Eye / Visibility toggle
- [ ] Lock / Unlock

### Medium Priority
- [ ] Calendar / Date
- [ ] Clock / Time
- [ ] Filter / Funnel
- [ ] Sort arrows
- [ ] Refresh / Reload
- [ ] Expand / Collapse
- [ ] Drag handle
- [ ] More / Ellipsis
- [ ] Star / Favorite
- [ ] Heart / Like

### Future Consideration
- [ ] Social icons
- [ ] File type icons
- [ ] Weather icons
- [ ] Chart/graph icons
- [ ] Device icons
