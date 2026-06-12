# Trading Strategy & Risk Management Rules

These rules are enforced by the `/trade` command and apply to every order. The goal is capital preservation first, growth second.

---

## Core Principle

**Never risk more than you can afford to lose on a single trade.** Every rule below serves this.

---

## Position Sizing (The 2% Rule)

Never risk more than **2% of total portfolio value** on a single trade.

```
Max Risk ($)     = Portfolio Value × 0.02
Position Size    = Max Risk ($) / (Entry Price - Stop Loss Price)
Max Dollar Risk  = Position Size × (Entry Price - Stop Loss Price)
```

Example: $10,000 portfolio → max risk per trade = $200.
If entering AAPL at $180 with stop at $175 (risk = $5/share) → max 40 shares = $7,200 position.

**Hard limits:**
- Single position never exceeds **15% of portfolio** regardless of conviction
- Cash reserve: always keep at least **5% in cash**
- Max open positions: **15**

---

## Pre-Trade Checklist (Required Before Every Order)

### 1. Risk/Reward
- Minimum **2:1 reward-to-risk ratio** (target at least 2× what you're risking)
- Define entry, stop loss, and target BEFORE placing the order
- If you can't identify a logical stop loss level, don't trade

### 2. Market Conditions
- Is the broad market (S&P 500) in an uptrend, downtrend, or range?
- Prefer longs in uptrends, shorts/cash in downtrends
- Reduce position size by 50% in choppy/uncertain markets

### 3. Sector Check
- Is the sector trending in the same direction as the trade?
- No more than **25% of portfolio** in a single sector

### 4. Catalyst Check
- Is there an earnings report within 5 trading days? If yes — reduce size by 50% or avoid
- Upcoming Fed decisions, macro data releases: reduce size or wait

### 5. Fundamentals (for positions held >1 week)
- Profitable company or clear path to profitability
- Revenue growth positive or accelerating
- No pending major litigation or regulatory risk

---

## Stop Loss Rules

- **Always set a stop loss before entering.** No exceptions.
- Stop loss placement: below the most recent support level or swing low (for longs)
- **Never move a stop loss against your position** (moving it further away to avoid being stopped out)
- You may trail a stop loss in your favor as a position moves up
- Mental stop losses are not stop losses — use actual orders

---

## Profit Taking Rules

- **Book partial profits (50%)** when price reaches your first target (1:1 reward/risk)
- Move stop loss to breakeven after booking partial profits
- Let the remaining 50% run with a trailing stop
- Don't let a profitable trade turn into a losing one — protect gains once up 15%+

---

## What Not to Do

| Behavior | Why It Destroys Accounts |
|----------|--------------------------|
| Averaging down on losers | Turns small losses into account-killers |
| Revenge trading after a loss | Emotional decisions, oversized positions |
| FOMO chasing breakouts late | Terrible risk/reward, stop is far away |
| Holding through earnings without sizing down | Binary risk, unpredictable moves |
| Ignoring the stop loss | Hope is not a strategy |
| Adding to a position already at max size | Increases concentration risk |
| Trading more than 3 new positions per day | Overtrading, transaction costs, noise |

---

## Order Types

| Situation | Order Type |
|-----------|------------|
| Entering a position | Limit order (never market order for entries) |
| Stop loss | Stop-limit order |
| Taking profits | Limit order |
| Urgent exit (something went wrong) | Market order acceptable |

---

## After-Trade Review

After closing any position, answer these:
1. Did I follow the entry rules?
2. Did I respect the stop loss?
3. Did I size correctly?
4. What would I do differently?

Winning trades that broke the rules are still bad trades. Losing trades that followed the rules are fine.

---

## Portfolio Health Targets

| Metric | Target |
|--------|--------|
| Win rate | >45% (with 2:1 R/R, 45% is profitable) |
| Average winner / average loser | >2.0 |
| Max drawdown from peak | Alert at 10%, reassess strategy at 15% |
| Cash buffer | 5–15% |
| Sector concentration | <25% per sector |
| Single position size | <15% of portfolio |

---

## When to Stop Trading

Take a mandatory break if:
- You've lost **5% of your portfolio in a single day**
- You've lost **10% of your portfolio in a week**
- You've had **4 consecutive losing trades**
- You're trading out of boredom, not conviction

Come back when the market gives you a clear setup, not when you need to make money back.
