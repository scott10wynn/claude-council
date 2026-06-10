import { ResumeData, ResumeSettings, Section } from './types';

export const DEFAULT_SECTIONS: Section[] = [
  { id: 'summary', label: 'Professional Summary', enabled: true },
  { id: 'experience', label: 'Work Experience', enabled: true },
  { id: 'education', label: 'Education', enabled: true },
  { id: 'skills', label: 'Skills', enabled: true },
  { id: 'projects', label: 'Projects', enabled: true },
  { id: 'certifications', label: 'Certifications', enabled: true },
  { id: 'languages', label: 'Languages', enabled: false },
];

export const DEFAULT_RESUME_DATA: ResumeData = {
  contact: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
  },
  summary:
    'Results-driven software engineer with 6+ years of experience building scalable web applications and distributed systems. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Led teams of 3–5 engineers across multiple successful product launches.',
  experience: [
    {
      id: 'exp1',
      company: 'Acme Technologies',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: '',
      current: true,
      bullets: [
        'Architected and deployed a microservices platform reducing API latency by 40% and serving 2M+ daily users',
        'Led migration from monolith to serverless architecture, cutting infrastructure costs by $120K/year',
        'Mentored 4 junior engineers and conducted 50+ technical interviews, improving team velocity by 30%',
        'Designed real-time data pipeline processing 500K events/hour using Kafka and Apache Flink',
      ],
    },
    {
      id: 'exp2',
      company: 'StartupCo',
      position: 'Software Engineer',
      location: 'Remote',
      startDate: '2018-08',
      endDate: '2021-05',
      current: false,
      bullets: [
        'Built core product features in React and Node.js that contributed to $5M Series A funding round',
        'Reduced page load time by 60% through code splitting, lazy loading, and CDN optimization',
        'Implemented CI/CD pipelines with GitHub Actions, decreasing deployment time from 2 hours to 15 minutes',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
      honors: 'Magna Cum Laude',
    },
  ],
  skillCategories: [
    {
      id: 'sk1',
      name: 'Languages',
      skills: ['TypeScript', 'Python', 'Go', 'Rust', 'SQL'],
    },
    {
      id: 'sk2',
      name: 'Frontend',
      skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'GraphQL'],
    },
    {
      id: 'sk3',
      name: 'Backend & Cloud',
      skills: ['Node.js', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: 'OpenSource CLI Toolkit',
      description: 'A developer productivity CLI with 2,000+ GitHub stars',
      technologies: ['Go', 'Cobra', 'GitHub API'],
      github: 'github.com/alexjohnson/cli-toolkit',
      url: '',
      bullets: [
        'Built cross-platform CLI tool that automates common dev workflows, saving teams 2+ hours/week',
        'Grew to 2,000+ GitHub stars organically through developer community engagement',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'AWS Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2022-09',
      expiry: '2025-09',
    },
    {
      id: 'cert2',
      name: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: '2023-03',
    },
  ],
  languages: [
    { id: 'lang1', name: 'English', proficiency: 'Native' },
    { id: 'lang2', name: 'Spanish', proficiency: 'Proficient' },
  ],
};

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'modern',
  colorThemeId: 'blue',
  sections: DEFAULT_SECTIONS,
  fontSize: 'md',
};
