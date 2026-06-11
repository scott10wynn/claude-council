import { ResumeData, ResumeSettings, Section } from './types';

export const DEFAULT_SECTIONS: Section[] = [
  { id: 'summary', label: 'Professional Summary', enabled: true },
  { id: 'experience', label: 'Work Experience', enabled: true },
  { id: 'education', label: 'Education', enabled: true },
  { id: 'skills', label: 'Skills', enabled: true },
  { id: 'projects', label: 'Extracurriculars', enabled: true },
  { id: 'certifications', label: 'Certifications', enabled: false },
  { id: 'languages', label: 'Languages', enabled: false },
];

export const DEFAULT_RESUME_DATA: ResumeData = {
  contact: {
    name: 'Scott Wynn',
    title: 'Finance Student | Supply Chain & Operations',
    email: 'scott10wynn@icloud.com',
    phone: '(440) 520-9048',
    location: 'Willoughby, OH 44094',
    website: '',
    linkedin: '',
    github: '',
  },
  summary:
    'Finance student at Cleveland State University with hands-on supply chain experience at a multi-million dollar motor vehicle parts wholesaler. Proven leadership background as a two-sport high school team captain and retail supervisor. Skilled in Excel-based data analysis, procurement research, and inventory planning, with a track record of identifying cost-saving opportunities and driving operational improvements.',
  experience: [
    {
      id: 'exp1',
      company: 'Buyers Products',
      position: 'Supply Chain Management Intern',
      location: 'Mentor, OH',
      startDate: '2026-06',
      endDate: '2026-08',
      current: false,
      bullets: [
        'Identified tariff-driven sourcing inefficiencies across three part categories through data analysis; recommended alternative sourcing strategies that reduced component costs by 60%.',
        'Created and maintained RFQ sheets to collect and compare supplier quotes; analyzed inventory data in Excel to identify pricing trends, flag potential stockouts, and support demand forecasting with the operations team.',
        'Supported procurement and inventory planning by tracking purchase orders, monitoring supplier lead times, and flagging discrepancies to senior staff to ensure accurate and timely fulfillment.',
        'Assisted in evaluating manufacturing plant sourcing options by analyzing cost and shipping time variables to determine the most efficient procurement pathway for individual part categories.',
        'Collaborated with operations and warehouse teams to streamline fulfillment workflows, improve order accuracy, and reduce processing delays across the supply chain.',
      ],
    },
    {
      id: 'exp2',
      company: 'Soccer Village',
      position: 'Senior Shift Supervisor',
      location: 'Cleveland, OH',
      startDate: '2023-11',
      endDate: '',
      current: true,
      bullets: [
        'Supervised daily floor operations and ensured consistent execution of store standards, product placement, and customer service expectations across all shift personnel.',
        'Trained and mentored sales associates on product knowledge, customer engagement, and operational responsibilities, building a high-performing and accountable team culture.',
        'Coached two associates through transitions into leadership roles by providing structured guidance on team management, shift oversight, and handling escalated customer situations.',
        'Built lasting customer relationships through personalized service and follow-up, driving repeat business and strengthening brand loyalty within the local market.',
      ],
    },
    {
      id: 'exp3',
      company: 'Willoughby Recreational Baseball League',
      position: 'Umpire',
      location: 'Willoughby, OH',
      startDate: '2023-06',
      endDate: '2023-08',
      current: false,
      bullets: [
        'Officiated competitive youth and recreational baseball games, applying comprehensive knowledge of rulebooks to deliver accurate and timely calls in fast-paced, high-pressure environments.',
        'Maintained firm and consistent rulings under sustained pushback from coaches and players while defusing confrontations calmly and decisively without compromising game integrity or control.',
      ],
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'Cleveland State University',
      degree: 'Bachelor of Business Administration',
      field: 'Finance',
      location: 'Cleveland, OH',
      startDate: '2025-08',
      endDate: '2028-05',
      gpa: '',
      honors: 'Expected May 2028',
    },
    {
      id: 'edu2',
      institution: 'South High School',
      degree: 'High School Honors Diploma',
      field: '',
      location: 'Willoughby, OH',
      startDate: '2021-08',
      endDate: '2025-05',
      gpa: '',
      honors: '',
    },
  ],
  skillCategories: [
    {
      id: 'sk1',
      name: 'Technical',
      skills: ['Microsoft Excel', 'Microsoft Word', 'PowerPoint', 'Google Workspace'],
    },
    {
      id: 'sk2',
      name: 'Business & Analytics',
      skills: ['Data Analysis', 'Supply Chain Management', 'Inventory Planning', 'Procurement', 'Demand Forecasting', 'RFQ Management'],
    },
    {
      id: 'sk3',
      name: 'Interpersonal',
      skills: ['Leadership', 'Customer Service', 'Team Management', 'Sales', 'Coaching & Mentoring'],
    },
  ],
  projects: [
    {
      id: 'proj1',
      name: "Willoughby South Boys' Soccer",
      description: 'Varsity Team Captain',
      technologies: [],
      url: '',
      github: '',
      bullets: [
        'Elected Team Captain senior year; led structured practices, designed skill-specific drills from game film review, and mentored younger athletes on skill development and team culture.',
        'Motivated teammates through high-performance stretches and adversity, fostering a competitive and inclusive environment that supported individual growth and collective improvement.',
      ],
    },
    {
      id: 'proj2',
      name: "Willoughby South Boys' Lacrosse",
      description: 'Varsity Team Captain',
      technologies: [],
      url: '',
      github: '',
      bullets: [
        'Served as Team Captain junior and senior year; led position-specific practice sessions for midfielders and attackers, focusing on skill refinement and set play execution drawn from film analysis.',
        'Collaborated with coaches to communicate expectations, deliver constructive feedback, and maintain the competitive standards required for program success across two consecutive seasons.',
      ],
    },
  ],
  certifications: [],
  languages: [],
};

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'classic',
  colorThemeId: 'blue',
  sections: DEFAULT_SECTIONS,
  fontSize: 'md',
};
