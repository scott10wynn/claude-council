# Cryptocurrency Trading Strategies

Crypto markets trade 24/7, are less regulated, and have higher volatility than equities. Strategies that work in stocks require modification; some crypto-native patterns have no equity equivalent.

---

## 1. Bitcoin Halving Cycle

### What Is the Halving?
Every ~210,000 blocks (~4 years), Bitcoin's block reward is cut in half. This reduces the daily supply issuance. Historical halvings:
- **2012 (Nov):** 50 → 25 BTC/block
- **2016 (Jul):** 25 → 12.5 BTC/block
- **2020 (May):** 12.5 → 6.25 BTC/block
- **2024 (Apr):** 6.25 → 3.125 BTC/block

### Historical Performance Around Halvings

| Cycle | Pre-halving peak (−12 months) | Post-halving peak | Gain from halving to peak | Time to peak |
|-------|-------------------------------|-------------------|--------------------------|--------------|
| 2012–2013 | — | ~$1,150 | +8,000%+ | ~12 months |
| 2016–2017 | ~$700 | ~$19,800 | +2,800% | ~17 months |
| 2020–2021 | ~$10,000 | ~$69,000 | +600% | ~18 months |
| 2024–2025 | ~$73,000 (pre-halving ATH) | TBD | TBD | TBD |

**Diminishing returns are real:** Each cycle produces smaller percentage gains. A 10,000% gain in 2013 → 600% in 2021 → likely 200–400% in the current cycle.

### Cycle Framework

**Phase 1 — Accumulation (6–18 months pre-halving):**
- Price is 50–80% below prior ATH
- On-chain activity low; retail interest minimal
- MVRV Z-score below 0 (see Section 3)
- Strategy: accumulate with DCA; 12–18 month time horizon

**Phase 2 — Pre-Halving Run:**
- Market anticipates reduced supply; speculative buying begins
- Price often reaches or exceeds prior cycle's ATH before the halving itself
- Volume increases; retail interest begins recovering
- Strategy: hold and add on pullbacks; be cautious adding large new positions at prior ATH resistance

**Phase 3 — Post-Halving Bull Run (6–18 months post-halving):**
- Supply shock combines with demand; historically the longest gain phase
- Altcoins follow BTC's rise with larger percentage moves (see Section 2)
- RSI reaches 80–90 on weekly charts
- Strategy: ride the trend; use trailing stops; take partial profits at prior ATH and round numbers

**Phase 4 — Distribution and Bear Market:**
- MVRV Z-score above 7 (historically marks cycle tops)
- On-chain data shows long-term holders selling (LTH supply declining)
- Funding rates persistently positive (longs overextended)
- Strategy: reduce exposure in stages at cycle top signals; move to stablecoin positions

### Entry and Exit Signals
| Signal | Meaning | Action |
|--------|---------|--------|
| MVRV Z-score < 0 | Historically undervalued | Accumulate |
| MVRV Z-score 3–5 | Mid-cycle, still reasonable | Hold, reduce new buying |
| MVRV Z-score > 7 | Historically overvalued (top zone) | Begin systematic selling |
| Weekly RSI > 85 | Parabolic extension | Sell partial (20–30%) |
| BTC dominance declining sharply | Altcoin season starting | Rotate some BTC into alts |

### Risks
- **Regulatory risk:** ETF approvals, bans, and exchange collapses can override cycle patterns
- **Macro correlation:** 2022 showed BTC correlated with equities during Fed rate hikes — not immune to macro shocks
- **Diminishing returns:** Pattern exists, but magnitude is smaller each cycle; a 10x return is no longer guaranteed

---

## 2. Altcoin Season Rotation

### How It Works
Bitcoin leads every bull cycle. Altcoins lag initially, then outperform significantly (2–10× BTC's return) as the bull run matures and capital rotates down the risk curve.

### Bitcoin Dominance as the Signal
Bitcoin Dominance (BTC.D) = Bitcoin market cap / total crypto market cap.

| BTC.D Level | Condition | Strategy |
|-------------|-----------|---------|
| Rising above 60–65% | Capital flowing into BTC; alts underperforming | Hold BTC or BTC-heavy portfolio |
| Stable at 50–60% | Mixed signals | Monitor, small alt positions |
| Declining below 50% | Altcoin season beginning | Rotate into ETH, large caps, then mid/small caps |
| Below 40% | Deep altcoin season | Maximum alt exposure but watch for reversal |

### Four-Phase Rotation

**Phase 1 — BTC leads:**
- BTC makes new highs; alts are flat or falling in USD terms
- Buy BTC; avoid alts

**Phase 2 — ETH and large-cap alts follow:**
- ETH/BTC ratio bottoms and starts rising
- Rotate a portion into ETH and top-10 coins
- This phase produces 3–8× returns on ETH/SOL/BNB

**Phase 3 — Mid-cap rotation:**
- BTC.D declining; ETH performing, mid-cap protocols start moving
- DeFi, Layer 2s, and established gaming/NFT tokens
- Higher risk, higher potential return (5–20×)

**Phase 4 — Low-cap mania / "degen season":**
- Small caps with no fundamentals moving 100%+ in days
- Retail FOMO at maximum
- Extremely risky; exits must be planned before entry
- This phase ends quickly and violently

### Entry Confirmation (RSI + MACD method, historically 73–77% win rate)
On the **weekly chart** of the altcoin vs. BTC (not USD):
1. RSI(14) on weekly chart crosses above 50 (from below 40)
2. MACD(12/26/9) weekly histogram turns positive
3. BTC.D is declining
All three = high-probability altcoin entry

**Position sizing in alts:**
- Large-cap alts (ETH, SOL): up to 15% of crypto portfolio each
- Mid-cap (top 20–50): up to 5% each
- Small-cap: max 2% each; no more than 10% total small-cap exposure
- Never put more than 1% of total wealth into a single small-cap alt

### Risk Management for Alts
- Set a hard stop: if any alt falls 30% from your purchase price, exit — no exceptions
- Altcoins can fall 90%+ from peak to trough in bear markets (2022: ETH −80%, most alts −95%+)
- Take profits at 2×, 3×, 5× price targets; never hold to "zero or hero"

---

## 3. On-Chain Analysis

On-chain data is unique to crypto — no equivalent exists for stocks. It reveals what long-term holders, miners, and exchanges are actually doing.

### SOPR (Spent Output Profit Ratio)
Ratio of the price at which UTXOs were spent vs. the price they were created (i.e., what holders are making or losing when they sell).

| SOPR Value | Meaning | Signal |
|------------|---------|--------|
| > 1.0 | Coins being sold at a profit | Neutral to bearish (profit-taking) |
| = 1.0 | Break-even sells | Support level in bull markets |
| < 1.0 | Coins being sold at a loss | Capitulation; historically bullish (bottom signal) |

**Bull market rule:** In an uptrend, SOPR tends to bounce off 1.0 (holders refuse to sell below breakeven). When it dips to 1.0, it's a buy signal.
**Bear market rule:** In a downtrend, SOPR bounces below 1.0 — the bottom occurs when SOPR hits new lows and then recovers above 1.0.

### MVRV Z-Score
Compares Bitcoin's market cap to its "realized cap" (the aggregate cost basis of all coins) and normalizes by standard deviation.

```
MVRV Z-Score = (Market Cap − Realized Cap) / Std Dev(Market Cap)
```

| Z-Score | Zone | Action |
|---------|------|--------|
| < 0 | Historically deep value | Strong buy signal |
| 0–3 | Fair value range | Hold |
| 3–6 | Elevated; mid-to-late cycle | Begin trimming |
| > 7 | Historically overvalued | Sell aggressively (cycle top zone) |

**Historical tops:** 2013 peak: Z-score ~9; 2017 peak: ~8; 2021 peak: ~8. Every cycle top has triggered above 7.

### Exchange Flows
- **Coins flowing TO exchanges (positive exchange flow):** Holders preparing to sell. Large sustained inflows precede price drops.
- **Coins flowing FROM exchanges (negative exchange flow):** Holders moving to cold storage. Long-term positive signal — less sell pressure.
- **Exchange reserves declining:** Bullish — supply available to sell is decreasing.
- **Exchange reserves rising:** Bearish — more coins sitting ready to sell.

**Key metric:** When exchange outflows are large and sustained during a price dip, it signals conviction buying — not panic selling.

### NVT Ratio (Network Value to Transactions)
Equivalent of a P/E ratio for Bitcoin.
```
NVT = Market Cap / Daily Transaction Volume (USD)
```
- High NVT: Market cap not justified by economic activity (overvalued)
- Low NVT: Network activity high relative to market cap (undervalued)
- NVT Signal (90-day MA): smoothed version; more reliable signal

### Hash Rate and Miner Behavior
- **Hash rate rising:** Miners investing capital in infrastructure; confident in long-term price
- **Hash rate declining after BTC price drop:** Miners unplugging unprofitable machines
- **Miner outflows high:** Miners selling coins to cover operating costs (selling pressure)
- **Miner capitulation:** Mass miner shutdowns followed by hash rate recovery = historically strong buy signal

---

## 4. Funding Rate Arbitrage / Perpetual Futures

### Perpetual Futures
Crypto perpetual futures ("perps") have no expiration date. They track the spot price via a **funding rate** mechanism: longs pay shorts (or vice versa) every 8 hours based on the premium/discount to spot.

### Funding Rate
- **Positive funding (+):** Longs outnumber shorts; bulls paying to hold long positions
- **Negative funding (−):** Shorts paying longs; bearish positioning dominant

**Typical range:** −0.05% to +0.10% per 8 hours; extreme levels: above +0.15% or below −0.10%

### Funding Rate as a Sentiment Indicator

| Funding Rate | Condition | Signal |
|-------------|-----------|--------|
| Persistently > +0.10% per 8h | Extreme long crowding | Bearish contrarian signal; potential long squeeze |
| Consistently positive for weeks | Healthy bull market | Neutral; trend likely continues |
| 0 or slightly negative | Neutral | No edge |
| Persistently < −0.05% per 8h | Extreme short crowding | Bullish contrarian signal; potential short squeeze |
| Very negative during crashes | Capitulation shorting | High-probability long entry |

### Cash-and-Carry Arbitrage
**Setup:** Buy spot BTC/ETH + sell equivalent amount in perpetual futures = market-neutral position collecting funding payments.

```
Example: BTC at $100,000 spot
→ Buy $10,000 BTC on spot exchange
→ Short $10,000 BTC on perp futures exchange
→ If funding rate = +0.05%/8h = 0.15%/day = ~54%/year APY
→ Position earns funding every 8 hours; delta-neutral (spot exposure hedged)
```

**Risks:**
- Funding rate can flip negative (you'd pay instead of earn)
- Exchange risk (counterparty risk on the futures side)
- Margin calls during extreme volatility if exchanges are different
- Liquidation risk if the hedge unwinds at the wrong time

**Practical use:** Rates above 0.10% per 8 hours are worth running; below 0.05% the risk/reward is marginal.

### Liquidation Hunting
When BTC/ETH moves sharply in one direction, leveraged positions on the opposite side get liquidated automatically. These liquidation cascades amplify moves.

**Check:** Liquidation heatmaps (Coinglass) show clustered liquidation levels above and below price. When price approaches a large cluster:
- A sudden spike through the cluster often reverses quickly (the cascade was the fuel)
- Don't chase the spike; wait for the reversal as liquidation pressure exhausts

### Perpetual vs. Spot Trading Rules
- Never use more than 3× leverage for swing trades; 5× absolute maximum for scalps
- Set stop losses before entering any leveraged position — no exceptions
- In crypto, a 20% adverse move can happen in hours (no circuit breakers)
- Isolated margin > cross margin for risk management (limits loss to position, not entire account)

---

## Risk Management Summary for Crypto

1. **Portfolio sizing:** No more than 10–20% of total investable assets in crypto (given volatility)
2. **Per-position limits:** Max 5% of crypto portfolio in any single alt; 40–60% in BTC/ETH as stable core
3. **Stop losses mandatory:** All leveraged positions; for spot positions, predefined exit if thesis breaks
4. **Hardware wallet:** Move long-term holdings off exchanges (not your keys, not your coins)
5. **Exchange diversification:** Never keep more than 30% of crypto holdings on any single exchange
6. **Tax tracking:** Every trade is a taxable event in most jurisdictions; use dedicated crypto tax software
7. **Scam awareness:** Unsolicited DMs offering alpha, yield, or recovery services are all scams without exception
