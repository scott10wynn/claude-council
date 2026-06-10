---
name: excel-dcf
description: Runs a DCF valuation with zero LLM tokens for math. All calculations are local Python. Output is tab-separated (TSV) and pastes directly into Excel cell A1. Any narrative interpretation uses only free/subscription providers (Gemini CLI or Codex CLI) — never a paid API.
---

# Excel DCF Skill

All computation is done locally — no AI tokens are spent on math.

---

## Step 1: Run the Local Calculation

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/excel_output.py \
  --fcfs="<comma-separated FCFs in millions>" \
  --wacc=<decimal, e.g. 0.09> \
  --terminal-growth=<decimal, e.g. 0.025> \
  --shares=<float, millions> \
  --net-debt=<float, millions; negative = net cash> \
  [--ticker=<TICKER>] \
  [--company="<Name>"]
```

This produces a TSV block containing:
- Assumptions table
- FCF table with per-year discount factors and PVs
- Terminal value breakdown
- Valuation summary (EV → equity value → implied price)
- 5×5 sensitivity grid (WACC ±2% vs terminal growth ±1%)

---

## Step 2: Present the Excel Output

Display the TSV inside a fenced code block with this exact header:

````
Excel output — copy everything below, click cell A1 in Excel, then paste (Ctrl+V / Cmd+V):

```
<TSV output here>
```
````

After the code block, print one line with the key numbers only:

> **Implied price: $XX.XX | EV: $X,XXXM | Equity value: $X,XXXM**

---

## Step 3: Optional Narrative (free providers only, skip if --fast)

Only run this step if the user asked for interpretation or context AND `--fast` was not passed.

Detect available free provider:
```bash
if command -v gemini >/dev/null 2>&1; then
  FREE_PROVIDER="gemini-cli"
elif command -v codex >/dev/null 2>&1; then
  FREE_PROVIDER="codex"
else
  FREE_PROVIDER="none"
fi
```

If `FREE_PROVIDER` is `none`, skip this step silently.

Otherwise build a compact prompt (keep input under 150 tokens):
```
DCF result for <TICKER or "this company">:
Implied price $XX.XX, EV $X,XXXM, TV is XX% of EV.
WACC XX%, terminal growth XX%, projection period X years.
In 2–3 sentences: what does this valuation suggest and what is the single biggest assumption risk?
```

Run via the appropriate provider script:
- Gemini CLI: `${CLAUDE_PLUGIN_ROOT}/scripts/providers/gemini-cli.sh "$PROMPT"`
- Codex CLI: `${CLAUDE_PLUGIN_ROOT}/scripts/providers/codex.sh "$PROMPT"`

Label the response: **Interpretation (via free provider — no API cost)**

---

## Caching

Set a 24-hour TTL before any provider call (DCF inputs are stable within a session):
```bash
export COUNCIL_CACHE_TTL=86400
```

Pure local calculation (Steps 1–2 without Step 3) requires no caching — it runs in milliseconds.

---

## Error Handling

| Problem | Response |
|---|---|
| `python3` not found | Try `python`. If both fail: "Python 3 is required. Install it and retry." |
| WACC ≤ terminal growth | "WACC (X%) must exceed terminal growth rate (X%) for the Gordon Growth model. Increase WACC or decrease TG." |
| Missing FCFs | Ask the user for FCFs before running. |
| Provider call fails | Skip interpretation; show calculation results only. Never block on a provider error. |
