'use client';

import { useResumeStore } from '@/lib/store';
import { calculateATSScore, getScoreColor, getScoreLabel } from '@/lib/ats-score';
import { useMemo } from 'react';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export function ATSScore() {
  const { data } = useResumeStore();
  const score = useMemo(() => calculateATSScore(data), [data]);
  const color = getScoreColor(score.total);
  const label = getScoreLabel(score.total);

  const sections = [
    { key: 'contact', label: 'Contact', max: 20 },
    { key: 'summary', label: 'Summary', max: 15 },
    { key: 'experience', label: 'Experience', max: 30 },
    { key: 'education', label: 'Education', max: 15 },
    { key: 'skills', label: 'Skills', max: 15 },
    { key: 'format', label: 'Completeness', max: 5 },
  ] as const;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">ATS Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold" style={{ color }}>{score.total}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score.total}%`, backgroundColor: color }}
          />
        </div>
        <div className="text-xs font-medium mb-4" style={{ color }}>{label}</div>

        {/* Breakdown */}
        <div className="space-y-1.5">
          {sections.map(({ key, label, max }) => {
            const val = score.breakdown[key];
            const pct = Math.round((val / max) * 100);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#15803d' : pct >= 50 ? '#d97706' : '#dc2626' }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{val}/{max}</span>
              </div>
            );
          })}
        </div>
      </div>

      {score.suggestions.length > 0 && (
        <div className="border-t border-gray-100 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> Suggestions
          </p>
          <ul className="space-y-1">
            {score.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                <span className="mt-0.5 text-amber-400">›</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
