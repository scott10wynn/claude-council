'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, ResumeSettings, Section, SectionId, TemplateId, WorkExperience, Education, SkillCategory, Project, Certification, Language } from './types';
import { DEFAULT_RESUME_DATA, DEFAULT_SETTINGS } from './defaults';
import { generateId } from './utils';

interface ResumeStore {
  data: ResumeData;
  settings: ResumeSettings;
  isDirty: boolean;

  // Contact
  updateContact: (field: string, value: string) => void;

  // Summary
  updateSummary: (value: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean | string[]) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (from: number, to: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, field: string, value: string | string[]) => void;
  removeSkillCategory: (id: string) => void;
  reorderSkillCategories: (from: number, to: number) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, field: string, value: string | string[]) => void;
  removeProject: (id: string) => void;
  reorderProjects: (from: number, to: number) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;

  // Settings
  setTemplate: (t: TemplateId) => void;
  setColorTheme: (id: string) => void;
  setFontSize: (s: 'sm' | 'md' | 'lg') => void;
  toggleSection: (id: SectionId) => void;
  reorderSections: (from: number, to: number) => void;

  // Reset
  resetToDefaults: () => void;
  loadData: (data: ResumeData) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: DEFAULT_RESUME_DATA,
      settings: DEFAULT_SETTINGS,
      isDirty: false,

      updateContact: (field, value) =>
        set((s) => ({
          data: { ...s.data, contact: { ...s.data.contact, [field]: value } },
          isDirty: true,
        })),

      updateSummary: (value) =>
        set((s) => ({ data: { ...s.data, summary: value }, isDirty: true })),

      addExperience: () =>
        set((s) => ({
          data: {
            ...s.data,
            experience: [
              ...s.data.experience,
              {
                id: generateId(),
                company: '',
                position: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                bullets: [''],
              } satisfies WorkExperience,
            ],
          },
          isDirty: true,
        })),

      updateExperience: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) =>
              e.id === id ? { ...e, [field]: value } : e
            ),
          },
          isDirty: true,
        })),

      removeExperience: (id) =>
        set((s) => ({
          data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
          isDirty: true,
        })),

      reorderExperience: (from, to) =>
        set((s) => {
          const arr = [...s.data.experience];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { data: { ...s.data, experience: arr }, isDirty: true };
        }),

      addEducation: () =>
        set((s) => ({
          data: {
            ...s.data,
            education: [
              ...s.data.education,
              {
                id: generateId(),
                institution: '',
                degree: '',
                field: '',
                location: '',
                startDate: '',
                endDate: '',
              } satisfies Education,
            ],
          },
          isDirty: true,
        })),

      updateEducation: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            education: s.data.education.map((e) =>
              e.id === id ? { ...e, [field]: value } : e
            ),
          },
          isDirty: true,
        })),

      removeEducation: (id) =>
        set((s) => ({
          data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
          isDirty: true,
        })),

      addSkillCategory: () =>
        set((s) => ({
          data: {
            ...s.data,
            skillCategories: [
              ...s.data.skillCategories,
              { id: generateId(), name: 'New Category', skills: [] } satisfies SkillCategory,
            ],
          },
          isDirty: true,
        })),

      updateSkillCategory: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            skillCategories: s.data.skillCategories.map((c) =>
              c.id === id ? { ...c, [field]: value } : c
            ),
          },
          isDirty: true,
        })),

      removeSkillCategory: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            skillCategories: s.data.skillCategories.filter((c) => c.id !== id),
          },
          isDirty: true,
        })),

      reorderSkillCategories: (from, to) =>
        set((s) => {
          const arr = [...s.data.skillCategories];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { data: { ...s.data, skillCategories: arr }, isDirty: true };
        }),

      addProject: () =>
        set((s) => ({
          data: {
            ...s.data,
            projects: [
              ...s.data.projects,
              {
                id: generateId(),
                name: '',
                description: '',
                technologies: [],
                bullets: [''],
              } satisfies Project,
            ],
          },
          isDirty: true,
        })),

      updateProject: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) =>
              p.id === id ? { ...p, [field]: value } : p
            ),
          },
          isDirty: true,
        })),

      removeProject: (id) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) },
          isDirty: true,
        })),

      reorderProjects: (from, to) =>
        set((s) => {
          const arr = [...s.data.projects];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { data: { ...s.data, projects: arr }, isDirty: true };
        }),

      addCertification: () =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: [
              ...s.data.certifications,
              {
                id: generateId(),
                name: '',
                issuer: '',
                date: '',
              } satisfies Certification,
            ],
          },
          isDirty: true,
        })),

      updateCertification: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: s.data.certifications.map((c) =>
              c.id === id ? { ...c, [field]: value } : c
            ),
          },
          isDirty: true,
        })),

      removeCertification: (id) =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: s.data.certifications.filter((c) => c.id !== id),
          },
          isDirty: true,
        })),

      addLanguage: () =>
        set((s) => ({
          data: {
            ...s.data,
            languages: [
              ...s.data.languages,
              { id: generateId(), name: '', proficiency: 'Intermediate' } satisfies Language,
            ],
          },
          isDirty: true,
        })),

      updateLanguage: (id, field, value) =>
        set((s) => ({
          data: {
            ...s.data,
            languages: s.data.languages.map((l) =>
              l.id === id ? { ...l, [field]: value } : l
            ),
          },
          isDirty: true,
        })),

      removeLanguage: (id) =>
        set((s) => ({
          data: { ...s.data, languages: s.data.languages.filter((l) => l.id !== id) },
          isDirty: true,
        })),

      setTemplate: (t) =>
        set((s) => ({ settings: { ...s.settings, template: t } })),

      setColorTheme: (id) =>
        set((s) => ({ settings: { ...s.settings, colorThemeId: id } })),

      setFontSize: (size) =>
        set((s) => ({ settings: { ...s.settings, fontSize: size } })),

      toggleSection: (id) =>
        set((s) => ({
          settings: {
            ...s.settings,
            sections: s.settings.sections.map((sec) =>
              sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
            ),
          },
        })),

      reorderSections: (from, to) =>
        set((s) => {
          const arr = [...s.settings.sections];
          const [item] = arr.splice(from, 1);
          arr.splice(to, 0, item);
          return { settings: { ...s.settings, sections: arr } };
        }),

      resetToDefaults: () =>
        set({ data: DEFAULT_RESUME_DATA, settings: DEFAULT_SETTINGS, isDirty: false }),

      loadData: (data) => set({ data, isDirty: false }),
    }),
    { name: 'resume-builder-v2' }
  )
);
