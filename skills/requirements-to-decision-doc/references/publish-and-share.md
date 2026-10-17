# Publish & Share

Only do this when the user asks to publish or share. The artifact is a standalone HTML file with no build step.

## Host on Vercel (via GitHub)

The cleanest setup: one repo, auto-deploy on push.

1. Put the artifact in a repo. **The shared landing page should be `index.html`** — Vercel serves `index.html` at the root by default. If the doc isn't the only artifact, either rename it to `index.html` (and rename any existing prototype, fixing cross-links) or add a `vercel.json` rewrite (`{ "rewrites": [{ "source": "/", "destination": "/your-doc.html" }] }`). Renaming is cleaner long-term; the rewrite is non-destructive.
2. `git push` — if the Vercel project is connected to the repo, it auto-deploys in ~30–60s.

### If Vercel blocks the deployment

Vercel checks that the commit's author is allowed to deploy the project. Two different causes produce a "deployment blocked" message; read the message before changing anything, and see Vercel's guide "Why aren't commits triggering deployments on Vercel?" (vercel.com/kb/guide/commits-not-triggering-deployments).

1. **The commit email isn't linked to a GitHub account** ("commit email … could not be matched"). Fix without exposing a real email: set the repo's git email to the GitHub no-reply address and re-author the latest commit.

   ```bash
   git config user.email "<ID>+<username>@users.noreply.github.com"   # ID from: gh api user --jq .id
   git commit --amend --no-edit --reset-author
   git push --force-with-lease
   ```

   `--amend` rewrites the latest commit, so the push has to replace the old one on GitHub (`--force-with-lease`, which refuses if someone else pushed in the meantime). Only do this on a branch nobody else works on; otherwise make a new commit with the right email instead.

2. **Hobby plan, and the commit wasn't made by the project's owner.** Vercel's Hobby plan deploys only the account owner's commits; matching emails doesn't change that. Fixes: move the project to the committer's own Vercel account, have the owner push, or use a Pro team.

## Mirror to Confluence for inline comments

HTML on Vercel is great for reading but can't be commented on line-by-line. To collect feedback, mirror it into Confluence (by hand, or with a Confluence mirror step if you use one) — native tables/panels/status lozenges that every reviewer can comment on inline, with the flow diagrams embedded by URL from the Vercel deploy.

## Slack share message

Keep it short, lead with the links, and assign asks by name. **Default: periods/colons, not em-dashes**; adjust to the user's style. Don't tell readers how to think about the doc — state what it is.

Template:

```
Hey <names> 👋 Following up on <when/context>. I turned what we aligned on into a first-round draft of the <workflow>.

📋 Confluence (comment inline): <confluence-url>
🖥️ Clickable version (flows + toggles): <vercel-url>

It covers <2–4 area summary>, with first-round requirements tagged Decided / Assumed / Open.

• <Person> — keen on your read of <their area>.

Working draft, nothing committed. It's a starting point for the conversation and a launching pad for the first round of prototypes. Happy to walk through it live if useful.
```

Offer it in an editable form when possible so the user can tweak before sending.

## Access level when sharing for review

Recommend **view/comment**, not edit. The user stays the single editor so the doc stays internally consistent; reviewers comment inline (Confluence "Can view" still allows comments in most Cloud setups). Escalate a specific person to edit only if the back-and-forth gets heavy.
