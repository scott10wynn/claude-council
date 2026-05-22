// ============================================================
// Supply Chain AI Analyzer — Excel Office Script
// Paste this into the Excel Office Scripts editor (Automate tab)
// ============================================================
//
// SETUP:
//   1. Open Excel for the web (Microsoft 365)
//   2. Click Automate → New Script
//   3. Paste this entire file, replacing the default content
//   4. Set your API key in CONFIG.apiKey below
//   5. Click Save, then Run
//
// HOW IT WORKS:
//   - Reads your active sheet
//   - Auto-detects analysis type from sheet name
//     (or set CONFIG.forceType to override)
//   - Sends a compact CSV + stats summary to Claude Haiku
//     (Haiku is ~20x cheaper per token than Opus)
//   - Uses prompt caching so the system prompt is only charged once
//   - Writes results to a new "AI Analysis" sheet
//
// TOKEN-SAVING TECHNIQUES USED:
//   - Prompt caching (cache_control: ephemeral on system prompt)
//   - Compact CSV format instead of verbose JSON
//   - Pre-aggregated column stats instead of raw data
//   - Row cap (CONFIG.maxRows) to bound cost
//   - Terse JSON-only output format (no padding text)
//   - Claude Haiku model (lowest cost per token)
// ============================================================

// ---- CONFIGURATION ----
const CONFIG = {
  apiKey:     "sk-ant-YOUR_KEY_HERE",   // <-- paste your Anthropic API key here
  model:      "claude-haiku-4-5-20251001", // Haiku = cheapest; change to claude-sonnet-4-6 for more depth
  maxRows:    300,                          // rows sent to Claude (caps token cost)
  outputSheet: "AI Analysis",
  forceType:  "" as string,                 // set to "inventory"|"supplier"|"demand"|"procurement" to override auto-detect
};

// ---- TYPES ----
type AnalysisType = "inventory" | "supplier" | "demand" | "procurement";

interface AnalysisResult {
  analysis_type:      string;
  summary:            string;
  key_metrics:        Record<string, string | number>;
  insights:           string[];
  recommendations:    string[];
  alerts:             string[];
  data_quality_notes: string[];
}

// ---- SYSTEM PROMPT (cached — only billed once per session) ----
const SYSTEM_PROMPT = `You are a senior supply chain analyst. Analyze the provided dataset and respond ONLY in valid JSON — no prose, no markdown fences.

Required schema (all fields required):
{
  "analysis_type": string,
  "summary": string (2-3 sentences, quantified),
  "key_metrics": { "<label>": "<value with unit>" },
  "insights": string[] (max 5, ranked by business impact, each starting with a verb),
  "recommendations": string[] (max 5, specific and actionable, each starting with a verb),
  "alerts": string[] (critical issues only — stockouts, supplier failures, cost spikes; empty array if none),
  "data_quality_notes": string[] (missing columns, suspicious values, blank rows; empty array if clean)
}

Rules:
- Quantify everything possible (%, $, days, units)
- Rank insights and recommendations by highest impact first
- Alerts must be urgent and specific
- Skip obvious or generic observations
- If a column name is ambiguous, state your assumption in data_quality_notes`;

// ---- MAIN ----
async function main(workbook: ExcelScript.Workbook): Promise<void> {
  const sheet = workbook.getActiveWorksheet();
  const sheetName = sheet.getName();

  const analysisType = detectType(sheetName);
  console.log(`Analysis type: ${analysisType} | Sheet: "${sheetName}"`);

  const extracted = extractData(sheet);
  if (extracted.rows.length === 0) {
    console.log("ERROR: No data found. Ensure the active sheet has a header row and data rows.");
    return;
  }

  const prompt = buildPrompt(analysisType, extracted);
  console.log(`Sending ${extracted.rows.length} rows to Claude (${extracted.stats.total_rows} total)...`);

  const result = await callClaude(prompt);
  if (!result) {
    console.log("ERROR: API call failed. Check CONFIG.apiKey and try again.");
    return;
  }

  writeResults(workbook, result, sheetName);
  console.log("Done! See the 'AI Analysis' sheet.");
}

// ---- ANALYSIS TYPE DETECTION ----
function detectType(sheetName: string): AnalysisType {
  if (CONFIG.forceType) return CONFIG.forceType as AnalysisType;
  const n = sheetName.toLowerCase();
  if (/invent|stock|sku|warehouse|wh|slob|item/.test(n))            return "inventory";
  if (/supplier|vendor|vend|source|partner|carrier/.test(n))         return "supplier";
  if (/demand|forecast|fcst|sales|order|history|hist/.test(n))       return "demand";
  if (/procure|spend|po |purch|contract|price|cost|invoice/.test(n)) return "procurement";
  return "procurement"; // safe default
}

// ---- DATA EXTRACTION ----
interface ExtractedData {
  headers: string[];
  rows:    (string | number | boolean)[][];
  stats:   Record<string, string>;
}

function extractData(sheet: ExcelScript.Worksheet): ExtractedData {
  const usedRange = sheet.getUsedRange();
  if (!usedRange) return { headers: [], rows: [], stats: {} };

  const allValues = usedRange.getValues();
  if (allValues.length < 2) return { headers: [], rows: [], stats: {} };

  const headers  = allValues[0].map(h => String(h ?? "").trim());
  const allRows  = allValues.slice(1).filter(r => r.some(c => c !== "" && c !== null && c !== undefined));
  const truncated = allRows.length > CONFIG.maxRows;
  const dataRows  = truncated ? allRows.slice(0, CONFIG.maxRows) : allRows;

  // Build column-level stats (saves tokens vs sending all raw data)
  const stats: Record<string, string> = {
    total_rows:    String(allRows.length),
    analyzed_rows: String(dataRows.length),
    truncated:     String(truncated),
    columns:       String(headers.length),
  };

  headers.forEach((header, colIdx) => {
    const nums = dataRows
      .map(r => Number(r[colIdx]))
      .filter(v => !isNaN(v) && isFinite(v));

    if (nums.length >= dataRows.length * 0.4) {
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = sum / nums.length;
      const sorted = [...nums].sort((a, b) => a - b);
      stats[`col_${header}_sum`]  = sum.toFixed(2);
      stats[`col_${header}_avg`]  = avg.toFixed(2);
      stats[`col_${header}_min`]  = String(sorted[0]);
      stats[`col_${header}_max`]  = String(sorted[sorted.length - 1]);
      stats[`col_${header}_p50`]  = String(sorted[Math.floor(sorted.length * 0.5)]);
    } else {
      // Categorical column: count unique values
      const unique = new Set(dataRows.map(r => String(r[colIdx] ?? "")).filter(v => v !== "")).size;
      stats[`col_${header}_unique`] = String(unique);
    }
  });

  return { headers, rows: dataRows, stats };
}

// ---- PROMPT BUILDERS ----
const TASK_DESCRIPTIONS: Record<AnalysisType, string> = {
  inventory:
    "Analyze this inventory dataset. Identify: slow-moving/obsolete items (SLOB), " +
    "stockout risks (low stock vs demand), overstock (excess vs reorder point), " +
    "turnover rate by item/category, and reorder urgency ranking.",

  supplier:
    "Evaluate this supplier/vendor performance dataset. Rank suppliers by reliability. " +
    "Identify: chronic late deliverers, quality failures, lead time outliers, " +
    "cost variance vs contract, and single-source risk (items with only one supplier).",

  demand:
    "Analyze this demand/sales dataset. Identify: trend direction (growth/decline %), " +
    "seasonal patterns, forecast accuracy (MAPE/bias if actuals+forecast present), " +
    "top and bottom performers by volume/value, and anomalous spikes or drops.",

  procurement:
    "Analyze this procurement/spend dataset. Identify: cost reduction opportunities, " +
    "PO price variance vs budget, supplier consolidation candidates (same category, " +
    "multiple suppliers), maverick spend, YoY price trends, and payment term optimization.",
};

function buildPrompt(type: AnalysisType, data: ExtractedData): string {
  // Compact CSV (far fewer tokens than JSON)
  const csvLines = [data.headers.join(",")];
  for (const row of data.rows) {
    csvLines.push(
      row.map(cell => {
        const s = String(cell ?? "");
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",")
    );
  }

  const statsBlock = Object.entries(data.stats)
    .map(([k, v]) => `${k}=${v}`)
    .join(" | ");

  return `ANALYSIS TASK: ${TASK_DESCRIPTIONS[type]}

DATASET STATISTICS: ${statsBlock}

DATA (CSV):
${csvLines.join("\n")}`;
}

// ---- CLAUDE API CALL ----
async function callClaude(userPrompt: string): Promise<AnalysisResult | null> {
  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         CONFIG.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta":    "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model:      CONFIG.model,
        max_tokens: 1024,
        system: [
          {
            type:          "text",
            text:          SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" }, // cache system prompt to save tokens on repeats
          },
        ],
        messages: [
          { role: "user", content: userPrompt },
        ],
      }),
    });
  } catch (e) {
    console.log("Network error: " + String(e));
    return null;
  }

  if (!response.ok) {
    const errText = await response.text();
    console.log(`API error ${response.status}: ${errText.substring(0, 300)}`);
    return null;
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
    usage?: {
      input_tokens:             number;
      output_tokens:            number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
    };
  };

  if (data.usage) {
    const u = data.usage;
    const cached  = u.cache_read_input_tokens ?? 0;
    const created = u.cache_creation_input_tokens ?? 0;
    console.log(
      `Tokens — input: ${u.input_tokens}, output: ${u.output_tokens}, ` +
      `cache_created: ${created}, cache_read: ${cached}` +
      (cached > 0 ? " (saved on cached tokens)" : "")
    );
  }

  const rawText  = data.content?.[0]?.text ?? "";
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.log("Could not parse JSON from response. Raw: " + rawText.substring(0, 300));
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch {
    console.log("JSON parse error. Raw: " + jsonMatch[0].substring(0, 300));
    return null;
  }
}

// ---- WRITE RESULTS TO EXCEL ----
function writeResults(
  workbook:    ExcelScript.Workbook,
  result:      AnalysisResult,
  sourceSheet: string
): void {
  let outSheet = workbook.getWorksheet(CONFIG.outputSheet);
  if (outSheet) {
    outSheet.getUsedRange()?.clear(ExcelScript.ClearApplyTo.all);
  } else {
    outSheet = workbook.addWorksheet(CONFIG.outputSheet);
  }

  const rows: (string | number)[][] = [];
  const now = new Date().toLocaleString();

  // Header block
  rows.push(["Supply Chain AI Analysis", "", "", ""]);
  rows.push([`Source sheet: ${sourceSheet}`, "", `Generated: ${now}`, ""]);
  rows.push([""]);

  // Summary
  rows.push(["SUMMARY"]);
  rows.push([result.summary ?? "No summary available."]);
  rows.push([""]);

  // Alerts (high priority — shown first)
  if (result.alerts?.length > 0) {
    rows.push(["ALERTS"]);
    result.alerts.forEach(a => rows.push([`⚠ ${a}`]));
    rows.push([""]);
  }

  // Key metrics
  const metrics = Object.entries(result.key_metrics ?? {});
  if (metrics.length > 0) {
    rows.push(["KEY METRICS", "VALUE"]);
    metrics.forEach(([k, v]) => rows.push([k, String(v)]));
    rows.push([""]);
  }

  // Insights
  rows.push(["INSIGHTS"]);
  (result.insights ?? []).forEach((ins, i) => rows.push([`${i + 1}. ${ins}`]));
  rows.push([""]);

  // Recommendations
  rows.push(["RECOMMENDATIONS"]);
  (result.recommendations ?? []).forEach((rec, i) => rows.push([`${i + 1}. ${rec}`]));
  rows.push([""]);

  // Data quality notes (shown last)
  if (result.data_quality_notes?.length > 0) {
    rows.push(["DATA QUALITY NOTES"]);
    result.data_quality_notes.forEach(n => rows.push([`• ${n}`]));
  }

  // Write all at once (single setValues call = fast)
  const maxCols = Math.max(...rows.map(r => r.length));
  const padded  = rows.map(r => {
    const padded = [...r];
    while (padded.length < maxCols) padded.push("");
    return padded;
  });

  const writeRange = outSheet.getRangeByIndexes(0, 0, padded.length, maxCols);
  writeRange.setValues(padded);

  // Formatting: title
  const titleCell = outSheet.getRangeByIndexes(0, 0, 1, maxCols);
  titleCell.getFormat().getFont().setBold(true);
  titleCell.getFormat().getFont().setSize(14);
  titleCell.getFormat().getFill().setColor("#1F4E79");
  titleCell.getFormat().getFont().setColor("#FFFFFF");

  // Formatting: section headers (rows whose first cell is ALL CAPS and has no number prefix)
  for (let i = 0; i < padded.length; i++) {
    const cell = String(padded[i][0] ?? "");
    if (/^[A-Z\s\/]+$/.test(cell) && cell.length > 2 && !/^\d/.test(cell)) {
      const row = outSheet.getRangeByIndexes(i, 0, 1, maxCols);
      row.getFormat().getFont().setBold(true);
      row.getFormat().getFill().setColor("#D6E4F0");
    }
    // Alert rows
    if (cell.startsWith("⚠")) {
      outSheet.getRangeByIndexes(i, 0, 1, maxCols)
        .getFormat().getFill().setColor("#FFF2CC");
    }
  }

  outSheet.getRange("A:D").getFormat().autofitColumns();
  outSheet.activate();
}
