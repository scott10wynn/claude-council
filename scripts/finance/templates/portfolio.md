# Portfolio Analysis — {{ACCOUNT_NAME}}
*As of {{DATE}} | Data source: Robinhood*

---

## Portfolio Summary

| Metric | Value |
|--------|-------|
| **Total Equity** | ${{EQUITY}} |
| **Day P&L** | ${{DAY_PL}} ({{DAY_PL_PCT}}%) |
| **Buying Power** | ${{BUYING_POWER}} |
| **Cash** | ${{CASH}} |
| **# of Positions** | {{NUM_POSITIONS}} |

---

## Holdings

| Ticker | Shares | Avg Cost | Current Price | Equity | Unrealized P&L | % of Portfolio |
|--------|--------|----------|---------------|--------|----------------|----------------|
{{HOLDINGS_ROWS}}

---

## Sector / Concentration

{{CONCENTRATION_NOTES}}

---

## Recent Activity ({{DAYS}} days)

| Date | Side | Ticker | Qty | Price | Total |
|------|------|--------|-----|-------|-------|
{{ORDERS_ROWS}}

---

## Council Perspectives

### Risk Management
{{RISK_ANALYSIS}}

### Return Optimization
{{PERFORMANCE_ANALYSIS}}

### Long-term Health
{{HEALTH_ANALYSIS}}

---

## Key Takeaways

- {{TAKEAWAY_1}}
- {{TAKEAWAY_2}}
- {{TAKEAWAY_3}}
- {{TAKEAWAY_4}}

---

*This analysis is for informational purposes only and does not constitute financial advice.*
*Re-run `/robinhood` for a fresh snapshot before making any trading decisions.*
