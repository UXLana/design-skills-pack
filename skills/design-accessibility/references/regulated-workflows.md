# Regulated Workflows (Opt-in)

**Contents:** When to Use · Labelling · Core Expectations · Multi-step Submission Pattern · Audit-trail Tables · Scanner-assisted Entry · Long Fixed-format Identifiers · Review, Attestation and Sign-off · Jurisdiction-specific Rules · Bulk Actions on Records · Electronic Signatures · Session Handling

## When to Use

Load this file only when the product is regulated record-keeping, attestation or reporting software — for example quality and laboratory records, clinical or financial reporting, government case management, licensing, or supply-chain traceability — or when the user asks for these checks. For everyday product UI they add noise.

These checks reflect what regulators and auditors tend to expect from such systems: errors caught before submission, deliberate confirmation of consequential actions, and records people can review and trust. They come from practice, not from a single standard.

## Labelling

Most of these exceed WCAG. Label a finding `[DS Requirement]` unless it also fails a specific criterion — then use that criterion's label (e.g., a missing error message is 3.3.1; a timeout without an extend option is 2.2.1).

## Core Expectations

1. **Data validation** — errors are caught before submission, with specific messages (3.3.1, 3.3.3)
2. **Review and confirmation** — consequential or irreversible submissions are reversible, checked or confirmed (3.3.4); review steps show every value
3. **Audit trail** — actions are logged, and the log is readable by assistive technology
4. **Session handling** — timeout warnings with an extend option (2.2.1)
5. **Error recovery** — users can correct or withdraw a submission where the rules allow

## Multi-step Submission Pattern

```tsx
// Announce a message through a polite live region.
// Prefer one persistent region mounted at the app root; this helper is a fallback
// for code that can't reach it.
function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const node = document.createElement('div');
  node.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
  node.setAttribute('aria-live', priority);
  node.setAttribute('aria-atomic', 'true');
  node.className = 'sr-only';
  document.body.appendChild(node);
  // A short delay lets AT register the new region before the text arrives.
  window.setTimeout(() => { node.textContent = message; }, 50);
  window.setTimeout(() => { node.remove(); }, 3000);
}

// Input → review → confirm → complete. Every submission is
// verifiable before it is sent, correctable, and confirmed if irreversible.
function RegulatedSubmissionForm({ onSubmit }) {
  const [step, setStep] = useState<'input' | 'review' | 'confirm' | 'complete'>('input');
  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  const handleValidate = () => {
    const validationErrors = validateData(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      announceToScreenReader(
        `${validationErrors.length} errors found. Please correct them before continuing.`
      );
      return;
    }
    setStep('review');
  };

  return (
    <form>
      {step === 'input' && (
        <FormInputs data={data} onChange={setData} errors={errors} onNext={handleValidate} />
      )}
      {step === 'review' && (
        <ReviewSummary data={data} onEdit={() => setStep('input')} onSubmit={() => setStep('confirm')} />
      )}
      {step === 'confirm' && (
        <ConfirmationDialog
          message="Submitting sends this record to the reviewing authority and can't be edited afterwards. Continue?"
          onConfirm={() => { onSubmit(data); setStep('complete'); }}
          onCancel={() => setStep('review')}
        />
      )}
      {step === 'complete' && <SuccessMessage data={data} />}
    </form>
  );
}
```

Field-level error markup (labels, `aria-invalid`, `aria-describedby`) is in `forms.md`.

## Audit-trail Tables

```tsx
function AuditLog({ entries }) {
  return (
    <table>
      <caption>Audit log</caption>
      <thead>
        <tr>
          <th scope="col">Timestamp</th>
          <th scope="col">User</th>
          <th scope="col">Action</th>
          <th scope="col">Details</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td><time dateTime={entry.timestamp}>{formatDateTime(entry.timestamp)}</time></td>
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

## Scanner-assisted Entry

Barcode and RFID scanners are common in receiving, sample check-in, stock counts and asset tracking. A scanner types into the focused input, often followed by Tab or Enter.

- [ ] Scanner-target inputs have a visible label ("Scan item barcode") — never a placeholder alone
- [ ] A successful scan announces the captured value via a live region — blind users otherwise can't tell whether it worked
- [ ] A failed scan shows an error in a `role="alert"` region naming the reason ("Invalid format", "Item not found", "Duplicate scan")
- [ ] The input keeps focus for the next scan unless the user moves on; don't auto-advance focus without announcing it
- [ ] Manual entry is available with the same validation and announcements, for users without a scanner or with limited fine-motor control
- [ ] Only one scanner input per view uses `autoFocus` — competing autofocus steals focus silently

## Long Fixed-format Identifiers

Serial numbers, license IDs, lot or batch codes and account numbers (e.g., `SN-4F7Q-0093-KT2M-5RA1`) are high-error inputs.

- [ ] The format is shown in the label or in `aria-describedby` help text — not hidden in a tooltip
- [ ] `autoComplete="off"` on identifier fields where browser autofill would insert wrong values
- [ ] Pattern validation gives a **specific** message ("Serial number must be 20 letters and numbers" — not "Invalid format") (3.3.1, 3.3.3)
- [ ] Paste works. Blocking it forces error-prone re-typing — `[Best Practice]`; it is not a 3.3.8 failure, which covers authentication only
- [ ] Avoid splitting one identifier across several boxes; if the design requires it, accept a pasted full value in any box
- [ ] For very long values, offer a character count in a polite, debounced live region

## Review, Attestation and Sign-off

Multi-party records often need each party to review, attest and submit.

- [ ] The review step is clearly labelled ("Review before you sign") and shows every submitted value, not values hidden in collapsed sections
- [ ] The attestation checkbox has an explicit label ("I certify this record is accurate and complete under [JURISDICTION] rules") — not a generic "I agree"
- [ ] Submit is `aria-disabled` with `aria-describedby` naming the unmet prerequisite until attestation is checked (see the `disabled` vs `aria-disabled` decision tree in SKILL.md)
- [ ] After submission, a live-region confirmation names the record ID and the next step
- [ ] Multi-party state ("Submitted by sender, awaiting receiver") is in a labelled status region, not only a colored badge (1.4.1)
- [ ] Timestamps are unambiguous and carry a time zone (ISO 8601, or "Apr 15, 2026, 3:42 PM PDT")

## Jurisdiction-specific Rules

Different jurisdictions (states, countries, agencies) require different fields, validation and allowed values. Dynamic forms break easily.

- [ ] Fields that appear conditionally are announced (live region or a focus move) — not visual-only (4.1.3)
- [ ] Conditionally required fields update `required` / `aria-required` **and** their visible indicator when the rules change
- [ ] Error messages name the rule ("This jurisdiction requires a reviewer ID on every adjustment") — not a generic message
- [ ] If a workflow isn't available in the current jurisdiction, a `role="status"` region explains why rather than hiding controls silently
- [ ] Switching jurisdiction (for multi-jurisdiction users) announces the new context, not just a URL change

## Bulk Actions on Records

Operations teams often select and act on hundreds of records at once.

- [ ] "Select all on this page" and "Select all across pages" differ in label **and** announcement — selection counts become part of the record
- [ ] The selected-count live region updates on change, debounced (about 500ms) to avoid flooding AT
- [ ] Bulk destructive actions (void, delete, adjust) meet 3.3.4 by being reversible, checked or confirmed. A typed confirmation matching the count ("Type 247 to void 247 records") is a stronger `[DS Requirement]` on top
- [ ] Progress uses `role="progressbar"` with `aria-valuenow` and `aria-valuetext`
- [ ] The post-action summary names successes **and** failures with a per-item reason, in a focusable region

## Electronic Signatures

- [ ] The signature input has a visible label, with the legal disclosure above (not below) it
- [ ] A drawn signature has a typed alternative, for screen-reader users and people with limited motor control
- [ ] The signature is read-only after attestation — don't silently re-enable it
- [ ] The signed state shows who signed, when and what, in a persistent region (not a toast)

## Session Handling

- [ ] Before a timeout, warn and give at least 20 seconds to extend with a simple action (2.2.1). A warning two minutes ahead is a common `[DS Requirement]` for long forms
- [ ] In-progress forms auto-save drafts regularly and offer recovery on return
- [ ] Leaving a form with unsaved changes triggers both the browser's `beforeunload` prompt and an accessible in-app confirmation
