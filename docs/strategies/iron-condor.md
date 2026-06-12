# Iron Condor Options Strategy

Four-leg, defined-risk strategy: bull put spread + bear call spread on same underlying, same expiration. Collect a net credit at entry; profit if the underlying stays between your two short strikes through expiration. Risk is capped on both sides by the long wings.

---

## Setup Structure

| Parameter | Specification |
|-----------|--------------|
| Legs | Long put < short put < short call < long call |
| Direction bias | Market-neutral; strikes equidistant from price for zero delta at entry |
| Credit target | Collect **25–33% of the spread width** as net credit |
| Spread width | $5–10 for stocks; $5–15 for indices; widen as VIX rises (see below) |

**Wing Width Scaling by VIX (SPY):**

| VIX | Wing Width | Max Loss/Contract |
|-----|------------|-------------------|
| 12–18 | 5 pts ($500) | $300–$400 |
| 18–25 | 7–10 pts | $400–$700 |
| 25–35 | 10–15 pts | $600–$1,100 |
| 35+ | 15–20 pts | $1,000–$1,600 |

---

## When to Enter: IV Rank Thresholds

- **Minimum:** IV Rank ≥ 50
- **Strong:** IV Rank ≥ 70
- **Sweet spot:** IV Rank 40–75
- **Do not enter on the day of a VIX spike** — wait 3–7 trading days after while IV remains elevated but directional panic has subsided; look for a VIX "lower high"
- **Never enter when** earnings, FOMC, or binary catalyst falls inside the trade's life

At VIX 14, a typical SPY iron condor collects $1.50–$2.00. At VIX 30, the same structure collects $3.50–$5.00.

---

## Strike Selection: Delta Values

| Short Strike Delta | Probability of Profit | Character |
|-------------------|----------------------|-----------|
| 10 delta | 80–85% | Very safe; thin credit |
| **16 delta** | **84–90%** | **Optimal balance (1 std dev)** |
| 20–25 delta | 75–80% | Decent credit; common start |
| 30 delta | 65–70% | Rich credit; breaches too often |

**Delta scaling by VIX:**
- VIX 12–18 → 16-delta short strikes
- VIX 18–25 → 12–16 delta
- VIX 25–35 → 10–14 delta
- VIX 35+ → 8–12 delta or stand aside

---

## Time to Expiration (DTE)

- **Optimal entry:** 30–45 DTE (steepest theta decay curve)
- **Hard time stop:** Close at **21 DTE regardless of P&L** — inside 21 days gamma accelerates sharply, turning profitable trades into losers fast
- **Emergency close:** 7 DTE at the absolute latest

---

## P&L Formulas

```
Max Profit    = Net credit received × 100 per contract
Max Loss      = (Spread width − net credit) × 100
Upper BE      = Short call strike + net credit
Lower BE      = Short put strike − net credit
```

Example: 5-wide spread, $1.50 net credit → Max profit $150, max loss $350, BE at short call + $1.50 and short put − $1.50.

---

## Greeks to Watch

| Greek | Position Characteristic | Implication |
|-------|------------------------|-------------|
| Delta | Near zero at entry | Market-neutral; re-evaluate if short strike delta drifts past ±0.10 |
| Theta | Positive (~+$15/day for SPY) | Time works in your favor |
| Vega | Negative (~−25 for SPY) | IV expansion hurts; IV contraction profits — primary risk in high-IV entries |
| Gamma | Negative | Delta shifts against you on sharp moves; accelerates dangerously inside 21 DTE |

**Monitoring rule:** Adjustment warranted when threatened short strike delta reaches **0.25–0.30**. At **0.35**, you're already late.

---

## Exit Rules

**Close whichever trigger comes first:**

1. **50% of max profit** — set as a GTC order at trade entry. A $3.00 credit condor closes at $1.50 debit.
2. **21 DTE** — close regardless of P&L.

**Profit target win rate comparison:**

| Target | Win Rate | Avg Hold |
|--------|----------|----------|
| 25% of max | ~85% | 5–10 days |
| **50% of max** | **~80%** | **10–20 days ← recommended** |
| 75% of max | ~70% | 15–25 days |
| Hold to expiration | 55–60% | Full cycle |

**Loss limit:** Close when losses reach **200% of credit received** (2× stop). If you collected $1.50, exit when it costs $3.00 to close. At 21 DTE with a loss, close unconditionally.

---

## Managing the Tested Side

**Adjustment triggers:**
- Price closes within **3% of the short strike**
- Short strike delta reaches **0.25** (adjust) → **0.35** (last chance)

**Tactic 1 — Roll the Untested Side (Offensive):** Move the profitable, unthreatened spread closer to current price for additional credit. Offsets losses on tested side. Always do for a **net credit**.

**Tactic 2 — Roll the Threatened Side (Defensive):** Move at-risk spread further OTM for breathing room. Expect net debit or small credit.

**Tactic 3 — Roll Out in Time:** Close current expiration, reopen same/adjusted strikes in further expiration. Only if original range thesis still holds. Widen spread width on the roll.

**Tactic 4 — Convert to Iron Butterfly:** Move untested short strike to match tested one (both ATM). Last-resort repair — collects significant credit but narrows profit zone.

**Tactic 5 — Buy Back Threatened Side:** Close only the losing spread; keep profitable spread as standalone credit spread.

**Rolling rule:** Always try to roll for a **net credit**. If you cannot, consider closing the entire position.

---

## Position Sizing

- Risk no more than **2–5% of account value** per iron condor
- In high volatility (VIX > 25): reduce position size by **30–50%**
- Maximum portfolio allocation: **20–30%** of buying power normally; **10–15%** when VIX > 25
- Capital required per contract: ~$500–$2,000 depending on spread width

---

## Common Mistakes

1. **Chasing premium by moving strikes ATM** — stick to 15–20 delta even if premium seems thin
2. **Entering on the day of a VIX spike** — wait 3–7 days after
3. **Holding to expiration** — always close by 21 DTE
4. **Ignoring binary events** (earnings, FOMC) inside the trade's life
5. **Emotional adjustments** — adjust based on delta levels, not fear
6. **Not sizing down in high volatility** — widen spreads AND reduce contracts in high VIX
7. **Rolling a broken condor hoping for recovery** — take the defined loss and redeploy
8. **One-size-fits-all structure** — delta, wing width, and sizing must all scale with VIX
