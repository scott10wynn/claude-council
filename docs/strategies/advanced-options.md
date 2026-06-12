# Advanced Options Strategies

---

## 1. Straddle & Strangle

### Long Straddle
Buy one ATM call + one ATM put, same strike, same expiration. Profit if the underlying moves significantly in either direction.

**Setup:**
- Strike: ATM (same for both legs)
- DTE: 30–60 days (more time = more room for the move to develop)
- Enter when IV Rank is **below 30** — cheap volatility is the edge
- Best timing: before a known catalyst (earnings, FDA decision, FOMC) **when IV hasn't priced in the expected move**

**P&L:**
```
Max loss    = total premium paid (both legs)
Breakeven U = strike + total premium
Breakeven D = strike − total premium
Profit      = unlimited (upside), strike minus zero minus premium (downside)
```

**Exit rules:**
- Close at **100–200% of premium paid** (double or triple the money)
- Cut loss at **50% of premium paid**
- Always close before the final week — gamma makes the position extremely sensitive and the move may not follow through

**When it works:** Underestimated binary events, post-consolidation breakouts, earnings beats/misses larger than the implied move

**When it fails:** IV crush after the catalyst (pays for a $10 move; stock moves $8; still loses money because IV collapses 50%)

---

### Long Strangle
Buy OTM call + OTM put, different strikes, same expiration. Cheaper than a straddle; requires a larger move to profit.

**Setup:**
- Call delta: 0.20–0.30 (typically 5–10% OTM)
- Put delta: −0.20 to −0.30 (same OTM level below)
- DTE: 30–60 days
- Cost is 30–50% less than a straddle; breakevens are wider

**Strike choice rule:** Set strikes just outside the expected move implied by options pricing (the 1-standard-deviation range).

**Exit:** Same as straddle — take 100% profit or cut at 50% loss.

---

### Short Straddle / Short Strangle
Sell both legs instead of buying. Collect premium; profit if the underlying stays between breakevens through expiration.

**Short straddle:** Maximum premium, maximum gamma risk — only for experienced traders.
**Short strangle (preferred):** Sell OTM call + OTM put at 1-standard-deviation strikes (16 delta each).

**Entry conditions:**
- IV Rank ≥ 50 (selling expensive volatility)
- No binary events inside expiration
- 30–45 DTE

**Management (identical to iron condor):**
- Close at 50% of max credit
- Close by 21 DTE
- Stop loss: 2× credit received
- Defined risk: consider iron condor (adding long wings) instead, especially in high-VIX environments

---

## 2. Butterfly Spread

### Long Call Butterfly
Buy 1 ITM call + sell 2 ATM calls + buy 1 OTM call. All same expiration. Net debit. Maximum profit if price lands exactly at the middle (body) strike at expiration.

```
Structure:  Buy lower strike call
            Sell 2× middle strike calls
            Buy upper strike call
Wing width: equal distance between strikes (e.g., 5 pts each side)
```

**P&L:**
```
Max profit = wing width − net debit (realized if price = middle strike at expiration)
Max loss   = net debit paid
```

**Setup rules:**
- Middle strike: ATM or slightly OTM in direction of expected move
- Wing width: $5–$10 for stocks under $200; $10–$25 for indices
- DTE: 25–35 days at entry; close with 7–10 days remaining
- Enter when IV is **low** (long premium spread; benefits from IV expansion)
- Best for range-bound, low-volatility environments

**Exit:** Take 25–50% of max profit; close at 7 DTE.

---

### Iron Butterfly (Short Butterfly)
Sell ATM call + sell ATM put + buy OTM call + buy OTM put. Combines a short straddle with long wings for defined risk.

- Collects maximum credit of all condor/butterfly structures
- Profit zone is narrowest — stock must stay very close to ATM strikes
- Treat like an iron condor with a very tight center
- Apply all iron condor management rules (21 DTE close, 50% profit target)

---

## 3. Calendar Spread (Time Spread / Horizontal Spread)

Sell a near-term option + buy a far-term option at the **same strike**. Net debit. Profits from the near-term option decaying faster than the far-term option (time decay differential).

### Long Calendar (Sell front, Buy back)
**Setup:**
- Strike: ATM for maximum theta differential
- Front month: 15–30 DTE (sell this)
- Back month: 60–90 DTE (buy this)
- Net debit: typically 30–50% of back-month premium

**P&L:**
- Maximum profit: price at the strike on the front expiration date
- Risk: back month loses value faster than expected; IV divergence between months

**Entry conditions:**
- IV Rank **low to moderate** (20–40) — want front-month IV to rise (benefits the sold near option)
- Or: IV term structure is steep (near-term IV >> far-term IV) → short the expensive near-month

**Exit:** Close when front-month expires (roll or take profit); target 25–50% of debit paid

**Key risk:** Vega mismatch. If IV collapses across all months, both legs lose, and the long back-month loses more in dollar terms.

---

### Diagonal Spread
Same structure as a calendar but the strikes are **different** (typically sell OTM near month, buy ATM or slightly OTM far month). Combines time spread with directional bias. Lower cost, wider profit zone than a pure calendar.

---

## 4. Wheel Strategy

Systematically sell cash-secured puts; if assigned, sell covered calls; repeat.

### The Cycle
```
Step 1: Sell cash-secured put on stock you want to own
        → If expires worthless: collect premium, restart
        → If assigned: receive shares at strike minus premium (your net cost)

Step 2: Sell covered call on assigned shares
        → If expires worthless: collect premium, sell another call
        → If called away: shares sold at strike; collect premium + appreciation
        → Restart from Step 1
```

### Stock Selection (Critical)
The wheel only works on stocks you genuinely want to own through a 30–50% drawdown:
- Market cap > $5B (established companies)
- Options volume high (tight bid-ask spreads)
- Business generates free cash flow
- You understand what the company does
- IV Rank consistently 30–60 (generates decent premiums without being a disaster risk)

**Do not wheel:**
- Biotechs or clinical-stage companies
- Meme stocks (GME, AMC)
- Commodity/mining companies with volatile cash flows
- Anything where you'd panic-sell if down 40%

### Entry Rules
- **CSP strike:** 5–10% OTM; delta 0.20–0.30
- **DTE:** 21–45 days
- **Covered call strike:** 5–10% OTM or at your cost basis (ensure you'd be happy selling)
- Never sell covered calls below your cost basis (locks in a loss)

### Returns and Expectations
- Monthly premium from CSPs: 1–3% of reserved capital
- Annual return target: 12–30% on the capital reserved for assignment
- In flat/slightly bullish markets: best performance
- In bear markets: the wheel amplifies losses by continuously buying falling stocks

### Common Mistakes
- Wheeling on low-quality stocks for higher premiums
- Not accounting for the capital locked up waiting for assignment
- Selling covered calls too close to ATM and getting called away below cost basis
- Continuing to wheel on a stock that's fundamentally broken

---

## 5. LEAPS (Long-Term Equity Anticipation Securities)

Options with expirations greater than one year (typically 1–2.5 years out).

### Uses

**1. Stock Replacement (Poor Man's Covered Call)**
Buy deep ITM LEAPS call (delta 0.70–0.90) instead of 100 shares.
- Costs 30–50% of owning the shares
- Acts like owning shares but with defined downside
- Sell shorter-dated OTM calls against it monthly (creating a "poor man's covered call")
- Target: LEAPS cost < 20% of owning equivalent shares

**Setup for PMCC:**
- Buy: 1–2 year LEAPS, delta 0.70–0.90, deep ITM
- Sell: Monthly 30–45 DTE call, delta 0.20–0.30, must be higher strike than the LEAPS
- Critical rule: never sell a call at a strike lower than the LEAPS purchase price + debit paid

**2. Long-Term Directional Bet**
Buy 1-2 year ATM or slightly OTM LEAPS call on a stock with strong conviction and defined catalyst.

- Delta: 0.50–0.60 (ATM)
- Enter when IV Rank is below 30 (cheap long premium)
- Benefit from delta appreciation + vega expansion + time (not working against you for months)
- Target 100–300% return; stop at 50% of premium paid
- Sell 3–6 months before expiration (theta starts accelerating)

**3. Hedging**
Buy 1-year LEAPS puts on SPY or your largest position to hedge tail risk at low annual cost.
- 5–10% OTM puts = "portfolio insurance"
- Cost typically 1–3% of portfolio per year
- Roll annually; accept these expire worthless most years as the cost of insurance

### LEAPS vs. Short-Dated Options
| Feature | LEAPS | Short-Dated |
|---------|-------|-------------|
| Theta decay | Very slow initially | Fast, accelerating |
| Vega sensitivity | Very high | Lower |
| Leverage | Moderate | High |
| Capital required | Higher | Lower |
| Time to be right | Months-years | Days-weeks |

---

## 6. IV Rank and IV Percentile

### IV Rank (IVR)
```
IVR = (Current IV − 52-week IV Low) / (52-week IV High − 52-week IV Low) × 100
```
- IVR 0 = IV at its 52-week low
- IVR 100 = IV at its 52-week high
- **Sell premium when IVR > 50; buy premium when IVR < 20**
- Weakness: heavily influenced by a single IV spike (one outlier shifts the entire scale)

### IV Percentile (IVP)
Percentage of days in the past year where IV was lower than today.
- IVP 80 = IV higher than 80% of all days in the past year
- More stable than IVR; not distorted by outliers
- **Prefer IVP for strategy selection over IVR**

### Strategy Selection Matrix
| IVR/IVP | Strategy |
|---------|----------|
| > 50 | Iron condor, short strangle, covered calls, CSPs, calendar spread (sell near) |
| 30–50 | Bull/bear vertical spreads, diagonals |
| < 30 | Long straddle/strangle, LEAPS, debit spreads, calendar spread (buy) |

---

## 7. Greeks Management

### Delta
- Measures option's price change per $1 move in the underlying
- Portfolio delta = sum of all position deltas; target near-zero for neutral book
- Delta-hedge by adding offsetting positions or adjusting underlying

### Gamma
- Rate of change of delta; highest for ATM options near expiration
- Gamma risk explodes inside 21 DTE — accelerates both gains and losses
- **Rule:** Close or manage positions before gamma becomes dominant (21 DTE rule)

### Theta
- Time decay per day; works for option sellers, against option buyers
- Theta accelerates in the final 30 days; exponential inside 7 days
- Selling premium at 30–45 DTE captures steepest portion of the decay curve

### Vega
- Price change per 1-point move in IV
- Long premium (straddle, LEAPS): positive vega — benefits from IV expansion
- Short premium (condor, CSP, covered call): negative vega — benefits from IV contraction
- At entry, know your vega exposure and monitor IV changes actively

### Rho
- Sensitivity to interest rate changes
- Relevant mostly for LEAPS; higher rates → calls more valuable, puts less valuable
- Can ignore for short-dated positions

---

## 8. Options Risk Management Rules

1. **21 DTE Rule:** Close all short premium positions by 21 DTE regardless of P&L
2. **50% Profit Target:** Close when 50% of max credit received; set as GTC at entry
3. **2× Stop Loss:** Exit when position costs 2× credit received to close
4. **No Earnings Inside Expiration:** Always check earnings calendar before entering any position
5. **Liquidity First:** Only trade options with open interest > 500 and bid-ask spread < $0.10 per contract
6. **Assignment Risk:** Watch for ex-dividend dates on short calls (early assignment risk if ITM); roll or close before ex-div
7. **Rolling Rules:** Roll for net credit only; if you can only roll for a debit, close instead
8. **Portfolio Vega Limit:** Total portfolio vega should not exceed 1% of account value (prevents a single IV spike from blowing up multiple positions)
9. **Correlation:** Do not hold more than 3 short-premium positions in correlated sectors simultaneously
10. **Size Limit:** No single options position > 5% of account equity; total short premium < 25% of buying power

---

## Quick Reference

| Strategy | IV Rank | DTE | Max Loss | Best Market |
|----------|---------|-----|----------|-------------|
| Long straddle | < 30 | 30–60 | Premium paid | Pre-catalyst |
| Long strangle | < 30 | 30–60 | Premium paid | Pre-catalyst |
| Short strangle | > 50 | 30–45 | Unlimited (use wings) | Rangebound, high IV |
| Long butterfly | < 30 | 25–35 | Net debit | Rangebound, low IV |
| Iron butterfly | > 50 | 30–45 | Wing width − credit | Rangebound, high IV |
| Calendar spread | Low-mod | Sell 15–30 / Buy 60–90 | Net debit | Neutral, rising near IV |
| Wheel | 30–60 | 21–45 | Assignment cost | Sideways to bullish |
| LEAPS (long) | < 30 | 365–730 | Premium paid | Long-term bull |
| PMCC | Any | LEAPS + monthly | LEAPS cost | Sideways to bullish |
