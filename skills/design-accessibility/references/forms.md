# Forms & Data Entry

**Contents:** Core Requirements · Labels · Required Fields · Help Text & Instructions · Error Handling · Error Prevention (3.3.4) · Input Purpose (1.3.5) · Redundant Entry (3.3.7) · Session Timeouts · Issue Templates · Form Readiness Checklist

Forms are where most task-blocking failures happen. Users must be able to complete them accurately and recover from errors — and in compliance mode this file is always loaded. For regulated record-keeping and attestation flows, also see `regulated-workflows.md` (opt-in).

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
<label htmlFor="member-id">Membership number</label>
<input id="member-id" type="text" />

// ✓ Wrapping label
<label>
  <span>Membership number</span>
  <input type="text" />
</label>

// ✓ aria-label for visually hidden label
<input 
  type="search" 
  aria-label="Search orders"
  placeholder="Search..."
/>

// ❌ Placeholder is NOT a label
<input type="text" placeholder="Enter membership number" />
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
<label htmlFor="order-id">Order number</label>
<input 
  id="order-id" 
  type="text"
  aria-describedby="order-help"
/>
<p id="order-help" className="help-text">
  Enter the 8-character order number from your confirmation email
</p>

// Multiple descriptions
<input 
  id="weight"
  aria-describedby="weight-help weight-error"
/>
<p id="weight-help">Enter weight in kilograms</p>
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
  Invalid country code. Use two letters, e.g. US, GB, DE
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

**Applies to submissions that create legal commitments or financial transactions, modify or delete user-controllable data, or submit test responses.** Meet it with at least one of: the submission is reversible, the input is checked and the user can correct errors, or the user reviews and confirms before finalizing.

### Confirmation for Critical Actions

```tsx
// Delete confirmation
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Project</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete project "Spring launch"?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. This will permanently delete the 
      project and all of its files.
    </AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>
      Yes, delete project
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
      
      <section aria-labelledby="shipping-details">
        <h3 id="shipping-details">Shipping Details</h3>
        <dl>
          <dt>Ship from</dt>
          <dd>{formData.origin}</dd>
          <dt>Ship to</dt>
          <dd>{formData.destination}</dd>
          {/* ... other fields */}
        </dl>
        <Button onClick={() => onEdit('shipping')}>
          Edit Shipping Details
        </Button>
      </section>
      
      <Button variant="primary" onClick={onSubmit}>
        Place Order
      </Button>
    </div>
  );
}
```

### Undo/Reversibility

```tsx
// Provide undo for destructive actions when possible.
// Hide the item at once, but commit the delete only when the user dismisses
// the toast. No timer, so there is no time limit to meet under 2.2.1.
function useUndoableDelete(onDelete) {
  const [deleted, setDeleted] = useState(null);

  const handleDelete = (item) => setDeleted(item);
  const handleUndo = () => setDeleted(null);
  const handleDismiss = () => {
    onDelete(deleted);
    setDeleted(null);
  };

  return { deleted, handleDelete, handleUndo, handleDismiss };
}

// Usage with toast: it stays until the user acts on it.
// Also commit the pending delete if the user leaves the view.
{deleted && (
  <div role="status" aria-live="polite">
    Item deleted.
    <button onClick={handleUndo}>Undo</button>
    <button onClick={handleDismiss}>Dismiss</button>
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

Warn before a session expires and give users at least 20 seconds to extend it with a simple action, or let them turn the limit off or adjust it (2.2.1). Keep entered data if the session does expire. The pattern lives in `motion.md` ("Session Timeouts (2.2.1)") — one home, so the warning timing stays consistent.

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
<input placeholder="Search orders..." />

// After
<label htmlFor="search" className="sr-only">Search orders</label>
<input id="search" placeholder="Search orders..." />
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

## Form Readiness Checklist

- [ ] All inputs have visible labels
- [ ] Required fields marked visually and programmatically (native `required`)
- [ ] Error messages specific and actionable
- [ ] Errors linked to inputs via aria-describedby
- [ ] Legal, financial and data-deleting submissions are reversible, checked or confirmed
- [ ] Review step before final submission of multi-step forms
- [ ] Session timeout warnings with an extend option
- [ ] Undo capability where feasible
- [ ] Form data persists during the session (no loss on error)
- [ ] Regulated record-keeping or attestation flow? Run `regulated-workflows.md` too
