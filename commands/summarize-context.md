---
name: summarize-context
description: Compress current project and session context into a short summary suitable for starting a new Claude Code session. Use when context is getting long, before a session handoff, or to checkpoint current state.
argument-hint: (no arguments needed)
allowed-tools: Bash, Read, Glob
---

Produce a compact context summary. Do not make any changes.

## Process

### 1. Gather state
```bash
git diff --name-only HEAD 2>/dev/null | head -20
git log --oneline -5 2>/dev/null
```

### 2. Output the summary

Format it exactly like this — keep it under 40 lines total:

```
## Project
[repo name and one-line purpose]

## Current task
[one sentence describing the goal of this session]

## Changed files
- path/to/file.ext — what changed and why

## Decisions made
- [decision]: [brief rationale]

## Commands run (relevant)
- [command that produced important output]

## Remaining work
- [ ] next step
- [ ] next step

## Key context for next session
[1–3 sentences of anything a fresh Claude Code session would need to know]
```

### Rules
- Do not read files not already open in context.
- Do not run any commands besides the git ones above.
- Keep every section as short as possible.
- Omit sections that are empty.
