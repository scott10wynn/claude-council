'use client';

import { TemplateId, ResumeData, ColorTheme } from '@/lib/types';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateId;
  theme: ColorTheme;
  enabledSections: string[];
  fontSize: 'sm' | 'md' | 'lg';
}

export function ResumePreview({ data, template, theme, enabledSections, fontSize }: ResumePreviewProps) {
  const props = { data, theme, enabledSections, fontSize };

  return (
    <>
      {template === 'modern' && <ModernTemplate {...props} />}
      {template === 'classic' && <ClassicTemplate {...props} />}
      {template === 'minimal' && <MinimalTemplate {...props} />}
      {template === 'executive' && <ExecutiveTemplate {...props} />}
    </>
  );
}
