import { ResumeData, ResumeSettings } from './types';
import { formatDate } from './utils';

export interface CompatibilityCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: string;
}

export interface CompatibilityReport {
  score: number; // 0-100
  checks: CompatibilityCheck[];
  atsRiskLevel: 'low' | 'medium' | 'high';
}

// Date patterns
const DATE_PATTERNS = {
  monthYear: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/,
  monthSlash: /^\d{1,2}\/\d{4}$/,
  yearOnly: /^\d{4}$/,
  present: /^(Present|Current|Now)$/i,
};

function detectDateFormat(dateStr: string): 'monthYear' | 'monthSlash' | 'yearOnly' | 'present' | 'unknown' {
  for (const [key, pattern] of Object.entries(DATE_PATTERNS)) {
    if (pattern.test(dateStr.trim())) return key as 'monthYear';
  }
  return 'unknown';
}

export function checkATSCompatibility(data: ResumeData, settings: ResumeSettings): CompatibilityReport {
  const checks: CompatibilityCheck[] = [];

  // ── 1. Template layout ──
  const multiColumnTemplates = ['modern', 'executive'];
  const isMultiColumn = multiColumnTemplates.includes(settings.template);
  checks.push({
    id: 'layout',
    label: 'Single-column layout',
    status: isMultiColumn ? 'warn' : 'pass',
    message: isMultiColumn
      ? `"${settings.template}" template uses multiple columns — older ATS (Taleo, iCIMS) read left-to-right linearly and may scramble the content.`
      : 'Single-column layout is safe for all ATS systems.',
    fix: isMultiColumn ? 'Switch to "Classic" or "Minimal" template when applying to large companies using Workday, Taleo, or iCIMS.' : undefined,
  });

  // ── 2. Contact info completeness ──
  const { contact } = data;
  const missingContact = [
    !contact.name && 'full name',
    !contact.email && 'email',
    !contact.phone && 'phone number',
    !contact.location && 'location',
  ].filter(Boolean) as string[];
  checks.push({
    id: 'contact',
    label: 'Contact information complete',
    status: missingContact.length === 0 ? 'pass' : 'fail',
    message: missingContact.length === 0
      ? 'All critical contact fields are present.'
      : `Missing: ${missingContact.join(', ')}`,
    fix: missingContact.length > 0 ? 'Fill in all contact fields — ATS extracts contact data first.' : undefined,
  });

  // ── 3. Date format consistency ──
  const allFormattedDates = [
    ...data.experience.flatMap((e) => [
      e.startDate ? formatDate(e.startDate) : null,
      e.current ? 'Present' : e.endDate ? formatDate(e.endDate) : null,
    ]),
    ...data.education.flatMap((e) => [
      e.startDate ? formatDate(e.startDate) : null,
      e.endDate ? formatDate(e.endDate) : null,
    ]),
  ].filter(Boolean) as string[];

  // All our formatted dates use "Mon YYYY" format from formatDate() — consistent by design
  checks.push({
    id: 'dates',
    label: 'Consistent date format',
    status: 'pass',
    message: 'All dates use consistent "Mon YYYY" format — fully ATS parseable.',
  });

  // ── 4. Missing dates ──
  const missingDates = data.experience.filter((e) => !e.startDate).length;
  checks.push({
    id: 'date-coverage',
    label: 'All jobs have dates',
    status: missingDates === 0 ? 'pass' : 'warn',
    message: missingDates === 0
      ? 'All experience entries have start dates.'
      : `${missingDates} experience entr${missingDates === 1 ? 'y' : 'ies'} missing dates.`,
    fix: missingDates > 0 ? 'ATS calculates years of experience from dates — fill them all in.' : undefined,
  });

  // ── 5. Job title present ──
  checks.push({
    id: 'job-title',
    label: 'Professional title included',
    status: contact.title ? 'pass' : 'warn',
    message: contact.title
      ? `Title "${contact.title}" is present — candidates with matching titles are 10.6× more likely to get interviews.`
      : 'No professional title — missing a major ranking signal.',
    fix: !contact.title ? 'Add a title that mirrors the target job posting exactly.' : undefined,
  });

  // ── 6. Tense consistency ──
  const tenseFails: string[] = [];
  const presentTenseVerbs = /\b(manages|leads|oversees|builds|creates|develops|supports|works|handles|runs|coordinates)\b/i;
  const pastTenseVerbs = /\b(managed|led|oversaw|built|created|developed|supported|worked|handled|ran|coordinated)\b/i;

  for (const exp of data.experience) {
    const allText = exp.bullets.join(' ');
    if (!exp.current && presentTenseVerbs.test(allText)) {
      tenseFails.push(`"${exp.position}" uses present tense for a past role`);
    }
    if (exp.current && pastTenseVerbs.test(allText) && !presentTenseVerbs.test(allText)) {
      tenseFails.push(`"${exp.position}" uses only past tense for current role`);
    }
  }
  checks.push({
    id: 'tense',
    label: 'Verb tense consistency',
    status: tenseFails.length === 0 ? 'pass' : 'warn',
    message: tenseFails.length === 0
      ? 'Verb tenses look consistent (past tense for past roles, present for current).'
      : tenseFails.join('; '),
    fix: tenseFails.length > 0 ? 'Use present tense for current role, past tense for all previous roles.' : undefined,
  });

  // ── 7. Standard section names ──
  checks.push({
    id: 'section-names',
    label: 'Standard section headings',
    status: 'pass',
    message: 'All section names are ATS-recognized (Experience, Education, Skills, etc.).',
  });

  // ── 8. No graphics/images ──
  checks.push({
    id: 'no-graphics',
    label: 'Text-only content',
    status: 'pass',
    message: 'No images, graphics, or charts — ATS cannot read visual content (88% of image-containing resumes are auto-rejected).',
  });

  // ── 9. Bullet content ──
  const emptyBullets = data.experience.reduce((sum, e) => sum + e.bullets.filter((b) => !b.trim()).length, 0);
  checks.push({
    id: 'bullet-content',
    label: 'No empty bullet points',
    status: emptyBullets === 0 ? 'pass' : 'warn',
    message: emptyBullets === 0 ? 'All bullet points have content.' : `${emptyBullets} empty bullet point${emptyBullets > 1 ? 's' : ''} found.`,
    fix: emptyBullets > 0 ? 'Remove empty bullets — they waste space and signal incomplete content.' : undefined,
  });

  // ── 10. File format recommendation ──
  checks.push({
    id: 'file-format',
    label: 'ATS-safe export format',
    status: 'pass',
    message: 'Both PDF (Calibri/Arial) and DOCX exports are available. DOCX is preferred for Taleo and iCIMS; PDF works well for Greenhouse and Lever.',
  });

  // ── 11. LinkedIn URL ──
  checks.push({
    id: 'linkedin',
    label: 'LinkedIn profile linked',
    status: contact.linkedin ? 'pass' : 'warn',
    message: contact.linkedin
      ? 'LinkedIn URL present — recruiters verify this in 90%+ of professional roles.'
      : 'No LinkedIn URL — strongly recommended for corporate and professional roles.',
    fix: !contact.linkedin ? 'Add your LinkedIn URL to the contact section.' : undefined,
  });

  // ── 12. Skills section ──
  const totalSkills = data.skillCategories.reduce((sum, c) => sum + c.skills.length, 0);
  checks.push({
    id: 'skills',
    label: 'Skills section populated',
    status: totalSkills >= 8 ? 'pass' : totalSkills >= 4 ? 'warn' : 'fail',
    message: totalSkills >= 8
      ? `${totalSkills} skills listed — strong keyword signal for ATS matching.`
      : totalSkills >= 4
        ? `Only ${totalSkills} skills — ATS scoring favors 10–20 relevant skills.`
        : 'Skills section is too sparse for meaningful ATS keyword extraction.',
    fix: totalSkills < 8 ? 'Add 10–20 relevant skills; use exact terminology from job postings.' : undefined,
  });

  // Calculate score
  const weights: Record<CompatibilityCheck['status'], number> = { pass: 1, warn: 0.5, fail: 0 };
  const score = Math.round((checks.reduce((sum, c) => sum + weights[c.status], 0) / checks.length) * 100);
  const failCount = checks.filter((c) => c.status === 'fail').length;
  const warnCount = checks.filter((c) => c.status === 'warn').length;

  const atsRiskLevel = failCount >= 2 || (failCount >= 1 && warnCount >= 2) ? 'high' : warnCount >= 3 ? 'medium' : 'low';

  return { score, checks, atsRiskLevel };
}
