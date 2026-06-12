import { ResumeData, ATSScore } from './types';
import { analyzeBullet } from './bullet-analyzer';
import { WEAK_PHRASES } from './keywords';

export function calculateATSScore(data: ResumeData): ATSScore {
  const suggestions: string[] = [];

  // ── Contact (max 20) ──
  let contactScore = 0;
  const { contact } = data;
  if (contact.name) contactScore += 5;
  if (contact.email) contactScore += 5;
  if (contact.phone) contactScore += 4;
  if (contact.location) contactScore += 3;
  if (contact.linkedin) contactScore += 2;
  if (contact.title) contactScore += 1;
  if (!contact.name) suggestions.push('Add your full name');
  if (!contact.email) suggestions.push('Add a professional email address');
  if (!contact.phone) suggestions.push('Add a phone number');
  if (!contact.linkedin) suggestions.push('Add your LinkedIn profile URL');
  if (!contact.title) suggestions.push('Add a professional title matching your target role (boosts interviews by 10.6×)');

  // ── Summary (max 15) ──
  let summaryScore = 0;
  if (data.summary.length > 50) summaryScore += 5;
  if (data.summary.length > 150) summaryScore += 5;
  if (data.summary.length > 250) summaryScore += 5;
  if (!data.summary) suggestions.push('Add a professional summary — it\'s the first thing ATS reads');
  else if (data.summary.length < 100) suggestions.push('Expand your summary to 3–5 sentences with relevant keywords');

  // ── Experience (max 30) ──
  let experienceScore = 0;
  if (data.experience.length === 0) {
    suggestions.push('Add at least one work experience entry');
  } else {
    // Quantity
    experienceScore += Math.min(data.experience.length * 4, 12);

    // Bullet quality via bullet analyzer
    const allBullets = data.experience.flatMap((e) => e.bullets.filter(Boolean));
    if (allBullets.length > 0) {
      const avgBulletScore = allBullets.reduce((s, b) => s + analyzeBullet(b).score, 0) / allBullets.length;
      experienceScore += Math.round((avgBulletScore / 100) * 12);

      if (avgBulletScore < 50) suggestions.push('Strengthen your bullet points with action verbs and quantified results');
    }

    // Dates complete
    const allHaveDates = data.experience.every((e) => e.startDate);
    if (allHaveDates) experienceScore += 4;
    else suggestions.push('Add start/end dates to all experience entries — ATS calculates total years from these');

    // Metrics
    const hasMetrics = data.experience.some((e) => e.bullets.some((b) => /\d+/.test(b)));
    if (hasMetrics) experienceScore += 2;
    else suggestions.push('Quantify at least one achievement (%, $, team size, time saved)');
  }

  // ── Education (max 15) ──
  let educationScore = 0;
  if (data.education.length === 0) {
    suggestions.push('Add your education history');
  } else {
    educationScore += 8;
    const hasFullDetails = data.education.some((e) => e.degree && e.institution);
    if (hasFullDetails) educationScore += 5;
    const hasDates = data.education.every((e) => e.endDate || e.honors?.toLowerCase().includes('expected'));
    if (hasDates) educationScore += 2;
  }

  // ── Skills (max 15) ──
  let skillsScore = 0;
  const allSkills = data.skillCategories.flatMap((c) => c.skills);
  if (allSkills.length === 0) {
    suggestions.push('Add a Skills section — it\'s the primary keyword extraction target for ATS');
  } else if (allSkills.length < 5) {
    skillsScore += 5;
    suggestions.push('Add more skills (10–20 is optimal; mirror exact terms from job postings)');
  } else if (allSkills.length < 10) {
    skillsScore += 10;
    suggestions.push('Add a few more skills to reach the 10–20 sweet spot');
  } else {
    skillsScore += 15;
  }

  // ── Format / completeness (max 5) ──
  let formatScore = 0;
  if (data.experience.length > 0) formatScore++;
  if (data.education.length > 0) formatScore++;
  if (allSkills.length >= 5) formatScore++;
  if (data.summary.length > 100) formatScore++;
  if (data.certifications.length > 0 || data.projects.length > 0) formatScore++;

  const total = Math.min(contactScore + summaryScore + experienceScore + educationScore + skillsScore + formatScore, 100);

  return {
    total,
    breakdown: {
      contact: Math.min(contactScore, 20),
      summary: Math.min(summaryScore, 15),
      experience: Math.min(experienceScore, 30),
      education: Math.min(educationScore, 15),
      skills: Math.min(skillsScore, 15),
      format: Math.min(formatScore, 5),
    },
    suggestions: suggestions.slice(0, 5),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#15803d';
  if (score >= 60) return '#d97706';
  return '#dc2626';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}
