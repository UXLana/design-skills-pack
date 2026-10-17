# Design Skills Pack

20 skills for Claude Code and Codex, written for product designers and design leaders. They cover the
whole job: framing the problem, building on a design system, prototyping and QA, accessibility, handing
off to engineering, and showing what the work changed.

A skill is a folder of instructions your AI agent loads when your request matches it. Claude Code and
Codex read the same `SKILL.md` format, so one folder works in both. You don't have to remember commands.
Say "audit this page for accessibility" or "turn these meeting notes into a design brief" and the
matching skill takes over, with a method, a checklist, and an output format a senior designer would
recognize.

These are the skills I use in my own practice, cleaned up so they work for any team, any design system,
and any brand.

## The designer journey

| Stage | Skill | What it does for you |
| --- | --- | --- |
| **1. Frame & decide** | `design-brief-generator` | Runs guided discovery one section at a time, or turns kickoff notes, Slack threads and intake-form answers into a design brief: problem, users, hypothesis, scope, accessibility target and success metrics. |
| | `design-lead-thought-partner` | A candid thinking partner for brainstorming, stress-testing ideas and working through tradeoffs, with decision frameworks (Cynefin, RICE, RAPID, MoSCoW) when you want structure. |
| | `requirements-to-decision-doc` | Turns raw requirements, sync notes or PRD fragments into a status-tagged decision doc (markdown, or a hosted HTML page) that engineering and stakeholders can review. |
| **2. Design with a system** | `brand-tokens-translator` | Reads brand guidelines (PDF, text or screenshots) and produces primitive and semantic design tokens as a review table and a DTCG `tokens.json` that Figma can import and CSS can use. |
| | `theme-generator` | Builds a full product theme from one brand color, and audits existing themes for token coverage and contrast. |
| | `token-audit` | Finds hard-coded colors, spacing, type, radii and shadows in code and maps each one to a token, or flags it for a new one. |
| | `component-generator` | Creates production-ready React and TypeScript components on top of your existing primitives, following atomic design. |
| | `icon-generator` | Generates outline and filled SVG icons with React wrappers, token-driven sizing and built-in accessibility. |
| **3. Prototype & QA** | `flow-capture` | Maps every screen in a requirements doc into a color-coded flow, phased Crawl / Walk / Run, showing what's built and what's missing. |
| | `ui-edge-case-audit` | Finds the empty, loading, error and boundary states a prototype forgot, then builds them. |
| | `responsive-audit` | Catches fixed widths, rigid flex layouts, missing breakpoints and cropped images before they ship. |
| | `visual-qa` | Checks UI changes with real browser screenshots and interaction checks on desktop and mobile. |
| | `portable-prototype` | Turns a Vite prototype into one self-contained HTML file that anyone can open by double-clicking, so you can email a clickable prototype with no server or hosting. |
| **4. Accessibility** | `design-accessibility` | Audits and fixes components, tokens and screens against WCAG 2.2 AA. Compliance mode maps findings to the standard your contract names (Section 508, ADA Title II, or EN 301 549 for the European Accessibility Act), and report mode writes a formal conformance report. Every finding cites its source, so a team preference is never passed off as a WCAG failure. |
| **5. Hand off** | `intent-spec` | Interviews you one question at a time to capture a feature's intent, then adds the scope, edge cases, states, accessibility and test plan to make it build-ready. Your decisions stay yours. |
| | `spec-pack` | Writes a short spec contract before AI-assisted coding starts, or reverse-engineers one from a feature that already exists. |
| | `flow-diagram-render` | Renders Mermaid diagrams to PNG or SVG for the places live Mermaid doesn't run: Confluence, Slack, slides, PDFs and email. |
| | `meeting-actions-to-tasks` | Turns meeting notes or a call transcript into proposed tasks for Jira, Linear, GitHub Issues, Asana or Notion, and creates nothing until you confirm the list. |
| **6. Show the impact** | `case-study-capture` | Interviews you for the problem, decisions, your influence and the outcomes, then shapes an evidence-based case study. |
| | `content-writer` | Drafts LinkedIn posts and blog articles for UX and product leadership audiences, from hook to closing line. |

### Why accessibility has its own stage

Accessibility isn't a QA step you add at the end. `design-accessibility` covers WCAG 2.2 AA in full, plus
the legal standards teams actually get held to: Section 508 for US federal work, ADA Title II for state
and local government, and EN 301 549 for the European Accessibility Act. It has references for color
contrast, keyboard, pointer targets, forms, ARIA patterns, motion, typography and cognitive load. Several other skills (`theme-generator`,
`icon-generator`, `intent-spec`, `spec-pack`) build accessibility checks into their own steps, so it
shows up from the first token onward.

## Where they run

| Tool | Status |
| --- | --- |
| **Claude Code** | Built for it. Every skill in the pack is used there. |
| **Codex** | Same format. Tested so far: `case-study-capture`. The others should load too, but a few lean on Claude Code tools (web search, subagents, the built-in browser), so expect to point them at Codex's equivalents. |
| **Claude.ai** (bonus) | Good for the skills that don't touch code: `design-brief-generator`, `design-lead-thought-partner`, `requirements-to-decision-doc`, `brand-tokens-translator`, `intent-spec`, `meeting-actions-to-tasks`, `case-study-capture` and `content-writer`. |

## Install in Claude Code

Claude Code loads personal skills from `~/.claude/skills/`. Each skill is a folder with a `SKILL.md` inside.

1. Download the pack:

   ```bash
   git clone https://github.com/UXLana/design-skills-pack.git
   ```

2. Copy every skill into your personal skills folder:

   ```bash
   mkdir -p ~/.claude/skills && cp -R design-skills-pack/skills/* ~/.claude/skills/
   ```

   Or copy just the ones you want:

   ```bash
   cp -R design-skills-pack/skills/design-accessibility ~/.claude/skills/
   ```

3. Start a new Claude Code session. Skills load when a session starts.

4. Use them. Describe the task in plain language ("check this page for responsive issues"), or call one
   by name, such as `/design-accessibility`.

To share skills with a team through a repository, put them in that project's `.claude/skills/` folder
instead. Everyone who opens the project in Claude Code gets them.

## Install in Codex

Codex loads personal skills from `~/.agents/skills/`. Older Codex releases used `~/.codex/skills/`; if
your version doesn't list the skills, copy them there instead.

1. Download the pack (skip this if you already cloned it for Claude Code):

   ```bash
   git clone https://github.com/UXLana/design-skills-pack.git
   ```

2. Copy every skill into your Codex skills folder:

   ```bash
   mkdir -p ~/.agents/skills && cp -R design-skills-pack/skills/* ~/.agents/skills/
   ```

3. Use them. Codex picks up new skills on its own; restart it if one doesn't appear. Run `/skills` to
   see what's loaded, type `$` to call one by name (for example `$case-study-capture`), or just describe
   the task.

To share skills with a team, put them in the repository's `.agents/skills/` folder.

## Bonus: install in Claude.ai (web and desktop)

Best for the non-coding skills listed under [Where they run](#where-they-run). Claude.ai takes skills one
at a time, as ZIP files, and needs code execution turned on.

1. Turn on code execution. On Free, Pro and Max plans, go to **Settings > Capabilities** and turn on
   **Code execution and file creation**. On Team and Enterprise plans an owner enables it, along with
   Skills, in **Organization settings > Plugins & skills**.

2. Zip the skill folder. The ZIP has to contain the folder itself, not loose files, and the folder name
   has to match the skill name. From inside the `skills` folder:

   ```bash
   zip -r design-accessibility.zip design-accessibility
   ```

3. In Claude.ai, go to **Customize > Skills**, click **+**, then **+ Create skill**, then
   **Upload a skill**, and choose the ZIP.

4. The skill appears in your list. Toggle it on, then ask for the task in plain language.

Repeat for each skill you want. Anthropic's current steps are in
[Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills).

## Before you install

- **Read a skill before you install it.** A skill is a set of instructions your agent follows. Every one in
  this pack is plain Markdown, so you can see exactly what it does.
- **Some skills expect a stack.** `component-generator`, `token-audit`, `responsive-audit` and
  `design-accessibility` assume a React and TypeScript codebase with design tokens. `visual-qa` needs a
  browser tool (Claude's built-in browser or Playwright). `flow-diagram-render` and `flow-capture` render with
  Mermaid CLI through `npx` (the first run downloads a headless Chrome), and `theme-generator` ships a small
  contrast script, so all three need Node.js. `portable-prototype`
  works on Vite prototypes only and adds the `vite-plugin-singlefile` package.
- **They adapt to your system.** Wherever a skill mentions "your design system," it looks for your tokens,
  components and conventions in the project you're working in. Nothing here is tied to a brand.
- **Memory is optional.** A few skills can recall past results and save new ones if your setup has a
  persistent memory tool. Without one, they work the same, minus the recall step.

## Pairs well with

- [Anthropic's `frontend-design` skill](https://github.com/anthropics/skills), for distinctive,
  production-grade frontend visuals. It isn't included here because it isn't mine to redistribute.

## License

[MIT](LICENSE). Use the skills, change them, and share them. Keep the copyright notice.

## About

Made by Lana Holston, a product design leader working on design systems, accessibility and AI-assisted design
workflows. More at [lanaholston.com](https://lanaholston.com).
