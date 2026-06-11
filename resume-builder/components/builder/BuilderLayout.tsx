'use client';

import { Toolbar } from './Toolbar';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BuilderLayout() {
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Toolbar />

      {/* Mobile view toggle */}
      <div className="flex md:hidden border-b border-gray-200 bg-white">
        <button
          className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
            mobileView === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500')}
          onClick={() => setMobileView('editor')}
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          className={cn('flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
            mobileView === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500')}
          onClick={() => setMobileView('preview')}
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor — always visible on desktop, conditionally on mobile */}
        <div className={cn(
          'w-full md:w-[420px] md:min-w-[360px] md:max-w-[480px] flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden',
          mobileView === 'preview' && 'hidden md:flex'
        )}>
          <EditorPanel />
        </div>

        {/* Preview — always visible on desktop */}
        <div className={cn(
          'flex-1 overflow-hidden',
          mobileView === 'editor' && 'hidden md:flex md:flex-col'
        )}>
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
