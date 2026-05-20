# Robinhood Connector — Setup Guide

Connect your Robinhood account to Claude Council so the AI council can analyze your portfolio and give you multi-perspective investment guidance.

## Prerequisites

Install the required Python package:

```bash
pip install robin_stocks
```

If your Robinhood account uses TOTP-based MFA (Google Authenticator / Authy):

```bash
pip install pyotp
```

## Credential Setup

### Option A — Environment Variables (temporary, per session)

```bash
export ROBINHOOD_USERNAME='your@email.com'
export ROBINHOOD_PASSWORD='yourpassword'

# If MFA is enabled, choose one:
export ROBINHOOD_MFA_CODE='123456'          # paste a live 6-digit code
export ROBINHOOD_TOTP_SECRET='BASE32SECRET' # preferred: auto-generates codes
```

### Option B — Config File (persistent)

```bash
mkdir -p ~/.config/claude-council
cat > ~/.config/claude-council/robinhood.json << 'EOF'
{
  "username": "your@email.com",
  "password": "yourpassword",
  "totp_secret": "YOUR_BASE32_TOTP_SECRET"
}
EOF
chmod 600 ~/.config/claude-council/robinhood.json
```

### Finding Your TOTP Secret

1. Open Robinhood → **Account** → **Security & Privacy** → **Two-Factor Authentication**
2. Select **Authenticator App** (or reconfigure it)
3. Robinhood will display a QR code **and** a plain-text base32 secret below it
4. Copy that base32 string (looks like `JBSWY3DPEHPK3PXP`) as your `totp_secret`

> **Why TOTP secret vs one-time code?**
> A one-time code expires every 30 seconds, so you'd have to update it each session.
> The TOTP secret lets the connector generate fresh codes automatically — you set it once.

## Session Tokens

After a successful login, `robin_stocks` stores an auth token at:

```
~/.tokens/robinhood_client.pickle
```

On subsequent runs the connector reuses this token automatically (no credentials needed). Tokens typically last several hours to days. If you get an auth error, re-run with credentials set to refresh the token.

To explicitly clear a stored session:

```bash
bash scripts/finance/robinhood.sh logout
```

## Usage

### Via Claude Council (recommended)

```
/robinhood
```

Fetches your full portfolio and asks the council to review it.

```
/robinhood "Should I take profits on my NVDA position?"
```

Asks a specific question in the context of your live portfolio.

```
/robinhood --view=positions "Which positions have the worst risk/reward?"
```

Fetches only open positions and targets a specific question.

### Direct Script (for debugging)

```bash
# Markdown output (human-readable)
bash scripts/finance/robinhood.sh all markdown

# JSON output (for scripting)
bash scripts/finance/robinhood.sh all json

# Only open positions
bash scripts/finance/robinhood.sh positions markdown

# Last 7 days of orders
bash scripts/finance/robinhood.sh orders json 7
```

## What the Connector Fetches

| Data | Description |
|------|-------------|
| **Portfolio** | Total equity, day P&L, buying power, cash balance |
| **Positions** | All open stock/ETF holdings with cost basis and current price |
| **Options** | Open option contracts (if any) |
| **Orders** | Recent order history (configurable lookback window) |
| **Account** | Account type, margin info, option level |

## Security Notes

- The connector is **read-only** — it cannot place or cancel orders
- Credentials in the config file should be `chmod 600` (owner-readable only)
- Session tokens are stored locally at `~/.tokens/robinhood_client.pickle`
- Portfolio data is only used within your current Claude session and is never stored or logged by the council

## Troubleshooting

| Error | Fix |
|-------|-----|
| `robin_stocks not installed` | Run `pip install robin_stocks` |
| `credentials not configured` | Set env vars or create config file (see above) |
| `MFA required` | Add `ROBINHOOD_MFA_CODE` or `ROBINHOOD_TOTP_SECRET` |
| `auth token expired` | Re-run with credentials set to refresh |
| `device approval required` | Log in via the Robinhood app/web first to approve the new device, then retry |
