---
name: planning
description: Creates task_plan.md, findings.md, and progress.md tracking files in .claude/ and continuously references them during execution to eliminate drift. Use for any task requiring 3+ steps.
argument-hint: [task-description]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

Invoke the `planning` skill with the task: $ARGUMENTS
