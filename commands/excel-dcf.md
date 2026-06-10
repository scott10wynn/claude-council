---
description: Run a DCF valuation optimized for Excel — zero AI tokens for calculations, free providers only for any interpretation, and tab-separated output that pastes directly into Excel. Fastest and cheapest way to get a DCF model. Suggest when the user mentions Excel, DCF, valuation, or "paste into spreadsheet".
argument-hint: [--fast] [--ticker=AAPL] [--wacc=0.09] [--tg=0.025] [--shares=500] [--net-debt=200] "FCF1,FCF2,FCF3,FCF4,FCF5"
allowed-tools: Bash(*), Read, Write, AskUserQuestion
---

Run an Excel-optimized DCF valuation with no API costs.

**How this differs from `/claude-council:finance --type=dcf`:**
- All math is local Python — no LLM tokens spent on numbers
- Any AI narrative uses only free/subscription providers (Gemini CLI, Codex CLI)
- Output is tab-separated so you paste it straight into Excel cell A1

---

## Step 1: Parse Inputs

Extract from $ARGUMENTS and the user's message:

| Input | Flag | Example | Default |
|---|---|---|---|
| Free cash flows (M) | `--fcfs=` | `100,120,140,155,170` | **required** |
| Shares outstanding (M) | `--shares=` | `500` | **required** |
| WACC | `--wacc=` | `0.09` | `0.09` |
| Terminal growth rate | `--tg=` | `0.025` | `0.025` |
| Net debt (M) | `--net-debt=` | `200` | `0` |
| Ticker / company name | `--ticker=` | `AAPL` | blank |
| Skip AI narrative | `--fast` | flag only | off |

FCFs can also appear as bare numbers in the message: `"100, 120, 140, 155, 170"` or `"FCFs: 100 120 140 155 170"`.

**Required**: FCFs and shares outstanding. WACC, TG, and net debt all have safe defaults — do NOT ask for them unless the user wants to customize.

If FCFs or shares are missing, ask exactly this and nothing else:

```
AskUserQuestion:
  Question: "What are the projected free cash flows and shares outstanding?"
  Header: "DCF inputs"
  Options:
    - I'll provide FCFs and shares now
    - Show me an example first
```

---

## Step 2: Apply Defaults Silently

| Parameter | Default if not specified |
|---|---|
| WACC | 0.09 (9.0%) |
| Terminal growth | 0.025 (2.5%) |
| Net debt | 0 |

Apply defaults without asking. Note them briefly in the output header.

---

## Step 3: Invoke the excel-dcf Skill

**Invoke the `excel-dcf` skill** with all parsed inputs and follow its instructions to produce the Excel output.
