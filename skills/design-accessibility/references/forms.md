# Forms & Data Entry

⚠️ **Critical for Compliance Software** — Form accessibility is essential for regulatory applications. Users must be able to complete forms accurately and correct errors.

## Core Requirements

| Requirement | WCAG Criterion | Level |
|-------------|----------------|-------|
| Labels for inputs | 3.3.2 | A |
| Error identification | 3.3.1 | A |
| Error suggestions | 3.3.3 | AA |
| Error prevention (legal/financial) | 3.3.4 | AA |
| Input purpose identification | 1.3.5 | AA |
| No redundant entry | 3.3.7 | A |
| Accessible authentication | 3.3.8 | AA |

## Labels

### Every Input Needs a Label

```tsx
// ✓ Explicit label with htmlFor
<label htmlFor="license-number">License Number</label>
<input id="license-number" type="text" />

// ✓ Wrapping label
<label>
  <span>License Number</span>
  <input type="text" />
</label>

// ✓ aria-label for visually hidden label
<input 
  type="search" 
  aria-label="Search inventory"
  placeholder="Search..."
/>

// ❌ Placeholder is NOT a label
<input type="text" placeholder="Enter license number" />
```

### Label Requirements
- Always visible (don't rely on placeholder alone)
- Positioned consistently (above or left of input)
- Clearly associated programmatically
- Descriptive of expected input

## Required Fields

> **`required` vs `aria-required` decision rule:**
> - **Native `<input>`, `<select>`, `<textarea>`:** use the native `required` attribute. AT announces it automatically. **Do NOT add `aria-required` as well — it is redundant on native form controls.**
> - **Custom widgets built with `<div role="textbox">` or similar non-native elements:** use `aria-required="true"` (no native attribute exists).
> - **Never rely on `aria-required` alone** when a native element could be used — native is always preferred.

```tsx
// ✓ Visual and programmatic indicator — native control, no aria-required needed
<label htmlFor="email">
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input
  id="email"
  type="email"
  required
/>

// Form-level instruction
<p className="form-instructions">
  Fields marked with <span aria-hidden="true">*</span> are required
</p>
```

## Help Text & Instructions

```tsx
// Help text linked via aria-describedby
<label htmlFor="batch-id">Batch ID</label>
<input 
  id="batch-id" 
  type="text"
  aria-describedby="batch-help"
/>
<p id="batch-help" className="help-text">
  Enter the 8-character batch identifier from your transfer manifest
</p>

// Multiple descriptions
<input 
  id="weight"
  aria-describedby="weight-help weight-error"
/>
<p id="weight-help">Enter weight in grams</p>
<p id="weight-error" role="alert">Weight must be greater than 0</p>
```

## Error Handling

### Error Identification (3.3.1)
Errors must be:
1. Clearly identified in text (not just color)
2. Described specifically
3. Associated with the invalid input

```tsx
// ✓ Complete error pattern
<label htmlFor="quantity">Quantity</label>
<input 
  id="quantity"
  type="number"
  aria-invalid={hasError}
  aria-describedby={hasError ? "quantity-error" : undefined}
/>
{hasError && (
  <p id="quantity-error" role="alert" className="error">
    <ErrorIcon aria-hidden="true" />
    Quantity must be between 1 and 1000
  </p>
)}

// ❌ Color-only error
<input className={hasError ? "border-red" : ""} />
```

### Error Suggestions (3.3.3)
When error is known, suggest correction:

```tsx
// ✓ Suggests correct format
<p id="date-error" role="alert">
  Invalid date format. Please use MM/DD/YYYY (e.g., 01/15/2024)
</p>

// ✓ Suggests valid values
<p id="state-error" role="alert">
  Invalid state code. Valid options: CA, CO, OR, WA
</p>

// ❌ Vague error
<p role="alert">Invalid input</p>
```

### Error Summary

For forms with multiple errors, provide summary at form level:

```tsx
<form onSubmit={handleSubmit}>
  {errors.length > 0 && (
    <div role="alert" aria-labelledby="error-summary-heading">
      <h2 id="error-summary-heading">
        {errors.length} error(s) found
      </h2>
      <ul>
        {errors.map(error => (
          <li key={error.field}>
            <a href={`#${error.field}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  )}
  {/* Form fields */}
</form>
```

## Error Prevention (3.3.4)

**Required for legal, financial, or data-modifying transactions.**

### Confirmation for Critical Actions

```tsx
// Delete confirmation
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Batch</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete Batch #12345?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. This will permanently delete the 
      batch record and all associated transfers.
    </AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>
      Yes, delete batch
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

### Review Before Submit

```tsx
// Summary page before final submission
function ReviewPage({ formData, onEdit, onSubmit }) {
  return (
    <div>
      <h2>Review Your Submission</h2>
      
      <section aria-labelledby="transfer-details">
        <h3 id="transfer-details">Transfer Details</h3>
        <dl>
          <dt>Origin Facility</dt>
          <dd>{formData.origin}</dd>
          <dt>Destination</dt>
          <dd>{formData.destination}</dd>
          {/* ... other fields */}
        </dl>
        <Button onClick={() => onEdit('transfer')}>
          Edit Transfer Details
        </Button>
      </section>
      
      <Button variant="primary" onClick={onSubmit}>
        Submit Transfer
      </Button>
    </div>
  );
}
```

### Undo/Reversibility

```tsx
// Provide undo for destructive actions when possible
function useUndoableDelete(onDelete) {
  const [deleted, setDeleted] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleDelete = (item) => {
    setDeleted(item);
    const id = setTimeout(() => {
      onDelete(item);
      setDeleted(null);
    }, 5000);
    setTimeoutId(id);
  };

  const handleUndo = () => {
    clearTimeout(timeoutId);
    setDeleted(null);
  };

  return { deleted, handleDelete, handleUndo };
}

// Usage with toast
{deleted && (
  <div role="status" aria-live="polite">
    Item deleted. 
    <button onClick={handleUndo}>Undo</button>
    <span className="sr-only">You have 5 seconds to undo</span>
  </div>
)}
```

## Input Purpose (1.3.5)

Use autocomplete for common fields:

> **React note:** JSX uses `autoComplete` (camelCase), not the HTML `autocomplete`. Emit `autoComplete` in code fixes for `.tsx` files.

```tsx
<input
  name="name"
  autoComplete="name"
  type="text"
/>

<input
  name="email"
  autoComplete="email"
  type="email"
/>

<input
  name="tel"
  autoComplete="tel"
  type="tel"
/>

<input
  name="street-address"
  autoComplete="street-address"
  type="text"
/>
```

### Common Autocomplete Values
```
name, given-name, family-name
email, tel
street-address, address-line1, address-line2
city (address-level2), state (address-level1)
postal-code, country
organization
username, current-password, new-password
```

## Redundant Entry (3.3.7 - WCAG 2.2)

Don't require users to re-enter information:

```tsx
// ✓ Auto-populate from previous step
<input 
  id="billing-address"
  defaultValue={shippingAddress}
/>

// ✓ Offer to copy previous entry
<Checkbox 
  id="same-address"
  onChange={(e) => e.target.checked && copyShippingToBilling()}
>
  Billing address same as shipping
</Checkbox>

// ❌ Require re-entry
<p>Please re-enter your email to confirm</p>
<input id="confirm-email" type="email" />
```

## Session Timeouts

For compliance software, warn users before session expires:

```tsx
function SessionWarning({ timeRemaining, onExtend, onLogout }) {
  return (
    <AlertDialog open={timeRemaining < 60}>
      <AlertDialogContent role="alertdialog">
        <AlertDialogTitle>Session Expiring</AlertDialogTitle>
        <AlertDialogDescription>
          Your session will expire in {timeRemaining} seconds. 
          Would you like to continue working?
        </AlertDialogDescription>
        <AlertDialogAction onClick={onExtend}>
          Continue Session
        </AlertDialogAction>
        <AlertDialogCancel onClick={onLogout}>
          Log Out
        </AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Issue Templates

### Missing Label
```markdown
### [CRITICAL] Form input missing label

**WCAG Criterion:** 3.3.2 — Labels or Instructions (Level A)
**Location:** `src/components/SearchInput.tsx:12`
**Category:** Forms & Data Entry

**Current State:**
Input uses placeholder only, no programmatic label

**Required State:**
Every form input must have an accessible label

**Code Fix:**
\`\`\`tsx
// Before
<input placeholder="Search inventory..." />

// After
<label htmlFor="search" className="sr-only">Search inventory</label>
<input id="search" placeholder="Search inventory..." />
\`\`\`
```

### Error Not Identified
```markdown
### [SERIOUS] Error not identified in text

**WCAG Criterion:** 3.3.1 — Error Identification (Level A)
**Location:** `src/components/Form.tsx:45`
**Category:** Forms & Data Entry

**Current State:**
Error indicated only by red border, no text description

**Required State:**
Errors must be described in text, not just color

**Code Fix:**
\`\`\`tsx
// Before
<input className={error ? "border-red-500" : ""} />

// After
<input 
  aria-invalid={!!error}
  aria-describedby={error ? "field-error" : undefined}
  className={error ? "border-red-500" : ""}
/>
{error && (
  <p id="field-error" role="alert" className="text-red-500">
    {error}
  </p>
)}
\`\`\`
```

### No Confirmation for Critical Action
```markdown
### [CRITICAL] Destructive action lacks confirmation

**WCAG Criterion:** 3.3.4 — Error Prevention (Level AA)
**Location:** `src/components/DeleteButton.tsx:18`
**Category:** Forms & Data Entry

**Current State:**
Delete button immediately removes record without confirmation

**Required State:**
Critical/irreversible actions require confirmation step

**Code Fix:**
\`\`\`tsx
// Before
<Button onClick={handleDelete}>Delete</Button>

// After
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. Are you sure?
    </AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
\`\`\`
```

## Regulatory Compliance Checklist

For regulated compliance software:

- [ ] All inputs have visible labels
- [ ] Required fields marked visually and programmatically
- [ ] Error messages specific and actionable
- [ ] Errors linked to inputs via aria-describedby
- [ ] Confirmation dialogs for all destructive actions
- [ ] Review step before final submission
- [ ] Session timeout warnings with extend option
- [ ] Undo capability where feasible
- [ ] Audit trail entries announced to screen readers
- [ ] Form data persists during session (no loss on error)
