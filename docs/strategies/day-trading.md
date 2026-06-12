# Day Trading Strategies

---

## 1. VWAP Anchored Trading

VWAP (Volume Weighted Average Price) is the single most-watched intraday level by institutional traders. Price above VWAP = VWAP acts as dynamic support; price below VWAP = acts as dynamic resistance.

**Anchored VWAP (AVWAP):** Set the anchor at any meaningful event — earnings gap, IPO date, major breakout candle, FOMC day, high-volume reversal. Running AVWAP from two events simultaneously creates high-confluence zones where both lines converge.

### Indicator Settings
- 5-minute chart (primary); 1-minute for entries, 15-minute for context
- VWAP with ±1σ, ±2σ, ±3σ standard deviation bands
- Supporting: 9 EMA + 20 EMA overlay, RSI 14-period
- Do not trade VWAP signals in the first 15–30 minutes — insufficient data

**Standard deviation bands:**
| Band | Stats | Use |
|------|-------|-----|
| ±1σ | 68% of day inside | Trend continuation entries / exits |
| ±2σ | 95% of day inside | Mean reversion fades |
| ±3σ | >99% — anomaly | Immediate reversion expected |

SD band fades only work when VWAP is moving **horizontally**. Never fade bands in a strong trend.

### Entry Rules

**Setup A — VWAP Bounce (Trend Continuation Long)**
All three required:
1. Daily chart in uptrend; price opened above VWAP and has held it
2. Price pulls back to VWAP on declining volume
3. 5-minute candle touches VWAP but **closes back above it** with volume surge + bullish candle (hammer, engulfing, long lower wick)

Entry: at VWAP or on first candle closing back above it.

**Setup B — VWAP Reclaim (Momentum Long)**
Price was below VWAP → breaks back above with strong volume. Enter on first candle **closing above VWAP** with above-average volume. Signals shift from sellers to buyers.

**Setup C — Short at VWAP Resistance**
Stock in downtrend → rallies up to VWAP from below → fails to close above it on 5-minute chart → Enter short when next 5-minute candle closes back below VWAP. Confirm: RSI above 60–65 (overbought on bounce).

**Setup D — VWAP + RSI Confluence**
- Long: price closes above VWAP AND RSI < 70
- Short: price closes below VWAP AND RSI > 30

**Setup E — 3-Sigma Reversion**
1. Price hits 3rd SD band
2. Long wick rejection candle forms
3. Enter on break of rejection candle in reversion direction
4. Target: central VWAP line; stop: close beyond the rejection candle

### Stop Loss
| Setup | Stop |
|-------|------|
| VWAP bounce long | Below low of bounce candle |
| VWAP reclaim long | Below VWAP — re-cross under with volume = exit |
| Short at VWAP resistance | Just above rejection candle high |
| 3-sigma fade | 0.5× ATR beyond the band |

### Exit / Targets
- First target: opposite VWAP band (e.g., entered at +1σ → T1 is VWAP)
- Trend trade target: next significant price structure level (prior swing high/low)
- Trail stop: follow the VWAP line as it moves in your favor
- Best session windows: 9:30–11:00 AM ET and 3:00–4:00 PM ET

### Common Mistakes
- Using VWAP as a standalone signal
- Trading the first 15 minutes (insufficient data makes it unreliable)
- Fading SD bands in a trending market
- Ignoring volume — if price moves away from VWAP with no volume, the signal is weak
- Treating VWAP as a fixed level — it moves with each trade

---

## 2. Pre-Market High / Low Breakout

Mark the high and low of the pre-market session (4:30 AM – 9:30 AM ET; focus on 7:00–9:30 AM). Draw them as zones, not exact prices. Also mark: prior day high, prior day low, prior close, overnight high/low for confluence.

### Quality Filters Before the Open
- Pre-market volume ≥ 50% of average daily volume by 9:00 AM
- Ideal: 3–5× above normal pre-market pace
- Must have a clear catalyst: earnings, FDA approval, major news, macro data. Technical-only setups without a catalyst have low follow-through.

### Entry Rules

**Long (breakout above pre-market high):**
1. 5-minute candle **closes above** the pre-market high (or use buy stop limit $0.02–$0.05 above the level)
2. Breakout candle volume ≥ 2× average 5-minute pre-market volume; RVOL 2.0+ preferred (3.0+ ideal)
3. Price above VWAP at moment of entry

**Short (breakdown below pre-market low):**
Mirror rules: 5-minute candle closes below pre-market low + 2× volume + price below VWAP.

**Gap and Go variant (highest probability):**
- Stock gaps 2–4%+ at open with catalyst
- Forms tight consolidation (15–30 min) near the pre-market high
- Breakout above pre-market high during consolidation = textbook entry

### Stop Loss
- Long: below the pre-market **low** (full range is your risk); tighter: below low of breakout candle + 0.25–0.5× ATR buffer
- Short: above the pre-market **high** + ATR buffer
- Risk no more than 0.5% of account equity per trade; use 50–75% of normal size (wider spreads at open)

### Exit Rules
- Minimum R/R: 1.5:1; standard targets 2:1 and 3:1
- Scale: take 50% off at 1.5× risk, move stop to breakeven, trail remainder with 5-minute candle lows/highs
- Time stop: if not triggered by 11:00 AM ET, abandon setup — probability collapses after mid-morning

**At 9:30 AM open (if entered pre-market):** The volume surge can reverse pre-market trends. Have a defined plan: trail to breakeven, take profits, or use a time stop.

### Best/Worst Conditions

**Best:** Earnings season or major news, 3–5× pre-market volume, stock priced $10–$50, trending market.

**Worst:** Low-volume news-light sessions, stock already moved 5%+ from gap before trigger, SPY in heavy opposing trend.

### Common Mistakes
- Trading without a catalyst
- Using market orders (use limit orders only in pre-market)
- Oversizing (wider spreads, higher slippage)
- Holding through the open without a defined plan
- Treating pre-market levels as surgical prices (they're zones — use $0.02–$0.10 buffers)
- FOMO entering after the move has already started

---

## 3. Opening Range Breakout (ORB)

The "opening range" is the high and low formed in the first N minutes of regular session trading (9:30–9:35, 9:30–9:45, or 9:30–10:00 AM ET). Breakout above/below this range signals the day's directional bias.

### ORB Variants

| Variant | Range Window | Best For |
|---------|-------------|---------|
| 5-minute ORB | First 5 minutes | Aggressive, volatile stocks; fast moves |
| 15-minute ORB | First 15 minutes | Most commonly used; balances noise vs. signal |
| 30-minute ORB | First 30 minutes | Conservative; higher probability; slower entries |

### Entry Rules
1. Let the opening range form completely — **never enter during the range formation**
2. Price closes a candle **above the opening range high** (long) or **below the opening range low** (short)
3. Volume confirmation: breakout candle volume ≥ 1.5× average; 2× preferred
4. SPY/QQQ trending in the same direction as the breakout (market context confirmation)
5. Pre-market high/low level: if the ORB breakout also clears the pre-market high, the signal is significantly stronger (dual confirmation)

### Stop Loss
- Long: below the opening range **low**
- Short: above the opening range **high**
- Tighter alternative: below/above the midpoint of the opening range (half-range stop) — reduces R but increases R/R ratio

### Exit Rules
- Measured move target: add the opening range height to the breakout point
- Time exit: most ORB moves complete within 60–90 minutes of the breakout
- Close any ORB position by 11:30 AM if not at target — power fades

### Common Mistakes
- Entering *during* range formation
- Trading ORB on stocks with no pre-market catalyst — needs fundamental fuel
- Ignoring broader market direction (VWAP on SPY is your first filter)
- Not accounting for pre-market levels — an ORB breakout that runs into a strong pre-market resistance level often stalls there

---

## Quick Reference

| Strategy | Timeframe | Entry Trigger | Stop | Session Window |
|----------|-----------|--------------|------|----------------|
| VWAP Bounce | 5-minute | Close above VWAP + volume | Below bounce candle | 9:45 AM–11:00 AM, 3–4 PM |
| VWAP Reclaim | 5-minute | First close above VWAP + volume | Below VWAP | 9:45 AM–11:00 AM |
| Pre-Market High/Low | 5-minute | Close above/below level + 2× volume | Opposite pre-market level | 9:30–11:00 AM |
| ORB | 5/15/30-min | Close beyond range + volume | Opposite side of range | 9:30–11:30 AM |
