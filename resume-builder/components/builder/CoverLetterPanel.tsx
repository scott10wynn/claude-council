'use client';

import { useState, useCallback, useMemo } from 'react';
import { useResumeStore } from '@/lib/store';
import { Wand2, Copy, Download, RefreshCw, CheckCheck, ChevronDown, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tone = 'professional' | 'enthusiastic' | 'creative' | 'conservative';
type Length = 'concise' | 'standard' | 'detailed';
type Format = 'standard' | 'achievement' | 'story' | 'problem-solution' | 'modern';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive' | 'career-change';
type ClosingStyle = 'warm' | 'confident' | 'bold';

// ─── Option definitions ───────────────────────────────────────────────────────

const FORMATS: { id: Format; label: string; desc: string }[] = [
  { id: 'standard', label: 'Standard', desc: 'Hook → evidence → why them → CTA' },
  { id: 'achievement', label: 'Achievement-First', desc: 'Lead with your biggest win' },
  { id: 'story', label: 'Story-Led', desc: 'Opens with a compelling moment' },
  { id: 'problem-solution', label: 'Problem-Solution', desc: 'Name their challenge, be the answer' },
  { id: 'modern', label: 'Modern Direct', desc: 'No salutation, punchy & contemporary' },
];

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Polished & authoritative' },
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Energetic & passionate' },
  { id: 'creative', label: 'Creative', desc: 'Story-driven & distinct' },
  { id: 'conservative', label: 'Conservative', desc: 'Formal & fact-focused' },
];

const LENGTHS: { id: Length; label: string; words: string }[] = [
  { id: 'concise', label: 'Concise', words: '~230 words' },
  { id: 'standard', label: 'Standard', words: '~340 words' },
  { id: 'detailed', label: 'Detailed', words: '~460 words' },
];

const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  { id: 'entry', label: 'Entry Level', desc: '0–3 yrs · projects & potential' },
  { id: 'mid', label: 'Mid-Level', desc: '3–8 yrs · track record & growth' },
  { id: 'senior', label: 'Senior / Lead', desc: '8–15 yrs · impact & ownership' },
  { id: 'executive', label: 'Executive', desc: '15+ yrs · strategy & scale' },
  { id: 'career-change', label: 'Career Change', desc: 'Bridging to a new field' },
];

const FOCUS_AREAS: { id: string; label: string }[] = [
  { id: 'technical', label: 'Technical Depth' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'impact', label: 'Quantified Impact' },
  { id: 'culture', label: 'Culture & Mission' },
  { id: 'growth', label: 'Growth Trajectory' },
  { id: 'client', label: 'Client / Customer' },
];

const INDUSTRIES: { id: string; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'tech', label: 'Tech / Software' },
  { id: 'finance', label: 'Finance' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'consulting', label: 'Consulting' },
  { id: 'startup', label: 'Startup' },
  { id: 'corporate', label: 'Enterprise' },
  { id: 'nonprofit', label: 'Nonprofit / Gov' },
];

const CLOSING_STYLES: { id: ClosingStyle; label: string; desc: string }[] = [
  { id: 'warm', label: 'Warm', desc: 'Inviting & gracious' },
  { id: 'confident', label: 'Confident', desc: 'States follow-up intent' },
  { id: 'bold', label: 'Bold', desc: 'One sharp closing line' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','as','is','was','are','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'can','not','no','nor','so','yet','both','either','neither','each','few',
  'more','most','other','some','such','than','too','very','just','also',
  'this','that','these','those','we','you','i','my','your','our','their',
  'it','its','he','she','they','them','his','her','who','which','what',
  'experience','work','team','role','company','position','candidate','looking',
  'seeking','strong','ability','skills','knowledge','including','required',
  'preferred','must','need','needs','working','using','help','join','make',
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  return [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { id: T; label: string; desc: string }[];
  value: T;
  onChange: (v: T) => void;
  cols?: 2 | 3;
}) {
  return (
    <div className={cn('grid gap-2', cols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'rounded-lg border px-3 py-2.5 text-left transition-colors',
            value === o.id
              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className="text-xs font-semibold text-gray-800">{o.label}</div>
          <div className="text-xs text-gray-500 mt-0.5 leading-tight">{o.desc}</div>
        </button>
      ))}
    </div>
  );
}

function Chips({ options, value, onChange, max }: {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else if (!max || value.length < max) {
      onChange([...value, id]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => toggle(o.id)}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            value.includes(o.id)
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-200 text-gray-600 hover:border-gray-400'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function KeywordMatch({ description, letter }: { description: string; letter: string }) {
  const keywords = useMemo(() => extractKeywords(description), [description]);
  const letterLower = letter.toLowerCase();

  const matched = keywords.filter((kw) => letterLower.includes(kw));
  const missing = keywords.filter((kw) => !letterLower.includes(kw));
  const score = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Keyword Match</h3>
        <span className={cn('text-sm font-bold', color)}>{score}%</span>
      </div>

      {matched.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Matched ({matched.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((kw) => (
              <span key={kw} className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Consider adding ({missing.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((kw) => (
              <span key={kw} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CoverLetterPanel() {
  const { data } = useResumeStore();

  // Job details
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [companySize, setCompanySize] = useState('');

  // Generation options
  const [format, setFormat] = useState<Format>('standard');
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('standard');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('mid');
  const [focus, setFocus] = useState<string[]>([]);
  const [industry, setIndustry] = useState('general');
  const [closingStyle, setClosingStyle] = useState<ClosingStyle>('confident');

  // Output state
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
          jobDetails: {
            company,
            title,
            description,
            hiringManager: hiringManager || undefined,
            companySize: companySize || undefined,
          },
          options: { tone, length, format, experienceLevel, focus, industry, closingStyle },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Generation failed');
      setLetter(json.letter);
      setPreviewMode(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [canGenerate, data, company, title, description, hiringManager, companySize, tone, length, format, experienceLevel, focus, industry, closingStyle]);

  const copy = useCallback(async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [letter]);

  const download = useCallback(() => {
    if (!letter) return;
    const slug = company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [letter, company]);

  return (
    <div className="flex flex-col gap-4">

      {/* ── Job Details ── */}
      <SectionCard title="Job Details">
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
            placeholder="Paste the full job description — the more detail, the more targeted your letter."
            rows={6}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Hiring Manager Name</label>
            <input
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              placeholder="Jane Smith (optional)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Company Size / Stage</label>
            <input
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              placeholder="e.g. Series B, 200 people"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Format ── */}
      <SectionCard title="Format & Structure" defaultOpen={false}>
        <p className="text-xs text-gray-500">How should the letter be structured?</p>
        <OptionGrid options={FORMATS} value={format} onChange={setFormat} cols={2} />
      </SectionCard>

      {/* ── Tone & Closing ── */}
      <SectionCard title="Tone & Closing" defaultOpen={false}>
        <p className="text-xs text-gray-500 -mt-1">Voice</p>
        <OptionGrid options={TONES} value={tone} onChange={setTone} cols={2} />
        <p className="text-xs text-gray-500 pt-1">Closing style</p>
        <OptionGrid options={CLOSING_STYLES} value={closingStyle} onChange={setClosingStyle} cols={3} />
      </SectionCard>

      {/* ── About You ── */}
      <SectionCard title="About You" defaultOpen={false}>
        <p className="text-xs text-gray-500 -mt-1">Experience level</p>
        <OptionGrid options={EXPERIENCE_LEVELS} value={experienceLevel} onChange={setExperienceLevel} cols={2} />

        <p className="text-xs text-gray-500 pt-1">Focus areas <span className="text-gray-400">(pick up to 2)</span></p>
        <Chips options={FOCUS_AREAS} value={focus} onChange={setFocus} max={2} />

        <p className="text-xs text-gray-500 pt-1">Industry context</p>
        <Chips
          options={INDUSTRIES}
          value={[industry]}
          onChange={(v) => setIndustry(v[v.length - 1] ?? 'general')}
        />
      </SectionCard>

      {/* ── Length ── */}
      <SectionCard title="Length" defaultOpen={false}>
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
      </SectionCard>

      {/* ── Generate ── */}
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
        <p className="text-xs text-gray-400 text-center -mt-2">
          Fill in company, title, and job description above
        </p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Output ── */}
      {letter && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">Your Cover Letter</h3>
                <span className="text-xs text-gray-400">{wordCount(letter)} words</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {previewMode
                    ? <><Pencil className="h-3.5 w-3.5" /> Edit</>
                    : <><Eye className="h-3.5 w-3.5" /> Preview</>
                  }
                </button>
                <button
                  type="button"
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied
                    ? <><CheckCheck className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                    : <><Copy className="h-3.5 w-3.5" /> Copy</>
                  }
                </button>
                <button
                  type="button"
                  onClick={download}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  .txt
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-6 py-5 text-sm leading-relaxed text-gray-800 whitespace-pre-wrap font-serif">
                {letter}
              </div>
            ) : (
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={22}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            )}

            {!previewMode && (
              <p className="text-xs text-gray-400">Edit directly above, then copy or download.</p>
            )}
          </div>

          {/* Keyword match */}
          {description && <KeywordMatch description={description} letter={letter} />}
        </>
      )}
    </div>
  );
}
