'use client';

import { useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { SectionId } from '@/lib/types';
import { ContactSection } from '@/components/editor/ContactSection';
import { SummarySection } from '@/components/editor/SummarySection';
import { ExperienceSection } from '@/components/editor/ExperienceSection';
import { EducationSection } from '@/components/editor/EducationSection';
import { SkillsSection } from '@/components/editor/SkillsSection';
import { ProjectsSection } from '@/components/editor/ProjectsSection';
import { CertificationsSection } from '@/components/editor/CertificationsSection';
import { LanguagesSection } from '@/components/editor/LanguagesSection';
import { TemplateSelector } from './TemplateSelector';
import { SectionManager } from './SectionManager';
import { ATSScore } from './ATSScore';
import { cn } from '@/lib/utils';
import { User, Sliders, LayoutTemplate, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

type Tab = 'content' | 'design' | 'sections' | 'score';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  languages: LanguagesSection,
};

function CollapsibleBlock({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

export function EditorPanel() {
  const [tab, setTab] = useState<Tab>('content');
  const { settings } = useResumeStore();

  const tabs = [
    { id: 'content' as Tab, label: 'Content', icon: User },
    { id: 'design' as Tab, label: 'Design', icon: LayoutTemplate },
    { id: 'sections' as Tab, label: 'Sections', icon: Sliders },
    { id: 'score' as Tab, label: 'ATS', icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white shrink-0">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2 -mb-px',
              tab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tab === 'content' && (
          <>
            <CollapsibleBlock title="Contact Information" defaultOpen>
              <ContactSection />
            </CollapsibleBlock>
            {settings.sections.filter((s) => s.enabled).map((sec) => {
              const Comp = SECTION_COMPONENTS[sec.id];
              return (
                <CollapsibleBlock key={sec.id} title={sec.label} defaultOpen={sec.id === 'summary'}>
                  <Comp />
                </CollapsibleBlock>
              );
            })}
          </>
        )}

        {tab === 'design' && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <TemplateSelector />
          </div>
        )}

        {tab === 'sections' && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <SectionManager />
          </div>
        )}

        {tab === 'score' && <ATSScore />}
      </div>
    </div>
  );
}
