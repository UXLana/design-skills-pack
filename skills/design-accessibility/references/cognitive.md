# Cognitive & Input Assistance (WCAG 2.2)

WCAG 2.2 added criteria that reduce memory, re-typing and puzzle-solving — help for anyone completing a long or high-stakes task while tired, stressed or distracted, and essential for people with cognitive and learning disabilities.

## WCAG 2.2 Additions — Where Each Is Covered

WCAG 2.2 added nine criteria. Only the 3.x ones are cognitive; the rest belong to focus and pointer input.

| Criterion | Level | Category | Covered in |
|-----------|-------|----------|------------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Keyboard & Focus | `keyboard.md` |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Keyboard & Focus | `keyboard.md` |
| 2.4.13 Focus Appearance | AAA | Keyboard & Focus | `color-contrast.md` |
| 2.5.7 Dragging Movements | AA | Pointer & Target Size | `pointer.md` |
| 2.5.8 Target Size (Minimum) | AA | Pointer & Target Size | `pointer.md` |
| 3.2.6 Consistent Help | A | Cognitive & Input Assistance | below |
| 3.3.7 Redundant Entry | A | Cognitive & Input Assistance | below |
| 3.3.8 Accessible Authentication (Minimum) | AA | Cognitive & Input Assistance | below |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Cognitive & Input Assistance | below |

## Consistent Help (3.2.6)

If a help mechanism is repeated across pages, it appears in the same order relative to the other page content, unless the user changes it. The criterion doesn't require you to provide help — only to keep it where people learned to find it.

### Implementation
```tsx
// ✓ Help always in same location
function PageLayout({ children }) {
  return (
    <div>
      <header>
        <nav>{/* Primary navigation */}</nav>
        {/* Help always in header, same position */}
        <HelpButton />
      </header>

      <main>{children}</main>

      <footer>
        {/* Or consistently in footer */}
        <a href="/help">Help Center</a>
        <a href="/contact">Contact Support</a>
      </footer>
    </div>
  );
}

// Help mechanisms include:
// - Human contact details (phone, email)
// - Human contact mechanism (chat, contact form)
// - Self-help option (FAQ, help center)
// - Fully automated contact mechanism (chatbot)
```

## Redundant Entry (3.3.7)

Information the user already entered (or was given) in the same process is either auto-populated or available to select, so they don't have to type it again.

### Patterns
```tsx
// ✓ Auto-populate from session
function CheckoutForm({ userData }) {
  return (
    <form>
      <input
        name="email"
        defaultValue={userData.email}
        /* Pre-filled from account */
      />

      {/* Offer to copy from previous step */}
      <label>
        <input
          type="checkbox"
          onChange={copyShippingToBilling}
        />
        Billing address same as shipping
      </label>
    </form>
  );
}

// ✓ Offer previous entries to select
function SearchInput({ recentSearches }) {
  return (
    <Combobox>
      <ComboboxInput placeholder="Search..." />
      <ComboboxOptions>
        {recentSearches.map(search => (
          <ComboboxOption key={search} value={search}>
            {search}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

// Exceptions:
// - Re-entering is essential (e.g., a memory game)
// - Security requires it (e.g., confirming a newly created password that isn't displayed)
// - The earlier information is no longer valid
// A "re-type your email to confirm" field is not a security exception — see forms.md.
```

## Accessible Authentication (3.3.8)

No step of signing in may require a **cognitive function test** — remembering a password, transcribing characters, solving a puzzle, doing a calculation — unless that step offers at least one of:

| Allowed when… | Example |
|---|---|
| **Alternative** — another method that isn't a cognitive test | Passkey, emailed sign-in link, an identity provider |
| **Mechanism** — something helps the user complete the test | Password managers can fill the field; paste is allowed |
| **Object recognition** — the test is recognising objects | "Select the images with bicycles" |
| **Personal content** — the test is identifying content the user supplied | "Choose the photo you uploaded" |

Object recognition and personal content are allowed at AA. They are disallowed only at **3.3.9 Accessible Authentication (Enhanced), AAA** — so don't flag an image-recognition CAPTCHA as an AA failure.

### Fails 3.3.8 (unless an alternative or mechanism exists)
- Transcribing distorted text or characters from an image or audio clip
- Puzzles (drag the piece, rotate the image, solve the sum)
- Blocking paste or password-manager fill on a password or verification-code field

### Passes
```tsx
// ✓ Paste and password managers allowed
<input
  type="password"
  name="password"
  autoComplete="current-password"
  /* Don't block paste */
/>

// ✓ Verification code the browser or a password manager can fill
<input
  name="otp"
  inputMode="numeric"
  autoComplete="one-time-code"
/>

// ✓ Passkeys / WebAuthn
<button onClick={authenticateWithPasskey}>
  Sign in with a passkey
</button>

// ✓ Emailed sign-in link
<form>
  <label htmlFor="login-email">Email</label>
  <input id="login-email" type="email" name="email" autoComplete="email" />
  <button>Send sign-in link</button>
</form>
```

3.3.8 covers authentication only. Blocking paste on an ordinary form field is poor practice (`[Best Practice]`), but it isn't a 3.3.8 failure.

## Issue Templates

### Cognitive Test Without Alternative
```markdown
### [SERIOUS] Sign-in requires transcribing a text CAPTCHA

**WCAG Criterion:** 3.3.8 — Accessible Authentication (Minimum) (Level AA)
**Source label:** [WCAG 2.2 AA]
**Location:** `src/features/auth/SignIn.tsx:54`
**Category:** Cognitive & Input Assistance

**Current State:**
Users must type distorted characters from an image to sign in; no alternative method

**Required State:**
Remove the transcription test, or offer an alternative (passkey, emailed link) or a mechanism.
An object-recognition challenge would also pass at AA.
```

### Paste Blocked on Password
```markdown
### [SERIOUS] Password field blocks paste

**WCAG Criterion:** 3.3.8 — Accessible Authentication (Minimum) (Level AA)
**Source label:** [WCAG 2.2 AA]
**Location:** `src/features/auth/PasswordField.tsx:12`
**Category:** Cognitive & Input Assistance

**Current State:**
`onPaste={(e) => e.preventDefault()}` stops password managers and paste

**Code Fix:**
Remove the paste handler and set `autoComplete="current-password"`
```

## Testing Checklist

- [ ] Help is in a consistent location across pages
- [ ] Information from earlier steps is pre-populated or selectable
- [ ] Sign-in works with a password manager and with paste
- [ ] No transcription or puzzle test at sign-in without an alternative
- [ ] Focus, pointer and target-size checks run from `keyboard.md` and `pointer.md`
