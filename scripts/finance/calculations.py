#!/usr/bin/env python3
"""
Finance calculation engine for the Claude finance plugin.

Usage:
    python3 calculations.py <command> [options]

Commands:
    dcf       Discounted Cash Flow valuation
    wacc      Weighted Average Cost of Capital
    capm      Capital Asset Pricing Model (cost of equity)
    ratios    Financial ratio suite
    comps     Comparable company analysis
    tv        Terminal value (Gordon Growth Model)
    npv       Net Present Value of arbitrary cash flows
    irr       Internal Rate of Return
    sens      WACC / terminal-growth sensitivity table for a DCF
"""

import argparse
import json
import sys


# ---------------------------------------------------------------------------
# Core math
# ---------------------------------------------------------------------------

def pv_of_cashflows(cashflows: list[float], rate: float) -> float:
    """PV of a list of annual cash flows discounted at `rate`."""
    return sum(cf / (1 + rate) ** (i + 1) for i, cf in enumerate(cashflows))


def gordon_growth_tv(last_fcf: float, growth_rate: float, wacc: float) -> float:
    """Terminal value via Gordon Growth Model: FCF*(1+g) / (WACC-g)."""
    if wacc <= growth_rate:
        raise ValueError("WACC must be greater than terminal growth rate.")
    return last_fcf * (1 + growth_rate) / (wacc - growth_rate)


def capm(risk_free: float, beta: float, erp: float) -> float:
    """Cost of equity = Rf + Beta * ERP."""
    return risk_free + beta * erp


def wacc(equity_weight: float, cost_equity: float,
         debt_weight: float, cost_debt: float, tax_rate: float) -> float:
    """WACC = E/V * Re + D/V * Rd * (1-T)."""
    return equity_weight * cost_equity + debt_weight * cost_debt * (1 - tax_rate)


def irr(cashflows: list[float], guess: float = 0.1, tol: float = 1e-6,
        max_iter: int = 1000) -> float:
    """IRR via Newton-Raphson. cashflows[0] is typically negative (initial outlay)."""
    rate = guess
    for _ in range(max_iter):
        npv = sum(cf / (1 + rate) ** i for i, cf in enumerate(cashflows))
        dnpv = sum(-i * cf / (1 + rate) ** (i + 1)
                   for i, cf in enumerate(cashflows) if i > 0)
        if dnpv == 0:
            break
        new_rate = rate - npv / dnpv
        if abs(new_rate - rate) < tol:
            return new_rate
        rate = new_rate
    return rate


# ---------------------------------------------------------------------------
# Command handlers
# ---------------------------------------------------------------------------

def cmd_dcf(args):
    fcfs = [float(x) for x in args.fcfs.split(",")]
    w = float(args.wacc)
    tg = float(args.terminal_growth)
    shares = float(args.shares)
    net_debt = float(args.net_debt)

    tv = gordon_growth_tv(fcfs[-1], tg, w)
    n = len(fcfs)
    pv_tv = tv / (1 + w) ** n
    pv_fcfs = pv_of_cashflows(fcfs, w)
    ev = pv_fcfs + pv_tv
    equity_value = ev - net_debt
    implied_price = equity_value / shares

    result = {
        "fcfs_projected": fcfs,
        "wacc_pct": round(w * 100, 2),
        "terminal_growth_pct": round(tg * 100, 2),
        "terminal_value": round(tv, 2),
        "pv_terminal_value": round(pv_tv, 2),
        "pv_fcfs": round(pv_fcfs, 2),
        "enterprise_value": round(ev, 2),
        "net_debt": round(net_debt, 2),
        "equity_value": round(equity_value, 2),
        "shares_outstanding": shares,
        "implied_price_per_share": round(implied_price, 2),
    }
    print(json.dumps(result, indent=2))


def cmd_wacc(args):
    result = wacc(
        float(args.equity_weight),
        float(args.cost_of_equity),
        float(args.debt_weight),
        float(args.cost_of_debt),
        float(args.tax_rate),
    )
    print(json.dumps({"wacc": round(result, 6), "wacc_pct": round(result * 100, 3)}))


def cmd_capm(args):
    result = capm(float(args.risk_free), float(args.beta), float(args.erp))
    print(json.dumps({"cost_of_equity": round(result, 6),
                      "cost_of_equity_pct": round(result * 100, 3)}))


def cmd_tv(args):
    tv = gordon_growth_tv(float(args.last_fcf), float(args.growth), float(args.wacc))
    print(json.dumps({"terminal_value": round(tv, 2)}))


def cmd_npv(args):
    cashflows = [float(x) for x in args.cashflows.split(",")]
    rate = float(args.rate)
    result = pv_of_cashflows(cashflows[1:], rate) + cashflows[0]
    print(json.dumps({"npv": round(result, 2), "rate_pct": round(rate * 100, 2)}))


def cmd_irr(args):
    cashflows = [float(x) for x in args.cashflows.split(",")]
    result = irr(cashflows)
    print(json.dumps({"irr": round(result, 6), "irr_pct": round(result * 100, 3)}))


def cmd_ratios(args):
    def safe(val):
        return float(val) if val is not None else None

    rev = safe(args.revenue)
    gp = safe(args.gross_profit)
    ebitda = safe(args.ebitda)
    ebit = safe(args.ebit)
    ni = safe(args.net_income)
    assets = safe(args.total_assets)
    debt = safe(args.total_debt)
    cash = safe(args.cash)
    equity = safe(args.equity)
    op_cf = safe(args.operating_cf)
    capex = safe(args.capex)
    interest = safe(getattr(args, "interest_expense", None))

    def pct(num, den):
        return round(num / den * 100, 2) if den and den != 0 else None

    def ratio(num, den):
        return round(num / den, 3) if den and den != 0 else None

    fcf = (op_cf - capex) if op_cf is not None and capex is not None else None
    net_debt = (debt - cash) if debt is not None and cash is not None else None

    result = {
        "profitability": {
            "gross_margin_pct": pct(gp, rev) if gp else None,
            "ebitda_margin_pct": pct(ebitda, rev) if ebitda else None,
            "ebit_margin_pct": pct(ebit, rev) if ebit else None,
            "net_margin_pct": pct(ni, rev) if ni else None,
            "roe_pct": pct(ni, equity) if ni and equity else None,
            "roa_pct": pct(ni, assets) if ni and assets else None,
            "roic_pct": pct(ebit, (equity + (net_debt or 0))) if ebit and equity else None,
        },
        "liquidity": {
            "cash_ratio": ratio(cash, debt) if cash and debt else None,
        },
        "leverage": {
            "net_debt": round(net_debt, 2) if net_debt is not None else None,
            "net_debt_to_ebitda": ratio(net_debt, ebitda) if net_debt is not None and ebitda else None,
            "debt_to_equity": ratio(debt, equity) if debt and equity else None,
            "interest_coverage": ratio(ebit, interest) if ebit and interest else None,
        },
        "efficiency": {
            "asset_turnover": ratio(rev, assets) if rev and assets else None,
            "fcf": round(fcf, 2) if fcf is not None else None,
            "fcf_margin_pct": pct(fcf, rev) if fcf is not None and rev else None,
            "fcf_conversion_pct": pct(fcf, ni) if fcf is not None and ni else None,
        },
    }
    print(json.dumps(result, indent=2))


def cmd_comps(args):
    companies = json.loads(args.data)

    def ev_revenue(c):
        return round(c["ev"] / c["revenue"], 2) if c.get("revenue") else None

    def ev_ebitda(c):
        return round(c["ev"] / c["ebitda"], 2) if c.get("ebitda") else None

    def pe(c):
        return round(c["price"] / (c["net_income"] / c["shares"]), 2) \
            if c.get("net_income") and c.get("shares") and c.get("price") else None

    rows = []
    for c in companies:
        rows.append({
            "name": c["name"],
            "ev": c.get("ev"),
            "ev_revenue": ev_revenue(c),
            "ev_ebitda": ev_ebitda(c),
            "pe": pe(c),
        })

    def stats(key):
        vals = [r[key] for r in rows if r.get(key) is not None]
        if not vals:
            return {}
        vals_sorted = sorted(vals)
        mid = len(vals_sorted) // 2
        median = (vals_sorted[mid - 1] + vals_sorted[mid]) / 2 \
            if len(vals_sorted) % 2 == 0 else vals_sorted[mid]
        return {
            "min": round(min(vals), 2),
            "mean": round(sum(vals) / len(vals), 2),
            "median": round(median, 2),
            "max": round(max(vals), 2),
        }

    result = {
        "companies": rows,
        "summary": {
            "ev_revenue": stats("ev_revenue"),
            "ev_ebitda": stats("ev_ebitda"),
            "pe": stats("pe"),
        },
    }
    print(json.dumps(result, indent=2))


def cmd_sens(args):
    """Sensitivity table: implied share price across WACC and terminal growth ranges."""
    fcfs = [float(x) for x in args.fcfs.split(",")]
    base_wacc = float(args.wacc)
    base_tg = float(args.terminal_growth)
    shares = float(args.shares)
    net_debt = float(args.net_debt)

    wacc_range = [base_wacc + d for d in (-0.02, -0.01, 0, 0.01, 0.02)]
    tg_range = [base_tg + d for d in (-0.01, -0.005, 0, 0.005, 0.01)]

    table = {}
    for w in wacc_range:
        row = {}
        for tg in tg_range:
            try:
                tv = gordon_growth_tv(fcfs[-1], tg, w)
                pv_tv = tv / (1 + w) ** len(fcfs)
                pv_fcfs = pv_of_cashflows(fcfs, w)
                ev = pv_fcfs + pv_tv
                price = (ev - net_debt) / shares
                row[f"{tg*100:.1f}%"] = round(price, 2)
            except ValueError:
                row[f"{tg*100:.1f}%"] = "N/A"
        table[f"{w*100:.1f}%"] = row

    print(json.dumps({"sensitivity_wacc_vs_tg": table}, indent=2))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Finance calculation engine")
    sub = parser.add_subparsers(dest="command")

    # dcf
    p = sub.add_parser("dcf")
    p.add_argument("--fcfs", required=True, help="Comma-separated FCFs (millions)")
    p.add_argument("--wacc", required=True)
    p.add_argument("--terminal-growth", required=True)
    p.add_argument("--shares", required=True, help="Shares outstanding (millions)")
    p.add_argument("--net-debt", default="0", help="Net debt (millions); negative = net cash")

    # wacc
    p = sub.add_parser("wacc")
    p.add_argument("--equity-weight", required=True)
    p.add_argument("--cost-of-equity", required=True)
    p.add_argument("--debt-weight", required=True)
    p.add_argument("--cost-of-debt", required=True)
    p.add_argument("--tax-rate", default="0.21")

    # capm
    p = sub.add_parser("capm")
    p.add_argument("--beta", required=True)
    p.add_argument("--risk-free", default="0.045")
    p.add_argument("--erp", default="0.055")

    # tv
    p = sub.add_parser("tv")
    p.add_argument("--last-fcf", required=True)
    p.add_argument("--growth", required=True)
    p.add_argument("--wacc", required=True)

    # npv
    p = sub.add_parser("npv")
    p.add_argument("--cashflows", required=True,
                   help="Comma-separated; first value is t=0 (outlay)")
    p.add_argument("--rate", required=True)

    # irr
    p = sub.add_parser("irr")
    p.add_argument("--cashflows", required=True,
                   help="Comma-separated; first value is t=0 (negative outlay)")

    # ratios
    p = sub.add_parser("ratios")
    for flag in ["revenue", "gross-profit", "ebitda", "ebit", "net-income",
                 "total-assets", "total-debt", "cash", "equity",
                 "operating-cf", "capex", "interest-expense"]:
        p.add_argument(f"--{flag}", default=None)

    # comps
    p = sub.add_parser("comps")
    p.add_argument("--data", required=True,
                   help='JSON array of company objects with keys: name, ev, revenue, ebitda, net_income, shares, price')

    # sens
    p = sub.add_parser("sens")
    p.add_argument("--fcfs", required=True)
    p.add_argument("--wacc", required=True)
    p.add_argument("--terminal-growth", required=True)
    p.add_argument("--shares", required=True)
    p.add_argument("--net-debt", default="0")

    args = parser.parse_args()

    dispatch = {
        "dcf": cmd_dcf,
        "wacc": cmd_wacc,
        "capm": cmd_capm,
        "tv": cmd_tv,
        "npv": cmd_npv,
        "irr": cmd_irr,
        "ratios": cmd_ratios,
        "comps": cmd_comps,
        "sens": cmd_sens,
    }

    if args.command not in dispatch:
        parser.print_help()
        sys.exit(1)

    dispatch[args.command](args)


if __name__ == "__main__":
    main()
