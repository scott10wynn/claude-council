---
name: changed-tests
description: Decide which tests to run based on currently changed files. Inspects git diff, identifies impacted tests only, and suggests the cheapest useful test command. Avoids full test suite runs unless clearly necessary.
argument-hint: [optional: base branch or commit, default: HEAD]
allowed-tools: Bash, Grep, Glob
---

Find and run only the tests relevant to recent changes.

## Process

### 1. Get changed files
```bash
git diff --name-only HEAD 2>/dev/null || git diff --name-only HEAD~1
```
If $ARGUMENTS specifies a base: `git diff --name-only $ARGUMENTS`

### 2. Map to test files
For each changed source file, search for corresponding tests:
```bash
rg -l "<module or filename stem>" tests/ spec/ __tests__/ 2>/dev/null | head -10
```
Also check if any test file directly imports or references the changed file.

### 3. Classify scope
- **Narrow** (1–3 source files changed, clear test matches): run only matched test files.
- **Broad** (>5 files, or core utilities/shared modules changed): suggest full suite with a warning about cost.
- **No tests found**: report that and suggest manual verification steps.

### 4. Output the command
Provide the exact command to run — specific test files, not the whole suite:
```bash
# example — adjust to actual test runner
pytest tests/test_foo.py tests/test_bar.py -v
```

### 5. Run it
Execute the suggested command unless the scope is broad, in which case ask first.

### 6. Report
One sentence: which tests ran, pass/fail summary.
