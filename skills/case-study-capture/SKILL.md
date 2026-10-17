---
name: case-study-capture
description: Capture or reconstruct an evidence-based case study, interviewing for problems, decisions, personal influence and outcomes before shaping a clear narrative. Use for writing or improving a project case study, recording its decisions during work, or preparing a case-study handoff. Website implementation is a separate requested deliverable.
---

# Case Study Capture

Make the information and decisions easy to follow. Explain what was difficult, what the author
contributed, why choices were made and what changed. Preserve the approved visual design; this
skill supplies writing and evidence guidance, not art direction or asset-placement rules.

## Choose the deliverable from the request

Use the current request and existing authorization; do not repeat questions already answered.

- **Live capture:** record decisions while participating in the work. Once capture is active,
  append meaningful corrections, rejections, findings and failures without waiting to be asked.
- **Retrospective:** reconstruct older work from the author's account and surviving evidence.
  State that the original work was not observed. Never claim a firsthand diary or invent a sequence.
- **Narrative or handoff:** interview only the important gaps, then deliver usable writing and
  references. A document-only handoff is complete work; it does not require a webpage.
- **Website implementation:** only when requested, work through the receiving repo's current
  scope, route, components and checks. A later document-only request stops that implementation.

Capture operates during the active session; it is not a background watcher. On resume, read the
latest scope and next action before older plans. An audit of this skill does not start a project interview.

## Keep evidence and presentation separate

Use the author's designated draft location first, such as an existing `case-drafts` inbox. Otherwise,
use `CASE_STUDY_<SLUG>.md` in the project root only when its contents are appropriate for that repository. For confidential work, keep raw evidence and sensitive quotations in an authorized
private location outside Git; put only cleared material in the presentation draft or handoff.
A private repository is still a disclosure destination. Do not copy restricted source, customer
records, internal links, credentials or private career context into a PR, public asset or memory.

Record the current deliverable, approved scope, evidence location, last update and next action.
For claims, distinguish **owner-reported**, **contemporaneous record**, **observed implementation**,
**external research** and **inference**. Preserve source revision/date where available. A requirements
page supports design intent, not customer validation; a prototype does not prove shipped behavior.
Keep team outcomes distinct from individual contribution. Unknown dates, costs and metrics stay unknown.

## Interview before polishing

Read [references/interview.md](references/interview.md) when important narrative evidence is missing.
Start with the most consequential gap. Ask **one short question at a time**, wait, and follow the
answer. Skip established facts. Probe vague claims for a specific situation, action and consequence.
Do not hand the author a questionnaire or force every topic into every case.

Find the actual pain point and how it was known, the stakes and constraints, consequential choices,
the author's influence and the supported result. “I aligned stakeholders” needs an example of the
decision and the author's intervention. “It improved the experience” needs a concrete change and evidence.
Do not lead the author toward a flattering answer, invent disagreement or demand a numerical result.
Briefly restate important causal claims so the author can correct them.

If asked to draft now, stop interviewing and record unanswered questions in the private handoff.
The draft can be provisional; smooth prose must not conceal missing evidence.

## Preserve the live decision record

The agent present for the work maintains the running record. Do not hand its authorship to a fresh
subagent and ask it to reconstruct missing causality. Retrospective work must label what is reconstructed.

| Moment | Record |
|---|---|
| A choice is made | The choice, actual alternatives, evidence, tradeoff and who decided |
| A direction is rejected or corrected | Exact wording when appropriate for the private record, the specific defect and resulting change |
| Research returns | Finding, source URL, evidence limits and what it changed |
| A constraint or dead end appears | What happened, why it mattered and known cost |
| Money or credits are spent | Known amount and source; do not infer zero from missing records |
| A tool or process fails | Include the agent's own errors and the consequence, not only tool failures |

Append short entries as these happen. Preserve the order of approvals and later reversals.
Keep relevant rejected artifacts in their permitted location; exclusion from presentation does not
mean deletion. On synthesis, retain the private history rather than rewriting it into a success story.

## Write the case

Establish the product's audience, purpose and problem or opportunity. Make the author's responsibility
and collaborators clear. Develop the consequential decisions in connected, plain language:
**problem → actual options → the author's influence → choice and tradeoff → resulting change**.
This is a reasoning aid, not a mandatory heading sequence or page layout. Select what helps the reader
understand the work; do not recount every activity or make up an alternative to fill a slot.

Connect claims to the artifacts or observations that support them. Explain technical detail only
when it clarifies a constraint or decision. Attribute reported outcomes and label hypotheses. Retain
uncertainty and shared credit. A transferable lesson must come from something the project demonstrated.

Preserve the existing approved design. Do not introduce a new visual language, borrow external art
direction or prescribe where images and prototypes appear while improving the writing.

## Hand off or render only within scope

Read [references/handoff.md](references/handoff.md) when preparing a receiving-repo handoff or coded
exhibits. Record which source/version each exhibit represents, its data and action limits, and the
revision actually verified. Do not label scenarios or loading/empty/error states as historical versions.

For requested page work, inspect the destination's current route, component APIs and theme. Reuse
its approved template and provide content as data when supported. Do not hardcode an older component
catalog or create a new diagram skill. Honor the user's diagram format; attach evidence independently
of the rendering technology. A read-only receiving repo gets a handoff unless editing it is authorized.

## Completion check

- The reader can understand a concrete problem, the author's contribution and why the important choices mattered.
- Claims have evidence or clear attribution; missing evidence remains visible in the private record.
- Sensitive material stays in its permitted destination; the presentation excludes private working notes.
- The current scope and next action are accurate. A document handoff does not imply publication or deployment.
- Relevant prior verification is marked stale after source, data, entry-state or screenshot changes.

Deliver the requested narrative or handoff with its meaningful limits. Do not call a case publication-ready
merely because the layout is finished, and do not expand a writing task into implementation to make it feel complete.
