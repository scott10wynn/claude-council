'use client';

import { useResumeStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { RotateCcw, Upload, Download, FileText } from 'lucide-react';
import { useRef } from 'react';

export function Toolbar() {
  const { data, resetToDefaults, loadData } = useResumeStore();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.contact.name.replace(/\s+/g, '-') || 'resume'}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        loadData(parsed);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <header className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="text-base font-bold text-gray-900">ResumeBuilder</span>
        </div>
        <span className="text-xs text-gray-400 font-medium px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">Pro</span>
      </div>

      <div className="flex items-center gap-1.5">
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} title="Import JSON">
          <Upload className="h-3.5 w-3.5" /> Import
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExportJSON} title="Export resume data as JSON">
          <Download className="h-3.5 w-3.5" /> Export Data
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { if (confirm('Reset all data to the sample resume?')) resetToDefaults(); }}
          className="text-gray-500"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
    </header>
  );
}
