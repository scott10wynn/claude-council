---
description: Place a trade on Robinhood with strategy enforcement. Triggers on any mention of buying/selling a stock, placing an order, or trading a specific ticker. NEVER place an order without going through this workflow.
argument-hint: [buy|sell] [TICKER] [shares|$amount] stop=[price] target=[price] ["reason"]
allowed-tools: mcp__robinhood-trading__get_portfolio, mcp__robinhood-trading__get_equity_positions, mcp__robinhood-trading__get_equity_quotes, mcp__robinhood-trading__get_equity_tradability, mcp__robinhood-trading__review_equity_order, mcp__robinhood-trading__place_equity_order, mcp__robinhood-trading__get_equity_orders, AskUserQuestion
---

# /trade — Strategy-Enforced Order Workflow

## Hard Rules (enforced every trade)
- Max risk: `portfolio × 0.02`
- Min R/R: 2:1
- Single position cap: 15% of portfolio
- Cash floor: 5% of portfolio
- Stop loss required — no mental stops
- Earnings within 5 days → halve size
- No averaging down without explicit warning
- Always `review_equity_order` before `place_equity_order`
- Never place without written confirmation

---

## Step 1 — Parse `$ARGUMENTS`
Extract: direction, ticker, size (shares or $), stop price, target price, reason.
- Missing direction or ticker → ask once, then continue.
- Missing stop or target → ask for both in one message before continuing.

## Step 2 — Fetch (parallel)
- `get_portfolio` + `get_equity_positions` → portfolio_value, cash, existing position in ticker
- `get_equity_quotes` + `get_equity_tradability` → current price, tradability

## Step 3 — Calculate
```
max_risk_$    = portfolio_value × 0.02
risk_per_sh   = entry - stop            (long) | stop - entry (short)
max_shares    = floor(max_risk_$ / risk_per_sh)
reward_per_sh = target - entry          (long) | entry - target (short)
rr_ratio      = reward_per_sh / risk_per_sh
cap_shares    = floor(portfolio_value × 0.15 / entry)
final_shares  = min(requested_shares, max_shares, cap_shares)
```

## Step 4 — Gate Checks
1. `rr_ratio < 2.0` → block; show ratio, ask to adjust stop or target
2. `cash / portfolio_value < 0.05` (buy only) → warn: near cash floor
3. `final_shares < requested_shares` → inform user of cap and revised size
4. Earnings within 5 days → ask; if yes halve `final_shares` and warn
5. Existing losing position in ticker → warn averaging down, require explicit confirm

## Step 5 — Confirm
Show compact summary and wait for explicit yes before continuing:
```
{BUY|SELL} {shares}sh {TICKER} @ ${entry} lim | stop ${stop} | tgt ${target} | R/R {ratio}:1 | risk ${risk_$} ({risk_pct}%)
```
Ask: **Confirm? yes / no / adjust**

## Step 6 — Place
1. `review_equity_order` — show any warnings before placing
2. `place_equity_order`: symbol, side, qty=final_shares, type=limit, price=entry, time_in_force=gtc
3. Reply with order ID + `"Stop: ${stop} — set this order if not automatic."`

---

## Sell Workflow
1. `get_equity_positions` → show current P&L
2. Ask: full exit or partial (shares or %)?
3. Partial winner → confirm trailing stop moved to breakeven on remainder
4. At stop → confirm this is the pre-planned exit, not panic selling
5. Compact confirm → `review_equity_order` → `place_equity_order`

---

## Override
If user says "skip checklist" or "just place it":
> What's your stop price? (one number)

If still refused: place the order but warn "no stop defined — set one manually."
