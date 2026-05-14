# DCF Valuation — {{COMPANY}} ({{TICKER}})
*As of {{DATE}} | All figures in {{CURRENCY}} millions unless noted*

---

## Assumptions

| Parameter | Value |
|---|---|
| Projection period | {{YEARS}} years |
| WACC | {{WACC_PCT}}% |
| Terminal growth rate | {{TG_PCT}}% |
| Tax rate | {{TAX_RATE_PCT}}% |
| Shares outstanding | {{SHARES}}M |
| Net debt (cash) | {{NET_DEBT}}M |

### WACC Build-up

| Component | Value |
|---|---|
| Risk-free rate | {{RF_PCT}}% |
| Equity risk premium | {{ERP_PCT}}% |
| Beta | {{BETA}} |
| Cost of equity (CAPM) | {{COE_PCT}}% |
| Cost of debt (pre-tax) | {{COD_PCT}}% |
| Equity weight | {{EW_PCT}}% |
| Debt weight | {{DW_PCT}}% |
| **WACC** | **{{WACC_PCT}}%** |

---

## Projected Free Cash Flows

| Year | Revenue | Revenue Growth | EBITDA Margin | EBIT | D&A | CapEx | ΔNWC | **FCF** |
|---|---|---|---|---|---|---|---|---|
{{FCF_TABLE_ROWS}}

---

## Valuation

| Item | Value |
|---|---|
| PV of projected FCFs | {{PV_FCFS}}M |
| Terminal value (Gordon Growth) | {{TV}}M |
| PV of terminal value | {{PV_TV}}M |
| **Enterprise value** | **{{EV}}M** |
| Less: Net debt | ({{NET_DEBT}}M) |
| **Equity value** | **{{EQUITY_VALUE}}M** |
| Shares outstanding | {{SHARES}}M |
| **Implied share price** | **${{IMPLIED_PRICE}}** |
| Current price (if known) | ${{CURRENT_PRICE}} |
| Upside / (Downside) | {{UPSIDE_PCT}}% |

---

## Sensitivity Analysis — Implied Share Price

*Rows = WACC | Columns = Terminal Growth Rate*

{{SENSITIVITY_TABLE}}

---

## Key Takeaways

- {{TAKEAWAY_1}}
- {{TAKEAWAY_2}}
- {{TAKEAWAY_3}}
