---
description: Run financial analysis tasks — DCF valuation, financial statement analysis, ratio calculations, and more. Use for any finance-related task to get structured, token-efficient outputs. Suggest when the user mentions valuation, DCF, WACC, free cash flow, financial statements, or comparable analysis.
argument-hint: [--type=dcf|statement|ratios|comps] [--ticker=AAPL] [--output=path] "analysis request"
allowed-tools: Bash(*), Read, Write, Edit, Glob, Grep, AskUserQuestion
---

Run a financial analysis using the finance skill.

## Step 1: Determine Analysis Type

If `--type` is not in $ARGUMENTS, check the user's request for these signals:

- **DCF**: "dcf", "valuation", "intrinsic value", "discounted cash flow", "wacc", "terminal value"
- **Statement**: "income statement", "balance sheet", "cash flow", "revenue", "earnings", "parse financials"
- **Ratios**: "ratio", "p/e", "ev/ebitda", "margins", "return on", "roe", "roic"
- **Comps**: "comparable", "comps", "peer", "trading multiples", "precedent"

If ambiguous, ask:

```
AskUserQuestion:
  Question: "What type of financial analysis do you need?"
  Header: "Analysis type"
  Options:
    - DCF Valuation — project FCFs, WACC, terminal value, implied share price
    - Statement Analysis — parse and interpret financial statements
    - Ratio Analysis — margins, returns, liquidity, leverage metrics
    - Comparable Analysis — peer trading multiples and benchmarking
```

## Step 2: Collect Missing Inputs

Before running the analysis, check what data is needed and not yet provided.

**For DCF**, ask if missing:
- Revenue projections or growth assumptions
- EBIT/EBITDA margin assumptions
- WACC inputs (or use defaults from skill)
- Terminal growth rate
- Shares outstanding and net debt

**For Statement Analysis**, ask if missing:
- The raw financial data (paste or file path)

If the user has provided enough context, proceed without asking.

## Step 3: Invoke the Finance Skill

**Invoke the `finance` skill** and follow its instructions to run the analysis and produce output.

## Step 4: Export (if --output specified)

If `--output=<path>` was specified, write the completed analysis to that path and confirm:
`Saved to: <path>`
