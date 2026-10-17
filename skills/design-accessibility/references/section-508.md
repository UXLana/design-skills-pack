# Section 508 Compliance

Section 508 of the Rehabilitation Act requires federal agencies to make their electronic and information technology (EIT) accessible to people with disabilities. Since 2018, Section 508 has aligned with WCAG 2.0 Level AA.

## 508 Standards Overview

### Applicable Standards (Revised 2017)
The revised 508 standards incorporate WCAG 2.0 Level A and AA success criteria for web content and software.

| Standard | Applies To | Key Requirements |
|----------|------------|------------------|
| E205 | Electronic Content | WCAG 2.0 AA conformance |
| E501 | Software | Interoperability with AT |
| E502 | Authoring Tools | Accessible output, accessible interface |
| E503 | Applications | Status indicators, alternatives |

### WCAG Mapping

Section 508 E205 incorporates these WCAG 2.0 criteria:

**Perceivable**
- 1.1.1 Non-text Content (A)
- 1.2.1-1.2.5 Time-based Media (A, AA)
- 1.3.1-1.3.3 Adaptable (A)
- 1.4.1-1.4.5 Distinguishable (A, AA)

**Operable**
- 2.1.1-2.1.2 Keyboard Accessible (A)
- 2.2.1-2.2.2 Enough Time (A)
- 2.3.1 Seizures (A)
- 2.4.1-2.4.7 Navigable (A, AA)

**Understandable**
- 3.1.1-3.1.2 Readable (A, AA)
- 3.2.1-3.2.4 Predictable (A, AA)
- 3.3.1-3.3.4 Input Assistance (A, AA)

**Robust**
- 4.1.1-4.1.2 Compatible (A)

## Software-Specific Requirements (E501)

### Interoperability with Assistive Technology

```tsx
// Platform accessibility APIs must be used
// React components must expose:
// - Name (accessible name)
// - Role (component type)
// - State (current state)
// - Value (current value, if applicable)

<select
  id="facility"
  aria-label="Select facility"
  value={selectedFacility}
  onChange={handleChange}
>
  {facilities.map(f => (
    <option key={f.id} value={f.id}>{f.name}</option>
  ))}
</select>
```

### User Preferences for Platform Settings

```tsx
// Respect system-level accessibility settings
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const prefersHighContrast = window.matchMedia(
  '(prefers-contrast: more)'
).matches;

// Inherit color mode from system
const prefersDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches;
```

### No Interference with AT Features

```tsx
// ❌ Don't override or interfere with AT
document.addEventListener('keydown', (e) => {
  // Don't capture keys used by screen readers
  if (e.key === 'Insert' || e.key === 'CapsLock') return;
});

// ❌ Don't disable selection or copying
user-select: none; // Avoid for text content

// ✓ Allow AT to function normally
// Let native focus handling work
// Don't trap keyboard focus unexpectedly
```

## Documentation Requirements

### VPAT (Voluntary Product Accessibility Template)

For government contracts, you may need to complete a VPAT documenting conformance.

#### VPAT Structure
```markdown
## Product Information
- Product Name: [Name]
- Product Version: [Version]
- Date: [Date]
- Contact: [Email/Phone]

## Evaluation Methods
- Testing tools used
- Assistive technologies tested
- Testing methodology

## Conformance Summary
| Standard | Conformance Level |
|----------|-------------------|
| WCAG 2.0 Level A | Supports / Partially Supports / Does Not Support |
| WCAG 2.0 Level AA | Supports / Partially Supports / Does Not Support |
| Section 508 | Supports / Partially Supports / Does Not Support |

## Detailed Remarks and Explanations
[For each criterion, document support level and any exceptions]
```

### Conformance Levels

| Level | Definition |
|-------|------------|
| Supports | Fully meets the criterion |
| Partially Supports | Some functionality meets criterion |
| Does Not Support | Majority does not meet criterion |
| Not Applicable | Criterion does not apply to product |

## Regulatory Software Requirements

For compliance software used by government entities and the businesses they regulate:

### Critical Form Requirements

```tsx
// Helper: announce a message to screen readers via a polite live region.
// Appends a hidden <div aria-live="polite"> node, sets text, then removes it.
// Use for async results, validation summaries, and stepwise state changes.
function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const node = document.createElement('div');
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', priority);
  node.setAttribute('aria-atomic', 'true');
  node.style.cssText =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(node);
  // Small delay lets AT register the new live region before content arrives.
  window.setTimeout(() => { node.textContent = message; }, 50);
  window.setTimeout(() => { node.remove(); }, 3000);
}

// All form submissions must be:
// 1. Verifiable before submission
// 2. Correctable if errors detected
// 3. Confirmed before irreversible actions

function RegulatoryForm({ onSubmit }) {
  const [step, setStep] = useState('input');
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  const handleValidate = () => {
    const validationErrors = validateData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Announce errors to screen readers
      announceToScreenReader(
        `${validationErrors.length} errors found. Please correct before submitting.`
      );
      return;
    }
    setStep('review');
  };

  const handleSubmit = () => {
    setStep('confirm');
  };

  const handleConfirm = () => {
    onSubmit(data);
    setStep('complete');
  };

  return (
    <form>
      {step === 'input' && (
        <FormInputs data={data} onChange={setData} errors={errors} />
      )}
      
      {step === 'review' && (
        <ReviewSummary 
          data={data} 
          onEdit={() => setStep('input')}
          onSubmit={handleSubmit}
        />
      )}
      
      {step === 'confirm' && (
        <ConfirmationDialog
          message="This action will submit the transfer manifest. Continue?"
          onConfirm={handleConfirm}
          onCancel={() => setStep('review')}
        />
      )}
      
      {step === 'complete' && (
        <SuccessMessage data={data} />
      )}
    </form>
  );
}
```

### Audit Trail Accessibility

```tsx
// Audit trail entries must be accessible
function AuditLog({ entries }) {
  return (
    <table aria-label="Audit log">
      <thead>
        <tr>
          <th scope="col">Timestamp</th>
          <th scope="col">User</th>
          <th scope="col">Action</th>
          <th scope="col">Details</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td>
              <time dateTime={entry.timestamp}>
                {formatDateTime(entry.timestamp)}
              </time>
            </td>
            <td>{entry.user}</td>
            <td>{entry.action}</td>
            <td>{entry.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Error Handling

```tsx
// Errors must be:
// 1. Identified in text (not just color)
// 2. Specific about what went wrong
// 3. Provide suggestions for correction
// 4. Linked to the invalid field

function FormField({ name, label, error, help, required }) {
  const errorId = error ? `${name}-error` : undefined;
  const helpId = help ? `${name}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
      />
      
      {help && (
        <p id={helpId} className="help-text">{help}</p>
      )}
      
      {error && (
        <p id={errorId} className="error-text" role="alert">
          <ErrorIcon aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
```

## Testing for 508 Compliance

### Required Testing

1. **Automated testing** (catches ~30% of issues)
   - axe DevTools
   - Lighthouse
   - WAVE

2. **Manual testing** (catches ~70% of issues)
   - Keyboard-only navigation
   - Screen reader testing (NVDA, JAWS, VoiceOver)
   - High contrast mode
   - 200% zoom

3. **Assistive technology testing**
   - NVDA (Windows, free)
   - JAWS (Windows, commercial)
   - VoiceOver (macOS/iOS, built-in)
   - TalkBack (Android, built-in)

### Testing Matrix

| Component | Keyboard | Screen Reader | High Contrast | Zoom |
|-----------|----------|---------------|---------------|------|
| Forms | ✓ | ✓ | ✓ | ✓ |
| Tables | ✓ | ✓ | ✓ | ✓ |
| Modals | ✓ | ✓ | ✓ | ✓ |
| Navigation | ✓ | ✓ | ✓ | ✓ |
| Data entry | ✓ | ✓ | ✓ | ✓ |

## Report Mode Output

For `--report` mode, generate documentation suitable for audits:

```markdown
# Section 508 Compliance Report

## Executive Summary
**Product:** [Name]
**Version:** [Version]
**Evaluation Date:** [Date]
**Evaluator:** [Name/Organization]

### Overall Conformance
- **WCAG 2.0 Level A:** [Supports/Partially Supports/Does Not Support]
- **WCAG 2.0 Level AA:** [Supports/Partially Supports/Does Not Support]
- **Section 508:** [Supports/Partially Supports/Does Not Support]

### Issue Summary
| Severity | Count |
|----------|-------|
| Critical | X |
| Serious | X |
| Moderate | X |
| Minor | X |

## Detailed Findings

### 1.1.1 Non-text Content (Level A)
**Conformance:** Supports
**Remarks:** All images have appropriate alternative text...

### 1.4.3 Contrast (Minimum) (Level AA)
**Conformance:** Partially Supports
**Remarks:** 2 instances of insufficient contrast found...

[Continue for each criterion]

## Remediation Plan
1. [Critical issue] - Target: [Date]
2. [Critical issue] - Target: [Date]
3. [Serious issue] - Target: [Date]

## Testing Methodology
- Automated: axe DevTools 4.x
- Manual: Keyboard navigation, zoom testing
- Assistive Technology: NVDA 2024.x, VoiceOver
```

---

## Regulated Compliance Software Audit Checks

These checks apply when auditing components used in regulated compliance workflows. They exceed the WCAG baseline and reflect regulator and auditor expectations for regulated tracking and reporting software. Flag violations as `[DS Requirement]` unless they also map to a specific WCAG criterion.

### Scanner-Assisted Workflows (package intake, transfer verification, inventory adjustments)

Barcode and RFID scanner input is the dominant interaction pattern for warehouse and retail users. Scanners emit keyboard events into the focused input, often followed by Tab or Enter.

**Audit checklist:**
- [ ] Scanner-target inputs have a visible label ("Scan lot label" / "Scan manifest barcode") — never rely on placeholder alone
- [ ] Successful scan announces the captured value via a live region (`announceToScreenReader("Scanned C12-000...1234")`) — blind users otherwise cannot tell whether the scan succeeded
- [ ] Failed scan surfaces an error in a `role="alert"` region naming the reason ("Invalid format", "Item not found", "Duplicate scan")
- [ ] Input retains focus for the next scan unless the user explicitly moves on — do not auto-advance focus through a modal or page unless announced
- [ ] Provide a manual-entry fallback with the same validation and announcement behavior, for users without a scanner or with fine-motor impairment
- [ ] Do not use `autoFocus` on more than one scanner input per view — conflicts produce silent focus-stealing

### Long Fixed-Format Identifiers (Lot Numbers, Serials, License IDs)

Long fixed-format identifiers (e.g. `LX24B7Q0093KT2M5RA001234`, 24-character alphanumeric) are often the most common input in regulated compliance software and a hot spot for data-entry errors.

**Audit checklist:**
- [ ] Format shown in label, placeholder, OR `aria-describedby` help text — never hidden behind a tooltip alone
- [ ] `inputMode="text"` and `autoComplete="off"` on sensitive regulatory IDs (disable browser autofill; it corrupts these fields)
- [ ] Pattern validation provides a **specific** error message ("Lot number must be 24 alphanumeric characters" — not "Invalid format")
- [ ] Copy/paste from clipboard works (never block paste — violates 3.3.8 Accessible Authentication by forcing re-typing)
- [ ] Input is not split into multiple fields (e.g. "4 boxes of 6 characters") — accessible to screen readers but painful under AT; if split UI is required, support pasting the full value into any box
- [ ] Character count announced to AT as user types long IDs (live region, polite)

### Chain-of-Custody and Attestation Flows

Multi-party transfers require sender and receiver sign-off. Each party reviews, attests, and submits.

**Audit checklist:**
- [ ] Review step clearly labeled ("Review before attesting") with all submitted values visible, not hidden in collapsed sections
- [ ] Attestation checkbox has an explicit label ("I certify that this transfer is accurate and complies with [JURISDICTION] regulations") — never a generic "I agree"
- [ ] Submit button is `aria-disabled` with `aria-describedby` pointing to the unmet prerequisite until attestation is checked (see `disabled` vs `aria-disabled` decision tree in SKILL.md)
- [ ] After submission, user receives an `aria-live="assertive"` confirmation naming the record ID and next step
- [ ] Multi-role state (sender submitted, awaiting receiver) is communicated in a clearly labeled status region, not just a color-coded badge
- [ ] Audit-trail timestamps use an unambiguous format (ISO 8601 or "Apr 15, 2026 at 3:42 PM PDT") with timezone — users in different time zones and jurisdictions may view these records

### Jurisdiction-Specific Rule Variations

Different jurisdictions (states, countries, agencies) have different required fields, validation rules, and permitted values. Dynamic forms can become inaccessible if not designed carefully.

**Audit checklist:**
- [ ] Conditionally shown fields are announced when they appear (live region or focus move) — do not rely on visual-only appearance
- [ ] Conditionally required fields update `required` / `aria-required` **and** their visible indicator when jurisdiction rules change
- [ ] Validation error messages are jurisdiction-specific and name the rule ("Texas requires the inspector's license number on every adjustment") — never generic
- [ ] If a workflow is unavailable in the current jurisdiction, show a `role="status"` region explaining why rather than hiding controls silently
- [ ] Jurisdiction switcher (for users with multi-jurisdiction access) announces the new context after change, not just a URL update

### Bulk Actions and High-Volume Tables

Warehouse and operations teams select and act on hundreds of records at a time.

**Audit checklist:**
- [ ] "Select all on page" and "Select all across pages" are distinguished in label AND announcement — selection counts are regulatory evidence
- [ ] Selected-count live region updates on each selection change (debounced to every ~500ms to avoid AT flooding)
- [ ] Bulk destructive actions (void, adjust, transfer) require a typed confirmation matching the count ("Type 247 to confirm voiding 247 records") — WCAG 3.3.4 Error Prevention for Legal/Financial/Data
- [ ] Progress of bulk action reported via `role="progressbar"` with `aria-valuenow` / `aria-valuetext`
- [ ] Post-action summary names successes AND failures with per-item reason, in a focusable region

### Electronic Signature / Attestation

Many regulators require e-signatures on transfers, adjustments, and compliance reports.

**Audit checklist:**
- [ ] Signature input has a visible label and legal disclosure text above (not below) the input
- [ ] If drawing a signature, offer a typed-signature alternative (AT users and users with motor impairment)
- [ ] Submitted signature is read-only after attestation — do not silently re-enable the field
- [ ] Post-signature state shows who signed, when, and what they signed, in a persistent (not toast) region

### Session Handling for Compliance Data Entry

- [ ] Session timeout warning offers "Extend" option at least 2 minutes before expiry (2.2.1)
- [ ] In-progress regulatory forms auto-save drafts every 30-60 seconds; recovery prompt on return
- [ ] Leaving a form with unsaved changes triggers a native `beforeunload` warning AND an accessible in-app confirmation
