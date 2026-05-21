---
name: targeted-debug
description: Debug an issue efficiently. Searches for the exact error or symbol first, inspects the shortest relevant code path, and suggests or applies a minimal fix. Use when there's a specific error, failure, or unexpected behavior to diagnose.
argument-hint: [error message, symptom, or stack trace]
allowed-tools: Bash, Read, Edit, Grep, Glob
---

Debug the reported issue with minimum exploration.

## Issue
$ARGUMENTS

## Process

### 1. Gather error output (if missing)
- If no error message or stack trace was provided, ask for it before proceeding.
- Do not start exploring code without knowing the exact symptom.

### 2. Search first
- Run `rg` for the exact error string, function name, or symbol.
- If a stack trace is available, start from the innermost application frame.
- Open only the files directly referenced in the trace or search results.

### 3. Trace the code path
- Follow the execution path from the error site upward — no more than 3 hops.
- Do not read unrelated modules or utilities.

### 4. Diagnose
- State the root cause in one sentence.
- If uncertain, state what's known and what needs more information.

### 5. Fix
- Apply or suggest the minimal change.
- If applying: change only the lines necessary.
- If suggesting: show a diff-style snippet.

### 6. Verify
- Run only the targeted test or command that would reproduce the original issue.

### 7. Summarize
One sentence: root cause and what changed.
