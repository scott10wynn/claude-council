# Options & Fundamental Strategies

---

## 1. Covered Calls — Income on Existing Positions

Sell a call option against 100 shares you already own. You collect premium immediately; in exchange your upside is capped at the strike price until expiration.

### Setup Rules

**Strike Selection**
- Target delta **0.25–0.35** (25–35% probability of assignment) for income-focused use
- Aggressive income: delta 0.40–0.50 (higher premium, higher assignment risk)
- Only sell a strike you'd genuinely be comfortable selling your shares at

**Time to Expiration (DTE)**
- Optimal entry: **45 DTE** (steepest theta decay curve)
- Acceptable range: 30–60 DTE
- Avoid weeklies (0–7 DTE) unless experienced — gamma risk is high in final days
- Stagger expirations: limit same-expiration positions to 2–3 maximum

**Ideal Entry Conditions**
- Neutral-to-mildly-bullish outlook
- IV Rank above 30 (elevated IV = richer premiums)
- Stock is range-bound or consolidating
- No earnings, FDA, or merger catalyst inside expiration window

### Exit Criteria
- **Profit target:** Close at **50% of max profit** — set as a GTC order at entry; the last 50% takes disproportionate time and carries reversal risk
- **Roll up and out:** If stock rallies sharply and call goes deep ITM, roll to higher strike and later expiration for a net credit. Stop rolling if: (a) you can only roll for a debit, (b) you've rolled multiple times without resolution

### Risk Management
- Never write calls on 100% of your position — keep some shares unencumbered
- Do not write calls immediately after a sharp selloff — wait for partial recovery first (IV spike traps capped position into the rebound)
- Once assigned, don't immediately repurchase at higher prices — sell cash-secured puts to re-enter at lower cost

### Common Mistakes
- Writing calls on 100% of holdings
- Chasing premium after selloffs
- Stacking all expirations on the same date
- Ignoring earnings calendars
- Rolling indefinitely instead of accepting assignment

---

## 2. Cash-Secured Puts — Buying Stock at a Discount

Sell a put option while holding enough cash to buy 100 shares if assigned. Collect premium now; if assigned, your effective cost basis = strike price minus premium received.

### Setup Rules

**Stock Selection**
- Daily trading volume above 1 million shares
- Bid-ask spread on ATM options ≤ $0.05
- You would genuinely want to own this stock for 2+ years if assigned
- Avoid: biotechs pending binary events, meme stocks, anything you wouldn't hold through a 30% drawdown

**Strike Selection**
- **4–5% OTM:** ~15–20% assignment probability (recommended starting range)
- **2% OTM:** ~5% assignment probability (conservative)
- **7% OTM:** ~30% assignment probability (aggressive)
- Hard rule: never sell a put below a price where you wouldn't also place a buy limit order

**DTE by Account Size**
| DTE | Target Return | Best Account Size |
|-----|--------------|-------------------|
| 0–7 days (weekly) | 0.3–0.8%/week | $5K–$25K |
| 21–30 days (monthly) | 1–2%/month | $25K–$100K |
| 30–60 days | 2–4% per trade | $75K+ |

**Premium Minimums**
- 7-day puts: at least $0.20/share ($20/contract)
- 30-day puts: at least 1% of reserved capital
- 60-day puts: at least 2.5% of reserved capital

### Exit Criteria
- **Profit target:** Close at **50% of max profit**
- **Stop-loss:** Close or roll if position reaches **2× premium received** (100% loss on trade)
- **Assignment:** Accept if conviction on stock remains intact; follow up with covered calls to reduce cost further

### Risk Management
- Single position cap: no more than **5% of total portfolio** at risk per put
- Capital reservation: no single put requiring more than **20–25% of total account value**
- Maintain $10K–$15K free per $60K deployed for rolling flexibility
- No correlated puts simultaneously (e.g., multiple big-tech names)
- Limit assignment probability to **30% or below**

### Common Mistakes
- Premium-chasing on low-quality stocks
- Ignoring earnings dates inside expiration windows
- Over-concentration — more than 25% of capital reserved for a single put
- Trading heavily when VIX is below 15 (premiums shrink, risk/reward deteriorates)

---

## 3. Bull Call Spread

Buy a call at a lower strike + sell a call at a higher strike (same expiration). Net debit. Profit is capped; loss is capped at the debit paid.

**Mechanics:**
- Max loss = net debit paid
- Max profit = (spread width − net debit) × 100
- Breakeven = long call strike + net debit paid
- Example: Buy $100 call, sell $105 call, pay $3 → breakeven $103, max profit $200, max loss $300

### Setup Rules

**Strike Selection**
- Long call (buy): delta **0.50–0.60** (approximately ATM)
- Short call (sell): delta **0.20–0.35** (3–7% OTM)
- Spread width: $5–$10 wide on $100–$300 stocks

**Time to Expiration**
- Optimal: **30–45 DTE**
- Minimum: at least 4 weeks — never enter with only days to expiration

**IV Conditions**
- Enter when IV Rank is **below 30–40** (low IV = cheaper premiums to buy)
- Avoid entering ahead of earnings unless specifically trading that event

### Exit Criteria
- **Profit target:** Close at **50–80% of max profit**; if 80% max profit available with 2+ weeks remaining, close it
- **Loss limit:** Close if spread loses **50% of net debit**
- **Time exit:** Close any position with less than **5–7 days to expiration**
- **Never leg out** — close both legs simultaneously

### Common Mistakes
- Mismatched spread width vs. price target
- Buying both legs deep OTM (needs huge move just to break even)
- Holding through binary events
- Too-short expiration

---

## 4. Value Investing

### Benjamin Graham — Deep Value (Quantitative)

| Criterion | Threshold |
|-----------|-----------|
| P/E ratio | Below 9.0 (strict screen); below 15 (defensive) |
| P/B ratio | Below 1.20 (strict); below 1.5 (defensive) |
| P/E × P/B combined | Must be under 22.5 |
| Current ratio | Above 1.5 |
| Total debt / current assets | Below 1.10 |
| EPS history | Positive for each of the past 5 years |
| Dividends | Currently paying |
| Graham Number | Buy only when stock trades below √(22.5 × EPS × Book Value Per Share) |

### Warren Buffett — Quality Value

| Metric | Threshold |
|--------|-----------|
| Return on Equity (ROE) | Consistently above 15% over 10+ years |
| Debt-to-Equity | Below 0.5 |
| Net profit margin | Above 15–20% |
| Free cash flow | Positive over 10+ years across cycles |
| Gross margin | Above 40% (signals pricing power) |
| Earnings consistency | Steady growth over 10 years minimum |
| Intrinsic value discount | Buy at 25–50% below calculated intrinsic value |

### Economic Moat — 5 Types

1. **Brand** — pricing power through psychological loyalty (Coca-Cola, Apple)
2. **Network effects** — each new user makes the product more valuable (Visa, Meta)
3. **Switching costs** — customers locked in by complexity or data (Oracle, Salesforce)
4. **Cost advantage** — structurally lower costs than competitors (Costco, Walmart)
5. **Efficient scale / regulatory moat** — barriers prevent new entrants (utilities, railroads)

### Entry Criteria
- 25–50% discount to intrinsic value
- ROE above 15% for 10 consecutive years
- No earnings deficits in the last 5–10 years
- Debt-to-equity below 0.5
- You can explain the moat in one sentence

### Common Mistakes
- **Value traps** — cheap stocks are sometimes cheap for permanent reasons; investigate *why* before buying
- Ignoring the moat — Graham-style statistical cheapness without moat analysis catches dying companies
- Averaging down into deteriorating businesses
- Impatience — value investments routinely require 2–5 years to realize

---

## 5. CANSLIM — Growth Investing (William O'Neil)

CANSLIM is derived from a study of every major stock market winner from 1953 onward. It combines fundamental acceleration with technical breakout entry rules.

### The Seven Criteria

**C — Current Quarterly Earnings**
- Minimum: **25% YoY EPS increase** in latest quarter vs. same quarter prior year
- Strong signal: acceleration across recent quarters (15% → 30% → 50%)
- Warning: decelerating EPS growth is a red flag even if still positive

**A — Annual Earnings Growth**
- Minimum: **25%+ EPS growth** in each of the past 3–5 years
- ROE of at least **17%**

**N — New: Product, Service, Management, or Price High**
- Company must have a specific catalyst (new product, breakthrough tech, new management)
- Technical confirmation: new 52-week high on heavy volume after consolidation

**S — Supply and Demand**
- Prefer smaller floats (move faster on institutional buying)
- Breakout volume: at least **40–50% above average daily volume** (100%+ surge is ideal)

**L — Leader, Not Laggard**
- RS Rating minimum: **80 or above** (outperforming 80% of all stocks)
- Focus on stocks in top 20% of their industry group
- ~37% of a stock's price movement is tied to its industry group — always check the sector is leading

**I — Institutional Sponsorship**
- Rising number of institutional shareholders QoQ
- Avoid over-owned stocks (2,000+ institutions) — limited room for new buyers
- Accumulation/Distribution Rating: A or B = institutional accumulation

**M — Market Direction (most important)**
- Only buy in a **confirmed uptrend**
- **Distribution day rule:** 4–5 distribution days (index falls on higher volume) in a few weeks = market top signal; reduce/close positions
- **Follow-through day:** strong rally on heavy volume on Day 4+ of an attempted rally = new uptrend beginning; green light to re-enter

### Entry Rules — Buy Points

**Base patterns:**
- **Cup with handle:** U-shaped consolidation 7+ weeks. Buy point = top of handle + $0.10
- **Flat base:** 5+ weeks, price corrects ≤10–15%. Buy point = top of base + $0.10
- **Double bottom:** W-shaped. Buy point = top of middle peak + $0.10

**Execution rules:**
- Purchase within **5% above the buy point** — never chase stocks 10%+ past the pivot
- Breakout **must occur on volume 40–50%+ above average**
- Start with half your intended position; pyramid in as the stock proves itself
- Only enter when market is in a confirmed uptrend (M criterion)

### Exit Rules

**Stop-loss (non-negotiable):**
- Cut losses at **7–8% below your buy point**, always, no exceptions
- "Three out of four stocks that trigger this stop never recover to the buy point"

**Profit targets:**
- Take gains when stock is **up 20–25% from buy point** (stocks typically consolidate here)
- Exception: if stock gains **20% within 3 weeks** of breakout, hold at least 8 weeks — signals exceptional momentum

**Climax top warning signs (sell immediately):**
- Largest single-day point gain since the move began
- Gap up on massive volume after extended advance
- Parabolic acceleration above the 200-day MA

### Risk Management
- Ideal portfolio: **4–8 positions** — concentration in best ideas
- Never average down — CANSLIM is a momentum system
- Move to cash during market corrections

### Common Mistakes
- Buying pullbacks instead of breakouts — CANSLIM buys *strength*
- Seeking cheap/low P/E stocks — the system explicitly rejects value criteria; leaders trade at premium multiples
- Ignoring market direction
- Holding losers past the 7–8% stop
- Selling winners too early (averaging 20–25% gains while letting losers grow past 7%)

---

## Quick Reference

| Strategy | Capital Needed | Bias | Hold | Max Loss | Best When |
|----------|---------------|------|------|----------|-----------|
| Covered Calls | Own 100+ shares | Neutral-bullish | 30–45 days/cycle | Premium offsets stock decline | Sideways, IV Rank > 30 |
| Cash-Secured Puts | Full cash for assignment | Neutral-bullish | 7–30 days/cycle | Strike price minus premium | IV Rank > 30–50 |
| Bull Call Spread | Net debit only | Moderately bullish | 30–45 days | Net debit paid | Low IV, uptrend |
| Value Investing | Full equity | Long-term bullish | 2–10 years | Full position | Buy during fear |
| CANSLIM | Full equity | Strongly bullish | Weeks–months | 7–8% hard stop | Bull market only |
