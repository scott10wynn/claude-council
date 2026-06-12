// Curated ATS keyword bank by domain — used for suggestions and gap analysis

export const ACTION_VERBS: Record<string, string[]> = {
  Leadership: [
    'Led', 'Managed', 'Directed', 'Supervised', 'Oversaw', 'Spearheaded', 'Championed',
    'Orchestrated', 'Coached', 'Mentored', 'Guided', 'Developed', 'Cultivated', 'Empowered',
  ],
  Achievement: [
    'Achieved', 'Exceeded', 'Surpassed', 'Delivered', 'Accomplished', 'Attained', 'Earned',
    'Secured', 'Won', 'Reached', 'Drove', 'Boosted', 'Grew', 'Increased',
  ],
  Analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Identified', 'Audited', 'Diagnosed',
    'Examined', 'Researched', 'Measured', 'Tracked', 'Monitored', 'Reviewed', 'Forecasted',
  ],
  Building: [
    'Built', 'Created', 'Designed', 'Developed', 'Engineered', 'Established', 'Founded',
    'Launched', 'Implemented', 'Introduced', 'Deployed', 'Produced', 'Constructed', 'Architected',
  ],
  Improvement: [
    'Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Modernized', 'Transformed', 'Revamped',
    'Overhauled', 'Reduced', 'Eliminated', 'Automated', 'Accelerated', 'Scaled', 'Simplified',
  ],
  Collaboration: [
    'Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Liaised', 'Aligned',
    'Negotiated', 'Presented', 'Communicated', 'Advised', 'Consulted', 'Engaged',
  ],
  Finance: [
    'Forecasted', 'Budgeted', 'Reconciled', 'Audited', 'Allocated', 'Managed', 'Controlled',
    'Reduced', 'Generated', 'Secured', 'Calculated', 'Projected', 'Reported', 'Modeled',
  ],
  Sales: [
    'Sold', 'Generated', 'Closed', 'Prospected', 'Cultivated', 'Converted', 'Expanded',
    'Retained', 'Acquired', 'Upsold', 'Negotiated', 'Pitched', 'Grew',
  ],
};

export const WEAK_PHRASES: { phrase: string; suggestion: string }[] = [
  { phrase: 'responsible for', suggestion: 'Replace with a strong action verb (e.g., "Managed", "Led", "Oversaw")' },
  { phrase: 'helped with', suggestion: 'Quantify your contribution — what specifically did you do?' },
  { phrase: 'assisted with', suggestion: 'Be specific — what was your role? Use a direct action verb' },
  { phrase: 'assisted in', suggestion: 'Be specific — what was your role? Use a direct action verb' },
  { phrase: 'worked on', suggestion: 'Replace with a specific action verb that shows your contribution' },
  { phrase: 'was involved in', suggestion: 'Describe what you actually did with a strong verb' },
  { phrase: 'duties included', suggestion: 'Lead with accomplishments, not job duties' },
  { phrase: 'tasked with', suggestion: 'Start with what you did, not what you were told to do' },
  { phrase: 'tried to', suggestion: 'Remove — state what you actually accomplished' },
  { phrase: 'helped to', suggestion: 'Take ownership — use "Led", "Built", "Created" etc.' },
  { phrase: 'participated in', suggestion: 'Describe your specific contribution more directly' },
  { phrase: 'was part of', suggestion: 'Show your individual impact with a direct action verb' },
];

export const ATS_STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'into', 'through', 'during', 'including', 'until', 'while',
  'per', 'than', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'can', 'that', 'this', 'these', 'those', 'i', 'we', 'you', 'he', 'she',
  'it', 'they', 'their', 'our', 'your', 'my', 'its', 'us', 'them', 'who', 'which',
  'what', 'when', 'where', 'how', 'all', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'also', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'about', 'up', 'out', 'if', 'then', 'any', 'new', 'no',
]);

export const STANDARD_SECTION_NAMES: Record<string, string[]> = {
  experience: ['work experience', 'professional experience', 'experience', 'employment', 'career history', 'work history'],
  education: ['education', 'academic background', 'academic history', 'qualifications'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise', 'competencies'],
  summary: ['summary', 'professional summary', 'profile', 'objective', 'about me', 'overview'],
  projects: ['projects', 'key projects', 'personal projects', 'extracurriculars'],
  certifications: ['certifications', 'certificates', 'credentials', 'licenses'],
};
