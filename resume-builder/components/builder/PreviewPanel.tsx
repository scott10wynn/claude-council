'use client';

import { useRef, useCallback } from 'react';
import { useResumeStore } from '@/lib/store';
import { getTheme } from '@/lib/utils';
import { ResumePreview } from '@/components/templates';
import { exportToPDF } from '@/lib/pdf-export';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function PreviewPanel() {
  const { data, settings } = useResumeStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const theme = getTheme(settings.colorThemeId);
  const enabledSections = settings.sections.filter((s) => s.enabled).map((s) => s.id);

  const handleExport = useCallback(async () => {
    if (!previewRef.current || exporting) return;
    setExporting(true);
    try {
      await exportToPDF(previewRef.current, data.contact.name || 'resume');
    } finally {
      setExporting(false);
    }
  }, [data.contact.name, exporting]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))} title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setZoom(1)} className="text-xs">Reset</Button>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? 'Generating…' : 'Download PDF'}
        </Button>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            width: '210mm',
            minHeight: '297mm',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            ref={previewRef}
            style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <ResumePreview
              data={data}
              template={settings.template}
              theme={theme}
              enabledSections={enabledSections}
              fontSize={settings.fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
