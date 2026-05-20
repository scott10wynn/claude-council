---
description: Connect to your Robinhood account and get AI investment guidance from the council. Analyzes your portfolio, positions, P&L, and recent trades, then queries multiple AI perspectives on allocation, risk, and opportunities. Trigger when the user mentions Robinhood, portfolio review, investment advice, position sizing, or "what should I do with my stocks".
argument-hint: [--view=portfolio|positions|options|orders|all] [--days=N] "investment question or leave blank for full review"
allowed-tools: Bash(*), Read, Write, AskUserQuestion
---

# Robinhood Investment Advisor

You are helping the user connect their Robinhood account and get multi-perspective investment analysis from the council.

## Step 1 — Parse Arguments

From `$ARGUMENTS`:
- `--view=<value>` → which data to fetch (`portfolio`, `positions`, `options`, `orders`, `all`). Default: `all`
- `--days=<N>` → days of order history (default: 30)
- Remaining text → the user's specific investment question

If no question is provided, run a full portfolio health review.

## Step 2 — Check Credentials

Before fetching data, verify credentials are available:

```bash
python3 -c "
import os, json
from pathlib import Path

cfg_path = Path.home() / '.config' / 'claude-council' / 'robinhood.json'
has_env = bool(os.environ.get('ROBINHOOD_USERNAME'))
has_cfg = cfg_path.exists()
print('env' if has_env else ('config' if has_cfg else 'none'))
"
```

If the result is `none`, show the setup instructions (Step 2a) before proceeding.

### Step 2a — Setup Instructions (only if credentials missing)

Tell the user:

> **Robinhood credentials not found.** Choose one of these setup methods:
>
> **Option A — Environment variables (session only)**
> ```bash
> export ROBINHOOD_USERNAME='your@email.com'
> export ROBINHOOD_PASSWORD='yourpassword'
> # If your account uses MFA, also set one of:
> export ROBINHOOD_MFA_CODE='123456'          # one-time code
> export ROBINHOOD_TOTP_SECRET='BASE32SECRET' # for auto-TOTP (recommended)
> ```
>
> **Option B — Config file (persists across sessions)**
> ```bash
> mkdir -p ~/.config/claude-council
> cat > ~/.config/claude-council/robinhood.json << 'EOF'
> {
>   "username": "your@email.com",
>   "password": "yourpassword",
>   "totp_secret": "YOUR_BASE32_TOTP_SECRET"
> }
> EOF
> chmod 600 ~/.config/claude-council/robinhood.json
> ```
>
> **Finding your TOTP secret:** In the Robinhood app, go to Account → Security → Two-Factor Authentication → Authenticator App. When setting it up, Robinhood shows a QR code and a text secret — use that base32 text string as `totp_secret`.
>
> Once credentials are set, run `/robinhood` again.

Then stop. Do not proceed without credentials.

## Step 3 — Fetch Account Data

Run the connector and capture the markdown snapshot:

```bash
bash scripts/finance/robinhood.sh <view> markdown <days>
```

If the command fails:
- Exit code 2 → show the pip install instructions and stop
- Other error → show the raw error output and ask the user to check credentials

## Step 4 — Build the Analysis Prompt

Construct a prompt that includes:
1. The full portfolio snapshot (markdown output from Step 3)
2. The user's specific question (or default review prompt below)

**Default review prompt (when no question provided):**
```
Review this Robinhood portfolio and provide investment analysis covering:
1. Portfolio concentration and diversification — are there over-weight or under-weight positions?
2. Unrealized gains/losses — which positions are working and which are lagging?
3. Risk assessment — sector exposure, volatility profile, any red flags?
4. Actionable recommendations — specific positions to trim, add to, or watch?
5. Cash/buying power — should idle cash be deployed, and if so, where?
Be specific and reference actual tickers and numbers from the data.
```

**When a specific question is provided**, prepend the portfolio data and append the user's question, e.g.:
```
Given this portfolio:
<portfolio_data>

Question: <user_question>
```

## Step 5 — Query the Council

Run the council with the finance/investment role set:

```bash
bash scripts/run-council.sh \
  --roles "security,performance,maintainability" \
  -- "<combined_prompt>"
```

Use these role mappings for investment advice:
- **security** role → risk management perspective (downside protection, stop-losses, diversification)
- **performance** role → return optimization (high-conviction picks, momentum, growth vs value)
- **maintainability** role → long-term portfolio health (rebalancing, tax efficiency, position sizing)

Or use `--roles devil,simplicity,scalability` for a more contrarian/critical review.

Read the council output file and present it to the user.

## Step 6 — Present Results

Format the output as:

```
## Your Portfolio at a Glance
<brief summary of key numbers: equity, day P&L, # of positions, cash>

## Council Analysis
<council responses, each labeled by perspective>

## Key Takeaways
<3-5 bullet points synthesizing the most actionable advice>
```

End with: *"Run `/robinhood "your question"` to ask a specific follow-up."*

## Important Notes

- **Never log or store account data** beyond the current session
- Remind the user that this is AI analysis, not licensed financial advice
- If the user asks to execute a trade, clarify that the connector is read-only — trades must be made in the Robinhood app
- Positions refresh each run; encourage re-running for up-to-date data during volatile sessions
