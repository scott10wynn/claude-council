---
name: cheap-plan
description: Produce a low-token implementation plan before editing. Searches only for likely relevant symbols and files. Returns a short plan with affected files and likely commands. No implementation unless asked. Use before any multi-step task to align on scope.
argument-hint: [task description]
allowed-tools: Bash, Grep, Glob, Read
---

Plan the task with minimal token spend. Do not implement anything.

## Task
$ARGUMENTS

## Process

### 1. Targeted discovery (max 5 searches)
- Search for the key symbols, functions, or filenames mentioned in the task.
- Use `rg` with specific patterns — do not scan whole directories.
- Stop as soon as the relevant files are identified.

### 2. Plan output

Return a structured plan in this exact format (keep it short):

```
## Affected files
- path/to/file.ext  — reason
- path/to/other.ext — reason

## Steps
1. [verb] what to change in which file
2. [verb] what to change in which file
...

## Commands to run
- command to verify or test

## Unknowns / risks
- anything that needs clarification before starting
```

### Rules
- Do not open more than 3 files total.
- Do not implement any changes.
- If the task is unclear, ask one clarifying question before planning.
- Keep the plan under 30 lines.
