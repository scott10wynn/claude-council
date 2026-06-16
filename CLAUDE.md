# Claude Council — Project Guide

## Stack

- **Language**: Bash
- **Type**: Claude Code plugin (`skills/`, `commands/`, `agents/` + shell scripts in `scripts/`)
- **External calls**: `curl` + `jq` against provider APIs (Gemini, OpenAI, Grok, Perplexity) or the `codex`/`gemini` CLIs

## Conventions

- New capabilities go in `skills/` (auto-triggered) with a thin `commands/*.md` wrapper for explicit slash invocation, following the existing pairing convention (e.g. `make-plan` skill + `planning` command).
- Bump the version in `.claude-plugin/plugin.json` on any change users should pull.

## Commands

| Task          | Command                          |
|---------------|-----------------------------------|
| Run all tests | `./tests/run_tests.sh`            |
| Run one suite | `bats tests/<name>.bats`          |
| Check status  | `bash scripts/check-status.sh`    |

---

## Trading Rules

When helping with any trade, order, or investment decision:
- Always read `docs/trading-strategy.md` before proceeding
- Use the `/trade` command workflow for any order placement
- Never place an order without a defined stop loss and price target from the user
- Never exceed the 2% portfolio risk rule per trade without explicit user override
- Always call `review_equity_order` before `place_equity_order`
- Always require explicit written confirmation before placing any order

---

## Claude Code Efficiency Rules

### Search before reading
- Use `rg` (ripgrep) for symbol/pattern searches — not `grep -R`, `find .`, or `ls -R`.
- Locate the relevant file with a targeted search before opening it.
- Do not open large files unless the target section is known; read with `offset`+`limit`.

### Scope discipline
- Do not scan the whole repo unless explicitly asked.
- Read only the files needed to complete the task.
- Reuse context already in the conversation rather than re-reading the same file.

### Change discipline
- Make the smallest safe change that satisfies the requirement.
- Do not refactor or clean up code outside the task scope.
- Do not add error handling, comments, or abstractions that weren't asked for.

### Testing discipline
- Run only the tests that cover changed code.
- Do not run the full test suite unless the change is broad or the user asks.
- Prefer `rg` to find test files related to changed code before running anything.

### Command discipline
- Ask before running commands that are slow, expensive, or hard to reverse.
- Ask before installing dependencies.
- Avoid `ls -R`, `find .`, `grep -R` — prefer `rg` with a specific pattern.

### Communication discipline
- Ask questions only when blocked; do not ask for confirmation on obvious steps.
- Summarize changes in 1–3 sentences at the end of each task.
- Be concise in all responses.
