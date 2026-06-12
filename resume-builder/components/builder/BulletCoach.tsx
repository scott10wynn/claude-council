'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/lib/store';
import { analyzeBullet, getBulletGradeColor } from '@/lib/bullet-analyzer';
import { ACTION_VERBS, WEAK_PHRASES } from '@/lib/keywords';
import { Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulletRowProps {
  text: string;
  company: string;
}

function BulletRow({ text, company }: BulletRowProps) {
  if (!text.trim()) return null;
  const a = analyzeBullet(text);
  const color = getBulletGradeColor(a.grade);

  return (
    <div className={cn('rounded-lg border p-2.5 bg-white text-xs space-y-1.5', a.grade === 'strong' ? 'border-green-200' : a.grade === 'good' ? 'border-blue-200' : 'border-amber-200')}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 h-2 w-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: color }} />
        <p className="flex-1 text-gray-700 leading-snug">{text.length > 100 ? text.slice(0, 100) + '…' : text}</p>
        <span className="shrink-0 font-bold text-xs" style={{ color }}>{a.score}/100</span>
      </div>
      {a.issues.length > 0 && (
        <ul className="space-y-0.5 pl-4">
          {a.issues.map((issue, i) => (
            <li key={i} className="text-amber-700 flex items-start gap-1">
              <AlertTriangle className="h-2.5 w-2.5 shrink-0 mt-0.5" />
              {issue}
            </li>
          ))}
        </ul>
      )}
      {a.tips.length > 0 && (
        <ul className="space-y-0.5 pl-4">
          {a.tips.map((tip, i) => (
            <li key={i} className="text-blue-600">› {tip}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BulletCoach() {
  const { data } = useResumeStore();

  const allBullets = useMemo(() => {
    const results: { text: string; company: string }[] = [];
    for (const exp of data.experience) {
      for (const b of exp.bullets.filter(Boolean)) {
        results.push({ text: b, company: exp.company || exp.position });
      }
    }
    for (const proj of data.projects) {
      for (const b of proj.bullets.filter(Boolean)) {
        results.push({ text: b, company: proj.name });
      }
    }
    return results;
  }, [data]);

  const avgScore = allBullets.length
    ? Math.round(allBullets.reduce((sum, b) => sum + analyzeBullet(b.text).score, 0) / allBullets.length)
    : 0;

  const poorCount = allBullets.filter((b) => {
    const a = analyzeBullet(b.text);
    return a.grade === 'poor' || a.grade === 'weak';
  }).length;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">Bullet Avg Score</p>
          <p className="text-xs text-gray-500">{allBullets.length} bullets analyzed · {poorCount} need improvement</p>
        </div>
        <div className="text-2xl font-bold" style={{ color: avgScore >= 70 ? '#15803d' : avgScore >= 50 ? '#d97706' : '#dc2626' }}>
          {avgScore}/100
        </div>
      </div>

      <div className="space-y-2">
        {allBullets
          .sort((a, b) => analyzeBullet(a.text).score - analyzeBullet(b.text).score) // weakest first
          .map((b, i) => <BulletRow key={i} text={b.text} company={b.company} />)}
      </div>

      {/* Action verb bank */}
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-yellow-500" /> Action Verb Bank
        </p>
        <div className="space-y-2">
          {Object.entries(ACTION_VERBS).map(([category, verbs]) => (
            <div key={category}>
              <p className="text-xs font-medium text-gray-500 mb-1">{category}</p>
              <div className="flex flex-wrap gap-1">
                {verbs.map((v) => (
                  <span key={v} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 hover:bg-blue-100 hover:text-blue-800 cursor-default transition-colors">{v}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
