# Volume Profile, Order Flow, Dark Pools & Unusual Options Activity

---

## 1. Volume Profile

Volume Profile plots volume distributed across price levels (not time), showing where the most trading activity occurred.

### Key Concepts

**Point of Control (POC):** The single price level with the highest traded volume. Price gravitates toward POC; it acts as a magnet when price is nearby and as a strong support/resistance when price is away from it.

**Value Area (VA):** The price range containing 70% of all traded volume for the session/period. The boundaries are:
- **Value Area High (VAH):** Upper boundary of the value area
- **Value Area Low (VAL):** Lower boundary of the value area

**High Volume Nodes (HVN):** Wide horizontal bars — areas where heavy trading occurred. Price tends to slow down, consolidate, or reverse at HVNs. They offer strong support/resistance.

**Low Volume Nodes (LVN):** Narrow bars — price moved quickly through these areas with little trading. When price enters an LVN, it often moves rapidly to the next HVN. LVNs are "air pockets" in the market.

### Interpreting Value Area and POC

| Price Location | Implication |
|----------------|-------------|
| Price above VAH | Above value; market being priced aggressively by buyers |
| Price below VAL | Below value; sellers in control |
| Price inside VA | Fair value; expect rotation between VAH and VAL |
| Price at POC | Maximum equilibrium; expect chop or strong reaction |
| Price at HVN from prior session | Strong support/resistance; expect a pause |
| Price in LVN | Fast move expected to next HVN |

### Primary Trading Setups

**Setup 1 — Failed Auction Above VAH (Short)**
- Yesterday's price broke above VAH but failed to sustain (returned inside the Value Area)
- Today opens inside the VA
- Enter short; target POC → VAL
- Stop: above yesterday's VAH + $0.25

**Setup 2 — Value Area High / Low As Support (Long at VAH)**
- Price pulls back to VAH after having been above it
- VAH retest holds as support
- Enter long at VAH; target prior day's high or measured move
- Stop: below VAH − 0.5× ATR

**Setup 3 — POC as Magnet Trade**
- Price is in an LVN, away from POC
- No significant news or trend
- Enter in direction of POC; target POC
- Stop: outside the LVN (if price is clearly rejecting the move)

**Setup 4 — HVN Breakout / Breakdown**
- Price consolidates at an HVN for multiple sessions
- Strong volume burst breaks through the HVN level
- Enter on the breakout with stop just below/above the HVN
- Target: next LVN (fast move expected) then the HVN beyond it

### Session Types for Value Area Analysis
- **Balanced session:** VAH and VAL from prior session are respected; price rotates between them. Trade the range.
- **Trend session:** Price opens at VA edge and drives through it; don't fade — follow the trend
- **Spike session:** Price spikes beyond the VA in one direction then snaps back. Fade the spike once it re-enters the VA.

---

## 2. Footprint Charts (Order Flow)

Footprint charts show, at each price level, the number of contracts traded at the bid versus the ask — revealing the actual buying and selling pressure.

### Reading a Footprint Bar
Each candle is broken into rows (price levels). Each row shows:
```
[Bid volume] × [Ask volume]
(sell-side)    (buy-side)
```

- **Ask volume > Bid volume:** Buyers are more aggressive at this level
- **Bid volume > Ask volume:** Sellers are more aggressive
- **Large imbalance (3:1 or greater):** Signals aggressive one-side domination

### Delta
Delta = Total Buy Volume − Total Sell Volume for a given candle or period.
- **Positive delta (green):** Net buying pressure; buyers outpaced sellers
- **Negative delta (red):** Net selling pressure; sellers outpaced buyers
- **Delta divergence:** Price makes new high but delta is declining (buyers losing conviction) = potential reversal setup

### Key Footprint Patterns

**Absorption:**
- Large volume at the bid (sellers hitting) but price doesn't fall
- Buyers are absorbing every sell order at a specific level
- Signal: support is being established; anticipate a move up once absorption completes
- Trade: enter long as price breaks above the absorption level

**Buying/Selling Climax:**
- Extremely large bid or ask volume in a single bar with little price movement
- All the initiative came from one side but the other side absorbed it all
- Often marks a short-term reversal point

**Stacked Imbalances:**
- Three or more consecutive price levels all showing the same directional imbalance
- Bullish stack: 3+ rows in a candle all show ask volume dominating
- Bearish stack: 3+ rows all show bid volume dominating
- Signal: strong momentum in the direction of the imbalance; trade with it

**Unfinished Business (Unfinished Auction):**
- A candle's extreme (high or low) shows zero bid or zero ask volume — price never fully auctioned at that level
- Market is likely to return to that level to "finish" the auction
- Trade: when price approaches the level, expect either a rejection or a completion of the auction

### Delta Divergence Setup
1. Price makes a new high on the current candle
2. Delta (cumulative or per-candle) makes a lower high
3. Exit longs or enter short with confirmation candle close below prior support
(Mirror for bottoms: price new low + delta higher low = long entry)

---

## 3. Market Profile / TPO Charts

Market Profile uses time-price-opportunities (TPO) — each 30-minute segment marks which prices traded during that period.

### Key Concepts

**Initial Balance (IB):** The price range set in the first hour of trading (9:30–10:30 AM ET). The IB is the most important zone for the day.

**IB Rules:**
- If price stays in IB all day: balanced, low-conviction day; trade the range
- If price breaks above IB high with volume: trend day up; buy pullbacks, don't fade
- If price breaks below IB low: trend day down; sell rallies

**IB Range Size:**
- Narrow IB (< 0.5%): Expect a directional move; breakout is likely
- Wide IB (> 1.5%): Range already set; day less likely to trend further

### Day Types

| Day Type | Pattern | Strategy |
|----------|---------|---------|
| Trend Day | Opens at one extreme, closes at other; D-shaped profile | Trade with the trend; don't fade |
| Double Distribution | Two TPO "humps" — buyers and sellers disagree on value | Trade toward the current distribution's center |
| Neutral Day | Wide IB; price stays within it; bell-shaped profile | Trade the range; fade extremes |
| Normal Day | Price extends slightly beyond IB; P-shaped (up) or b-shaped (down) profile | Trade with the extension |

### Opening Types
- **Open-Drive:** Price gaps up/down and immediately moves away without looking back — trend day forming
- **Open-Test-Drive:** Price opens, tests prior value area edge, rejects, then drives — confirms trend direction
- **Open-Auction in Range:** Price opens in prior value area and auctions — balanced day likely
- **Open-Rejection-Reverse:** Price opens, drives one direction, fails to extend, reverses hard

---

## 4. Dark Pool Tracking

Dark pools are private exchanges where large institutional orders are executed without showing in public order books. They account for 30–40% of daily US equity volume.

### What Dark Pool Prints Tell You
Dark pool trades are reported to the tape but delayed. When a large dark pool print appears:
- A significant institutional order was executed
- The direction and price level tell you where institutions are active
- Large prints near support = institutional buying; near resistance = institutional selling

### Key Thresholds

| Print Size | Significance |
|------------|-------------|
| < $1M | Noise; ignore |
| $1M–$10M | Notable; watch for follow-through |
| $10M–$50M | Significant institutional activity |
| > $50M | Major institutional positioning |

**Dark pool level** = price at which the large print occurred = institutional cost basis = potential support/resistance

### Dark Pool Trading Strategies

**Strategy 1 — Dark Pool Support Trade:**
- Large dark pool print ($10M+) on a stock at or near a key technical support level
- Price respects the dark pool level (doesn't close below it)
- Enter long with stop below the dark pool print price
- Target: measured move equal to the stock's ATR × 3

**Strategy 2 — Dark Pool Momentum:**
- Dark pool print occurs while stock is already in an uptrend
- Print is at a price above the prior 5-day average (accumulation, not position building at lows)
- Enter long; confirmation that the institutional buying is continuing
- The "dark pool level" becomes your floor/stop reference

**Strategy 3 — Dark Pool Divergence:**
- Stock price is declining but dark pool shows large buy prints (> $10M) at progressively lower prices
- Indicates institutions are accumulating into weakness
- Enter long when price action shows a reversal pattern (hammer, VWAP reclaim)
- Stop: below the lowest dark pool print price in the series

### Limitations
- Dark pool data is delayed (not real-time)
- Cannot always determine if the print is a buy or sell (need price action confirmation)
- Large prints could also be internal crosses (not directional)
- Use dark pool data as a confirmation tool, not the primary signal

---

## 5. Unusual Options Activity (UOA)

Large, unusual options orders before a move can signal informed positioning. These aren't always insider trades (many are hedges, portfolio management, or sector bets) but statistically, large unusual orders precede significant moves more often than random chance.

### What Makes Activity "Unusual"

**Volume / Open Interest Ratio (Vol/OI):**
- Vol/OI > 1.0: More contracts traded today than exist in open interest → new positions being opened aggressively
- Vol/OI > 3.0: Very unusual; significant new positioning
- Vol/OI > 10.0: Extremely unusual; high-conviction trade

**Characteristics of noteworthy UOA:**
1. Volume > 10× the open interest
2. Single strike / single expiration (not a spread — directional bet)
3. OTM options (not hedges; speculative)
4. Near-term expiration (1–4 weeks): strong conviction with time urgency
5. Executed as "sweeps" (market orders across multiple exchanges) — urgency to fill immediately

### Sweep vs. Block

| Order Type | Meaning |
|------------|---------|
| **Block** | Single large order executed at one exchange; negotiated; often a hedge |
| **Sweep** | Order split across all exchanges simultaneously; buyer/seller wants to fill NOW |

**Sweeps are more bullish/bearish than blocks** because they indicate urgency — the trader doesn't want to wait for a negotiated fill.

### 5-Step UOA Scan Process

1. **Filter for high Vol/OI:** Look for strikes with Vol/OI > 5× and volume > 500 contracts
2. **Check if OTM:** ITM options are often hedges; OTM = directional speculation
3. **Check the expiration:** 1–4 weeks = near-term catalyst expected; > 2 months = less actionable
4. **Confirm sweep execution:** Look for multiple exchanges in the T&S for the option
5. **Check for technical confirmation:** Is the stock at a key level (breakout, support, VWAP)?

### Trading UOA
- Do NOT blindly follow every UOA alert (many are institutional hedges or have information you don't)
- Use UOA as a tier-1 confirming signal alongside your primary setup
- Buy calls/stock only if the UOA is bullish + your technical analysis agrees + there is a clear catalyst

**Entry timing:**
- Enter quickly if a large sweep appears and the stock is technically setting up (within 30 minutes)
- The institutional order already moved the stock somewhat; entering immediately captures the continuation

**Position sizing for UOA plays:**
- Small size (0.5–1% of account) — you don't know the full context
- Define max loss upfront; use the option premium as the natural stop (let it go to zero or take 50% stop)

**Stop:**
- If the option loses 50% of its value, exit — the thesis didn't play out as expected

### What to Ignore
- Put buying on ETFs (often portfolio hedges, not bearish signals)
- LEAPS activity (2+ years out; usually institutional hedging, not near-term directional)
- Call buying on dividend stocks near ex-dividend dates (likely covered call writes, not directional)
- Any activity that represents < 100 contracts (noise)
