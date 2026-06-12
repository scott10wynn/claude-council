'use client';

import { useResumeStore } from '@/lib/store';
import { COLOR_THEMES, TemplateId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, ShieldCheck, ShieldAlert } from 'lucide-react';

const TEMPLATES: {
  id: TemplateId;
  label: string;
  desc: string;
  preview: string;
  atsLevel: 'safe' | 'caution';
  atsNote: string;
}[] = [
  { id: 'classic', label: 'Classic', desc: 'Traditional, single-column', preview: '▤', atsLevel: 'safe', atsNote: 'Max ATS compatibility' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean, contemporary, spacious', preview: '▭', atsLevel: 'safe', atsNote: 'Fully ATS-safe' },
  { id: 'modern', label: 'Modern', desc: 'Colored sidebar layout', preview: '◧', atsLevel: 'caution', atsNote: 'May scramble in older ATS' },
  { id: 'executive', label: 'Executive', desc: 'Bold header, two-column', preview: '▬', atsLevel: 'caution', atsNote: 'Multi-column — use for visual only' },
];

export function TemplateSelector() {
  const { settings, setTemplate, setColorTheme } = useResumeStore();

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Template</p>
        <p className="text-xs text-gray-400 mb-2">
          Use <span className="text-green-700 font-medium">Classic</span> or <span className="text-green-700 font-medium">Minimal</span> when submitting through ATS portals (Workday, Taleo, iCIMS).
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                'relative text-left rounded-lg border-2 p-2.5 transition-all hover:border-blue-400',
                settings.template === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
              )}
            >
              {settings.template === t.id && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600">
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              )}
              <div className="text-2xl mb-1 text-gray-400">{t.preview}</div>
              <div className="text-xs font-semibold text-gray-800">{t.label}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{t.desc}</div>
              <div className={cn('flex items-center gap-0.5 mt-1.5 text-xs font-medium',
                t.atsLevel === 'safe' ? 'text-green-700' : 'text-amber-600'
              )}>
                {t.atsLevel === 'safe'
                  ? <ShieldCheck className="h-3 w-3" />
                  : <ShieldAlert className="h-3 w-3" />}
                {t.atsNote}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Accent Color</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.id}
              title={theme.name}
              onClick={() => setColorTheme(theme.id)}
              className={cn(
                'relative h-7 w-7 rounded-full transition-transform hover:scale-110',
                settings.colorThemeId === theme.id && 'ring-2 ring-offset-2 ring-gray-800 scale-110'
              )}
              style={{ backgroundColor: theme.primary }}
            >
              {settings.colorThemeId === theme.id && (
                <Check className="absolute inset-0 m-auto h-3 w-3 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Font Size</p>
        <div className="flex gap-1.5">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => useResumeStore.getState().setFontSize(size)}
              className={cn(
                'flex-1 rounded-md border py-1 text-xs font-medium transition-all',
                settings.fontSize === size ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {size === 'sm' ? 'Compact' : size === 'md' ? 'Normal' : 'Large'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
