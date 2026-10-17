# WCAG 2.2 AA Criteria Reference

Quick reference for WCAG 2.2 Level A and AA success criteria relevant to design systems.

> **Note on 4.1.1 Parsing:** This criterion was **removed in WCAG 2.2** and is intentionally omitted from this reference. If you encounter an older checklist or audit tool that flags 4.1.1, do not include it in findings for new work. Issues previously captured by 4.1.1 (duplicate IDs, malformed markup) are still worth fixing — report them under 4.1.2 Name/Role/Value if they affect AT, or as `[Best Practice]`.

> **508 conformance scope:** The 2017 Section 508 Refresh incorporates **WCAG 2.0 A + AA** by reference. WCAG 2.1 and 2.2 criteria (marked below) exceed the federal baseline. State contracts vary — some cite WCAG 2.1 AA or 2.2 AA directly. Confirm per contract.

## Perceivable

### 1.1 Text Alternatives
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 1.1.1 Non-text Content | A | All non-text content has text alternative |

### 1.3 Adaptable
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 1.3.1 Info and Relationships | A | Structure conveyed programmatically |
| 1.3.2 Meaningful Sequence | A | Reading order is logical |
| 1.3.3 Sensory Characteristics | A | Instructions don't rely solely on shape/size/location |
| 1.3.4 Orientation | AA | Content not restricted to single orientation |
| 1.3.5 Identify Input Purpose | AA | Input purpose can be programmatically determined |

### 1.4 Distinguishable
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 1.4.1 Use of Color | A | Color not sole means of conveying info |
| 1.4.2 Audio Control | A | Auto-playing audio can be paused/stopped |
| 1.4.3 Contrast (Minimum) | AA | **4.5:1 text**, 3:1 large text |
| 1.4.4 Resize Text | AA | Text resizable to 200% without loss |
| 1.4.5 Images of Text | AA | Use actual text, not images of text |
| 1.4.10 Reflow | AA | No horizontal scroll at 320px width |
| 1.4.11 Non-text Contrast | AA | **3:1 for UI components** and graphics |
| 1.4.12 Text Spacing | AA | No loss with increased spacing |
| 1.4.13 Content on Hover/Focus | AA | Dismissible, hoverable, persistent |

## Operable

### 2.1 Keyboard Accessible
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.1.1 Keyboard | A | All functionality via keyboard |
| 2.1.2 No Keyboard Trap | A | Focus can always move away |
| 2.1.4 Character Key Shortcuts | A | Single-key shortcuts can be turned off/remapped |

### 2.2 Enough Time
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.2.1 Timing Adjustable | A | Time limits can be extended |
| 2.2.2 Pause, Stop, Hide | A | Moving content can be controlled |

### 2.3 Seizures
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.3.1 Three Flashes | A | Nothing flashes >3 times/second |

### 2.4 Navigable
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.4.1 Bypass Blocks | A | Skip repeated content |
| 2.4.2 Page Titled | A | Pages have descriptive titles |
| 2.4.3 Focus Order | A | Focus order preserves meaning |
| 2.4.4 Link Purpose (In Context) | A | Link purpose clear from text/context |
| 2.4.5 Multiple Ways | AA | Multiple ways to find pages |
| 2.4.6 Headings and Labels | AA | Headings/labels are descriptive |
| 2.4.7 Focus Visible | AA | **Keyboard focus is visible** |
| 2.4.11 Focus Not Obscured (Min) | AA | Focus not entirely hidden (WCAG 2.2) |

### 2.5 Input Modalities
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 2.5.1 Pointer Gestures | A | Multi-point gestures have alternatives |
| 2.5.2 Pointer Cancellation | A | Down-event doesn't trigger action |
| 2.5.3 Label in Name | A | Visible label in accessible name |
| 2.5.4 Motion Actuation | A | Motion-triggered actions have alternatives |
| 2.5.7 Dragging Movements | AA | Drag has single-pointer alternative (WCAG 2.2) |
| 2.5.8 Target Size (Minimum) | AA | **24×24 CSS pixels minimum** (WCAG 2.2) |

## Understandable

### 3.1 Readable
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 3.1.1 Language of Page | A | Page language specified |
| 3.1.2 Language of Parts | AA | Language changes indicated |

### 3.2 Predictable
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 3.2.1 On Focus | A | Focus doesn't cause context change |
| 3.2.2 On Input | A | Input doesn't cause unexpected change |
| 3.2.3 Consistent Navigation | AA | Navigation consistent across pages |
| 3.2.4 Consistent Identification | AA | Same functionality identified consistently |
| 3.2.6 Consistent Help | A | Help in consistent location (WCAG 2.2) |

### 3.3 Input Assistance
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 3.3.1 Error Identification | A | Errors identified and described |
| 3.3.2 Labels or Instructions | A | Labels/instructions provided |
| 3.3.3 Error Suggestion | AA | Suggest corrections when known |
| 3.3.4 Error Prevention (Legal/Financial) | AA | Confirm/review critical submissions |
| 3.3.7 Redundant Entry | A | Don't re-request same info (WCAG 2.2) |
| 3.3.8 Accessible Authentication (Min) | AA | No cognitive tests for auth (WCAG 2.2) |

## Robust

### 4.1 Compatible
| Criterion | Level | Requirement |
|-----------|-------|-------------|
| 4.1.2 Name, Role, Value | A | Components have accessible name/role/state |
| 4.1.3 Status Messages | AA | Status messages announced to AT |

## Key Thresholds for Design Systems

```
Text contrast:           4.5:1  (1.4.3)
Large text contrast:     3:1    (1.4.3)  — ≥18pt or ≥14pt bold
UI component contrast:   3:1    (1.4.11)
Focus indicator:         3:1    (1.4.11)
Minimum target size:     24×24px (2.5.8)
Enhanced target size:    44×44px (2.5.5 AAA)
Zoom support:            200%   (1.4.4)
Reflow width:            320px  (1.4.10)
```
