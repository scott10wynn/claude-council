#!/usr/bin/env python3
"""
Excel-formatted DCF output. Runs a full DCF + sensitivity table locally and
outputs tab-separated (TSV) rows that paste directly into Excel cell A1.

Usage:
    python3 excel_output.py --fcfs=100,120,140,155,170 --wacc=0.09 \
        --terminal-growth=0.025 --shares=500 --net-debt=200 \
        [--ticker=AAPL] [--company="Apple Inc"]
"""

import argparse
import sys
from datetime import date
from pathlib import Path

# Reuse math from calculations.py in the same directory
sys.path.insert(0, str(Path(__file__).parent))
from calculations import pv_of_cashflows, gordon_growth_tv


def build_tsv(fcfs, wacc_rate, tg, shares, net_debt, ticker="", company=""):
    n = len(fcfs)
    tv = gordon_growth_tv(fcfs[-1], tg, wacc_rate)
    pv_tv = tv / (1 + wacc_rate) ** n
    pv_fcfs = pv_of_cashflows(fcfs, wacc_rate)
    ev = pv_fcfs + pv_tv
    equity_value = ev - net_debt
    implied_price = equity_value / shares
    tv_pct = round(pv_tv / ev * 100, 1) if ev != 0 else 0

    label = ticker or company or "Company"
    today = date.today().strftime("%B %d, %Y")

    rows = [
        f"DCF VALUATION\t{label}\t\tDate:\t{today}",
        "\t\t\t\t",
        "ASSUMPTIONS\t\t\t\t",
        "Parameter\tValue\t\t\t",
        f"Projection Period\t{n} years\t\t\t",
        f"WACC\t{wacc_rate*100:.1f}%\t\t\t",
        f"Terminal Growth Rate\t{tg*100:.1f}%\t\t\t",
        f"Shares Outstanding\t{shares:,.0f}M\t\t\t",
        f"Net Debt / (Cash)\t{net_debt:,.1f}M\t\t\t",
        "\t\t\t\t",
        "FREE CASH FLOWS\t\t\t\t",
        "Year\tFCF ($M)\tDiscount Factor\tPV of FCF ($M)",
    ]

    for i, fcf in enumerate(fcfs, 1):
        df = 1 / (1 + wacc_rate) ** i
        pv = fcf * df
        rows.append(f"Year {i}\t{fcf:,.1f}\t{df:.4f}\t{pv:,.1f}")

    rows += [
        f"Total\t\t\t{pv_fcfs:,.1f}",
        "\t\t\t\t",
        "TERMINAL VALUE\t\t\t\t",
        f"Gordon Growth Terminal Value\t{tv:,.1f}M\t\t",
        f"PV of Terminal Value\t{pv_tv:,.1f}M\t\t",
        f"Terminal Value as % of EV\t{tv_pct:.1f}%\t\t",
        "\t\t\t\t",
        "VALUATION SUMMARY\t\t\t\t",
        f"PV of Projected FCFs\t{pv_fcfs:,.1f}M\t\t",
        f"PV of Terminal Value\t{pv_tv:,.1f}M\t\t",
        f"Enterprise Value\t{ev:,.1f}M\t\t",
        f"Less: Net Debt / (Cash)\t({net_debt:,.1f}M)\t\t",
        f"Equity Value\t{equity_value:,.1f}M\t\t",
        f"Shares Outstanding\t{shares:,.0f}M\t\t",
        f"Implied Share Price\t${implied_price:,.2f}\t\t",
        "\t\t\t\t",
    ]

    # Sensitivity table: WACC ±2% vs terminal growth ±1%
    tg_steps = [-0.010, -0.005, 0.000, 0.005, 0.010]
    wacc_steps = [-0.020, -0.010, 0.000, 0.010, 0.020]
    tg_range = [tg + d for d in tg_steps]
    wacc_range = [wacc_rate + d for d in wacc_steps]

    rows.append("SENSITIVITY — Implied Share Price\t\t\t\t")
    rows.append("WACC \\ Terminal Growth →\t" + "\t".join(f"{t*100:.1f}%" for t in tg_range))

    for w in wacc_range:
        cells = [f"{w*100:.1f}%"]
        for t in tg_range:
            try:
                tv_s = gordon_growth_tv(fcfs[-1], t, w)
                pv_tv_s = tv_s / (1 + w) ** n
                pv_fcfs_s = pv_of_cashflows(fcfs, w)
                ev_s = pv_fcfs_s + pv_tv_s
                price_s = (ev_s - net_debt) / shares
                cells.append(f"${price_s:,.2f}")
            except ValueError:
                cells.append("N/A")
        rows.append("\t".join(cells))

    return "\n".join(rows)


def main():
    parser = argparse.ArgumentParser(description="Excel-formatted DCF output (TSV)")
    parser.add_argument("--fcfs", required=True, help="Comma-separated FCFs in millions")
    parser.add_argument("--wacc", required=True, help="WACC as decimal, e.g. 0.09")
    parser.add_argument("--terminal-growth", required=True, help="Terminal growth as decimal, e.g. 0.025")
    parser.add_argument("--shares", required=True, help="Shares outstanding in millions")
    parser.add_argument("--net-debt", default="0", help="Net debt in millions (negative = net cash)")
    parser.add_argument("--ticker", default="", help="Ticker symbol (label only)")
    parser.add_argument("--company", default="", help="Company name (label only)")

    args = parser.parse_args()

    fcfs = [float(x) for x in args.fcfs.split(",")]
    wacc_rate = float(args.wacc)
    tg = float(args.terminal_growth)
    shares = float(args.shares)
    net_debt = float(args.net_debt)

    if wacc_rate <= tg:
        print(f"Error: WACC ({wacc_rate*100:.1f}%) must exceed terminal growth rate ({tg*100:.1f}%) "
              "for the Gordon Growth model to be valid.", file=sys.stderr)
        sys.exit(1)

    print(build_tsv(fcfs, wacc_rate, tg, shares, net_debt, args.ticker, args.company))


if __name__ == "__main__":
    main()
