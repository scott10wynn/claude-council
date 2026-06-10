---
name: hallucination-check
description: Scans one or more AI responses for high-risk factual claims — version numbers, API names, configuration keys, statistics, and dates — then cross-references them across sources to surface disagreements and produce a "Verify before using" checklist. Invoke after any council query that produced technical recommendations, before acting on specific values cited in AI responses.
model: sonnet
effort: medium
allowed-tools: Read, Grep, Glob, Bash
---

# Hallucination Check

## What This Skill Does

AI models confidently state wrong facts most often in these categories:
- Version numbers and release dates
- API method names, parameters, and return shapes
- Configuration key names and allowed values
- Specific statistics, benchmarks, or thresholds
- CLI flag names and syntax

This skill reads the council output, extracts those claim types, cross-references them across providers, and outputs a reliability report.

---

## Step 1: Locate the Response to Check

If called after a council query, read the latest cache file:
```bash
ls -t ${CLAUDE_PLUGIN_ROOT}/.claude/council-cache/*.md 2>/dev/null | head -1
```

If called with a specific file argument, use that file instead.

---

## Step 2: Extract High-Risk Claims

Scan the response for:

| Claim Type | Examples |
|------------|---------|
| Version numbers | "React 18.3", "Node 20.x", ">=2.0.0" |
| API / method names | `.useState()`, `fetch()`, `createServer()` |
| Config keys | `"maxRetries"`, `REDIS_URL`, `ssl: true` |
| CLI flags | `--watch`, `-p 3000`, `npm run build` |
| Statistics | "reduces latency by 40%", "1M requests/sec" |
| Dates / timelines | "released in 2024", "deprecated since v5" |

For each claim, note:
- Which provider made it
- The exact quoted text
- Whether other providers made the same or a contradictory claim

---

## Step 3: Cross-Reference Across Providers

For each extracted claim, check if other providers stated the same thing:

**Agreement** (2+ providers say the same specific value) → lower hallucination risk, but still worth verifying for critical values.

**Disagreement** (providers state different specific values for the same thing) → high hallucination risk. Flag prominently.

**Only one provider stated it** → medium risk. Flag for verification.

---

## Step 4: Check Against the Codebase (if applicable)

For claims about the current project's code, verify against the actual files:

```bash
# Check if a stated version matches package.json
grep -i '"version"' package.json package-lock.json 2>/dev/null | head -5

# Check if a claimed config key actually exists
grep -r "CLAIMED_KEY" . --include="*.json" --include="*.yaml" --include="*.env*" 2>/dev/null | head -5
```

If a claimed value contradicts what's in the codebase, escalate it to **CRITICAL**.

---

## Step 5: Output Reliability Report

```
## Reliability Report

### Verified Claims (providers agreed)
- [claim] — [providers that agreed]

### Disagreements (verify before using)
- [claim]: Provider A said X, Provider B said Y — check official docs

### Single-Source Claims (verify before using)
- [claim] — only stated by [provider]

### Contradicts Codebase (CRITICAL — do not use without checking)
- [claim] — [provider] stated X but codebase shows Y at [file:line]

### Safe to Use
Claims in code examples that are visible in the provided codebase context are lower risk.
Generic patterns (not version-specific) are lower risk.
```

---

## Rules

- Never silently discard a disagreement — surface it.
- A claim all 4 providers agree on is more reliable than one from a single provider, but still not guaranteed correct for fast-moving libraries.
- Don't rewrite or "fix" the original responses — only annotate what to verify.
- If no high-risk claims are found, say so explicitly: "No high-risk factual claims detected."
