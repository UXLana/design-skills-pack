---
name: meeting-actions-to-tasks
description: Extract action items from meeting notes, call transcripts, or decision logs and turn them into proposed tasks for a task system such as Jira, Linear, GitHub Issues, Asana, or Notion. Use when the user asks to capture todos, convert meeting notes into tickets, extract owners and due dates, or create follow-up tasks.
---

# Meeting Actions to Tasks

Extract concrete follow-up work from messy meeting notes and prepare tasks in the right system.

## Inputs

- Source notes, transcript, or a link to a document.
- Target task system, if the user has one.
- Project, team, label, milestone, or initiative, if known.

## Workflow

1. Get the source. If a linked source can be fetched with an available connector, read it. Otherwise, use pasted text.
2. Extract only actionable commitments. For each item, identify action, owner, due date, source context, and likely project or initiative.
3. Resolve ambiguity. If the owner, project, or target system is unclear, either mark it `TBD` or ask a focused question when the choice affects where work will be created.
4. Draft the proposed tasks using `template-task.md`.
5. Show the user a confirmation table before creating or updating anything.
6. After explicit confirmation, create the tasks with the available connector. If no connector is available, provide ready-to-paste task drafts.
7. Report task keys, URLs, and unresolved fields.

## Task Quality

- One distinct action becomes one task.
- Use a verb-led summary.
- Include enough meeting context for someone absent to understand why the task exists.
- Keep assignee unset when the person is ambiguous.
- Use ISO dates when a due date is stated or can be inferred confidently.

## Don't

- Don't create tasks before the user confirms the parsed list.
- Don't invent owners, due dates, priorities, or project mappings.
- Don't merge unrelated follow-ups into one task.
- Don't preserve confidential source text beyond what the task needs.
