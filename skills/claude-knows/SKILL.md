---
name: claude-knows
description: Your personal Claude operating guide. Scans current context, identifies the best skill or tool for the situation, surfaces underused capabilities, and gives opinionated recommendations on what you should have set up. Invoke when unsure what Claude can help with, want a setup recommendation, or need the best approach routed to you.
allowed-tools: Read, Glob, Grep, Bash, AskUserQuestion
model: opus
effort: high
---

# Claude Knows: Your Personal Operating Guide

You are building a personal AI operations stack. This guide surfaces the right tool for
whatever you're doing right now, and flags what you're probably leaving on the table.

---

## Phase 1 — Read Context

Run these silently before asking anything:

```bash
git log --oneline -8 2>/dev/null
git branch --show-current 2>/dev/null
git diff --stat HEAD 2>/dev/null | tail -5
```

Also read if they exist:
- `.claude/task_plan.md`
- `.claude/progress.md`
- `CLAUDE.md`

---

## Phase 2 — Ask What's Happening

Ask one question using AskUserQuestion:

**Question**: "What are you working on right now?"
**Header**: "Context"
**Options**:
- Writing or reviewing code — implementing a feature, fixing a bug, doing a PR
- Architecture or tech decision — picking a pattern, database, framework, API design
- Stuck debugging — been at it for 2+ attempts and nothing is clicking
- Shipping / security — about to merge, deploy, or push something live
- Research or exploration — evaluating a library, learning a pattern, assessing tradeoffs
- Managing my Claude setup — hooks, permissions, skills, config

---

## Phase 3 — Route to the Best Tool

Present **specific, opinionated** recommendations based on their answer. Don't list everything — pick the 3 best and say why.

### Writing / Reviewing Code

**Top 3:**

1. **`/code-review --fix`** — Reviews the current diff for correctness bugs AND applies the fixes. Use this after every feature lands, not just when you think something is wrong. The `--fix` flag is the killer feature — it edits the files, not just lists problems.

2. **`skills/security/ship-safe`** — Run this before every PR merge, no exceptions. It checks for secrets, missing auth guards, SQL injection vectors, unhandled errors, and missing tests. Takes 30 seconds and has caught real issues.

3. **`/simplify`** — After a feature is working, this finds dead code, over-engineered abstractions, and inefficiencies. Run it after `/code-review --fix` to clean up what the review left behind.

**Power combo**: `/planning` → implement → `/code-review --fix` → `/simplify` → `ship-safe`

---

### Architecture / Tech Decision

**Top 3:**

1. **`/claude-council:ask --debate --roles=architecture "your question"`** — This is the highest-signal move for architecture decisions. `--debate` forces a two-round discussion where each model sees the others' answers and must critique them. You see where consensus forms and where genuine disagreement persists — that's where the real tradeoff lives.

2. **`skills/workflow/adversarial-spec`** — Use this BEFORE you write the code. Give it your proposed design and multiple models will attack it: edge cases you haven't considered, security assumptions, scalability ceilings, things that look good now but rot under load. It's cheaper to find these before you build.

3. **`skills/workflow/dispute`** — When you're down to two options and keep going in circles. Give it the two options with your reasoning and it runs a structured tiebreaker. Saves hours of second-guessing.

**Power combo**: `adversarial-spec` → implement → `/claude-council:ask --debate` if architectural questions surface mid-build

---

### Stuck Debugging

**Top 3:**

1. **`/claude-council:ask --agents "describe the bug + what you've tried"`** — The `--agents` flag spawns Claude subagents that wrap each provider query: they evaluate response quality, reformulate if the answer is shallow, and ask follow-ups. Slower (15–25s) but dramatically better for bugs that have resisted normal approaches.

2. **`/verify`** — Actually runs the app and observes behavior instead of reasoning about it. If you've been reading code trying to reason through the bug, stop and let verify run it. What the code does ≠ what you think it does.

3. **`/deep-research "specific error message or pattern"`** — If the bug involves a library, framework behavior, or error message you haven't seen before, research it before guessing. `/deep-research` does multi-source web research and fact-checks claims — better than a single web search.

**When to escalate**: If you've made 2+ attempts and nothing has worked, go straight to `--agents`. Don't keep trying the same approaches.

---

### Shipping / Security

**Top 3:**

1. **`skills/security/ship-safe`** — Your pre-ship checklist. Runs through: secrets exposure, auth bypass vectors, injection risks, missing input validation, unhandled promise rejections, console.log with sensitive data, hardcoded values. Make this a habit before every merge.

2. **`/security-review`** — Deeper than ship-safe. Full audit of all pending changes on the branch. Use this for anything user-facing or touching auth/payments/data.

3. **`skills/security/secrets-guard`** — Focused specifically on credential and API key exposure. Run it if you've been working with env vars, config files, or anything that touches external APIs.

**The rule**: ship-safe on every PR, security-review on anything touching user data or auth.

---

### Research / Exploration

**Top 3:**

1. **`/deep-research "your question"`** — The best research tool you have. It fans out across multiple web sources, adversarially verifies claims, and synthesizes a cited report. Use before adopting any new library, pattern, or technology. Never adopt something you found in a single Stack Overflow answer again.

2. **`/claude-council:ask --providers=perplexity "your question"`** — Perplexity is search-augmented and has current information. Use it specifically when you need recent data: library releases, API changes, current best practices, breaking news in the ecosystem.

3. **`skills/multimodel/adversarial-review`** — After you've formed an opinion, run this to have models attack your conclusion. Catches confirmation bias before it becomes a bad architectural decision.

---

### Managing Claude Setup

**Top 3:**

1. **`/update-config`** — The most underused Claude Code capability. You can automate behaviors: "before every commit, run ship-safe", "when a task completes, update progress.md", "after editing a file, run the linter". These are hooks that the harness executes — they don't depend on Claude remembering to do them. Tell it the behavior you want in plain English.

2. **`/fewer-permission-prompts`** — Scans your session transcripts and adds allowlist entries for common read-only operations you're always approving. Eliminates 80% of the "may I run git status" interruptions.

3. **`skills/workflow/skill-creator`** — When you notice you're doing the same multi-step thing repeatedly and telling Claude to do it each time, that's a skill waiting to be created. Run this and describe the pattern — it writes the SKILL.md for you.

---

## Phase 4 — Surface What You're Probably Not Using

After routing, always surface **one** of these based on what fits:

### Your MCPs Are More Powerful Than You Think

You have 6 MCP servers connected. Here's what they can actually do:

**Zoom** (`mcp__zoom__*`)
- Pull transcripts from past meetings: "Summarize last Tuesday's standup and extract action items"
- Search meeting history: "Find when we discussed the auth redesign"
- Get recordings: Surface specific moments without rewatching

**Google Calendar** (`mcp__calendar__*`)
- Full read/write: "Block 3 hours of focus time tomorrow morning after checking what's already there"
- After shipping: "Schedule a 30-min retrospective for the team next week"
- Scheduling: "Find a time when I'm free to review this PR live"

**Gmail** (`mcp__gmail__*`)
- Draft outbound: "Draft a stakeholder update about this feature shipping"
- Search inbox: "Find the email thread where we decided to use Postgres over Mongo"
- Label and organize: "Find all unread emails about [project] from the last month"

**Google Drive** (`mcp__drive__*`)
- Save decisions: After an architecture debate, "Write this decision to a Drive doc in our eng folder"
- Find prior art: "Search Drive for any previous spec about [feature]"
- Create ADRs: Architecture Decision Records saved automatically after disputes

**Spotify** (`mcp__spotify__*`)
- "Create a deep work playlist for debugging sessions"
- "What's playing right now?" — context for mood-based music suggestions

**Job boards** (two servers)
- Track opportunities passively: "Find roles matching my current stack"
- Market pulse: "What are companies hiring for that uses [technology]"

---

### Council Flags You're Probably Underusing

| Flag | When to use | What it does differently |
|------|------------|--------------------------|
| `--debate` | Architecture choices | Two rounds: providers critique each other's R1 answers. You see where consensus solidifies and where real disagreement persists. |
| `--agents` | Hard bugs, deep analysis | Claude subagents wrap each provider — they evaluate quality, reformulate, and ask follow-ups. 4x cost but dramatically better for non-trivial questions. |
| `--roles=security,performance,maintainability` | Code reviews, design reviews | Each provider argues from a different lens. Surfaces tradeoffs you'd miss if everyone answered the same way. |
| `--quiet` | You just want the answer | Synthesis only. No individual provider responses cluttering the output. |
| `--output=docs/decisions/name.md` | Any significant decision | Exports to markdown with full metadata. Your decision log builds itself. |

---

### Config Recommendations (tell `/update-config` these things)

These are the hooks I'd set up for you if you ran `/update-config`:

1. **Pre-commit security sweep**: Before every `git commit`, run `skills/security/secrets-guard` — catches leaks before they hit history
2. **Post-implementation review**: After completing a coding task, auto-run `/code-review` on the changed files
3. **Auto-allow common tools**: Stop getting prompted for `git status`, `git log`, `git diff`, `Read`, `Glob`, `Grep` — add these to the allowlist
4. **Progress tracking**: After any task with a `task_plan.md`, auto-update `.claude/progress.md` on completion

---

## Phase 5 — Offer to Activate

After presenting recommendations, ask:

"Want me to activate any of these right now? If so, which one?"

If yes, invoke the appropriate skill or command immediately without asking again.
