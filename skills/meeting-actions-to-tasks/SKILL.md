---
name: meeting-actions-to-tasks
description: Pull the action items out of meeting notes, call transcripts or decision logs — one task per commitment, verb-led, with owner, due date and enough context for someone who wasn't there — and, after the user confirms the list, create them in Jira, Linear, GitHub Issues, Asana or Notion, or hand back ready-to-paste drafts. Never invents owners, dates or priorities, and checks for tasks that already exist. Use when the user says "pull out the action items", "turn these notes into tickets", "make Jira or Linear tasks from this meeting", "who owns what from this call", "capture the todos", or "create follow-up tasks". Not for writing up what a meeting decided versus left open (requirements-to-decision-doc).
---

# Meeting Actions to Tasks

Extract concrete follow-up work from messy meeting notes and prepare tasks in the right system.

## Inputs

- Source notes, transcript, or a link to a document.
- The meeting date (needed to turn "by Friday" into a real date).
- Target task system, if the user has one.
- Project, team, label, milestone, or initiative, if known.

## Workflow

1. Get the source. If a linked source can be fetched with an available connector, read it. Otherwise, use pasted text. Note the meeting date; if it isn't in the notes, ask.
2. Extract only actionable commitments. For each item, identify action, owner, due date, source context, and likely project or initiative. Set aside everything else (decisions, FYIs, "maybe we should…", open questions) for the "Not turned into tasks" list.
3. Resolve ambiguity. If the owner, project, or target system is unclear, either mark it `TBD` or ask a focused question when the choice affects where work will be created.
4. Check for duplicates. If a connector to the target system is available, search it for each action (by key words and owner) and mark matches as "exists: KEY-123" instead of drafting a new task. If you can't search, say so in the confirmation table.
5. Draft the proposed tasks using `assets/template-task.md`.
6. Show the user a confirmation table before creating or updating anything, followed by the **Not turned into tasks** list so they can promote any item.
7. After explicit confirmation, create the tasks with the available connector. If no connector is available, provide ready-to-paste task drafts.
8. Report task keys, URLs, and unresolved fields.

## Confirmation table

| # | Task (verb-led) | Owner | Due | Project | Exists? |
|---|---|---|---|---|---|
| 1 | Send the revised pricing page to Legal | Priya | 2026-10-23 (from "by Friday") | Website | — |
| 2 | Decide the export file format | TBD | TBD | Reporting | exists: REP-142 |

**Not turned into tasks:** decisions ("we're keeping the two-step flow"), FYIs, and maybes ("might be worth a survey later").

## Task Quality

- One distinct action becomes one task.
- Use a verb-led summary.
- Include enough meeting context for someone absent to understand why the task exists.
- Keep assignee unset when the person is ambiguous.
- Dates in ISO format (YYYY-MM-DD). Resolve relative dates ("by Friday", "next week") against the meeting date and show the original words beside the result. A date that isn't stated or clearly implied stays `TBD`.
- Acceptance criteria only from what the notes say "done" means; otherwise `TBD`.

## Don't

- Don't create tasks before the user confirms the parsed list.
- Don't invent owners, due dates, priorities, acceptance criteria, or project mappings.
- Don't create a task that already exists; link the existing one.
- Don't merge unrelated follow-ups into one task.
- Don't preserve confidential source text beyond what the task needs.
