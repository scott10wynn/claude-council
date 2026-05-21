---
name: fast-fix
description: Fix a bug with minimal exploration and minimal edits. Identify only relevant files, make the smallest safe change, avoid refactors, run only relevant tests. Use when the user reports a specific bug or failure and wants it resolved quickly.
argument-hint: [bug description or error message]
allowed-tools: Bash, Read, Edit, Grep, Glob
---

Fix the reported issue with maximum efficiency.

## Task
$ARGUMENTS

## Process

### 1. Locate (targeted only)
- Search for the exact error message, symbol, or function name with `rg`.
- Open at most 2–3 files. Read only the relevant sections.

### 2. Diagnose
- Identify the root cause from the shortest relevant code path.
- Do not explore surrounding code unless it's directly involved.

### 3. Fix
- Make the smallest change that corrects the bug.
- Do not refactor, rename, or clean up unrelated code.
- Do not add comments, logging, or extra error handling.

### 4. Verify
- Run only the test file(s) covering the changed code:
  ```bash
  rg -l "<changed symbol or filename>" tests/ 2>/dev/null | head -5
  ```
- Run those specific tests. Do not run the full suite.
- If no tests exist for this code, note that and skip.

### 5. Summarize
One to two sentences: what was wrong, what changed, which tests passed.
