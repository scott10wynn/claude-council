'use client';

import { useState, useMemo } from 'react';
import { useResumeStore } from '@/lib/store';
import { analyzeJobDescription, getMatchScoreColor, getMatchScoreLabel } from '@/lib/job-analyzer';
import { cn } from '@/lib/utils';
import { Briefcase, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function JobMatcher() {
  const { data } = useResumeStore();
  const [jd, setJd] = useState('');
  const [submitted, setSubmitted] = useState('');

  const analysis = useMemo(
    () => (submitted ? analyzeJobDescription(submitted, data) : null),
    [submitted, data]
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          Paste Job Description
        </label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job posting here — requirements, responsibilities, qualifications…"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
          rows={7}
        />
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={() => setSubmitted(jd)}
            disabled={!jd.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Briefcase className="h-3.5 w-3.5" /> Analyze Match
          </Button>
          {submitted && (
            <Button variant="ghost" size="sm" onClick={() => { setJd(''); setSubmitted(''); }}>
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {analysis && (
        <div className="space-y-3">
          {/* Score */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Keyword Match</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: getMatchScoreColor(analysis.matchScore) }}>
                  {analysis.matchScore}%
                </span>
                <span className="text-xs text-gray-400">{analysis.matchedCount}/{analysis.totalKeywords} keywords</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${analysis.matchScore}%`, backgroundColor: getMatchScoreColor(analysis.matchScore) }}
              />
            </div>
            <p className="text-xs font-medium" style={{ color: getMatchScoreColor(analysis.matchScore) }}>
              {getMatchScoreLabel(analysis.matchScore)}
            </p>
          </div>

          {/* Missing high-priority keywords */}
          {analysis.missingHigh.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" /> High-Priority Missing Keywords
              </p>
              <p className="text-xs text-red-600 mb-2">These appear frequently in the job description but are absent from your resume:</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingHigh.map((kw) => (
                  <span key={kw} className="rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-xs text-red-800 font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing medium keywords */}
          {analysis.missingMedium.length > 0 && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Consider Adding
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingMedium.map((kw) => (
                  <span key={kw} className="rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-xs text-amber-800">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched keywords */}
          {analysis.matched.length > 0 && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-3">
              <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Keywords Already Present
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.matched.map((kw) => (
                  <span key={kw} className="rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs text-green-800">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Tip: Naturally work missing keywords into your bullets and summary — don't keyword-stuff.
          </p>
        </div>
      )}
    </div>
  );
}
