'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/lib/store';
import { checkATSCompatibility } from '@/lib/ats-compatibility';
import { CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ATSCompatibility() {
  const { data, settings } = useResumeStore();
  const report = useMemo(() => checkATSCompatibility(data, settings), [data, settings]);

  const riskColors = { low: '#15803d', medium: '#d97706', high: '#dc2626' };
  const riskLabels = { low: 'ATS-Ready', medium: 'Needs Fixes', high: 'High Risk' };
  const riskColor = riskColors[report.atsRiskLevel];

  return (
    <div className="space-y-3">
      {/* Header score */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">Format Compatibility</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold" style={{ color: riskColor }}>{report.score}%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: riskColor + '20', color: riskColor }}>
              {riskLabels[report.atsRiskLevel]}
            </span>
          </div>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${report.score}%`, backgroundColor: riskColor }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Based on rules from Workday, Greenhouse, iCIMS, Lever, and Taleo parsing specs
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5">
        {report.checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              'rounded-lg border p-3 text-xs',
              check.status === 'pass' ? 'border-green-100 bg-green-50' :
              check.status === 'warn' ? 'border-amber-100 bg-amber-50' :
              'border-red-100 bg-red-50'
            )}
          >
            <div className="flex items-start gap-2">
              {check.status === 'pass' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />}
              {check.status === 'warn' && <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />}
              {check.status === 'fail' && <XCircle className="h-3.5 w-3.5 text-red-600 mt-0.5 shrink-0" />}
              <div className="flex-1">
                <p className={cn('font-semibold',
                  check.status === 'pass' ? 'text-green-800' :
                  check.status === 'warn' ? 'text-amber-800' : 'text-red-800'
                )}>
                  {check.label}
                </p>
                <p className={cn('mt-0.5',
                  check.status === 'pass' ? 'text-green-700' :
                  check.status === 'warn' ? 'text-amber-700' : 'text-red-700'
                )}>
                  {check.message}
                </p>
                {check.fix && (
                  <p className="mt-1 text-gray-600 border-t border-gray-200 pt-1">
                    <span className="font-medium">Fix: </span>{check.fix}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">ATS Reality Check</p>
        <ul className="space-y-0.5">
          <li>› <strong>75%</strong> of resumes are rejected before a human sees them</li>
          <li>› Multi-column layouts scramble in <strong>40%+</strong> of ATS parsers</li>
          <li>› Adding the job title boosts interview odds by <strong>10.6×</strong></li>
          <li>› Use DOCX for Taleo/iCIMS, PDF for Greenhouse/Lever</li>
        </ul>
      </div>
    </div>
  );
}
