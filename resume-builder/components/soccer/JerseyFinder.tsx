'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { JerseyListing, JerseyType } from '@/lib/soccer-jersey-data';

const TYPE_META: Record<JerseyType, { label: string; color: string; bg: string; border: string; description: string }> = {
  authentic: {
    label: 'Authentic',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'Official licensed match or fan jersey from authorized retailers. Same specs as what players wear — or the official fan-grade equivalent. 100% legal.',
  },
  replica: {
    label: 'Replica',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    description: 'Licensed replica jersey — same design, lighter/cheaper materials than match-worn. Fully legal, officially sanctioned by the club.',
  },
  fake: {
    label: 'Fake',
    color: 'text-orange-800',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    description: 'Unlicensed counterfeit. Looks like the real thing but uses unauthorized branding. Cheap but legally grey — buying for personal use is generally tolerated, reselling is not.',
  },
};

const KIT_LABELS: Record<string, string> = { home: 'Home', away: 'Away', third: 'Third', special: 'Special' };

const POPULAR_TEAMS = [
  'Manchester City','Real Madrid','FC Barcelona','Liverpool','PSG',
  'Bayern Munich','Arsenal','Chelsea','Brazil','Argentina','Juventus','Inter Milan',
];

type ActiveFilter = JerseyType | 'all';

function TypeBadge({ type }: { type: JerseyType }) {
  const m = TYPE_META[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${m.color} ${m.bg} ${m.border}`}>
      {m.label}
    </span>
  );
}

function JerseyCard({ jersey }: { jersey: JerseyListing }) {
  const m = TYPE_META[jersey.type];
  return (
    <div className={`rounded-xl border ${m.border} ${m.bg} p-4 flex flex-col gap-2 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{jersey.team}</p>
          <p className="text-xs text-gray-500">{jersey.season} · {KIT_LABELS[jersey.kit]} kit</p>
        </div>
        <TypeBadge type={jersey.type} />
      </div>

      <p className="text-2xl font-bold text-gray-900">${jersey.priceUSD.toFixed(2)}</p>

      <div>
        <p className="text-xs font-medium text-gray-700">{jersey.retailer}</p>
        <p className="text-xs text-gray-400">{jersey.retailerDomain}</p>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">{jersey.description}</p>

      <div className="flex items-center gap-2 mt-1">
        {jersey.inStock
          ? <span className="text-xs text-emerald-700 font-medium">✓ In stock</span>
          : <span className="text-xs text-red-600 font-medium">✗ Out of stock</span>
        }
        <span className="text-gray-300">·</span>
        <span className="text-xs text-gray-500">{jersey.shippingNote}</span>
      </div>
    </div>
  );
}

function TypeSection({ type, jerseys }: { type: JerseyType; jerseys: JerseyListing[] }) {
  const m = TYPE_META[type];
  if (jerseys.length === 0) return null;
  return (
    <section>
      <div className={`flex items-center gap-3 mb-3 p-3 rounded-lg border ${m.border} ${m.bg}`}>
        <TypeBadge type={type} />
        <p className="text-xs text-gray-600 flex-1">{m.description}</p>
        <span className="text-xs font-medium text-gray-500">{jerseys.length} listing{jerseys.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {jerseys.map(j => <JerseyCard key={j.id} jersey={j} />)}
      </div>
    </section>
  );
}

export function JerseyFinder() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [results, setResults] = useState<JerseyListing[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (teamQuery: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/soccer-jerseys?team=${encodeURIComponent(teamQuery)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleChip = (team: string) => {
    setQuery(team);
    search(team);
  };

  const filtered = activeFilter === 'all'
    ? results
    : results.filter(j => j.type === activeFilter);

  const countByType = (t: JerseyType) => results.filter(j => j.type === t).length;

  const authentic = filtered.filter(j => j.type === 'authentic');
  const replica    = filtered.filter(j => j.type === 'replica');
  const fake       = filtered.filter(j => j.type === 'fake');

  const cheapest = (t: JerseyType) => {
    const items = results.filter(j => j.type === t);
    return items.length ? Math.min(...items.map(j => j.priceUSD)) : null;
  };

  const FILTERS: { key: ActiveFilter; label: string }[] = [
    { key: 'all', label: `All (${results.length})` },
    { key: 'authentic', label: `Authentic (${countByType('authentic')})` },
    { key: 'replica', label: `Replica (${countByType('replica')})` },
    { key: 'fake', label: `Fake (${countByType('fake')})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Soccer Jersey Price Finder</h1>
          <p className="text-sm text-gray-500 mb-5">
            Compare prices across every type — authentic, replica, and fake — all in one place. Sorted cheapest first.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
            <div className="flex-1">
              <Input
                placeholder="Search team (e.g. Real Madrid, Brazil, Arsenal…)"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Search'}
            </Button>
            {query && (
              <Button
                type="button"
                variant="outline"
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
              >
                Clear
              </Button>
            )}
          </form>

          {/* Popular team chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_TEAMS.map(t => (
              <button
                key={t}
                onClick={() => handleChip(t)}
                className="px-2.5 py-1 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {!searched && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">⚽</div>
            <p className="text-base font-medium text-gray-500">Search a team above or click a chip to get started</p>
            <p className="text-sm mt-1">We cover authentic, replica, and fake — all three, no judgment</p>
          </div>
        )}

        {searched && results.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-base font-medium">No jerseys found for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mt-1">Try a different team name</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            {/* Price summary bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['authentic','replica','fake'] as JerseyType[]).map(t => {
                const min = cheapest(t);
                const m = TYPE_META[t];
                return (
                  <div key={t} className={`rounded-xl border ${m.border} ${m.bg} p-3 text-center`}>
                    <TypeBadge type={t} />
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {min !== null ? `$${min.toFixed(2)}` : '—'}
                    </p>
                    <p className="text-xs text-gray-500">cheapest found</p>
                  </div>
                );
              })}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeFilter === f.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="flex flex-col gap-8">
              {(activeFilter === 'all' || activeFilter === 'authentic') && (
                <TypeSection type="authentic" jerseys={authentic} />
              )}
              {(activeFilter === 'all' || activeFilter === 'replica') && (
                <TypeSection type="replica" jerseys={replica} />
              )}
              {(activeFilter === 'all' || activeFilter === 'fake') && (
                <TypeSection type="fake" jerseys={fake} />
              )}
            </div>

            {/* Disclaimer */}
            <p className="mt-8 text-xs text-gray-400 border-t border-gray-200 pt-4">
              Prices are estimates and may vary. Authentic and replica jerseys are fully licensed products. Fake/counterfeit jerseys are unlicensed — buying for personal use is generally tolerated in most regions, but reselling is illegal in most jurisdictions. Always check your local laws.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
