---
name: project-os
description: Activates long-term project OS mode. Maintains project context, logs decisions and assumptions, detects contradictions, and suggests next steps across conversations. Use when managing ongoing projects, research, or any work that spans multiple sessions.
allowed-tools: Read, Write, Edit, Bash, Agent, Glob, Grep
argument-hint: [project-name or "briefing" or "sync"]
model: opus
effort: high
---

# Project OS — Persistent Project Intelligence

Task: $ARGUMENTS

## Activation Modes

Detect which mode from $ARGUMENTS:

- **briefing** → summarize all active projects, surface overdue items and contradictions
- **sync** → pull latest from all connected integrations for the active project
- **<project-name>** → load full context for that project and enter project mode
- *(no args)* → ask which project to activate, or create a new one

---

## Step 1: Load Project Context

Read `.claude/project-os/` directory if it exists.

```
.claude/project-os/
  active-project.json     # currently active project ID + name
  projects/<name>.json    # per-project state snapshot
  assumptions/<name>.md   # assumptions log
  decisions/<name>.md     # decision log
  contradictions.md       # flagged contradictions
```

If directory doesn't exist, create it and prompt for first project setup.

## Step 2: Build Context Block

Assemble from project file:
- Project title, status, description
- Open tasks (max 10, sorted by priority)
- Recent decisions (last 7 days)
- Active assumptions with confidence scores
- Any unresolved contradictions
- Upcoming reminders

Inject as a structured block at the start of your response.

## Step 3: Process the Request

Handle any user request in the context of the loaded project.

**When user states a decision:**
- Log it to `decisions/<project>.md` with timestamp
- Check if it contradicts any existing assumption (keyword + semantic match)
- If contradiction found → flag it clearly with the conflicting item

**When user states an assumption:**
- Log it to `assumptions/<project>.md` with confidence (default 80%)
- Check against existing assumptions for conflicts
- Append `[CONTRADICTION]` tag if conflict detected

**When user completes a task:**
- Mark complete in project file
- Ask if there are follow-on tasks to add

**When user asks "what next" or similar:**
- Analyze open tasks, blocked items, and recent decisions
- Suggest 3-5 specific next actions ordered by impact/urgency

## Step 4: Update State

After processing:
1. Write updated project snapshot to `.claude/project-os/projects/<name>.json`
2. Append any new decisions/assumptions to their logs
3. Update `contradictions.md` if new conflicts found
4. Print a 2-line status footer: tasks open, any new contradictions

---

## Project File Schema

```json
{
  "id": "string",
  "name": "string",
  "status": "active|paused|completed",
  "description": "string",
  "goals": ["string"],
  "open_tasks": [
    {"id": "string", "title": "string", "priority": "high|medium|low", "created": "ISO date"}
  ],
  "completed_tasks": ["title strings"],
  "decisions": [
    {"date": "ISO date", "statement": "string", "context": "string"}
  ],
  "assumptions": [
    {"statement": "string", "confidence": 0.8, "status": "active|contradicted|confirmed"}
  ],
  "people": ["name strings"],
  "integrations": {
    "github_repo": "optional",
    "notion_page": "optional",
    "gdrive_folder": "optional"
  },
  "last_updated": "ISO datetime"
}
```

---

## Contradiction Detection Rules

1. **Negation match**: new statement contains "not", "won't", "no longer", "instead" + same subject as existing assumption → flag
2. **Numeric conflict**: two assumptions about the same metric with different values → flag
3. **Temporal conflict**: two deadlines for the same milestone → flag the later one
4. **Tool/tech conflict**: "use X" vs "use Y" for same purpose → flag

Output format when flagging:
```
⚠️  CONTRADICTION DETECTED
   New:      "We will use PostgreSQL"
   Existing: "We decided on MySQL for the main store" (logged 2025-03-12)
   Action needed: confirm which is correct and archive the other
```

---

## Briefing Mode Output Format

```
# Project OS Briefing — [date]

## Active Projects
| Project | Status | Open Tasks | Last Updated |
|---------|--------|------------|--------------|
| Alpha   | active | 8          | 2 days ago   |

## Overdue / Urgent
- [Alpha] Task "Deploy staging env" has been open 12 days
- [Finance] Assumption "WACC = 9%" is 45 days old — consider refreshing

## Unresolved Contradictions
- [Alpha] See contradictions.md — 1 unresolved

## Suggested Focus Today
1. [Alpha] Resolve the WACC contradiction before the model review
2. [Alpha] Close the 3 tasks blocked on staging deploy
3. [Finance] Update revenue growth assumption with Q1 actuals
```
