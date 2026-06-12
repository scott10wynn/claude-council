'use client';

import { useState, useCallback } from 'react';
import { useResumeStore } from '@/lib/store';
import { Wand2, Copy, Download, RefreshCw, CheckCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'professional' | 'enthusiastic' | 'creative' | 'conservative';
type Length = 'concise' | 'standard' | 'detailed';

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Polished & authoritative' },
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Energetic & passionate' },
  { id: 'creative', label: 'Creative', desc: 'Distinctive & story-driven' },
  { id: 'conservative', label: 'Conservative', desc: 'Formal & fact-focused' },
];

const LENGTHS: { id: Length; label: string; words: string }[] = [
  { id: 'concise', label: 'Concise', words: '~230 words' },
  { id: 'standard', label: 'Standard', words: '~340 words' },
  { id: 'detailed', label: 'Detailed', words: '~460 words' },
];

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function CoverLetterPanel() {
  const { data } = useResumeStore();

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('standard');

  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canGenerate = company.trim() && title.trim() && description.trim();

  const generate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: data,
          jobDetails: { company, title, description, hiringManager: hiringManager || undefined },
          options: { tone, length },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Generation failed');
      setLetter(json.letter);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [canGenerate, data, company, title, description, hiringManager, tone, length]);

  const copy = useCallback(async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [letter]);

  const download = useCallback(() => {
    if (!letter) return;
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${company.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [letter, company]);

  return (
    <div className="flex flex-col gap-4">
      {/* Job Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Job Details</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Company *</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Job Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Engineer"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Job Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the full job description here — the more detail, the more targeted your letter will be."
            rows={6}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAdvanced && 'rotate-180')} />
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-1 pt-1">
            <label className="text-xs font-medium text-gray-600">Hiring Manager Name</label>
            <input
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              placeholder="e.g. Jane Smith (optional)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Tone */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Tone</h3>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTone(t.id)}
              className={cn(
                'rounded-lg border px-3 py-2.5 text-left transition-colors',
                tone === t.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="text-xs font-semibold text-gray-800">{t.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Length</h3>
        <div className="flex gap-2">
          {LENGTHS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLength(l.id)}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2.5 text-center transition-colors',
                length === l.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div className="text-xs font-semibold text-gray-800">{l.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{l.words}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={generate}
        disabled={!canGenerate || loading}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
          canGenerate && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            {letter ? 'Regenerate' : 'Generate Cover Letter'}
          </>
        )}
      </button>

      {!canGenerate && (
        <p className="text-xs text-gray-400 text-center -mt-2">Fill in company, title, and description above</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generated letter */}
      {letter && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-800">Your Cover Letter</h3>
              <span className="text-xs text-gray-400">{wordCount(letter)} words</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copy}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={download}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>

          <textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-[inherit]"
            rows={20}
          />

          <p className="text-xs text-gray-400">You can edit the letter directly in the box above.</p>
        </div>
      )}
    </div>
  );
}
