# Design Skills Pack

21 Claude skills for product designers and design leaders, covering the whole job: framing the problem,
building on a design system, prototyping and QA, accessibility, handing off to engineering, and showing
what the work changed.

A skill is a folder of instructions Claude loads when your request matches it. You don't have to
remember commands. Say "audit this page for accessibility" or "turn these meeting notes into a design
brief" and the matching skill takes over, with a method, a checklist, and an output format a senior
designer would recognize.

These are the skills I use in my own practice, cleaned up so they work for any team, any design system,
and any brand.

## The designer journey

| Stage | Skill | What it does for you |
| --- | --- | --- |
| **1. Frame & decide** | `design-brief-generator` | Runs guided discovery, or synthesizes notes, Slack threads and form responses into a structured design brief or PRD. |
| | `design-lead-thought-partner` | A candid thinking partner for brainstorming, stress-testing ideas and working through tradeoffs, with decision frameworks (Cynefin, RICE, RAPID, MoSCoW) when you want structure. |
| | `requirements-to-decision-doc` | Turns raw requirements, sync notes or PRD fragments into a status-tagged HTML decision doc that engineering and stakeholders can review. |
| **2. Design with a system** | `design-system-perspectives` | Before risky design-system work, argues the positive, negative and neutral case and waits for your call. |
| | `brand-tokens-translator` | Reads brand guidelines (PDF, text or screenshots) and produces primitive and semantic design tokens for Figma Variables and CSS. |
| | `theme-generator` | Builds a full product theme from one brand color, and audits existing themes for token coverage and contrast. |
| | `token-audit` | Finds hard-coded colors, spacing, type, radii and shadows in code and maps each one to a token, or flags it for a new one. |
| | `component-generator` | Creates production-ready React and TypeScript components on top of your existing primitives, following atomic design. |
| | `icon-generator` | Generates outline and filled SVG icons with React wrappers, token-driven sizing and built-in accessibility. |
| | `design-system-storyteller` | Writes realistic usage examples and copy for component docs. No lorem ipsum. |
| | `design-system-ui` | A focused visual and UX polish pass on a design-system docs site: hierarchy, spacing, states, responsive behavior and motion. |
| **3. Prototype & QA** | `flow-capture` | Maps every screen in a requirements doc into a color-coded flow, phased Crawl / Walk / Run, showing what's built and what's missing. |
| | `ui-edge-case-audit` | Finds the empty, loading, error and boundary states a prototype forgot, then builds them. |
| | `responsive-audit` | Catches fixed widths, rigid flex layouts, missing breakpoints and cropped images before they ship. |
| | `visual-qa` | Checks UI changes with real browser screenshots and interaction checks on desktop and mobile. |
| **4. Accessibility** | `design-accessibility` | Audits and fixes components and tokens against WCAG 2.2 AA, with a compliance mode that adds Section 508 for government and regulated work, and a report mode for formal documentation. Every finding cites its source, so a team preference is never passed off as a WCAG failure. |
| **5. Hand off** | `intent-spec` | Interviews you one question at a time to capture a feature's intent, then adds the scope, edge cases, states, accessibility and test plan to make it build-ready. Your decisions stay yours. |
| | `spec-pack` | Writes a short spec contract before AI-assisted coding starts, or reverse-engineers one from a feature that already exists. |
| | `flow-diagram-render` | Renders Mermaid diagrams to PNG or SVG for the places live Mermaid doesn't run: Confluence, Slack, slides, PDFs and email. |
| **6. Show the impact** | `case-study-capture` | Interviews you for the problem, decisions, your influence and the outcomes, then shapes an evidence-based case study. |
| | `content-writer` | Drafts LinkedIn posts and blog articles for UX and product leadership audiences, from hook to call to action. |

### Why accessibility has its own stage

Accessibility isn't a QA step you add at the end. `design-accessibility` covers WCAG 2.2 AA in full,
plus Section 508 for teams selling to government, with references for color contrast, keyboard, forms,
ARIA patterns, motion, typography and cognitive load. Several other skills (`theme-generator`,
`icon-generator`, `intent-spec`, `spec-pack`) build accessibility checks into their own steps, so it
shows up from the first token onward.

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

## Install in Claude.ai (web and desktop)

Claude.ai takes skills one at a time, as ZIP files. Skills need code execution turned on.

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

- **Read a skill before you install it.** A skill is a set of instructions Claude follows. Every one in
  this pack is plain Markdown, so you can see exactly what it does.
- **Some skills expect a stack.** `component-generator`, `token-audit`, `responsive-audit` and
  `design-accessibility` assume a React and TypeScript codebase with design tokens. `visual-qa` needs a
  browser tool (Claude's built-in browser or Playwright). `flow-diagram-render` runs Mermaid CLI through
  `npx`, so it needs Node.js.
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

Made by Lana Holston, a UX design leader working on design systems, accessibility and AI-assisted design
workflows. More at [lanaholston.com](https://lanaholston.com).
