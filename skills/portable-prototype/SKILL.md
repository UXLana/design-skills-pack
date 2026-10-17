---
name: portable-prototype
description: Build ONE self-contained .html file from a Vite prototype so it can be emailed or attached and opened by double-click — no server, no install, no hosting account. Use when the user says "portable prototype", "single file", "one html", "send the prototype", "share without hosting", "they can't run it", "the zip was too big", or when a stakeholder needs to click through a prototype and there is nowhere to host it. VITE ONLY — refuses Next.js rather than guessing.
---

# portable-prototype

Turn a running prototype into a single `.html` file a non-technical stakeholder can open by double-clicking.

**The problem it solves:** sending a repo zip does not work — a repo zip is mostly `node_modules` (a single UI library can be tens of megabytes on disk) while the built app is often a megabyte or two. And a `dist/` folder does not open from disk either: its absolute asset paths and `crossorigin` module scripts fail under `file://`.

⚠️ **A STOPGAP FOR HOSTING, NOT FOR PERMISSIONS.** A file cannot be access-controlled once it is sent. Say this out loud at handover. If the work is unreleased product direction, the real ask is still a company-owned URL.

## Scope — check this first

| Bundler | Status |
|---|---|
| **Vite** (SPA) | ✅ Proven end to end |
| **Next.js** | ❌ **UNPROVEN — do not attempt.** No `vite-plugin-singlefile` equivalent; static export emits a folder and client routing from disk is untested. Say so and stop. |
| **Anything else** (Create React App or other webpack setups, Parcel, and Vite-based frameworks with server rendering such as React Router framework mode, Remix, Astro, SvelteKit, Nuxt) | ❌ **UNPROVEN — do not attempt.** Say so and stop. |

```bash
# Detect before promising anything
if grep -q '"next"' package.json; then echo "Next.js: refuse"
elif [ -n "$(find . -maxdepth 1 -name 'vite.config.*' -print -quit)" ]; then
  if grep -Eq '"(@react-router/dev|@remix-run/dev|astro|@sveltejs/kit|nuxt|vike|@tanstack/react-start)"' package.json
  then echo "Vite-based framework: unproven, stop"; else echo "Plain Vite SPA: proceed"; fi
else echo "Not Vite: unproven, stop"; fi
```

Refusing is the correct output for anything other than a plain Vite single-page app. Do not improvise a path nobody has tested — the file gets forwarded to people who cannot debug it.

## The four things `file://` breaks

Work through all four. Three are mechanical; the second fails **silently**.

1. **Router.** A file's `location.pathname` is its disk path and matches no route, so the app renders a 404. Use a hash router **in the standalone build only** — do not convert the hosted build, whose real paths are usually a deliberate deep-linking decision.

2. **⚠️ Query params move INTO the hash.** Anything reading `new URLSearchParams(window.location.search)` now gets an empty string and falls back to its default. **Nothing throws and nothing logs** — the UI looks fine while every deep link lands on the wrong state. Read the query from the hash first, then fall back to `search`. Write it back the same way.

3. **Assets the plugin can't inline.** Its recommended config inlines assets imported through JS or CSS, but files in `public/` and assets referenced with `new URL(…, import.meta.url)` still ship as separate files the recipient never receives. The only symptom is a broken image.

4. **Root-absolute paths** in raw `<a href>`, `window.location.href` and `window.open` resolve to the filesystem root. Router `<Link>`s are fine — they rewrite themselves.

**Put every branch in ONE module** (e.g. `src/standalone.ts`) rather than scattering flags across five files. Where a helper can work in both modes by inspecting the URL rather than a build flag, do that — a branch that only runs in a build nobody exercises daily is a branch nobody tests.

## Two Vite behaviours that cost time — both measured

- **`assetsInlineLimit` will not inline an asset Vite has already compiled into `new URL(…, import.meta.url)`** — not at `Infinity`, not with the predicate form. Import it with **`?raw`** and build a data URI at the source instead. That works in both builds and removes the branch.
- **`transformIndexHtml` must run at `order: 'pre'`.** Vite collects `index.html`'s assets *before* the normal transform stage, so stripping a favicon link later removes the tag and still emits the file — two outputs instead of one.

`vite-plugin-singlefile` inlines JS, CSS and imported assets (its recommended build config, on by default, sets `assetsInlineLimit` to inline every imported asset and `base` to `./`). It does **not** inline `public/` files or `new URL()` assets, and it doesn't touch the router. Those are yours.

## Workflow

1. Detect the bundler. Refuse Next.js.
2. Check the `vite` major version in package.json, then add `vite-plugin-singlefile` (2.3+, which supports Vite 5.4 through 8) as a devDependency and a `build:standalone` script on a **separate Vite mode**, so the normal `build` is untouched.
3. Create the single standalone module; fix all four breakages.
4. Decide what the file opens on — the recipient double-clicks with no URL, so the default matters. **Resolve any variant by value, never by index**; indices shift whenever a variant is inserted.
5. Build. Confirm the output is **exactly one file** and report its real byte size.
6. Verify by driving the real file (below).
7. Record it in the repo's own plan/docs, including that hash routing is standalone-only.

## Verification — driving the file is the only real test

Structural gates prove nothing about a file that must open by double-click. Open the actual `file://` URL and check:

- it mounts at all (proves the inline module script executes from disk)
- it opens on the intended default
- deep links with an explicit state survive a **full reload**
- images render
- **a real mutation works** — create something and confirm the list count changes
- the console is free of CORS and 404 errors

⚠️ **A HASH-ONLY `goto` DOES NOT RELOAD THE DOCUMENT.** The app never remounts, so the test silently measures the *previous* state instead of the one in the URL. Use a fresh page per URL.

⚠️ **DIFF AGAINST THE DEV SERVER BEFORE CALLING ANYTHING A BUG.** Run the identical interaction against `localhost` and compare. The instinct is to assume any error in a new build belongs to the new build; often it is pre-existing and reporting it as new is worse than missing it.

To identify which variant or mode rendered, compare a **rendered signature** (tab labels, section headings, breadcrumb) against an explicitly-pinned URL — do not guess at toolbar DOM selectors.

## Output format

```markdown
## Portable prototype

File: <path> — <exact bytes>
Bundler: Vite | Next.js (refused)
Opens on: <default state>

### Verified under file://
| Check | Result |
|---|---|
| Mounts, no console errors | PASS/FAIL |
| Opens on intended default | PASS/FAIL |
| Deep link survives reload | PASS/FAIL |
| Assets render | PASS/FAIL |
| A real mutation works | PASS/FAIL |

### Not covered
- <anything unverified, and why>

### At handover
Stopgap for hosting, not permissions — cannot be access-controlled once sent.
If the email bounces or the attachment is stripped (some company mail filters block .html files), zip it or share it through a drive link. Ask the recipient to download the file before opening it.
```

## Related

- `visual-qa` — for verifying UI changes generally; this skill is specifically about the artifact
