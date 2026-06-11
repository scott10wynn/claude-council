import { ResumeData, ColorTheme } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export interface TemplateProps {
  data: ResumeData;
  theme: ColorTheme;
  enabledSections: string[];
  fontSize: 'sm' | 'md' | 'lg';
}

export const FONT_SIZES = {
  sm: { base: '10px', name: '12px', section: '9px', body: '9.5px' },
  md: { base: '11px', name: '14px', section: '10px', body: '10.5px' },
  lg: { base: '12px', name: '16px', section: '11px', body: '11.5px' },
};

export { formatDate };
