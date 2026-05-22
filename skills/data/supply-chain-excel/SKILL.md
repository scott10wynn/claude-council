---
name: supply-chain-excel
description: Token-optimized Excel Office Script that sends supply chain data to Claude for AI analysis. Covers inventory, supplier performance, demand forecasting, and procurement/spend. Uses prompt caching, compact CSV format, and Claude Haiku to minimize API costs.
---

# Supply Chain Excel Analyzer

An Excel Office Script (TypeScript) that connects directly to Claude's API for supply chain analysis. Designed to use as few tokens as possible while delivering actionable insights.

---

## Quick Start

1. Open **Excel for the web** (Microsoft 365 — Office Scripts requires cloud Excel)
2. Open your supply chain spreadsheet
3. Click **Automate → New Script**
4. Paste the entire contents of `supply-chain-analyzer.ts`, replacing the default code
5. In the `CONFIG` block at the top, set `apiKey` to your Anthropic API key
6. Click **Save**, then **Run**
7. Results appear in a new **"AI Analysis"** sheet

---

## Supported Analysis Types

The script auto-detects the analysis type from your sheet name. You can override with `CONFIG.forceType`.

| Sheet name contains | Analysis type | What it looks for |
|---|---|---|
| `invent`, `stock`, `sku`, `item` | **Inventory** | SLOB, stockouts, overstock, turnover rate |
| `supplier`, `vendor`, `carrier` | **Supplier** | Late deliveries, quality failures, lead time, cost variance |
| `demand`, `forecast`, `sales`, `order` | **Demand** | Trends, seasonality, forecast accuracy (MAPE/bias) |
| `procure`, `spend`, `po`, `price`, `cost` | **Procurement** | Spend reduction, PO variance, consolidation, maverick spend |

If no match is found, it defaults to **Procurement**.

---

## Token-Saving Techniques

| Technique | Savings |
|---|---|
| **Prompt caching** (`cache_control: ephemeral`) | System prompt charged only once per cache window (~5 min) |
| **Compact CSV format** | ~60–70% fewer tokens vs JSON row representation |
| **Pre-aggregated column stats** | Sends min/avg/max/sum instead of every raw number |
| **Row cap** (`CONFIG.maxRows = 300`) | Bounds cost on large datasets |
| **JSON-only output** | No prose padding in Claude's response |
| **Claude Haiku model** | ~20x cheaper per token than Opus, ~5x cheaper than Sonnet |

Typical cost per run: **$0.002–$0.015** depending on dataset size and whether the cache is warm.

---

## Configuration

```typescript
const CONFIG = {
  apiKey:      "sk-ant-...",                   // Your Anthropic API key
  model:       "claude-haiku-4-5-20251001",    // Change to claude-sonnet-4-6 for deeper analysis
  maxRows:     300,                             // Increase for larger datasets (raises cost)
  outputSheet: "AI Analysis",                  // Output sheet name
  forceType:   "",                             // "inventory"|"supplier"|"demand"|"procurement"
};
```

---

## Output Structure

The **AI Analysis** sheet is written with these sections:

- **SUMMARY** — 2–3 sentence quantified overview
- **ALERTS** — Critical issues (stockouts, supplier failures, cost spikes) highlighted in yellow
- **KEY METRICS** — Computed KPIs with units (e.g., "Avg lead time: 12.4 days")
- **INSIGHTS** — Up to 5 findings ranked by business impact
- **RECOMMENDATIONS** — Up to 5 specific, actionable next steps
- **DATA QUALITY NOTES** — Missing columns, suspect values, blank rows

---

## Expected Column Formats

The script works with any column names, but recognizes common supply chain headers:

**Inventory:** `SKU`, `Item`, `On Hand`, `Reorder Point`, `Safety Stock`, `Lead Time`, `Avg Daily Usage`, `Last Movement`

**Supplier:** `Supplier`, `PO Number`, `Order Date`, `Due Date`, `Receipt Date`, `On Time (Y/N)`, `Defect Rate`, `Unit Cost`, `Lead Time (days)`

**Demand:** `Date`, `Item/SKU`, `Actual`, `Forecast`, `Region`, `Channel`

**Procurement:** `PO Number`, `Supplier`, `Category`, `Item`, `Qty`, `Unit Price`, `Budget Price`, `PO Date`, `Delivery Date`

---

## Switching to a More Capable Model

For complex datasets or deeper analysis, change the model in `CONFIG`:

```typescript
model: "claude-sonnet-4-6",   // ~5x more capable, ~5x higher cost than Haiku
```

With Sonnet and prompt caching active, cached system prompt tokens cost 10% of normal price.

---

## Security Note

Do not commit your API key to version control. For shared workbooks, consider storing the key in a dedicated config cell and reading it with `workbook.getWorksheet("Config").getRange("B1").getValue()` instead of hardcoding it.
