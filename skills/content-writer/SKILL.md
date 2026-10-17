---
name: content-writer
description: Draft LinkedIn posts, blog articles and LinkedIn document (PDF carousel) posts for UX, design-leadership and product audiences in a calm, specific, observational voice, producing two or three LinkedIn variants with different hooks, or one blog draft, each with word and character counts. Learns the user's voice from example posts they save, and logs post metrics to a playbook of what works. Use when the user says "write a LinkedIn post", "draft a post about", "turn this into a post", "blog post about", "thought leadership", "repurpose this", "save this as an example post", or "that post got 12k impressions". Not for portfolio or project case studies (case-study-capture), product UI copy or component docs (design-system-storyteller), or internal docs and decision write-ups (requirements-to-decision-doc).
---

# Content Writer

Draft LinkedIn posts, blog articles and LinkedIn document posts for UX designers, design leadership, product leaders, and founders.

## How This Skill Works

Three modes:

1. **Create** — Generate content from a topic, conversation context, or brief
2. **Learn** — Ingest example posts to refine voice and format
3. **Improve** — Log engagement metrics to evolve what works over time

## Memory System

This skill gets better over time using two memory files:

- **`content-writer-examples.md`** — Gold standard posts the user has added. These are your primary style reference. Study the structure, pacing, voice, and formatting of these examples closely; they override the default voice profile and the generic guidance below.
- **`content-writer-playbook.md`** — Evolving playbook of what works: winning formats, hooks, topics, engagement patterns.

Where they live:

- **Claude Code:** `~/.claude/content-writer/`. Read both files at the start of every invocation; create the folder and files the first time the user saves an example or logs metrics.
- **Claude.ai:** files don't persist between chats. Ask the user to keep the two files in the Project's knowledge, or to paste a few examples into the chat. Whenever a file changes during the chat, output the full updated file so the user can replace the saved copy.

**First run.** If there are no examples yet, ask for two or three posts the user has written (or admires and wants to sound like) before the first draft, and save them. A few real posts calibrate the voice better than any description. If the user would rather skip this, write in the default voice profile below and say that's what you did.

---

## Mode 1: Create Content

### Step 1: Understand the brief

At minimum you need:
- **Topic or subject** (can come from conversation context)
- **Format**: LinkedIn post, blog post, LinkedIn document (carousel) post, or repurpose mode
- **Angle** (optional): contrarian take, personal observation, framework, etc.

If format isn't specified, default to LinkedIn post. If the user says "write about this" during a conversation, pull the topic from what you've been discussing.

### Step 2: Check memory files

Read the examples and playbook. These are your voice calibration. If examples exist, match their structure, pacing, and tone rather than the default profile below.

### Step 3: Generate content

Read `references/hook-patterns.md` before writing hooks. It holds the four hook types this voice uses, with patterns, examples and failure modes, and the rule that numbers come only from the user's real data.

**For LinkedIn posts:** Produce 2-3 distinct versions, each with a different hook type. Label them simply:

**Variant A — [Hook type]**
(the post)

**Variant B — [Hook type]**
(the post)

After the variants, add a short note on which you'd recommend and why.

**For blog posts:** Produce 1 polished draft only. Blog posts are long enough that multiple variants create an overwhelming wall of text. Pick the strongest hook for the topic, write one complete draft, and offer to revise or try a different angle if the user wants.

**Always include word count.** At the end of each variant or draft, show the word count and character count so the user can gauge length at a glance. Format: `[~X words / ~Y characters]`

### Step 4: Iterate

The user picks one or asks for revisions. Refine until they're happy.

---

## Mode 2: Learn from Examples

When the user pastes a post or says "save this as an example":

1. Read existing `content-writer-examples.md` (or create it)
2. Append with metadata:
   ```
   ## Example: [Topic summary]
   **Date added:** [date]
   **Format:** LinkedIn post / Blog / Document post
   **Performance:** [metrics if shared]
   **Hook type:** [type]
   **Why it works:** [brief analysis]
   **Voice patterns:** [specific observations about structure, pacing, tone]

   ---
   [The actual post content]
   ---
   ```
3. Update `content-writer-playbook.md` if you notice new patterns

---

## Mode 3: Log Engagement & Self-Improve

The user can report metrics casually ("that last post got 12k impressions") or structured.

When they report:
1. Update the post's performance data in `content-writer-examples.md`
2. Update `content-writer-playbook.md` with emerging patterns
3. Surface insights computed from the logged numbers, e.g. "Your observation-style posts are averaging 3x the engagement of your framework posts"

---

## Voice & Tone — Default Profile

This is the default voice: the one to use until the user's saved examples exist, and the fallback where they don't say otherwise. Once examples exist, they win wherever they differ from this section. Whichever voice applies, it should feel like a real person thinking out loud, not a content strategist optimizing for engagement.

### The default voice: Analytical Observer

Think of someone standing slightly above the fray, noticing patterns others miss, and sharing what they see with calm confidence. Not shouting. Not lecturing. Not performing. Just thinking clearly in public.

**Observational, not prescriptive.**
- YES: "That is a meaningful shift."
- YES: "What is interesting about this is..."
- YES: "The pattern is bigger than one use case."
- NO: "Stop doing X. Start doing Y."
- NO: "Here's why you need to..."
- NO: "5 things every design leader must know"

**Measured confidence.**
State positions directly without hedging, but don't yell. No exclamation marks. No ALL CAPS for emphasis. No hype words (game-changing, revolutionary, incredible). Let the idea carry the weight.

**Analytical depth.**
Build arguments incrementally. Each paragraph advances the thought by one step. The reader should feel like they're following a line of reasoning, not being pitched.

**Specific and grounded.**
Anchor in real examples with real numbers: "14 components across 3 product teams" is better than "dozens of components across multiple teams." Name the tools, quote the metrics, reference the specific situation. Specificity is credibility, which is why the numbers must be the user's own, from the brief, the conversation, or the examples file. If a number would help and you don't have one, ask, or leave a marked slot like `[number of teams]`. An invented statistic under the user's name is a credibility problem they can't take back.

**Curious, not certain.**
Frame insights as discoveries, not pronouncements. "What is interesting about..." and "That is not something I could have described efficiently" read as someone genuinely thinking, not someone performing thought leadership.

### Formatting rules

Defaults for LinkedIn posts, each with its reason, so you can tell when a user's examples deliberately break one:

- **No bold text.** LinkedIn posts have no bold formatting. The "bold" people paste in is made of Unicode math-alphabet characters, which screen readers may read letter by letter or skip, and which LinkedIn search doesn't match as ordinary words. Markdown `**bold**` just shows up as asterisks.
- **No headers or subheadings** in LinkedIn posts. It's flowing prose, and the post editor has no headings to render them with.
- **No numbered lists with bold labels.** Same reason as bold. If you use a list, keep it plain: just the items.
- **Single-sentence paragraphs** are a primary pacing tool. Use them for emphasis and breathing room.
- **No emoji.** Screen readers read each emoji's name aloud ("rocket", "light bulb"), which breaks up the sentence, and emoji pull the tone toward the hype this voice avoids.
- **No engagement-bait endings.** Don't end with "Agree or disagree?" or "What do you think?" or "Drop your take below." If the post is strong, people will engage. End with your strongest thought: a statement, not a question.
- **Hashtags are optional: 0-3, CamelCase, at the very end.** Third-party analyses of 2025-26 LinkedIn data suggest hashtags add little or no reach (vendor data, so treat it as directional), and a long block of them reads as spam. Write them in CamelCase (#DesignSystems, not #designsystems) so screen readers can pronounce the words.
- **No meta-labels.** Don't start with "LinkedIn Post:" or "Topic:" or "Format:"; just write the post.

### Platform facts (checked 2026-10)

LinkedIn changes these without notice; re-check them if a draft depends on one.

- **Length cap:** posts can contain up to 3,000 characters (LinkedIn Help). Anything longer belongs in a LinkedIn article or the blog.
- **The "see more" fold:** the feed truncates a post after about 140 characters on mobile and about 210 on desktop, per third-party measurements, and line breaks pull the cut earlier. The hook has to land before it.
- **Links in the post body:** some third-party studies report lower reach for posts with an external link; others found no penalty. Treat it as unsettled. Keep the link where it serves the reader, and let the user decide whether to move it to a comment.
- **No threads, and "carousel" means a document post:** LinkedIn has no thread format. A carousel is an uploaded document (PDF, PPT, PPTX, DOC or DOCX, up to 300 pages and 100 MB, per LinkedIn Help) shown page by page. LinkedIn lets viewers download it as a PDF for accessibility, so export pages with real, selectable text rather than flattened images.

### Length

LinkedIn posts should run **1,500-2,500 characters** (not words), comfortably under the 3,000-character cap. That is longer than the usual short-post advice, and it's intentional: this voice earns attention through depth, not brevity. Every paragraph should pull its weight, but don't artificially compress.

### Structure pattern

The posts follow a consistent architecture even though they look like free-flowing prose:

1. **Hook** (1-2 sentences) — A reframe, observation, or contrarian claim that creates tension
2. **The problem** (2-3 short paragraphs) — Establish what most people get wrong or overlook
3. **The shift** (1-2 paragraphs) — Introduce the insight or alternative framing
4. **Concrete example** (2-4 paragraphs) — A specific, real-world case with hard numbers from the user. This is where the post earns its credibility.
5. **The bigger pattern** (1-2 paragraphs) — Zoom out. Show that the example illustrates something larger.
6. **Landing** (1-2 sentences) — A forward-looking statement. Not a question. Not a CTA. Just the strongest version of the idea.

This structure should feel invisible to the reader. It reads as someone thinking through an idea, not following a template.

---

## LinkedIn Hook Patterns

The hook creates tension or curiosity in the first 1-2 lines, before the "see more" fold. `references/hook-patterns.md` has the full library.

**Preferred hook types for this voice:**

| Type | Example |
|------|---------|
| Reframe | "The biggest bottleneck in working with LLMs is not the model. It's the interface." |
| Observation | "Something is shifting in how companies think about design leadership." |
| Quiet contrarian | "We are still trying to communicate high-resolution ideas through a text box." |
| Specific claim | "We cut design review from [rounds before] rounds to [rounds after] with one process change." (only with the user's real figures) |

**Hook types to avoid:**
- Shock/clickbait: "I fired our best designer last month." The payoff rarely matches the setup, and readers feel baited.
- Self-deprecating humble brags: "I failed spectacularly and here's what I learned." This audience can smell manufactured vulnerability.
- Direct commands: "Stop doing X right now." That's the prescriptive voice this skill avoids.
- Questions: "What's the most expensive design decision you've ever made?" A question hook hands the work to the reader instead of offering a thought.

The hook should feel like the opening line of an essay, not a headline.

---

## Blog Post Guidelines

Blog posts allow more structure than LinkedIn, but the voice stays the same.

### Structure

```
# [Headline — specific claim or observation, not clickbait]

**TL;DR:** [One-sentence key takeaway]

## Table of Contents
- [Section 1 title]
- [Section 2 title]
- [Section 3 title]
- [Section 4 title]

[Opening hook — same principles as LinkedIn, but can be 2-3 sentences]

## [Section 1: The problem or context]
[Set up what most people get wrong]

## [Section 2: The insight]
[The core argument with evidence and examples]

## [Section 3: Supporting evidence or deeper exploration]
[Data, case studies, additional angles]

## [Section 4: What this means in practice]
[Concrete implications, actionable shifts]

## [Closing section]
[Forward-looking statement, not a recap]
```

### Blog-specific notes

- **1,500-2,500 words** for standard posts. Blog posts are where you go deep — give the argument room to breathe with evidence, examples, and nuance.
- **Include a table of contents** after the TL;DR. List the H2 section titles as a scannable outline so readers can jump to what interests them.
- **4-6 H2 sections.** Enough to build a thorough argument with distinct beats.
- **Scannable** — use H2s and the occasional bullet point, but don't over-structure. The prose should still flow.
- **TL;DR up front** — give away the punchline
- **Mix evidence with observation** — data without perspective is Wikipedia. Perspective without data is a tweet.
- **2-3 actionable implications** — but frame them as observations ("The teams that do X tend to...") not commands ("You should do X")
- **Same voice as LinkedIn posts.** The only difference is that blog posts use H2 headers and run longer. The tone, pacing, and formatting rules (no bold in prose, no emoji, observational not prescriptive) are identical.

---

## LinkedIn Document Post (Carousel)

When the user asks for a carousel, slides, or a document post, write the page-by-page text for a document post (see "Platform facts"):

- **Page 1**: Hook + topic preview (the cover)
- **Pages 2-7**: One idea per page, 1-3 short sentences each
- **Final page**: The landing statement
- Each page stands alone while building a narrative
- Same voice rules — no bold, no emoji, observational tone
- Add the short post text that goes above the document, with its own hook

The user lays the pages out in their design tool and uploads the PDF.

---

## Repurpose Mode

When asked to repurpose content, produce:
1. **LinkedIn post** — the observational, flowing prose version
2. **Blog post** — the expanded, structured version
3. **LinkedIn document post** — the page-by-page breakdown
4. **One-liner** — a single-sentence distillation

---

## Audience Context

Primary audience:

- **UX Designers** — mid-to-senior practitioners thinking about craft and career
- **UX Leadership** — Directors, VPs, Heads of Design managing teams and strategy
- **Product Leadership** — CPOs, VPs of Product, PMs who work closely with design
- **Founders & CEOs** — Technical and non-technical leaders who value design
- **Design-adjacent** — Engineers, researchers, ops people in the design ecosystem

This audience values: real observations over advice, specific examples over abstract principles, analytical depth over hot takes, and someone thinking clearly over someone performing confidence.

They can smell: AI-generated content, engagement farming, manufactured vulnerability, and opinions without experience behind them.
