---
name: finance
description: Executes financial analyses (DCF valuation, financial statement parsing, ratio analysis, comparable company analysis) using pre-built Python tools and structured templates to minimize token usage and maximize accuracy.
---

# Finance Analysis Skill

This skill handles all financial analysis tasks. Use the Python calculation engine at
`${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py` for all math — never calculate by hand.

---

## Standard Assumptions (use unless user overrides)

| Parameter | Default |
|---|---|
| Risk-free rate | 4.5% (10yr US Treasury) |
| Equity risk premium | 5.5% |
| Terminal growth rate | 2.5% |
| Tax rate | 21% |
| Projection period | 5 years |
| Discount rate for TV | Same as WACC |

---

## Analysis Type: DCF Valuation

### Step 1: Run the DCF calculation

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py dcf \
  --fcfs="<comma-separated FCFs in millions>" \
  --wacc=<decimal e.g. 0.09> \
  --terminal-growth=<decimal e.g. 0.025> \
  --shares=<shares outstanding in millions> \
  --net-debt=<net debt in millions, negative if net cash>
```

The script outputs JSON with: `pv_fcfs`, `pv_terminal`, `enterprise_value`, `equity_value`, `implied_price`.

### Step 2: Fill the DCF template

Read the template: `${CLAUDE_PLUGIN_ROOT}/scripts/finance/templates/dcf.md`

Fill every placeholder with actual values from Step 1 output and user inputs.
Output the completed template verbatim.

### WACC Calculation (if not provided)

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py wacc \
  --equity-weight=<decimal> \
  --cost-of-equity=<decimal> \
  --debt-weight=<decimal> \
  --cost-of-debt=<decimal> \
  --tax-rate=<decimal>
```

Cost of equity via CAPM:
```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py capm \
  --beta=<float> \
  --risk-free=<decimal> \
  --erp=<decimal>
```

---

## Analysis Type: Financial Statement Analysis

### Step 1: Parse the data

If user provides raw text/numbers, extract:
- Revenue, COGS, Gross Profit, EBITDA, EBIT, Net Income
- Total Assets, Total Debt, Cash, Shareholders' Equity
- Operating CF, CapEx, Free Cash Flow

### Step 2: Run ratio calculations

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py ratios \
  --revenue=<> \
  --gross-profit=<> \
  --ebitda=<> \
  --ebit=<> \
  --net-income=<> \
  --total-assets=<> \
  --total-debt=<> \
  --cash=<> \
  --equity=<> \
  --operating-cf=<> \
  --capex=<>
```

### Step 3: Fill the statement template

Read: `${CLAUDE_PLUGIN_ROOT}/scripts/finance/templates/statement.md`

Fill all placeholders. Add 1-sentence interpretation per section.

---

## Analysis Type: Ratio Analysis

Run:
```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py ratios [flags as above]
```

Output a clean table grouped by category:
- **Profitability**: Gross margin, EBITDA margin, EBIT margin, Net margin, ROIC, ROE, ROA
- **Liquidity**: Current ratio, Quick ratio, Cash ratio
- **Leverage**: Net debt/EBITDA, Debt/equity, Interest coverage
- **Efficiency**: Asset turnover, FCF conversion, FCF yield

Add benchmark context: is each ratio above/below typical for the sector if known.

---

## Analysis Type: Comparable Company Analysis (Comps)

### Step 1: Build the comps table

For each comparable company provided, collect:
- EV, Market Cap, Revenue, EBITDA, Net Income, P/E, EV/Revenue, EV/EBITDA

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py comps \
  --data='[{"name":"Co A","ev":1000,"ebitda":100,"revenue":500,"net_income":60,"shares":50,"price":20}, ...]'
```

### Step 2: Output the comps table

Format as a markdown table with:
- Min, Mean, Median, Max for each multiple
- Implied valuation range for the subject company based on median multiples

---

## Output Rules (apply to all analysis types)

1. Always show your assumptions explicitly before results
2. Round currency to 2 decimal places; percentages to 1 decimal place
3. Label all units (millions, billions, %)
4. Add a **Sensitivity Table** for DCF (WACC ± 1% vs terminal growth ± 0.5%)
5. End every analysis with a `## Key Takeaways` section (3 bullets max)
6. Never output raw Python errors — if a calculation fails, show the formula and result manually

---

## Error Handling

If `python3` is unavailable:
```bash
python ${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py [same args]
```

If the script itself fails, calculate manually using the formulas embedded in
`${CLAUDE_PLUGIN_ROOT}/scripts/finance/calculations.py` (they are documented inline).
