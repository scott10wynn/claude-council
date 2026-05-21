# claude-code-efficiency plugin

Reduces token usage, tool calls, and session time in Claude Code by enforcing targeted search, minimal edits, and scoped testing.

## What it does

1. **Global rules** (`CLAUDE.md`) — instructs Claude to use `rg` over broad searches, read only needed files, make minimal changes, run targeted tests, and be concise.
2. **Slash commands** — five workflow commands for common efficient patterns.
3. **Pre-tool hook** (`.claude/hooks/warn-expensive.sh`) — warns Claude before broad `grep -r`, `find .`, `ls -R`, full test suite runs, or dependency installs.

## How to enable

The plugin activates automatically when Claude Code loads this project. No manual steps needed.

- `CLAUDE.md` is read at session start.
- Commands in `commands/` are available as `/command-name`.
- The hook in `.claude/settings.json` fires before every `Bash` tool call.

## Slash commands

| Command | Purpose |
|---|---|
| `/fast-fix [bug]` | Fix a bug with minimal exploration and minimal edits |
| `/cheap-plan [task]` | Get a short plan before editing — no implementation |
| `/targeted-debug [error]` | Debug an issue by searching for the exact error first |
| `/changed-tests` | Identify and run only tests affected by changed files |
| `/summarize-context` | Compress current session into a handoff-ready summary |

## How to disable

**Disable the hook only:**
Remove or rename `.claude/settings.json`.

**Disable global rules only:**
Delete or rename `CLAUDE.md`.

**Disable a single command:**
Delete the corresponding file from `commands/` (e.g., `commands/fast-fix.md`).

**Disable everything:**
```bash
rm CLAUDE.md
rm .claude/settings.json
rm commands/fast-fix.md commands/cheap-plan.md commands/targeted-debug.md
rm commands/changed-tests.md commands/summarize-context.md
```

## How to customize

- **Edit rules**: modify `CLAUDE.md` — add, remove, or soften any rule.
- **Edit a command**: modify the corresponding `commands/*.md` file.
- **Tune the hook**: edit `.claude/hooks/warn-expensive.sh`. Change `exit 2` to `exit 0` on any pattern to silence that warning, or remove the pattern entirely.
- **Add new commands**: create a new `.md` file in `commands/` following the existing format (frontmatter + instructions).

## Files created

```
CLAUDE.md                          ← global efficiency rules
commands/fast-fix.md               ← /fast-fix command
commands/cheap-plan.md             ← /cheap-plan command
commands/targeted-debug.md         ← /targeted-debug command
commands/changed-tests.md          ← /changed-tests command
commands/summarize-context.md      ← /summarize-context command
.claude/settings.json              ← hook registration
.claude/hooks/warn-expensive.sh    ← expensive-command warning hook
docs/EFFICIENCY-PLUGIN.md          ← this file
```
