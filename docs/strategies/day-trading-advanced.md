# Advanced Day Trading: HOD/LOD Reversals, Level 2 & Scalping

---

## 1. HOD / LOD Reversal Strategy

High-of-Day (HOD) and Low-of-Day (LOD) reversals are intraday mean-reversion trades: price runs to an extreme, shows exhaustion signals, and snaps back.

### Why They Work
Momentum traders who chased the run-up are sitting on unrealized gains. Once price stalls, stop-triggers and profit-taking create a rapid reversal. The crowd is trapped on one side.

### Setup Checklist — Long LOD Reversal (mirror for short HOD)

**Macro context:**
- SPY/QQQ is not in a strong downtrend (check VWAP on SPY first)
- Stock has a legitimate catalyst explaining the decline (or is a gap-fill candidate)
- Stock is not in a sector in free fall

**Price action conditions (all required):**
1. Price has made a sharp, extended move down to a new intraday low
2. The decline slows — candles get smaller, wicks lengthen (indecision)
3. Price touches or breaks the LOD, then immediately reverses back above it (false breakdown / "shakeout")
4. A 5-minute candle forms a **long lower wick / hammer / doji** at the LOD
5. Volume on the reversal candle exceeds the prior two candles (buyers absorbing sellers)

**Indicator confirmation (require at least 2 of 3):**
- RSI(14) below 30 on 5-minute chart, curling upward
- MACD histogram (12/26/9) making a higher low while price makes a lower low (bullish divergence)
- Price at or near −2σ VWAP band (statistical extreme)

**Level 2 confirmation (see Section 2):**
- Bid stack thickening at the LOD price
- Large offers being absorbed without price falling further (absorption)

### Entry Rules
- Enter on the **close of the first candle that closes above the LOD reversal candle's high** (not during the candle)
- Alternative aggressive entry: at the LOD price itself with a mental stop below the low of the reversal wick
- Do not enter if the reversal candle has already run more than 0.5× ATR from LOD before you enter (missed the entry)

### Stop Loss
- Strict: below the **low of the reversal candle** (the wick that defines the LOD)
- If that stop is more than 1.5× ATR away, skip the trade — risk is too large
- Risk no more than 0.5% of account equity per trade

### Targets
- **T1:** VWAP (first major resistance in a declining stock) — take 50–60% of position
- **T2:** Prior intraday support/resistance level (move stop to breakeven after T1)
- **T3:** Pre-market high or prior day close (trail stop with candle lows)
- Time stop: if price has not moved toward T1 within 20–30 minutes of entry, exit regardless

### HOD Short (Mirror)
All rules reversed:
- Price extended to new HOD
- Candles slow, long upper wicks form
- RSI > 70 + MACD bearish divergence + +2σ VWAP band
- Enter on first candle closing below HOD reversal candle's low
- Stop: above HOD reversal candle high
- Targets: VWAP → prior intraday levels → pre-market low

### Exhaustion Signals (Strengthens the Setup)
- **Climax volume:** Volume on the final run far exceeds average — "blow-off top/bottom"
- **Speed of decline slowing:** 5-min candles went from −1% to −0.3% to −0.1% each — momentum dying
- **Seller exhaustion:** After a big red candle, the next candle's body is tiny (sellers used up)
- **TICK divergence:** NYSE TICK making higher lows while price makes lower lows = institutions quietly buying the dip

### Best Conditions
- Opening 30–60 minutes (9:30–10:30 AM ET): strongest reversals occur in this window
- 3:00–4:00 PM ET: secondary window as institutions square positions
- Stock with news catalyst (justifies the move AND the reversal interest)
- RVOL (relative volume) above 2.0 — guarantees sufficient liquidity for clean entries

### Worst Conditions
- No catalyst — stocks fade on no volume and often don't reverse sharply
- SPY in strong trend against the trade direction
- Stock already reversed twice (third reversal attempts are low probability)
- Spreads wider than $0.15 (slippage eats the setup)

---

## 2. Level 2 / Tape Reading / Scalping

### Level 2 Overview
Level 2 shows the full order book: all bids (buy orders) and asks (sell orders) at each price level, with the size and market maker/ECN source.

**Key elements:**
- **Bid stack:** All buy orders below current price; depth = support
- **Ask stack:** All sell orders above current price; depth = resistance
- **Spread:** Difference between best bid and best ask; tighter = more liquid
- **Size:** Number of shares at each price (displayed in hundreds at most brokers)

### Reading the Tape (Time & Sales)
The time and sales (T&S) window shows every executed trade in real time.

**Color coding (typical):**
- Green print: trade executed at or above the ask (buyer aggressor)
- Red print: trade executed at or below the bid (seller aggressor)
- Yellow/white: trade at mid (neutral)

**Key tape reads:**
| Pattern | Meaning |
|---------|---------|
| Rapid green prints at ask | Buyers in control; momentum building |
| Large block print on ask | Institutional buyer; potential run |
| Rapid red prints at bid | Sellers aggressive; risk of further drop |
| Large print at bid mid-day | Possible distribution |
| Slow, alternating green/red | Chop; no clear direction |
| Prints slowing at a key level | Absorption — one side defending the level |

### Detecting Institutional Order Flow

**Block prints:** Single prints of 10,000+ shares (sometimes split into many smaller lots to hide size — watch for multiple lots at same price within seconds). Institutions buy on weakness and accumulate quietly. When they appear on the ask, price often continues.

**Iceberg orders:** A large order that only shows a small portion in the book (refreshes as that portion fills). Signs: same price keeps reappearing on Level 2 with same size after each fill; T&S shows repetitive fills at the exact same price.

**Spoofing (red flag — illegal but occurs):** Large bid or ask that disappears before it can be filled. The order was placed to create a false impression of supply/demand. If you see a 50,000-share bid that vanishes when price gets close, it was fake. Trade against the direction it was trying to push.

**Absorption:** Price pushes against a large offer (ask); the offer holds but does not move the price lower — meaning buyers are consuming every share being offered. This signals the offer will eventually break and price will pop. Trade long as the resistance level breaks, not before.

### Scalping Framework

Scalping is the fastest time frame: entries and exits within 1–10 minutes, targeting $0.10–$0.50 per share on liquid stocks.

**Required conditions:**
- Stock volume > 3 million shares/day
- Bid-ask spread ≤ $0.05
- Real-time Level 2 with T&S (no delays)
- Direct-access broker with hotkeys (market orders with routing control)

**Scalp setup (bid/ask momentum):**
1. Identify a stock with a clear short-term level (whole dollar, VWAP, pre-market high)
2. Watch L2 as price approaches: Is the offer being absorbed (consumed without price moving)? Is the bid stack growing (demand building)?
3. If offer breaks and bid grows: enter long as price crosses the level
4. Target: $0.15–$0.30; stop: $0.10–$0.15 below entry
5. Exit on L2 change: if the next offer level has 5× the size, scalp is done

**Scalping rules:**
- Never scalp against the VWAP direction — always scalp in the direction VWAP trend is pointing
- Set hotkeys for instant exit (don't use mouse to exit scalps)
- Use limit orders to enter; market orders if you need emergency exit
- Never let a scalp become a swing trade — if the target isn't hit in 10 minutes, exit flat

### Market Maker Tactics to Know

**Painting the tape:** Executing trades between related accounts to create the appearance of volume or a price trend. Illegal, but watch for circular prints in illiquid stocks.

**Shakeout:** Large offer placed briefly at current bid to trigger stop-loss orders; stops are hit, price dips momentarily, then the offer is removed and price recovers. Appears as a sudden spike down that immediately reverses. If you see this in real-time: don't panic-sell; hold if the reversal is immediate.

**Gunning the stops:** Market makers push price to known stop-loss clusters (below round numbers, prior lows) to trigger a cascade. They then buy back at the low. Recognize by: sharp quick move that reverses in < 5 minutes with no news catalyst.

### Level 2 Scalping Checklist
- [ ] Stock has 3M+ daily volume
- [ ] Spread ≤ $0.05
- [ ] Clear catalyst or momentum reason
- [ ] VWAP direction matches trade direction
- [ ] L2 shows absorption or breakout confirmation
- [ ] T&S shows aggressive prints on entry direction
- [ ] Stop is set before entry
- [ ] Not within 5 minutes of a news release or FOMC

---

## Quick Reference

| Setup | Timeframe | Key Signal | Stop | Target |
|-------|-----------|------------|------|--------|
| LOD Reversal | 5-min | Hammer + RSI < 30 + volume surge | Below wick low | VWAP |
| HOD Reversal | 5-min | Shooting star + RSI > 70 + VWAP resistance | Above wick high | VWAP |
| L2 Absorption Long | 1–5 min | Offer absorbed, bid growing | Below support level | Next resistance |
| L2 Breakout Scalp | 1-min | Offer breaks, T&S green prints | $0.10–$0.15 below | $0.20–$0.40 |
