'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  COUNTRY_PROFILES,
  getChapterFromHts,
  getCountryProfile,
  formatHtsCode,
  type HtsChapter,
  type CountryProfile,
} from '@/lib/tariff-data';

interface CalculationResult {
  chapter: HtsChapter;
  country: CountryProfile;
  baseRate: number;
  additionalRates: { name: string; rate: number; note?: string }[];
  totalRate: number;
  dutyAmount: number;
  totalLandedCost: number;
  isPreferential: boolean;
}

export function TariffCalculator() {
  const [htsInput, setHtsInput] = useState('');
  const [countryCode, setCountryCode] = useState('CN');
  const [shipmentValue, setShipmentValue] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');

  const formattedHts = useMemo(() => formatHtsCode(htsInput), [htsInput]);

  function calculate() {
    setError('');
    setResult(null);

    const chapter = getChapterFromHts(htsInput);
    if (!chapter) {
      setError('Enter a valid HTS code (at least 2 digits, e.g. 8471 or 6109.10).');
      return;
    }

    const value = parseFloat(shipmentValue.replace(/[,$]/g, ''));
    if (!shipmentValue || isNaN(value) || value <= 0) {
      setError('Enter a valid shipment value greater than 0.');
      return;
    }

    const country = getCountryProfile(countryCode);
    const isPreferential = country.preferentialAgreement !== undefined &&
      country.programs.some(p => p.additionalRate === -999);

    let baseRate = chapter.mfnRateTypical;
    const additionalRates: { name: string; rate: number; note?: string }[] = [];

    if (isPreferential) {
      // Preferential trade agreement — duty-free for qualifying goods
      baseRate = 0;
      additionalRates.push({
        name: country.programs[0].name,
        rate: 0,
        note: country.programs[0].description,
      });
    } else {
      // Stack all applicable additional tariffs
      for (const program of country.programs) {
        if (program.additionalRate > 0) {
          additionalRates.push({
            name: program.name,
            rate: program.additionalRate,
            note: program.exceptions,
          });
        }
      }
    }

    const totalAdditional = additionalRates.reduce((sum, r) => sum + r.rate, 0);
    const totalRate = baseRate + totalAdditional;
    const dutyAmount = (value * totalRate) / 100;
    const totalLandedCost = value + dutyAmount;

    setResult({
      chapter,
      country,
      baseRate,
      additionalRates,
      totalRate,
      dutyAmount,
      totalLandedCost,
      isPreferential,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Tariff Impact Calculator</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Estimate US import duties by HTS code and country of origin
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          <strong>Disclaimer:</strong> Rates shown are estimates based on typical MFN rates and known tariff programs.
          Actual rates depend on the exact 10-digit HTS classification and may vary.
          Always verify with{' '}
          <span className="font-medium">CBP, USITC, or a licensed customs broker</span> before making import decisions.
          Tariff rates — especially on Chinese goods — change frequently.
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Shipment Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* HTS Code */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">HTS Code</label>
              <input
                type="text"
                value={formattedHts}
                onChange={e => setHtsInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="e.g. 8471.30"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <span className="text-xs text-gray-400">2–10 digit Harmonized Tariff code</span>
            </div>

            {/* Origin Country */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Country of Origin</label>
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {COUNTRY_PROFILES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name} {c.preferentialAgreement ? `(${c.preferentialAgreement})` : ''}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-400">Destination: United States</span>
            </div>

            {/* Shipment Value */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Shipment Value (USD)</label>
              <input
                type="text"
                value={shipmentValue}
                onChange={e => setShipmentValue(e.target.value)}
                placeholder="e.g. 50000"
                className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-400">Customs / transaction value</span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>
          )}

          <Button onClick={calculate} className="w-full sm:w-auto">
            Calculate Tariff Impact
          </Button>
        </div>

        {/* Results */}
        {result && <Results result={result} shipmentValue={parseFloat(shipmentValue.replace(/[,$]/g, ''))} htsCode={formattedHts} />}
      </div>
    </div>
  );
}

function Results({ result, shipmentValue, htsCode }: { result: CalculationResult; shipmentValue: number; htsCode: string }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCard label="Base MFN Rate" value={`${result.baseRate.toFixed(1)}%`} sub="Typical for this chapter" />
        <SummaryCard
          label="Additional Tariffs"
          value={result.isPreferential ? 'Duty-Free' : `+${result.additionalRates.reduce((s, r) => s + r.rate, 0).toFixed(0)}%`}
          sub={result.isPreferential ? (result.country.preferentialAgreement ?? '') : 'Country-specific'}
          highlight={!result.isPreferential && result.additionalRates.length > 0}
        />
        <SummaryCard
          label="Effective Duty Rate"
          value={`${result.totalRate.toFixed(1)}%`}
          sub="Base + additional"
          highlight={result.totalRate > 25}
        />
        <SummaryCard
          label="Duty Amount"
          value={fmt(result.dutyAmount)}
          sub={`on ${fmt(shipmentValue)}`}
          highlight={result.dutyAmount > 0}
        />
      </div>

      {/* Landed Cost Banner */}
      <div className="bg-blue-600 text-white rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-sm font-medium opacity-80">Estimated Total Landed Cost</div>
          <div className="text-3xl font-bold">{fmt(result.totalLandedCost)}</div>
        </div>
        <div className="text-sm opacity-80 sm:text-right">
          <div>Shipment Value: {fmt(shipmentValue)}</div>
          <div>+ Duties: {fmt(result.dutyAmount)}</div>
          {result.totalRate > 0 && (
            <div className="font-medium mt-0.5">
              Cost increase: {((result.dutyAmount / shipmentValue) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Rate Breakdown</h2>

        {/* Chapter Info */}
        <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">HTS Code</span>
            <span className="font-mono font-medium text-gray-900">{htsCode}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-gray-600">Chapter {result.chapter.chapter} — {result.chapter.description}</span>
            <span className="text-gray-500">MFN range: {result.chapter.mfnRateMin}–{result.chapter.mfnRateMax}%</span>
          </div>
          {result.chapter.notes && (
            <div className="mt-1.5 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">{result.chapter.notes}</div>
          )}
        </div>

        {/* Rate Stack */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="pb-2 font-medium">Rate Component</th>
              <th className="pb-2 font-medium text-right">Rate</th>
              <th className="pb-2 font-medium text-right">Duty on Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="py-2.5 text-gray-700">Base MFN Rate (Chapter {result.chapter.chapter} typical)</td>
              <td className="py-2.5 text-right font-mono">{result.baseRate.toFixed(1)}%</td>
              <td className="py-2.5 text-right font-mono">{fmt((shipmentValue * result.baseRate) / 100)}</td>
            </tr>
            {result.additionalRates.map((r, i) => (
              <tr key={i}>
                <td className="py-2.5 text-gray-700">
                  {r.name}
                  {r.note && <div className="text-xs text-gray-400 mt-0.5">{r.note}</div>}
                </td>
                <td className="py-2.5 text-right font-mono text-orange-600">+{r.rate.toFixed(0)}%</td>
                <td className="py-2.5 text-right font-mono text-orange-600">{fmt((shipmentValue * r.rate) / 100)}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-200 font-semibold">
              <td className="pt-3 text-gray-900">Total Effective Rate</td>
              <td className="pt-3 text-right font-mono text-gray-900">{result.totalRate.toFixed(1)}%</td>
              <td className="pt-3 text-right font-mono text-gray-900">{fmt(result.dutyAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Program Notes */}
      {result.country.programs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Applicable Programs — {result.country.name}
          </h2>
          {result.country.programs.map((p, i) => (
            <div key={i} className="border border-gray-100 rounded-lg px-4 py-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">{p.source}</span>
              </div>
              <p className="text-gray-600">{p.description}</p>
              {p.exceptions && (
                <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">Note: {p.exceptions}</p>
              )}
              <div className="text-xs text-gray-400">Effective: {p.effectiveDate}</div>
            </div>
          ))}
        </div>
      )}

      {/* Verify prompt */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Rates are estimates using chapter-level typical MFN values. Actual classification at the 10-digit HTS level may differ.
        Confirm current rates at usitc.gov or with a licensed customs broker.
      </p>
    </div>
  );
}

function SummaryCard({
  label, value, sub, highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}
