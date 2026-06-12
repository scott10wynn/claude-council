# Earnings Plays, Short Selling, Fibonacci & Elliott Wave

---

## 1. Earnings Plays — Volatility and Drift

### IV Crush: Selling Volatility Before Earnings

When earnings are pending, options IV spikes because the market is pricing in the unknown move. After earnings are reported, IV collapses — this is "IV crush." Sellers of premium profit from this crush.

**The trade:**
- Sell a short strangle or iron condor on a stock 1–3 days before earnings
- IV Rank is typically 70–90+ entering earnings
- After earnings, IV drops 40–70%; the position profits from the collapse even if the stock moves somewhat

**Critical calculation — expected move:**
```
Expected Move ≈ ATM straddle price (front month, at-the-money call + put)
             OR = ATM call price × 1.25 (approximation)
```
- If the actual move is less than the expected move → the short straddle profits
- Historically, stocks move less than the options-implied move ~70% of the time

**Setup rules:**
1. Sell the straddle/strangle 1–3 days before earnings report
2. Short strikes at the 1-standard-deviation OTM level (16 delta)
3. Always use defined risk (iron condor) for stocks that can gap 20%+; use strangle only on large, liquid indices
4. DTE: use the expiration closest to earnings but immediately after it (not before)
5. Close **the day after earnings** — the crush is complete within 24 hours; holding longer adds unnecessary risk

**Sizing for earnings trades:**
- Max 1–2% of account per trade (binary event; a surprise can exceed the expected move significantly)
- Never hold earnings volatility shorts into the announcement using single-expiration short strangles without long wings

**When it fails:**
- Stock moves 2–3× the expected move (earnings surprise or guidance shock)
- Biotech with binary approval (these can gap 50–80%)
- The entire market gaps sharply due to macro news on earnings day

---

### Buying Before Earnings (Long Volatility)
Buy a straddle or strangle **4–7 days before earnings** when IV Rank is still below 50 (IV hasn't fully inflated yet). Profit from the IV increase as earnings approach, not from the move itself — sell before the report to capture the vega gain without the binary risk.

**Setup:**
- Entry: 5–7 DTE before earnings; IV Rank < 50
- Exit: 1 day before the earnings report (maximum IV inflation; before the crush)
- Target: 20–40% return on the straddle cost as IV rises
- Never hold through the report (the crush will destroy the position)

---

### Post-Earnings Drift (PEAD — Post-Earnings Announcement Drift)

One of the most robust and academically documented anomalies in finance: stocks that beat earnings estimates tend to continue drifting upward for 1–3 months; stocks that miss tend to drift downward.

**The Standardized Unexpected Earnings (SUE) score:**
```
SUE = (Actual EPS − Consensus Estimate) / Standard Deviation of prior quarterly EPS surprises
```
- SUE > +3: Strong beat → buy the stock after the announcement
- SUE < −3: Strong miss → short the stock after the announcement
- Stocks in the top decile of SUE have historically outperformed by 3–5% over the next 60 days

**Trade setup (long after a beat):**
1. Wait for the stock to open after earnings (don't buy into the overnight gap)
2. Confirm the gap is holding in the first 30–60 minutes of regular session trading (not fading back immediately)
3. If stock is above VWAP and holding the gap, enter long on a pullback to the opening range support
4. Stop: if stock fills the entire earnings gap, the thesis is broken — exit
5. Hold for 4–8 weeks for the drift to play out
6. Exit before the next earnings report

**PEAD is stronger in:**
- Small and mid-cap stocks (institutional coverage is lower; price discovery takes longer)
- Stocks with a history of consistent beats or misses
- Sectors where analysts consistently underestimate growth (high-growth tech, biotech post-trial)

**PEAD is weaker in:**
- Large-cap, heavily-covered stocks (analysts rapidly revise; drift is priced in faster)
- Stocks that gapped 20%+ (some reversion to the gap is common before the drift resumes)

---

## 2. Short Selling

### Why Short Selling Is Harder Than Going Long
- Losses are theoretically unlimited (a long position can go to zero; a short can go up infinitely)
- You pay borrow costs (the cost to borrow shares, quoted as an annualized rate)
- Short squeezes can destroy a position in hours
- Market structure, central bank intervention, and buybacks all work against shorts

### Identifying Short Candidates

**Fundamental red flags (one or more):**
- Revenue declining for 3+ consecutive quarters
- Gross margin compression quarter over quarter
- FCF negative with no clear path to profitability
- Management issuing repeated secondary offerings (diluting shareholders)
- Auditor resignation or accounting irregularities
- Customer concentration risk (>30% from a single customer) AND that customer showing signs of reducing orders

**Technical confirmation (all required):**
- Stock below 200-day moving average
- 200-day MA itself is declining (not flat)
- 50-day MA crossed below 200-day MA (Death Cross)
- Failed rallies: stock bounces but cannot close above a declining moving average
- Lower highs + lower lows confirmed on weekly chart

### Borrow Costs and Short Interest
- **Easy to borrow (ETB):** Borrow rate < 1%/year; common in large-cap liquid stocks
- **Hard to borrow (HTB):** Borrow rate 5–50%+ per year; stocks with high short interest
- **Days to Cover (DTC):** Short interest / average daily volume. DTC > 10 = dangerous (high squeeze risk)
- **Short Interest %:** > 20% of float = elevated; > 30% = extreme squeeze candidate

**Short Squeeze Trifecta (avoid shorting when all three are present):**
1. Short interest > 20% of float
2. Days to Cover > 5
3. Stock is making new highs with rising volume (shorts being squeezed out)

### Short Selling Entry Rules
1. Confirm fundamental thesis with at least 2 financial red flags
2. Confirm technical breakdown on weekly chart (below 200 MA, Death Cross)
3. Wait for a dead-cat bounce rally into resistance (50-day MA, prior support that's now resistance) — short the rally, not the breakdown already in progress
4. Size at 50% of normal long position (adjust for unlimited upside risk)
5. Use a limit order; never chase a fast-moving stock with a market order

### Stop Loss for Short Positions
- Hard stop: if the stock closes above the 50-day MA on a weekly basis → cover
- Thesis stop: if the fundamental problem resolves (they raise capital, get acquired) → cover immediately
- Max loss per short: 1% of portfolio equity (tighter than longs, given the asymmetry)

### Position Management
- Short positions need more active management than longs
- Review weekly: is the thesis still intact? Is borrow cost rising (signal of short covering by others)?
- Cover into weakness (price drops to support level) — don't try to catch the absolute bottom
- Never add to a losing short — the company can be acquired at a premium at any moment

### Stocks to Avoid Shorting
- Heavily shorted (DTC > 10) — squeeze risk
- Subject to acquisition rumors
- Meme stocks with retail investor following (irrational buying can persist for months)
- Stocks with activist investors who may force a turnaround

---

## 3. Fibonacci Retracements and Extensions

### Theory
Fibonacci ratios (23.6%, 38.2%, 50%, 61.8%, 78.6%) appear in nature and in market price corrections. They serve as probabilistic support/resistance levels where price may pause or reverse during retracements.

### How to Draw
- **Retracement:** Draw from a swing low to a swing high (for a retracement in an uptrend). The tool plots the ratios between those two points.
- **Extension:** Draw from swing low → swing high → then the correction low. The tool projects targets above the original high (127.2%, 161.8%, 261.8%, 423.6%).

### Key Levels

| Level | Use |
|-------|-----|
| 23.6% | Shallow retracement; strong uptrend, small pullback |
| 38.2% | Normal correction in a healthy trend; first significant support |
| **50%** | **Most-watched level; psychological midpoint; high confluence** |
| **61.8% (Golden Ratio)** | **Deep correction but trend intact; strongest retracement support** |
| 78.6% | Very deep; trend weakening; high risk |
| 100% | Full retracement; trend is broken |

**Extension targets:**
| Level | Use |
|-------|-----|
| 127.2% | First extension target after breakout |
| **161.8% (Golden Extension)** | **Primary price target in strong trends** |
| 261.8% | Strong momentum target |
| 423.6% | Major bull run target |

### Entry Strategy Using Fibonacci
1. Identify a clear swing low and swing high on the daily or weekly chart
2. Draw the retracement tool
3. Watch for price to stall at a key ratio (38.2%, 50%, 61.8%)
4. Wait for a confirmation candle (hammer, engulfing, pin bar) at the level
5. Enter on the close of the confirmation candle
6. Stop: below the next Fibonacci level (or below the swing low if at 61.8%)
7. Target: prior swing high → 127.2% extension → 161.8% extension

**High-confluence zones:** When a Fibonacci level coincides with a moving average, VWAP, or prior support/resistance level, the probability of a reaction increases significantly.

### Common Mistakes
- Drawing from trivial swings (only use major swing highs/lows)
- Using Fibonacci in isolation (always require candlestick confirmation)
- Assuming price will reverse at every level (some levels act as magnets and are skipped)
- Redrawing Fibonacci after every minor move (find the relevant major swing and commit to it)

---

## 4. Elliott Wave Theory — Practical Application

### The Basic Structure
Markets move in a 5-wave impulse followed by a 3-wave correction.

**Impulse (with trend):** Waves 1, 2, 3, 4, 5
**Correction (against trend):** Waves A, B, C

```
        3
       / \
      /   4
   1 /     \     B
  / 2       5   / \
 /               A   C
```

### The Three Unbreakable Rules
1. **Wave 2 never retraces more than 100% of Wave 1** (if it does, the count is wrong)
2. **Wave 3 is never the shortest impulse wave** (often the longest and strongest)
3. **Wave 4 never overlaps Wave 1's price territory** in non-leveraged markets

### Practical Wave Guidelines

| Wave | Character | Fibonacci Relationship |
|------|-----------|----------------------|
| Wave 1 | Small initial move; often unrecognized | — |
| Wave 2 | Deep retracement; tests conviction | 50–61.8% of Wave 1 |
| Wave 3 | Longest, strongest; breakouts, high volume | 1.618 × Wave 1 (from Wave 1 low) |
| Wave 4 | Correction; often shallow and sideways | 38.2% of Wave 3 |
| Wave 5 | Final push; momentum divergence often appears | 0.618 × Wave 1 or equals Wave 1 |
| Wave A | First leg of correction | — |
| Wave B | Partial recovery; often traps bulls | 50–78.6% of Wave A |
| Wave C | Final correction leg; often equals Wave A | 1.0–1.618 × Wave A |

### Trading Elliott Wave (Practical Rules)

**Best trade — Wave 3 entry:**
- Wait for Wave 1 to complete; confirm Wave 2 retracement holds above 61.8% of Wave 1
- Enter long at the Wave 2 low or as Wave 2 ends at a Fibonacci level
- Target: Wave 1 high × 1.618 (from the Wave 1 base)
- Stop: below Wave 1 start (if Wave 2 exceeds 100% of Wave 1, the count is wrong)

**Second-best trade — Wave 5 warning / shorting at Wave 5:**
- Watch for momentum divergence in Wave 5 (MACD or RSI makes lower high while price makes higher high)
- Wave 5 ending = entry point for the A-B-C correction short
- Target Wave A: retracement to Wave 4 low; Wave C often reaches to Wave 1 territory

**Reality check:** Elliott Wave counting is highly subjective. Different analysts on the same chart produce different counts. Use it as a probabilistic framework, not a certainty:
- If a count gives you a high-probability entry with a well-defined stop, trade it
- If the count requires complex nested waves to justify the trade, skip it
- Never override a clear risk management signal just because the Elliott count "should" continue

### Common Mistakes
- Forcing a count on every chart (not every chart has a clear wave structure)
- Ignoring the three rules (especially Wave 4 overlapping Wave 1)
- Over-extending into 5th waves when momentum divergence is present
- Using Wave theory without combining with Fibonacci levels for confirmation
