# Timing & Motion

## Core Requirements

| Requirement | WCAG Criterion | Level | Status |
|-------------|----------------|-------|--------|
| Pause, stop, hide moving content | 2.2.2 | A | Required |
| No flashing >3/second | 2.3.1 | A | Required |
| Timing adjustable | 2.2.1 | A | Required |
| Animation from interactions (disable non-essential motion) | 2.3.3 | AAA | Not required at AA |
| Respect `prefers-reduced-motion` | (supports 2.2.2 + 2.3.1) | — | **Best practice — no single AA criterion** |

> **Important:** `prefers-reduced-motion` is NOT itself a WCAG 2.2 AA requirement. Do not cite it as a WCAG failure. Cite it as a **best practice that supports** 2.2.2 (for auto-playing content) and 2.3.1 (by reducing seizure risk from motion), or as 2.3.3 if calling out at AAA level. For government-contract audits, or any design system that mandates it, reduced-motion support is effectively mandatory as a DS quality gate — label findings as `[Best Practice — DS Requirement]`, not as WCAG failures.

## Reduced Motion

### Detecting User Preference

```tsx
// CSS media query
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// JavaScript detection
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// React hook
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

### Implementation Patterns

```tsx
// Token-based motion system
const motionTokens = {
  'motion.instant': '0ms',
  'motion.fast': '150ms',
  'motion.normal': '300ms',
  'motion.slow': '500ms',
};

// Reduced motion overrides
const reducedMotionTokens = {
  'motion.instant': '0ms',
  'motion.fast': '0ms',
  'motion.normal': '0ms',
  'motion.slow': '0ms',
};

// Component usage
function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: prefersReducedMotion ? 0 : 0.3 
      }}
    >
      Content
    </motion.div>
  );
}
```

### CSS Implementation

```css
/* Default animations */
.fade-in {
  animation: fadeIn 300ms ease-out;
}

.slide-in {
  animation: slideIn 300ms ease-out;
}

/* Reduced motion: instant transitions */
@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .slide-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  /* Or use minimal opacity change */
  .fade-in {
    animation: fadeInReduced 10ms;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInReduced {
  from { opacity: 0.9; }
  to { opacity: 1; }
}
```

## Auto-Playing Content

### Requirements
- Auto-playing content must have pause/stop controls
- Content moving for more than 5 seconds must be controllable
- Applies to: carousels, videos, animations, auto-updating feeds

### Implementation

```tsx
// Auto-playing carousel with controls
function Carousel({ slides, autoPlay = true }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Don't auto-play if user prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  return (
    <div role="region" aria-label="Image carousel" aria-roledescription="carousel">
      <div aria-live="polite">
        Slide {currentSlide + 1} of {slides.length}
      </div>
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${slides.length}`}
          hidden={index !== currentSlide}
        >
          {slide}
        </div>
      ))}
      
      {/* Controls */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      
      <button onClick={() => setCurrentSlide(prev => prev - 1)}>
        Previous
      </button>
      <button onClick={() => setCurrentSlide(prev => prev + 1)}>
        Next
      </button>
    </div>
  );
}
```

### Video/Audio

```tsx
// Video with accessible controls
<video 
  controls 
  aria-label="Product demonstration video"
  preload="metadata"
>
  <source src="demo.mp4" type="video/mp4" />
  <track 
    kind="captions" 
    src="captions.vtt" 
    srcLang="en" 
    label="English captions" 
    default 
  />
</video>

// Custom video player must include:
// - Play/Pause button
// - Progress indicator
// - Volume control
// - Captions toggle
// - Keyboard controls
```

## Flashing Content

### Critical Rule
**Nothing flashes more than 3 times per second**

```typescript
// Audit animation for flash rate
function checkFlashRate(animation: Animation): boolean {
  const flashCount = countVisibilityChanges(animation);
  const durationSeconds = animation.duration / 1000;
  const flashesPerSecond = flashCount / durationSeconds;
  
  return flashesPerSecond <= 3; // Must be true
}

// ❌ Dangerous patterns
@keyframes strobe {
  0%, 50% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
/* 4 flashes per cycle = dangerous at short durations */

// ✓ Safe patterns
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
/* Gradual change, not flash */
```

## Loading States

### Spinner Accessibility

```tsx
// Loading spinner
function LoadingSpinner({ label = "Loading" }) {
  return (
    <div role="status" aria-live="polite">
      <svg 
        className="animate-spin" 
        aria-hidden="true"
        /* Animation is decorative, hidden from AT */
      >
        {/* Spinner SVG */}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Skeleton loading
function SkeletonLoader() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading content</span>
      <div className="skeleton" aria-hidden="true" />
    </div>
  );
}
```

### Progress Indicators

```tsx
// Determinate progress
<div 
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="File upload progress"
>
  <div style={{ width: `${progress}%` }} />
  <span>{progress}% complete</span>
</div>

// Indeterminate (unknown duration)
<div 
  role="progressbar"
  aria-label="Loading"
  aria-valuetext="Loading, please wait"
>
  <div className="indeterminate-bar" />
</div>
```

## Session Timeouts (2.2.1)

For compliance software, timeouts must be adjustable:

```tsx
function SessionTimeoutWarning({ 
  timeRemaining, 
  onExtend, 
  onLogout,
  minimumWarningTime = 120 // 2 minutes warning
}) {
  const showWarning = timeRemaining <= minimumWarningTime;
  
  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent 
        role="alertdialog"
        aria-labelledby="timeout-title"
        aria-describedby="timeout-description"
      >
        <AlertDialogTitle id="timeout-title">
          Session Expiring Soon
        </AlertDialogTitle>
        <AlertDialogDescription id="timeout-description">
          Your session will expire in {formatTime(timeRemaining)}.
          Any unsaved changes will be lost.
        </AlertDialogDescription>
        <div className="flex gap-4">
          <AlertDialogAction onClick={onExtend}>
            Extend Session (20 minutes)
          </AlertDialogAction>
          <AlertDialogCancel onClick={onLogout}>
            Log Out Now
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Issue Templates

### Missing Reduced Motion Support
```markdown
### [MODERATE] Animation ignores prefers-reduced-motion

**Criterion:** Best practice (supports WCAG 2.2.2 Pause Stop Hide · Level A; reduces 2.3.1 risk; maps to 2.3.3 Animation from Interactions · AAA)
**DS Status:** Required (exceeds WCAG AA baseline)
**Location:** `src/components/Modal.tsx:34`
**Category:** Timing & Motion

**Current State:**
Modal entrance animation plays regardless of `prefers-reduced-motion` user preference.

**Required State:**
Animation must be disabled or reduced when `prefers-reduced-motion: reduce` is set. Do not claim this as a WCAG 2.3.1 failure — 2.3.1 addresses seizure-inducing flash rates, not motion preference.

**Code Fix:**
\`\`\`css
/* Before */
.modal {
  animation: slideUp 300ms ease-out;
}

/* After */
.modal {
  animation: slideUp 300ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    animation: none;
  }
}
\`\`\`
```

### Auto-Playing Without Controls
```markdown
### [SERIOUS] Auto-playing content without pause control

**WCAG Criterion:** 2.2.2 — Pause, Stop, Hide (Level A)
**Location:** `src/components/Carousel.tsx:12`
**Category:** Timing & Motion

**Current State:**
Carousel auto-advances without pause button

**Required State:**
Auto-playing content must have pause/stop mechanism

**Code Fix:**
Add pause/play button with appropriate aria-label
```

## Testing Checklist

- [ ] Enable prefers-reduced-motion in OS/browser
- [ ] Verify animations are removed or reduced
- [ ] Check all auto-playing content has pause controls
- [ ] Verify no content flashes >3 times/second
- [ ] Test session timeout warnings
- [ ] Confirm loading states have screen reader announcements
