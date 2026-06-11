export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages';

export interface Section {
  id: SectionId;
  label: string;
  enabled: boolean;
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'executive';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  light: string;
  dark: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'blue', name: 'Navy', primary: '#1d4ed8', light: '#eff6ff', dark: '#1e3a8a' },
  { id: 'teal', name: 'Teal', primary: '#0f766e', light: '#f0fdfa', dark: '#134e4a' },
  { id: 'purple', name: 'Purple', primary: '#7c3aed', light: '#f5f3ff', dark: '#4c1d95' },
  { id: 'rose', name: 'Rose', primary: '#be123c', light: '#fff1f2', dark: '#881337' },
  { id: 'orange', name: 'Copper', primary: '#c2410c', light: '#fff7ed', dark: '#7c2d12' },
  { id: 'green', name: 'Forest', primary: '#15803d', light: '#f0fdf4', dark: '#14532d' },
  { id: 'slate', name: 'Slate', primary: '#334155', light: '#f8fafc', dark: '#0f172a' },
  { id: 'indigo', name: 'Indigo', primary: '#4338ca', light: '#eef2ff', dark: '#312e81' },
];

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

export interface ResumeSettings {
  template: TemplateId;
  colorThemeId: string;
  sections: Section[];
  fontSize: 'sm' | 'md' | 'lg';
}

export interface ATSScore {
  total: number;
  breakdown: {
    contact: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
    format: number;
  };
  suggestions: string[];
}
