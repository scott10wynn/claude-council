#!/usr/bin/env python3
"""
Robinhood Account Connector for Claude Council

Authenticates with Robinhood and exports account/portfolio data as JSON
so the council can analyze positions and provide investment guidance.

Usage:
    python3 robinhood_connector.py <command> [--output=json|markdown]

Commands:
    portfolio   Equity summary, buying power, day P&L
    positions   All open stock/ETF positions with current prices
    options     Open option contracts
    orders      Recent order history (last 30 days)
    account     Account-level metrics and margin info
    all         Everything above combined (default)
    logout      Clear stored session tokens

Credentials (checked in order):
    1. Environment vars: ROBINHOOD_USERNAME / ROBINHOOD_PASSWORD / ROBINHOOD_MFA_CODE
    2. ROBINHOOD_TOTP_SECRET  for auto-TOTP (no manual MFA entry needed)
    3. Config file: ~/.config/claude-council/robinhood.json
    4. Stored session token from a previous login (auto-reused)
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# Dependency guard
# ---------------------------------------------------------------------------

def _require(pkg: str, install_hint: str) -> None:
    import importlib.util
    if importlib.util.find_spec(pkg) is None:
        print(
            f"Error: '{pkg}' is not installed.\n"
            f"Install it with:  {install_hint}",
            file=sys.stderr,
        )
        sys.exit(2)


_require("robin_stocks", "pip install robin_stocks")


import robin_stocks.robinhood as r  # noqa: E402 — import after guard


# ---------------------------------------------------------------------------
# Config / credential loading
# ---------------------------------------------------------------------------

CONFIG_PATH = Path.home() / ".config" / "claude-council" / "robinhood.json"
TOKEN_DIR = Path.home() / ".tokens"


def _load_config() -> dict:
    if CONFIG_PATH.exists():
        try:
            with CONFIG_PATH.open() as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _credentials() -> tuple[str, str, str | None, str | None]:
    """Return (username, password, mfa_code, totp_secret) from env or config."""
    cfg = _load_config()

    username = os.environ.get("ROBINHOOD_USERNAME") or cfg.get("username", "")
    password = os.environ.get("ROBINHOOD_PASSWORD") or cfg.get("password", "")
    mfa_code = os.environ.get("ROBINHOOD_MFA_CODE") or cfg.get("mfa_code") or None
    totp_secret = os.environ.get("ROBINHOOD_TOTP_SECRET") or cfg.get("totp_secret") or None

    return username, password, mfa_code, totp_secret


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

def login() -> None:
    """Authenticate with Robinhood; reuses stored tokens when valid."""
    username, password, mfa_code, totp_secret = _credentials()

    # Auto-generate TOTP when a secret is configured
    if totp_secret and not mfa_code:
        _require("pyotp", "pip install pyotp")
        import pyotp
        mfa_code = pyotp.TOTP(totp_secret).now()

    if not username or not password:
        # Try using a stored session with no credentials
        try:
            r.login(username="", password="", store_session=True)
            return
        except Exception:
            pass
        print(
            "Error: Robinhood credentials not configured.\n\n"
            "Set environment variables:\n"
            "  export ROBINHOOD_USERNAME='your@email.com'\n"
            "  export ROBINHOOD_PASSWORD='yourpassword'\n"
            "  export ROBINHOOD_MFA_CODE='123456'   # one-time code if MFA is enabled\n\n"
            "Or create ~/.config/claude-council/robinhood.json:\n"
            '  {"username": "your@email.com", "password": "yourpassword"}\n\n'
            "For automatic TOTP, add your TOTP secret:\n"
            '  {"username": "...", "password": "...", "totp_secret": "YOUR_BASE32_SECRET"}',
            file=sys.stderr,
        )
        sys.exit(1)

    login_kwargs: dict = {
        "username": username,
        "password": password,
        "store_session": True,
        "by_sms": False,
    }
    if mfa_code:
        login_kwargs["mfa_code"] = mfa_code

    r.login(**login_kwargs)


def logout() -> None:
    r.logout()
    print(json.dumps({"status": "logged_out"}))


# ---------------------------------------------------------------------------
# Data fetchers
# ---------------------------------------------------------------------------

def _safe_float(val, default: float = 0.0) -> float:
    try:
        return float(val or default)
    except (TypeError, ValueError):
        return default


def _pct_change(current: float, cost: float) -> float | None:
    if cost and cost != 0:
        return round((current - cost) / abs(cost) * 100, 2)
    return None


def fetch_portfolio() -> dict:
    portfolio = r.get_portfolio_profile() or {}
    account = r.get_account_profile() or {}

    equity = _safe_float(portfolio.get("equity"))
    prev_equity = _safe_float(portfolio.get("equity_previous_close"))
    day_pl = round(equity - prev_equity, 2) if prev_equity else None
    day_pl_pct = _pct_change(equity, prev_equity)

    return {
        "equity": round(equity, 2),
        "extended_hours_equity": _safe_float(portfolio.get("extended_hours_equity")),
        "adjusted_equity_previous_close": _safe_float(portfolio.get("adjusted_equity_previous_close")),
        "day_p_and_l": day_pl,
        "day_p_and_l_pct": day_pl_pct,
        "withdrawable_amount": _safe_float(account.get("cash_available_for_withdrawal")),
        "buying_power": _safe_float(account.get("buying_power")),
        "cash": _safe_float(account.get("cash")),
        "dividend_total": _safe_float(account.get("total_cash_held_by_user")),
        "as_of": datetime.now(timezone.utc).isoformat(),
    }


def fetch_positions() -> list[dict]:
    holdings = r.build_holdings() or {}
    positions = []
    for ticker, data in holdings.items():
        quantity = _safe_float(data.get("quantity"))
        avg_buy_price = _safe_float(data.get("average_buy_price"))
        current_price = _safe_float(data.get("price"))
        equity = _safe_float(data.get("equity"))
        cost_basis = round(quantity * avg_buy_price, 2)
        unrealized_pl = round(equity - cost_basis, 2)

        positions.append({
            "ticker": ticker,
            "name": data.get("name", ""),
            "quantity": round(quantity, 6),
            "average_buy_price": round(avg_buy_price, 4),
            "current_price": round(current_price, 4),
            "equity": round(equity, 2),
            "cost_basis": cost_basis,
            "unrealized_p_and_l": unrealized_pl,
            "unrealized_p_and_l_pct": _pct_change(equity, cost_basis),
            "pe_ratio": _safe_float(data.get("pe_ratio")),
            "type": data.get("type", ""),
            "percentage_of_portfolio": _safe_float(data.get("percentage")),
        })

    positions.sort(key=lambda x: x["equity"], reverse=True)
    return positions


def fetch_options() -> list[dict]:
    try:
        open_options = r.get_open_option_positions() or []
    except Exception:
        return []

    result = []
    for pos in open_options:
        quantity = _safe_float(pos.get("quantity"))
        avg_price = _safe_float(pos.get("average_price"))
        result.append({
            "option_id": pos.get("option"),
            "quantity": round(quantity, 4),
            "average_price": round(avg_price, 4),
            "cost_basis": round(quantity * avg_price * 100, 2),
            "type": pos.get("type"),
            "chain_symbol": pos.get("chain_symbol"),
        })
    return result


def fetch_orders(days: int = 30) -> list[dict]:
    all_orders = r.get_all_stock_orders() or []
    cutoff_ts = datetime.now(timezone.utc).timestamp() - days * 86400
    orders = []
    for order in all_orders:
        created_at = order.get("created_at", "")
        try:
            ts = datetime.fromisoformat(created_at.replace("Z", "+00:00")).timestamp()
        except Exception:
            ts = 0
        if ts < cutoff_ts:
            continue
        orders.append({
            "created_at": created_at,
            "side": order.get("side"),
            "state": order.get("state"),
            "symbol": order.get("instrument_data", {}).get("symbol") if order.get("instrument_data") else None,
            "quantity": _safe_float(order.get("quantity")),
            "average_price": _safe_float(order.get("average_price") or order.get("price")),
            "total": round(
                _safe_float(order.get("executed_notional", {}).get("amount")
                            if isinstance(order.get("executed_notional"), dict) else None),
                2,
            ),
            "type": order.get("type"),
        })
    # Resolve ticker symbols for entries that have an instrument URL instead
    return orders[:100]


def fetch_account() -> dict:
    acct = r.get_account_profile() or {}
    info = r.get_basic_profile() or {}

    return {
        "account_number": acct.get("account_number", "****"),
        "account_type": acct.get("type"),
        "created_at": acct.get("created_at"),
        "cash": _safe_float(acct.get("cash")),
        "cash_held_for_orders": _safe_float(acct.get("cash_held_for_orders")),
        "uncleared_deposits": _safe_float(acct.get("uncleared_deposits")),
        "margin_balances": {
            "day_trade_buying_power": _safe_float(
                acct.get("margin_balances", {}).get("day_trade_buying_power")
                if isinstance(acct.get("margin_balances"), dict) else None
            ),
            "overnight_buying_power": _safe_float(
                acct.get("margin_balances", {}).get("overnight_buying_power")
                if isinstance(acct.get("margin_balances"), dict) else None
            ),
        },
        "sweep_enrolled": acct.get("sweep_enrolled"),
        "option_level": acct.get("option_level"),
        "user": {
            "first_name": info.get("first_name"),
            "last_name": info.get("last_name"),
        },
    }


# ---------------------------------------------------------------------------
# Output formatters
# ---------------------------------------------------------------------------

def _to_markdown(data: dict) -> str:
    lines = [f"# Robinhood Account — {data.get('as_of', '')}\n"]

    p = data.get("portfolio", {})
    if p:
        lines += [
            "## Portfolio Summary",
            f"| | |",
            f"|---|---|",
            f"| **Total Equity** | ${p.get('equity', 0):,.2f} |",
            f"| Day P&L | ${p.get('day_p_and_l', 0):+,.2f} ({p.get('day_p_and_l_pct', 0):+.2f}%) |",
            f"| Buying Power | ${p.get('buying_power', 0):,.2f} |",
            f"| Cash | ${p.get('cash', 0):,.2f} |",
            "",
        ]

    positions = data.get("positions", [])
    if positions:
        lines += [
            "## Open Positions",
            "| Ticker | Shares | Avg Cost | Current Price | Equity | Unrealized P&L | % of Portfolio |",
            "|--------|--------|----------|---------------|--------|----------------|----------------|",
        ]
        for pos in positions:
            pl_str = f"${pos['unrealized_p_and_l']:+,.2f}"
            if pos.get("unrealized_p_and_l_pct") is not None:
                pl_str += f" ({pos['unrealized_p_and_l_pct']:+.2f}%)"
            lines.append(
                f"| {pos['ticker']} | {pos['quantity']:.4f} | "
                f"${pos['average_buy_price']:.2f} | ${pos['current_price']:.2f} | "
                f"${pos['equity']:,.2f} | {pl_str} | {pos['percentage_of_portfolio']:.1f}% |"
            )
        lines.append("")

    options = data.get("options", [])
    if options:
        lines += ["## Options Positions", "| Symbol | Type | Qty | Avg Price | Cost Basis |",
                  "|--------|------|-----|-----------|------------|"]
        for o in options:
            lines.append(
                f"| {o.get('chain_symbol', '?')} | {o.get('type', '?')} | "
                f"{o['quantity']} | ${o['average_price']:.2f} | ${o['cost_basis']:.2f} |"
            )
        lines.append("")

    orders = data.get("orders", [])
    if orders:
        lines += [
            "## Recent Orders (last 30 days)",
            "| Date | Side | Symbol | Qty | Price | Total | Status |",
            "|------|------|--------|-----|-------|-------|--------|",
        ]
        for o in orders[:20]:
            date = (o.get("created_at") or "")[:10]
            lines.append(
                f"| {date} | {o.get('side', '?')} | {o.get('symbol', '?')} | "
                f"{o['quantity']:.4f} | ${o['average_price']:.2f} | ${o['total']:.2f} | {o.get('state', '?')} |"
            )
        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Robinhood account connector for Claude Council",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "command",
        nargs="?",
        default="all",
        choices=["portfolio", "positions", "options", "orders", "account", "all", "logout"],
        help="Data to fetch (default: all)",
    )
    parser.add_argument(
        "--output",
        choices=["json", "markdown"],
        default="json",
        help="Output format (default: json)",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=30,
        help="Days of order history to include (default: 30)",
    )
    args = parser.parse_args()

    if args.command == "logout":
        login()
        logout()
        return

    login()

    result: dict = {"as_of": datetime.now(timezone.utc).isoformat()}

    if args.command in ("portfolio", "all"):
        result["portfolio"] = fetch_portfolio()
    if args.command in ("positions", "all"):
        result["positions"] = fetch_positions()
    if args.command in ("options", "all"):
        result["options"] = fetch_options()
    if args.command in ("orders", "all"):
        result["orders"] = fetch_orders(days=args.days)
    if args.command in ("account", "all"):
        result["account"] = fetch_account()

    if args.output == "markdown":
        print(_to_markdown(result))
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
