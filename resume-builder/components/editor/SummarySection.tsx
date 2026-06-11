'use client';

import { useResumeStore } from '@/lib/store';
import { Textarea } from '@/components/ui/textarea';

export function SummarySection() {
  const { data, updateSummary } = useResumeStore();

  return (
    <div>
      <Textarea
        label="Professional Summary"
        value={data.summary}
        onChange={(e) => updateSummary(e.target.value)}
        placeholder="Results-driven professional with X years of experience in..."
        rows={5}
      />
      <p className="mt-1 text-xs text-gray-400">{data.summary.length} characters · Aim for 200–400</p>
    </div>
  );
}
