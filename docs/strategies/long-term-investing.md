# Long-Term Investing: Portfolio Construction & Tax Efficiency

---

## 1. Three-Fund / Lazy Portfolio

The three-fund portfolio is the simplest evidence-based long-term investing system. It captures the entire global market, minimizes costs, and beats the majority of actively managed funds over 20+ years.

### The Three Funds

| Fund | What It Holds | Vanguard | Fidelity | Schwab |
|------|--------------|---------|---------|-------|
| US Total Market | All US stocks (~4,000) | VTI / VTSAX | FZROX / FSKAX | SCHB / SWTSX |
| International | Developed + EM ex-US | VXUS / VTIAX | FZILX / FTIHX | SCHF+SCHE or SWISX |
| US Bonds | Investment-grade bonds | BND / VBTLX | FXNAX | SCHZ / SWAGX |

### Standard Allocations

**Age-based rule of thumb:** Bonds % ≈ your age (aggressive: age − 20; conservative: age + 10)

| Risk Tolerance | Stocks | Bonds | Split (US/Intl) |
|---------------|--------|-------|-----------------|
| Aggressive | 90% | 10% | 70% US / 30% Intl |
| Moderate | 75% | 25% | 60% US / 40% Intl |
| Conservative | 60% | 40% | 60% US / 40% Intl |

**Rebalancing:** Annually or when any allocation drifts > 5% from target.

### Four-Fund and Other Lazy Portfolio Variants

**Four-Fund:** Add REITs (5–10% of equity allocation) — VNQ or SCHH — for real estate exposure.

**All Equity (young, long horizon):**
- 80% VTI + 20% VXUS — simple, cheap, maximum growth potential

**Target Date Fund (simplest of all):**
- Buy VFFVX (Vanguard Target 2055) or equivalent — automatically rebalances and de-risks as you approach the target year. No thought required after purchase.

### Why It Works
- Expense ratios: 0.03–0.10% vs. 0.5–1.5% for actively managed funds
- Tax efficiency: low turnover = minimal capital gains distributions
- Diversification: holds thousands of stocks; eliminates single-stock risk
- Behavioral: simplicity prevents tinkering and market-timing mistakes

---

## 2. Dividend Growth Investing (DGI)

Build a portfolio of companies that consistently grow their dividends, aiming for a rising income stream over time regardless of stock price fluctuations.

### Core Selection Criteria

**Dividend track record:**
- Dividend Champions: 25+ consecutive years of dividend increases
- Dividend Aristocrats (S&P): 25+ years, large cap only (index-tracked)
- Dividend Kings: 50+ consecutive years of increases

**Chowder Rule:**
```
Chowder Number = Dividend Yield + 5-Year Dividend Growth Rate (DGR)
Pass threshold:
  - Yield < 3%: Chowder Number ≥ 15
  - Yield 3–4%: Chowder Number ≥ 12
  - Yield > 4%: Chowder Number ≥ 8
```
Higher-yield stocks need less growth; lower-yield stocks need faster growth to compensate.

**Dividend Growth Rate (DGR) targets:**
- Minimum acceptable 5-year DGR: 5% (inflation coverage with some real growth)
- Strong: 8–12% 5-year DGR
- Elite: > 12% DGR (rare outside high-growth sectors)

**Payout Ratio (earnings):**
| Sector | Target Payout Ratio |
|--------|---------------------|
| Industrials / Consumer | < 60% |
| Technology | < 40% |
| Utilities | 60–75% (regulated; stable earnings) |
| REITs | 70–90% of FFO (use FFO, not GAAP earnings) |
| Banks | < 40% of earnings |

**Warning signs:**
- Payout ratio > 80% for a non-utility/REIT
- DGR slowing for 3+ consecutive years while yield rises (yield going up because price is falling, not because dividends grew)
- Negative FCF growth while maintaining the dividend (borrowing to pay dividends)
- Dividend increase < 3% after years of 8%+ growth (management conserving cash)

### Financial Health Requirements
- Debt/EBITDA < 3× (< 2× preferred for cyclical businesses)
- Interest coverage ratio > 3×
- FCF payout ratio < 80% (dividends paid from free cash flow, not just accounting earnings)
- Revenue growth at least slightly positive over 5 years (not a permanently shrinking business)

### Portfolio Construction for DGI
- 25–40 positions across 8–10 sectors (no single stock > 5% of portfolio)
- Sector weighting maximums: no sector > 25%
- Aim for average yield of 2.5–4%; don't chase yield above 6% (usually a trap)
- Reinvest dividends (DRIP) when accumulating; take as income when drawing down

### Dividend Yield vs. Dividend Growth Trade-off
- High yield, low growth (utilities): more current income, less total return
- Low yield, high growth (tech): less current income, potentially more total return over 20+ years
- Best of both worlds: 2.5–3.5% yield + 8–12% growth = "total return" DGI sweet spot

---

## 3. Factor Investing (Smart Beta)

Academic research identifies persistent risk factors that explain stock returns beyond the market beta. Tilting toward these factors has historically improved risk-adjusted returns.

### The Five Core Factors

**1. Value Factor**
- Theory: cheap stocks (low P/B, P/E, EV/EBITDA) outperform expensive stocks over time
- Mechanism: investors overpay for growth; value stocks are underpriced due to neglect or pessimism
- ETFs: VTV, VVIAX, IVE, SPYV, RPV (pure value)
- Caveat: value underperformed significantly 2010–2020; factor can have decade-long droughts

**2. Momentum Factor**
- Theory: stocks that have outperformed over 6–12 months tend to continue outperforming for 3–6 months
- Mechanism: slow incorporation of information; institutional herding
- ETFs: MTUM, QMOM (pure momentum), PDP
- Caveat: momentum crashes violently during sharp market reversals (March 2009, March 2020)

**3. Quality Factor**
- Theory: high-ROE, low-debt, stable-earnings companies outperform junk
- Mechanism: markets underestimate the persistence of high-quality earnings
- ETFs: QUAL (MSCI Quality), SPHQ, VIG (dividend quality proxy)
- Caveat: least volatile factor; smallest premium but most consistent

**4. Low Volatility Factor**
- Theory: low-volatility stocks outperform on a risk-adjusted basis (volatility anomaly)
- Mechanism: institutional leverage constraints force overpricing of lottery-ticket high-vol stocks
- ETFs: SPLV (S&P 500 Low Vol), USMV (MSCI Min Vol), ACWV
- Caveat: significantly underperforms in strong bull runs; excels in bear markets

**5. Size Factor (Small Cap)**
- Theory: small-cap stocks have a return premium over large caps
- Mechanism: higher risk, lower liquidity, less analyst coverage
- ETFs: VBR (small value), IJR, AVUV (Avantis Small Value — best implementation)
- Caveat: premium has diminished; small-cap value is the strongest remaining combination

### Factor Combination (Multi-Factor Portfolio)
Factors have low correlation to each other — combining them reduces volatility while maintaining the premium.

| Portfolio | Factors | Implementation |
|-----------|---------|---------------|
| Simple tilt | Market + Value + Momentum | 50% VTI + 25% VTV + 25% MTUM |
| Quality-Value | Value + Quality | VFVA + VFQY or DFA/Avantis funds |
| Academic optimal | All five | DFA or Avantis fund suite (low-cost factor funds) |

**Rebalancing:** Quarterly; momentum especially needs frequent rebalancing (6-month formation period means the factor rotates quickly).

---

## 4. Tax-Loss Harvesting (TLH)

Selling positions at a loss to realize a capital loss for tax purposes, then immediately buying a substantially similar (but not identical) security to maintain market exposure.

### The Wash Sale Rule
**IRS Rule:** If you sell a security at a loss and buy the "same or substantially identical" security within **30 days before or after** the sale (61-day window total), the loss is disallowed.

**Substantially identical:**
- Same stock or fund
- Options on the same stock
- A fund and its near-identical index-tracking twin (e.g., SPY → IVV may trigger; SPY → VTI does not)

**Safe substitute pairs for TLH:**

| Sell | Buy Immediately |
|------|-----------------|
| VTI (US Total Market) | ITOT or SCHB |
| SPY | IVV or VOO |
| QQQ | ONEQ or QQQM |
| VXUS (International) | IXUS or SCHF+SCHE |
| BND (Bonds) | AGG or SCHZ |
| VWO (Emerging) | IEMG or SCHE |

### When TLH Is Worth Doing
- Position is down > $1,000 (transaction costs and tracking error make tiny losses uneconomical)
- You are in a tax bracket where capital gains are taxed (0% bracket = no benefit)
- The position has been held for less than one year (short-term losses offset short-term gains first, which are taxed at higher rates)
- You have capital gains elsewhere that need offsetting

### TLH Mechanics
1. Sell the loss position on or before Dec 31 (losses must be realized in the tax year)
2. Immediately buy the substitute fund (same day — maintain market exposure, no "waiting period" required if the substitute is different enough)
3. Wait 31+ days from the sale date before buying back the original fund
4. Track your cost basis on the new position (it carries the deferred loss)

### Specific Identification (SpecID) vs. FIFO
- **FIFO (default):** Broker sells your oldest shares first — often highest-gain lots
- **SpecID:** You designate which shares to sell — sell highest-cost lots to minimize gains or maximize losses
- Always use SpecID; set it as default in your brokerage account **before** making trades

### Annual TLH Limits
- Up to **$3,000/year** of net capital losses can offset ordinary income
- Excess losses carry forward indefinitely to future years
- Harvested losses first offset capital gains dollar for dollar (unlimited)

---

## 5. Risk Parity

Instead of allocating by dollar amount (60/40), allocate by **risk contribution** — each asset contributes equally to portfolio volatility.

### The Problem With 60/40
In a 60/40 portfolio, equities contribute ~85–90% of the portfolio's total risk (because stocks are 3–4× more volatile than bonds). A bad stock year means a bad 60/40 year regardless of the bond allocation.

### Risk Parity Approach
Weight each asset by the inverse of its volatility.

```
Weight of asset i = (1 / σᵢ) / Σ(1 / σⱼ for all j)
```

**Example (simplified, 3 assets):**
| Asset | Annual Volatility (σ) | 1/σ | Weight |
|-------|----------------------|-----|--------|
| S&P 500 equities | 18% | 5.6 | 22% |
| Long-term bonds | 12% | 8.3 | 32% |
| Commodities | 20% | 5.0 | 19% |
| Gold | 16% | 6.3 | 24% |
| Cash | 2% | 50 | — (excluded or minimal) |

**Outcome:** Each asset contributes roughly equal risk. The portfolio is smoother but requires leverage to achieve equity-like returns in some implementations.

**Practical unlevered version:** Overweight bonds and gold relative to stocks to equalize risk contributions without leverage.

### Rebalancing for Risk Parity
- Rebalance **monthly or quarterly** — volatility regimes shift and weights need updating
- Recalculate volatility using a 60-day rolling window
- Use ETFs for each asset class (IVV, TLT, DBC/PDBC, GLD)

---

## 6. All-Weather Portfolio (Ray Dalio / Bridgewater)

Designed to perform reasonably well in all four economic environments: growth + inflation combinations.

### The Four Economic Environments

| Environment | Rising | Falling |
|-------------|--------|---------|
| **Growth** | ↑ Stocks, ↑ Corp bonds, ↑ Commodities | ↓ Gold, ↓ Long bonds |
| **Inflation** | ↑ Gold, ↑ Commodities, ↑ TIPS | ↓ Stocks, ↓ Bonds |

### All-Weather Allocations (Dalio's original)

| Asset | Allocation | ETF |
|-------|-----------|-----|
| US Stocks | **30%** | VTI or SPY |
| Long-Term US Bonds (20–30yr) | **40%** | TLT |
| Intermediate US Bonds (7–10yr) | **15%** | IEF |
| Gold | **7.5%** | GLD or IAU |
| Commodities | **7.5%** | DBC or PDBC |
| **Total** | **100%** | |

### Why 40% in Long-Term Bonds?
Long-term bonds have high volatility (nearly as volatile as stocks). A 40% allocation to TLT contributes similar risk to the portfolio as 30% in stocks — achieving risk balance without leverage.

### Historical Performance (back-tested)
- Average annual return: ~9% (1980–2020)
- Maximum drawdown: ~12% (much less than equities: −50% in 2008, −33% in 2020)
- Worst year: 2022 (−15% as both stocks AND bonds fell — unusual; both were overvalued simultaneously)
- Sharpe ratio: 0.7–0.8 (competitive with equities on risk-adjusted basis)

### Rebalancing
- Quarterly rebalancing to target weights
- Tax-efficient implementation: hold in tax-advantaged accounts (TLT generates interest income taxed as ordinary income)
- Commodities generate K-1 forms (DBC); consider PDBC (avoids K-1) for taxable accounts

### Modern Modifications
- Replace 7.5% commodities with TIPS/I-Bonds for inflation protection with less volatility
- Add 5–10% international equity (reduce US equity to 20–25%)
- For younger investors: increase equity to 40%, reduce long bonds to 30%

---

## Quick Reference: Strategy Selection by Goal

| Goal | Time Horizon | Strategy | Core Tools |
|------|-------------|---------|------------|
| Simplest long-term | 20+ years | Three-fund portfolio | VTI + VXUS + BND |
| Dividend income | 10+ years | DGI | Dividend Champions, Chowder Rule |
| Beat the market | 10+ years | Factor tilt | AVUV + QUAL + MTUM overlay |
| Tax efficiency | Ongoing | TLH + SpecID | Annual harvesting, substitute pairs |
| Smooth ride | Any | All-Weather | 30/40/15/7.5/7.5 |
| Risk balanced | 10+ years | Risk Parity | Equal-vol weighting, monthly rebalance |
