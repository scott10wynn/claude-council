# Swing Trading & Momentum Strategies

---

## 1. Swing Trading with Trend Following (Pullback Entries)

Buy dips in an uptrend — wait for price to pull back to a rising moving average, confirm the dip is ending, and enter in the direction of the larger trend.

### Indicator Settings
| Indicator | Setting | Purpose |
|-----------|---------|---------|
| EMA | 20-period | Fast trend / pullback magnet |
| EMA | 50-period | Deeper pullback support |
| EMA | 200-period | Long-term regime filter |
| RSI | 14-period | Pullback health check |
| ATR | 14-period | Stop sizing |
| Volume | 20-day avg | Confirm weak pullback, strong bounce |

### Entry Rules (all must be met)
1. Stock is above the 200 EMA (daily)
2. 20 EMA is above the 50 EMA (bullish stack)
3. Price has pulled back to the 20 EMA zone (within ~2%) or the 50 EMA for a deeper pullback
4. RSI is in the 40–55 range (healthy pullback, not reversal)
5. Volume on pullback candles is **below** 20-day average (weak-handed selling)
6. A reversal candlestick forms at the MA: hammer, bullish engulfing, pin bar, or inside bar
7. **Trigger:** Enter on close of reversal candle, or on a break above that candle's high the next day

### Exit Rules
- Primary target: prior swing high (nearest resistance to the left)
- Extended target: 2R if price breaks through the prior high with momentum
- Trail: once price makes a new swing high, trail stop under each subsequent swing low
- Time exit: if price has not moved in your favor after 5–7 trading days, exit — setup has failed

### Stop Loss
- Below the low of the reversal candle OR below the 20 EMA by 1.5%, whichever is smaller
- Deeper pullback to 50 EMA: stop just below the 50 EMA
- ATR alternative: 1.5–2× ATR below entry

### Ideal Conditions
- Bull market / confirmed uptrend: price above a rising 200 EMA on daily
- Moderate volatility — trending but not parabolic
- Avoid during choppy, sideways markets or broad market distribution days

### Common Mistakes
- Entering on first pullback candle without waiting for a reversal signal
- Trading pullbacks in sideways/choppy markets (no trend to pull back from)
- Entering when RSI is below 40 — signals a real trend break, not a pullback
- Stops too tight (below 20 EMA by only 0.5%) — gets shaken out by normal volatility
- Not checking SPY/QQQ — strong setups fail in distribution markets

---

## 2. Momentum / Relative Strength Trading

Buy the stocks with the highest relative strength in the highest-ranked sectors. The strongest things tend to stay strong.

### How to Measure Relative Strength
- **IBD RS Rating:** Target stocks with RS Rating ≥ 87–90 (outperforming 90%+ of all stocks)
- **RS Line:** Plot stock price ÷ SPY. Must be trending up and ideally making a new high **before or with** the price breakout
- **RS Phase:** RS Line above its 21-day EMA = outperformance phase. Dipping below = early warning

### Entry Rules (all criteria)
1. Stock RS Rating ≥ 87–90
2. Stock's sector ranks in the top 2–3 sectors by 3-month relative performance
3. Price above both the 50-day and 200-day moving averages
4. ATR ≥ 4% (enough daily range for meaningful trades)
5. Stock forming a base (cup, flat base, tight consolidation) after a strong prior advance
6. **Trigger:** Breakout from base on volume ≥ 1.5× the 50-day average, OR pullback to 21-day EMA while RS line holds above its 21-day EMA

### Exit Rules
- Take partial profits at 2:1 R/R; let remainder run
- Exit if RS Rating drops below top 40% — stock is losing leadership
- Exit if price closes below 50-day MA on above-average volume
- Rotate out when stock's sector drops out of the top 3 sectors

### Stop Loss
- Initial stop: just below most recent swing low OR 1 ATR below entry, whichever is tighter
- For breakout entries: stop just below the breakout pivot (top of the base)
- Minimum 2:1 R/R required at entry — if you can't achieve it, skip the trade

### Common Mistakes
- Chasing extended stocks 20–30% above their base (poor risk-reward)
- Buying high RS stocks in weak sectors — sector headwinds override individual strength
- Short RS lookback (1 month) — captures noise, not leadership
- Holding through a sector rotation signal
- Not verifying RS line is leading price

---

## 3. 52-Week High Breakout Strategy

Stocks making new 52-week highs break through a psychological ceiling that has contained price. If volume confirms conviction, the move often continues.

### Entry Rules
**Standard breakout:**
1. Stock printing a new 52-week **closing** high (daily chart)
2. Volume on breakout day ≥ 150% of 20-day average (lower volume = much higher failure rate)
3. Breakout from a consolidation base of at least 3–8 weeks
4. Stock's sector in the top half of sector rankings
5. SPY/QQQ in an uptrend or neutral

**Conservative retest entry (63% of successful breakouts follow this path):**
1. Price touches 52-week high → pulls back 3–5%
2. Price retests the breakout level and holds
3. Enter on the bounce from the retest level — tighter entry, better R/R

### Exit Rules
- First target: next major resistance from prior price history (look left on weekly)
- Take 50% off at 1.5–2× risk; trail remaining position
- Trail: below the 20 SMA on daily — close below it = exit signal
- Time stop: if no meaningful advance within 10–15 trading days, exit

### Stop Loss
- Breakout entry: just below the 52-week high level that was broken (now support)
- Retest entry: below the low of the retest candle
- Max risk per trade: 1–2% of account

### Common Mistakes
- False breakout without volume — require volume ≥ 150% on breakout candle
- Buying too extended (stock already ran 40–50% without consolidating)
- No exit plan — the strategy gives clear entries but few built-in exit signals
- Confirming only on an intraday chart — wait for the daily close above the 52-week high
- Ignoring market conditions — even strong breakouts fail in a broad selloff

---

## 4. Mean Reversion / Rubber Band Strategy

Price stretches away from its mean — the further it stretches, the more likely it snaps back.

### Indicator Settings
| Indicator | Setting | Purpose |
|-----------|---------|---------|
| Bollinger Bands | 20 SMA, 2 standard deviations | Define extremes |
| RSI | 14-period | Overbought/oversold confirm |
| Keltner Channel | 20-period, 2× ATR | Alternative extreme ID |
| ATR | 14-period | Stop sizing and target calc |
| Volume | 20-day avg | Confirm climactic selling/buying |

### Entry Rules (long — reverse for shorts)
1. Price closes below the lower Bollinger Band (20, 2 SD)
2. RSI(14) drops below 30
3. Volume spikes above average on down candle (climactic selling / exhaustion)
4. Bullish reversal candle forms: hammer, bullish engulfing, or doji at or below the lower band
5. Optional filter: price has not been in a persistent downtrend for more than 20–30 bars (avoid catching falling knives)
6. **Entry:** Buy the open next day after the reversal candle, or close of the reversal candle with tight stop

### Exit Rules
- Primary target: middle Bollinger Band (20 SMA) — the mean you're reverting to
- Extended target: opposite band in strong reversal moves
- Time stop: if price has not moved toward the mean within 3–5 bars, exit — setup failed
- Scale out: take 50–75% off at middle band, let remainder run to opposite band with trail

### Stop Loss
- Below the low of the entry candle (longs) or above the high (shorts)
- ATR-based: 1–2× ATR beyond the extreme band
- **Critical:** Never hold through a stop in mean reversion — these are wrong quickly or they work quickly

### Ideal Conditions
- **Best:** Range-bound / consolidating markets
- **Acceptable:** Trending markets where you're fading only within the trend direction
- **Avoid:** Strong trending / momentum markets
- More reliable on liquid indices/ETFs than individual stocks (stocks can gap down 40% on earnings)

### Common Mistakes
- Applying mean reversion in trending markets — single biggest error
- Entering as soon as price touches the band without waiting for reversal candle
- Targeting too far (full band-to-band) when price is in a trend
- Converting a short-duration mean reversion trade into a multi-week hold
- Treating individual stocks the same as indices

---

## 5. Gap and Go / Gap Fill Strategies

**Gap and Go:** Price gaps with a catalyst and continues — trade momentum continuation.
**Gap Fill:** Price gaps but lacks follow-through — fade the gap expecting it to fill back to prior close.

### Which Gap Type Is Which?

| Gap Type | Description | Fill Rate | Trade |
|----------|-------------|-----------|-------|
| Common gap | Small, low-volume, no catalyst | 85–90% within 2 days | Gap Fill (fade) |
| Breakaway gap | Large, high-volume, strong catalyst, breaks from base | 30–45% fill | Gap and Go |
| Runaway gap | Mid-trend continuation gap | 40–50% fill | Gap and Go or hold |
| Exhaustion gap | Late in a trend, fades quickly | 70%+ fill rapidly | Gap Fill (fade) |

Overall: ~70% of all gaps eventually fill. High-volume large gaps outside range fill only ~21% — these are Gap and Go days.

### Gap and Go Entry Rules
1. Stock gaps ≥ 3–5% with a real catalyst (earnings, news, guidance raise)
2. Pre-market volume ≥ 2× normal AND rising (not fading before open)
3. SPY/QQQ not strongly opposing the gap direction
4. **Wait 5 minutes** — let the opening range establish; never enter in the first 1–2 minutes
5. **Trigger:** Price breaks above the high of the first 5-minute candle (for gap up) on above-average volume
6. Price should be above VWAP for longs at moment of entry

### Gap Fill Entry Rules
1. Stock gaps on low/moderate volume with no clear catalyst
2. Pre-market volume light or declining heading into open
3. SPY/QQQ moving against the gap direction
4. Price opens and immediately starts to reverse within first 5–10 minutes
5. **Trigger:** Price breaks below the low of the first 5-minute candle on volume

### Exit Rules
**Gap and Go:**
- First target: 1.5–2× risk; take 50% off
- Trail remainder using 5-minute candle lows (longs) or highs (shorts)
- Time exit: if no first target within 60 minutes, exit — momentum stalled
- Hard rule: most moves play out within 30–90 minutes; do not hold through lunch

**Gap Fill:**
- Target: prior close (complete gap fill)
- Take profits at 50–75% fill if momentum is slowing
- Exit if price reverses and makes new highs (fill has failed)

### Stop Loss
**Gap and Go:** Below low of first 5-minute candle. If stock immediately loses VWAP = failed setup, exit.

**Gap Fill:** Above pre-market high (fading gap up). If stock makes new intraday high above the opening gap, exit.

### Common Mistakes
- Trading the open immediately — wait for the 5-minute range to form
- Ignoring volume and catalyst quality — gaps with no volume or catalyst fill 85%+
- Trading a gap-up stock in a hard down market
- Overtrading — max 2–3 gap trades per day; first 1–2 setups are almost always the best
- Holding too long — gap trades not working within 60–90 minutes are usually done
- Chasing 15–20 minutes after the breakout — risk-reward is gone by then

---

## Quick Comparison

| Strategy | Best Market | Timeframe | Avg Hold | Key Risk |
|----------|-------------|-----------|----------|----------|
| Trend pullback | Bull/trending | Daily | 1–3 weeks | Choppy markets |
| RS/Momentum | Bull with clear leaders | Daily/Weekly | Days–weeks | Late entries |
| 52-week high breakout | Bull, expanding new highs | Daily | 1–4 weeks | False breakouts |
| Mean reversion | Range-bound | Daily | 1–5 days | Trending markets |
| Gap and Go / Fill | Any (catalyst-dependent) | 5-minute | Minutes–hours | News reversals |
