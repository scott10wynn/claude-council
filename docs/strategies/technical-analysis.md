# Technical Analysis Strategies

Practical entry/exit rules for the five core technical setups. All signals should be confirmed on a candle *close* — never jump in mid-candle.

---

## 1. Moving Average Crossover (Golden Cross / Death Cross)

**Golden Cross**: 50 SMA crosses above 200 SMA → bullish  
**Death Cross**: 50 SMA crosses below 200 SMA → bearish

### Settings
| Use case | Fast MA | Slow MA |
|----------|---------|---------|
| Position/swing (daily) | 50 SMA | 200 SMA |
| Swing (4H) | 20 EMA | 50 EMA |
| Day trading (5m–15m) | 9 EMA | 21 EMA |

Use SMAs on daily+; EMAs for faster intraday response.

### Entry Rules
1. Wait for daily candle to **close** with fast MA mathematically above/below slow MA
2. Confirm with volume: 40%+ above average on crossover day raises reliability from ~54% to ~72%
3. Optional confluence: RSI > 50 (bullish) or MACD bullish crossover simultaneously
4. Enter on open of next candle, or on a pullback to the fast MA

### Exit Rules
- Trail using the 50 MA as dynamic support — exit on daily close below it
- Full exit on the opposite crossover forming
- Profit target: next major resistance zone, minimum 1:2 R/R

### Stop Loss
- Longs: just below the 50 SMA, or below the most recent swing low before the crossover
- Shorts: just above the 50 SMA

### Ideal Conditions
Trending markets only. Generates constant false signals in ranging/sideways conditions.

### Common Mistakes
- Entering before candle closes (premature signal)
- Trading in a sideways market
- No volume confirmation — low-volume crossovers fail ~46% of the time
- Treating a Golden Cross in a bear market rally as a full bull signal

---

## 2. RSI Overbought / Oversold

RSI measures momentum on a 0–100 scale. Below 30 = oversold; above 70 = overbought.

### Settings
| Use case | Period | Levels |
|----------|--------|--------|
| Swing trading | 14 (default) | 70 / 30 |
| Swing (stricter) | 20 | 80 / 20 |
| Day trading | 8–9 | 70 / 30 |
| Volatile assets / crypto | 14 | 80 / 20 |

### Entry Rules
**Oversold long:**
1. RSI drops below 30 (or 20)
2. Wait for RSI to **cross back above** the threshold — that's the trigger, not the touch
3. Confirm with bullish candle (hammer, engulfing) near a known support level
4. Enter on the close of the confirmation candle

**Overbought short:**
1. RSI rises above 70 (or 80)
2. Wait for RSI to **cross back below** the threshold
3. Confirm with bearish candle near resistance

**Trend continuation (do NOT fade):**
- In a strong uptrend, RSI holding above 50 and bouncing off the 50 line = buy signal, not a short
- RSI staying above 70 in an uptrend = momentum confirmation, not a reversal warning

### Exit Rules
- Long: exit when RSI reaches 70 (or 80 in strong trends), or at next resistance
- Short: exit when RSI reaches 30 (or 20), or at next support
- Time-based: close after 10 trading days if neither target nor stop is hit
- Partial: take 50% off at first target, trail the rest

### Stop Loss
- Longs: below the most recent swing low made while RSI was oversold
- Shorts: above the most recent swing high

### Ideal Conditions
- Ranging/mean-reverting markets: fade-the-extreme approach works best
- Trending markets: use RSI 50 line as dynamic support, **not** 70/30 as reversal signals

### Common Mistakes
- Shorting just because RSI hits 70 in a bull trend
- Entering on the touch of 30/70 rather than waiting for the cross back through
- No price action confirmation — RSI can stay extreme for many candles
- Ignoring trend direction; counter-trend RSI fades have lower win rates

---

## 3. MACD Crossover

MACD = difference between two EMAs, with a signal line and histogram showing momentum shifts.

### Settings
| Use case | Fast EMA | Slow EMA | Signal |
|----------|----------|----------|--------|
| Standard (daily/4H/1H) | 12 | 26 | 9 |
| Day trading (5m/15m) | 5 | 13 | 1 |
| Slower / more reliable | 19 | 39 | 9 |

### Entry Rules
**Bullish crossover:**
1. MACD line crosses **above** signal line — strongest when it also crosses above zero
2. Histogram flips from negative to positive bars
3. Confirm: RSI > 50 and/or price above key support
4. Wait for candle to **close** after crossover, enter next candle's open
5. Best setup: crossover occurs at/after a pullback to support in an uptrend

**Zero-line cross (stronger signal):**
- MACD crossing above zero = bullish momentum confirmation, higher conviction than signal line cross alone

### Exit Rules
- Exit long: MACD line crosses back below signal line, or histogram begins shrinking (peak histogram = fading momentum)
- Profit target: next resistance; minimum 1:2 R/R
- Trail stop using 20 EMA once in profit

### Stop Loss
- Below most recent swing low (longs) or swing high (shorts)
- Day trading: 1× ATR below entry

### Ideal Conditions
Trending markets. MACD is a lagging trend-following tool — whipsaws constantly in choppy, sideways conditions.

### Common Mistakes
- Trading every signal line crossover regardless of market context
- Not waiting for candle close — entering mid-crossover leads to false starts
- Misreading histogram: shrinking histogram warns of fading momentum *before* the crossover — use as early exit warning
- Using 12/26/9 on a 1-minute chart (too slow — use 5/13/1 instead)
- Ignoring zero-line position — crossover below zero has lower reliability

---

## 4. Bollinger Bands Squeeze & Breakout

Three bands: 20 SMA (middle) + upper/lower bands at 2 standard deviations. A "squeeze" (bands contracting) signals compressed volatility and a coming directional move.

### Settings
- Standard: 20-period SMA, 2.0 standard deviations
- Add Bollinger Band Width (BBW) indicator: multi-month low in BBW = high-quality squeeze
- Keltner Channel overlay: when Bollinger Bands are **inside** Keltner Channels (20 EMA, 1.5× ATR), squeeze is confirmed

### Entry Rules
1. Identify squeeze: bands narrowest in 20+ candles, or BBW at multi-period low
2. Wait for breakout candle to **close outside** the band (body close, not a wick)
3. Volume confirmation: breakout candle volume 50%+ above average (breakouts without volume fail 30–40% of the time)
4. Direction confirmation: RSI > 50 for upside, RSI < 50 for downside; MACD histogram should match
5. Enter on open of next candle after confirmed breakout close

**Retest entry (lower risk):** After breakout, wait for pullback to middle band (20 SMA) holding as support — enter there with tighter stop.

### Exit Rules
- First target: opposite band (measured move)
- Fixed R/R: take 50% off at 1.5:1, move stop to breakeven, trail the rest
- Trailing stop: use middle band (20 EMA) — exit if price closes back through it
- Exit immediately if price reverses back inside the bands within 1–2 candles (failed breakout)

### Stop Loss
- Direct entry: 0.5× ATR beyond the breakout candle's low (for longs)
- Retest entry: below the low of the retest confirmation candle

### Common Mistakes
- Entering *during* the squeeze anticipating direction — the squeeze tells you a move is coming, not which direction
- Entering on a wick pierce without a candle body close
- Ignoring volume — no volume = likely fakeout
- No immediate invalidation rule for failed breakouts
- Ignoring context: a squeeze below a major resistance level has different probability than one at all-time highs

---

## 5. Support & Resistance Breakout

Price respects well-established horizontal levels. A confirmed break through them with momentum signals a sustained directional move.

### How to Identify Valid Levels
- At least 2–3 clear touches at the same price zone (more tests = stronger level)
- Levels significant on at least one timeframe higher than your entry timeframe
- Use candle **closes**, not wicks, to define the level
- Round numbers ($100, $50, etc.) are key psychological S/R

### Entry Rules
**Method 1 — Direct breakout:**
1. Price closes above resistance / below support with full candle body (not just wick)
2. Volume 50%+ above 20-period average on breakout candle
3. Next 1–2 candles continue in breakout direction
4. Enter at open of next candle after confirmed close

**Method 2 — Retest entry (higher probability, better R/R):**
1. Price breaks through the level
2. Price pulls back to test the broken level (old resistance = new support)
3. Bullish candle (hammer, engulfing, pin bar) forms at retested level
4. Enter on close of confirmation candle
5. Typically 20–30% better R/R than chasing the initial breakout

### Exit Rules
- First target: measured move = height of the consolidation range projected from the breakout
- Second target: next major S/R level
- Minimum 1:2 R/R; trail stop by 1× ATR once in profit
- Close if price closes back below the broken level (failed breakout)

### Stop Loss
- Direct entry: 0.5–1.0× ATR below the broken resistance level (now support)
- Retest entry: below the low of the retest confirmation candle
- **Never** place stop exactly at the level — stop hunts briefly pierce obvious retail stop clusters before reversing

### Ideal Conditions
- Trending markets: breakouts in the trend direction have significantly higher probability
- Pre-breakout consolidation: longer and tighter = more explosive the move
- Avoid during low-liquidity periods (pre-market, holidays) — thin volume = false breakouts
- Wait 30+ minutes after high-impact news events before trading breakouts

### Common Mistakes
- Drawing too many levels — use only the 3–5 most obvious, highest-touch levels
- Entering on a wick pierce without candle body close
- No volume confirmation
- Chasing the move after a large breakout candle (poor R/R — wait for retest)
- Trading counter-trend breakouts (much lower probability)
- Placing stops exactly at obvious levels (gets stop-hunted)

---

## Quick Reference

| Strategy | Best Timeframe | Entry Trigger | Stop | Avoid |
|----------|----------------|---------------|------|-------|
| MA Crossover | Daily | Candle close after crossover + volume | Below 50 SMA | Ranging markets |
| RSI | Daily / 4H | RSI crosses back through extreme + candle confirm | Below swing low | Fading strong trends |
| MACD | Daily / 4H | Signal line crossover + histogram flip, candle close | Below recent swing low | Choppy markets |
| BB Squeeze | Daily / 4H | Body close outside band + volume surge | 0.5 ATR beyond breakout candle | Entering before direction confirmed |
| S/R Breakout | Daily / 4H | Body close beyond level + 50%+ volume | 0.5–1.0 ATR below broken level | Counter-trend, no volume |
