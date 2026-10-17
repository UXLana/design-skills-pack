# WCAG 2.2 AA Criteria Reference

Quick reference for every WCAG 2.2 Level A and AA success criterion. The **Since** column gives the version that added each criterion, so you can tell which ones a WCAG 2.0 target (Section 508) or a WCAG 2.1 target (ADA Title II, EN 301 549 v3.2.1) actually requires. Requirement text is a summary — check the W3C Understanding document before citing an edge case.

> **Which criteria a target requires:**
> - **WCAG 2.0 A + AA** (Section 508) — every row tagged 2.0, *including* 4.1.1 Parsing.
> - **WCAG 2.1 A + AA** (ADA Title II, EN 301 549 v3.2.1) — rows tagged 2.0 and 2.1, including 4.1.1.
> - **WCAG 2.2 A + AA** (Standard mode; EN 301 549 v4.1.1 once cited) — every row below; 4.1.1 is removed.
>
> **4.1.1 Parsing:** removed in WCAG 2.2, so it is not listed in the tables. For 2.0 and 2.1 targets, report it as Supports: W3C's note says it should be considered always satisfied for HTML and XML content, and the Access Board's ICT Testing Baseline records it as a pass. File duplicate-ID or nesting problems that affect users under 1.3.1 or 4.1.2.

## Perceivable

### 1.1 Text Alternatives
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 1.1.1 Non-text Content | A | 2.0 | All non-text content has a text alternative |

### 1.2 Time-based Media
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | 2.0 | Transcript for audio-only; transcript or audio track for video-only |
| 1.2.2 Captions (Prerecorded) | A | 2.0 | Captions for prerecorded audio in synchronized media |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | 2.0 | Audio description or a full text alternative for prerecorded video |
| 1.2.4 Captions (Live) | AA | 2.0 | Captions for live audio in synchronized media |
| 1.2.5 Audio Description (Prerecorded) | AA | 2.0 | Audio description for prerecorded video |

### 1.3 Adaptable
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 1.3.1 Info and Relationships | A | 2.0 | Structure conveyed programmatically |
| 1.3.2 Meaningful Sequence | A | 2.0 | Reading order is logical |
| 1.3.3 Sensory Characteristics | A | 2.0 | Instructions don't rely solely on shape/size/location/sound |
| 1.3.4 Orientation | AA | 2.1 | Content not restricted to a single orientation |
| 1.3.5 Identify Input Purpose | AA | 2.1 | Purpose of fields collecting the user's own data is programmatically determinable |

### 1.4 Distinguishable
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 1.4.1 Use of Color | A | 2.0 | Color not the sole means of conveying info |
| 1.4.2 Audio Control | A | 2.0 | Auto-playing audio (over 3 s) can be paused/stopped |
| 1.4.3 Contrast (Minimum) | AA | 2.0 | **4.5:1 text**, 3:1 large text (≥18pt, or ≥14pt bold) |
| 1.4.4 Resize Text | AA | 2.0 | Text resizes to 200% without loss of content or function (px sizes are fine if zoom works) |
| 1.4.5 Images of Text | AA | 2.0 | Use real text, not images of text |
| 1.4.10 Reflow | AA | 2.1 | No two-dimensional scrolling at 320 CSS px wide (or 256 CSS px tall for horizontal content) |
| 1.4.11 Non-text Contrast | AA | 2.1 | **3:1 against adjacent colors** for UI components, states (including focus) and meaningful graphics |
| 1.4.12 Text Spacing | AA | 2.1 | No loss when users override line, paragraph, letter and word spacing |
| 1.4.13 Content on Hover or Focus | AA | 2.1 | Dismissible, hoverable, persistent |

## Operable

### 2.1 Keyboard Accessible
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.1.1 Keyboard | A | 2.0 | All functionality via keyboard |
| 2.1.2 No Keyboard Trap | A | 2.0 | Focus can always move away |
| 2.1.4 Character Key Shortcuts | A | 2.1 | Single-key shortcuts can be turned off/remapped |

### 2.2 Enough Time
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.2.1 Timing Adjustable | A | 2.0 | Time limits can be turned off, adjusted, or extended (warning plus at least 20 s to extend) |
| 2.2.2 Pause, Stop, Hide | A | 2.0 | Moving, blinking or auto-updating content can be controlled |

### 2.3 Seizures and Physical Reactions
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.3.1 Three Flashes or Below Threshold | A | 2.0 | Nothing flashes more than 3 times per second |

### 2.4 Navigable
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.4.1 Bypass Blocks | A | 2.0 | Skip repeated content |
| 2.4.2 Page Titled | A | 2.0 | Pages have descriptive titles |
| 2.4.3 Focus Order | A | 2.0 | Focus order preserves meaning |
| 2.4.4 Link Purpose (In Context) | A | 2.0 | Link purpose clear from text/context |
| 2.4.5 Multiple Ways | AA | 2.0 | Multiple ways to find pages |
| 2.4.6 Headings and Labels | AA | 2.0 | Headings/labels are descriptive |
| 2.4.7 Focus Visible | AA | 2.0 | **Keyboard focus is visible** |
| 2.4.11 Focus Not Obscured (Minimum) | AA | 2.2 | Focused component not entirely hidden by author content |

### 2.5 Input Modalities
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 2.5.1 Pointer Gestures | A | 2.1 | Multipoint/path gestures have single-pointer alternatives |
| 2.5.2 Pointer Cancellation | A | 2.1 | Down-event doesn't trigger action (or it can be aborted/undone) |
| 2.5.3 Label in Name | A | 2.1 | Visible label is part of the accessible name |
| 2.5.4 Motion Actuation | A | 2.1 | Motion-triggered actions have alternatives and can be disabled |
| 2.5.7 Dragging Movements | AA | 2.2 | Drag has a single-pointer alternative |
| 2.5.8 Target Size (Minimum) | AA | 2.2 | **24×24 CSS px**, unless the Spacing, Equivalent, Inline, User-agent or Essential exception applies |

## Understandable

### 3.1 Readable
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 3.1.1 Language of Page | A | 2.0 | Page language specified |
| 3.1.2 Language of Parts | AA | 2.0 | Language changes indicated |

### 3.2 Predictable
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 3.2.1 On Focus | A | 2.0 | Focus doesn't cause a change of context |
| 3.2.2 On Input | A | 2.0 | Input doesn't cause an unexpected change of context |
| 3.2.3 Consistent Navigation | AA | 2.0 | Navigation consistent across pages |
| 3.2.4 Consistent Identification | AA | 2.0 | Same functionality identified consistently |
| 3.2.6 Consistent Help | A | 2.2 | Help mechanisms in the same relative order across pages |

### 3.3 Input Assistance
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 3.3.1 Error Identification | A | 2.0 | Errors identified and described in text |
| 3.3.2 Labels or Instructions | A | 2.0 | Labels/instructions provided |
| 3.3.3 Error Suggestion | AA | 2.0 | Suggest corrections when known |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | 2.0 | Submissions are reversible, checked, or confirmed |
| 3.3.7 Redundant Entry | A | 2.2 | Don't re-request info already given in the same process |
| 3.3.8 Accessible Authentication (Minimum) | AA | 2.2 | No cognitive function test to authenticate unless there's an alternative or mechanism; object and personal-content recognition allowed |

## Robust

### 4.1 Compatible
| Criterion | Level | Since | Requirement |
|-----------|-------|-------|-------------|
| 4.1.2 Name, Role, Value | A | 2.0 | Components expose accessible name/role/state |
| 4.1.3 Status Messages | AA | 2.1 | Status messages announced to AT without moving focus |

## Key Thresholds for Design Systems

```
Text contrast:           4.5:1   (1.4.3)
Large text contrast:     3:1     (1.4.3)  — ≥18pt (24px) or ≥14pt (≈18.66px) bold
UI component contrast:   3:1     (1.4.11) — against adjacent colors
Focus indicator:         3:1     (1.4.11) — against the colors next to the indicator
Minimum target size:     24×24px (2.5.8)  — or meet an exception
Enhanced target size:    44×44px (2.5.5 AAA)
Zoom support:            200%    (1.4.4)
Reflow width:            320px   (1.4.10)
Time-limit extension:    ≥20 s warning, simple action (2.2.1)
```

Compare contrast ratios unrounded (4.499:1 fails 4.5:1). The WCAG 2 ratio is the conformance test; APCA is not part of WCAG 2.
